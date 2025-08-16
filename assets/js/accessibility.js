/**
 * Accessibility Module
 * Provides keyboard navigation, ARIA management, and screen reader support
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.currentFocusIndex = 0;
        this.focusableElementsList = [];
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupARIA();
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.announcePageLoad();
    }

    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboard(event);
        });

        // Tab navigation within components
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            }
        });

        // Escape key handling
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.handleEscapeKey(event);
            }
        });
    }

    handleGlobalKeyboard(event) {
        // Ctrl + / for search focus
        if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Ctrl + T for theme toggle
        if (event.ctrlKey && event.key === 't') {
            event.preventDefault();
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }

        // Ctrl + M for modal close
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            const modal = document.getElementById('readingModal');
            if (modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        }
    }

    handleTabNavigation(event) {
        const activeElement = document.activeElement;
        const isModalOpen = document.getElementById('readingModal')?.classList.contains('hidden') === false;

        if (isModalOpen) {
            // Trap focus within modal
            this.trapFocusInModal(event);
        } else {
            // Normal tab navigation
            this.updateFocusableElements();
        }
    }

    trapFocusInModal(event) {
        const modal = document.getElementById('readingModal');
        const focusableElements = modal.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    handleEscapeKey(event) {
        const modal = document.getElementById('readingModal');
        if (modal && !modal.classList.contains('hidden')) {
            event.preventDefault();
            this.closeModal();
        }
    }

    closeModal() {
        const modal = document.getElementById('readingModal');
        if (modal) {
            modal.classList.add('hidden');
            // Return focus to the element that opened the modal
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }
        }
    }

    setupARIA() {
        // Add ARIA labels to interactive elements
        this.addARIALabels();
        
        // Setup live regions for dynamic content
        this.setupLiveRegions();
        
        // Setup landmarks
        this.setupLandmarks();
    }

    addARIALabels() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Search through your writings');
            searchInput.setAttribute('aria-describedby', 'search-help');
        }

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.setAttribute('aria-label', 'Sort content by');
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.setAttribute('aria-pressed', 'false');
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.setAttribute('aria-current', index === 0 ? 'page' : 'false');
        });
    }

    setupLiveRegions() {
        // Create live region for search results
        let liveRegion = document.getElementById('search-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'search-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        // Create live region for content updates
        let contentLiveRegion = document.getElementById('content-live-region');
        if (!contentLiveRegion) {
            contentLiveRegion = document.createElement('div');
            contentLiveRegion.id = 'content-live-region';
            contentLiveRegion.setAttribute('aria-live', 'polite');
            contentLiveRegion.setAttribute('aria-atomic', 'false');
            contentLiveRegion.className = 'sr-only';
            document.body.appendChild(contentLiveRegion);
        }
    }

    setupLandmarks() {
        // Main content landmark
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
            mainContent.setAttribute('aria-label', 'Library content');
        }

        // Search section landmark
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.setAttribute('role', 'search');
            searchSection.setAttribute('aria-label', 'Search and filter content');
        }

        // Content grid landmark
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.setAttribute('role', 'grid');
            contentGrid.setAttribute('aria-label', 'Content items');
        }
    }

    setupSkipLinks() {
        // Add skip link for main content
        let skipLink = document.getElementById('skip-main');
        if (!skipLink) {
            skipLink = document.createElement('a');
            skipLink.id = 'skip-main';
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Add skip link for navigation
        let skipNav = document.getElementById('skip-nav');
        if (!skipNav) {
            skipNav = document.createElement('a');
            skipNav.id = 'skip-nav';
            skipNav.href = '#main-nav';
            skipNav.className = 'skip-link';
            skipNav.textContent = 'Skip to navigation';
            document.body.insertBefore(skipNav, document.body.firstChild);
        }
    }

    setupFocusManagement() {
        // Track last focused element
        document.addEventListener('focusin', (event) => {
            this.lastFocusedElement = event.target;
        });

        // Focus management for modals
        this.setupModalFocusManagement();
    }

    setupModalFocusManagement() {
        // Override modal open to save focus
        const originalModalOpen = window.ReadingModal?.open;
        if (originalModalOpen) {
            window.ReadingModal.open = function(...args) {
                // Save current focus
                if (window.accessibilityManager) {
                    window.accessibilityManager.lastFocusedElement = document.activeElement;
                }
                
                // Call original function
                const result = originalModalOpen.apply(this, args);
                
                // Focus first focusable element in modal
                setTimeout(() => {
                    const modal = document.getElementById('readingModal');
                    if (modal) {
                        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }
                }, 100);
                
                return result;
            };
        }
    }

    updateFocusableElements() {
        this.focusableElementsList = Array.from(document.querySelectorAll(this.focusableElements))
            .filter(el => el.offsetParent !== null && !el.disabled);
    }

    announcePageLoad() {
        // Announce page load to screen readers
        setTimeout(() => {
            this.announce('Page loaded successfully. Use Tab to navigate and Ctrl + / to search.');
        }, 1000);
    }

    announce(message) {
        const liveRegion = document.getElementById('search-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    announceSearchResults(count) {
        const message = count === 0 ? 'No search results found' : `Found ${count} search results`;
        this.announce(message);
    }

    announceContentUpdate(category, count) {
        const message = `Showing ${count} ${category} items`;
        this.announce(message);
    }

    // Focus management methods
    focusFirstElement() {
        this.updateFocusableElements();
        if (this.focusableElementsList.length > 0) {
            this.focusableElementsList[0].focus();
        }
    }

    focusLastElement() {
        this.updateFocusableElements();
        if (this.focusableElementsList.length > 0) {
            this.focusableElementsList[this.focusableElementsList.length - 1].focus();
        }
    }

    // Clean up
    destroy() {
        // Remove event listeners if needed
        document.removeEventListener('keydown', this.handleGlobalKeyboard);
        document.removeEventListener('keydown', this.handleTabNavigation);
        document.removeEventListener('keydown', this.handleEscapeKey);
    }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} else {
    window.AccessibilityManager = AccessibilityManager;
    window.accessibilityManager = accessibilityManager;
}
