// Home Page Deals Loader
const SMARTPHONE_API_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/smartphones';
const TRENDING_DEALS_API_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/trending-deals';

class HomeDeals {
    constructor() {
        this.smartphones = [];
        this.trendingProducts = [];
        this.init();
    }

    async init() {
        await this.fetchSmartphones();
        await this.fetchTrendingDeals();
        this.renderSmartphoneDeals();
        this.renderTrendingDeals();
    }

    async fetchSmartphones() {
        try {
            const response = await fetch(SMARTPHONE_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.smartphones = this.extractSmartphones(data);
        } catch (error) {
            console.error('Error fetching smartphones:', error);
            this.smartphones = [];
        }
    }

    async fetchTrendingDeals() {
        try {
            const response = await fetch(TRENDING_DEALS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.trendingProducts = this.extractProducts(data);
        } catch (error) {
            console.error('Error fetching trending deals:', error);
            this.trendingProducts = [];
        }
    }

    extractSmartphones(data) {
        if (Array.isArray(data)) {
            return data;
        } else if (data.products && Array.isArray(data.products)) {
            return data.products;
        } else if (data.smartphones && Array.isArray(data.smartphones)) {
            return data.smartphones;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    }

    extractProducts(data) {
        if (Array.isArray(data)) {
            return data;
        } else if (data.products && Array.isArray(data.products)) {
            return data.products;
        } else if (data.trending && Array.isArray(data.trending)) {
            return data.trending;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    }

    renderSmartphoneDeals() {
        const smartphonesShowcase = document.querySelector('.smartphones-deals-showcase');
        if (!smartphonesShowcase) return;

        if (this.smartphones.length === 0) {
            smartphonesShowcase.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-mobile-alt fa-3x mb-3"></i>
                    <h4>No smartphone deals available</h4>
                    <p>Check back later for the latest deals</p>
                </div>
            `;
            return;
        }

        // Shuffle the smartphones array to show different ones on each refresh
        this.shuffledSmartphones = this.shuffleArray([...this.smartphones]);
        
        // Show first set of 4 smartphones
        this.currentSlide = 0;
        this.showSlide(0);
        
        // Add slide indicator functionality
        this.setupSlideIndicators();
        
        // Start auto-play timer (16 seconds)
        this.startAutoPlay();
    }

    renderTrendingDeals() {
        const trendingContainer = document.querySelector('.trending-deals-showcase');
        if (!trendingContainer) return;

        if (this.trendingProducts.length === 0) {
            trendingContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-fire fa-3x mb-3"></i>
                    <h4>No trending deals found</h4>
                    <p>Check back later for new trending deals!</p>
                </div>
            `;
            return;
        }

        // Shuffle the products array to show different ones on each refresh
        this.shuffledTrendingProducts = this.shuffleArray([...this.trendingProducts]);
        
        // Show first set of 4 products
        this.currentTrendingSlide = 0;
        this.showTrendingSlide(0);
        
        // Add slide indicator functionality
        this.setupTrendingSlideIndicators();
        
        // Start auto-play timer (16 seconds)
        this.startTrendingAutoPlay();
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    createSmartphoneCard(phone) {
        const lowestPrice = this.getLowestPrice(phone);
        const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', { 
            style: 'currency', 
            currency: 'ZAR', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        }) : 'Price not available';
        
        const imageUrl = phone.imageUrl || phone.image || phone.img || 'https://via.placeholder.com/150?text=No+Image';
        const productName = phone.model || phone.title || 'Unknown Smartphone';
        const brandName = phone.brand || 'Unknown Brand';

        // Extract specs
        const specs = [];
        if (phone.specs?.Performance?.Ram) specs.push(phone.specs.Performance.Ram);
        if (phone.specs?.Performance?.Storage) specs.push(phone.specs.Performance.Storage);
        if (phone.specs?.Display?.Size) specs.push(phone.specs.Display.Size);
        if (phone.specs?.Camera?.Main) specs.push(phone.specs.Camera.Main);

        // Get retailer info
        const retailerCount = phone.offers ? phone.offers.length : 0;
        const retailerText = retailerCount > 0 ? `${retailerCount} retailer${retailerCount > 1 ? 's' : ''}` : 'No offers';

        return `
            <div class="smartphone-card">
                <a href="smartphone-compare.html?id=${phone.product_id || phone.id}" class="card-link">
                    <div class="card-image-container">
                        <button class="price-alert-bell" data-product-id="${phone.product_id || phone.id}" title="Set Price Alert">
                            <i class="fas fa-bell"></i>
                        </button>
                        <img src="${imageUrl}" alt="${productName}" class="card-image" loading="lazy">
                    </div>
                    <div class="card-content">
                        <div class="brand-badge">${brandName}</div>
                        <h3 class="product-name">${productName}</h3>
                        <div class="product-specs">
                            ${specs.map(spec => `<span>${spec}</span>`).join('')}
                        </div>
                        <div class="product-price">
                            <div class="current-price">${formattedPrice}</div>
                        </div>
                        <div class="retailer-info">${retailerText}</div>
                    </div>
                </a>
                <div class="card-actions">
                    <button class="btn-compare" data-product-id="${phone.product_id || phone.id}">View</button>
                    <button class="btn-wishlist" data-product-id="${phone.product_id || phone.id}">Add to Wishlist</button>
                </div>
            </div>
        `;
    }

    createTrendingDealsCard(product) {
        const lowestPrice = this.getLowestPrice(product);
        const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', { 
            style: 'currency', 
            currency: 'ZAR', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        }) : 'Price not available';
        
        const imageUrl = product.imageUrl || product.image || product.img || 'https://via.placeholder.com/150?text=No+Image';
        const productName = product.model || product.title || 'Unknown Product';
        const brandName = product.brand || 'Unknown Brand';
        const category = product.category || 'general';

        // Extract specs based on category
        const specs = this.extractSpecs(product, category);

        // Get retailer info
        const retailerCount = product.offers ? product.offers.length : 0;
        const retailerText = retailerCount > 0 ? `${retailerCount} retailer${retailerCount > 1 ? 's' : ''}` : 'No offers';

        // Create category-based link
        const categoryLink = this.getCategoryLink(category);

        return `
            <div class="trending-deals-card">
                <a href="${categoryLink}" class="card-link">
                    <div class="card-image-container">
                        <button class="price-alert-bell" data-product-id="${product.product_id || product.id}" title="Set Price Alert">
                            <i class="fas fa-bell"></i>
                        </button>
                        <img src="${imageUrl}" alt="${productName}" class="card-image" loading="lazy">
                    </div>
                    <div class="card-content">
                        <div class="brand-badge">${brandName}</div>
                        <h3 class="product-name">${productName}</h3>
                        <div class="product-specs">
                            ${specs.map(spec => `<span>${spec}</span>`).join('')}
                        </div>
                        <div class="product-price">
                            <div class="current-price">${formattedPrice}</div>
                        </div>
                        <div class="retailer-info">${retailerText}</div>
                    </div>
                </a>
                <div class="card-actions">
                    <button class="btn-compare" data-product-id="${product.product_id || product.id}">View</button>
                    <button class="btn-wishlist" data-product-id="${product.product_id || product.id}">Add to Wishlist</button>
                </div>
            </div>
        `;
    }

    extractSpecs(product, category) {
        const specs = [];
        
        switch (category) {
            case 'smartphones':
                if (product.specs?.Performance?.Ram) specs.push(product.specs.Performance.Ram);
                if (product.specs?.Performance?.Storage) specs.push(product.specs.Performance.Storage);
                if (product.specs?.Display?.Size) specs.push(product.specs.Display.Size);
                if (product.specs?.Camera?.Main) specs.push(product.specs.Camera.Main);
                break;
                
            case 'gaming-consoles':
                if (product.specs?.Performance?.Storage) specs.push(product.specs.Performance.Storage);
                if (product.specs?.Performance?.Gpu) specs.push(product.specs.Performance.Gpu);
                if (product.specs?.Display?.Resolution) specs.push(product.specs.Display.Resolution);
                if (product.specs?.Performance?.Processor) specs.push(product.specs.Performance.Processor);
                break;
                
            case 'windows-laptops':
            case 'macbooks-laptops':
            case 'laptop-gaming':
                if (product.specs?.Performance?.Processor) specs.push(product.specs.Performance.Processor);
                if (product.specs?.Performance?.Ram) specs.push(product.specs.Performance.Ram);
                if (product.specs?.Performance?.Storage) specs.push(product.specs.Performance.Storage);
                if (product.specs?.Display?.Size) specs.push(product.specs.Display.Size);
                break;
                
            case 'tablets':
                if (product.specs?.Performance?.Storage) specs.push(product.specs.Performance.Storage);
                if (product.specs?.Display?.Size) specs.push(product.specs.Display.Size);
                if (product.specs?.Performance?.Ram) specs.push(product.specs.Performance.Ram);
                break;
                
            case 'gaming-monitors':
            case 'televison':
                if (product.specs?.Display?.Size) specs.push(product.specs.Display.Size);
                if (product.specs?.Display?.Resolution) specs.push(product.specs.Display.Resolution);
                if (product.specs?.Display?.Refresh_Rate) specs.push(product.specs.Display.Refresh_Rate);
                break;
                
            case 'consoles-accessories':
                if (product.specs?.AdditionalFeatures) {
                    specs.push(...product.specs.AdditionalFeatures.slice(0, 3));
                }
                break;
                
            default:
                // Generic specs for unknown categories
                if (product.specs?.Performance?.Storage) specs.push(product.specs.Performance.Storage);
                if (product.specs?.Performance?.Ram) specs.push(product.specs.Performance.Ram);
                if (product.specs?.Display?.Size) specs.push(product.specs.Display.Size);
                break;
        }
        
        return specs.slice(0, 4); // Limit to 4 specs
    }

    getCategoryLink(category) {
        const categoryLinks = {
            'smartphones': 'smartphones.html',
            'gaming-consoles': 'gaming-consoles.html',
            'windows-laptops': 'laptops.html',
            'tablets': 'tablets.html',
            'laptop-gaming': 'gaming-laptops.html',
            'gaming-monitors': 'gaming-monitors.html',
            'televison': 'televisions.html',
            'consoles-accessories': 'gaming-accessories.html',
            'macbooks-laptops': 'macbooks.html'
            // Add more categories here as needed
        };
        
        return categoryLinks[category] || 'products.html';
    }

    getLowestPrice(phone) {
        if (!phone.offers || phone.offers.length === 0) return 0;
        return Math.min(...phone.offers.map(offer => offer.price).filter(price => typeof price === 'number' && price > 0));
    }

    showSlide(slideIndex) {
        const smartphonesShowcase = document.querySelector('.smartphones-deals-showcase');
        if (!smartphonesShowcase || !this.shuffledSmartphones) return;

        // Calculate the start index for this slide (4 cards per slide)
        const startIndex = slideIndex * 4;
        const endIndex = startIndex + 4;
        
        // Get the smartphones for this slide
        const smartphonesToShow = this.shuffledSmartphones.slice(startIndex, endIndex);
        
        // If we don't have enough smartphones for this slide, show what we have
        if (smartphonesToShow.length === 0) {
            smartphonesShowcase.innerHTML = `
                <div class="no-more-deals">
                    <i class="fas fa-mobile-alt fa-3x mb-3"></i>
                    <h4>No more deals available</h4>
                    <p>Check back later for new smartphone deals!</p>
                </div>
            `;
            return;
        }

        // Render the smartphones for this slide
        smartphonesShowcase.innerHTML = smartphonesToShow.map(phone => this.createSmartphoneCard(phone)).join('');
        
        // Update current slide
        this.currentSlide = slideIndex;
    }

    setupSlideIndicators() {
        const indicators = document.querySelectorAll('.smartphones-deals-container .slide-indicator');
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Stop auto-play when user manually clicks
                this.stopAutoPlay();
                
                // Remove active class from all indicators
                indicators.forEach(ind => ind.classList.remove('active'));
                
                // Add active class to clicked indicator
                indicator.classList.add('active');
                
                // Add bounce effect
                indicator.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1.1)';
                }, 150);
                
                // Show the corresponding slide
                this.showSlide(index);
                
                console.log(`Switched to slide ${index + 1} - showing smartphones ${index * 4 + 1} to ${Math.min((index + 1) * 4, this.shuffledSmartphones.length)}`);
                
                // Restart auto-play after manual interaction
                this.startAutoPlay();
            });
        });
    }

    startAutoPlay() {
        // Clear any existing timer
        this.stopAutoPlay();
        
        // Set timer for 16 seconds
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, 16000); // 16 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    nextSlide() {
        const indicators = document.querySelectorAll('.smartphones-deals-container .slide-indicator');
        const totalSlides = indicators.length;
        
        // Move to next slide
        this.currentSlide = (this.currentSlide + 1) % totalSlides;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Show the slide
        this.showSlide(this.currentSlide);
        
        console.log(`Auto-advanced to slide ${this.currentSlide + 1}`);
    }

    // Trending Deals Slide Methods
    showTrendingSlide(slideIndex) {
        const trendingContainer = document.querySelector('.trending-deals-showcase');
        if (!trendingContainer || !this.shuffledTrendingProducts) return;

        // Calculate the start index for this slide (4 cards per slide)
        const startIndex = slideIndex * 4;
        const endIndex = startIndex + 4;
        
        // Get the products for this slide
        const productsToShow = this.shuffledTrendingProducts.slice(startIndex, endIndex);
        
        // If we don't have enough products for this slide, show what we have
        if (productsToShow.length === 0) {
            trendingContainer.innerHTML = `
                <div class="no-more-deals">
                    <i class="fas fa-fire fa-3x mb-3"></i>
                    <h4>No more trending deals available</h4>
                    <p>Check back later for new trending deals!</p>
                </div>
            `;
            return;
        }

        // Render the products for this slide
        trendingContainer.innerHTML = productsToShow.map(product => this.createTrendingDealsCard(product)).join('');
        
        // Update current slide
        this.currentTrendingSlide = slideIndex;
    }

    setupTrendingSlideIndicators() {
        const indicators = document.querySelectorAll('.trending-deals-container .slide-indicator');
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Stop auto-play when user manually clicks
                this.stopTrendingAutoPlay();
                
                // Remove active class from all indicators
                indicators.forEach(ind => ind.classList.remove('active'));
                
                // Add active class to clicked indicator
                indicator.classList.add('active');
                
                // Add bounce effect
                indicator.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1.1)';
                }, 150);
                
                // Show the corresponding slide
                this.showTrendingSlide(index);
                
                console.log(`Trending deals: Switched to slide ${index + 1}`);
                
                // Restart auto-play after manual interaction
                this.startTrendingAutoPlay();
            });
        });
    }

    startTrendingAutoPlay() {
        // Clear any existing timer
        this.stopTrendingAutoPlay();
        
        // Set timer for 16 seconds
        this.trendingAutoPlayTimer = setInterval(() => {
            this.nextTrendingSlide();
        }, 16000); // 16 seconds
    }

    stopTrendingAutoPlay() {
        if (this.trendingAutoPlayTimer) {
            clearInterval(this.trendingAutoPlayTimer);
            this.trendingAutoPlayTimer = null;
        }
    }

    nextTrendingSlide() {
        const indicators = document.querySelectorAll('.trending-deals-container .slide-indicator');
        const totalSlides = indicators.length;
        
        // Move to next slide
        this.currentTrendingSlide = (this.currentTrendingSlide + 1) % totalSlides;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentTrendingSlide);
        });
        
        // Show the slide
        this.showTrendingSlide(this.currentTrendingSlide);
        
        console.log(`Trending deals: Auto-advanced to slide ${this.currentTrendingSlide + 1}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.homeDeals = new HomeDeals();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeDeals;
}
