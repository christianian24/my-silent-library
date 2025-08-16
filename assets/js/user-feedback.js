/**
 * User Feedback Module
 * Provides toast notifications, loading states, and error handling
 */

class UserFeedbackManager {
    constructor() {
        this.notifications = [];
        this.loadingStates = new Map();
        this.errorHandlers = new Map();
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupGlobalErrorHandling();
        this.setupLoadingStates();
    }

    createNotificationContainer() {
        // Create notification container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    setupGlobalErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.showError('An unexpected error occurred', event.error);
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.showError('An operation failed', event.reason);
        });

        // Network errors
        window.addEventListener('offline', () => {
            this.showWarning('You are currently offline. Some features may not work.');
        });

        window.addEventListener('online', () => {
            this.showSuccess('Connection restored');
        });
    }

    setupLoadingStates() {
        // Setup loading states for common operations
        this.setupSearchLoading();
        this.setupModalLoading();
        this.setupContentLoading();
    }

    setupSearchLoading() {
        // Override search function to show loading state
        const originalSearch = window.LibrarySearch?.search || (() => {});
        
        if (window.LibrarySearch) {
            window.LibrarySearch.search = function(...args) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    this.showLoadingState(searchInput, 'Searching...');
                }
                
                const result = originalSearch.apply(this, args);
                
                // If it's a promise, handle async loading
                if (result && typeof result.then === 'function') {
                    result.finally(() => {
                        this.hideLoadingState(searchInput);
                    });
                } else {
                    setTimeout(() => {
                        this.hideLoadingState(searchInput);
                    }, 500);
                }
                
                return result;
            }.bind(this);
        }
    }

    setupModalLoading() {
        // Override modal open to show loading state
        const originalModalOpen = window.ReadingModal?.open || (() => {});
        
        if (window.ReadingModal) {
            window.ReadingModal.open = function(...args) {
                const modal = document.getElementById('readingModal');
                if (modal) {
                    this.showLoadingState(modal, 'Loading content...');
                }
                
                const result = originalModalOpen.apply(this, args);
                
                // Hide loading when modal is fully visible
                setTimeout(() => {
                    this.hideLoadingState(modal);
                }, 300);
                
                return result;
            }.bind(this);
        }
    }

    setupContentLoading() {
        // Setup content loading states
        this.setupContentGridLoading();
    }

    setupContentGridLoading() {
        const contentGrid = document.getElementById('contentGrid');
        if (contentGrid) {
            // Show loading state when content is being fetched
            this.showLoadingState(contentGrid, 'Loading content...');
            
            // Hide loading when content is loaded
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if content was added
                        const hasContent = Array.from(mutation.addedNodes).some(node => 
                            node.nodeType === Node.ELEMENT_NODE && 
                            node.classList.contains('content-item')
                        );
                        
                        if (hasContent) {
                            setTimeout(() => {
                                this.hideLoadingState(contentGrid);
                            }, 500);
                        }
                    }
                });
            });
            
            observer.observe(contentGrid, { childList: true });
        }
    }

    // Toast Notifications
    showNotification(message, type = 'info', duration = 5000) {
        const notification = this.createNotificationElement(message, type);
        this.notifications.push(notification);
        
        // Add to container
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        return notification;
    }

    showSuccess(message, duration) {
        return this.showNotification(message, 'success', duration);
    }

    showError(message, error = null, duration) {
        const fullMessage = error ? `${message}: ${error.message || error}` : message;
        return this.showNotification(fullMessage, 'error', duration);
    }

    showWarning(message, duration) {
        return this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration) {
        return this.showNotification(message, 'info', duration);
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getNotificationIcon(type);
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close notification');
        
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        notification.appendChild(closeBtn);
        
        return notification;
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        if (!notification) return;
        
        notification.classList.remove('show');
        notification.classList.add('hiding');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    // Loading States
    showLoadingState(element, message = 'Loading...') {
        if (!element) return;
        
        const loadingId = this.generateLoadingId();
        this.loadingStates.set(loadingId, { element, message });
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.dataset.loadingId = loadingId;
        
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        `;
        
        element.appendChild(overlay);
        element.classList.add('loading');
        
        return loadingId;
    }

    hideLoadingState(element) {
        if (!element) return;
        
        // Find and remove loading overlay
        const overlay = element.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        element.classList.remove('loading');
        
        // Remove from loading states
        for (const [id, state] of this.loadingStates) {
            if (state.element === element) {
                this.loadingStates.delete(id);
                break;
            }
        }
    }

    generateLoadingId() {
        return 'loading_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Progress Indicators
    showProgress(element, message = 'Processing...') {
        if (!element) return;
        
        const progressId = this.generateLoadingId();
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.dataset.progressId = progressId;
        
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-message">${message}</div>
        `;
        
        element.appendChild(progressBar);
        element.classList.add('progress');
        
        return {
            id: progressId,
            update: (percentage) => this.updateProgress(progressId, percentage),
            complete: () => this.completeProgress(progressId),
            hide: () => this.hideProgress(progressId)
        };
    }

    updateProgress(progressId, percentage) {
        const progressBar = document.querySelector(`[data-progress-id="${progressId}"]`);
        if (progressBar) {
            const fill = progressBar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
            }
        }
    }

    completeProgress(progressId) {
        this.updateProgress(progressId, 100);
        setTimeout(() => {
            this.hideProgress(progressId);
        }, 500);
    }

    hideProgress(progressId) {
        const progressBar = document.querySelector(`[data-progress-id="${progressId}"]`);
        if (progressBar) {
            progressBar.remove();
        }
        
        const element = progressBar?.parentElement;
        if (element) {
            element.classList.remove('progress');
        }
    }

    // Error Handling
    showError(message, error = null, duration = 8000) {
        // Log error to console
        if (error) {
            console.error('User Feedback Error:', error);
        }
        
        // Show error notification
        return this.showError(message, error, duration);
    }

    handleError(error, context = '') {
        const message = context ? `${context}: ${error.message || error}` : error.message || error;
        return this.showError(message, error);
    }

    // Success Feedback
    showSuccess(message, duration = 3000) {
        return this.showSuccess(message, duration);
    }

    // Warning Feedback
    showWarning(message, duration = 5000) {
        return this.showWarning(message, duration);
    }

    // Info Feedback
    showInfo(message, duration = 4000) {
        return this.showInfo(message, duration);
    }

    // Bulk Operations
    showBulkOperationProgress(total, current, message = 'Processing items...') {
        const percentage = (current / total) * 100;
        const progressMessage = `${message} (${current}/${total})`;
        
        // Show progress in a fixed location
        let progressContainer = document.getElementById('bulk-progress-container');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'bulk-progress-container';
            progressContainer.className = 'bulk-progress-container';
            document.body.appendChild(progressContainer);
        }
        
        const progress = this.showProgress(progressContainer, progressMessage);
        progress.update(percentage);
        
        if (current >= total) {
            setTimeout(() => {
                progress.complete();
            }, 500);
        }
        
        return progress;
    }

    // Clean up
    destroy() {
        // Remove all notifications
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
        
        // Clear loading states
        this.loadingStates.clear();
        
        // Remove notification container
        const container = document.getElementById('notification-container');
        if (container) {
            container.remove();
        }
        
        // Remove bulk progress container
        const bulkContainer = document.getElementById('bulk-progress-container');
        if (bulkContainer) {
            bulkContainer.remove();
        }
    }
}

// Initialize user feedback manager
const userFeedbackManager = new UserFeedbackManager();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserFeedbackManager;
} else {
    window.UserFeedbackManager = UserFeedbackManager;
    window.userFeedbackManager = userFeedbackManager;
}
