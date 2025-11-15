// Compare Modal Manager for Smartphones
class CompareModalManager {
    constructor() {
        this.compareProducts = [];
        this.maxProducts = 3;
        this.allProducts = [];
        this.init();
    }

    init() {
        // Setup event listeners first (non-blocking)
        this.setupEventListeners();
        
        // Load products for search asynchronously (non-blocking)
        this.loadProducts().catch(error => {
            console.error('Error loading products in init:', error);
        });
    }

    async loadProducts() {
        try {
            if (typeof API_CONFIG === 'undefined') {
                console.error('API_CONFIG not defined');
                return;
            }

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.LIST_PRODUCTS_ENDPOINT}?category=smartphones`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Parse response - handle different response structures
            let productsData = data;
            if (data.body) {
                try {
                    productsData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                } catch (e) {
                    productsData = data;
                }
            }

            if (Array.isArray(productsData)) {
                this.allProducts = productsData;
            } else if (productsData.products && Array.isArray(productsData.products)) {
                this.allProducts = productsData.products;
            } else if (productsData.data && Array.isArray(productsData.data)) {
                this.allProducts = productsData.data;
            } else {
                this.allProducts = [];
            }
        } catch (error) {
            console.error('Error loading products for compare:', error);
            this.allProducts = [];
        }
    }

    setupEventListeners() {
        // Close modal
        const closeBtn = document.getElementById('compareModalClose');
        const modal = document.getElementById('compareModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide();
                }
            });
        }

        // Search input
        const searchInput = document.getElementById('productSearchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    this.hideSearchResults();
                    return;
                }

                searchTimeout = setTimeout(() => {
                    this.searchProducts(query);
                }, 300);
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                this.hide();
            }
        });
    }

    show(product = null) {
        try {
            const modal = document.getElementById('compareModal');
            if (!modal) {
                console.error('Compare modal element not found');
                return;
            }

            console.log('CompareModal.show called', { product, modalExists: !!modal });

            // Display modal first (non-blocking)
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // If product is provided, add it (non-blocking)
            if (product) {
                // Use setTimeout to prevent blocking
                setTimeout(() => {
                    this.addProduct(product);
                }, 0);
            } else {
                // Render products if no product to add
                requestAnimationFrame(() => {
                    this.renderProducts();
                });
            }
            
            console.log('Compare modal opened', { 
                product, 
                productsCount: this.compareProducts.length,
                modalDisplay: modal.style.display,
                modalVisible: modal.offsetParent !== null
            });
        } catch (error) {
            console.error('Error showing modal:', error);
            // Still try to show the modal even if there's an error
            const modal = document.getElementById('compareModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    hide() {
        const modal = document.getElementById('compareModal');
        if (!modal) return;

        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.classList.remove('show');
        document.body.style.overflow = '';

        // Clear search
        const searchInput = document.getElementById('productSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideSearchResults();
    }

    addProduct(product) {
        try {
            // Check if product already exists
            const productId = product.product_id || product.id;
            if (this.compareProducts.some(p => (p.product_id || p.id) === productId)) {
                return false;
            }

            // Check max products limit
            if (this.compareProducts.length >= this.maxProducts) {
                alert(`You can compare up to ${this.maxProducts} products at a time.`);
                return false;
            }

            this.compareProducts.push(product);
            
            // Use requestAnimationFrame to prevent blocking
            requestAnimationFrame(() => {
                this.renderProducts();
            });
            
            return true;
        } catch (error) {
            console.error('Error adding product:', error);
            return false;
        }
    }

    removeProduct(productId) {
        try {
            this.compareProducts = this.compareProducts.filter(
                p => (p.product_id || p.id) !== productId
            );
            requestAnimationFrame(() => {
                this.renderProducts();
            });
        } catch (error) {
            console.error('Error removing product:', error);
        }
    }

    renderProducts() {
        try {
            const container = document.getElementById('compareProductsContainer');
            if (!container) {
                console.warn('compareProductsContainer not found');
                return;
            }

            // Clear container
            container.innerHTML = '';

            // Render existing products
            this.compareProducts.forEach((product, index) => {
                try {
                    const productCard = this.createProductCard(product, index);
                    if (productCard) {
                        container.appendChild(productCard);
                    }
                } catch (error) {
                    console.error(`Error rendering product ${index}:`, error);
                }
            });

            // Add empty slots if less than max
            const emptySlots = this.maxProducts - this.compareProducts.length;
            for (let i = 0; i < emptySlots; i++) {
                try {
                    const emptyCard = this.createEmptyCard();
                    if (emptyCard) {
                        container.appendChild(emptyCard);
                    }
                } catch (error) {
                    console.error(`Error creating empty card ${i}:`, error);
                }
            }
        } catch (error) {
            console.error('Error rendering products:', error);
        }
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.product_id || product.id;

        const productId = product.product_id || product.id;
        const model = product.model || product.title || 'Unknown Product';
        const brand = product.brand || 'Unknown Brand';
        
        // Try multiple image properties to find the image URL
        const image = product.imageUrl || 
                     product.image || 
                     product.img || 
                     (product.images && product.images.length > 0 ? product.images[0] : '') ||
                     'https://via.placeholder.com/400?text=No+Image';
        
        const lowestPrice = this.getLowestPrice(product);
        const specs = this.extractKeySpecs(product.specs || {});

        card.innerHTML = `
            <button class="remove-product-btn" onclick="window.compareModal.removeProduct('${productId}')" aria-label="Remove product">
                &times;
            </button>
            <div class="product-image-wrapper">
                <img src="${image}" alt="${model}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'; this.onerror=null;">
            </div>
            <h4>${this.escapeHtml(brand)} ${this.escapeHtml(model)}</h4>
            <div class="product-price">
                ${lowestPrice ? `From R${lowestPrice.toLocaleString('en-ZA')}` : 'Price not available'}
            </div>
            <div class="product-specs-summary">
                ${specs.slice(0, 3).map(spec => `
                    <div class="spec-item">
                        <span class="spec-label">${this.escapeHtml(spec.label)}:</span>
                        <span class="spec-value">${this.escapeHtml(spec.value)}</span>
                    </div>
                `).join('')}
            </div>
            <button class="specs-toggle-btn" onclick="window.compareModal.toggleSpecs(${index})">
                View Full Specs <span class="specs-chevron">▼</span>
            </button>
            <div class="specs-content" id="specs-${index}" style="display: none;">
                ${this.renderFullSpecs(product.specs || {})}
            </div>
            <button class="prices-toggle-btn" onclick="window.compareModal.togglePrices(${index})">
                View Prices <span class="prices-chevron">▼</span>
            </button>
            <div class="prices-content" id="prices-${index}" style="display: none;">
                ${this.renderPrices(product)}
            </div>
        `;

        return card;
    }

    createEmptyCard() {
        const card = document.createElement('div');
        card.className = 'empty-card';
        card.innerHTML = `
            <div class="empty-card-icon">+</div>
            <p>Add a product to compare</p>
        `;
        return card;
    }

    getLowestPrice(product) {
        if (!product.offers || product.offers.length === 0) return null;
        const prices = product.offers
            .map(offer => offer.price)
            .filter(price => typeof price === 'number' && price > 0);
        return prices.length > 0 ? Math.min(...prices) : null;
    }

    extractKeySpecs(specs) {
        if (!specs) return [];
        const keySpecs = [];
        
        if (specs.Performance?.Ram) {
            keySpecs.push({ label: 'RAM', value: specs.Performance.Ram });
        }
        if (specs.Performance?.Storage) {
            keySpecs.push({ label: 'Storage', value: specs.Performance.Storage });
        }
        if (specs.Os?.['Operating System']) {
            keySpecs.push({ label: 'OS', value: specs.Os['Operating System'] });
        }
        if (specs.Display?.Size) {
            keySpecs.push({ label: 'Display', value: specs.Display.Size });
        }
        if (specs.Camera?.['Rear Camera']) {
            keySpecs.push({ label: 'Camera', value: specs.Camera['Rear Camera'] });
        }
        if (specs.Battery?.Capacity) {
            keySpecs.push({ label: 'Battery', value: specs.Battery.Capacity });
        }

        return keySpecs;
    }

    renderFullSpecs(specs) {
        try {
            if (!specs || Object.keys(specs).length === 0) {
                return '<p class="text-muted">No specifications available</p>';
            }

            const flattened = this.flattenSpecs(specs);
            // Limit to first 50 specs to prevent performance issues
            const limitedSpecs = flattened.slice(0, 50);
            
            return `
                <div class="specs-list">
                    ${limitedSpecs.map(spec => `
                        <div class="spec-row">
                            <span class="spec-label">${this.escapeHtml(spec.label)}:</span>
                            <span class="spec-value">${this.escapeHtml(spec.value)}</span>
                        </div>
                    `).join('')}
                    ${flattened.length > 50 ? '<p class="text-muted">... and more</p>' : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error rendering full specs:', error);
            return '<p class="text-muted">Error loading specifications</p>';
        }
    }

    flattenSpecs(specs, prefix = '', depth = 0) {
        // Prevent infinite recursion with depth limit
        if (depth > 10) {
            return [];
        }
        
        const flattened = [];
        
        try {
            for (const key in specs) {
                if (!specs.hasOwnProperty(key)) continue;
                
                const value = specs[key];
                const fullKey = prefix ? `${prefix} - ${key}` : key;
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // Check for circular references by limiting depth
                    flattened.push(...this.flattenSpecs(value, fullKey, depth + 1));
                } else {
                    flattened.push({
                        label: fullKey,
                        value: Array.isArray(value) ? value.join(', ') : String(value)
                    });
                }
            }
        } catch (error) {
            console.error('Error flattening specs:', error);
        }
        
        return flattened;
    }

    renderPrices(product) {
        if (!product.offers || product.offers.length === 0) {
            return '<p class="text-muted">No prices available</p>';
        }

        return `
            <div class="prices-list">
                ${product.offers.map(offer => `
                    <div class="price-row">
                        <span class="retailer-name">${this.escapeHtml(offer.retailer || 'Unknown')}</span>
                        <span class="price-value">R${offer.price?.toLocaleString('en-ZA') || 'N/A'}</span>
                        ${offer.url ? `<a href="${offer.url}" target="_blank" class="visit-store-link">Visit Store</a>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    toggleSpecs(index) {
        const specsContent = document.getElementById(`specs-${index}`);
        const chevron = document.querySelector(`#specs-${index}`).previousElementSibling.querySelector('.specs-chevron');
        
        if (specsContent.style.display === 'none') {
            specsContent.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            specsContent.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    }

    togglePrices(index) {
        const pricesContent = document.getElementById(`prices-${index}`);
        const chevron = document.querySelector(`#prices-${index}`).previousElementSibling.querySelector('.prices-chevron');
        
        if (pricesContent.style.display === 'none') {
            pricesContent.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            pricesContent.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    }

    searchProducts(query) {
        const resultsContainer = document.getElementById('productSearchResults');
        if (!resultsContainer) return;

        const searchTerm = query.toLowerCase();
        const filtered = this.allProducts.filter(product => {
            const model = (product.model || product.title || '').toLowerCase();
            const brand = (product.brand || '').toLowerCase();
            return model.includes(searchTerm) || brand.includes(searchTerm);
        }).slice(0, 10); // Limit to 10 results

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<div class="no-search-results">No products found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        resultsContainer.innerHTML = filtered.map(product => {
            const productId = product.product_id || product.id;
            const model = product.model || product.title || 'Unknown Product';
            const brand = product.brand || 'Unknown Brand';
            
            // Try multiple image properties to find the image URL
            const image = product.imageUrl || 
                         product.image || 
                         product.img || 
                         (product.images && product.images.length > 0 ? product.images[0] : '') ||
                         'https://via.placeholder.com/400?text=No+Image';
            
            const lowestPrice = this.getLowestPrice(product);

            return `
                <div class="search-result-item" onclick="window.compareModal.addProductFromSearch('${productId}')">
                    <img src="${image}" alt="${model}" onerror="this.src='https://via.placeholder.com/400?text=No+Image'; this.onerror=null;">
                    <div class="search-result-info">
                        <h6>${this.escapeHtml(brand)} ${this.escapeHtml(model)}</h6>
                        <p>${lowestPrice ? `From R${lowestPrice.toLocaleString('en-ZA')}` : 'Price not available'}</p>
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.style.display = 'block';
    }

    addProductFromSearch(productId) {
        const product = this.allProducts.find(p => (p.product_id || p.id) === productId);
        if (product) {
            if (this.addProduct(product)) {
                // Clear search
                const searchInput = document.getElementById('productSearchInput');
                if (searchInput) {
                    searchInput.value = '';
                }
                this.hideSearchResults();
            }
        }
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('productSearchResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize compare modal manager
let compareModal;

// Initialize immediately if DOM is ready, otherwise wait
function initializeCompareModal() {
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('Initializing compare modal on DOMContentLoaded');
                compareModal = new CompareModalManager();
                window.compareModal = compareModal;
                console.log('Compare modal initialized', { compareModal: !!window.compareModal });
            });
        } else {
            // DOM is already ready
            console.log('Initializing compare modal immediately (DOM ready)');
            compareModal = new CompareModalManager();
            window.compareModal = compareModal;
            console.log('Compare modal initialized', { compareModal: !!window.compareModal });
        }
    } catch (error) {
        console.error('Error initializing compare modal:', error);
    }
}

// Initialize
initializeCompareModal();

// Also try to initialize after a short delay as backup
setTimeout(() => {
    if (!window.compareModal) {
        console.log('Compare modal not initialized, retrying...');
        initializeCompareModal();
    }
}, 500);

// Global function to open compare modal (for compatibility)
window.openCompareModal = function(product) {
    if (window.compareModal) {
        window.compareModal.show(product);
    } else {
        // Try to initialize if not ready
        initializeCompareModal();
        setTimeout(() => {
            if (window.compareModal) {
                window.compareModal.show(product);
            }
        }, 100);
    }
};

