# My Silent Library

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://your-live-demo-url.com) <!-- Replace with your actual demo link -->

A beautifully designed, quiet digital space for reading and organizing thoughts, quotes, and stories. This project is a front-end application with a strong focus on a clean user experience, modern aesthetics, and accessibility.

![My Silent Library Screenshot](https://via.placeholder.com/800x450.png/1a1a1a/ffffff?text=My+Silent+Library+Screenshot)
*Replace this placeholder with a screenshot of your application.*

---

## ✨ Features

My Silent Library is built with a rich set of features to provide an immersive and comfortable reading experience.

- **🎨 Elegant & Responsive Design**: A clean, minimalist interface that looks and works great on desktops, tablets, and mobile devices.
- **🌗 Dark & Light Modes**: Seamlessly switch between themes for comfortable reading, day or night. The user's preference is saved locally.
- **📚 Content Organization**: Browse content through well-defined categories like Novels, Notes, and Quotes.
- **🔍 Powerful Search**: A fast, client-side search modal allows you to instantly find content by title, tag, or keyword.
- **👓 Accessible Reading Experience**: The reading modal offers robust accessibility options:
  - **Font Style**: Choose between modern sans-serif, classic serif, and Japanese Mincho fonts.
  - **Font Size**: Adjust the text size for optimal readability.
  - **Line Height**: Customize line spacing to reduce eye strain.
- **📖 Featured Passages**: Discover interesting snippets from the library with a rotating featured passage on the main page.
- **🎞️ Animated Showcase**: An engaging, horizontally-scrolling showcase of book spines adds a dynamic and visually appealing touch to the library.
- **✈️ Offline Access**: (PWA-ready) An `offline.html` page ensures users know they can still access previously visited works even without an internet connection.

---

## 🚀 Getting Started

No complex setup is required to run this project locally.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/my-silent-library.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd my-silent-library
    ```

3.  **Open `index.html` in your browser:**
    You can simply open the `index.html` file directly in a modern web browser, or use a live server extension in your code editor (like VS Code's Live Server) for the best experience with automatic reloads.

---

## 🛠️ Technologies Used

This project is built with web standards and a focus on a vanilla JavaScript architecture.

- **HTML5**: Semantic markup for structure and accessibility.
- **CSS3**:
  - **CSS Variables (Tokens)**: For a maintainable and scalable design system (`tokens.css`).
  - **Flexbox & Grid**: For modern, responsive layouts.
  - **Custom Properties**: Used extensively for theming and dynamic styling.
- **JavaScript (ES6+)**:
  - **Modular Code**: Logic is split into separate files for concerns like `theme`, `nav`, `modal`, `search`, etc.
  - **DOM Manipulation**: To dynamically render content, handle user interactions, and manage application state.
  - **No Frameworks**: Built with pure, vanilla JavaScript to keep it lightweight and fast.

---

## 🏛️ Project Structure

The codebase is organized logically to make it easy to navigate and maintain.

```
MySilentLibrary/
├── assets/
│   ├── css/
│   │   ├── landing.css
│   │   ├── style.css
│   │   └── tokens.css
│   └── js/
│       ├── app.js
│       ├── content-data.js
│       ├── landing.js
│       ├── lazy-loader.js
│       ├── modal.js
│       ├── nav.js
│       ├── search.js
│       └── theme.js
├── index.html          # Landing page
├── library.html        # Main application page
├── offline.html        # Offline fallback page
└── README.md           # You are here!
```

---

Feel free to contribute, open issues, or suggest features!
