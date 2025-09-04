// Pure Life Compass Quiz - GHL Integration
// Always Works™ implementation with comprehensive error handling

class GHLIntegration {
    constructor() {
        this.apiEndpoint = this.getApiEndpoint();
        this.retryAttempts = 3;
        this.retryDelay = 1000; // Start with 1 second
        this.maxRetryDelay = 10000; // Max 10 seconds
        
        console.log('🔗 GHL Integration initialized with endpoint:', this.apiEndpoint);
    }
    
    getApiEndpoint() {
        // Determine API endpoint based on environment
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000/api/submit-quiz';
        }
        
        // Production endpoint - update this with your actual production API URL
        return 'https://your-production-api.com/api/submit-quiz';
    }
    
    async submitToGHL(quizData, userInfo, results) {
        console.log('📤 Starting GHL submission process...');
        
        const payload = this.buildPayload(quizData, userInfo, results);
        console.log('📦 Payload prepared:', payload);
        
        let lastError = null;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${this.retryAttempts}...`);
                
                const response = await this.makeRequest(payload, attempt);
                
                console.log('✅ GHL submission successful:', response);
                return {
                    success: true,
                    data: response,
                    attempt: attempt
                };
                
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    const delay = this.calculateRetryDelay(attempt);
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await this.sleep(delay);
                } else {
                    console.error('❌ All retry attempts failed');
                }
            }
        }
        
        // All retries failed - handle gracefully
        return this.handleFailure(payload, lastError);
    }
    
    buildPayload(quizData, userInfo, results) {
        return {
            contact: {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phone: userInfo.phone || '',
                tags: results.persona.tags,
                customFields: {
                    quiz_score: results.totalScore,
                    result_type: results.persona.type,
                    section_scores: results.sectionScores,
                    completion_date: results.completionDate,
                    referrer_source: this.getReferrerSource(),
                    time_taken_seconds: results.timeTaken,
                    personalized_message: results.persona.personalizedMessage,
                    strongest_section: this.getStrongestSection(results.sectionScores),
                    weakest_section: this.getWeakestSection(results.sectionScores),
                    quiz_version: '1.0'
                }
            },
            metadata: {
                quiz_version: '1.0',
                timestamp: Date.now(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                referrer: document.referrer,
                page_url: window.location.href,
                session_id: this.getSessionId()
            }
        };
    }
    
    async makeRequest(payload, attempt) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Retry-Attempt': attempt.toString(),
                    'X-Request-ID': this.generateRequestId()
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
            }
            
            return await response.json();
            
        } finally {
            clearTimeout(timeoutId);
        }
    }
    
    calculateRetryDelay(attempt) {
        // Exponential backoff with jitter
        const baseDelay = this.retryDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 1000; // Add up to 1 second of jitter
        const delay = Math.min(baseDelay + jitter, this.maxRetryDelay);
        return Math.round(delay);
    }
    
    async handleFailure(payload, error) {
        console.error('💥 GHL submission completely failed:', error);
        
        // Store locally as backup
        this.storeBackup(payload, error);
        
        // Try to notify user gracefully
        return {
            success: false,
            error: error.message,
            backup_stored: true,
            request_id: this.generateRequestId()
        };
    }
    
    storeBackup(payload, error) {
        try {
            const backup = {
                payload,
                error: {
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                },
                retry_info: {
                    attempts: this.retryAttempts,
                    final_attempt_time: new Date().toISOString()
                }
            };
            
            const storageKey = `ghl_backup_${Date.now()}_${this.generateRequestId()}`;
            localStorage.setItem(storageKey, JSON.stringify(backup));
            
            console.log('💾 Backup stored locally:', storageKey);
            
            // Also try to send backup to alternative endpoint (if configured)
            this.sendToBackupEndpoint(backup);
            
        } catch (storageError) {
            console.error('❌ Failed to store backup:', storageError);
        }
    }
    
    async sendToBackupEndpoint(backup) {
        // This could send to a backup service, analytics endpoint, etc.
        // For now, just log it
        console.log('📋 Backup prepared for alternative storage:', backup);
    }
    
    // Utility functions
    getReferrerSource() {
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check URL parameters first
        if (urlParams.get('source')) return urlParams.get('source');
        if (urlParams.get('utm_source')) return urlParams.get('utm_source');
        if (urlParams.get('ref')) return urlParams.get('ref');
        
        // Check referrer
        if (referrer) {
            if (referrer.includes('google')) return 'google';
            if (referrer.includes('facebook')) return 'facebook';
            if (referrer.includes('instagram')) return 'instagram';
            if (referrer.includes('linkedin')) return 'linkedin';
            if (referrer.includes('twitter')) return 'twitter';
            if (referrer.includes('youtube')) return 'youtube';
            return 'referral';
        }
        
        return 'direct';
    }
    
    getStrongestSection(sectionScores) {
        return Object.keys(sectionScores).reduce((a, b) => 
            sectionScores[a] > sectionScores[b] ? a : b
        );
    }
    
    getWeakestSection(sectionScores) {
        return Object.keys(sectionScores).reduce((a, b) => 
            sectionScores[a] < sectionScores[b] ? a : b
        );
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('pure_life_session_id');
        if (!sessionId) {
            sessionId = this.generateRequestId();
            sessionStorage.setItem('pure_life_session_id', sessionId);
        }
        return sessionId;
    }
    
    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Health check method
    async checkHealth() {
        try {
            const healthEndpoint = this.apiEndpoint.replace('/submit-quiz', '/health-check');
            const response = await fetch(healthEndpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const health = await response.json();
                console.log('✅ GHL API health check passed:', health);
                return { healthy: true, data: health };
            } else {
                console.warn('⚠️ GHL API health check failed:', response.status);
                return { healthy: false, status: response.status };
            }
        } catch (error) {
            console.error('❌ GHL API health check error:', error);
            return { healthy: false, error: error.message };
        }
    }
    
    // Get stored backups (for debugging)
    getStoredBackups() {
        const backups = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ghl_backup_')) {
                try {
                    const backup = JSON.parse(localStorage.getItem(key));
                    backups.push({ key, ...backup });
                } catch (error) {
                    console.warn('Failed to parse backup:', key, error);
                }
            }
        }
        return backups;
    }
    
    // Clear old backups (run periodically)
    clearOldBackups(daysOld = 7) {
        const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ghl_backup_')) {
                // Extract timestamp from key
                const match = key.match(/ghl_backup_(\d+)_/);
                if (match) {
                    const timestamp = parseInt(match[1]);
                    if (timestamp < cutoffTime) {
                        localStorage.removeItem(key);
                        console.log('🗑️ Cleaned up old backup:', key);
                    }
                }
            }
        }
    }
}

// Initialize GHL integration
const ghlIntegration = new GHLIntegration();

// Expose for debugging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.ghlDebug = {
        integration: ghlIntegration,
        checkHealth: () => ghlIntegration.checkHealth(),
        getBackups: () => ghlIntegration.getStoredBackups(),
        clearBackups: (days) => ghlIntegration.clearOldBackups(days)
    };
    console.log('🛠️ GHL debug tools available at window.ghlDebug');
}