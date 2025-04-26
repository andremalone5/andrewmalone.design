// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');
    
    // Add a simple click event listener to the header
    const header = document.querySelector('header');
    header.addEventListener('click', () => {
        alert('Welcome to the website!');
    });
}); 