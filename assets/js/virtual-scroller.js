/**
 * Virtual Scrolling Module
 * Efficiently renders only visible content items
 * Dramatically improves performance with large lists
 */

class VirtualScroller {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            itemHeight: options.itemHeight || 200,
            buffer: options.buffer || 5, // Extra items to render above/below viewport
            ...options
        };
        
        this.items = [];
        this.visibleItems = new Map();
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.totalHeight = 0;
        
        this.init();
    }

    init() {
        this.setupContainer();
        this.bindEvents();
        this.render();
    }

    setupContainer() {
        // Create scrollable container
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        this.container.style.height = '100%';
        
        // Create content wrapper for proper height
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.style.position = 'relative';
        this.container.appendChild(this.contentWrapper);
    }

    bindEvents() {
        this.container.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    setItems(items) {
        this.items = items;
        this.totalHeight = items.length * this.options.itemHeight;
        this.contentWrapper.style.height = `${this.totalHeight}px`;
        this.render();
    }

    handleScroll() {
        this.scrollTop = this.container.scrollTop;
        this.render();
    }

    handleResize() {
        this.containerHeight = this.container.clientHeight;
        this.render();
    }

    render() {
        if (!this.items.length) return;

        this.containerHeight = this.container.clientHeight;
        
        // Calculate visible range
        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.options.itemHeight) - this.options.buffer);
        const endIndex = Math.min(
            this.items.length - 1,
            Math.ceil((this.scrollTop + this.containerHeight) / this.options.itemHeight) + this.options.buffer
        );

        // Remove items that are no longer visible
        for (const [index, element] of this.visibleItems) {
            if (index < startIndex || index > endIndex) {
                element.remove();
                this.visibleItems.delete(index);
            }
        }

        // Add new visible items
        for (let i = startIndex; i <= endIndex; i++) {
            if (!this.visibleItems.has(i)) {
                const element = this.renderItem(this.items[i], i);
                if (element) {
                    element.style.position = 'absolute';
                    element.style.top = `${i * this.options.itemHeight}px`;
                    element.style.width = '100%';
                    element.style.height = `${this.options.itemHeight}px`;
                    
                    this.contentWrapper.appendChild(element);
                    this.visibleItems.set(i, element);
                }
            }
        }
    }

    renderItem(item, index) {
        // Create content card element
        const card = document.createElement('div');
        card.className = 'content-card virtual-item';
        card.dataset.index = index;
        
        // Add loading state
        card.classList.add('loading');
        
        // Render item content (customize based on your content structure)
        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">${item.title || 'Untitled'}</h3>
                <p class="card-excerpt">${item.excerpt || item.content?.substring(0, 100) + '...' || 'No content available'}</p>
                <div class="card-meta">
                    <span class="card-category">${item.category || 'Unknown'}</span>
                    <span class="card-date">${item.date || 'No date'}</span>
                </div>
            </div>
        `;
        
        // Simulate content loading
        setTimeout(() => {
            card.classList.remove('loading');
            card.classList.add('loaded');
        }, Math.random() * 200 + 100);
        
        return card;
    }

    scrollToIndex(index) {
        const scrollTop = index * this.options.itemHeight;
        this.container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    scrollToTop() {
        this.container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    getVisibleItems() {
        return Array.from(this.visibleItems.keys()).sort((a, b) => a - b);
    }

    updateItemHeight(newHeight) {
        this.options.itemHeight = newHeight;
        this.totalHeight = this.items.length * this.options.itemHeight;
        this.contentWrapper.style.height = `${this.totalHeight}px`;
        this.render();
    }

    destroy() {
        this.container.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        this.visibleItems.forEach(element => element.remove());
        this.visibleItems.clear();
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualScroller;
} else {
    window.VirtualScroller = VirtualScroller;
}
