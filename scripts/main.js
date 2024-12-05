// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// When the document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    loadComponent('header-container', 'components/Header.html');
    loadComponent('footer-container', 'components/Footer.html');

    // Mobile menu toggle
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('mobile-menu-button')) {
            document.querySelector('.nav-links').classList.toggle('active');
        }
    });

    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 