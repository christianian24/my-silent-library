/**
 * Main Application JavaScript for My Silent Library
 * Handles content rendering, navigation, and core functionality
 */

class LibraryApp {
    constructor() {
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.allContent = [];
        this.filteredContent = [];
        this.featuredPassages = [];
        this.currentPassageIndex = 0;
        this.featuredPassageInterval = null;
        this.contentContainer = null;
        this.searchResultsContainer = null;

        this.spineStyleMap = {
            'banded': 0, 'gilded': 1, 'gilded-chevron': 2, 'gilded-dots': 3,
            'double-band': 4, 'checkered-gilded-corners': 5, 'gilded-checkers': 6, 'diamond': 7,
            'crosshatch': 8, 'leather-bound': 9, 'zigzag': 10, 'gilded-texture': 11, 'ornate-speckle': 12,
            'art-deco': 13, 'cosmic': 14, 'tooled-leather': 15, 'decorated-vellum': 16, 'embossed-star-atlas': 17,
            'raised-bands': 18, 'silk-brocade': 19, 'inlaid-wood': 20,
            'geometric-mosaic': 21, 'moonbeam-deco': 22, 'sunburst-deco': 23, 'geometric-weave': 24, 'gilded-watercolor': 25,
            'gilded-border': 26, 'crosshatch-linen': 27, 'double-band-classic': 28, 'embossed-leather': 29,
            'divider-bands': 30, 'ornamental-frame': 31, 'luxury-foil': 32, 'gilded-corners': 33,
            'marbled-ink': 34, 'tartan-plaid': 35, 'stitched-leather': 36, 'filigree-bands': 37
        };

        this.init();
    }
    
    init() {
        this.searchResultsContainer = document.getElementById('searchResultsContainer');
        this.contentContainer = document.getElementById('bookshelfContainer');
        this.setupEventListeners();
        this.loadContent();
        // Covers are lazy-loaded via data-src; avoid eager preloading to save bandwidth
        this.renderContent();
        this.setupFeaturedPassages();
        this.renderShowcaseShelf();
    }
    
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Featured Passage Navigation
        const prevPassageBtn = document.getElementById('prevPassage');
        const nextPassageBtn = document.getElementById('nextPassage');

        if (prevPassageBtn) {
            prevPassageBtn.addEventListener('click', () => {
                this.cycleFeaturedPassage('prev');
                this.startFeaturedPassageCycle(); // Reset timer on manual click
            });
        }
        if (nextPassageBtn) {
            nextPassageBtn.addEventListener('click', () => {
                this.cycleFeaturedPassage('next');
                this.startFeaturedPassageCycle(); // Reset timer on manual click
            });
        }

        // Event Delegation for content container (contentGrid or shelf)
        if (this.contentContainer) {
            this.contentContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.book-card');
                if (card && !e.target.closest('.btn')) {
                    this.openReadingModal(card.dataset.id, card);
                }
            });
            this.contentContainer.addEventListener('keydown', (e) => {
                const card = e.target.closest('.book-card');
                if (!card || !card.dataset.id) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openReadingModal(card.dataset.id, card);
                }
            });
        }

        // Event delegation for search results
        if (this.searchResultsContainer) {
            const handleSelection = (target) => {
                const resultItem = target.closest('.search-result-item');
                if (resultItem && resultItem.dataset.id) {
                    // This event is caught by another listener in this file to open the modal
                    // and by nav.js to close the search modal.
                    document.dispatchEvent(new CustomEvent('search:selection', { 
                        detail: { contentId: resultItem.dataset.id } 
                    }));
                }
            };

            this.searchResultsContainer.addEventListener('click', (e) => handleSelection(e.target));
            this.searchResultsContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelection(e.target);
                }
            });
        }

        // Listen for custom events from the search component
        document.addEventListener('search:selection', (e) => {
            const sourceElement = this.contentContainer.querySelector(`.book-card[data-id="${e.detail.contentId}"]`);
            this.openReadingModal(e.detail.contentId, sourceElement);
        });

        document.addEventListener('search:cleared', () => {
            // When the search component clears, reset the main view.
            // Calling handleSearch with an empty string does this.
            this.handleSearch('');
        });

        // Listen for category changes from the navigation component
        document.addEventListener('categoryChanged', (e) => {
            this.handleCategoryChange(e.detail.category);
        });

        // Observer to clear search when the modal is closed, ensuring it's always clean.
        // This handles all close actions: Escape key, clicking overlay, or selecting a book.
        const searchModal = document.getElementById('searchModal');
        if (searchModal && searchInput) { // searchInput is defined at the top of this function
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'hidden') {
                        const isHidden = searchModal.hasAttribute('hidden');
                        if (isHidden) {
                            // The modal has been closed. Clear the input and results.
                            searchInput.value = '';
                            this.handleSearch(''); // This clears the results container
                        }
                    }
                });
            });

            observer.observe(searchModal, { attributes: true });
        }
    }
    
    loadContent() {
        // Combine all content from different categories dynamically
        this.allContent = Object.values(LIBRARY_CONTENT).flat();
        
        this.filteredContent = [...this.allContent];
    }
    
    handleCategoryChange(category) {
        this.currentCategory = category;
        this.filterContent();
        this.renderContent();
        
        // Update URL hash
        window.location.hash = category;
        this.updateActiveNavigation(category);
    }
    
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm.toLowerCase().trim();

        if (!this.searchResultsContainer) return;

        if (!this.currentSearch) {
            this.searchResultsContainer.innerHTML = '';
            // When search is cleared, the search modal is empty, but the main page is unaffected.
            return;
        }

        // Filter all content for search results
        const results = this.allContent.filter(item => 
            item.title.toLowerCase().includes(this.currentSearch) ||
            item.excerpt.toLowerCase().includes(this.currentSearch) ||
            item.tags.some(tag => tag.toLowerCase().includes(this.currentSearch))
        );
        
        this.renderSearchResults(results);
    }
    
    filterContent() {
        let filtered = this.allContent;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === this.currentCategory);
        }
        
        // Search filtering is now handled separately in `handleSearch` and does not
        // affect the main bookshelf view. This keeps the main content static while
        // the user is searching in the modal.
        
        this.filteredContent = filtered;
        this.sortContent();
    }
    
    sortContent() {
        // Default sort by date descending (already present)
        this.filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    updateActiveNavigation(category) {
        const navContainer = document.querySelector('.side-nav');
        if (!navContainer) return;

        // Remove active class from all nav links
        navContainer.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the current category's link
        const activeLink = navContainer.querySelector(`.nav-link[data-category="${category}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    renderContent() {
        const bookshelfContainer = document.getElementById('bookshelfContainer');
        const noResults = document.getElementById('noResults');

        if (!bookshelfContainer) return;

        if (this.filteredContent.length === 0) {
            bookshelfContainer.style.display = 'none';
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        bookshelfContainer.style.display = 'block';
        if (noResults) noResults.style.display = 'none';

        // Group by category and render as shelves
        const grouped = this.filteredContent.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});

        const sections = Object.keys(grouped).map(cat => {
            const items = grouped[cat].map(i => this.createContentCard(i)).join('');
            const desc = this.getCategoryDescription(cat);
            return `<section class="shelf-wrapper" data-category="${cat}"><h3 class="shelf-heading">${this.getCategoryLabel(cat)}</h3><div class="shelf-desc">${desc}</div><div class="shelf">${items}</div></section>`;
        }).join('');

        bookshelfContainer.innerHTML = sections;
        this.applyCardStaggerAnimation(bookshelfContainer);
    }

    renderSearchResults(results) {
        if (!this.searchResultsContainer) return;

        if (results.length === 0) {
            this.searchResultsContainer.innerHTML = `<div class="search-no-results">No books match your search.</div>`;
            return;
        }

        const resultsHtml = results.map(item => `
            <li class="search-result-item" data-id="${item.id}" tabindex="0" role="button" aria-label="Open ${this.sanitizeHtml(item.title)}">
                <div class="search-result-title">${this.sanitizeHtml(item.title)}</div>
                <p class="search-result-excerpt">${this.sanitizeHtml(item.excerpt)}</p>
            </li>
        `).join('');

        this.searchResultsContainer.innerHTML = `<ul class="search-results-list">${resultsHtml}</ul>`;
    }

    renderShowcaseShelf() {
        const showcaseContainer = document.getElementById('showcaseContainer');
        if (!showcaseContainer) return;

        // The scroller is now a child of the container
        let scroller = showcaseContainer.querySelector('.showcase-scroller');
        if (!scroller) {
            // If the scroller div isn't in the HTML, create it for robustness
            scroller = document.createElement('div');
            scroller.className = 'showcase-scroller';
            showcaseContainer.appendChild(scroller);
        }

        // Sort all books alphabetically for a consistent order in the showcase
        const allBooksSorted = [...this.allContent].sort((a, b) => a.title.localeCompare(b.title));

        // Create a version of the card specifically for the showcase
        const allItemsHtml = allBooksSorted.map(item => this.createShowcaseCard(item)).join('');

        // Duplicate the content for a seamless, infinite loop
        scroller.innerHTML = allItemsHtml + allItemsHtml;

        // Set a CSS custom property for the animation duration
        showcaseContainer.style.setProperty('--item-count', allBooksSorted.length);
    }

    createShowcaseCard(item) {
        const spineInfo = this.generateSpineStyle(item);
        const randomRotation = (Math.random() - 0.5) * 1.5;
        const rotationStyle = `--book-rotation: ${randomRotation}deg;`;
        // Use smaller, fixed dimensions for showcase books
        const heightStyle = `height: 280px;`; // Keep height the same
        const widthStyle = `width: 75px;`; // Make showcase spines slightly wider

        // Add a class for long titles to adjust font size
        const longTitleClass = item.title.length > 20 ? 'long-title' : '';

        // These cards are decorative, so they are hidden from screen readers.
        return `
            <div class="book-card ${longTitleClass} ${spineInfo.className || ''}" style="${spineInfo.style} ${heightStyle} ${widthStyle} ${rotationStyle}" aria-hidden="true">
                <span class="spine-title">${this.sanitizeHtml(item.title)}</span>
            </div>
        `;
    }

    createContentCard(item) {
        const spineInfo = this.generateSpineStyle(item);
        const randomRotation = (Math.random() - 0.5) * 1.5; // A tiny rotation between -0.75 and +0.75 degrees
        const rotationStyle = `--book-rotation: ${randomRotation}deg;`;

        const titleLength = item.title.length;
        
        // Dynamically adjust height based on title length for a more varied and realistic shelf
        const baseHeight = 220; // Base height for shorter titles
        const charsOverHeight = Math.max(0, titleLength - 15); // Characters over a base length
        const extraHeight = charsOverHeight * 7; // Add ~7px for each extra character
        const totalHeight = Math.min(baseHeight + extraHeight, 320); // Cap the height at 320px
        const heightStyle = `height: ${totalHeight}px;`;

        // Dynamically adjust width for very long titles
        const baseWidth = 60;
        const charsOverWidth = Math.max(0, titleLength - 25); // Start widening for titles > 25 chars
        const extraWidth = charsOverWidth * 1.5; // Add a little width for each char
        const totalWidth = Math.min(baseWidth + extraWidth, 100); // Cap width at 100px
        const widthStyle = `width: ${totalWidth}px;`;

        // Add a class for long titles to adjust font size
        const longTitleClass = titleLength > 25 ? 'long-title' : '';

        // Render a book spine card
        return `
            <article class="book-card ${longTitleClass} ${spineInfo.className || ''}" data-id="${item.id}" data-category="${item.category}" role="listitem" aria-label="${item.title}" tabindex="0" style="${spineInfo.style} ${heightStyle} ${widthStyle} ${rotationStyle}">
                <span class="spine-title">${this.sanitizeHtml(item.title)}</span>
            </article>
        `;
    }

    generateSpineStyle(item) {
        const title = item.title;
        const design = item.spineDesign;

        let hash = 0; for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
        hash = Math.abs(hash);

        const hue = hash % 360;
        const styleType = design ? this.getStyleTypeByName(design) : hash % Object.keys(this.spineStyleMap).length;

        // Define colors using theme variables for consistency
        const baseSat = 'var(--color-spine-bg-s)';
        const baseLight = 'var(--color-spine-bg-l)';
        const textSat = 'var(--color-spine-text-s)';
        const textLight = 'var(--color-spine-text-l)';

        const c1 = `hsl(${hue}, ${baseSat}, calc(${baseLight} + 5%))`; // Lighter shade
        const c2 = `hsl(${hue}, ${baseSat}, ${baseLight})`; // Base color
        const c3 = `hsl(${hue}, ${baseSat}, calc(${baseLight} - 5%))`; // Darker shade
        const gold = `hsl(40, 35%, 60%)`; // Muted, antique gold
        const textColor = `hsl(${hue}, ${textSat}, ${textLight})`;

        let styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c1} 10%, ${c2} 10%, ${c2} 90%, ${c1} 90%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; // Default: Banded
        let className = '';

    switch (styleType) {
        case 1: // Gilded
            styleString = `
                background: linear-gradient(to bottom,
                    ${c3} 0%, ${c3} 5%,
                    ${gold} 5%, ${gold} 7%,
                    ${c3} 7%, ${c3} 15%,
                    ${c2} 15%, ${c2} 85%,
                    ${c3} 85%, ${c3} 93%,
                    ${gold} 93%, ${gold} 95%,
                    ${c3} 95%, ${c3} 100%);
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;

        case 2: { // Gilded Chevron
            const chevronSize = '0.5em';
            styleString = `
                background-color: ${c2}; /* Base color for pattern */
                background-image:
                    /* Top and Bottom Bands (top layer) */
                    linear-gradient(to bottom,
                        ${c3} 0%, ${c3} 5%,
                        ${gold} 5%, ${gold} 7%,
                        ${c3} 7%, ${c3} 15%,
                        transparent 15%, transparent 85%, /* Transparent middle section */
                        ${c3} 85%, ${c3} 93%,
                        ${gold} 93%, ${gold} 95%,
                        ${c3} 95%, ${c3} 100%),
                    /* Chevron Pattern (bottom layers) */
                    repeating-linear-gradient(
                        -45deg,
                        transparent, transparent 0.15em, ${c1} 0.15em, ${c1} 0.35em
                    ),
                    repeating-linear-gradient(
                        45deg,
                        transparent, transparent 0.15em, ${c1} 0.15em, ${c1} 0.35em
                    );
                background-repeat: no-repeat, repeat, repeat;
                background-size: 
                    100% 100%,
                    ${chevronSize} ${chevronSize}, ${chevronSize} ${chevronSize};
                background-position: 0 0; /* All layers default to top-left */
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;
        }

        case 3: { // Gilded Dots
            const dotSize = '1.25em';
            styleString = `
                background-color: ${c2}; /* Base color for the middle */
                background-image:
                    /* Top and Bottom Bands (top layer) */
                    linear-gradient(to bottom,
                        ${c3} 0%, ${c3} 5%,
                        ${gold} 5%, ${gold} 7%,
                        ${c3} 7%, ${c3} 15%,
                        transparent 15%, transparent 85%, /* Transparent middle section */
                        ${c3} 85%, ${c3} 93%,
                        ${gold} 93%, ${gold} 95%,
                        ${c3} 95%, ${c3} 100%),
                    /* Polka Dot Pattern (bottom layers) */
                    radial-gradient(${c1} 15%, transparent 16%),
                    radial-gradient(${c1} 15%, transparent 16%);
                background-repeat: no-repeat, repeat, repeat;
                background-size: 100% 100%, ${dotSize} ${dotSize}, ${dotSize} ${dotSize};
                background-position: 0 0, 0 0, calc(${dotSize} / 2) calc(${dotSize} / 2);
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;
        }

        case 4: // Double Band
            styleString = `
                background: linear-gradient(to bottom,
                    ${c1} 0%, ${c1} 4%,
                    ${c2} 4%, ${c2} 8%,
                    ${c1} 8%, ${c1} 12%,
                    ${c2} 12%, ${c2} 88%,
                    ${c1} 88%, ${c1} 92%,
                    ${c2} 92%, ${c2} 96%,
                    ${c1} 96%, ${c1} 100%);
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;

        case 5: { // Checkered with Gilded Corners
            const size = '1.25em';
            const cornerSize = '0.8em';
            const cornerThickness = '0.15em';
            styleString = `
                background-image: 
                    /* Top-left corner */
                    linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    /* Top-right corner */
                    linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    /* Bottom-left corner */
                    linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    /* Bottom-right corner */
                    linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                    /* Checkered Pattern */
                    linear-gradient(45deg, ${c3} 25%, transparent 25%),
                    linear-gradient(-45deg, ${c3} 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, ${c3} 75%),
                    linear-gradient(-45deg, transparent 75%, ${c3} 75%);
                background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat, repeat, repeat;
                background-size: ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${size} ${size}, ${size} ${size}, ${size} ${size}, ${size} ${size};
                background-position: 
                    /* Corners */
                    top left, top left, top right, top right, bottom left, bottom left, bottom right, bottom right,
                    /* Checkered Pattern (default position) */
                    0 0, 0 0, 0 0, 0 0;
                background-color: ${c2};
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;
        }

        case 6: { // Gilded Checkers
            const size = '0.75em';
            styleString = `
                background-color: ${c2}; /* Base color for the checkered middle */
                background-image: 
                    /* Top and Bottom Bands (top layer) */
                    linear-gradient(to bottom,
                        ${c3} 0%, ${c3} 5%,      /* Top-most band */
                        ${gold} 5%, ${gold} 7%,      /* Top gold line */
                        ${c3} 7%, ${c3} 15%,     /* Band below gold line */
                        transparent 15%, transparent 85%, /* Transparent middle section */
                        ${c3} 85%, ${c3} 93%,     /* Band above bottom gold line */
                        ${gold} 93%, ${gold} 95%,    /* Bottom gold line */
                        ${c3} 95%, ${c3} 100%),   /* Bottom-most band */
                    /* Checkered Pattern (layers below the bands) */
                    linear-gradient(45deg, ${c3} 25%, transparent 25%),
                    linear-gradient(-45deg, ${c3} 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, ${c3} 75%),
                    linear-gradient(-45deg, transparent 75%, ${c3} 75%);
                
                background-size: 
                    100% 100%, /* Bands cover full element */
                    ${size} ${size}, 
                    ${size} ${size}, 
                    ${size} ${size}, 
                    ${size} ${size};
                background-repeat: no-repeat, repeat, repeat, repeat, repeat;
                background-position: 0 0, 0 0, 0 0, 0 0, 0 0; /* Explicitly position all layers */
                
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;
        }

        case 7: // Diamond Pattern
            styleString = `
                background-image: linear-gradient(135deg, ${c1} 25%, transparent 25%),
                                linear-gradient(225deg, ${c1} 25%, transparent 25%),
                                linear-gradient(45deg, ${c1} 25%, transparent 25%),
                                linear-gradient(315deg, ${c1} 25%, ${c2} 25%);
                background-size: 1.25em 1.25em;
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;

        case 8: // Crosshatch
            styleString = `
                background-image: repeating-linear-gradient(45deg, ${c3} 25%, transparent 25%, transparent 75%, ${c3} 75%, ${c3}),
                                repeating-linear-gradient(45deg, ${c3} 25%, transparent 25%, transparent 75%, ${c3} 75%);
                background-position: 0 0, 0.5em 0.5em;
                background-size: 1em 1em;
                background-color: ${c2};
                color: ${textColor};
                text-shadow: 0 1px 2px rgba(0,0,0,0.6);
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
            `;
            break;

        case 9: // Leather-bound
            styleString = `
                background: linear-gradient(to bottom,
                    hsl(${hue}, calc(${baseSat} - 10%), calc(${baseLight} - 15%)) 0%,
                    hsl(${hue}, ${baseSat}, calc(${baseLight} - 10%)) 100%);
                border-top: 6px solid ${gold};
                border-bottom: 6px solid ${gold};
                border-left: 1px solid rgba(255,255,255,0.15);
                border-right: 1px solid rgba(0,0,0,0.3);
                color: ${gold};
                text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            `;
            break;
            case 10: // Zigzag
        styleString = `
            background: repeating-linear-gradient(135deg, ${c2} 0, ${c2} 0.3em, transparent 0.3em, transparent 0.6em),
                        repeating-linear-gradient(45deg, ${c1} 0, ${c1} 0.3em, transparent 0.3em, transparent 0.6em);
            background-color: ${c3};
            color: ${textColor};
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 11: { // Gilded Texture
        const cornerSize = '0.8em';
        const cornerThickness = '0.15em';
        styleString = `
            background-color: ${c2};
            background-image:
                /* Corners (top layer) */
                linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                /* Texture (bottom layer) */
                radial-gradient(${c3} 1px, transparent 1px);
            background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat;
            background-size: 
                ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize},
                ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize},
                0.5em 0.5em;
            background-position: 
                top left, top left, top right, top right, 
                bottom left, bottom left, bottom right, bottom right,
                0 0;
            color: ${gold}; /* Use gold text to match corners */
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;
    }

    case 12: { // Ornate Speckle
        styleString = `
            background-color: ${c2};
            background-image: 
                /* Corner Dots (top-most layer) */
                radial-gradient(circle at 10% 10%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 90% 10%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 10% 90%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 90% 90%, ${gold} 0.12em, transparent 0.18em),
                /* Gilded Bands (middle layer) */
                linear-gradient(to bottom,
                    ${c3} 0%, ${c3} 5%,
                    ${gold} 5%, ${gold} 7%,
                    ${c3} 7%, ${c3} 15%,
                    transparent 15%, transparent 85%, /* Transparent middle section */
                    ${c3} 85%, ${c3} 93%,
                    ${gold} 93%, ${gold} 95%,
                    ${c3} 95%, ${c3} 100%),
                /* Speckle Pattern (bottom layers) */
                radial-gradient(${c1} 0.1em, transparent 0.1em),
                radial-gradient(${c1} 0.1em, transparent 0.1em);
            background-size: auto, auto, auto, auto, 100% 100%, 0.6em 0.6em, 0.6em 0.6em;
            background-position: top left, top right, bottom left, bottom right, 0 0, 0 0, 0.3em 0.3em;
            background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat;
            color: ${textColor};
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;
    }

    case 13: // Art Deco
        styleString = `
            background-color: ${c3};
            background-image: repeating-linear-gradient(45deg, ${gold} 0, ${gold} 0.05em, transparent 0.05em, transparent 0.6em),
                              repeating-linear-gradient(-45deg, ${gold} 0, ${gold} 0.05em, transparent 0.05em, transparent 0.6em);
            color: hsl(40, 80%, 85%);
            text-shadow: 0 1px 2px ${c3};
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 14: // Cosmic
        const darkBg = `hsl(${hue}, 30%, 10%)`;
        const nebula1 = `hsl(${hue}, 50%, 30%)`;
        const nebula2 = `hsl(${(hue + 60) % 360}, 50%, 25%)`;
        styleString = `
            background-color: ${darkBg};
            background-image:
                radial-gradient(0.05em 0.05em at 1em 1.5em, white, transparent),
                radial-gradient(0.05em 0.05em at 2em 3em, white, transparent),
                radial-gradient(0.1em 0.1em at 2.5em 6em, white, transparent),
                radial-gradient(0.05em 0.05em at 0.5em 7.5em, white, transparent),
                radial-gradient(circle at 30% 40%, ${nebula1} 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, ${nebula2} 0%, transparent 40%);
            color: hsl(0, 0%, 90%);
            text-shadow: 0 0 0.3em white;
            border-left: 1px solid rgba(255,255,255,0.2);
            border-right: 1px solid rgba(0,0,0,0.4);
        `;
        break;

    case 15: // Tooled Leather
        styleString = `
            background: linear-gradient(to bottom,
                hsl(${hue}, calc(${baseSat} - 5%), calc(${baseLight} - 10%)) 0%, ${c3} 100%);
            color: ${gold};
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            border-top: 0.15em double ${gold};
            border-bottom: 0.15em double ${gold};
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 16: { // Decorated Vellum
        const vellumBg = `hsl(40, 25%, 92%)`;
        const vellumText = `hsl(40, 15%, 20%)`;
        const vellumMottle = `hsla(40, 20%, 85%, 0.5)`;
        const inkColor = vellumText;
        const cornerSize = '0.8em';
        const cornerThickness = '0.15em';
        styleString = `
            background-color: ${vellumBg};
            background-image:
                /* Corner Brackets (top layer) */
                linear-gradient(to right, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to left, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to right, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to left, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${inkColor} ${cornerThickness}, transparent ${cornerThickness}),
                /* Vellum Mottle (bottom layer) */
                radial-gradient(${vellumMottle} 0.1em, transparent 0.1em);
            background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat;
            background-size: 
                ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize},
                ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize}, ${cornerSize} ${cornerSize},
                0.3em 0.3em;
            background-position: 
                top left, top left, top right, top right, 
                bottom left, bottom left, bottom right, bottom right,
                0 0;
            color: ${vellumText};
            border: 1px solid #d1c7b8;
            box-shadow: inset 0 0 0.5em hsla(40, 20%, 85%, 0.8); /* Inner shadow for depth */
            text-shadow: 0 1px 1px rgba(255,255,255,0.6);
        `;
        break;
    }

    case 17: { // Embossed Star Atlas
        const darkSky = `hsl(${hue}, 50%, 10%)`;
        const starColor = `hsla(0, 0%, 100%, 0.9)`;
        const faintStarColor = `hsla(0, 0%, 100%, 0.5)`;
        const constellationColor = `hsla(50, 100%, 80%, 0.4)`;
        const nebulaColor = `hsla(${(hue + 180) % 360}, 50%, 20%, 0.3)`;
        const bandColor = `hsl(${hue}, 40%, 5%)`;
        const bandShadow = `hsla(0, 0%, 0%, 0.3)`;
        const bandHighlight = `hsla(0, 0%, 100%, 0.08)`; // Subtle highlight for the top edge
        styleString = `
            background-color: ${darkSky};
            background-image:
                /* Embossed Gilded Bands (top layer) */
                linear-gradient(to bottom,
                    /* Top band */
                    ${bandColor} 0%, ${bandColor} 8%,
                    ${bandHighlight} 8%, ${bandHighlight} 8.2%, /* Highlight above gold */
                    ${gold} 8.2%, ${gold} 10%,
                    ${bandShadow} 10%, ${bandShadow} 10.2%, /* Shadow below gold */
                    ${bandColor} 10.2%, ${bandColor} 15%,
                    transparent 15%, transparent 85%, /* Transparent middle section */
                    /* Bottom band */
                    ${bandColor} 85%, ${bandColor} 90%,
                    ${bandHighlight} 90%, ${bandHighlight} 90.2%, /* Highlight above gold */
                    ${gold} 90.2%, ${gold} 92%,
                    ${bandShadow} 92%, ${bandShadow} 92.2%, /* Shadow below gold */
                    ${bandColor} 92.2%, ${bandColor} 100%),
                /* Starfield layers below */
                radial-gradient(0.08em 0.08em at 20% 15%, ${starColor}, transparent),
                radial-gradient(0.1em 0.1em at 50% 50%, ${starColor}, transparent),
                radial-gradient(0.06em 0.06em at 90% 70%, ${starColor}, transparent),
                radial-gradient(0.05em 0.05em at 80% 25%, ${faintStarColor}, transparent),
                radial-gradient(0.04em 0.04em at 30% 85%, ${faintStarColor}, transparent),
                radial-gradient(0.05em 0.05em at 10% 60%, ${faintStarColor}, transparent),
                radial-gradient(0.06em 0.06em at 70% 90%, ${faintStarColor}, transparent),
                linear-gradient(125deg, transparent 48%, ${constellationColor} 49%, ${constellationColor} 50%, transparent 51%),
                linear-gradient(25deg, transparent 48%, ${constellationColor} 49%, ${constellationColor} 50%, transparent 51%),
                linear-gradient(-30deg, transparent 30%, ${constellationColor} 31%, ${constellationColor} 32%, transparent 33%),
                radial-gradient(ellipse at 70% 30%, ${nebulaColor} 0%, transparent 60%);
            background-repeat: no-repeat; /* Apply to all layers */
            background-size: 
                100% 100%, /* 1. Bands */
                auto, auto, auto, auto, auto, auto, auto, /* 7 stars (use their intrinsic size) */
                100% 100%, 100% 100%, 100% 100%, /* 3 constellations */
                100% 100%; /* 1 nebula */
            color: hsl(50, 80%, 90%);
            text-shadow: 0 0 0.3em hsl(50, 100%, 80%);
            border-left: 1px solid rgba(255,255,255,0.2);
            border-right: 1px solid rgba(0,0,0,0.4);
        `;
        break;
    }

    case 18: // Raised Bands
        styleString = `
            background: ${c3};
            color: ${gold};
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            background-image: linear-gradient(to bottom,
                transparent 15%, hsla(0,0%,0%,0.2) 15%, hsla(0,0%,0%,0.2) 18%, transparent 18%,
                transparent 35%, hsla(0,0%,0%,0.2) 35%, hsla(0,0%,0%,0.2) 38%, transparent 38%,
                transparent 62%, hsla(0,0%,0%,0.2) 62%, hsla(0,0%,0%,0.2) 65%, transparent 65%,
                transparent 82%, hsla(0,0%,0%,0.2) 82%, hsla(0,0%,0%,0.2) 85%, transparent 85%);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 19: // Silk Brocade
        const silkColor1 = `hsla(${hue}, 40%, 50%, 0.2)`;
        const silkColor2 = `hsla(${(hue + 20) % 360}, 40%, 50%, 0.1)`;
        styleString = `
            background-color: ${c2};
            background-image: repeating-linear-gradient(30deg, ${silkColor1}, ${silkColor1} 0.6em, ${silkColor2} 0.6em, ${silkColor2} 1.2em);
            color: ${textColor};
            text-shadow: 0 1px 2px ${c3};
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 20: // Inlaid Wood
        const wood1 = `hsl(${hue}, 25%, 30%)`;
        const wood2 = `hsl(${(hue + 15) % 360}, 30%, 40%)`;
        const wood3 = `hsl(${(hue - 15) % 360}, 20%, 25%)`;
        styleString = `
            background: repeating-linear-gradient(90deg,
                ${wood1} 0, ${wood1} 0.6em,
                ${wood2} 0.6em, ${wood2} 1.2em,
                ${wood3} 1.2em, ${wood3} 1.5em,
                ${wood2} 1.5em, ${wood2} 2.1em);
            color: hsl(35, 30%, 85%);
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 21: // Geometric Mosaic
        const mosaicColor1 = `hsla(${hue}, 20%, 60%, 0.2)`;
        styleString = `
            background-color: ${c2};
            background-image: repeating-linear-gradient(60deg, ${mosaicColor1}, ${mosaicColor1} 0.6em, transparent 0.6em, transparent 1.2em),
                              repeating-linear-gradient(120deg, ${mosaicColor1}, ${mosaicColor1} 0.6em, transparent 0.6em, transparent 1.2em);
            color: ${textColor};
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 22: // Moonbeam Deco
        const moonbeamColor = `hsla(210, 40%, 85%, 0.3)`;
        const nightSkyDark = `hsl(220, 25%, 18%)`;
        const moonCircle = `radial-gradient(circle at 50% 20%, hsl(220, 30%, 95%) 0.6em, hsla(220, 50%, 90%, 0.2) 0.9em, transparent 1.2em)`;
        const moonShadow = `radial-gradient(circle at 58% 20%, ${nightSkyDark} 0.6em, transparent 0.65em)`;
        const beamGradient = `conic-gradient(from 270deg at 50% 22%, transparent, ${moonbeamColor} 15%, transparent 30%, ${moonbeamColor} 45%, transparent 60%)`;
        styleString = `
            background-color: ${nightSkyDark};
            background-image: ${moonShadow}, ${moonCircle}, ${beamGradient};
            color: hsl(210, 40%, 95%);
            text-shadow: 0 0 0.4em ${moonbeamColor};
            border-left: 1px solid rgba(255,255,255,0.2);
            border-right: 1px solid rgba(0,0,0,0.4);
        `;
        break;

    case 23: // Sunburst Deco
        const sunCenter = `hsl(50, 100%, 90%)`;
        const sunGlow = `hsla(45, 100%, 80%, 0.6)`;
        const mainBeamColor = `hsla(45, 90%, 75%, 0.4)`;
        const secondaryBeamColor = `hsla(45, 90%, 75%, 0.2)`;
        const skyTop = `hsl(35, 50%, 40%)`;
        const skyBottom = `hsl(20, 50%, 30%)`;
        const sunGradient = `radial-gradient(circle at 50% 18%, ${sunCenter} 0.25em, ${sunGlow} 0.75em, transparent 1.5em)`;
        const mainBeams = `repeating-conic-gradient(from 270deg at 50% 20%, ${mainBeamColor} 0deg 4deg, transparent 4deg 22deg)`;
        const secondaryBeams = `repeating-conic-gradient(from 281deg at 50% 20%, ${secondaryBeamColor} 0deg 1deg, transparent 1deg 22deg)`;
        styleString = `
            background-color: ${skyBottom};
            background-image: ${sunGradient}, ${secondaryBeams}, ${mainBeams},
                              linear-gradient(to bottom, ${skyTop}, ${skyBottom});
            color: hsl(45, 80%, 95%);
            text-shadow: 0 0 0.5em ${sunCenter};
            border-left: 1px solid rgba(255,255,255,0.2);
            border-right: 1px solid rgba(0,0,0,0.4);
        `;
        break;
 
    case 24: // Geometric Weave
    styleString = `
        background-color: ${c2};
        background-image: 
            linear-gradient(45deg, ${c1} 25%, transparent 25%),
            linear-gradient(-45deg, ${c1} 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${c1} 75%),
            linear-gradient(-45deg, transparent 75%, ${c1} 75%);
        background-size: 1em 1em;
        background-position: 0 0, 0 0.5em, 0.5em -0.5em, -0.5em 0;
        border-left: 1px solid rgba(255,255,255,0.15);
        border-right: 1px solid rgba(0,0,0,0.25);
        color: ${textColor};
        text-shadow: 0 1px 2px rgba(0,0,0,0.65);
    `;
    break;

    case 25: { // Gilded Watercolor
        const bgColor = `hsl(40, 30%, 95%)`;
        const textColor = `hsl(${hue}, 20%, 20%)`;
        const ink1 = `hsla(${hue}, 50%, 70%, 0.4)`;
        const ink2 = `hsla(${(hue + 40) % 360}, 55%, 65%, 0.35)`;
        const ink3 = `hsla(${(hue - 20) % 360}, 45%, 75%, 0.45)`;
        const bandColor = `hsl(40, 25%, 90%)`;
        styleString = `
            background-color: ${bgColor};
            background-image:
                /* Gilded Bands (top layer) */
                linear-gradient(to bottom,
                    ${bandColor} 0%, ${bandColor} 5%,
                    ${gold} 5%, ${gold} 7%,
                    ${bandColor} 7%, ${bandColor} 15%,
                    transparent 15%, transparent 85%, /* Transparent middle section */
                    ${bandColor} 85%, ${bandColor} 93%,
                    ${gold} 93%, ${gold} 95%,
                    ${bandColor} 95%, ${bandColor} 100%),
                /* Watercolor Blooms */
                radial-gradient(ellipse at 20% 15%, ${ink1} 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, ${ink2} 0%, transparent 40%),
                radial-gradient(ellipse at 50% 80%, ${ink3} 0%, transparent 60%),
                radial-gradient(ellipse at 90% 95%, ${ink1} 0%, transparent 50%);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            color: ${textColor};
            text-shadow: 0 1px 1px hsla(0, 0%, 100%, 0.6);
            border: 1px solid hsl(40, 20%, 88%);
            box-shadow: inset 0 0 0.4em hsla(40, 20%, 90%, 0.7);
        `;
        break;
    }

    case 26: // Gilded Border
    styleString = `
        background-color: ${c2};
        border: 0.15em solid ${gold};
        border-left: 0.25em solid ${gold};
        border-right: 0.25em solid ${gold};
        box-shadow: inset 0 0 0.3em rgba(0,0,0,0.4);
        color: ${gold};
        text-shadow: 0 0 0.25em rgba(0,0,0,0.7);
    `;
    break;
    
    case 27: // Crosshatch Linen
    styleString = `
        background-color: ${c2};
        background-image:
            repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 0.1em, transparent 0.1em, transparent 0.3em),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 0.1em, transparent 0.1em, transparent 0.3em);
        background-size: 100% 100%;
        border-left: 1px solid rgba(255,255,255,0.15);
        border-right: 1px solid rgba(0,0,0,0.25);
        color: ${textColor};
        text-shadow: 0 1px 1px rgba(0,0,0,0.6);
    `;
    break;
    
    case 28: // Double Band Classic
    styleString = `
        background-color: ${c2};
        background-image: 
            linear-gradient(to bottom, ${gold} 0.25em, transparent 0.25em, transparent calc(100% - 0.25em), ${gold} calc(100% - 0.25em));
        background-size: 100% 100%;
        border-left: 1px solid rgba(255,255,255,0.15);
        border-right: 1px solid rgba(0,0,0,0.3);
        color: ${gold};
        text-shadow: 0 0 0.25em rgba(0,0,0,0.6);
    `;
    break;

    case 29: // Embossed Leather
    styleString = `
        background-color: ${c2};
        background-image: 
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.25) 0.15em, transparent 0.2em),
            radial-gradient(circle at 70% 60%, rgba(0,0,0,0.2) 0.18em, transparent 0.25em),
            radial-gradient(circle at 40% 80%, rgba(0,0,0,0.2) 0.15em, transparent 0.2em);
        background-size: 1.5em 1.5em;
        background-repeat: repeat;
        box-shadow: inset 0 0.3em 0.6em rgba(0,0,0,0.5), inset 0 -0.3em 0.6em rgba(255,255,255,0.1);
        border-left: 1px solid rgba(255,255,255,0.15);
        border-right: 1px solid rgba(0,0,0,0.3);
        color: ${textColor};
        text-shadow: 0 1px 1px rgba(0,0,0,0.7);
    `;
    break;
    
    case 30: // Divider Bands
    styleString = `
        background-color: ${c2};
        background-image: 
            linear-gradient(to bottom, ${gold} 0.2em, transparent 0.2em),
            linear-gradient(to bottom, ${gold} 0.2em, transparent 0.2em),
            linear-gradient(to bottom, ${gold} 0.2em, transparent 0.2em);
        background-size: 100% 25%, 100% 50%, 100% 75%;
        background-repeat: no-repeat;
        border-left: 0.15em solid ${gold};
        border-right: 0.15em solid ${gold};
        color: ${textColor};
        font-style: italic;
        text-shadow: 0 0 0.25em rgba(0,0,0,0.6);
    `;
    break;    

    case 31: // Ornamental Frame
    styleString = `
            background: linear-gradient(to bottom, 
            hsl(${hue}, ${baseSat}, calc(${baseLight} - 10%)), 
            hsl(${hue}, ${baseSat}, calc(${baseLight} - 20%)));
        /* Use standard thin borders for the sides */
        border-left: 1px solid rgba(255,255,255,0.15);
        border-right: 1px solid rgba(0,0,0,0.3);
        /* Use inset box-shadow for top/bottom borders to avoid affecting content size */
        box-shadow: 
            inset 0 4px 0 0 ${gold}, /* Top border */
            inset 0 -4px 0 0 ${gold}, /* Bottom border */
            inset 0 0 0.8em rgba(0,0,0,0.6); /* Original inner shadow */
        background-image:
            radial-gradient(circle at 10% 10%, ${gold} 0.15em, transparent 0.2em),
            radial-gradient(circle at 90% 10%, ${gold} 0.15em, transparent 0.2em),
            radial-gradient(circle at 10% 90%, ${gold} 0.15em, transparent 0.2em),
            radial-gradient(circle at 90% 90%, ${gold} 0.15em, transparent 0.2em);
        background-repeat: no-repeat;
        color: ${gold};
        text-shadow: 0 1px 2px rgba(0,0,0,0.7);
    `;
    break;

    case 32: // Luxury Foil
        const foilGradient = `linear-gradient(45deg, hsl(45, 100%, 85%), hsl(40, 80%, 60%), hsl(45, 100%, 85%))`;
        const richBg = `hsl(${hue}, 35%, 18%)`; // Dark, rich background
        styleString = `
            background-color: ${richBg};
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
            --foil-gradient: ${foilGradient};
        `;
        className = 'has-foil-text';
        break;

    case 33: // Gilded Corners
        const cornerSize = '0.8em';
        const cornerThickness = '0.15em';
        styleString = `
            background: hsl(${hue}, ${baseSat}, calc(${baseLight} - 15%));
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
            background-image:
                /* Top-left corner */
                linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                /* Top-right corner */
                linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to bottom, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                /* Bottom-left corner */
                linear-gradient(to right, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                /* Bottom-right corner */
                linear-gradient(to left, ${gold} ${cornerThickness}, transparent ${cornerThickness}),
                linear-gradient(to top, ${gold} ${cornerThickness}, transparent ${cornerThickness});
            background-repeat: no-repeat;
            background-size: ${cornerSize} ${cornerSize};
            background-position: top left, top left, top right, top right, bottom left, bottom left, bottom right, bottom right;
            color: ${gold};
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
        `;
        break;

    case 34: // Marbled Ink
        const ink1 = `hsla(${hue}, 40%, 50%, 0.5)`;
        const ink2 = `hsla(${(hue + 180) % 360}, 30%, 40%, 0.4)`;
        styleString = `
            background-color: ${c2};
            background-image:
                radial-gradient(circle at 10% 20%, ${ink1} 0%, transparent 40%),
                radial-gradient(circle at 80% 50%, ${ink2} 0%, transparent 30%),
                radial-gradient(circle at 45% 90%, ${ink1} 0%, transparent 40%),
                radial-gradient(circle at 20% 80%, ${ink2} 0%, transparent 35%);
            color: ${textColor};
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 35: // Tartan Plaid
        const plaid1 = `hsla(${hue}, 30%, 40%, 0.5)`;
        const plaid2 = `hsla(${(hue + 20) % 360}, 35%, 35%, 0.5)`;
        styleString = `
            background-color: ${c3};
            border-top: 2px dashed hsla(35, 20%, 70%, 0.8);
            border-bottom: 2px dashed hsla(35, 20%, 70%, 0.8);
            background-image:
                repeating-linear-gradient(${c2} 0, ${c2} 0.5em, transparent 0.5em, transparent 2.5em),
                repeating-linear-gradient(90deg, ${plaid1} 0, ${plaid1} 0.5em, transparent 0.5em, transparent 2.5em),
                repeating-linear-gradient(45deg, ${plaid2} -0.25em, ${plaid2} 0.25em, transparent 0.25em, transparent 2.25em),
                repeating-linear-gradient(-45deg, ${plaid2} -0.25em, ${plaid2} 0.25em, transparent 0.25em, transparent 2.25em);
            color: ${textColor};
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
        `;
        break;

    case 36: // Stitched Leather 
        styleString = `
            background: linear-gradient(to bottom,
                hsl(${hue}, calc(${baseSat} - 10%), calc(${baseLight} - 15%)) 0%,
                hsl(${hue}, ${baseSat}, calc(${baseLight} - 10%)) 100%);
            border-top: 2px dashed hsla(35, 20%, 70%, 0.8);
            border-bottom: 2px dashed hsla(35, 20%, 70%, 0.8);
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
            color: hsl(35, 20%, 80%);
            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
        `;
        break;

    case 37: // Filigree Bands
        styleString = `
            background: linear-gradient(to bottom, 
                hsl(${hue}, ${baseSat}, calc(${baseLight} - 8%)), 
                hsl(${hue}, ${baseSat}, calc(${baseLight} - 18%)));
            border-left: 1px solid rgba(255,255,255,0.15);
            border-right: 1px solid rgba(0,0,0,0.3);
            box-shadow: inset 0 0 0.6em rgba(0,0,0,0.5);

            /* Gold bands top + bottom */
            background-image:
                linear-gradient(to right, ${gold}, ${gold}),
                linear-gradient(to right, ${gold}, ${gold}),
                radial-gradient(circle at 10% 10%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 90% 10%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 10% 90%, ${gold} 0.12em, transparent 0.18em),
                radial-gradient(circle at 90% 90%, ${gold} 0.12em, transparent 0.18em);
            background-repeat: no-repeat;
            background-size: 100% 0.25em, 100% 0.25em, auto, auto, auto, auto;
            background-position: top center, bottom center, top left, top right, bottom left, bottom right;

            color: ${gold};
            font-family: "Garamond", serif;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
            letter-spacing: 0.05em;
        `;
        break;

        }
        return { style: styleString, className: className };
    }

    getStyleTypeByName(name) {
        // Default to 'banded' if name is invalid
        return this.spineStyleMap[(name || '').toLowerCase()] ?? 0;
    }

    getCategoryDescription(cat) {
        const map = {
            'novels': 'Novels — Fictional worlds and long-form stories.',
            'notes': 'Notes — Short reflections and drafts.',
            'quotes': 'Quotes — Memorable lines and excerpts.'
        };
        return map[cat] || '';
    }
    
    getCategoryLabel(category) {
        const labels = {
            'novels': 'Novel',
            'notes': 'Note',
            'quotes': 'Quote'
        };
        return labels[category] || category;
    }
    
    setupFeaturedPassages() {
        // Get all content items that are quotes or have substantial excerpts
        this.featuredPassages = this.allContent.filter(item => 
            item.category === 'quotes' || (item.excerpt && item.excerpt.length > 50)
        );
    
        if (this.featuredPassages.length > 0) {
            // Start with a random passage
            this.currentPassageIndex = Math.floor(Math.random() * this.featuredPassages.length);
            this.showCurrentPassage();
            this.startFeaturedPassageCycle();
        } else {
            const passageEl = document.getElementById('featuredPassage');
            if (passageEl) {
                passageEl.firstChild.nodeValue = "The silence of this library is a story in itself.";
                const sourceEl = document.getElementById('featuredPassageSource');
                if (sourceEl) sourceEl.textContent = '';
            }
        }
    }

    showCurrentPassage() {
        const passageEl = document.getElementById('featuredPassage');
        const sourceEl = document.getElementById('featuredPassageSource');
    
        if (!passageEl || !sourceEl || this.featuredPassages.length === 0) return;
    
        const item = this.featuredPassages[this.currentPassageIndex];
        const passageText = item.excerpt || "No excerpt available.";
    
        passageEl.firstChild.nodeValue = ` ${passageText.trim()} `;
        sourceEl.textContent = `— ${item.title}`;
    }

    cycleFeaturedPassage(direction = 'next') {
        if (this.featuredPassages.length <= 1) return;
    
        const wrapper = document.querySelector('.featured-passage-wrapper');
        // Prevent re-triggering while an animation is in progress
        if (!wrapper || wrapper.dataset.isAnimating === 'true') return;
        wrapper.dataset.isAnimating = 'true';
    
        // 1. Set current height explicitly to animate FROM it
        wrapper.style.height = `${wrapper.offsetHeight}px`;
    
        // 2. Fade out the content
        wrapper.classList.add('is-fading');
    
        const onFadeOut = (e) => {
            // Only listen for the opacity transition to finish
            if (e.target !== wrapper || e.propertyName !== 'opacity') return;
            wrapper.removeEventListener('transitionend', onFadeOut);
    
            // 3. Update content while it's invisible
            if (direction === 'next') {
                this.currentPassageIndex = (this.currentPassageIndex + 1) % this.featuredPassages.length;
            } else {
                this.currentPassageIndex = (this.currentPassageIndex - 1 + this.featuredPassages.length) % this.featuredPassages.length;
            }
            this.showCurrentPassage();
    
            // 4. Measure new height and animate TO it, while fading in
            // Use rAF to ensure the DOM has updated with the new content before measuring
            requestAnimationFrame(() => {
                const newHeight = wrapper.scrollHeight;
                wrapper.style.height = `${newHeight}px`;
                wrapper.classList.remove('is-fading');
    
                // 5. Clean up after the second animation (height + fade-in) is complete
                const onFadeIn = (ev) => {
                    if (ev.target !== wrapper || ev.propertyName !== 'height') return;
                    wrapper.removeEventListener('transitionend', onFadeIn);
                    wrapper.style.height = ''; // Reset to auto for responsiveness
                    delete wrapper.dataset.isAnimating;
                };
                wrapper.addEventListener('transitionend', onFadeIn);
            });
        };
    
        wrapper.addEventListener('transitionend', onFadeOut);
    }

    startFeaturedPassageCycle() {
        // Clear any existing timer
        if (this.featuredPassageInterval) {
            clearInterval(this.featuredPassageInterval);
        }
        // Start a new timer to cycle every 5 seconds
        this.featuredPassageInterval = setInterval(() => this.cycleFeaturedPassage('next'), 5000);
    }

    // Add staggered fade-in animation to newly rendered cards
    applyCardStaggerAnimation(container = document) {
        // By scoping the query to a container, we prevent re-animating existing cards.
        const cards = container.querySelectorAll('.book-card:not(.is-entering)');
        let delay = 0;
        cards.forEach(card => {
            card.classList.add('is-entering');
            card.style.animationDelay = `${delay}ms`; delay += 40; // modest stagger
            card.addEventListener('animationend', () => { card.classList.remove('is-entering'); card.style.animationDelay = ''; }, { once: true });
        });
    }

    openReadingModal(contentId, sourceElement) {
        const content = this.allContent.find(item => item.id === contentId);
        if (!content) return;

        // Delegate opening to the modal module via a single event with full content detail
        const event = new CustomEvent('openReadingModal', { detail: { content, sourceElement } });
        document.dispatchEvent(event);
    }
    
    // Minimal allowlist sanitizer using DOMParser
    sanitizeHtml(dirtyHtml) {
        if (!dirtyHtml) return '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(dirtyHtml, 'text/html');

        const allowedTags = new Set(['A','P','BR','STRONG','EM','B','I','U','BLOCKQUOTE','UL','OL','LI','H1','H2','H3','H4','IMG', 'SPAN', 'DIV']);
        const allowedAttrs = new Set(['href','src','alt','title','class']);

        function walk(node) {
            const children = Array.from(node.childNodes);
            children.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const tag = child.tagName.toUpperCase();
                    if (!allowedTags.has(tag)) {
                        // unwrap: replace node with its children
                        while (child.firstChild) node.insertBefore(child.firstChild, child);
                        node.removeChild(child);
                    } else {
                        // remove disallowed attributes
                        Array.from(child.attributes).forEach(attr => {
                            const name = attr.name.toLowerCase();
                            const value = attr.value.trim();

                            // 1. Disallow dangerous attributes like event handlers first.
                            if (name.startsWith('on') || name === 'style') {
                                child.removeAttribute(attr.name);
                                return;
                            }

                            // 2. Disallow dangerous protocols in links/sources.
                            if ((name === 'href' || name === 'src') && /^(javascript|data):/i.test(value)) {
                                child.removeAttribute(attr.name);
                                return;
                            }

                            // 3. If the attribute is not in the general allowlist, remove it.
                            if (!allowedAttrs.has(name)) {
                                child.removeAttribute(attr.name);
                            }
                        });
                        walk(child);
                    }
                } else if (child.nodeType === Node.COMMENT_NODE) {
                    node.removeChild(child);
                } else {
                    // text node, ok
                }
            });
        }

        walk(doc.body);
        return doc.body.innerHTML;
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
    
    getSpineStyles(options = {}) {
        return Object.keys(this.spineStyleMap).map(name => ({
            name: name,
            id: this.spineStyleMap[name]
        }));
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
    
    let initialCategory = 'all';
    // Handle URL hash on page load
    if (window.location.hash) {
        const categoryFromHash = window.location.hash.substring(1);
        if (['all', 'novels', 'notes', 'quotes'].includes(categoryFromHash)) {
            initialCategory = categoryFromHash;
        }
    }
    // This single call handles both hash and no-hash scenarios on initial load
    window.libraryApp.handleCategoryChange(initialCategory);
});

// Service Worker update notification UI
function setupServiceWorkerUpdateUI() {
    if (!('serviceWorker' in navigator)) return;

    let waitingSW = null;

    function showUpdateBanner() {
        // create banner if missing
        let banner = document.getElementById('swUpdateBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'swUpdateBanner';
            banner.className = 'sw-update-banner';
            banner.innerHTML = `
                <div class="sw-update-inner">A new version is available.
                    <button id="swRefreshBtn" class="btn">Refresh</button>
                    <button id="swDismissBtn" class="btn">Dismiss</button>
                </div>`;
            document.body.appendChild(banner);
        }

        banner.style.display = 'block';

        const refresh = document.getElementById('swRefreshBtn');
        const dismiss = document.getElementById('swDismissBtn');
        if (refresh) refresh.addEventListener('click', () => {
            if (!waitingSW) return; // defensive
            waitingSW.postMessage({ type: 'skipWaiting' });
        });
        if (dismiss) dismiss.addEventListener('click', () => { banner.style.display = 'none'; });
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // A new service worker has taken control — reload so the new assets apply.
        window.location.reload();
    });

    navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;
        if (reg.waiting) {
            waitingSW = reg.waiting;
            showUpdateBanner();
        }

        reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            newSW.addEventListener('statechange', () => {
                if (newSW.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        waitingSW = reg.waiting;
                        showUpdateBanner();
                    }
                }
            });
        });
    });
}

// Initialize SW update UI (non-blocking)
document.addEventListener('DOMContentLoaded', () => { setupServiceWorkerUpdateUI(); });

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    let category = 'all';
    if (window.location.hash) {
        const categoryFromHash = window.location.hash.substring(1);
        if (['all', 'novels', 'notes', 'quotes'].includes(categoryFromHash)) {
            category = categoryFromHash;
        }
    }
    // Update the app state and UI to match the URL
    window.libraryApp.handleCategoryChange(category);
});
