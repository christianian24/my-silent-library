/**
 * Performance Monitoring Module
 * Tracks Core Web Vitals and custom metrics
 * Provides insights for performance optimization
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupCoreWebVitals();
        this.setupCustomMetrics();
        this.setupPerformanceObserver();
        this.setupErrorTracking();
    }

    setupCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
        
        // Time to Interactive (TTI)
        this.observeTTI();
    }

    setupCustomMetrics() {
        // Content loading time
        this.measureContentLoading();
        
        // Search performance
        this.measureSearchPerformance();
        
        // Modal opening time
        this.measureModalPerformance();
        
        // Theme switching time
        this.measureThemeSwitch();
    }

    setupPerformanceObserver() {
        // Observe long tasks
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.recordMetric('longTask', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                name: entry.name
                            });
                        }
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.set('longTask', longTaskObserver);
            } catch (e) {
                console.warn('Long task observer not supported');
            }
        }
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.recordMetric('jsError', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now()
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.recordMetric('unhandledRejection', {
                reason: event.reason,
                timestamp: Date.now()
            });
        });
    }

    observeLCP() {
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.recordMetric('lcp', {
                        value: lastEntry.startTime,
                        element: lastEntry.element?.tagName || 'unknown',
                        timestamp: Date.now()
                    });
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);
            } catch (e) {
                console.warn('LCP observer not supported');
            }
        }
    }

    observeFID() {
        if ('PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric('fid', {
                            value: entry.processingStart - entry.startTime,
                            timestamp: Date.now()
                        });
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
    }

    observeCLS() {
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.recordMetric('cls', {
                        value: clsValue,
                        timestamp: Date.now()
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }
    }

    observeFCP() {
        if ('PerformanceObserver' in window) {
            try {
                const fcpObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric('fcp', {
                            value: entry.startTime,
                            timestamp: Date.now()
                        });
                    }
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
                this.observers.set('fcp', fcpObserver);
            } catch (e) {
                console.warn('FCP observer not supported');
            }
        }
    }

    observeTTI() {
        // TTI is calculated using Performance API
        if ('Performance' in window) {
            const tti = this.calculateTTI();
            if (tti) {
                this.recordMetric('tti', {
                    value: tti,
                    timestamp: Date.now()
                });
            }
        }
    }

    calculateTTI() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            const domInteractive = navigation.domInteractive;
            return domInteractive + domContentLoaded;
        }
        return null;
    }

    measureContentLoading() {
        // Measure how long content takes to load
        const startTime = performance.now();
        
        // Listen for content loaded events
        document.addEventListener('contentLoaded', () => {
            const endTime = performance.now();
            this.recordMetric('contentLoading', {
                value: endTime - startTime,
                timestamp: Date.now()
            });
        });
    }

    measureSearchPerformance() {
        // Measure search response time
        const originalSearch = window.LibrarySearch?.search || (() => {});
        
        window.LibrarySearch = window.LibrarySearch || {};
        window.LibrarySearch.search = function(...args) {
            const startTime = performance.now();
            const result = originalSearch.apply(this, args);
            
            // If it's a promise, measure async performance
            if (result && typeof result.then === 'function') {
                result.then(() => {
                    const endTime = performance.now();
                    this.recordMetric('searchPerformance', {
                        value: endTime - startTime,
                        timestamp: Date.now()
                    });
                });
            } else {
                const endTime = performance.now();
                this.recordMetric('searchPerformance', {
                    value: endTime - startTime,
                    timestamp: Date.now()
                });
            }
            
            return result;
        }.bind(this);
    }

    measureModalPerformance() {
        // Measure modal opening time
        const originalOpen = window.ReadingModal?.open || (() => {});
        
        window.ReadingModal = window.ReadingModal || {};
        window.ReadingModal.open = function(...args) {
            const startTime = performance.now();
            const result = originalOpen.apply(this, args);
            
            // Measure when modal is fully visible
            setTimeout(() => {
                const endTime = performance.now();
                this.recordMetric('modalOpen', {
                    value: endTime - startTime,
                    timestamp: Date.now()
                });
            }, 100);
            
            return result;
        }.bind(this);
    }

    measureThemeSwitch() {
        // Measure theme switching performance
        const originalToggle = window.ThemeManager?.toggleTheme || (() => {});
        
        window.ThemeManager = window.ThemeManager || {};
        window.ThemeManager.toggleTheme = function(...args) {
            const startTime = performance.now();
            const result = originalToggle.apply(this, args);
            
            // Measure when theme transition is complete
            setTimeout(() => {
                const endTime = performance.now();
                this.recordMetric('themeSwitch', {
                    value: endTime - startTime,
                    timestamp: Date.now()
                });
            }, 300);
            
            return result;
        }.bind(this);
    }

    recordMetric(name, data) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        
        this.metrics.get(name).push({
            ...data,
            timestamp: data.timestamp || Date.now()
        });
        
        // Keep only last 100 entries per metric
        if (this.metrics.get(name).length > 100) {
            this.metrics.get(name).shift();
        }
        
        // Emit custom event for other modules
        window.dispatchEvent(new CustomEvent('performanceMetric', {
            detail: { name, data }
        }));
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Performance Metric [${name}]:`, data);
        }
    }

    getMetric(name) {
        return this.metrics.get(name) || [];
    }

    getLatestMetric(name) {
        const metrics = this.getMetric(name);
        return metrics.length > 0 ? metrics[metrics.length - 1] : null;
    }

    getAverageMetric(name) {
        const metrics = this.getMetric(name);
        if (metrics.length === 0) return 0;
        
        const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
        return sum / metrics.length;
    }

    getMetricsSummary() {
        const summary = {};
        
        for (const [name, metrics] of this.metrics) {
            if (metrics.length > 0) {
                const values = metrics.map(m => m.value).filter(v => typeof v === 'number');
                if (values.length > 0) {
                    summary[name] = {
                        count: metrics.length,
                        average: values.reduce((a, b) => a + b, 0) / values.length,
                        min: Math.min(...values),
                        max: Math.max(...values),
                        latest: metrics[metrics.length - 1]
                    };
                }
            }
        }
        
        return summary;
    }

    // Generate performance report
    generateReport() {
        const summary = this.getMetricsSummary();
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            summary: summary,
            recommendations: this.generateRecommendations(summary)
        };
        
        return report;
    }

    generateRecommendations(summary) {
        const recommendations = [];
        
        // LCP recommendations
        if (summary.lcp && summary.lcp.average > 2500) {
            recommendations.push({
                metric: 'LCP',
                issue: 'Largest Contentful Paint is too slow (>2.5s)',
                suggestions: [
                    'Optimize images and fonts',
                    'Use lazy loading for below-the-fold content',
                    'Implement critical CSS inlining'
                ]
            });
        }
        
        // FID recommendations
        if (summary.fid && summary.fid.average > 100) {
            recommendations.push({
                metric: 'FID',
                issue: 'First Input Delay is too high (>100ms)',
                suggestions: [
                    'Break up long JavaScript tasks',
                    'Use web workers for heavy computations',
                    'Optimize event handlers'
                ]
            });
        }
        
        // CLS recommendations
        if (summary.cls && summary.cls.average > 0.1) {
            recommendations.push({
                metric: 'CLS',
                issue: 'Cumulative Layout Shift is too high (>0.1)',
                suggestions: [
                    'Set explicit dimensions for images and videos',
                    'Avoid inserting content above existing content',
                    'Use CSS transforms instead of changing layout properties'
                ]
            });
        }
        
        return recommendations;
    }

    // Export metrics for analysis
    exportMetrics() {
        const data = {
            metrics: Object.fromEntries(this.metrics),
            summary: this.getMetricsSummary(),
            report: this.generateReport()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clean up
    destroy() {
        // Disconnect all observers
        for (const observer of this.observers.values()) {
            if (observer.disconnect) {
                observer.disconnect();
            }
        }
        this.observers.clear();
        
        // Clear metrics
        this.metrics.clear();
    }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} else {
    window.PerformanceMonitor = PerformanceMonitor;
    window.performanceMonitor = performanceMonitor;
}
