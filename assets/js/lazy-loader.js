/**
 * Lazy Loading Module
 * Loads content only when it's visible in the viewport
 * Uses Intersection Observer API for optimal performance
 */

class LazyLoader {
    constructor() {
        this.observer = null;
        this.lazyElements = new Set();
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.setupFallback();
        }
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px', // Start loading 50px before element is visible
                threshold: 0.1
            }
        );
    }

    setupFallback() {
        // Simple scroll-based fallback
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        window.addEventListener('resize', this.throttle(this.handleScroll.bind(this), 100));
        this.handleScroll();
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    handleScroll() {
        this.lazyElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.loadElement(element);
                this.lazyElements.delete(element);
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        } else {
            this.lazyElements.add(element);
        }
    }

    loadElement(element) {
        // Add loading animation
        element.classList.add('loading');
        
        // Simulate content loading (replace with actual content loading logic)
        setTimeout(() => {
            element.classList.remove('loading');
            element.classList.add('loaded');
            
            // Trigger custom event for other modules
            element.dispatchEvent(new CustomEvent('contentLoaded', {
                detail: { element }
            }));
        }, 300);
    }

    // Load all visible elements immediately
    loadVisible() {
        this.lazyElements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.loadElement(element);
                this.lazyElements.delete(element);
            }
        });
    }

    // Clean up
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.lazyElements.clear();
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
} else {
    window.LazyLoader = LazyLoader;
}
