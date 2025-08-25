
// Enhanced lazy loader with skeletons for images and background images using data-src
(function(){
    function loadBackground(el, src, obs) {
        const img = new Image();
        img.onload = function() {
            el.style.backgroundImage = `url('${src}')`;
            el.removeAttribute('data-src');
            el.classList.remove('skeleton');
            if (obs) obs.unobserve(el);
        };
        img.onerror = function() {
            // On error, still remove skeleton to avoid infinite shimmer
            el.removeAttribute('data-src');
            el.classList.remove('skeleton');
            if (obs) obs.unobserve(el);
        };
        img.src = src;
    }

    function loadImg(el, src, obs) {
        // Add a one-time load/error handler to remove skeleton
        const onDone = () => {
            el.classList.remove('skeleton');
            el.removeEventListener('load', onDone);
            el.removeEventListener('error', onDone);
            if (obs) obs.unobserve(el);
        };
        el.addEventListener('load', onDone, { once: true });
        el.addEventListener('error', onDone, { once: true });
        el.src = src;
        el.removeAttribute('data-src');
    }

    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const src = el.getAttribute('data-src');
                if (!src) { obs.unobserve(el); return; }

                if (el.tagName === 'IMG') {
                    loadImg(el, src, obs);
                } else {
                    loadBackground(el, src, obs);
                }
            });
        }, {rootMargin: '200px 0px'});

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-src]').forEach(el => {
                // Add skeleton shimmer until loaded
                el.classList.add('skeleton');
                imgObserver.observe(el);
            });
        });
    } else {
        // Fallback: load immediately
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('[data-src]').forEach(el => {
                const src = el.getAttribute('data-src');
                if (!src) return;
                el.classList.add('skeleton');
                if (el.tagName === 'IMG') {
                    el.addEventListener('load', () => el.classList.remove('skeleton'), { once: true });
                    el.addEventListener('error', () => el.classList.remove('skeleton'), { once: true });
                    el.src = src;
                } else {
                    loadBackground(el, src);
                }
                el.removeAttribute('data-src');
            });
        });
    }
})();

