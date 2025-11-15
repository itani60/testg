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
                    
                    html += `
                        <div class="service-card">
                            <h4>${serviceName}</h4>
                            <div class="service-gallery">
                                ${images.slice(0, 6).map(img => {
                                    try {
                                        const imageUrl = typeof img === 'string' ? img : (img.image || img.url || img);
                                        if (!imageUrl) return '';
                                        return `
                                            <div class="gallery-item">
                                                <img src="${imageUrl}" alt="${serviceName}" loading="lazy">
                                            </div>
                                        `;
                                    } catch (err) {
                                        console.warn('Error rendering image:', err, img);
                                        return '';
                                    }
                                }).filter(html => html !== '').join('')}
                            </div>
                            ${images.length > 6 ? `<p class="text-muted mt-2">+${images.length - 6} more images</p>` : ''}
                        </div>
                    `;
                } catch (err) {
                    console.error(`Error rendering service "${serviceName}":`, err);
                    // Continue with next service
                }
            });

            servicesGrid.innerHTML = html || '<p class="text-muted">No services with images found.</p>';
        } catch (error) {
            console.error('Error rendering services gallery:', error);
            const servicesGrid = document.getElementById('servicesGrid');
            if (servicesGrid) {
                servicesGrid.innerHTML = '<p class="text-danger">Error loading services. Please try again.</p>';
            }
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
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-btn" style="background-color: ${social.color};">
                        <i class="${social.icon}"></i>
                        <span>${social.label}</span>
                    </a>
                `;
            }
        });

        if (html === '') {
            html = '<p class="text-muted">No social media links added. Click Edit to add links.</p>';
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
            html = '<p class="text-muted">No contact information available. Click Edit to add contact details.</p>';
        }

        contactDetails.innerHTML = html;
    }

    renderBusinessHours() {
        const businessHours = document.getElementById('businessHours');
        if (!businessHours) return;

        const hours = this.businessData.businessHours || 'No business hours set. Click Edit to add hours.';
        businessHours.textContent = hours;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        
        // Show/hide edit buttons
        const editButtons = document.querySelectorAll('.btn-edit-inline');
        editButtons.forEach(btn => {
            btn.style.display = this.editMode ? 'block' : 'none';
        });

        // Toggle contenteditable
        const editableElements = document.querySelectorAll('.editable-content');
        editableElements.forEach(el => {
            el.contentEditable = this.editMode;
        });

        // Update edit mode button
        const editModeBtn = document.getElementById('editModeBtn');
        if (editModeBtn) {
            if (this.editMode) {
                editModeBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
                editModeBtn.classList.remove('btn-secondary');
                editModeBtn.classList.add('btn-danger');
                // Save original data
                this.originalData = JSON.parse(JSON.stringify(this.businessData));
            } else {
                editModeBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
                editModeBtn.classList.remove('btn-danger');
                editModeBtn.classList.add('btn-secondary');
                // Restore original data
                if (this.originalData) {
                    this.businessData = JSON.parse(JSON.stringify(this.originalData));
                    this.renderPreview();
                }
            }
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

            // Save services (which includes businessDescription)
            if (window.businessAWSAuthService) {
                // Get current services
                const servicesData = await window.businessAWSAuthService.getServices();
                const services = servicesData.services || [];
                
                // Update with new description
                await window.businessAWSAuthService.manageServices(
                    updatedData.businessDescription,
                    services
                );
            }

            // Update business info (for hours and other fields)
            if (window.businessAWSAuthService && updatedData.businessHours) {
                try {
                    await window.businessAWSAuthService.updateBusinessInfo({
                        businessHours: updatedData.businessHours
                    });
                } catch (error) {
                    console.warn('Could not update business hours:', error);
                    // Continue even if hours update fails
                }
            }

            // Show success message
            alert('Business preview posted successfully!');
            
            // Reload data
            await this.init();
            
            // Reset button
            postBtn.disabled = false;
            postBtn.innerHTML = originalText;
        } catch (error) {
            console.error('Error posting business:', error);
            alert(`Error posting business: ${error.message || 'Please try again.'}`);
            
            const postBtn = document.getElementById('postBtn');
            postBtn.disabled = false;
            postBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post';
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    previewManager = new BusinessPreviewManager();
    previewManager.init();
});

