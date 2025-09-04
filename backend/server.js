// Pure Life Compass Quiz - Backend API Server
// Always Works™ Implementation with Go High Level Integration

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const compression = require('compression');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Winston Logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { success: false, error: 'Rate limit exceeded. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// GHL Configuration
const GHL_CONFIG = {
    apiUrl: process.env.GHL_API_URL || 'https://rest.gohighlevel.com/v1',
    apiKey: process.env.GHL_API_KEY,
    locationId: process.env.GHL_LOCATION_ID,
    pipelineId: process.env.GHL_PIPELINE_ID,
    pipelineStageId: process.env.GHL_PIPELINE_STAGE_ID,
    workflows: {
        DREAMER: process.env.GHL_DREAMER_WORKFLOW_ID,
        BUILDER: process.env.GHL_BUILDER_WORKFLOW_ID,
        DRIVER: process.env.GHL_DRIVER_WORKFLOW_ID,
        LEADER: process.env.GHL_LEADER_WORKFLOW_ID
    }
};

// Backup storage for failed submissions
const backupStorage = {
    submissions: [],
    add: function(submission) {
        this.submissions.push({
            ...submission,
            timestamp: Date.now(),
            id: uuidv4()
        });
        logger.info('Submission added to backup storage', { submissionId: submission.id });
    },
    getAll: function() {
        return this.submissions;
    }
};

// Health Check Endpoint
app.get('/api/health-check', (req, res) => {
    const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            api: 'operational',
            ghl_connection: GHL_CONFIG.apiKey ? 'configured' : 'not_configured',
            backup_storage: 'operational'
        }
    };
    
    res.status(200).json(healthStatus);
});

// Validation Rules
const quizValidationRules = () => {
    return [
        body('contact.firstName').trim().isLength({ min: 1, max: 50 }).escape(),
        body('contact.lastName').trim().isLength({ min: 1, max: 50 }).escape(),
        body('contact.email').isEmail().normalizeEmail(),
        body('contact.phone').optional().isMobilePhone(),
        body('contact.customFields.quiz_score').isInt({ min: 0, max: 75 }),
        body('contact.customFields.result_type').isIn(['DREAMER', 'BUILDER', 'DRIVER', 'LEADER']),
        body('contact.customFields.section_scores').isObject(),
        body('contact.tags').isArray({ min: 1 })
    ];
};

// Helper function to create GHL contact
async function createGHLContact(contactData) {
    const requestId = uuidv4();
    
    try {
        logger.info('Creating GHL contact', { requestId, email: contactData.email });
        
        const ghlPayload = {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone || '',
            tags: contactData.tags,
            customFields: [
                {
                    key: 'quiz_score',
                    field_value: contactData.customFields.quiz_score.toString()
                },
                {
                    key: 'result_type',
                    field_value: contactData.customFields.result_type
                },
                {
                    key: 'section_scores',
                    field_value: JSON.stringify(contactData.customFields.section_scores)
                },
                {
                    key: 'completion_date',
                    field_value: contactData.customFields.completion_date || new Date().toISOString()
                },
                {
                    key: 'referrer_source',
                    field_value: contactData.customFields.referrer_source || 'quiz'
                }
            ]
        };
        
        if (GHL_CONFIG.pipelineId) {
            ghlPayload.pipelineId = GHL_CONFIG.pipelineId;
        }
        if (GHL_CONFIG.pipelineStageId) {
            ghlPayload.pipelineStageId = GHL_CONFIG.pipelineStageId;
        }
        
        const response = await axios.post(
            `${GHL_CONFIG.apiUrl}/contacts/`,
            ghlPayload,
            {
                headers: {
                    'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        logger.info('GHL contact created successfully', { 
            requestId, 
            contactId: response.data.contact.id,
            email: contactData.email 
        });
        
        return response.data.contact;
        
    } catch (error) {
        logger.error('GHL contact creation failed', {
            requestId,
            error: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
}

// Helper function to trigger GHL workflow
async function triggerGHLWorkflow(contactId, resultType, eventData) {
    const workflowId = GHL_CONFIG.workflows[resultType];
    
    if (!workflowId) {
        logger.warn('No workflow configured for result type', { resultType });
        return null;
    }
    
    try {
        const response = await axios.post(
            `${GHL_CONFIG.apiUrl}/workflows/${workflowId}/triggers`,
            {
                contactId: contactId,
                eventData: {
                    quiz_result_type: resultType,
                    ...eventData
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        logger.info('Workflow triggered successfully', { 
            contactId, 
            resultType, 
            workflowId 
        });
        
        return response.data;
        
    } catch (error) {
        logger.error('Workflow trigger failed', {
            contactId,
            resultType,
            workflowId,
            error: error.message
        });
        // Don't throw - workflow failure shouldn't break contact creation
        return null;
    }
}

// Main Quiz Submission Endpoint
app.post('/api/submit-quiz', quizValidationRules(), async (req, res) => {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    logger.info('Quiz submission received', { requestId });
    
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed', { requestId, errors: errors.array() });
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        
        const { contact, metadata } = req.body;
        
        // Always Works™ Protocol: Add to backup storage first
        backupStorage.add({ contact, metadata, requestId });
        
        if (!GHL_CONFIG.apiKey) {
            logger.warn('GHL not configured, submission stored for backup', { requestId });
            return res.status(200).json({
                success: true,
                contact_id: `backup_${requestId}`,
                message: 'Submission stored (GHL not configured)',
                processing_time: Date.now() - startTime
            });
        }
        
        // Create contact in GHL
        const ghlContact = await createGHLContact(contact);
        
        // Trigger appropriate workflow
        const workflowResult = await triggerGHLWorkflow(
            ghlContact.id, 
            contact.customFields.result_type,
            {
                quiz_score: contact.customFields.quiz_score,
                section_scores: contact.customFields.section_scores
            }
        );
        
        const processingTime = Date.now() - startTime;
        
        logger.info('Quiz submission completed successfully', { 
            requestId, 
            contactId: ghlContact.id,
            processingTime 
        });
        
        res.status(200).json({
            success: true,
            contact_id: ghlContact.id,
            workflow_triggered: workflowResult ? true : false,
            processing_time: processingTime
        });
        
    } catch (error) {
        const processingTime = Date.now() - startTime;
        
        logger.error('Quiz submission failed', {
            requestId,
            error: error.message,
            processingTime
        });
        
        res.status(500).json({
            success: false,
            error: 'Submission failed',
            message: 'Please try again. Your information has been saved.',
            request_id: requestId,
            processing_time: processingTime
        });
    }
});

// Test GHL Connection Endpoint
app.post('/api/test-ghl', async (req, res) => {
    const requestId = uuidv4();
    
    try {
        if (!GHL_CONFIG.apiKey) {
            return res.status(500).json({
                success: false,
                message: 'GHL API key not configured'
            });
        }
        
        // Test with minimal contact data
        const testContact = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            tags: ['Test'],
            customFields: [
                { key: 'quiz_score', field_value: '25' },
                { key: 'result_type', field_value: 'DREAMER' }
            ]
        };
        
        const response = await axios.post(
            `${GHL_CONFIG.apiUrl}/contacts/`,
            testContact,
            {
                headers: {
                    'Authorization': `Bearer ${GHL_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
        
        logger.info('GHL test successful', { requestId, contactId: response.data.contact.id });
        
        res.status(200).json({
            success: true,
            contact_id: response.data.contact.id,
            message: 'GHL connection successful'
        });
        
    } catch (error) {
        logger.error('GHL test failed', { requestId, error: error.message });
        
        res.status(500).json({
            success: false,
            message: 'GHL connection failed',
            error: error.message
        });
    }
});

// Backup Data Retrieval (for debugging)
app.get('/api/backup-submissions', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }
    
    res.status(200).json({
        submissions: backupStorage.getAll(),
        count: backupStorage.submissions.length
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Please try again later'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Always Works™ Quiz API Server running on port ${PORT}`);
    logger.info('GHL Integration:', GHL_CONFIG.apiKey ? 'Configured' : 'Not Configured');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

module.exports = app;