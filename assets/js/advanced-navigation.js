/**
 * Advanced Navigation Module
 * Provides breadcrumbs, search suggestions, and content filtering
 */

class AdvancedNavigationManager {
    constructor() {
        this.breadcrumbs = [];
        this.searchSuggestions = [];
        this.filters = new Map();
        this.currentView = 'all';
        this.init();
    }

    init() {
        this.setupBreadcrumbs();
        this.setupSearchSuggestions();
        this.setupAdvancedFilters();
        this.bindEvents();
    }

    setupBreadcrumbs() {
        let breadcrumbContainer = document.getElementById('breadcrumb-nav');
        if (!breadcrumbContainer) {
            breadcrumbContainer = document.createElement('nav');
            breadcrumbContainer.id = 'breadcrumb-nav';
            breadcrumbContainer.className = 'breadcrumb-nav';
            breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb navigation');
            
            const header = document.querySelector('.header');
            if (header) {
                header.parentNode.insertBefore(breadcrumbContainer, header.nextSibling);
            }
        }
        
        this.updateBreadcrumbs();
    }

    setupSearchSuggestions() {
        let suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'search-suggestions';
            suggestionsContainer.className = 'search-suggestions';
            suggestionsContainer.setAttribute('aria-live', 'polite');
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                const searchBox = searchInput.closest('.search-box');
                if (searchBox) {
                    searchBox.appendChild(suggestionsContainer);
                }
            }
        }
        
        this.setupSearchInput();
    }

    setupAdvancedFilters() {
        let filterContainer = document.getElementById('advanced-filters');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.id = 'advanced-filters';
            filterContainer.className = 'advanced-filters';
            
            const searchSection = document.querySelector('.search-section');
            if (searchSection) {
                searchSection.appendChild(filterContainer);
            }
        }
        
        this.createFilterControls();
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.handleSearchInput(event.target.value);
            });
            
            searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });
            
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSearchSuggestions();
                }, 200);
            });
        }
        
        this.setupFilterEvents();
        this.setupNavigationEvents();
    }

    updateBreadcrumbs() {
        const container = document.getElementById('breadcrumb-nav');
        if (!container) return;
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';
        
        const homeItem = this.createBreadcrumbItem('Home', '#', true);
        breadcrumbList.appendChild(homeItem);
        
        if (this.currentView !== 'all') {
            const viewItem = this.createBreadcrumbItem(
                this.capitalizeFirst(this.currentView), 
                `#${this.currentView}`, 
                false
            );
            breadcrumbList.appendChild(viewItem);
        }
        
        container.innerHTML = '';
        container.appendChild(breadcrumbList);
    }

    createBreadcrumbItem(text, href, isHome = false) {
        const item = document.createElement('li');
        item.className = 'breadcrumb-item';
        
        if (isHome) {
            item.innerHTML = `
                <a href="${href}" class="breadcrumb-link home-link" aria-label="Go to home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                </a>
            `;
        } else {
            item.innerHTML = `
                <a href="${href}" class="breadcrumb-link">${text}</a>
            `;
        }
        
        return item;
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }
        
        this.generateSearchSuggestions(query);
        this.showSearchSuggestions();
    }

    generateSearchSuggestions(query) {
        const contentData = window.contentData || [];
        const suggestions = [];
        
        contentData.forEach(item => {
            const titleMatch = item.title?.toLowerCase().includes(query.toLowerCase());
            const contentMatch = item.content?.toLowerCase().includes(query.toLowerCase());
            const categoryMatch = item.category?.toLowerCase().includes(query.toLowerCase());
            
            if (titleMatch || contentMatch || categoryMatch) {
                suggestions.push({
                    text: item.title,
                    category: item.category,
                    type: titleMatch ? 'title' : contentMatch ? 'content' : 'category',
                    relevance: this.calculateRelevance(item, query)
                });
            }
        });
        
        this.searchSuggestions = suggestions
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8);
        
        this.renderSearchSuggestions();
    }

    calculateRelevance(item, query) {
        let relevance = 0;
        const queryLower = query.toLowerCase();
        
        if (item.title?.toLowerCase().includes(queryLower)) {
            relevance += 10;
        }
        
        if (item.content?.toLowerCase().includes(queryLower)) {
            relevance += 5;
        }
        
        if (item.category?.toLowerCase().includes(queryLower)) {
            relevance += 3;
        }
        
        if (item.title?.toLowerCase() === queryLower) {
            relevance += 5;
        }
        
        return relevance;
    }

    renderSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (!container) return;
        
        if (this.searchSuggestions.length === 0) {
            container.innerHTML = '<div class="no-suggestions">No suggestions found</div>';
            return;
        }
        
        const suggestionsList = document.createElement('ul');
        suggestionsList.className = 'suggestions-list';
        
        this.searchSuggestions.forEach(suggestion => {
            const item = document.createElement('li');
            item.className = 'suggestion-item';
            
            const icon = this.getSuggestionIcon(suggestion.type);
            const category = suggestion.category ? `<span class="suggestion-category">${suggestion.category}</span>` : '';
            
            item.innerHTML = `
                <button class="suggestion-button" data-suggestion="${suggestion.text}">
                    <span class="suggestion-icon">${icon}</span>
                    <span class="suggestion-text">${suggestion.text}</span>
                    ${category}
                </button>
            `;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
            
            suggestionsList.appendChild(item);
        });
        
        container.innerHTML = '';
        container.appendChild(suggestionsList);
    }

    getSuggestionIcon(type) {
        const icons = {
            title: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>',
            content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>',
            category: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/></svg>'
        };
        
        return icons[type] || icons.content;
    }

    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = suggestion.text;
            searchInput.focus();
            
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
        
        this.hideSearchSuggestions();
    }

    showSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) {
            container.classList.add('show');
        }
    }

    hideSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) {
            container.classList.remove('show');
        }
    }

    createFilterControls() {
        const container = document.getElementById('advanced-filters');
        if (!container) return;
        
        container.innerHTML = `
            <div class="filter-header">
                <h3 class="filter-title">Advanced Filters</h3>
                <button class="filter-toggle" id="filterToggle" aria-label="Toggle filters">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                    </svg>
                </button>
            </div>
            <div class="filter-content" id="filterContent">
                <div class="filter-group">
                    <label class="filter-label">Date Range</label>
                    <div class="filter-inputs">
                        <input type="date" id="dateFrom" class="filter-input" placeholder="From">
                        <input type="date" id="dateTo" class="filter-input" placeholder="To">
                    </div>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Content Length</label>
                    <select id="lengthFilter" class="filter-select">
                        <option value="">Any length</option>
                        <option value="short">Short (< 1000 words)</option>
                        <option value="medium">Medium (1000-5000 words)</option>
                        <option value="long">Long (> 5000 words)</option>
                    </select>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-secondary" id="clearFilters">Clear All</button>
                    <button class="btn btn-primary" id="applyFilters">Apply Filters</button>
                </div>
            </div>
        `;
        
        this.setupFilterEvents();
    }

    setupFilterEvents() {
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilters();
            });
        }
        
        const applyFilters = document.getElementById('applyFilters');
        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    toggleFilters() {
        const content = document.getElementById('filterContent');
        const toggle = document.getElementById('filterToggle');
        
        if (content) {
            content.classList.toggle('show');
            toggle?.classList.toggle('active');
        }
    }

    applyFilters() {
        const filters = this.collectFilters();
        this.filters = filters;
        
        this.filterContent(filters);
        this.updateBreadcrumbs();
        
        if (window.userFeedbackManager) {
            window.userFeedbackManager.showSuccess('Filters applied successfully');
        }
    }

    collectFilters() {
        const filters = new Map();
        
        const dateFrom = document.getElementById('dateFrom')?.value;
        const dateTo = document.getElementById('dateTo')?.value;
        if (dateFrom) filters.set('dateFrom', dateFrom);
        if (dateTo) filters.set('dateTo', dateTo);
        
        const lengthFilter = document.getElementById('lengthFilter')?.value;
        if (lengthFilter) filters.set('length', lengthFilter);
        
        return filters;
    }

    filterContent(filters) {
        console.log('Filters applied:', Object.fromEntries(filters));
        
        if (window.LibrarySearch) {
            window.LibrarySearch.search(document.getElementById('searchInput')?.value || '');
        }
    }

    clearFilters() {
        const inputs = document.querySelectorAll('.filter-input, .filter-select');
        inputs.forEach(input => {
            input.value = '';
        });
        
        this.filters.clear();
        this.filterContent(new Map());
        
        if (window.userFeedbackManager) {
            window.userFeedbackManager.showInfo('All filters cleared');
        }
    }

    setupNavigationEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const category = link.dataset.category;
                this.navigateToCategory(category);
            });
        });
    }

    navigateToCategory(category) {
        this.currentView = category;
        this.updateBreadcrumbs();
        this.updateActiveNavigation(category);
        
        if (window.accessibilityManager) {
            window.accessibilityManager.announceContentUpdate(category, 'all');
        }
    }

    updateActiveNavigation(category) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.setAttribute('aria-current', 'false');
            }
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    destroy() {
        const containers = ['breadcrumb-nav', 'search-suggestions', 'advanced-filters'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.remove();
            }
        });
    }
}

const advancedNavigationManager = new AdvancedNavigationManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedNavigationManager;
} else {
    window.AdvancedNavigationManager = AdvancedNavigationManager;
    window.advancedNavigationManager = advancedNavigationManager;
}
