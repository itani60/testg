// Business Preview Manager - Loads business data and handles editing/posting

class BusinessPreviewManager {
    constructor() {
        this.businessData = null;
        this.editMode = false;
        this.originalData = null;
    }

    async init() {
        try {
            // Check if user is logged in
            if (!window.businessAWSAuthService) {
                this.showError('Please log in to view your business preview.');
                return;
            }

            // Get user info to retrieve businessId
            const userInfo = await window.businessAWSAuthService.getUserInfo();
            
            if (!userInfo.success || !userInfo.user) {
                this.showError('Please log in to view your business preview.');
                return;
            }

            const businessId = userInfo.user.businessId;
            
            if (!businessId) {
                this.showError('Business ID not found. Please update your business information.');
                return;
            }

            // Load business data
            await this.loadBusinessData(businessId);
            
            // Load services data
            await this.loadServicesData();
            
            // Render preview
            this.renderPreview();
        } catch (error) {
            console.error('Error initializing business preview:', error);
            this.showError('Failed to load business preview. Please try again.');
        }
    }

    async loadBusinessData(businessId) {
        try {
            if (!window.businessAWSAuthService) {
                throw new Error('Business auth service not available');
            }

            const response = await window.businessAWSAuthService.getPublicBusiness(businessId);
            
            if (!response.success || !response.business) {
                throw new Error('Business not found');
            }
            
            this.businessData = response.business;
            
            // Normalize serviceGalleries structure if it exists
            if (this.businessData.serviceGalleries && typeof this.businessData.serviceGalleries === 'object') {
                const normalized = {};
                Object.keys(this.businessData.serviceGalleries).forEach(serviceName => {
                    const images = this.businessData.serviceGalleries[serviceName];
                    normalized[serviceName] = this.normalizeImagesArray(images);
                });
                this.businessData.serviceGalleries = normalized;
            }
        } catch (error) {
            console.error('Error loading business data:', error);
            throw error;
        }
    }

    async loadServicesData() {
        try {
            if (!window.businessAWSAuthService) {
                return;
            }

            const servicesData = await window.businessAWSAuthService.getServices();
            
            if (servicesData.success) {
                // Merge services data with business data
                if (!this.businessData) {
                    this.businessData = {};
                }
                
                // Convert services array to serviceGalleries object format
                // servicesData.services is an array: [{ name, images, ... }, ...]
                // serviceGalleries should be an object: { "Service Name": [{ image, title }, ...] }
                if (Array.isArray(servicesData.services)) {
                    const serviceGalleries = {};
                    servicesData.services.forEach(service => {
                        if (service.name && Array.isArray(service.images)) {
                            serviceGalleries[service.name] = service.images;
                        }
                    });
                    // Merge with existing serviceGalleries from public API if any
                    if (this.businessData.serviceGalleries) {
                        Object.assign(this.businessData.serviceGalleries, serviceGalleries);
                    } else {
                        this.businessData.serviceGalleries = serviceGalleries;
                    }
                } else if (servicesData.services && typeof servicesData.services === 'object') {
                    // If it's already an object, use it directly
                    this.businessData.serviceGalleries = servicesData.services;
                }
                
                this.businessData.businessDescription = servicesData.businessDescription || this.businessData.businessDescription || '';
                this.businessData.fullContent = servicesData.fullContent || this.businessData.fullContent || '';
            }
        } catch (error) {
            console.error('Error loading services data:', error);
            // Continue without services data
        }
    }

    renderPreview() {
        if (!this.businessData) {
            this.showError('No business data available.');
            return;
        }

        // Render hero section
        this.renderHero();
        
        // Render business description
        this.renderBusinessDescription();
        
        // Render services gallery
        this.renderServicesGallery();
        
        // Render social media buttons
        this.renderSocialMedia();
        
        // Render contact information
        this.renderContactInfo();
        
        // Render business hours
        this.renderBusinessHours();
    }

    renderHero() {
        const business = this.businessData;
        
        // Hero Image
        const heroImage = document.getElementById('businessHeroImage');
        if (heroImage) {
            heroImage.src = business.businessLogoUrl || 'https://via.placeholder.com/300x200?text=Business+Logo';
            heroImage.alt = business.businessName || 'Business Logo';
        }
        
        // Category Badge
        const categoryBadge = document.getElementById('businessCategoryBadge');
        if (categoryBadge) {
            const category = business.businessCategory || business.businessType || 'Business';
            categoryBadge.textContent = category;
            categoryBadge.style.display = category ? 'block' : 'none';
        }
        
        // Business Title
        const businessTitle = document.getElementById('businessTitle');
        if (businessTitle) {
            businessTitle.textContent = business.businessName || 'Business Name';
        }
        
        // Business Subtitle
        const businessSubtitle = document.getElementById('businessSubtitle');
        if (businessSubtitle) {
            const description = business.businessDescription || business.description || '';
            businessSubtitle.textContent = description.length > 100 ? description.substring(0, 100) + '...' : description || 'No description available';
        }
        
        // Business Location
        const businessLocationText = document.getElementById('businessLocationText');
        if (businessLocationText) {
            businessLocationText.textContent = business.businessAddress || 'Address not provided';
        }
        
        // Business Phone
        const businessPhonePreview = document.getElementById('businessPhonePreview');
        if (businessPhonePreview) {
            if (business.businessNumber) {
                businessPhonePreview.innerHTML = `<i class="fas fa-phone"></i> <a href="tel:${business.businessNumber}">${business.businessNumber}</a>`;
            } else {
                businessPhonePreview.textContent = '';
            }
        }
    }

    renderBusinessDescription() {
        const descriptionEl = document.getElementById('businessDescription');
        if (!descriptionEl) return;

        const description = this.businessData.businessDescription || 
                          this.businessData.fullContent || 
                          this.businessData.description || 
                          'No description available. Click Edit to add a description.';
        
        descriptionEl.innerHTML = description || 'No description available. Click Edit to add a description.';
    }

    normalizeImagesArray(images) {
        // Handle various data structures and ensure we always return an array
        if (!images) {
            return [];
        }
        
        if (Array.isArray(images)) {
            return images;
        }
        
        if (typeof images === 'string') {
            return [{ image: images }];
        }
        
        if (typeof images === 'object') {
            // If it's an object, try different strategies
            // Strategy 1: It might be an object with numeric keys (DynamoDB Map)
            const values = Object.values(images);
            if (values.length > 0 && (Array.isArray(values[0]) || typeof values[0] === 'object' || typeof values[0] === 'string')) {
                return values;
            }
            
            // Strategy 2: It might be a single image object
            if (images.image || images.url) {
                return [images];
            }
            
            // Strategy 3: It might be an object with array-like structure
            if (images.length !== undefined) {
                return Array.from(images);
            }
            
            // Strategy 4: Try to extract all values
            return Object.values(images).filter(v => v !== null && v !== undefined);
        }
        
        return [];
    }

    renderServicesGallery() {
        try {
            const servicesGrid = document.getElementById('servicesGrid');
            if (!servicesGrid) return;

            const serviceGalleries = this.businessData.serviceGalleries || {};
            const serviceNames = Object.keys(serviceGalleries);

            if (serviceNames.length === 0) {
                servicesGrid.innerHTML = '<p class="text-muted">No services added yet. Click Edit to add services.</p>';
                return;
            }

            let html = '';
            serviceNames.forEach(serviceName => {
                try {
                    const rawImages = serviceGalleries[serviceName];
                    
                    // Normalize images to always be an array
                    const images = this.normalizeImagesArray(rawImages);
                    
                    if (!Array.isArray(images) || images.length === 0) {
                        return; // Skip services with no images
                    }
                    
                    const isEditMode = this.editMode;
                    const displayImages = images;
                    
                    html += `
                        <div class="service-card" data-service-name="${serviceName.replace(/"/g, '&quot;')}">
                            <h4>${serviceName}</h4>
                            <div class="service-gallery ${isEditMode ? 'edit-mode' : ''}">
                                ${displayImages.map((img, index) => {
                                    try {
                                        const imageUrl = typeof img === 'string' ? img : (img.image || img.url || img);
                                        if (!imageUrl) return '';
                                        const escapedUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                                        const escapedName = serviceName.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                                        
                                        if (isEditMode) {
                                            return `
                                                <div class="gallery-item" data-image-url="${escapedUrl}">
                                                    <img src="${imageUrl}" alt="${escapedName}" loading="lazy" onclick="openImageModal('${escapedUrl}', '${escapedName}')" style="cursor: pointer;">
                                                    <button type="button" class="btn-delete-image" onclick="previewManager.deleteImage('${escapedUrl}', '${escapedName}')" title="Delete image">
                                                        Delete
                                                    </button>
                                                </div>
                                            `;
                                        } else {
                                            // Get price if available
                                            const price = typeof img === 'object' && img.price !== undefined && img.price !== null ? img.price : null;
                                            const priceDisplay = price ? `<div class="gallery-item-price">R${parseFloat(price).toFixed(2)}</div>` : '';
                                            
                                            return `
                                                <div class="gallery-item">
                                                    <img src="${imageUrl}" alt="${escapedName}" loading="lazy" onclick="openImageModal('${escapedUrl}', '${escapedName}')" style="cursor: pointer;">
                                                    ${priceDisplay}
                                                </div>
                                            `;
                                        }
                                    } catch (err) {
                                        console.warn('Error rendering image:', err, img);
                                        return '';
                                    }
                                }).filter(html => html !== '').join('')}
                            </div>
                            ${!isEditMode && images.length > 6 ? `<p class="text-muted mt-2">+${images.length - 6} more images</p>` : ''}
                        </div>
                    `;
                } catch (err) {
                    console.error(`Error rendering service "${serviceName}":`, err);
                    // Continue with next service
                }
            });

            // Add Upload button in edit mode
            if (this.editMode) {
                html += `
                    <div class="service-card upload-card">
                        <button type="button" class="btn-upload-new" onclick="redirectToBusinessManagement()">
                            Upload New Images
                        </button>
                        <p class="text-muted mt-2"><small>Add more images to your gallery</small></p>
                    </div>
                `;
            }

            servicesGrid.innerHTML = html || '<p class="text-muted">No services with images found.</p>';
        } catch (error) {
            console.error('Error rendering services gallery:', error);
            const servicesGrid = document.getElementById('servicesGrid');
            if (servicesGrid) {
                servicesGrid.innerHTML = '<p class="text-danger">Error loading services. Please try again.</p>';
            }
        }
    }

    async deleteImage(imageUrl, imageName) {
        // Store the image URL and name for the confirmation
        this.pendingDeleteImageUrl = imageUrl;
        this.pendingDeleteImageName = imageName;
        
        // Show the delete confirmation modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteImageModal'));
        deleteModal.show();
    }

    async confirmDeleteImage() {
        const imageUrl = this.pendingDeleteImageUrl;
        const imageName = this.pendingDeleteImageName;
        
        if (!imageUrl) {
            return;
        }
        
        // Hide the modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteImageModal'));
        if (deleteModal) {
            deleteModal.hide();
        }
        
        // Disable the delete button and show loading state
        const confirmBtn = document.getElementById('confirmDeleteImageBtn');
        const originalText = confirmBtn ? confirmBtn.innerHTML : '';
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = 'Deleting...';
        }
        
        try {
            // Get current service galleries
            const serviceGalleries = this.businessData.serviceGalleries || {};
            const updatedServiceGalleries = {};
            
            // Remove the deleted image from service galleries
            Object.keys(serviceGalleries).forEach(serviceName => {
                const images = this.normalizeImagesArray(serviceGalleries[serviceName]);
                const remainingImages = images.filter(img => {
                    const imgUrl = typeof img === 'string' ? img : (img.image || img.url || img);
                    return imgUrl && imgUrl !== imageUrl;
                });
                
                if (remainingImages.length > 0) {
                    updatedServiceGalleries[serviceName] = remainingImages;
                }
            });
            
            // Get business description
            const servicesData = await window.businessAWSAuthService.getServices();
            const businessDescription = servicesData.businessDescription || '';
            
            // Send delete request to API
            const BASE_URL = 'https://acc.comparehubprices.site';
            const response = await fetch(`${BASE_URL}/business/business/manage-services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    businessDescription: businessDescription,
                    services: [], // Empty services array
                    updatedServiceGalleries: updatedServiceGalleries, // Send updated structure
                    deletedImages: [imageUrl] // Send single image to delete
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to delete image');
            }
            
            // Update local data
            this.businessData.serviceGalleries = updatedServiceGalleries;
            
            // Re-render gallery
            this.renderServicesGallery();
            
            // Clear pending delete
            this.pendingDeleteImageUrl = null;
            this.pendingDeleteImageName = null;
            
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image: ' + (error.message || 'Unknown error'));
        } finally {
            // Re-enable the delete button
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = originalText;
            }
            // Clear pending delete
            this.pendingDeleteImageUrl = null;
            this.pendingDeleteImageName = null;
        }
    }

    renderSocialMedia() {
        const socialButtons = document.getElementById('socialButtons');
        if (!socialButtons) return;

        const socialMedia = this.businessData.socialMedia || {};
        const socialLinks = [
            { key: 'facebook', icon: 'fab fa-facebook', label: 'Facebook', color: '#1877f2' },
            { key: 'instagram', icon: 'fab fa-instagram', label: 'Instagram', color: '#e4405f' },
            { key: 'twitter', icon: 'fab fa-twitter', label: 'Twitter', color: '#1da1f2' },
            { key: 'linkedin', icon: 'fab fa-linkedin', label: 'LinkedIn', color: '#0077b5' },
            { key: 'tiktok', icon: 'fab fa-tiktok', label: 'TikTok', color: '#000000' },
            { key: 'whatsapp', icon: 'fab fa-whatsapp', label: 'WhatsApp', color: '#25d366' }
        ];

        let html = '';
        socialLinks.forEach(social => {
            const url = socialMedia[social.key];
            if (url && url.trim()) {
                html += `
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-btn ${social.key}">
                        <i class="${social.icon}"></i>
                        <span>${social.label}</span>
                    </a>
                `;
            }
        });

        if (html === '') {
            html = '<p class="text-muted">No social media links added. Update your social media links in Business Account Settings.</p>';
        }

        socialButtons.innerHTML = html;
    }

    renderContactInfo() {
        const contactDetails = document.getElementById('contactDetails');
        if (!contactDetails) return;

        const business = this.businessData;
        let html = '';

        if (business.businessName) {
            html += `<p><strong>Business Name:</strong> ${business.businessName}</p>`;
        }
        if (business.businessAddress) {
            html += `<p><strong>Address:</strong> ${business.businessAddress}</p>`;
        }
        if (business.businessNumber) {
            html += `<p><strong>Phone:</strong> <a href="tel:${business.businessNumber}">${business.businessNumber}</a></p>`;
        }
        if (business.businessEmail || business.email) {
            const email = business.businessEmail || business.email;
            html += `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`;
        }

        if (html === '') {
            html = '<p class="text-muted">No contact information available. Update your contact details in Business Account Settings.</p>';
        }

        contactDetails.innerHTML = html;
    }

    renderBusinessHours() {
        const businessHours = document.getElementById('businessHours');
        if (!businessHours) return;

        const hours = this.businessData.businessHours || 'No business hours set. Update your business hours in Business Account Settings.';
        businessHours.textContent = hours;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        
        // Show/hide section action buttons
        const sectionActions = document.querySelectorAll('.section-actions');
        sectionActions.forEach(actions => {
            actions.style.display = this.editMode ? 'flex' : 'none';
        });

        // Update edit mode button
        const editModeBtn = document.getElementById('editModeBtn');
        if (editModeBtn) {
            if (this.editMode) {
                editModeBtn.innerHTML = 'Cancel';
                editModeBtn.classList.remove('btn-secondary');
                editModeBtn.classList.add('btn-danger');
                // Save original data
                this.originalData = JSON.parse(JSON.stringify(this.businessData));
            } else {
                editModeBtn.innerHTML = 'Edit';
                editModeBtn.classList.remove('btn-danger');
                editModeBtn.classList.add('btn-secondary');
                // Restore original data
                if (this.originalData) {
                    this.businessData = JSON.parse(JSON.stringify(this.originalData));
                    this.renderPreview();
                }
            }
        }
        
        // Re-render gallery to show/hide delete buttons
        this.renderServicesGallery();
    }

    editSection(sectionName) {
        if (sectionName === 'about') {
            const descriptionEl = document.getElementById('businessDescription');
            if (descriptionEl) {
                descriptionEl.contentEditable = 'true';
                // Show save button, hide edit button
                const aboutSection = descriptionEl.closest('.business-overview');
                const editBtn = aboutSection.querySelector('.btn-edit-inline');
                const saveBtn = aboutSection.querySelector('.btn-save-inline');
                if (editBtn) editBtn.style.display = 'none';
                if (saveBtn) saveBtn.style.display = 'block';
            }
        } else if (sectionName === 'services') {
            // Services editing is handled by toggleEditMode
            // Just ensure edit mode is enabled
            if (!this.editMode) {
                this.toggleEditMode();
            }
            // Don't show save button for services - delete is immediate
            const servicesSection = document.getElementById('businessServices');
            const editBtn = servicesSection.querySelector('.btn-edit-inline');
            const saveBtn = servicesSection.querySelector('.btn-save-inline');
            if (editBtn) editBtn.style.display = 'block';
            if (saveBtn) saveBtn.style.display = 'none';
        }
    }

    async postBusiness() {
        try {
            // Collect updated data
            const descriptionEl = document.getElementById('businessDescription');
            const hoursEl = document.getElementById('businessHours');
            
            const updatedData = {
                businessDescription: descriptionEl ? descriptionEl.innerHTML.trim() : '',
                businessHours: hoursEl ? hoursEl.textContent.trim() : ''
            };

            // Show loading state
            const postBtn = document.getElementById('postBtn');
            const originalText = postBtn.innerHTML;
            postBtn.disabled = true;
            postBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

            // Submit business post for admin approval
            if (window.businessAWSAuthService) {
                // First, save any description changes to preview
                const existingServiceGalleries = this.businessData?.serviceGalleries || {};
                if (updatedData.businessDescription) {
                    await window.businessAWSAuthService.manageServices(
                        updatedData.businessDescription,
                        [], // Empty services array since we're just updating description
                        existingServiceGalleries, // Pass existing galleries to indicate update
                        [] // No images to delete
                    );
                }
                
                // Then submit the post for admin approval
                await window.businessAWSAuthService.submitBusinessPost();
            }

            // Update business info (for hours and status to make it live)
            if (window.businessAWSAuthService) {
                try {
                    const updateData = {};
                    if (updatedData.businessHours) {
                        updateData.businessHours = updatedData.businessHours;
                    }
                    // Set status to BUSINESS_ACTIVE to make business visible on marketplace
                    updateData.status = 'BUSINESS_ACTIVE';
                    
                    await window.businessAWSAuthService.updateBusinessInfo(updateData);
                } catch (error) {
                    console.warn('Could not update business info:', error);
                    // Continue even if update fails
                }
            }

            // Show success message using toast
            if (typeof showSuccessToast === 'function') {
                showSuccessToast('Business submitted for approval! Your post is pending admin review (2-24 hour wait period). You will be notified once it\'s approved.', 'Post Submitted');
            } else {
                alert('Business submitted for approval! Your post is pending admin review (2-24 hour wait period). You will be notified once it\'s approved.');
            }
            
            // Reload data
            await this.init();
            
            // Reset button
            postBtn.disabled = false;
            postBtn.innerHTML = originalText;
        } catch (error) {
            console.error('Error posting business:', error);
            
            // Show error message using toast
            const errorMessage = error.message || error.response?.message || 'Please try again.';
            if (typeof showErrorToast === 'function') {
                showErrorToast(`Error posting business: ${errorMessage}`, 'Post Failed');
            } else {
                alert(`Error posting business: ${errorMessage}`);
            }
            
            const postBtn = document.getElementById('postBtn');
            postBtn.disabled = false;
            postBtn.innerHTML = 'Post';
        }
    }

    showError(message) {
        const mainContent = document.querySelector('.business-main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4>Error</h4>
                    <p>${message}</p>
                    <a href="business_management.html" class="btn btn-primary">Go to Business Management</a>
                </div>
            `;
        }
    }
}

// Global functions for onclick handlers
let previewManager;

function toggleEditMode() {
    if (previewManager) {
        previewManager.toggleEditMode();
    }
}

function editSection(section) {
    // Focus on the section for editing
    const sectionMap = {
        'about': 'businessDescription',
        'hours': 'businessHours',
        'services': 'servicesGrid',
        'social': 'socialButtons',
        'contact': 'contactDetails'
    };

    const elementId = sectionMap[section];
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (element.contentEditable === 'true') {
                element.focus();
            }
        }
    }
}

async function postBusiness() {
    if (previewManager) {
        await previewManager.postBusiness();
    }
}

// Function to open image modal
function openImageModal(imageUrl, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageUrl;
        modalImage.alt = imageAlt || 'Service Image';
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Function to edit section
function editSection(sectionName) {
    if (previewManager) {
        previewManager.editSection(sectionName);
    }
}

// Function to save About section
async function saveAboutSection() {
    if (!previewManager) return;
    
    try {
        const descriptionEl = document.getElementById('businessDescription');
        if (!descriptionEl) return;
        
        const saveBtn = document.querySelector('.business-overview .btn-save-inline');
        const originalText = saveBtn ? saveBtn.innerHTML : '';
        
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = 'Saving...';
        }
        
        const businessDescription = descriptionEl.innerHTML.trim();
        
        // Save using manageServices API
        if (window.businessAWSAuthService) {
            // Get existing serviceGalleries to pass as updatedServiceGalleries
            // This tells the Lambda it's an update request, so it won't require new services
            const existingServiceGalleries = previewManager.businessData?.serviceGalleries || {};
            
            await window.businessAWSAuthService.manageServices(
                businessDescription, 
                [], // Empty services array since we're just updating description
                existingServiceGalleries, // Pass existing galleries to indicate update
                [] // No images to delete
            );
            alert('Business description saved successfully!');
            
            // Make non-editable and hide save button
            descriptionEl.contentEditable = 'false';
            const aboutSection = descriptionEl.closest('.business-overview');
            const editBtn = aboutSection.querySelector('.btn-edit-inline');
            if (editBtn) editBtn.style.display = 'block';
            if (saveBtn) {
                saveBtn.style.display = 'none';
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }
            
            // Reload preview
            await previewManager.loadServicesData();
            previewManager.renderBusinessDescription();
        } else {
            throw new Error('Business auth service not available');
        }
    } catch (error) {
        console.error('Error saving about section:', error);
        alert('Failed to save business description: ' + (error.message || 'Unknown error'));
        const saveBtn = document.querySelector('.business-overview .btn-save-inline');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = 'Save';
        }
    }
}

// Function to redirect to business management and open upload modal
function redirectToBusinessManagement() {
    // Store a flag in sessionStorage to open modal on business_management.html
    sessionStorage.setItem('openUploadModal', 'true');
    window.location.href = 'business_management.html';
}

// Function to save Services section (not used anymore - delete is immediate)
async function saveServicesSection() {
    // Services are now deleted immediately, so this function redirects to upload
    redirectToBusinessManagement();
}

// Global function for delete confirmation (called from modal button)
function confirmDeleteImage() {
    if (previewManager) {
        previewManager.confirmDeleteImage();
    } else if (testPreviewManager) {
        testPreviewManager.confirmDeleteImage();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    previewManager = new BusinessPreviewManager();
    previewManager.init();
});

