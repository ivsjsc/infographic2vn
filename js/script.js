// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        header.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        header.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }
});

// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

// After header/footer are loaded, wire up mobile menu accessibility & behavior
document.addEventListener('DOMContentLoaded', function setupMobileMenu() {
    // Use a short delay to ensure injected HTML is parsed; if pages are large this still runs quickly
    setTimeout(() => {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        if (!navToggle || !mainNav) return;

        // Reflect initial ARIA state
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');

        // When checkbox changes, update ARIA attributes
        navToggle.addEventListener('change', function() {
            const expanded = this.checked;
            this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            mainNav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        });

        // Auto-close menu when a nav link is clicked (useful for single-page or multi-page)
        const links = mainNav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                // If menu is open, close it
                if (navToggle.checked) {
                    navToggle.checked = false;
                    navToggle.dispatchEvent(new Event('change'));
                }
            });
        });
    }, 60);
});