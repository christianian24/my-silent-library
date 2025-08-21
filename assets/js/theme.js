/**
 * Theme Management for My Silent Library
 * Handles dark/light mode switching with persistent storage.
 */
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getInitialTheme();

        this.init();
    }

    init() {
        if (!this.themeToggle) {
            console.warn('Theme toggle button not found.');
            return;
        }
        
        this.applyTheme(this.currentTheme);
        
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if the user hasn't made a manual selection
            if (!localStorage.getItem('libraryTheme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
        });
    }

    getInitialTheme() {
        // 1. User preference from localStorage
        const savedTheme = localStorage.getItem('libraryTheme');
        if (savedTheme) {
            return savedTheme;
        }

        // 2. System preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // 3. Default
        return 'light';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('libraryTheme', theme);
        this.applyTheme(theme);
        this.announceThemeChange(theme);
    }

    applyTheme(theme) {
        // Set data attribute for CSS targeting
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleButton(theme);
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    updateToggleButton(theme) {
        if (!this.themeToggle) return;
        
        // The aria-label provides context for screen readers about the button's action.
        const newLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        this.themeToggle.setAttribute('aria-label', newLabel);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // These colors should match the --bg-primary in your theme.css
        const colors = {
            light: '#f4f1ea',
            dark: '#1a1d22'
        };
        
        metaThemeColor.content = colors[theme] || colors.light;
    }

    announceThemeChange(theme) {
        const announcer = document.getElementById('theme-announcer');
        if (announcer) {
            // This text will be read aloud by screen readers.
            announcer.textContent = `Switched to ${theme} mode.`;
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
