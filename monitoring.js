/**
 * Pure Life Compass Quiz - Production Monitoring & Health Checks
 * Comprehensive monitoring system for production deployment
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

class ProductionMonitor {
    constructor(config = {}) {
        this.config = {
            baseUrl: config.baseUrl || 'http://localhost:3000',
            interval: config.interval || 30000, // 30 seconds
            timeout: config.timeout || 5000, // 5 seconds
            logFile: config.logFile || 'monitoring.log',
            alertThresholds: {
                responseTime: config.alertThresholds?.responseTime || 1000, // 1 second
                errorRate: config.alertThresholds?.errorRate || 0.05, // 5%
                consecutiveFailures: config.alertThresholds?.consecutiveFailures || 3
            },
            ...config
        };

        this.metrics = {
            uptime: 0,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastHealthCheck: null,
            consecutiveFailures: 0,
            isHealthy: true
        };

        this.running = false;
        this.intervalId = null;
    }

    /**
     * Start monitoring
     */
    start() {
        if (this.running) {
            console.log('Monitor is already running');
            return;
        }

        console.log(`🔍 Starting Pure Life Compass Quiz monitoring...`);
        console.log(`📊 Monitoring URL: ${this.config.baseUrl}`);
        console.log(`⏱️  Check interval: ${this.config.interval}ms`);
        
        this.running = true;
        this.intervalId = setInterval(() => {
            this.performHealthCheck();
        }, this.config.interval);

        // Perform initial health check
        this.performHealthCheck();
    }

    /**
     * Stop monitoring
     */
    stop() {
        if (!this.running) {
            console.log('Monitor is not running');
            return;
        }

        console.log('🛑 Stopping monitoring...');
        this.running = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Perform comprehensive health check
     */
    async performHealthCheck() {
        const timestamp = new Date();
        const startTime = Date.now();

        try {
            // Health check endpoint
            const healthResponse = await this.makeRequest('/api/health-check');
            const responseTime = Date.now() - startTime;

            // Update metrics
            this.updateMetrics(true, responseTime);

            // Check response time threshold
            if (responseTime > this.config.alertThresholds.responseTime) {
                this.logAlert(`High response time: ${responseTime}ms (threshold: ${this.config.alertThresholds.responseTime}ms)`);
            }

            // Test API endpoints
            await this.testCriticalEndpoints();

            this.logStatus('HEALTHY', {
                responseTime,
                timestamp: timestamp.toISOString(),
                consecutiveFailures: 0
            });

        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.updateMetrics(false, responseTime);

            this.logStatus('UNHEALTHY', {
                error: error.message,
                responseTime,
                timestamp: timestamp.toISOString(),
                consecutiveFailures: this.metrics.consecutiveFailures
            });

            // Check if we need to trigger alerts
            if (this.metrics.consecutiveFailures >= this.config.alertThresholds.consecutiveFailures) {
                this.triggerAlert(`Service is unhealthy after ${this.metrics.consecutiveFailures} consecutive failures`);
            }
        }
    }

    /**
     * Test critical API endpoints
     */
    async testCriticalEndpoints() {
        const endpoints = [
            '/api/questions',
            '/api/health-check'
        ];

        for (const endpoint of endpoints) {
            const startTime = Date.now();
            try {
                await this.makeRequest(endpoint);
                const responseTime = Date.now() - startTime;
                
                if (responseTime > this.config.alertThresholds.responseTime) {
                    this.logAlert(`Endpoint ${endpoint} slow response: ${responseTime}ms`);
                }
            } catch (error) {
                this.logAlert(`Endpoint ${endpoint} failed: ${error.message}`);
                throw error; // Re-throw to fail the overall health check
            }
        }
    }

    /**
     * Make HTTP request with timeout
     */
    makeRequest(path, options = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(path, this.config.baseUrl);
            const httpModule = url.protocol === 'https:' ? https : http;

            const requestOptions = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: options.method || 'GET',
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': 'Pure-Life-Compass-Quiz-Monitor/1.0',
                    ...options.headers
                }
            };

            const req = httpModule.request(requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            statusCode: res.statusCode,
                            data: data,
                            headers: res.headers
                        });
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout after ${this.config.timeout}ms`));
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.data) {
                req.write(options.data);
            }

            req.end();
        });
    }

    /**
     * Update monitoring metrics
     */
    updateMetrics(success, responseTime) {
        this.metrics.totalRequests++;
        this.metrics.lastHealthCheck = new Date();

        if (success) {
            this.metrics.successfulRequests++;
            this.metrics.consecutiveFailures = 0;
            this.metrics.isHealthy = true;
        } else {
            this.metrics.failedRequests++;
            this.metrics.consecutiveFailures++;
            this.metrics.isHealthy = false;
        }

        // Update average response time (simple moving average)
        const totalResponseTime = (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1)) + responseTime;
        this.metrics.averageResponseTime = Math.round(totalResponseTime / this.metrics.totalRequests);

        // Calculate uptime percentage
        this.metrics.uptime = this.metrics.totalRequests > 0 
            ? (this.metrics.successfulRequests / this.metrics.totalRequests) * 100 
            : 0;
    }

    /**
     * Log status to file and console
     */
    logStatus(status, details) {
        const logEntry = {
            timestamp: details.timestamp,
            status,
            responseTime: details.responseTime,
            consecutiveFailures: details.consecutiveFailures,
            error: details.error,
            metrics: {
                uptime: `${this.metrics.uptime.toFixed(2)}%`,
                totalRequests: this.metrics.totalRequests,
                averageResponseTime: `${this.metrics.averageResponseTime}ms`
            }
        };

        const logLine = JSON.stringify(logEntry) + '\n';

        // Log to file
        try {
            fs.appendFileSync(this.config.logFile, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error.message);
        }

        // Log to console
        const statusIcon = status === 'HEALTHY' ? '✅' : '❌';
        const statusColor = status === 'HEALTHY' ? '\x1b[32m' : '\x1b[31m';
        const resetColor = '\x1b[0m';

        console.log(`${statusColor}${statusIcon} ${status}${resetColor} | Response: ${details.responseTime}ms | Uptime: ${this.metrics.uptime.toFixed(2)}% | ${details.timestamp}`);

        if (details.error) {
            console.log(`   Error: ${details.error}`);
        }
    }

    /**
     * Log alert
     */
    logAlert(message) {
        const alertEntry = {
            timestamp: new Date().toISOString(),
            type: 'ALERT',
            message
        };

        const alertLine = JSON.stringify(alertEntry) + '\n';
        
        try {
            fs.appendFileSync('alerts.log', alertLine);
        } catch (error) {
            console.error('Failed to write alert to file:', error.message);
        }

        console.log(`🚨 ALERT: ${message}`);
    }

    /**
     * Trigger critical alert
     */
    triggerAlert(message) {
        this.logAlert(`CRITICAL: ${message}`);
        
        // In production, you might want to:
        // - Send email notifications
        // - Post to Slack
        // - Trigger PagerDuty
        // - Send SMS alerts
        
        console.log(`🔥 CRITICAL ALERT: ${message}`);
        console.log('   Consider investigating the service immediately!');
    }

    /**
     * Get current metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            uptimePercentage: `${this.metrics.uptime.toFixed(2)}%`,
            errorRate: this.metrics.totalRequests > 0 
                ? `${((this.metrics.failedRequests / this.metrics.totalRequests) * 100).toFixed(2)}%`
                : '0.00%'
        };
    }

    /**
     * Generate status report
     */
    generateReport() {
        const metrics = this.getMetrics();
        
        console.log('\n📊 Pure Life Compass Quiz - Status Report');
        console.log('==========================================');
        console.log(`Service Status: ${metrics.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
        console.log(`Uptime: ${metrics.uptimePercentage}`);
        console.log(`Total Requests: ${metrics.totalRequests}`);
        console.log(`Successful: ${metrics.successfulRequests}`);
        console.log(`Failed: ${metrics.failedRequests}`);
        console.log(`Error Rate: ${metrics.errorRate}`);
        console.log(`Average Response Time: ${metrics.averageResponseTime}ms`);
        console.log(`Consecutive Failures: ${metrics.consecutiveFailures}`);
        console.log(`Last Health Check: ${metrics.lastHealthCheck ? metrics.lastHealthCheck.toISOString() : 'Never'}`);
        console.log('==========================================\n');
    }
}

// CLI interface
if (require.main === module) {
    const monitor = new ProductionMonitor({
        baseUrl: process.env.MONITOR_URL || 'http://localhost:3000',
        interval: parseInt(process.env.MONITOR_INTERVAL || '30000'),
        logFile: process.env.MONITOR_LOG_FILE || 'monitoring.log'
    });

    // Handle process signals
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        monitor.stop();
        monitor.generateReport();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        monitor.stop();
        monitor.generateReport();
        process.exit(0);
    });

    // Start monitoring
    monitor.start();

    // Generate report every 5 minutes
    setInterval(() => {
        monitor.generateReport();
    }, 5 * 60 * 1000);
}

module.exports = ProductionMonitor;