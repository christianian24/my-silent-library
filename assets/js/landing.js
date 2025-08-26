document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('landingContainer');

    function navigateToLibrary() {
        // Set a flag in sessionStorage to trigger the fade-in on the main page
        sessionStorage.setItem('fromLanding', 'true');

        // Add fade-out class to the body
        document.body.classList.add('fade-out');

        // Wait for the fade-out transition to complete before redirecting
        setTimeout(() => {
            // Redirect to library.html (the renamed index.html)
            window.location.href = 'library.html';
        }, 1000); // This duration should match the transition in landing.css
    }

    // Allow clicking anywhere on the container to continue
    if (container) {
        container.addEventListener('click', navigateToLibrary);
    }
});