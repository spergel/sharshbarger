const CSS_VERSION = '1.03';

function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Load header and footer on page load
window.addEventListener('load', function() {
    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
    
    // Add CSS version dynamically
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href^="styles.css"]');
    cssLinks.forEach(link => {
        link.href = `styles.css?v=${CSS_VERSION}`;
    });
});



