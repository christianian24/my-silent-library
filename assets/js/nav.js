/**
 * Site Navigation for My Silent Library
 * Handles the side menu drawer and search modal functionality.
 */
class SiteNavigation {
    constructor() {
        // Menu Elements
        this.menuToggleBtn = document.getElementById('menuToggleBtn');
        this.menuCloseBtn = document.getElementById('menuCloseBtn');
        this.sideNav = document.getElementById('sideNav');
        this.navOverlay = document.getElementById('navOverlay');

        // Search Elements
        this.searchToggleBtn = document.getElementById('searchToggleBtn');
        this.searchModal = document.getElementById('searchModal');
        this.searchModalOverlay = document.getElementById('searchModalOverlay');
        this.searchInput = document.getElementById('searchInput');

        // State
        this.isMenuOpen = false;
        this.isSearchOpen = false;
        this.previousActiveElement = null;

        this.init();
    }

    init() {
        if (!this.menuToggleBtn || !this.sideNav || !this.searchToggleBtn || !this.searchModal) {
            console.warn('Essential navigation elements not found. Navigation will not be initialized.');
            return;
        }

        // --- Menu Listeners ---
        this.menuToggleBtn.addEventListener('click', () => this.openMenu());
        this.menuCloseBtn.addEventListener('click', () => this.closeMenu());
        this.navOverlay.addEventListener('click', () => this.closeMenu());

        // Handle category clicks in the side navigation
        this.sideNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.dataset.category;
                
                // Dispatch an event for the main app to handle the category change.
                document.dispatchEvent(new CustomEvent('categoryChanged', { detail: { category } }));

                // On mobile, close the nav after a selection. On desktop, keep it open.
                // The breakpoint (768px) should match the CSS.
                if (window.innerWidth < 768) {
                    this.closeMenu();
                }
            });
        });

        // --- Search Listeners ---
        this.searchToggleBtn.addEventListener('click', () => this.openSearch());
        this.searchModalOverlay.addEventListener('click', () => this.closeSearch());

        // --- Global Listeners ---
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isMenuOpen) this.closeMenu();
                if (this.isSearchOpen) this.closeSearch();
            }
        });
    }

    // --- Menu Methods ---
    openMenu() {
        if (this.isMenuOpen) return;
        this.isMenuOpen = true;
        this.previousActiveElement = document.activeElement;

        document.body.style.overflow = 'hidden';
        this.sideNav.removeAttribute('aria-hidden');
        this.sideNav.classList.add('is-open');
        this.navOverlay.hidden = false;
        this.menuToggleBtn.setAttribute('aria-expanded', 'true');

        this.sideNav.focus();
        this.trapFocus(this.sideNav);
    }

    closeMenu() {
        if (!this.isMenuOpen) return;
        this.isMenuOpen = false;

        document.body.style.overflow = '';
        this.sideNav.setAttribute('aria-hidden', 'true');
        this.sideNav.classList.remove('is-open');
        this.navOverlay.hidden = true;
        this.menuToggleBtn.setAttribute('aria-expanded', 'false');

        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
    }

    // --- Search Methods ---
    openSearch() {
        if (this.isSearchOpen) return;
        this.isSearchOpen = true;
        this.previousActiveElement = document.activeElement;

        this.searchModal.hidden = false;
        this.searchModalOverlay.hidden = false;
        
        // Use a timeout to allow the element to become visible before focusing
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }

    closeSearch() {
        if (!this.isSearchOpen) return;
        this.isSearchOpen = false;

        this.searchModal.hidden = true;
        this.searchModalOverlay.hidden = true;

        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
    }

    // --- Utility Methods ---
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.siteNavigation = new SiteNavigation();
});