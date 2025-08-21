/**
 * Professional Search Component for My Silent Library.
 * Handles user input, debouncing, and fetching results from a backend API.
 */

const SEARCH_CONSTANTS = {
    ACTIVE_CLASS: 'active',
    SUGGESTION_ITEM_SELECTOR: '.suggestion-item',
    SUGGESTIONS_CONTAINER_SELECTOR: '.search-suggestions',
    HISTORY_ITEM_SELECTOR: '.history-item',
    REMOVE_HISTORY_BTN_CLASS: 'remove-history-btn',
    SEARCH_CLEARED_EVENT: 'search:cleared',
};

class LibrarySearch {
    constructor(contentData) {
        this.searchHistory = [];
        this.maxSearchHistory = 10;
        this.contentData = contentData || {};

        // Cache DOM elements for performance and maintainability
        this.searchInput = document.getElementById('searchInput');
        this.searchContainer = this.searchInput ? this.searchInput.closest('.search-container') : null;
        this.filterToggleButton = document.getElementById('filterToggleBtn');
        this.tagButtonsContainer = document.getElementById('tagButtonsContainer');
        this.searchStatusAnnouncer = document.getElementById('search-status');

        // A mock data source for demonstration purposes.
        // In a real application, this data would not be stored on the client side.
        this.MOCK_DATA = Object.values(this.contentData).flat().map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: item.category,
            date: item.date
        }));

        this.init();
    }

    init() {
        if (!this.searchInput) {
            console.error("Search input not found. Search component cannot initialize.");
            return;
        }
        this.loadSearchHistory();
        this.setupAdvancedSearch();
        this.setupTagFiltering();
    }

    setupAdvancedSearch() {
        // Enhance accessibility for a combobox pattern
        this.searchInput.setAttribute('role', 'combobox');
        this.searchInput.setAttribute('aria-autocomplete', 'list');
        this.searchInput.setAttribute('aria-haspopup', 'listbox');
        this.searchInput.setAttribute('aria-expanded', 'false');
        this.searchInput.setAttribute('aria-controls', 'search-suggestions-list');

        // Add search suggestions
        this.setupSearchSuggestions();
        
        // Add search filters
        this.setupSearchFilters();
    }

    setupSearchSuggestions() {
        let suggestionTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(suggestionTimeout);
            
            // Sanitize input to prevent XSS if the query were reflected in the DOM insecurely.
            const query = this._sanitizeInput(e.target.value).trim();

            if (query.length === 0) {
                // When input is cleared, show history if available
                if (this.searchHistory.length > 0) {
                    this.showSearchHistorySuggestions();
                } else {
                    this.hideSuggestions();
                }

                // Announce that the search has been cleared so the main app can reset the view.
                document.dispatchEvent(new CustomEvent('search:cleared'));
                return;
            }
            if (query.length < 2) { // Avoid searching for single characters
                this.hideSuggestions();
                return;
            }
            
            // Debounce search suggestions
            suggestionTimeout = setTimeout(() => {
                this._fetchFromBackend(query);
            }, 300);
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions(e.key);
            } else if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                const activeSuggestion = document.querySelector(`${SEARCH_CONSTANTS.SUGGESTION_ITEM_SELECTOR}.${SEARCH_CONSTANTS.ACTIVE_CLASS}`);
                if (activeSuggestion) {
                    const contentId = activeSuggestion.dataset.id;
                    const title = activeSuggestion.querySelector('.suggestion-title')?.textContent || activeSuggestion.textContent;
                    this.selectSuggestion(contentId, title);
                }
            } else if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });

        // Show history on focus if input is empty
        this.searchInput.addEventListener('focus', (e) => {
            const query = this.searchInput.value.trim();
            if (query.length === 0 && this.searchHistory.length > 0) {
                this.showSearchHistorySuggestions();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => { // This listener is broad, but acceptable for this component.
            if (!this.searchContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    setupSearchFilters() {
        // Note: The .search-filters container is now expected to be in index.html
        if (!this.filterToggleButton) return;

        this.filterToggleButton.addEventListener('click', () => {
            this.toggleAdvancedFilters();
        });
    }

    setupTagFiltering() {
        // Note: The .tag-cloud container is now expected to be in index.html
        this.createTagCloud();
    }

    createTagCloud() {
        if (!this.tagButtonsContainer) return;
        
        // In a real backend-driven app, tags would be fetched from an API endpoint (e.g., /api/tags).
        // Here, we derive them from the client-side mock data as a placeholder.
        // Get all unique tags
        const allTags = new Set();
        Object.values(this.contentData).flat().forEach(item => {
            item.tags.forEach(tag => allTags.add(tag));
        });

        // Create tag buttons
        const tagButtons = Array.from(allTags).map(tag => `
            <button class="tag-filter-btn" data-tag="${tag}">${tag}</button>
        `).join('');

        this.tagButtonsContainer.innerHTML = tagButtons;

        // Add event listeners to tag buttons
        this.tagButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter-btn')) {
                const tag = e.target.dataset.tag;
                this._performSearchWithQuery(tag);
            }
        });
    }

    /**
     * A placeholder for how you would fetch from a backend API.
     * @param {string} query The search query.
     */
    async _fetchFromBackend(query) {
        this.showLoadingState();

        try {
            // const sanitizedQuery = encodeURIComponent(query);
            // const response = await fetch(`/api/search?q=${sanitizedQuery}`);
            // if (!response.ok) throw new Error('Network response was not ok');
            // const results = await response.json();
            
            // For demonstration, we use a mock fetch. Replace this with the real fetch above.
            const results = await this._getMockResults(query);

            this.showSearchSuggestions(query, results); 
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            this.showErrorState('Failed to fetch results.');
        }
    }

    /**
     * Simulates fetching from a backend by filtering mock data.
     * @param {string} query The search query.
     * @returns {Promise<Array>} A promise that resolves with the mock results.
     */
    async _getMockResults(query) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const queryLower = query.toLowerCase();
        return this.MOCK_DATA.filter(item => 
            item.title.toLowerCase().includes(queryLower) ||
            item.excerpt.toLowerCase().includes(queryLower)
        );
    }

    showSearchSuggestions(query, suggestions) {        
        // Handle the "no results" case gracefully inside the suggestion box
        if (suggestions.length === 0) {
            this.hideSuggestions();
            const suggestionList = document.createElement('ul');
            suggestionList.className = 'search-suggestions';
            suggestionList.innerHTML = `<li class="suggestion-item no-results-item">No results found for "${query}"</li>`;
            
            if (this.searchInput) {
                this.searchInput.parentNode.appendChild(suggestionList);
            }
            this._updateAriaStatus(`No results found for "${query}"`);
            return;
        }

        this.hideSuggestions();

        const suggestionList = document.createElement('ul');
        suggestionList.id = 'search-suggestions-list';
        suggestionList.className = 'search-suggestions';
        suggestionList.setAttribute('role', 'listbox');

        suggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.id = `suggestion-${index}`;
            li.className = 'suggestion-item'; // This class is now styled in search.css
            li.setAttribute('role', 'option');
            li.dataset.index = index;
            li.dataset.id = suggestion.id; // Add content ID for selection

            // Highlight matching text
            const highlightedTitle = this.highlightMatch(suggestion.title, query);
            const highlightedExcerpt = this.highlightMatch(suggestion.excerpt.substring(0, 100), query);

            li.innerHTML = `
                <div class="suggestion-title">${highlightedTitle}</div>
                <div class="suggestion-excerpt">${highlightedExcerpt}...</div>
                <div class="suggestion-meta">
                    <span class="suggestion-category">${suggestion.category}</span>
                    <span class="suggestion-date">${formatDate(suggestion.date)}</span>
                </div>
            `;

            li.addEventListener('click', () => {
                this.selectSuggestion(suggestion.id, suggestion.title);
            });

            suggestionList.appendChild(li);
        });

        // Position suggestions below search input
        if (this.searchInput) {
            this.searchInput.setAttribute('aria-expanded', 'true');
            this.searchInput.setAttribute('aria-controls', 'search-suggestions-list');
            this.searchInput.parentNode.appendChild(suggestionList);
        }
        this._updateAriaStatus(`${suggestions.length} results found.`);
    }

    showLoadingState() {
        this.hideSuggestions();
        if (this.searchInput) this.searchInput.setAttribute('aria-expanded', 'false');
        const suggestionList = document.createElement('ul');
        suggestionList.className = 'search-suggestions';
        suggestionList.innerHTML = `<li class="suggestion-item loading-item">Searching...</li>`;
        
        if (this.searchInput) {
            this.searchInput.parentNode.appendChild(suggestionList);
        }
    }

    showErrorState(message) {
        this.hideSuggestions();
        const suggestionList = document.createElement('ul');
        suggestionList.className = 'search-suggestions';
        suggestionList.innerHTML = `<li class="suggestion-item no-results-item">${message}</li>`;

        if (this.searchInput) {
            this.searchInput.parentNode.appendChild(suggestionList);
        }
        this._updateAriaStatus(message);
    }

    showSearchHistorySuggestions() {
        const history = this.getSearchHistory();
        if (history.length === 0) return;

        this.hideSuggestions();
        if (this.searchInput) this.searchInput.setAttribute('aria-expanded', 'true');

        const suggestionList = document.createElement('ul');
        suggestionList.className = 'search-suggestions history-suggestions';

        // Add a title for the history section
        suggestionList.innerHTML = `<li class="suggestion-title-header">Recent Searches</li>`;

        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'suggestion-item history-item'; // The container for the text and button
            li.dataset.query = item; // Store the query on the element

            // Add the text and the remove button
            li.innerHTML = `
                <span>${item}</span>
                <button class="remove-history-btn" aria-label="Remove ${item} from history">&times;</button>
            `;
            suggestionList.appendChild(li);
        });

        // Use a single delegated event listener for efficiency
        suggestionList.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains(SEARCH_CONSTANTS.REMOVE_HISTORY_BTN_CLASS)) {
                this.removeSearchHistoryItem(target.closest(SEARCH_CONSTANTS.HISTORY_ITEM_SELECTOR).dataset.query);
            } else if (target.closest(SEARCH_CONSTANTS.HISTORY_ITEM_SELECTOR)) {
                this._performSearchWithQuery(target.closest(SEARCH_CONSTANTS.HISTORY_ITEM_SELECTOR).dataset.query);
            }
        });

        // Add a "Clear History" button
        const clearLi = document.createElement('li');
        clearLi.className = 'suggestion-action';
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear History';
        clearButton.className = 'clear-history-btn';
        clearButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearSearchHistory();
            this.hideSuggestions();
        });
        clearLi.appendChild(clearButton);
        suggestionList.appendChild(clearLi);

        if (this.searchInput) {
            this.searchInput.parentNode.appendChild(suggestionList);
        }
    }

    hideSuggestions() {
        if (this.searchInput) this.searchInput.setAttribute('aria-expanded', 'false');
        const existingSuggestions = document.querySelector(SEARCH_CONSTANTS.SUGGESTIONS_CONTAINER_SELECTOR);
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
    }
    
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    selectSuggestion(contentId, title) {
        if (!contentId) return;

        // Announce that a selection has been made.
        // The main application should listen for this event to open the content.
        document.dispatchEvent(new CustomEvent('search:selection', {
            detail: { contentId }
        }));

        this.hideSuggestions();
        
        // Add to search history
        if (title) {
            this.addToSearchHistory(title);
        }
    }
    
    navigateSuggestions(direction) {
        const suggestions = document.querySelectorAll(SEARCH_CONSTANTS.SUGGESTION_ITEM_SELECTOR);
        if (suggestions.length === 0) return;
        
        const currentActive = document.querySelector(`${SEARCH_CONSTANTS.SUGGESTION_ITEM_SELECTOR}.${SEARCH_CONSTANTS.ACTIVE_CLASS}`);
        let nextIndex = 0;
        
        if (currentActive) {
            const currentIndex = parseInt(currentActive.dataset.index);
            if (direction === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % suggestions.length;
            } else {
                nextIndex = (currentIndex - 1 + suggestions.length) % suggestions.length;
            }
        }

        // Update active suggestion
        suggestions.forEach(s => {
            s.classList.remove(SEARCH_CONSTANTS.ACTIVE_CLASS);
            s.setAttribute('aria-selected', 'false');
        });
        suggestions[nextIndex].classList.add(SEARCH_CONSTANTS.ACTIVE_CLASS);
        suggestions[nextIndex].setAttribute('aria-selected', 'true');
        this.searchInput.setAttribute('aria-activedescendant', suggestions[nextIndex].id);
    }
    
    toggleAdvancedFilters() {
        const filterContainer = document.getElementById('searchFilters');
        const tagCloud = document.getElementById('tagCloud');
        
        if (filterContainer && tagCloud) {
            filterContainer.classList.toggle('is-visible');
            tagCloud.classList.toggle('is-visible');
        }
    }
    
    _performSearchWithQuery(query) {
        // Update search input with tag
        if (this.searchInput) {
            this.searchInput.value = query;
            this.searchInput.dispatchEvent(new Event('input'));
        }
        
        // Add to search history
        this.addToSearchHistory(query);
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
    
    getSearchHistory() {
        return [...this.searchHistory];
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }

    removeSearchHistoryItem(query) {
        if (!query) return;
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        this.saveSearchHistory();

        // Re-render the history suggestions to reflect the removal instantly
        if (this.searchHistory.length > 0) {
            this.showSearchHistorySuggestions();
        } else {
            this.hideSuggestions();
        }
    }

    /**
     * Sanitizes user input to prevent XSS.
     * @param {string} str The string to sanitize.
     * @returns {string} The sanitized string.
     */
    _sanitizeInput(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    _updateAriaStatus(message) {
        const statusEl = document.getElementById('search-status');
        if (statusEl) statusEl.textContent = message;
    }
}

/**
 * Formats a date string into a more readable format (e.g., "Aug 21, 2025").
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted date.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.librarySearch = new LibrarySearch(window.LIBRARY_CONTENT);
});
