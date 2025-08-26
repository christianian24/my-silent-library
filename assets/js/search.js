/**
 * Search Component for My Silent Library.
 * Handles auxiliary search input functionality like the clear button.
 */

class LibrarySearch {
    constructor() {

        // Cache DOM elements for performance and maintainability
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');

        this.init();
    }

    init() {
        if (!this.searchInput) {
            console.error("Search input not found. Search component cannot initialize.");
            return;
        }
        this.setupClearButton();
    }

    setupClearButton() {
        if (!this.clearSearchBtn || !this.searchInput) return;

        this.clearSearchBtn.addEventListener('click', () => {
            if (this.searchInput.value === '') return;

            this.searchInput.value = '';
            // Dispatch an 'input' event to trigger the main app's search handler
            // and to ensure CSS :not(:placeholder-shown) updates correctly.
            this.searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.searchInput.focus();
        });
    }

}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.librarySearch = new LibrarySearch();
});
