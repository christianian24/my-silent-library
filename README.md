# My Silent Library 📚

A modern, responsive personal library website for hosting your novels, notes, and writings. Built with vanilla HTML, CSS, and JavaScript - no frameworks required.

### My Silent Library Preview
- **Link** - https://christianian24.github.io/my-silent-library/

## ✨ Features

- **📖 Content Management** - Organize novels, notes, and quotes with tags and categories
- **🔍 Smart Search** - Find content instantly with intelligent search and filtering
- **📱 Responsive Design** - Perfect reading experience on any device
- **🌙 Dark/Light Mode** - Toggle between themes with smooth transitions
- **📥 Download Support** - Download files in PDF, DOCX, and TXT formats
- **♿ Accessibility** - Screen reader support and keyboard navigation
- **⚡ Performance** - Fast loading with lazy loading and virtual scrolling
- **🔧 No Backend** - Static site perfect for GitHub Pages deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MySilentLibrary.git
   cd MySilentLibrary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see your library.

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
MySilentLibrary/
├── index.html                 # Main HTML file
├── package.json               # Dependencies & scripts
├── vite.config.js             # Build configuration
├── assets/
│   ├── css/                   # Stylesheets
│   │   ├── base/              # Foundation styles
│   │   ├── components/        # Component styles
│   │   └── main.css           # Main stylesheet
│   └── js/                    # JavaScript modules
│       ├── app.js             # Main application
│       ├── content-data.js    # Content management
│       ├── search.js          # Search functionality
│       └── ...                # Other modules
├── content/                   # Your content files
│   ├── novels/               # Novel documents
│   ├── notes/                # Note documents
│   └── quotes/               # Quote collections
└── sw.js                     # Service worker
```

## 📝 Adding Content

### 1. Edit Content Data
Open `assets/js/content-data.js` and add your content:

```javascript
// Add a new novel
{
    id: 'novel-001',
    title: 'My First Novel',
    category: 'novels',
    excerpt: 'A compelling story about...',
    content: '<h1>My First Novel</h1><p>Your content here...</p>',
    date: '2024-01-15',
    tags: ['fiction', 'adventure'],
    downloadUrl: 'content/novels/my-novel.pdf',
    wordCount: 5000,
    readingTime: 20
}
```

### 2. Add Downloadable Files
Place your files in the appropriate `content/` folders:
- `content/novels/` - For novel PDFs and documents
- `content/notes/` - For note documents
- `content/quotes/` - For quote collections

### 3. Content Guidelines
- **ID**: Use unique, descriptive IDs
- **Title**: Keep concise but descriptive
- **Excerpt**: 1-2 sentences summarizing the content
- **Content**: Use HTML for formatting
- **Tags**: Add relevant tags for searchability
- **Date**: Use YYYY-MM-DD format

## 🎨 Customization

### Colors & Theme
Edit `assets/css/base/variables.css`:

```css
:root {
    --accent-primary: #0d6efd;    /* Primary color */
    --accent-secondary: #6f42c1;  /* Secondary color */
    --bg-primary: #ffffff;        /* Background */
    --text-primary: #212529;      /* Text color */
}
```

### Fonts
Replace Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap" rel="stylesheet">
```

### Adding Categories
1. Add to navigation in `index.html`
2. Update category handling in `assets/js/app.js`
3. Add category labels in the `getCategoryLabel` method

## 🔧 Advanced Features

### Keyboard Shortcuts
- **Escape** - Close modal
- **Arrow Keys** - Navigate content
- **Ctrl/Cmd + D** - Download current content
- **Tab** - Navigate modal elements

### URL Navigation
- `#novels` - Show novels category
- `#notes` - Show notes category
- `#quotes` - Show quotes category
- `#read-content-id` - Open specific content

### Search Features
- Title-based search (highest priority)
- Tag-based filtering
- Content text search
- Word boundary matching

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interface
- Optimized typography for small screens
- Swipe gestures for navigation

## ♿ Accessibility

- Screen reader support
- Keyboard navigation
- High contrast themes
- Semantic HTML structure
- ARIA labels and descriptions
- Focus management

## 🚀 Deployment

### GitHub Pages
1. Push to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://yourusername.github.io/MySilentLibrary`

### Other Platforms
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting

## 🐛 Troubleshooting

### Common Issues

**Content not displaying?**
- Check browser console for JavaScript errors
- Verify content structure in `content-data.js`
- Ensure all required fields are present

**Search not working?**
- Check if search input exists in HTML
- Verify search event listeners are attached
- Check for JavaScript errors

**Build errors?**
- Check Node.js version (requires 18+)
- Clear `node_modules` and run `npm install`
- Verify all dependencies are installed

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

## 📚 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS 12+, Android 8+

## 🛠️ Development

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality (if configured)
npm run lint         # Lint JavaScript
npm run format       # Format code
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fonts**: [Google Fonts](https://fonts.google.com/) (Crimson Text, Inter)
- **Icons**: [Feather Icons](https://feathericons.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📞 Support

- 📧 Open an [issue](https://github.com/christianian24/MySilentLibrary/issues) on GitHub
- 📖 Check the troubleshooting section above
- 💬 Review code comments for implementation details

---

**Happy Writing! 📚✨**

Your personal digital library is ready to showcase your creativity and share your stories with the world.


- **UPDATE**: [8/19/2025]