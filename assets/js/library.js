/**
 * JavaScript for the Library Showcase Page
 * Handles rendering all books and the custom velocity scroll animation.
 */
class LibraryShowcase {
    constructor() {
        this.container = document.querySelector('.library-shelf-container');
        this.viewport = document.querySelector('.library-viewport');
        this.allContent = [];
        this.scroll = {
            current: 0,
            target: 0,
            lerp: 0.075, // Linear interpolation factor for smoothness
        };
        this.isDragging = false;
        this.dragStart = 0;
        this.dragOffset = 0;

        this.init();
    }

    init() {
        if (!this.container || !this.viewport) return;
        this.loadContent();
        this.renderBooks();
        this.setupEventListeners();
        this.animationLoop();
    }

    loadContent() {
        this.allContent = Object.values(LIBRARY_CONTENT).flat();
        // Sort for a consistent, organized order
        this.allContent.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderBooks() {
        const bookHtml = this.allContent.map(item => this.createContentCard(item)).join('');
        this.container.innerHTML = bookHtml;
    }

    createContentCard(item) {
        const spineStyle = this.generateSpineStyle(item);
        const randomRotation = (Math.random() - 0.5) * 1.5;
        const rotationStyle = `--book-rotation: ${randomRotation}deg;`;

        const titleLength = item.title.length;
        const baseHeight = 220;
        const extraHeight = Math.max(0, titleLength - 15) * 7;
        const totalHeight = Math.min(baseHeight + extraHeight, 320);
        const heightStyle = `height: ${totalHeight}px;`;

        const baseWidth = 55; // Make spines slightly wider
        const extraWidth = Math.max(0, titleLength - 25) * 1.5;
        const totalWidth = Math.min(baseWidth + extraWidth, 95); // Cap width
        const widthStyle = `width: ${totalWidth}px;`;

        // Add a class for long titles to adjust font size
        const longTitleClass = titleLength > 25 ? 'long-title' : '';

        // Note: These cards are decorative and don't link to the modal.
        return `
            <article class="book-card ${longTitleClass}" style="${spineStyle} ${heightStyle} ${widthStyle} ${rotationStyle}" aria-label="${item.title}">
                <span class="spine-title">${item.title}</span>
            </article>
        `;
    }

    // Copied from app.js for visual consistency. In a larger app, this would be a shared utility.
    generateSpineStyle(item) {
        const title = item.title;
        const design = item.spineDesign;

        let hash = 0; for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
        hash = Math.abs(hash);

        const hue = hash % 360;
        const styleType = design ? this.getStyleTypeByName(design) : hash % 23;

        const baseSat = 'var(--color-spine-bg-s)';
        const baseLight = 'var(--color-spine-bg-l)';
        const textSat = 'var(--color-spine-text-s)';
        const textLight = 'var(--color-spine-text-l)';

        const c1 = `hsl(${hue}, ${baseSat}, calc(${baseLight} + 5%))`;
        const c2 = `hsl(${hue}, ${baseSat}, ${baseLight})`;
        const c3 = `hsl(${hue}, ${baseSat}, calc(${baseLight} - 5%))`;
        const gold = `hsl(40, 35%, 60%)`;
        const textColor = `hsl(${hue}, ${textSat}, ${textLight})`;

        let styleString = `background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`;

        switch (styleType) {
            case 1: styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c1} 10%, ${c2} 10%, ${c2} 90%, ${c1} 90%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; break;
            case 2: styleString = `background: linear-gradient(to bottom, ${c3} 0%, ${c3} 5%, ${gold} 5%, ${gold} 7%, ${c3} 7%, ${c3} 15%, ${c2} 15%, ${c2} 85%, ${c3} 85%, ${c3} 93%, ${gold} 93%, ${gold} 95%, ${c3} 95%, ${c3} 100%); color: ${textColor};`; break;
            case 3: styleString = `background: repeating-linear-gradient(90deg, ${c2}, ${c2} 10px, ${c1} 10px, ${c1} 12px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
            case 4: styleString = `background: radial-gradient(ellipse at center, ${c1} 0%, ${c3} 100%); color: ${textColor};`; break;
            case 5: styleString = `background: linear-gradient(to right, ${c1} 0%, ${c1} 50%, ${c3} 50%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 6: styleString = `background: linear-gradient(to bottom, ${c2} 0%, ${c2} 40%, ${c1} 40%, ${c1} 60%, ${c2} 60%, ${c2} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; break;
            case 7: styleString = `background: repeating-linear-gradient(45deg, ${c2}, ${c2} 5px, ${c1} 5px, ${c1} 10px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
            case 8: styleString = `background: radial-gradient(${c1} 15%, transparent 16%), radial-gradient(${c1} 15%, transparent 16%), ${c2}; background-size: 20px 20px; background-position: 0 0, 10px 10px; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
            case 9: styleString = `background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 0px ${c1}, -1px -1px 0px ${c3};`; break;
            case 10: styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 11: styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c1} 4%, ${c2} 4%, ${c2} 8%, ${c1} 8%, ${c1} 12%, ${c2} 12%, ${c2} 88%, ${c1} 88%, ${c1} 92%, ${c2} 92%, ${c2} 96%, ${c1} 96%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; break;
            case 12: styleString = `background-image: linear-gradient(45deg, ${c3} 25%, transparent 25%), linear-gradient(-45deg, ${c3} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c3} 75%), linear-gradient(-45deg, transparent 75%, ${c3} 75%); background-size: 20px 20px; background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c1};`; break;
            case 13: styleString = `background: repeating-linear-gradient(90deg, ${c2}, ${c2} 3px, ${c1} 3px, ${c1} 6px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
            case 14: styleString = `background: linear-gradient(to right, ${c1} 0%, ${c3} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 15: styleString = `background: linear-gradient(to bottom, ${c1} 0%, ${c2} 70%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 16: styleString = `background-image: linear-gradient(45deg, ${c3} 25%, transparent 25%), linear-gradient(-45deg, ${c3} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c3} 75%), linear-gradient(-45deg, transparent 75%, ${c3} 75%); background-size: 10px 10px; background-color: ${c2}; color: ${textColor}; text-shadow: 1px 1px 1px ${c1};`; break;
            case 17: styleString = `background: repeating-linear-gradient(0deg, ${c2}, ${c2} 10px, ${c1} 10px, ${c1} 20px); color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
            case 18: styleString = `background: radial-gradient(ellipse at center, ${c1} 0%, ${c2} 75%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 19: styleString = `background: radial-gradient(circle at top left, ${c1}, ${c2}); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 20: styleString = `background: linear-gradient(to bottom, ${c1} 0, ${c1} 5%, ${c2} 5%, ${c2} 20%, ${c1} 20%, ${c1} 25%, ${c2} 25%, ${c2} 75%, ${c1} 75%, ${c1} 80%, ${c2} 80%, ${c2} 95%, ${c1} 95%, ${c1} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`; break;
            case 21: styleString = `background: linear-gradient(to right, ${c1} 0%, ${c2} 100%); color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`; break;
            case 22: styleString = `background-image: linear-gradient(135deg, ${c1} 25%, transparent 25%), linear-gradient(225deg, ${c1} 25%, transparent 25%), linear-gradient(45deg, ${c1} 25%, transparent 25%), linear-gradient(315deg, ${c1} 25%, ${c2} 25%); background-size: 20px 20px; color: ${textColor}; text-shadow: 1px 1px 1px ${c3};`; break;
        }
        return styleString;
    }

    getStyleTypeByName(name) {
        const map = { 'classic': 0, 'banded': 1, 'gilded': 2, 'striped': 3, 'faded': 4, 'split': 5, 'central-band': 6, 'diagonal-stripes': 7, 'polka-dots': 8, 'embossed': 9, 'gradient-fade': 10, 'double-band': 11, 'checkered': 12, 'thin-stripes': 13, 'gradient-split': 14, 'top-fade': 15, 'checkered-small': 16, 'horizontal-stripes': 17, 'center-glow': 18, 'corner-fade': 19, 'multi-band': 20, 'side-fade': 21, 'diamond': 22 };
        return map[(name || '').toLowerCase()] || 0;
    }

    setupEventListeners() {
        this.viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const speed = e.deltaY > 0 ? 100 : -100;
            this.scroll.target += speed;
        }, { passive: false });

        this.viewport.addEventListener('mousedown', (e) => { this.isDragging = true; this.dragStart = e.pageX; this.dragOffset = this.scroll.current; this.viewport.classList.add('is-dragging'); });
        window.addEventListener('mousemove', (e) => { if (!this.isDragging) return; const delta = e.pageX - this.dragStart; this.scroll.target = this.dragOffset - delta; });
        window.addEventListener('mouseup', () => { this.isDragging = false; this.viewport.classList.remove('is-dragging'); });
        
        this.viewport.addEventListener('touchstart', (e) => { this.isDragging = true; this.dragStart = e.touches[0].pageX; this.dragOffset = this.scroll.current; }, { passive: true });
        this.viewport.addEventListener('touchmove', (e) => { if (!this.isDragging) return; const delta = e.touches[0].pageX - this.dragStart; this.scroll.target = this.dragOffset - delta; }, { passive: true });
        this.viewport.addEventListener('touchend', () => { this.isDragging = false; });
    }

    animationLoop() {
        const maxScroll = this.container.scrollWidth - this.viewport.clientWidth;
        this.scroll.target = Math.max(0, Math.min(this.scroll.target, maxScroll));
        this.scroll.current += (this.scroll.target - this.scroll.current) * this.scroll.lerp;
        
        this.container.style.transform = `translateX(-${this.scroll.current}px)`;

        const books = this.container.querySelectorAll('.book-card');
        books.forEach(book => {
            const rect = book.getBoundingClientRect();
            const viewportCenter = this.viewport.clientWidth / 2;
            const bookCenter = rect.left + rect.width / 2;
            const distanceFromCenter = bookCenter - viewportCenter;
            const parallaxFactor = distanceFromCenter / viewportCenter;
            
            const rotation = parallaxFactor * -5;
            const scale = 1 - (Math.abs(parallaxFactor) * 0.05);
            
            book.style.transform = `rotateY(${rotation}deg) scale(${scale}) rotate(var(--book-rotation, 0deg))`;
        });

        requestAnimationFrame(this.animationLoop.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LibraryShowcase();
});