// Carousel functionality
const carouselItems = document.querySelectorAll('.carousel-item');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentSlide = 0;
let autoSlideInterval;

// Function to handle slide transitions and animations
function showSlide(index, direction = 'right') {
    const currentItem = carouselItems[currentSlide];
    const nextItem = carouselItems[index];
    
    // Remove existing animation classes from all slides
    carouselItems.forEach(item => {
        item.classList.remove('active', 'slide-left', 'slide-right');
    });

    // Add appropriate animation classes based on slide direction
    if (direction === 'right') {
        currentItem.classList.add('slide-left');
        nextItem.classList.add('slide-right', 'active');
    } else {
        currentItem.classList.add('slide-right'); 
        nextItem.classList.add('slide-left', 'active');
    }
}

// Start automatic slideshow with 5 second intervals
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselItems.length;
        showSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds
}

// Stop automatic slideshow (used when manually changing slides)
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Event handlers for previous/next buttons
prev.addEventListener('click', () => {
    stopAutoSlide();
    currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
    showSlide(currentSlide, 'left');
    startAutoSlide();
});

next.addEventListener('click', () => {
    stopAutoSlide();
    currentSlide = (currentSlide + 1) % carouselItems.length;
    showSlide(currentSlide, 'right');
    startAutoSlide();
});

// Initialize automatic slideshow
startAutoSlide();

// Add to Cart functionality with animated notification
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        // Create and style notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="checkmark">✓</span>
                Item added to cart!
            </div>
        `;
        document.body.appendChild(notification);
        
        // Handle notification animation timing
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    });
});