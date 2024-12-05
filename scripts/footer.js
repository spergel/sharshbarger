function loadFooter() {
    fetch('components/Footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// Add any interactive functionality here
document.addEventListener('DOMContentLoaded', () => {
    // Example: Add smooth scrolling to footer links
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hash) {
                e.preventDefault();
                document.querySelector(link.hash).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 