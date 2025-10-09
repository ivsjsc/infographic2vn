const HEADER_BG_DEFAULT = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))';
const HEADER_BG_SCROLLED = 'linear-gradient(135deg, rgba(79, 70, 229, 0.96), rgba(236, 72, 153, 0.94))';

function updateHeaderOnScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 56) {
        header.style.boxShadow = '0 18px 35px rgba(15, 23, 42, 0.22)';
        header.style.background = HEADER_BG_SCROLLED;
    } else {
        header.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.18)';
        header.style.background = HEADER_BG_DEFAULT;
    }
}

window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

async function injectPartial(placeholderId, url) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return null;
    try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Không thể tải ${url}`);
        const html = await response.text();
        placeholder.innerHTML = html;
        return placeholder;
    } catch (err) {
        console.error(err);
        placeholder.innerHTML = `<p class="partial-error">Không thể tải nội dung. Vui lòng thử lại sau.</p>`;
        return null;
    }
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('header-theme-toggle');
    if (!toggleBtn) return;

    const applyTheme = (theme) => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.has-dropdown');
    if (!dropdowns.length) return;

    const closeAll = () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('submenu-open');
            const panel = dropdown.querySelector('.dropdown-panel');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (panel) panel.classList.remove('active');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const panel = dropdown.querySelector('.dropdown-panel');
        if (!toggle || !panel) return;

        toggle.addEventListener('click', (evt) => {
            evt.preventDefault();
            const isOpen = dropdown.classList.contains('submenu-open');
            closeAll();
            if (!isOpen) {
                dropdown.classList.add('submenu-open');
                panel.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
                const firstLink = panel.querySelector('a');
                if (firstLink) firstLink.focus({ preventScroll: true });
            }
        });

        toggle.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                toggle.click();
            }
            if (evt.key === 'Escape') {
                dropdown.classList.remove('submenu-open');
                panel.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', (evt) => {
        if (!evt.target.closest('.has-dropdown')) {
            closeAll();
        }
    });

    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
            closeAll();
        }
    });
}

function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (!navToggle || !mainNav) return;

    const closeNav = () => {
        navToggle.checked = false;
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');
        mainNav.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    };

    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.setAttribute('aria-hidden', 'true');

    navToggle.addEventListener('change', () => {
        const expanded = navToggle.checked;
        navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        mainNav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        mainNav.classList.toggle('is-open', expanded);
        document.body.classList.toggle('no-scroll', expanded);
    });

    // JS fallback: make sure the visible hamburger label always toggles the nav
    // (some browsers / environments may not toggle the hidden checkbox reliably)
    const navLabel = document.querySelector('label.nav-toggle[for="nav-toggle"]');
    if (navLabel) {
        navLabel.addEventListener('click', (e) => {
            // Prevent double-handling if label click already toggles checkbox
            try {
                const prev = navToggle.checked;
                navToggle.checked = !prev;
                // Dispatch change so other listeners run
                navToggle.dispatchEvent(new Event('change', { bubbles: true }));
                // Move focus to the hidden checkbox for accessibility
                navToggle.focus({ preventScroll: true });
                e.preventDefault();
            } catch (err) {
                // ignore
            }
        });

        navLabel.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                navToggle.checked = !navToggle.checked;
                navToggle.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    mainNav.addEventListener('click', (evt) => {
        if (evt.target.closest('a')) {
            closeNav();
        }
    });

    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' && navToggle.checked) {
            closeNav();
        }
    });
}

function initHeaderInteractions() {
    const header = document.querySelector('header');
    if (!header) return;

    updateHeaderOnScroll();
    initThemeToggle();
    initDropdowns();
    initMobileNav();
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        injectPartial('header-placeholder', 'components/header.html'),
        injectPartial('footer-placeholder', 'components/footer.html')
    ]);
    initHeaderInteractions();
    updateHeaderOnScroll();
});