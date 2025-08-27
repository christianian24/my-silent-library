/**
 * Modal Functionality for My Silent Library
 * Handles reading modal, content display, and download functionality
 */

class ReadingModal {
    constructor() {
        this.modal = null;
        this.modalContentWrapper = null;
        this.modalContent = null; // The scrollable content area
        this.currentContent = null;
        this.sourceElement = null; // To track the clicked book card for animation
        this.isOpen = false;
        this.previousActiveElement = null;
        this.settingsBtn = null;
        this.settingsPanel = null;
        this.progThrottle = null; // For scroll progress throttling

        // Reading settings controls from settings panel
        this.fontSelect = null;
        this.fontSizeRange = null;
        this.lineHeightRange = null;

        // Bind the context of 'this' for the event handler, so it can be added and removed correctly.
        this.handleOutsideSettingsClick = this.handleOutsideSettingsClick.bind(this);

        this.init();
    }
    
    init() {
        this.setupModal();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }
    
    setupModal() {
        this.modal = document.getElementById('readingModal');
        if (!this.modal) {
            console.error('Reading modal not found');
            return;
        }
        this.modalContentWrapper = this.modal.querySelector('.modal-content');
        this.modalContent = document.getElementById('modalContent');
        this.settingsBtn = document.getElementById('modalSettingsBtn');
        this.settingsPanel = document.getElementById('modalSettingsPanel');

        // Reading settings controls
        this.fontSelect = document.getElementById('fontSelect');
        this.fontSizeRange = document.getElementById('fontSizeRange');
        this.lineHeightRange = document.getElementById('lineHeightRange');
    }
    
    setupEventListeners() {
        // Listen for modal open events
        document.addEventListener('openReadingModal', (e) => {
            this.open(e.detail); // e.detail now contains { content, sourceElement }
        });
        
        // Modal close buttons
        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        // Modal navigation buttons
        const prevBtn = document.getElementById('modalPrev');
        const nextBtn = document.getElementById('modalNext');
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateContent('previous'));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateContent('next'));

        // Settings button
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.toggleSettingsPanel());
        }
        
        // Download button
        const downloadBtn = document.getElementById('modalDownload');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.handleDownload());
        
        // This listener now ONLY handles closing the modal when the dark backdrop is clicked.
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        // Reading settings listeners
        if (this.fontSelect && this.modalContent) {
            this.fontSelect.addEventListener('change', (e) => this.updateReadingStyle('fontFamily', e.target.value));
        }
        if (this.fontSizeRange && this.modalContent) {
            this.fontSizeRange.addEventListener('input', (e) => this.updateReadingStyle('fontSize', e.target.value));
        }
        if (this.lineHeightRange && this.modalContent) {
            this.lineHeightRange.addEventListener('input', (e) => this.updateReadingStyle('lineHeight', e.target.value));
        }

        if (this.modalContent) {
            this.modalContent.addEventListener('scroll', () => this.handleScrollProgress());
        }
    }
    
    // Centralized helper to reliably close the panel and remove the listener.
    closeSettingsPanel() {
        if (this.settingsPanel && !this.settingsPanel.hidden) {
            this.settingsPanel.hidden = true;
            this.settingsBtn.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', this.handleOutsideSettingsClick);
        }
    }

    toggleSettingsPanel() {
        if (!this.settingsPanel || !this.settingsBtn) return;

        const isOpen = !this.settingsPanel.hidden;
        if (isOpen) {
            // If it's open, the only action is to close it.
            this.closeSettingsPanel();
        } else {
            // If it's closed, open it and set up the listener.
            this.settingsPanel.hidden = false;
            this.settingsBtn.setAttribute('aria-expanded', 'true');
            // Add a global listener to catch clicks outside.
            // Use a timeout to prevent the same click that opened it from immediately closing it.
            setTimeout(() => document.addEventListener('click', this.handleOutsideSettingsClick), 0);
        }
    }

    handleOutsideSettingsClick(e) {
        // If the click was on the settings button itself, let the button's own listener handle it.
        if (this.settingsBtn && this.settingsBtn.contains(e.target)) {
            return;
        }
        // If the click was inside the settings panel, do nothing.
        if (this.settingsPanel && this.settingsPanel.contains(e.target)) {
            return;
        }
        // Otherwise, the click was "outside," so close the panel.
        this.closeSettingsPanel();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateContent('previous');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateContent('next');
                    break;
                case 'd':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.handleDownload();
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.modalContent) this.modalContent.scrollBy({ top: 120, behavior: 'smooth' });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.modalContent) this.modalContent.scrollBy({ top: -120, behavior: 'smooth' });
                    break;
            }
        });
    }
    
    open(detail) {
        if (!detail || !this.modal) return;

        // Handle both old calls (content object) and new calls ({content, sourceElement})
        const content = detail.content || detail;
        const sourceElement = detail.sourceElement || null;
        
        // --- FIX: Restore previous source element on navigation ---
        // If the modal is already open and we're navigating to new content,
        // we must first restore the opacity of the PREVIOUS source element.
        if (this.isOpen && this.sourceElement && this.sourceElement !== sourceElement) {
            this.sourceElement.style.opacity = 1;
        }

        // Remember the element that triggered the modal for focus restoration
        this.previousActiveElement = (document.activeElement && typeof document.activeElement.focus === 'function') ? document.activeElement : null;

        this.currentContent = content;
        this.sourceElement = sourceElement;
        this.isOpen = true;
        
        // Update modal content
        this.updateModalContent(content);
        
        // --- Animation Start ---
        if (this.sourceElement) {
            const fromRect = this.sourceElement.getBoundingClientRect();
            this.sourceElement.style.opacity = 0; // Hide original element

            // Set initial state for animation
            this.modalContentWrapper.style.setProperty('--start-width', `${fromRect.width}px`);
            this.modalContentWrapper.style.setProperty('--start-height', `${fromRect.height}px`);
            this.modalContentWrapper.style.setProperty('--start-top', `${fromRect.top}px`);
            this.modalContentWrapper.style.setProperty('--start-left', `${fromRect.left}px`);
        } else {
            // If no source, clear any old properties to prevent weird transitions
            ['--start-width', '--start-height', '--start-top', '--start-left'].forEach(prop => this.modalContentWrapper.style.removeProperty(prop));
        }

        this.modal.classList.add('show');
        // Force a reflow before adding the class that triggers the animation
        requestAnimationFrame(() => {
            this.modalContentWrapper.classList.add('is-opening');
        });
        // --- Animation End ---

        // Hide background from assistive tech and interaction
        this.setBackgroundInert(true);

        // Focus management
        this.trapFocus();

        // Update URL without page reload
        this.updateURL(content.id);

        // Restore reading progress
        this.restoreProgress(content.id);

        // Add body scroll lock
        document.body.style.overflow = 'hidden';

        // Announce to screen readers
        this.announceToScreenReader(`Opened ${content.title}`);

        // Trigger custom event
        this.dispatchEvent('modalOpened', { content });
    }
    
    close() {
        if (!this.isOpen || !this.modal) return;

        // Close settings panel if it's open
        this.closeSettingsPanel();

        const onTransitionEnd = () => {
            this.modalContentWrapper.removeEventListener('transitionend', onTransitionEnd);
            this.modal.classList.remove('show');
            if (this.sourceElement) {
                this.sourceElement.style.opacity = 1; // Show original element again
            }
            this.isOpen = false;

            // Restore background interactivity/semantics
            this.setBackgroundInert(false);

            // Remove focus trap handler
            if (this.tabKeyHandler) {
                this.modal.removeEventListener('keydown', this.tabKeyHandler);
                this.tabKeyHandler = null;
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Clear current content
            this.currentContent = null;
            
            // Announce to screen readers
            this.announceToScreenReader('Modal closed');
            
            // Trigger custom event
            this.dispatchEvent('modalClosed');
            
            // Remove URL hash
            this.clearURL();

            // Restore focus to the previously focused element
            if (this.previousActiveElement) {
                try { this.previousActiveElement.focus(); } catch (e) {}
                this.previousActiveElement = null;
            }
        };

        // --- Animation Start ---
        if (this.sourceElement) {
            const toRect = this.sourceElement.getBoundingClientRect();
            this.modalContentWrapper.style.setProperty('--start-width', `${toRect.width}px`);
            this.modalContentWrapper.style.setProperty('--start-height', `${toRect.height}px`);
            this.modalContentWrapper.style.setProperty('--start-top', `${toRect.top}px`);
            this.modalContentWrapper.style.setProperty('--start-left', `${toRect.left}px`);
        }

        this.modalContentWrapper.classList.remove('is-opening');
        this.modalContentWrapper.addEventListener('transitionend', onTransitionEnd, { once: true });
        // --- Animation End ---
    }
    
    updateModalContent(content) {
        // Update title
        const titleElement = document.getElementById('modalTitle');
        if (titleElement) {
            titleElement.textContent = content.title;
        }
        
        // Update content
        const contentElement = document.getElementById('modalContent');
        if (contentElement) {
            const formatted = this.formatContent(content.content);
            const safeHtml = (window.libraryApp && typeof window.libraryApp.sanitizeHtml === 'function')
                ? window.libraryApp.sanitizeHtml(formatted)
                : formatted;
            contentElement.innerHTML = safeHtml;
        }
        
        // Update download button
        const downloadBtn = document.getElementById('modalDownload');
        if (downloadBtn) {
            if (content.downloadUrl) {
                downloadBtn.style.display = 'flex'; // Show the button
                downloadBtn.disabled = false;
                downloadBtn.setAttribute('data-download-url', content.downloadUrl);
                downloadBtn.setAttribute('data-download-filename', this.getDownloadFilename(content));
            } else {
                downloadBtn.style.display = 'none'; // Hide the button
                downloadBtn.disabled = true; // Also disable for good measure
            }
        }
        
        // Add content metadata
        this.addContentMetadata(content);
    }
    
    formatContent(content) {
        // Basic content formatting - you can enhance this for markdown support
        let formatted = content;
        
        // Add some basic styling classes
        formatted = formatted.replace(/<h1>/g, '<h1 class="modal-content-title">');
        formatted = formatted.replace(/<h2>/g, '<h2 class="modal-content-subtitle">');
        formatted = formatted.replace(/<p>/g, '<p class="modal-content-paragraph">');
        formatted = formatted.replace(/<ul>/g, '<ul class="modal-content-list">');
        formatted = formatted.replace(/<li>/g, '<li class="modal-content-list-item">');
        
        // Add quote styling
        formatted = formatted.replace(/<blockquote class="quote-block">/g, '<blockquote class="quote-block modal-quote">');
        
        // Add chapter meta styling
        formatted = formatted.replace(/<p class="chapter-meta">/g, '<p class="chapter-meta modal-chapter-meta">');
        formatted = formatted.replace(/<p class="note-meta">/g, '<p class="note-meta modal-note-meta">');
        formatted = formatted.replace(/<p class="quote-meta">/g, '<p class="quote-meta modal-quote-meta">');
        
        return formatted;
    }
    
    addContentMetadata(content) {
        const contentElement = document.getElementById('modalContent');
        if (!contentElement) return;
        
        // Create metadata header
        const metadata = document.createElement('div');
        metadata.className = 'modal-content-metadata';
        
        const date = new Date(content.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        metadata.innerHTML = `
            <div class="metadata-item">
                <span class="metadata-label">Category:</span>
                <span class="metadata-value">${this.getCategoryLabel(content.category)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Published:</span>
                <span class="metadata-value">${date}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Reading Time:</span>
                <span class="metadata-value">${content.readingTime} min</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Word Count:</span>
                <span class="metadata-value">${content.wordCount.toLocaleString()}</span>
            </div>
            ${content.tags.length > 0 ? `
                <div class="metadata-item">
                    <span class="metadata-label">Tags:</span>
                    <span class="metadata-value">
                        ${content.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </span>
                </div>
            ` : ''}
        `;
        
        // Insert metadata at the beginning of content
        contentElement.insertBefore(metadata, contentElement.firstChild);
    }
    
    getCategoryLabel(category) {
        const labels = {
            'novels': 'Novel',
            'notes': 'Note',
            'quotes': 'Quote'
        };
        return labels[category] || category;
    }
    
    handleDownload() {
        if (!this.currentContent || !this.currentContent.downloadUrl) return;
        
        const downloadBtn = document.getElementById('modalDownload');
        if (!downloadBtn) return;
        
        const url = downloadBtn.getAttribute('data-download-url');
        const filename = downloadBtn.getAttribute('data-download-filename') || '';
        
        if (!url) return;
        
        try {
            const targetUrl = new URL(url, window.location.href);
            const isCrossOrigin = targetUrl.origin !== window.location.origin;

            if (isCrossOrigin) {
                // Many browsers ignore the download attribute for cross-origin URLs.
                // Open in a new tab as a reliable fallback.
                window.open(targetUrl.href, '_blank', 'noopener');
                this.showDownloadFeedback('Opened download in a new tab.');
                return;
            }

            // Create download link (same-origin)
            const link = document.createElement('a');
            link.href = targetUrl.href;
            if (filename) link.download = filename;
            link.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success feedback
            this.showDownloadFeedback('Download started successfully!');
            
        } catch (error) {
            console.error('Download failed:', error);
            this.showDownloadFeedback('Download failed. Please try again.', 'error');
        }
    }
    
    getDownloadFilename(content) {
        const title = content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const extension = this.getFileExtension(content.downloadUrl);
        return `${title}.${extension}`;
    }
    
    getFileExtension(url) {
        const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        return match ? match[1] : 'pdf';
    }
    
    showDownloadFeedback(message, type = 'success') {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `download-feedback ${type}`;
        feedback.textContent = message;
        
        // Add to modal
        const modalFooter = this.modal.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.appendChild(feedback);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 3000);
        }
    }
    
    navigateContent(direction) {
        if (!this.currentContent) return;
        
        // Use the currently filtered content from libraryApp
        const currentFilteredContent = window.libraryApp ? window.libraryApp.getFilteredContent() : [];
        if (currentFilteredContent.length === 0) return;
        
        const currentIndex = currentFilteredContent.findIndex(item => item.id === this.currentContent.id);
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % currentFilteredContent.length;
        } else {
            nextIndex = currentIndex === 0 ? currentFilteredContent.length - 1 : currentIndex - 1;
        }
        
        const nextContent = currentFilteredContent[nextIndex];
        if (nextContent) {
            // Find the new source element on the shelf
            const nextSourceElement = document.querySelector(`.book-card[data-id="${nextContent.id}"]`);
            // To create a smooth cross-fade, we just update the content.
            // For simplicity here, we'll just re-open. A future enhancement could be a cross-fade.
            this.open({ content: nextContent, sourceElement: nextSourceElement || this.sourceElement });
        }
    }
    
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Handle tab key
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        
        this.modal.addEventListener('keydown', handleTabKey);
        
        // Store handler for cleanup
        this.tabKeyHandler = handleTabKey;
    }
    
    announceToScreenReader(message) {
        // Use the existing ARIA live region from index.html for announcements
        const announcement = document.getElementById('a11yAnnouncements');
        if (!announcement) {
            console.warn('Accessibility announcements region #a11yAnnouncements not found.');
            return;
        }
        announcement.textContent = message;
    }
    
    updateURL(contentId) {
        const currentHash = window.location.hash;
        const newHash = `#read-${contentId}`;
        
        if (currentHash !== newHash) {
            window.history.pushState({ contentId }, '', newHash);
        }
    }
    
    clearURL() {
        const currentHash = window.location.hash;
        if (currentHash.startsWith('#read-')) {
            window.history.pushState({}, '', window.location.pathname);
        }
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // --- Reading Settings and Progress ---

    updateReadingStyle(style, value) {
        if (!this.modalContent) return;

        switch (style) {
            case 'fontFamily':
                let fontFamily = "'Inter', sans-serif"; // Default
                if (value === 'serif') fontFamily = "'Playfair Display', serif";
                else if (value === 'jp') fontFamily = "'Sawarabi Mincho', serif";
                this.modalContent.style.fontFamily = fontFamily;
                break;
            case 'fontSize':
                this.modalContent.style.fontSize = `${value}px`;
                break;
            case 'lineHeight':
                this.modalContent.style.lineHeight = value;
                break;
        }
    }

    handleScrollProgress() {
        if (this.progThrottle) clearTimeout(this.progThrottle);
        this.progThrottle = setTimeout(() => {
            if (!this.modalContent || !this.currentContent) return;
            const percent = Math.round((this.modalContent.scrollTop / (this.modalContent.scrollHeight - this.modalContent.clientHeight || 1)) * 100);
            this.saveProgress(this.currentContent.id, percent);
        }, 150);
    }

    saveProgress(id, percent) {
        if (!id) return;
        try {
            localStorage.setItem(`readingProgress:${id}`, String(percent));
        } catch (e) { /* Silently fail on storage errors */ }
    }

    restoreProgress(id) {
        if (!this.modalContent || !id) return;
        const percent = localStorage.getItem(`readingProgress:${id}`);
        // Use a timeout to ensure content is rendered and scrollHeight is calculated
        setTimeout(() => {
            if (!this.modalContent) return;
            this.modalContent.scrollTop = percent ? (parseInt(percent, 10) / 100) * (this.modalContent.scrollHeight - this.modalContent.clientHeight) : 0;
        }, 0);
    }

    // Background inert/ARIA helpers
    getBackgroundContainers() {
        return Array.from(document.querySelectorAll('header, main, footer'));
    }

    setBackgroundInert(on) {
        const els = this.getBackgroundContainers();
        els.forEach(el => {
            if (!el) return;
            if (on) {
                el.setAttribute('aria-hidden', 'true');
                // if ('inert' in el) {
                //     try { el.inert = true; } catch (e) {}
                // }
            } else {
                el.removeAttribute('aria-hidden');
                // if ('inert' in el) {
                //     try { el.inert = false; } catch (e) {}
                // }
            }
        });
    }

    // Public methods
    isModalOpen() {
        return this.isOpen;
    }
    
    getCurrentContent() {
        return this.currentContent;
    }
    
    // Cleanup
    destroy() {
        if (this.tabKeyHandler) {
            this.modal.removeEventListener('keydown', this.tabKeyHandler);
        }
        
        if (this.isOpen) {
            this.close();
        }
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.readingModal = new ReadingModal();
    
    // Handle URL hash on page load for direct content access
    if (window.location.hash && window.location.hash.startsWith('#read-')) {
        const contentId = window.location.hash.replace('#read-', '');
        
        // Wait for app to be ready
        const checkApp = setInterval(() => {
            if (window.libraryApp) {
                clearInterval(checkApp);
                const content = window.libraryApp.getContentById(contentId);
                if (content) {
                    window.readingModal.open(content);
                }
            }
        }, 100);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReadingModal;
}
