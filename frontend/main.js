// Pure Life Compass Quiz - Main Application Entry Point
// Always Works™ implementation with brand-accurate Pure Life Warrior styling

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧭 Pure Life Compass Quiz - Application Starting...');
    console.log('🎨 Brand Colors: Pure Life Warrior Black & Gold Theme Loaded');
    
    initializeApplication();
});

function initializeApplication() {
    console.log('⚡ Initializing Pure Life Compass Quiz Application...');
    
    // Verify all dependencies are loaded
    if (!verifyDependencies()) {
        showCriticalError('Failed to load required dependencies. Please refresh the page.');
        return;
    }
    
    // Initialize analytics tracking
    initializeAnalytics();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize error handling
    initializeErrorHandling();
    
    // Initialize SEO and social media
    initializeSEOOptimization();
    
    // Clean up old data periodically
    cleanupStorageData();
    
    console.log('✅ Pure Life Compass Quiz Application Initialized Successfully!');
    console.log('🏆 Always Works™ Protocol: All systems operational');
}

function verifyDependencies() {
    const requiredGlobals = [
        'quizData',
        'resultConfigs', 
        'sectionNames',
        'determinePersona',
        'getSectionBreakdown',
        'PureLifeQuiz',
        'ghlIntegration'
    ];
    
    const missing = requiredGlobals.filter(name => typeof window[name] === 'undefined');
    
    if (missing.length > 0) {
        console.error('❌ Missing required dependencies:', missing);
        return false;
    }
    
    console.log('✅ All dependencies verified');
    return true;
}

function initializeAnalytics() {
    // Track page load
    trackEvent('quiz_page_loaded', {
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        referrer: document.referrer
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollPercent >= 25 && maxScrollDepth < 25) {
                trackEvent('scroll_depth_25');
            } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
                trackEvent('scroll_depth_50');
            } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
                trackEvent('scroll_depth_75');
            }
        }
    });
    
    console.log('📊 Analytics initialized');
}

function initializeAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Skip links for screen readers
        if (e.key === 'Tab' && e.shiftKey && document.activeElement === document.body) {
            const firstFocusable = document.querySelector('button, input, a, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        }
    });
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'accessibility-announcer';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    };
    
    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
        console.log('🎨 High contrast mode detected');
    }
    
    // Reduced motion detection
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        console.log('⏸️ Reduced motion preference detected');
    }
    
    console.log('♿ Accessibility features initialized');
}

function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                const domReadyTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
                
                trackEvent('performance_metrics', {
                    load_time: loadTime,
                    dom_ready_time: domReadyTime,
                    page_type: 'quiz_landing'
                });
                
                console.log(`⚡ Page loaded in ${loadTime}ms (DOM ready: ${domReadyTime}ms)`);
                
                // Warn if performance is poor
                if (loadTime > 3000) {
                    console.warn('⚠️ Slow page load detected:', loadTime, 'ms');
                }
            }
        }, 0);
    });
    
    // Monitor quiz completion time
    window.trackQuizPerformance = (startTime, endTime, questionCount) => {
        const totalTime = endTime - startTime;
        const avgTimePerQuestion = totalTime / questionCount;
        
        trackEvent('quiz_completion_performance', {
            total_time_ms: totalTime,
            avg_time_per_question: avgTimePerQuestion,
            question_count: questionCount
        });
        
        console.log(`📊 Quiz completed in ${totalTime}ms (${avgTimePerQuestion}ms avg per question)`);
    };
    
    console.log('📈 Performance monitoring initialized');
}

function initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('💥 JavaScript Error:', e.error);
        
        trackEvent('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error ? e.error.stack : null
        });
        
        // Don't show errors to users in production, but log them
        if (window.location.hostname === 'localhost') {
            showError('statusMessage', `Error: ${e.message}`);
        }
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('💥 Unhandled Promise Rejection:', e.reason);
        
        trackEvent('promise_rejection', {
            reason: e.reason ? e.reason.toString() : 'Unknown',
            stack: e.reason && e.reason.stack ? e.reason.stack : null
        });
        
        e.preventDefault(); // Prevent console spam in production
    });
    
    console.log('🛡️ Error handling initialized');
}

function initializeSEOOptimization() {
    // Dynamic meta tag updates
    updateMetaTag('description', 'Take the Pure Life Compass Quiz to discover your unique transformation path. Get personalized strategies for achieving your life goals with this comprehensive assessment.');
    updateMetaTag('keywords', 'life transformation, personal development, goal achievement, life coaching, self improvement, pure life warrior');
    
    // Open Graph tags for social sharing
    updateMetaTag('og:title', 'Pure Life Compass Quiz - Discover Your Path to Transformation');
    updateMetaTag('og:description', 'Take this comprehensive assessment to unlock personalized strategies for achieving your life goals.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Pure Life Compass Quiz - Discover Your Transformation Path');
    updateMetaTag('twitter:description', 'Get personalized strategies for achieving your life goals with this comprehensive assessment.');
    
    // Structured data for search engines
    addStructuredData({
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": "Pure Life Compass Quiz",
        "description": "A comprehensive life transformation assessment",
        "author": {
            "@type": "Organization",
            "name": "Pure Life Warrior"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    });
    
    console.log('🔍 SEO optimization initialized');
}

function updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
            meta.setAttribute('property', property);
        } else {
            meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

function trackEvent(eventName, data = {}) {
    console.log(`📊 Event: ${eventName}`, data);
    
    // Store events locally for debugging
    const events = JSON.parse(localStorage.getItem('quiz_events') || '[]');
    events.push({
        event: eventName,
        data: data,
        timestamp: Date.now(),
        url: window.location.href
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('quiz_events', JSON.stringify(events));
    
    // Send to analytics services (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
    
    // Send to Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
    }
}

function cleanupStorageData() {
    // Clean up old quiz data
    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pure_life_quiz_') || key.startsWith('ghl_backup_'))) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.timestamp && data.timestamp < cutoffTime) {
                    localStorage.removeItem(key);
                    console.log('🗑️ Cleaned up old data:', key);
                }
            } catch (error) {
                // Remove corrupted data
                localStorage.removeItem(key);
                console.log('🗑️ Removed corrupted data:', key);
            }
        }
    }
    
    console.log('🧹 Storage cleanup completed');
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showCriticalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 20px;
    `;
    
    errorDiv.innerHTML = `
        <div>
            <h2 style="color: #EAB308; margin-bottom: 20px;">Pure Life Compass Quiz</h2>
            <p style="margin-bottom: 20px;">${message}</p>
            <button onclick="location.reload()" style="
                background: #EAB308;
                color: black;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            ">Refresh Page</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

// Development utilities
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugUtils = {
        getEvents: () => JSON.parse(localStorage.getItem('quiz_events') || '[]'),
        clearEvents: () => localStorage.removeItem('quiz_events'),
        getStorageUsage: () => {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return `${(total / 1024).toFixed(2)} KB`;
        },
        simulateError: () => {
            throw new Error('Test error for debugging');
        }
    };
    
    console.log('🛠️ Debug utilities available at window.debugUtils');
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackEvent,
        updateMetaTag,
        cleanupStorageData
    };
}