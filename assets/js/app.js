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

    this.init();
    }
    
    init() {
        this.searchResultsContainer = document.getElementById('searchResultsContainer');
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
        this.contentContainer = document.getElementById('bookshelfContainer');
        if (this.contentContainer) {
            this.contentContainer.addEventListener('click', (e) => {
                const readBtn = e.target.closest('.read-btn');
                const card = e.target.closest('.book-card'); // Note: .read-btn is not in use, but this is harmless

                if (readBtn) {
                    e.stopPropagation();
                    this.openReadingModal(readBtn.dataset.id);
                    return;
                }

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
        const spineStyle = this.generateSpineStyle(item);
        const randomRotation = (Math.random() - 0.5) * 1.5;
        const rotationStyle = `--book-rotation: ${randomRotation}deg;`;
        // Use smaller, fixed dimensions for showcase books
        const heightStyle = `height: 280px;`; // Keep height the same
        const widthStyle = `width: 75px;`; // Make showcase spines slightly wider

        // Add a class for long titles to adjust font size
        const longTitleClass = item.title.length > 20 ? 'long-title' : '';

        // These cards are decorative, so they are hidden from screen readers.
        return `
            <div class="book-card ${longTitleClass}" style="${spineStyle} ${heightStyle} ${widthStyle} ${rotationStyle}" aria-hidden="true">
                <span class="spine-title">${this.sanitizeHtml(item.title)}</span>
            </div>
        `;
    }

    createContentCard(item) {
        const spineStyle = this.generateSpineStyle(item);
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
            <article class="book-card ${longTitleClass}" data-id="${item.id}" data-category="${item.category}" role="listitem" aria-label="${item.title}" tabindex="0" style="${spineStyle} ${heightStyle} ${widthStyle} ${rotationStyle}">
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
        const styleType = design ? this.getStyleTypeByName(design) : hash % 23; // Now 23 styles

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

        let styleString = `background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; // Default: Classic Solid

        switch (styleType) {
            case 1: styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c1} 10%, ${c2} 10%, ${c2} 90%, ${c1} 90%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; break; // Banded
            case 2: styleString = `background: linear-gradient(to bottom, ${c3} 0%, ${c3} 5%, ${gold} 5%, ${gold} 7%, ${c3} 7%, ${c3} 15%, ${c2} 15%, ${c2} 85%, ${c3} 85%, ${c3} 93%, ${gold} 93%, ${gold} 95%, ${c3} 95%, ${c3} 100%); color: ${textColor};`; break; // Gilded
            case 3: styleString = `background: repeating-linear-gradient(90deg, ${c2}, ${c2} 10px, ${c1} 10px, ${c1} 12px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break; // Subtle Vertical Stripes
            case 4: styleString = `background: radial-gradient(ellipse at center, ${c1} 0%, ${c3} 100%); color: ${textColor};`; break; // Faded/Worn
            case 5: // Two-Tone Split
                styleString = `background: linear-gradient(to right, ${c1} 0%, ${c1} 50%, ${c3} 50%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 6: // Central Band
                styleString = `background: linear-gradient(to bottom, ${c2} 0%, ${c2} 40%, ${c1} 40%, ${c1} 60%, ${c2} 60%, ${c2} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`;
                break;
            case 7: // Diagonal Stripes
                styleString = `background: repeating-linear-gradient(45deg, ${c2}, ${c2} 5px, ${c1} 5px, ${c1} 10px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;
                break;
            case 8: // Polka Dots
                styleString = `background: radial-gradient(${c1} 15%, transparent 16%), radial-gradient(${c1} 15%, transparent 16%), ${c2}; background-size: 20px 20px; background-position: 0 0, 10px 10px; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;
                break;
            case 9: // Embossed
                styleString = `background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 0px ${c1}, -1px -1px 0px ${c3};`;
                break;
            case 10: // Gradient Fade
                styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 11: // Double Band
                styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c1} 4%, ${c2} 4%, ${c2} 8%, ${c1} 8%, ${c1} 12%, ${c2} 12%, ${c2} 88%, ${c1} 88%, ${c1} 92%, ${c2} 92%, ${c2} 96%, ${c1} 96%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`;
                break;
            case 12: // Checkered
                styleString = `background-image: linear-gradient(45deg, ${c3} 25%, transparent 25%), linear-gradient(-45deg, ${c3} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c3} 75%), linear-gradient(-45deg, transparent 75%, ${c3} 75%); background-size: 20px 20px; background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c1};`;
                break;
            case 13: // Thin Vertical Stripes
                styleString = `background: repeating-linear-gradient(90deg, ${c2}, ${c2} 3px, ${c1} 3px, ${c1} 6px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;
                break;
            case 14: // Gradient Split
                styleString = `background: linear-gradient(to right, ${c1} 0%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 15: // Top Fade
                styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c2} 70%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 16: // Checkered (Small)
                styleString = `background-image: linear-gradient(45deg, ${c3} 25%, transparent 25%), linear-gradient(-45deg, ${c3} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c3} 75%), linear-gradient(-45deg, transparent 75%, ${c3} 75%); background-size: 10px 10px; background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c1};`;
                break;
            case 17: // Horizontal Stripes
                styleString = `background: repeating-linear-gradient(0deg, ${c2}, ${c2} 10px, ${c1} 10px, ${c1} 20px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;
                break;
            case 18: // Center Glow
                styleString = `background: radial-gradient(ellipse at center, ${c1} 0%, ${c2} 75%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 19: // Corner Fade
                styleString = `background: radial-gradient(circle at top left, ${c1}, ${c2}); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 20: // Multi-Band
                styleString = `background: linear-gradient(to bottom, ${c1} 0, ${c1} 5%, ${c2} 5%, ${c2} 20%, ${c1} 20%, ${c1} 25%, ${c2} 25%, ${c2} 75%, ${c1} 75%, ${c1} 80%, ${c2} 80%, ${c2} 95%, ${c1} 95%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`;
                break;
            case 21: // Side Fade
                styleString = `background: linear-gradient(to right, ${c1} 0%, ${c2} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
                break;
            case 22: // Diamond Pattern
                styleString = `background-image: linear-gradient(135deg, ${c1} 25%, transparent 25%), linear-gradient(225deg, ${c1} 25%, transparent 25%), linear-gradient(45deg, ${c1} 25%, transparent 25%), linear-gradient(315deg, ${c1} 25%, ${c2} 25%); background-size: 20px 20px; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;
                break;
        }
        return styleString;
    }

    getStyleTypeByName(name) {
        const map = {
            'classic': 0, 'banded': 1, 'gilded': 2, 'striped': 3,
            'faded': 4, 'split': 5, 'central-band': 6,
            'diagonal-stripes': 7, 'polka-dots': 8, 'embossed': 9, 'gradient-fade': 10,
            'double-band': 11, 'checkered': 12, 'thin-stripes': 13, 'gradient-split': 14,
            'top-fade': 15, 'checkered-small': 16, 'horizontal-stripes': 17, 'center-glow': 18,
            'corner-fade': 19, 'multi-band': 20, 'side-fade': 21, 'diamond': 22
        };
        return map[(name || '').toLowerCase()] || 0; // Default to classic if name is invalid
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
        if (!wrapper) return;

        // Add fade-out class
        wrapper.classList.add('is-fading');

        // Wait for fade-out to complete
        setTimeout(() => {
            // Update index
            if (direction === 'next') {
                this.currentPassageIndex = (this.currentPassageIndex + 1) % this.featuredPassages.length;
            } else { // 'prev'
                this.currentPassageIndex = (this.currentPassageIndex - 1 + this.featuredPassages.length) % this.featuredPassages.length;
            }

            // Show new content
            this.showCurrentPassage();

            // Remove fade-out class to trigger fade-in
            wrapper.classList.remove('is-fading');
        }, 500); // Match CSS animation duration
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

        const allowedTags = new Set(['A','P','BR','STRONG','EM','B','I','BLOCKQUOTE','UL','OL','LI','H1','H2','H3','H4','IMG', 'SPAN', 'DIV']);
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
                            if (!allowedAttrs.has(name)) { child.removeAttribute(attr.name); return; }
                            // remove style or event handler attributes
                            if (name === 'style' || name.startsWith('on')) { child.removeAttribute(attr.name); return; }
                    // basic href/src sanitization (block dangerous protocols)
                    if ((name === 'href' || name === 'src') && /^(javascript|data):/i.test(attr.value.trim())) {
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
