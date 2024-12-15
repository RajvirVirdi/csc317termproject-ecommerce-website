// Scroll to section function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add to cart functionality
const cartButtons = document.querySelectorAll('.add-to-cart');
cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Item added to cart!');
    });
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.getElementById('footer');
    footer.innerHTML += `<p>&copy; ${new Date().getFullYear()} WatchZone. All Rights Reserved.</p>`;
});