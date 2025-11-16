// Business Detail Page Functionality
// This file handles the dedicated business detail page
// DEPENDENCY: Requires local-business2.js to be loaded first for data and utility functions

class BusinessDetailManager {
    constructor() {
        this.currentBusiness = null;
        this.currentGallery = null;
        this.currentGalleryIndex = 0;
        this.currentBusinessId = null;
        
        this.init();
    }
    
    init() {
        this.loadBusinessFromUrl();
        this.setupEventListeners();
        this.updatePageMetaTags();
    }
    
    loadBusinessFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const businessId = urlParams.get('id');
        
        // Check for test mode - use test data if available
        // Test mode can be enabled via URL parameter ?test=true or if USE_TEST_MODE is set
        const testMode = urlParams.get('test') === 'true' || (window.USE_TEST_MODE && window.TEST_BUSINESS_DATA);
        
        if (testMode && window.TEST_BUSINESS_DATA) {
            console.log('🧪 TEST MODE: Using hardcoded test data');
            this.currentBusinessId = window.TEST_BUSINESS_DATA.businessId || 'test-business';
            this.loadTestBusinessData();
            return;
        }
        
        if (!businessId) {
            this.showError('Business ID not found in URL');
            return;
        }
        
        this.currentBusinessId = businessId;
        this.loadBusinessData(businessId);
    }
    
    loadTestBusinessData() {
        try {
            // Show loading state
            this.showLoading();
            
            // Use test data directly
            const testData = window.TEST_BUSINESS_DATA;
            
            // Transform test data to match API format
            const apiFormat = {
                businessId: testData.businessId,
                businessName: testData.businessName,
                businessDescription: testData.businessDescription,
                fullContent: testData.fullContent || testData.businessDescription,
                businessCategory: testData.businessCategory,
                businessType: testData.businessType,
                businessAddress: testData.businessAddress,
                businessNumber: testData.businessNumber,
                businessHours: testData.businessHours,
                businessLogoUrl: testData.businessLogoUrl,
                socialMedia: testData.socialMedia || {},
                serviceGalleries: testData.serviceGalleries || {},
                status: testData.status,
                verified: testData.verified
            };
            
            // Transform to expected format
            const business = this.transformBusinessData(apiFormat);
            
            this.currentBusiness = business;
            this.renderBusinessPage();
            this.updatePageMetaTags();
            
            // Show test mode indicator
            this.showTestModeIndicator();
        } catch (error) {
            console.error('Error loading test business data:', error);
            this.showError('Failed to load test business data.');
        }
    }
    
    showTestModeIndicator() {
        // Add test mode badge to the page
        const heroSection = document.querySelector('.business-hero');
        if (heroSection) {
            const testBadge = document.createElement('div');
            testBadge.style.cssText = 'position: absolute; top: 20px; right: 20px; background: #ffc107; color: #000; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
            testBadge.textContent = '🧪 TEST MODE - Using Hardcoded Data';
            heroSection.style.position = 'relative';
            heroSection.appendChild(testBadge);
        }
    }
    
    async loadBusinessData(businessId) {
        try {
            // Show loading state
            this.showLoading();
            
            // Fetch business data from API
            const BASE_URL = 'https://acc.comparehubprices.site';
            const response = await fetch(`${BASE_URL}/business/business/public/${businessId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
        
            if (!response.ok || !data.success || !data.business) {
            this.showError('Business not found');
            return;
        }
            
            // Transform API response to match expected format
            const business = this.transformBusinessData(data.business);
        
        this.currentBusiness = business;
        this.renderBusinessPage();
        this.updatePageMetaTags();
        } catch (error) {
            console.error('Error loading business data:', error);
            this.showError('Failed to load business data. Please try again later.');
        }
    }
    
    transformBusinessData(apiBusiness) {
        // Transform API response to match the format expected by the rest of the code
        const serviceGalleries = {};
        
        // Transform serviceGalleries from API format
        if (apiBusiness.serviceGalleries) {
            Object.keys(apiBusiness.serviceGalleries).forEach(serviceName => {
                const images = apiBusiness.serviceGalleries[serviceName];
                if (Array.isArray(images)) {
                    serviceGalleries[serviceName] = images.map(img => ({
                        image: typeof img === 'string' ? img : (img.image || img.url || ''),
                        title: typeof img === 'object' ? (img.title || img.name || '') : '',
                        price: typeof img === 'object' && img.price !== undefined ? img.price : undefined
                    }));
                }
            });
        }
        
        // Extract location from address
        const location = apiBusiness.businessAddress || '';
        const province = this.extractProvince(location);
        
        return {
            id: apiBusiness.businessId,
            name: apiBusiness.businessName,
            description: apiBusiness.businessDescription || '',
            category: apiBusiness.businessCategory || apiBusiness.businessType || 'Service',
            province: province,
            location: location,
            phone: apiBusiness.businessNumber || '',
            hours: apiBusiness.businessHours || 'Hours not specified',
            whatsapp: apiBusiness.socialMedia?.whatsapp || '',
            instagram: apiBusiness.socialMedia?.instagram || '',
            tiktok: apiBusiness.socialMedia?.tiktok || '',
            facebook: apiBusiness.socialMedia?.facebook || '',
            linkedin: apiBusiness.socialMedia?.linkedin || '',
            twitter: apiBusiness.socialMedia?.twitter || '',
            image: apiBusiness.businessLogoUrl || 'https://via.placeholder.com/400x300?text=No+Image',
            serviceGalleries: serviceGalleries,
            fullContent: apiBusiness.fullContent || apiBusiness.businessDescription || '',
            rating: 0, // Will be calculated from reviews if available
            distance: 0,
            status: apiBusiness.status,
            verified: apiBusiness.verified
        };
    }
    
    extractProvince(address) {
        const provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
        for (const province of provinces) {
            if (address.toLowerCase().includes(province.toLowerCase())) {
                return province;
            }
        }
        return '';
    }
    
    showLoading() {
        const heroSection = document.getElementById('businessHero');
        if (heroSection) {
            heroSection.innerHTML = `
                <div class="loading-container">
                    <div class="loading-content">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading business information...</p>
                    </div>
                </div>
            `;
        }
    }
    
    renderBusinessPage() {
        if (!this.currentBusiness) return;
        
        // Update hero section
        this.updateHeroSection();
        
        // Update breadcrumb
        this.updateBreadcrumb();
        
        // Update main content
        this.updateMainContent();
        
        // Update sidebar
        this.updateSidebar();
        
        // Load reviews
        this.loadBusinessReviews();
    }
    
    updateHeroSection() {
        const business = this.currentBusiness;
        
        // Update hero image
        const heroImage = document.getElementById('businessHeroImage');
        if (heroImage) {
            heroImage.src = business.image;
            heroImage.alt = business.name;
        }
        
        // Update category badge
        const categoryBadge = document.getElementById('businessCategoryBadge');
        if (categoryBadge) {
            categoryBadge.textContent = business.category;
        }
        
        // Update title
        const title = document.getElementById('businessTitle');
        if (title) {
            title.textContent = business.name;
        }
        
        // Update subtitle
        const subtitle = document.getElementById('businessSubtitle');
        if (subtitle) {
            subtitle.textContent = business.description;
        }
        
        // Update rating
        this.updateBusinessRating();
        
        // Update location
        const locationText = document.getElementById('businessLocationText');
        if (locationText) {
            locationText.textContent = business.location;
        }

        // Setup follow UI
        this.setupFollowUI();
    }
    
    updateBusinessRating() {
        const business = this.currentBusiness;
        const averageRating = getAverageRating(business.id);
        const totalRatings = getTotalRatings(business.id);
        
        // Update rating stars
        const ratingStars = document.getElementById('businessRatingStars');
        if (ratingStars) {
            ratingStars.innerHTML = renderStarsHTML(averageRating);
        }
        
        // Update rating text
        const ratingText = document.getElementById('businessRatingText');
        if (ratingText) {
            ratingText.textContent = `${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})`;
        }
    }
    
    updateBreadcrumb() {
        const business = this.currentBusiness;
        const breadcrumbName = document.getElementById('breadcrumbBusinessName');
        if (breadcrumbName) {
            breadcrumbName.textContent = business.name;
        }
    }
    
    updateMainContent() {
        const business = this.currentBusiness;
        
        // Update business description (filter out "Our Work Gallery" section)
        const description = document.getElementById('businessDescription');
        if (description) {
            let content = business.fullContent || business.description;
            
            // Remove "Our Work Gallery" section if it exists
            if (content.includes('<h3>Our Work Gallery</h3>')) {
                const galleryStart = content.indexOf('<h3>Our Work Gallery</h3>');
                const galleryEnd = content.indexOf('<h3>Business Hours</h3>');
                
                if (galleryStart !== -1 && galleryEnd !== -1) {
                    content = content.substring(0, galleryStart) + content.substring(galleryEnd);
                } else if (galleryStart !== -1) {
                    // If no "Business Hours" section, remove everything from "Our Work Gallery" onwards
                    content = content.substring(0, galleryStart);
                }
            }
            
            description.innerHTML = content;
        }
        
        // Update services/gallery
        this.updateServicesGallery();
    }
    
    updateServicesGallery() {
        const business = this.currentBusiness;
        const servicesGrid = document.getElementById('servicesGrid');
        
        if (!servicesGrid || !business.serviceGalleries) {
            return;
        }
        
        let servicesHTML = '';
        
        Object.keys(business.serviceGalleries).forEach(serviceName => {
            const gallery = business.serviceGalleries[serviceName];
            if (gallery && gallery.length > 0) {
                servicesHTML += `
                    <div class="service-card">
                        <h4>${serviceName}</h4>
                        <div class="service-gallery">
                            ${gallery.slice(0, 4).map((item, index) => {
                                const price = item.price !== undefined && item.price !== null ? item.price : null;
                                const priceDisplay = price ? `<div class="gallery-item-price">R${parseFloat(price).toFixed(2)}</div>` : '';
                                return `
                                <div class="gallery-item" onclick="openGalleryModal('${serviceName}', ${index})">
                                    <img src="${item.image}" alt="${item.title || ''}" loading="lazy">
                                    ${priceDisplay}
                                    ${item.title ? `<p>${item.title}</p>` : ''}
                                </div>
                            `;
                            }).join('')}
                            ${gallery.length > 4 ? `
                                <div class="gallery-more" onclick="openGalleryModal('${serviceName}', 0)">
                                    <span>+${gallery.length - 4} more</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });
        
        servicesGrid.innerHTML = servicesHTML;
    }
    
    updateSidebar() {
        const business = this.currentBusiness;
        
        // Update contact details
        this.updateContactDetails();
        
        // Update social buttons
        this.updateSocialButtons();
        
        // Update business hours
        this.updateBusinessHours();
        
        // Render map
        this.renderBusinessMap();
    }
    
    updateContactDetails() {
        const business = this.currentBusiness;
        const contactDetails = document.getElementById('contactDetails') || document.getElementById('contactDetailsDesktop');
        
        if (contactDetails) {
            contactDetails.innerHTML = `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <strong>Phone</strong>
                        <p><a href="tel:${business.phone}">${business.phone}</a></p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Location</strong>
                        <p>${business.province ? business.province + ', ' : ''}${business.location}</p>
                    </div>
                </div>
            `;
        }
    }
    
    updateSocialButtons() {
        const business = this.currentBusiness;
        const socialButtons = document.getElementById('socialButtons') || document.getElementById('socialButtonsDesktop');
        
        if (socialButtons) {
            let socialHTML = '';
            
            // Add phone number as a contact button
            if (business.phone) {
                socialHTML += `
                    <a href="tel:${business.phone}" class="social-btn phone">
                        <i class="fas fa-phone"></i>
                        ${business.phone}
                    </a>
                `;
            }
            
            if (business.whatsapp) {
                socialHTML += `
                    <a href="https://wa.me/${business.whatsapp}" class="social-btn whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                `;
            }
            
            if (business.instagram) {
                socialHTML += `
                    <a href="https://instagram.com/${business.instagram.replace('@', '')}" class="social-btn instagram" target="_blank">
                        <i class="fab fa-instagram"></i>
                        Instagram
                    </a>
                `;
            }
            
            if (business.tiktok) {
                socialHTML += `
                    <a href="https://tiktok.com/@${business.tiktok.replace('@', '')}" class="social-btn tiktok" target="_blank">
                        <i class="fab fa-tiktok"></i>
                        TikTok
                    </a>
                `;
            }
            
            socialButtons.innerHTML = socialHTML;
        }
    }
    
    updateBusinessHours() {
        const business = this.currentBusiness;
        const businessHours = document.getElementById('businessHours') || document.getElementById('businessHoursDesktop');
        
        if (businessHours) {
            businessHours.innerHTML = `
                <div class="hours-item">
                    <span>Business Hours</span>
                    <span>${business.hours}</span>
                </div>
            `;
        }
    }
    
    renderBusinessMap() {
        const business = this.currentBusiness;
        if (!business) return;

        const address = encodeURIComponent(business.location || '');
        if (!address) return;

        const mapIframe = (addr) => `
            <iframe
                title="Business location map"
                width="100%"
                height="260"
                style="border:0; border-radius: 12px;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=${addr}&output=embed">
            </iframe>
        `;

        const mobileMap = document.getElementById('businessMapMobile');
        if (mobileMap && !mobileMap.dataset.rendered) {
            mobileMap.innerHTML = mapIframe(address);
            mobileMap.dataset.rendered = 'true';
        }

        const desktopMap = document.getElementById('businessMapDesktop');
        if (desktopMap && !desktopMap.dataset.rendered) {
            desktopMap.innerHTML = mapIframe(address);
            desktopMap.dataset.rendered = 'true';
        }

        const mainMap = document.getElementById('businessMapMain');
        if (mainMap && !mainMap.dataset.rendered) {
            mainMap.innerHTML = mapIframe(address);
            mainMap.dataset.rendered = 'true';
        }
    }
    
    loadBusinessReviews() {
        const business = this.currentBusiness;
        if (!business) return;
        
        // Use functions from local-business2.js
        const reviews = getReviewsForBusiness(business.id);
        const stats = getReviewStatistics(business.id);
        
        // Update reviews summary
        this.updateReviewsSummary(stats);
        
        // Render reviews list
        this.renderReviewsList(reviews);
    }
    
    updateReviewsSummary(stats) {
        const reviewsSummary = document.getElementById('reviewsSummary');
        if (!reviewsSummary) return;
        
        reviewsSummary.innerHTML = `
            <div class="rating-stats">
                <div class="rating-score-large">${stats.averageRating.toFixed(1)}</div>
                <div class="rating-stars large">
                    ${renderStarsHTML(stats.averageRating)}
                </div>
                <div class="rating-count">${stats.totalReviews} ${stats.totalReviews === 1 ? 'review' : 'reviews'}</div>
            </div>
            <div class="rating-breakdown">
                ${stats.ratingDistribution.map((count, index) => {
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                    const stars = 5 - index;
                    return `
                        <div class="rating-bar">
                            <span class="star-label">${stars} star${stars > 1 ? 's' : ''}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="count">${count}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    renderReviewsList(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this business!</p>
                </div>
            `;
            return;
        }
        
        const reviewsHTML = reviews.map(review => `
            <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-details">
                            <h4>${review.userName}</h4>
                            <div class="review-rating">
                                <div class="rating-stars">${renderStarsHTML(review.rating)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-date">${formatReviewDate(review.date)}</div>
                        ${review.isUserReview ? '<div class="your-review-badge">Your Review</div>' : ''}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.review || 'No review text provided.'}</p>
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful (${review.helpfulCount || 0})
                    </button>
                    ${!review.isUserReview ? `
                        <button class="report-btn" onclick="reportReview('${review.id}')">
                            <i class="fas fa-flag"></i>
                            Report
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        reviewsList.innerHTML = reviewsHTML;
    }
    
    updatePageMetaTags() {
        if (!this.currentBusiness) return;
        
        const business = this.currentBusiness;
        
        // Update page title
        document.title = `${business.name} - ${business.category} | CompareHubPrices`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = `${business.description} - Located in ${business.location}. Contact: ${business.phone}. Read reviews and ratings on CompareHubPrices.`;
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = `${business.name} - ${business.category}`;
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = business.description;
        }
        
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.content = business.image;
        }
        
        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.href = window.location.href;
        }
        
        // Update structured data
        this.updateStructuredData();
    }

    // Follow feature (local-only using localStorage)
    getFollowersKey(businessId) {
        return `businessFollowers:${businessId}`;
    }

    getFollowStateKey(businessId) {
        return `businessFollowState:${businessId}`;
    }

    readFollowersCount(businessId) {
        const val = localStorage.getItem(this.getFollowersKey(businessId));
        const num = parseInt(val || '0', 10);
        return Number.isNaN(num) ? 0 : Math.max(0, num);
    }

    writeFollowersCount(businessId, count) {
        localStorage.setItem(this.getFollowersKey(businessId), String(Math.max(0, count | 0)));
    }

    isFollowing(businessId) {
        return localStorage.getItem(this.getFollowStateKey(businessId)) === '1';
    }

    setFollowing(businessId, following) {
        localStorage.setItem(this.getFollowStateKey(businessId), following ? '1' : '0');
    }

    getFollowersListKey(businessId) {
        return `businessFollowersList:${businessId}`;
    }

    readFollowersList(businessId) {
        try {
            const raw = localStorage.getItem(this.getFollowersListKey(businessId));
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (_) {
            return [];
        }
    }

    writeFollowersList(businessId, list) {
        localStorage.setItem(this.getFollowersListKey(businessId), JSON.stringify(list.slice(0, 500)));
    }

    formatFollowers(count) {
        if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M followers';
        if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'k followers';
        return `${count} follower${count === 1 ? '' : 's'}`;
    }

    setupFollowUI() {
        const business = this.currentBusiness;
        const btn = document.getElementById('followBusinessBtn');
        const countEl = document.getElementById('followersCount');
        if (!btn || !countEl || !business) return;

        const syncUI = () => {
            const following = this.isFollowing(business.id);
            const count = this.readFollowersCount(business.id);
            btn.classList.toggle('is-following', following);
            btn.innerHTML = following
                ? '<i class="fas fa-check"></i> <span class="follow-btn-text">Following</span>'
                : '<i class="fas fa-plus"></i> <span class="follow-btn-text">Follow</span>';
            countEl.textContent = this.formatFollowers(count);
        };

        // Initialize defaults if not present
        if (localStorage.getItem(this.getFollowersKey(business.id)) === null) {
            this.writeFollowersCount(business.id, Math.floor(Math.random() * 20));
        }

        syncUI();

        btn.onclick = (e) => {
            e.preventDefault();
            const currentlyFollowing = this.isFollowing(business.id);
            const currentCount = this.readFollowersCount(business.id);
            const nextFollowing = !currentlyFollowing;
            const nextCount = Math.max(0, currentCount + (nextFollowing ? 1 : -1));
            this.setFollowing(business.id, nextFollowing);
            this.writeFollowersCount(business.id, nextCount);
            this.updateFollowersListMutation(business.id, nextFollowing);
            syncUI();
        };
    }

    updateFollowersListMutation(businessId, nowFollowing) {
        let list = this.readFollowersList(businessId);
        const youId = 'you';
        if (nowFollowing) {
            // add if missing
            if (!list.find(x => x.id === youId)) {
                list.unshift({ id: youId, name: 'You', initials: 'YOU' });
            }
        } else {
            // remove
            list = list.filter(x => x.id !== youId);
        }
        this.writeFollowersList(businessId, list);
    }

    seedFollowersIfNeeded(businessId) {
        // If no list, seed with a few sample followers to demo UI
        if (!localStorage.getItem(this.getFollowersListKey(businessId))) {
            const sampleNames = ['Alice','Ben','Carla','Diego','Ella','Farid','Gwen','Hassan','Ivy','Jules'];
            const count = Math.min(6, Math.max(2, Math.floor(Math.random() * 6) + 2));
            const list = Array.from({ length: count }, (_, i) => {
                const name = sampleNames[(Math.floor(Math.random()*sampleNames.length))];
                const initials = name.slice(0, 2).toUpperCase();
                return { id: `seed_${i}_${Date.now()}`, name, initials };
            });
            this.writeFollowersList(businessId, list);
        }
    }

    openFollowersModal() {
        const business = this.currentBusiness;
        if (!business) return;
        this.seedFollowersIfNeeded(business.id);
        this.renderFollowersList();
        const modal = document.getElementById('followersModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    renderFollowersList() {
        const listEl = document.getElementById('followersList');
        if (!listEl || !this.currentBusiness) return;
        const list = this.readFollowersList(this.currentBusiness.id);
        if (list.length === 0) {
            listEl.innerHTML = '<div class="text-muted">No followers yet.</div>';
            return;
        }
        listEl.innerHTML = list.map(f => `
            <div class="follower-item">
                <div class="avatar">${(f.initials || f.name || '?').toString().slice(0,2).toUpperCase()}</div>
                <div class="name">${f.name || 'User'}</div>
            </div>
        `).join('');
    }
    
    updateStructuredData() {
        const business = this.currentBusiness;
        if (!business) return;
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": business.name,
            "description": business.description,
            "image": business.image,
            "telephone": business.phone,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": business.location
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": getAverageRating(business.id).toFixed(1),
                "reviewCount": getTotalRatings(business.id)
            },
            "url": window.location.href
        };
        
        // Add social media links if available
        if (business.instagram || business.tiktok || business.whatsapp) {
            structuredData.sameAs = [];
            if (business.instagram) {
                structuredData.sameAs.push(`https://instagram.com/${business.instagram.replace('@', '')}`);
            }
            if (business.tiktok) {
                structuredData.sameAs.push(`https://tiktok.com/@${business.tiktok.replace('@', '')}`);
            }
        }
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
    
    setupEventListeners() {
        // Gallery modal events
        const galleryModal = document.getElementById('galleryModal');
        const galleryModalClose = document.getElementById('galleryModalClose');
        const modalImage = document.getElementById('galleryModalImage');
        
        if (galleryModalClose) {
            galleryModalClose.addEventListener('click', () => {
                this.closeGalleryModal();
            });
        }
        
        if (galleryModal) {
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    this.closeGalleryModal();
                }
            });

            // Keyboard navigation when modal is open
            galleryModal.addEventListener('shown.bs.modal', () => {
                this._handleKeyDown = (ev) => {
                    if (ev.key === 'ArrowLeft') {
                        this.previousGalleryImage();
                    } else if (ev.key === 'ArrowRight') {
                        this.nextGalleryImage();
                    } else if (ev.key === 'Escape') {
                        this.closeGalleryModal();
                    }
                };
                document.addEventListener('keydown', this._handleKeyDown);
            });
            galleryModal.addEventListener('hidden.bs.modal', () => {
                if (this._handleKeyDown) {
                    document.removeEventListener('keydown', this._handleKeyDown);
                    this._handleKeyDown = null;
                }
            });

            // Basic swipe support
            let touchStartX = 0;
            galleryModal.addEventListener('touchstart', (ev) => {
                touchStartX = ev.changedTouches?.[0]?.clientX || 0;
            }, { passive: true });
            galleryModal.addEventListener('touchend', (ev) => {
                const endX = ev.changedTouches?.[0]?.clientX || 0;
                const deltaX = endX - touchStartX;
                if (Math.abs(deltaX) > 30) {
                    if (deltaX > 0) this.previousGalleryImage();
                    else this.nextGalleryImage();
                }
            }, { passive: true });
        }

        // Image load/error state handling
        if (modalImage) {
            modalImage.addEventListener('load', () => {
                modalImage.classList.remove('loading');
                modalImage.classList.add('loaded');
            });
            modalImage.addEventListener('error', () => {
                modalImage.classList.remove('loading');
                modalImage.classList.add('loaded');
                modalImage.alt = 'Image failed to load';
            });
        }
        // Rating modal events
        const ratingModal = document.getElementById('ratingModal');
        
        if (ratingModal) {
            ratingModal.addEventListener('click', (e) => {
                if (e.target === ratingModal) {
                    this.closeRatingModal();
                }
            });
        }
    }
    
    showError(message) {
        const heroSection = document.getElementById('businessHero');
        if (heroSection) {
            heroSection.innerHTML = `
                <div class="error-container">
                    <div class="error-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h2>Business Not Found</h2>
                        <p>${message}</p>
                        <a href="local-business2.html" class="btn btn-primary">Back to Business Directory</a>
                    </div>
                </div>
            `;
        }
    }
    
    openGalleryModal(serviceName, imageIndex = 0) {
        const business = this.currentBusiness;
        if (!business || !business.serviceGalleries || !business.serviceGalleries[serviceName]) return;
        
        this.currentGallery = business.serviceGalleries[serviceName];
        this.currentGalleryIndex = imageIndex;
        
        const modal = document.getElementById('galleryModal');
        const modalTitle = document.getElementById('galleryModalTitle');
        
        if (modalTitle) {
            modalTitle.textContent = serviceName;
        }
        
        this.updateGalleryImage();
        
        if (modal) {
            // Use Bootstrap modal show method
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }
    
    updateGalleryImage() {
        if (!this.currentGallery || this.currentGalleryIndex === undefined) return;
        
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryCounter');
        const prevBtn = document.getElementById('galleryPrevBtn');
        const nextBtn = document.getElementById('galleryNextBtn');
        
        const currentImage = this.currentGallery[this.currentGalleryIndex];
        
        if (modalImage) {
            // Apply loading state while switching images
            modalImage.classList.remove('loaded');
            modalImage.classList.add('loading');
            // Force reload by updating src after clearing
            modalImage.src = '';
            modalImage.src = currentImage.image;
            modalImage.alt = currentImage.title || '';
        }
        
        if (modalCounter) {
            modalCounter.textContent = `${this.currentGalleryIndex + 1} / ${this.currentGallery.length}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentGalleryIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentGalleryIndex === this.currentGallery.length - 1;
        }
    }
    
    previousGalleryImage() {
        if (this.currentGalleryIndex > 0) {
            this.currentGalleryIndex--;
            this.updateGalleryImage();
        }
    }
    
    nextGalleryImage() {
        if (this.currentGalleryIndex < this.currentGallery.length - 1) {
            this.currentGalleryIndex++;
            this.updateGalleryImage();
        }
    }
    
    closeGalleryModal() {
        const modal = document.getElementById('galleryModal');
        if (modal) {
            // Use Bootstrap modal hide method
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
    
    openRatingModal() {
        if (!this.currentBusiness) return;
        
        const business = this.currentBusiness;
        // Use functions from local-business2.js
        const currentUserRating = getUserRating(business.id);
        const averageRating = getAverageRating(business.id);
        const totalRatings = getTotalRatings(business.id);
        
        const modal = document.getElementById('ratingModal');
        const modalContent = document.getElementById('ratingModalContent');
        
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="rating-modal-header">
                    <h3>Rate ${business.name}</h3>
                    <button class="rating-modal-close" onclick="businessDetailManager.closeRatingModal()">&times;</button>
                </div>
                <div class="rating-modal-body">
                    <div class="current-rating">
                        <div class="rating-stars large">
                            ${renderStarsHTML(averageRating)}
                        </div>
                        <div class="rating-info">
                            <span class="rating-score">${averageRating.toFixed(1)}</span>
                            <span class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</span>
                        </div>
                    </div>
                    
                    <div class="user-rating-section">
                        <h4>${currentUserRating ? 'Update Your Rating' : 'Rate This Business'}</h4>
                        <div class="interactive-rating" id="interactiveRating">
                            ${renderInteractiveStars(business.id, currentUserRating?.rating || 0)}
                        </div>
                        <div class="rating-labels">
                            <span class="rating-label" data-rating="1">Poor</span>
                            <span class="rating-label" data-rating="2">Fair</span>
                            <span class="rating-label" data-rating="3">Good</span>
                            <span class="rating-label" data-rating="4">Very Good</span>
                            <span class="rating-label" data-rating="5">Excellent</span>
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <label for="ratingReview">Write a review (optional):</label>
                        <textarea id="ratingReview" placeholder="Share your experience with this business..." rows="4">${currentUserRating?.review || ''}</textarea>
                    </div>
                    
                    <div class="rating-actions">
                        <button class="btn-secondary" onclick="businessDetailManager.closeRatingModal()">Cancel</button>
                        <button class="btn-primary" onclick="submitRatingWithReview('${business.id}')">
                            ${currentUserRating ? 'Update Rating' : 'Submit Rating'}
                        </button>
                    </div>
                </div>
            `;
        }
        
        if (modal) {
            // Use Bootstrap modal show method
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
        
        // Add hover effects to rating labels
        addRatingLabelHoverEffects();
    }
    
    closeRatingModal() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            // Use Bootstrap modal hide method
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
    
    shareBusiness() {
        if (!this.currentBusiness) return;
        
        const business = this.currentBusiness;
        const shareData = {
            title: business.name,
            text: business.description,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Business shared successfully'))
                .catch((error) => console.log('Error sharing business:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareUrl = shareData.url;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Business link copied to clipboard!');
            }).catch(() => {
                // Fallback if clipboard API is not available
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Business link copied to clipboard!');
            });
        }
    }
    
    sortReviews() {
        const sortBy = document.getElementById('reviewSort')?.value || 'newest';
        // Use function from local-business2.js
        const reviews = getReviewsForBusiness(this.currentBusinessId);
        
        let sortedReviews = [...reviews];
        
        switch(sortBy) {
            case 'newest':
                sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'highest':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                sortedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
                break;
        }
        
        this.renderReviewsList(sortedReviews);
    }
    
    filterReviews() {
        const filterBy = document.getElementById('reviewFilter')?.value || 'all';
        // Use function from local-business2.js
        const reviews = getReviewsForBusiness(this.currentBusinessId);
        
        let filteredReviews = reviews;
        if (filterBy !== 'all') {
            filteredReviews = reviews.filter(review => review.rating === parseInt(filterBy));
        }
        
        this.renderReviewsList(filteredReviews);
    }
}

// Global functions for HTML onclick events
function openGalleryModal(serviceName, imageIndex = 0) {
    if (window.businessDetailManager) {
        window.businessDetailManager.openGalleryModal(serviceName, imageIndex);
    }
}

function previousGalleryImage() {
    if (window.businessDetailManager) {
        window.businessDetailManager.previousGalleryImage();
    }
}

function nextGalleryImage() {
    if (window.businessDetailManager) {
        window.businessDetailManager.nextGalleryImage();
    }
}

function openRatingModal() {
    if (window.businessDetailManager) {
        window.businessDetailManager.openRatingModal();
    }
}

function openFollowersModal() {
    if (window.businessDetailManager) {
        window.businessDetailManager.openFollowersModal();
    }
}

function shareBusiness() {
    if (window.businessDetailManager) {
        window.businessDetailManager.shareBusiness();
    }
}

function sortReviews() {
    if (window.businessDetailManager) {
        window.businessDetailManager.sortReviews();
    }
}

function filterReviews() {
    if (window.businessDetailManager) {
        window.businessDetailManager.filterReviews();
    }
}

// Use functions from local-business2.js for rating and review functionality
function submitRatingWithReview(businessId) {
    const rating = window.selectedRating || 0;
    const review = document.getElementById('ratingReview').value.trim();
    
    if (rating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    // Use function from local-business2.js
    if (submitRating(businessId, rating, review)) {
        if (window.businessDetailManager) {
            window.businessDetailManager.closeRatingModal();
        }
        showRatingSuccess();
        
        // Refresh the business detail page
        if (window.businessDetailManager) {
            window.businessDetailManager.loadBusinessReviews();
        }
    }
}

// Note: markReviewHelpful and reportReview functions are available from local-business2.js

// Additional rating functions needed for business detail page
function renderInteractiveStars(businessId, currentRating = 0) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= currentRating ? 'fas fa-star' : 'far fa-star';
        starsHTML += `<i class="${starClass} interactive-star" data-rating="${i}" onclick="selectRating('${businessId}', ${i})"></i>`;
    }
    return starsHTML;
}

function selectRating(businessId, rating) {
    const stars = document.querySelectorAll('.interactive-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star interactive-star';
        } else {
            star.className = 'far fa-star interactive-star';
        }
    });
    
    // Update rating labels
    const labels = document.querySelectorAll('.rating-label');
    labels.forEach(label => {
        label.classList.remove('active');
        if (parseInt(label.dataset.rating) === rating) {
            label.classList.add('active');
        }
    });
    
    // Store selected rating
    window.selectedRating = rating;
}

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

// Initialize the business detail manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.businessDetailManager = new BusinessDetailManager();
});
