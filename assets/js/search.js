/**
 * Search and Filter Functionality for My Silent Library
 * Handles advanced search, filtering, and tag-based search
 */

class LibrarySearch {
    constructor() {
        this.searchIndex = [];
        this.searchHistory = [];
        this.maxSearchHistory = 10;
        
        this.init();
    }
    
    init() {
        this.buildSearchIndex();
        this.setupAdvancedSearch();
        this.setupTagFiltering();
    }
    
    buildSearchIndex() {
        // Create a searchable index from all content
        this.searchIndex = [];
        
        Object.values(LIBRARY_CONTENT).flat().forEach(item => {
            // Create searchable text from various fields
            const searchableText = [
                item.title,
                item.excerpt,
                item.content.replace(/<[^>]*>/g, ' '), // Remove HTML tags
                item.tags.join(' '),
                item.category
            ].join(' ').toLowerCase();
            
            // Create search index entry
            this.searchIndex.push({
                id: item.id,
                item: item,
                searchableText: searchableText,
                searchScore: 0
            });
        });
    }
    
    setupAdvancedSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        // Add search suggestions
        this.setupSearchSuggestions(searchInput);
        
        // Add search filters
        this.setupSearchFilters();
    }
    
    setupSearchSuggestions(searchInput) {
        let suggestionTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(suggestionTimeout);
            
            const query = e.target.value.trim();
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }
            
            // Debounce search suggestions
            suggestionTimeout = setTimeout(() => {
                this.showSearchSuggestions(query);
            }, 300);
        });
        
        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions(e.key);
            } else if (e.key === 'Enter') {
                this.selectSuggestion();
            } else if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    setupSearchFilters() {
        // Create filter container if it doesn't exist
        let filterContainer = document.querySelector('.search-filters');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.className = 'search-filters';
            filterContainer.style.display = 'none';
            
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.appendChild(filterContainer);
            }
        }
        
        // Add filter toggle button
        const filterToggle = document.createElement('button');
        filterToggle.className = 'filter-toggle-btn';
        filterToggle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="21" y1="3" x2="3" y2="21"/>
                <line x1="21" y1="3" x2="21" y2="21"/>
            </svg>
            Advanced Filters
        `;
        
        filterToggle.addEventListener('click', () => {
            this.toggleAdvancedFilters();
        });
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(filterToggle);
        }
    }
    
    setupTagFiltering() {
        // Create tag cloud for quick filtering
        this.createTagCloud();
    }
    
    createTagCloud() {
        const tagCloud = document.createElement('div');
        tagCloud.className = 'tag-cloud';
        tagCloud.style.display = 'none';
        
        // Get all unique tags
        const allTags = new Set();
        Object.values(LIBRARY_CONTENT).flat().forEach(item => {
            item.tags.forEach(tag => allTags.add(tag));
        });
        
        // Create tag buttons
        const tagButtons = Array.from(allTags).map(tag => `
            <button class="tag-filter-btn" data-tag="${tag}">${tag}</button>
        `).join('');
        
        tagCloud.innerHTML = `
            <h4>Filter by Tags</h4>
            <div class="tag-buttons">${tagButtons}</div>
        `;
        
        // Add event listeners to tag buttons
        tagCloud.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter-btn')) {
                const tag = e.target.dataset.tag;
                this.filterByTag(tag);
            }
        });
        
        // Insert tag cloud after search section
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.appendChild(tagCloud);
        }
    }
    
    showSearchSuggestions(query) {
        const suggestions = this.getSearchSuggestions(query);
        if (suggestions.length === 0) return;
        
        this.hideSuggestions();
        
        const suggestionList = document.createElement('ul');
        suggestionList.className = 'search-suggestions';
        
        suggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.className = 'suggestion-item';
            li.dataset.index = index;
            
            // Highlight matching text
            const highlightedTitle = this.highlightMatch(suggestion.item.title, query);
            const highlightedExcerpt = this.highlightMatch(suggestion.item.excerpt.substring(0, 100), query);
            
            li.innerHTML = `
                <div class="suggestion-title">${highlightedTitle}</div>
                <div class="suggestion-excerpt">${highlightedExcerpt}...</div>
                <div class="suggestion-meta">
                    <span class="suggestion-category">${suggestion.item.category}</span>
                    <span class="suggestion-date">${this.formatDate(suggestion.item.date)}</span>
                </div>
            `;
            
            li.addEventListener('click', () => {
                this.selectSuggestion(suggestion.item.id);
            });
            
            suggestionList.appendChild(li);
        });
        
        // Position suggestions below search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.parentNode.appendChild(suggestionList);
        }
    }
    
    hideSuggestions() {
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
    }
    
    getSearchSuggestions(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        this.searchIndex.forEach(entry => {
            let score = 0;
            const text = entry.searchableText;
            
            // Exact title match
            if (entry.item.title.toLowerCase().includes(queryLower)) {
                score += 100;
            }
            
            // Tag matches
            const tagMatches = entry.item.tags.filter(tag => 
                tag.toLowerCase().includes(queryLower)
            ).length;
            score += tagMatches * 50;
            
            // Content matches
            if (text.includes(queryLower)) {
                score += 10;
            }
            
            // Word boundary matches
            const words = queryLower.split(' ').filter(word => word.length > 2);
            words.forEach(word => {
                if (text.includes(word)) {
                    score += 5;
                }
            });
            
            if (score > 0) {
                results.push({
                    ...entry,
                    searchScore: score
                });
            }
        });
        
        // Sort by relevance score and return top 5
        return results
            .sort((a, b) => b.searchScore - a.searchScore)
            .slice(0, 5);
    }
    
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    selectSuggestion(contentId) {
        // Open the selected content
        if (window.libraryApp) {
            window.libraryApp.openReadingModal(contentId);
        }
        
        this.hideSuggestions();
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Add to search history
        this.addToSearchHistory(contentId);
    }
    
    navigateSuggestions(direction) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;
        
        const currentActive = document.querySelector('.suggestion-item.active');
        let nextIndex = 0;
        
        if (currentActive) {
            const currentIndex = parseInt(currentActive.dataset.index);
            if (direction === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % suggestions.length;
            } else {
                nextIndex = currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
            }
        }
        
        // Update active suggestion
        suggestions.forEach(s => s.classList.remove('active'));
        suggestions[nextIndex].classList.add('active');
    }
    
    toggleAdvancedFilters() {
        const filterContainer = document.querySelector('.search-filters');
        const tagCloud = document.querySelector('.tag-cloud');
        
        if (filterContainer && tagCloud) {
            const isVisible = filterContainer.style.display !== 'none';
            
            filterContainer.style.display = isVisible ? 'none' : 'block';
            tagCloud.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    filterByTag(tag) {
        // Update search input with tag
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = tag;
            searchInput.dispatchEvent(new Event('input'));
        }
        
        // Add to search history
        this.addToSearchHistory(tag);
    }
    
    addToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only recent searches
        if (this.searchHistory.length > this.maxSearchHistory) {
            this.searchHistory = this.searchHistory.slice(0, this.maxSearchHistory);
        }
        
        // Save to localStorage
        this.saveSearchHistory();
    }
    
    saveSearchHistory() {
        try {
            localStorage.setItem('librarySearchHistory', JSON.stringify(this.searchHistory));
        } catch (e) {
            console.warn('Could not save search history:', e);
        }
    }
    
    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('librarySearchHistory');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load search history:', e);
            this.searchHistory = [];
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Public methods
    search(query) {
        if (!query || query.trim().length === 0) {
            return this.searchIndex.map(entry => entry.item);
        }
        
        const results = this.getSearchSuggestions(query.trim());
        return results.map(result => result.item);
    }
    
    getSearchHistory() {
        return [...this.searchHistory];
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.librarySearch = new LibrarySearch();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LibrarySearch;
}
