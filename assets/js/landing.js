/**
 * Landing Page Specific JavaScript
 * Handles entry and exit animations.
 */
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.landing-wrapper');
    const enterButton = document.getElementById('enterBtn');

    // Animate elements with a staggered fade-in
    const elementsToAnimate = document.querySelectorAll('.hero-icon, .hero-title, .hero-subtitle, .hero-button, .landing-footer');
    elementsToAnimate.forEach((el, index) => {
        el.style.animationDelay = `${200 + index * 150}ms`;
        el.classList.add('fade-in');
    });

    // Smooth exit transition
    if (enterButton && wrapper) {
        enterButton.addEventListener('click', (e) => {
            e.preventDefault();
            const destination = enterButton.href;
            wrapper.classList.add('is-exiting');
            setTimeout(() => {
                window.location.href = destination;
            }, 500); // Match the animation duration in CSS
        });
    }
});