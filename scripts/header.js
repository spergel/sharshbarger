function loadHeader() {
    fetch('components/Header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
} 