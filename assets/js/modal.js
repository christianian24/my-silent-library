/**
 * Modal Functionality for My Silent Library
 * Handles reading modal, content display, and download functionality
 */

class ReadingModal {
    constructor() {
        this.modal = null;
        this.modalContentWrapper = null;
        this.currentContent = null;
        this.isOpen = false;
        this.previousActiveElement = null;
        this.settingsBtn = null;
        this.settingsPanel = null;

        // Bind context for event handlers
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
        this.settingsBtn = document.getElementById('modalSettingsBtn');
        this.settingsPanel = document.getElementById('modalSettingsPanel');
    }
    
    setupEventListeners() {
        // Listen for modal open events
        document.addEventListener('openReadingModal', (e) => {
            this.open(e.detail);
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
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSettingsPanel();
            });
        }
        
        // Download button
        const downloadBtn = document.getElementById('modalDownload');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
        }
        
        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
        
        // Prevent modal content clicks from closing modal
        const innerContent = this.modal ? this.modal.querySelector('.modal-content') : null;
        if (innerContent) {
            innerContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    toggleSettingsPanel() {
        if (!this.settingsPanel || !this.settingsBtn) return;

        const isHidden = this.settingsPanel.hidden;

        if (isHidden) {
            this.settingsPanel.hidden = false;
            this.settingsBtn.setAttribute('aria-expanded', 'true');
            // Use a timeout to prevent the same click event from immediately closing the panel
            setTimeout(() => {
                document.addEventListener('click', this.handleOutsideSettingsClick);
            }, 0);
        } else {
            this.settingsPanel.hidden = true;
            this.settingsBtn.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', this.handleOutsideSettingsClick);
        }
    }

    handleOutsideSettingsClick(e) {
        if (!this.settingsPanel.contains(e.target) && e.target !== this.settingsBtn) {
            this.toggleSettingsPanel();
        }
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
            }
        });
    }
    
    open(content) {
        if (!content || !this.modal) return;
        
        // Remember the element that triggered the modal for focus restoration
        this.previousActiveElement = (document.activeElement && typeof document.activeElement.focus === 'function') ? document.activeElement : null;

        this.currentContent = content;
        this.isOpen = true;
        
        // Update modal content
        this.updateModalContent(content);
        
        // Show modal
        this.modal.classList.add('show');
        // Hide background from assistive tech and interaction
        this.setBackgroundInert(true);

        // Focus management
        this.trapFocus();
        
        // Update URL without page reload
        this.updateURL(content.id);
        
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
        if (this.settingsPanel && !this.settingsPanel.hidden) {
            this.toggleSettingsPanel();
        }

        this.isOpen = false;
        
        // Hide modal
        this.modal.classList.remove('show');

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
        
        const allContent = window.libraryApp ? window.libraryApp.getAllContent() : [];
        if (allContent.length === 0) return;
        
        const currentIndex = allContent.findIndex(item => item.id === this.currentContent.id);
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % allContent.length;
        } else {
            nextIndex = currentIndex === 0 ? allContent.length - 1 : currentIndex - 1;
        }
        
        const nextContent = allContent[nextIndex];
        if (nextContent) {
            this.open(nextContent);
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

    // Background inert/ARIA helpers
    getBackgroundContainers() {
        return Array.from(document.querySelectorAll('header, nav, main, footer'));
    }

    setBackgroundInert(on) {
        const els = this.getBackgroundContainers();
        els.forEach(el => {
            if (!el) return;
            if (on) {
                el.setAttribute('aria-hidden', 'true');
                if ('inert' in el) {
                    try { el.inert = true; } catch (e) {}
                }
            } else {
                el.removeAttribute('aria-hidden');
                if ('inert' in el) {
                    try { el.inert = false; } catch (e) {}
                }
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
