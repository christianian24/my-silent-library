/**
 * Theme Management for My Silent Library
 * Handles dark/light mode switching with smooth transitions and persistent storage
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeDetection();
    }
    
    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) return;
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Update toggle button state
        this.updateToggleButton();
    }
    
    setupSystemThemeDetection() {
        // Check if user prefers dark mode
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Listen for system theme changes
            mediaQuery.addEventListener('change', (e) => {
                if (!this.hasUserPreference()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
            
            // Apply system preference on first load if no user preference
            if (!this.hasUserPreference()) {
                this.applyTheme(mediaQuery.matches ? 'dark' : 'light');
            }
        }
    }
    
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('libraryTheme');
            if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
                this.currentTheme = savedTheme;
            }
        } catch (error) {
            console.warn('Could not load saved theme:', error);
        }
    }
    
    saveTheme(theme) {
        try {
            localStorage.setItem('libraryTheme', theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }
    
    hasUserPreference() {
        try {
            return localStorage.getItem('libraryTheme') !== null;
        } catch (error) {
            return false;
        }
    }
    
    toggleTheme() {
        if (this.isTransitioning) return;
        
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        if (this.currentTheme === theme || this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Add transition class to body
        document.body.classList.add('theme-transitioning');
        
        // Apply new theme
        this.applyTheme(theme);
        
        // Save preference
        this.saveTheme(theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Update toggle button
        this.updateToggleButton();
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
            this.isTransitioning = false;
        }, 300);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
    }
    
    applyTheme(theme) {
        // Remove existing theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.body.classList.remove('theme-light', 'theme-dark');
        
        // Add new theme class
        document.documentElement.classList.add(`theme-${theme}`);
        document.body.classList.add(`theme-${theme}`);
        
        // Set data attribute for CSS targeting
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Update CSS custom properties
        this.updateCSSVariables(theme);
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#0a0a0a'
        };
        
        metaThemeColor.content = colors[theme] || colors.light;
    }
    
    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        // Define theme-specific CSS variables
        const themeVariables = {
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8f9fa',
                '--bg-tertiary': '#e9ecef',
                '--text-primary': '#212529',
                '--text-secondary': '#6c757d',
                '--text-muted': '#adb5bd',
                '--border-color': '#dee2e6',
                '--shadow-light': 'rgba(0, 0, 0, 0.1)',
                '--shadow-medium': 'rgba(0, 0, 0, 0.15)'
            },
            dark: {
                '--bg-primary': '#0a0a0a',
                '--bg-secondary': '#1a1a1a',
                '--bg-tertiary': '#2a2a2a',
                '--text-primary': '#e9ecef',
                '--text-secondary': '#adb5bd',
                '--text-muted': '#6c757d',
                '--border-color': '#404040',
                '--shadow-light': 'rgba(0, 0, 0, 0.3)',
                '--shadow-medium': 'rgba(0, 0, 0, 0.5)'
            }
        };
        
        const variables = themeVariables[theme] || themeVariables.light;
        
        Object.entries(variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
    
    updateToggleButton() {
        if (!this.themeToggle) return;
        
        const sunIcon = this.themeToggle.querySelector('.sun-icon');
        const moonIcon = this.themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: theme,
                previousTheme: this.currentTheme
            }
        });
        document.dispatchEvent(event);
    }
    
    // Public methods
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
    
    isLightMode() {
        return this.currentTheme === 'light';
    }
    
    // Utility methods
    getThemePreference() {
        return {
            current: this.currentTheme,
            hasUserPreference: this.hasUserPreference(),
            systemPreference: this.getSystemPreference()
        };
    }
    
    getSystemPreference() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            return mediaQuery.matches ? 'dark' : 'light';
        }
        return 'light';
    }
    
    // Animation and transition helpers
    addThemeTransition() {
        document.body.classList.add('theme-transitioning');
    }
    
    removeThemeTransition() {
        document.body.classList.remove('theme-transitioning');
    }
    
    // Accessibility features
    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        announcement.textContent = `Switched to ${theme} mode`;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Cleanup
    destroy() {
        if (this.themeToggle) {
            this.themeToggle.removeEventListener('click', this.toggleTheme);
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Listen for theme change events
    document.addEventListener('themeChanged', (e) => {
        console.log(`Theme changed from ${e.detail.previousTheme} to ${e.detail.theme}`);
        
        // Announce to screen readers
        if (window.themeManager) {
            window.themeManager.announceThemeChange(e.detail.theme);
        }
    });
});

// Handle system theme changes when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.themeManager) {
        // Check if system theme has changed
        const systemPreference = window.themeManager.getSystemPreference();
        if (!window.themeManager.hasUserPreference() && 
            systemPreference !== window.themeManager.getCurrentTheme()) {
            window.themeManager.setTheme(systemPreference);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
