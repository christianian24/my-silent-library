/**
 * Main Application JavaScript for My Silent Library
 * Handles content rendering, navigation, and core functionality
 */

class LibraryApp {
    constructor() {
        this.currentCategory = 'all';
        this.currentSort = 'date';
        this.currentSearch = '';
        this.allContent = [];
        this.filteredContent = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadContent();
        this.renderContent();
        this.updateActiveNavigation();
        this.displayFeaturedPassage();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryChange(e.target.dataset.category);
            });
        });
        
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Sorting
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }

        // Event Delegation for Content Grid
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            contentGrid.addEventListener('click', (e) => {
                const readBtn = e.target.closest('.read-btn');
                const card = e.target.closest('.content-card');

                if (readBtn) {
                    e.stopPropagation(); // Prevent card click from firing too
                    this.openReadingModal(readBtn.dataset.id);
                    return;
                }

                // Check if the click is on the card but not on any button inside it
                if (card && !e.target.closest('.btn')) {
                    this.openReadingModal(card.dataset.id);
                }
            });
        }

        // Listen for custom events from the search component
        document.addEventListener('search:selection', (e) => {
            this.openReadingModal(e.detail.contentId);
        });

        document.addEventListener('search:cleared', () => {
            // When the search component clears, reset the main view.
            // Calling handleSearch with an empty string does this.
            this.handleSearch('');
        });
    }
    
    loadContent() {
        // Combine all content from different categories dynamically
        this.allContent = Object.values(LIBRARY_CONTENT).flat();
        
        this.filteredContent = [...this.allContent];
    }
    
    handleCategoryChange(category) {
        this.currentCategory = category;
        this.updateActiveNavigation();
        this.filterContent();
        this.renderContent();
        
        // Update URL hash
        window.location.hash = category;
    }
    
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase();
        this.filterContent();
        this.renderContent();
    }
    
    handleSort(sortBy) {
        this.currentSort = sortBy;
        this.sortContent();
        this.renderContent();
    }
    
    filterContent() {
        let filtered = this.allContent;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === this.currentCategory);
        }
        
        // Filter by search term
        if (this.currentSearch) {
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(this.currentSearch) ||
                item.excerpt.toLowerCase().includes(this.currentSearch) ||
                item.tags.some(tag => tag.toLowerCase().includes(this.currentSearch))
            );
        }
        
        this.filteredContent = filtered;
        this.sortContent();
    }
    
    sortContent() {
        this.filteredContent.sort((a, b) => {
            switch (this.currentSort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'length':
                    return b.wordCount - a.wordCount;
                default:
                    return 0;
            }
        });
    }
    
    updateActiveNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current category
        const activeLink = document.querySelector(`[data-category="${this.currentCategory}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    renderContent() {
        const contentGrid = document.getElementById('contentGrid');
        const noResults = document.getElementById('noResults');
        
        if (!contentGrid) return;
        
        if (this.filteredContent.length === 0) {
            contentGrid.style.display = 'none';
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }
        
        contentGrid.style.display = 'grid';
        if (noResults) {
            noResults.style.display = 'none';
        }
        
        contentGrid.innerHTML = this.filteredContent.map(item => this.createContentCard(item)).join('');
    }
    
    createContentCard(item) {
        const date = new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const categoryLabel = this.getCategoryLabel(item.category);
        
        return `
            <article class="content-card" data-id="${item.id}" data-category="${item.category}">
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <span class="card-category">${categoryLabel}</span>
                        <span class="card-date">${date}</span>
                        <span class="card-length">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            ${item.wordCount} words • ${item.readingTime} min read
                        </span>
                    </div>
                </div>
                
                <p class="card-excerpt">${item.excerpt}</p>
                
                                        <div class="card-actions">
                            <button class="btn btn-primary read-btn" data-id="${item.id}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Read
                            </button>
                            ${item.downloadUrl && item.category === 'novels' ? `
                                <a href="${item.downloadUrl}" class="btn btn-secondary download-btn" download>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7,10 12,15 17,10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Download
                                </a>
                            ` : ''}
                        </div>
            </article>
        `;
    }
    
    getCategoryLabel(category) {
        const labels = {
            'novels': 'Novel',
            'notes': 'Note',
            'quotes': 'Quote'
        };
        return labels[category] || category;
    }
    
    displayFeaturedPassage() {
        const passageEl = document.getElementById('featuredPassage');
        const sourceEl = document.getElementById('featuredPassageSource');
    
        if (!passageEl || !sourceEl) return;
    
        // Get all content items that are quotes or have substantial excerpts
        const potentialPassages = this.allContent.filter(item => 
            item.category === 'quotes' || (item.excerpt && item.excerpt.length > 50)
        );
    
        if (potentialPassages.length === 0) {
            passageEl.firstChild.nodeValue = "The silence of this library is a story in itself.";
            return;
        }
    
        // Select a random passage
        // 2. It selects one random item from that collection.
        const randomItem = potentialPassages[Math.floor(Math.random() * potentialPassages.length)];
        const passageText = randomItem.excerpt || "No excerpt available.";

        // 3. It injects the text and the title into the HTML.
        passageEl.firstChild.nodeValue = ` ${passageText.trim()} `;
        sourceEl.textContent = `— ${randomItem.title}`;

    }

    openReadingModal(contentId) {
        const content = this.allContent.find(item => item.id === contentId);
        if (!content) return;
        
        // Trigger modal open event
        const event = new CustomEvent('openReadingModal', { detail: content });
        document.dispatchEvent(event);
    }
    
    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatReadingTime(minutes) {
        if (minutes < 1) return 'Less than 1 min';
        if (minutes === 1) return '1 min';
        return `${minutes} min`;
    }
    
    // Public methods for external use
    getContentById(id) {
        return this.allContent.find(item => item.id === id);
    }
    
    getAllContent() {
        return this.allContent;
    }
    
    getFilteredContent() {
        return this.filteredContent;
    }
    
    refreshContent() {
        this.loadContent();
        this.filterContent();
        this.renderContent();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.libraryApp = new LibraryApp();
    
    // Handle URL hash on page load
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        if (['all', 'novels', 'notes', 'quotes'].includes(category)) {
            window.libraryApp.handleCategoryChange(category);
        }
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        if (['all', 'novels', 'notes', 'quotes'].includes(category)) {
            window.libraryApp.handleCategoryChange(category);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LibraryApp;
}
