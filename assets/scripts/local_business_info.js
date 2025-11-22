// Local Business Info Page Scripts
// Handles gallery modal, rating modal, and map rendering

// Gallery Modal Functionality
let currentGallery = [];
let currentGalleryIndex = 0;
let currentServiceName = '';

// Gallery data will be populated from business serviceGalleries
let galleryData = {};

function setGalleryData(serviceGalleries) {
    galleryData = {};
    if (serviceGalleries) {
        Object.keys(serviceGalleries).forEach(serviceName => {
            const images = serviceGalleries[serviceName];
            if (Array.isArray(images)) {
                galleryData[serviceName] = images.map(img => {
                    return typeof img === 'string' ? img : (img.image || img.url || '');
                });
            }
        });
    }
}

function openGalleryModal(serviceName, imageIndex = 0) {
    if (!galleryData[serviceName] || galleryData[serviceName].length === 0) return;
    
    currentGallery = galleryData[serviceName];
    currentGalleryIndex = imageIndex;
    currentServiceName = serviceName;
    
    const modal = document.getElementById('galleryModal');
    const modalTitle = document.getElementById('galleryModalTitle');
    
    if (modalTitle) {
        modalTitle.textContent = serviceName;
    }
    
    updateGalleryImage();
    
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function updateGalleryImage() {
    if (!currentGallery || currentGalleryIndex === undefined) return;
    
    const modalImage = document.getElementById('galleryModalImage');
    const modalCounter = document.getElementById('galleryCounter');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    
    const currentImage = currentGallery[currentGalleryIndex];
    
    if (modalImage) {
        modalImage.classList.remove('loaded');
        modalImage.classList.add('loading');
        modalImage.src = '';
        modalImage.src = currentImage;
        modalImage.alt = `${currentServiceName} - Image ${currentGalleryIndex + 1}`;
        
        modalImage.onload = () => {
            modalImage.classList.remove('loading');
            modalImage.classList.add('loaded');
        };
    }
    
    if (modalCounter) {
        modalCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentGalleryIndex === 0;
        prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentGalleryIndex === currentGallery.length - 1;
        nextBtn.style.opacity = currentGalleryIndex === currentGallery.length - 1 ? '0.5' : '1';
    }
}

function previousGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryImage();
    }
}

function nextGalleryImage() {
    if (currentGalleryIndex < currentGallery.length - 1) {
        currentGalleryIndex++;
        updateGalleryImage();
    }
}

// Make functions globally accessible
window.openGalleryModal = openGalleryModal;
window.previousGalleryImage = previousGalleryImage;
window.nextGalleryImage = nextGalleryImage;
window.setGalleryData = setGalleryData;

// Render Business Map
function renderBusinessMap(address) {
    if (!address) return;
    
    const encodedAddress = encodeURIComponent(address);
    
    const mapIframe = `
        <iframe
            title="Business location map"
            width="100%"
            height="260"
            style="border:0; border-radius: 12px;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${encodedAddress}&output=embed">
        </iframe>
    `;
    
    const mainMap = document.getElementById('businessMapMain');
    if (mainMap) {
        mainMap.innerHTML = mapIframe;
    }
}

// Rating Modal Functionality
let selectedRating = 0;

function openRatingModal(businessId = null) {
    // Get business ID from businessDetailManager if not provided
    if (!businessId && window.businessDetailManager) {
        businessId = window.businessDetailManager.getCurrentBusinessId();
    }
    
    // If still no businessId, try to get from URL
    if (!businessId) {
        const urlParams = new URLSearchParams(window.location.search);
        businessId = urlParams.get('id') || urlParams.get('businessId');
    }
    
    selectedRating = 0;
    const modal = document.getElementById('ratingModal');
    if (modal) {
        // Update modal content with current business data
        updateRatingModalContent(businessId);
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        // Reset stars
        resetStars();
    }
}

function updateRatingModalContent(businessId) {
    if (!businessId || !window.businessDetailManager) return;
    
    const business = window.businessDetailManager.businessData;
    if (!business) return;
    
    const averageRating = window.businessDetailManager.getAverageRating(businessId);
    const totalRatings = window.businessDetailManager.getTotalRatings(businessId);
    
    // Update business name in modal
    const modalTitle = document.getElementById('ratingModalTitle');
    if (modalTitle) {
        modalTitle.textContent = `Rate ${business.businessName || business.name || 'This Business'}`;
    }
    
    // Update current rating display
    const ratingScore = document.getElementById('currentRatingScore');
    const ratingCount = document.getElementById('currentRatingCount');
    const ratingStars = document.getElementById('currentRatingStars');
    
    if (ratingScore) {
        ratingScore.textContent = averageRating.toFixed(1);
    }
    if (ratingCount) {
        ratingCount.textContent = `${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}`;
    }
    if (ratingStars) {
        ratingStars.innerHTML = renderStarsHTML(averageRating);
    }
}

function renderStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }
    document.body.style.overflow = 'auto';
}

function selectRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star interactive-star';
        } else {
            star.className = 'far fa-star interactive-star';
        }
    });
    
    labels.forEach(label => {
        label.classList.remove('active');
        if (parseInt(label.dataset.rating) === rating) {
            label.classList.add('active');
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach(star => {
        star.className = 'far fa-star interactive-star';
    });
    
    labels.forEach(label => {
        label.classList.remove('active');
    });
}

function submitRating() {
    const reviewText = document.getElementById('ratingReview')?.value.trim() || '';
    
    if (selectedRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    // Get business ID
    let businessId = null;
    if (window.businessDetailManager) {
        businessId = window.businessDetailManager.getCurrentBusinessId();
    }
    
    if (!businessId) {
        const urlParams = new URLSearchParams(window.location.search);
        businessId = urlParams.get('id') || urlParams.get('businessId');
    }
    
    // Use submitRatingWithReview from local-business2.js if available
    if (businessId && typeof submitRatingWithReview === 'function') {
        window.selectedRating = selectedRating;
        submitRatingWithReview(businessId);
    } else {
        // Fallback: Show success message
        showRatingSuccess();
        closeRatingModal();
        const reviewTextarea = document.getElementById('ratingReview');
        if (reviewTextarea) {
            reviewTextarea.value = '';
        }
        selectedRating = 0;
        resetStars();
    }
}

function showRatingSuccess() {
    const successMsg = document.createElement('div');
    successMsg.className = 'rating-success-message show';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you! Your rating has been submitted.</span>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 300);
    }, 3000);
}

// Add hover effects to rating labels
function addRatingLabelHoverEffects() {
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            labels.forEach((label, labelIndex) => {
                if (labelIndex <= index) {
                    label.classList.add('hover');
                } else {
                    label.classList.remove('hover');
                }
            });
        });
    });
    
    const interactiveRating = document.querySelector('.interactive-rating');
    if (interactiveRating) {
        interactiveRating.addEventListener('mouseleave', () => {
            labels.forEach(label => label.classList.remove('hover'));
        });
    }
}

// Make functions globally accessible
window.openRatingModal = openRatingModal;
window.closeRatingModal = closeRatingModal;
window.selectRating = selectRating;
window.submitRating = submitRating;
window.renderBusinessMap = renderBusinessMap;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    addRatingLabelHoverEffects();
    
    // Add click handlers to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceName = serviceCard ? serviceCard.querySelector('h4').textContent : '';
            if (serviceName) {
                openGalleryModal(serviceName, index);
            }
        });
    });

    // Add click handler to gallery-more card
    const galleryMore = document.querySelectorAll('.gallery-more');
    galleryMore.forEach(card => {
        card.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceName = serviceCard ? serviceCard.querySelector('h4').textContent : '';
            if (serviceName) {
                // Open modal starting from the 5th image (index 4)
                openGalleryModal(serviceName, 4);
            }
        });
    });

    // Keyboard navigation for gallery modal
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('shown.bs.modal', function() {
            document.addEventListener('keydown', handleGalleryKeyDown);
        });
        
        galleryModal.addEventListener('hidden.bs.modal', function() {
            document.removeEventListener('keydown', handleGalleryKeyDown);
        });
    }
});

function handleGalleryKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        previousGalleryImage();
    } else if (e.key === 'ArrowRight') {
        nextGalleryImage();
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('galleryModal');
        if (modal) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
}

