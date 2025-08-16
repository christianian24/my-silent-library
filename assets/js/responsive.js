/**
 * Responsive Design Module
 * Handles mobile-first design, touch interactions, and adaptive layouts
 */

class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = 'desktop';
        this.touchDevice = false;
        this.orientation = 'portrait';
        this.init();
    }

    init() {
        this.detectDeviceCapabilities();
        this.setupResponsiveListeners();
        this.setupTouchInteractions();
        this.setupOrientationHandling();
        this.applyResponsiveClasses();
    }

    detectDeviceCapabilities() {
        // Detect touch device
        this.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Detect device type
        this.deviceType = this.getDeviceType();
        
        // Set initial breakpoint
        this.updateBreakpoint();
        
        // Set initial orientation
        this.updateOrientation();
    }

    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)) {
            return 'mobile';
        } else if (/tablet|ipad/.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    setupResponsiveListeners() {
        // Resize listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Media query listeners
        this.setupMediaQueryListeners();
    }

    setupMediaQueryListeners() {
        // Breakpoint media queries
        const breakpoints = {
            mobile: '(max-width: 767px)',
            tablet: '(min-width: 768px) and (max-width: 1023px)',
            desktop: '(min-width: 1024px)'
        };

        Object.entries(breakpoints).forEach(([breakpoint, query]) => {
            const mediaQuery = window.matchMedia(query);
            
            const handleChange = (e) => {
                if (e.matches) {
                    this.onBreakpointChange(breakpoint);
                }
            };

            // Initial check
            handleChange(mediaQuery);
            
            // Listen for changes
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else {
                // Fallback for older browsers
                mediaQuery.addListener(handleChange);
            }
        });
    }

    setupTouchInteractions() {
        if (!this.touchDevice) return;

        // Touch-friendly interactions
        this.setupTouchGestures();
        this.setupTouchFeedback();
        this.optimizeForTouch();
    }

    setupTouchGestures() {
        let startX, startY, startTime;
        let isScrolling = false;

        // Touch start
        document.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            isScrolling = false;
        }, { passive: true });

        // Touch move
        document.addEventListener('touchmove', (event) => {
            if (!startX || !startY) return;

            const touch = event.touches[0];
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);

            // Determine if scrolling or swiping
            if (deltaY > deltaX && deltaY > 10) {
                isScrolling = true;
            }
        }, { passive: true });

        // Touch end
        document.addEventListener('touchend', (event) => {
            if (!startX || !startY || isScrolling) {
                startX = startY = null;
                return;
            }

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            const deltaTime = Date.now() - startTime;

            // Swipe detection
            if (deltaTime < 300 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }

            startX = startY = null;
        }, { passive: true });
    }

    handleSwipeLeft() {
        // Navigate to next category
        const currentNav = document.querySelector('.nav-link.active');
        if (currentNav) {
            const nextNav = currentNav.nextElementSibling;
            if (nextNav && nextNav.classList.contains('nav-link')) {
                nextNav.click();
            }
        }
    }

    handleSwipeRight() {
        // Navigate to previous category
        const currentNav = document.querySelector('.nav-link.active');
        if (currentNav) {
            const prevNav = currentNav.previousElementSibling;
            if (prevNav && prevNav.classList.contains('nav-link')) {
                prevNav.click();
            }
        }
    }

    setupTouchFeedback() {
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('button, .nav-link, .content-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    optimizeForTouch() {
        // Increase touch target sizes
        this.optimizeTouchTargets();
        
        // Add touch-friendly spacing
        this.addTouchSpacing();
        
        // Optimize scrolling
        this.optimizeScrolling();
    }

    optimizeTouchTargets() {
        // Ensure minimum touch target size (44px)
        const touchTargets = document.querySelectorAll('button, .nav-link, input, select');
        
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
            }
        });
    }

    addTouchSpacing() {
        // Add spacing between touch targets
        const touchTargets = document.querySelectorAll('button, .nav-link');
        
        touchTargets.forEach(target => {
            target.style.padding = '12px 16px';
            target.style.margin = '4px';
        });
    }

    optimizeScrolling() {
        // Smooth scrolling for touch devices
        if (this.touchDevice) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    setupOrientationHandling() {
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateOrientation();
                this.handleOrientationChange();
            }, 100);
        });

        // Listen for resize (handles orientation on some devices)
        window.addEventListener('resize', () => {
            this.updateOrientation();
        });
    }

    updateOrientation() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.orientation = width > height ? 'landscape' : 'portrait';
    }

    handleOrientationChange() {
        // Adjust layout for orientation
        if (this.orientation === 'landscape') {
            this.optimizeForLandscape();
        } else {
            this.optimizeForPortrait();
        }
    }

    optimizeForLandscape() {
        // Landscape optimizations
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
        
        // Adjust grid layout for landscape
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        }
    }

    optimizeForPortrait() {
        // Portrait optimizations
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
        
        // Adjust grid layout for portrait
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.style.gridTemplateColumns = '1fr';
        }
    }

    handleResize() {
        this.updateBreakpoint();
        this.updateOrientation();
        this.applyResponsiveClasses();
        this.optimizeLayout();
    }

    updateBreakpoint() {
        const width = window.innerWidth;
        
        if (width < 768) {
            this.currentBreakpoint = 'mobile';
        } else if (width < 1024) {
            this.currentBreakpoint = 'tablet';
        } else {
            this.currentBreakpoint = 'desktop';
        }
    }

    onBreakpointChange(newBreakpoint) {
        const oldBreakpoint = this.currentBreakpoint;
        this.currentBreakpoint = newBreakpoint;
        
        // Handle breakpoint-specific logic
        this.handleBreakpointSpecificLogic(oldBreakpoint, newBreakpoint);
    }

    handleBreakpointSpecificLogic(oldBreakpoint, newBreakpoint) {
        // Mobile-specific optimizations
        if (newBreakpoint === 'mobile') {
            this.optimizeForMobile();
        }
        
        // Tablet-specific optimizations
        if (newBreakpoint === 'tablet') {
            this.optimizeForTablet();
        }
        
        // Desktop-specific optimizations
        if (newBreakpoint === 'desktop') {
            this.optimizeForDesktop();
        }
    }

    optimizeForMobile() {
        // Mobile optimizations
        this.collapseNavigation();
        this.optimizeSearchBar();
        this.adjustContentLayout();
    }

    optimizeForTablet() {
        // Tablet optimizations
        this.expandNavigation();
        this.optimizeGridLayout();
    }

    optimizeForDesktop() {
        // Desktop optimizations
        this.expandNavigation();
        this.optimizeGridLayout();
        this.addHoverEffects();
    }

    collapseNavigation() {
        // Collapse navigation for mobile
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.classList.add('collapsed');
        }
    }

    expandNavigation() {
        // Expand navigation for larger screens
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.classList.remove('collapsed');
        }
    }

    optimizeSearchBar() {
        // Optimize search bar for mobile
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.classList.add('mobile-optimized');
        }
    }

    adjustContentLayout() {
        // Adjust content layout for mobile
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.style.gridTemplateColumns = '1fr';
            contentGrid.style.gap = '16px';
        }
    }

    optimizeGridLayout() {
        // Optimize grid layout for larger screens
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            if (this.currentBreakpoint === 'tablet') {
                contentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            } else {
                contentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            }
            contentGrid.style.gap = '24px';
        }
    }

    addHoverEffects() {
        // Add hover effects for desktop
        document.body.classList.add('hover-enabled');
    }

    applyResponsiveClasses() {
        // Apply breakpoint classes to body
        document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
        document.body.classList.add(`breakpoint-${this.currentBreakpoint}`);
        
        // Apply device type classes
        document.body.className = document.body.className.replace(/device-\w+/g, '');
        document.body.classList.add(`device-${this.deviceType}`);
        
        // Apply orientation classes
        document.body.className = document.body.className.replace(/orientation-\w+/g, '');
        document.body.classList.add(`orientation-${this.orientation}`);
        
        // Apply touch device class
        if (this.touchDevice) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.remove('touch-device');
        }
    }

    optimizeLayout() {
        // Optimize layout based on current state
        this.optimizeContentGrid();
        this.optimizeNavigation();
        this.optimizeSearchSection();
    }

    optimizeContentGrid() {
        const contentGrid = document.getElementById('contentGrid');
        if (!contentGrid) return;

        // Adjust grid based on breakpoint
        switch (this.currentBreakpoint) {
            case 'mobile':
                contentGrid.style.gridTemplateColumns = '1fr';
                contentGrid.style.gap = '16px';
                break;
            case 'tablet':
                contentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
                contentGrid.style.gap = '20px';
                break;
            case 'desktop':
                contentGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
                contentGrid.style.gap = '24px';
                break;
        }
    }

    optimizeNavigation() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        if (this.currentBreakpoint === 'mobile') {
            nav.classList.add('collapsed');
        } else {
            nav.classList.remove('collapsed');
        }
    }

    optimizeSearchSection() {
        const searchSection = document.querySelector('.search-section');
        if (!searchSection) return;

        if (this.currentBreakpoint === 'mobile') {
            searchSection.classList.add('mobile-optimized');
        } else {
            searchSection.classList.remove('mobile-optimized');
        }
    }

    // Public methods for other modules
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    isTouchDevice() {
        return this.touchDevice;
    }

    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }

    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }

    isDesktop() {
        return this.currentBreakpoint === 'desktop';
    }

    // Clean up
    destroy() {
        // Remove event listeners if needed
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.updateOrientation);
    }
}

// Initialize responsive manager
const responsiveManager = new ResponsiveManager();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
} else {
    window.ResponsiveManager = ResponsiveManager;
    window.responsiveManager = responsiveManager;
}
