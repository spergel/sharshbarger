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

function loadReducedProfile() {
    console.log('Loading ReducedProfile...');
    fetch('components/ReducedProfile.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('reduced-profile-container');
            if (!container) {
                throw new Error('reduced-profile-container not found');
            }
            container.innerHTML = html;
            console.log('ReducedProfile loaded successfully');
        })
        .catch(error => {
            console.error('Error loading ReducedProfile:', error);
        });
}

// When the document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    loadHeader();
    loadFooter();
    loadReducedProfile();
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