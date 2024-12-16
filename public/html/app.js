// Carousel functionality
const carouselItems = document.querySelectorAll('.carousel-item');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentSlide = 0;
let autoSlideInterval;

function showSlide(index, direction = 'right') {
    const currentItem = carouselItems[currentSlide];
    const nextItem = carouselItems[index];
    
    // Remove existing classes
    carouselItems.forEach(item => {
        item.classList.remove('active', 'slide-left', 'slide-right');
    });

    // Add animation classes based on direction
    if (direction === 'right') {
        currentItem.classList.add('slide-left');
        nextItem.classList.add('slide-right', 'active');
    } else {
        currentItem.classList.add('slide-right'); 
        nextItem.classList.add('slide-left', 'active');
    }
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselItems.length;
        showSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

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

// Start auto-sliding
startAutoSlide();

// Tooltip for Add to Cart with custom notification
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="checkmark">✓</span>
                Item added to cart!
            </div>
        `;
        document.body.appendChild(notification);
        
        // Animate notification
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    });
});