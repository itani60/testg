// Color data for all tablet models
const TABLET_COLORS = {
    'iPad Pro 12.9-inch (6th generation)': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'Silver', hex: '#f5f5f0', productIdSuffix: 'silver' }
    ],
    'iPad Pro 11-inch (4th generation)': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'Silver', hex: '#f5f5f0', productIdSuffix: 'silver' }
    ],
    'iPad Air (5th generation)': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'Silver', hex: '#f5f5f0', productIdSuffix: 'silver' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Purple', hex: '#8a2be2', productIdSuffix: 'purple' },
        { name: 'Blue', hex: '#4169e1', productIdSuffix: 'blue' }
    ],
    'iPad (10th generation)': [
        { name: 'Silver', hex: '#f5f5f0', productIdSuffix: 'silver' },
        { name: 'Blue', hex: '#4169e1', productIdSuffix: 'blue' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Yellow', hex: '#ffd700', productIdSuffix: 'yellow' }
    ],
    'iPad mini (6th generation)': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Purple', hex: '#8a2be2', productIdSuffix: 'purple' },
        { name: 'Starlight', hex: '#f0f8ff', productIdSuffix: 'starlight' }
    ],
    'Galaxy Tab S9 Ultra': [
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Beige', hex: '#f5deb3', productIdSuffix: 'beige' }
    ],
    'Galaxy Tab S9+': [
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Beige', hex: '#f5deb3', productIdSuffix: 'beige' }
    ],
    'Galaxy Tab S9': [
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Beige', hex: '#f5deb3', productIdSuffix: 'beige' }
    ],
    'Galaxy Tab A9+': [
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Silver', hex: '#c0c0c0', productIdSuffix: 'silver' }
    ],
    'Galaxy Tab A9': [
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Silver', hex: '#c0c0c0', productIdSuffix: 'silver' }
    ],
    'Huawei MatePad Pro 13.2': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' }
    ],
    'Huawei MatePad 11': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' }
    ],
    'Huawei MatePad SE': [
        { name: 'Space Gray', hex: '#1a1a1a', productIdSuffix: 'space-gray' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' }
    ],
    'Lenovo Tab P12': [
        { name: 'Storm Grey', hex: '#696969', productIdSuffix: 'storm-grey' }
    ],
    'Lenovo Tab P11': [
        { name: 'Storm Grey', hex: '#696969', productIdSuffix: 'storm-grey' }
    ],
    'Lenovo Tab M10': [
        { name: 'Iron Grey', hex: '#2f2f2f', productIdSuffix: 'iron-grey' },
        { name: 'Platinum Grey', hex: '#c0c0c0', productIdSuffix: 'platinum-grey' }
    ],
    'Microsoft Surface Pro 9': [
        { name: 'Platinum', hex: '#e5e4e2', productIdSuffix: 'platinum' },
        { name: 'Graphite', hex: '#2f2f2f', productIdSuffix: 'graphite' },
        { name: 'Sapphire', hex: '#0f52ba', productIdSuffix: 'sapphire' },
        { name: 'Forest', hex: '#228b22', productIdSuffix: 'forest' }
    ],
    'Microsoft Surface Go 3': [
        { name: 'Platinum', hex: '#e5e4e2', productIdSuffix: 'platinum' }
    ],
    'Amazon Fire HD 10': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'Denim', hex: '#1560bd', productIdSuffix: 'denim' },
        { name: 'Lavender', hex: '#e6e6fa', productIdSuffix: 'lavender' },
        { name: 'Olive', hex: '#808000', productIdSuffix: 'olive' },
        { name: 'Plum', hex: '#dda0dd', productIdSuffix: 'plum' }
    ],
    'Amazon Fire HD 8': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'Denim', hex: '#1560bd', productIdSuffix: 'denim' },
        { name: 'Lavender', hex: '#e6e6fa', productIdSuffix: 'lavender' },
        { name: 'Olive', hex: '#808000', productIdSuffix: 'olive' },
        { name: 'Plum', hex: '#dda0dd', productIdSuffix: 'plum' }
    ],
    'Google Pixel Tablet': [
        { name: 'Hazel', hex: '#8b7355', productIdSuffix: 'hazel' },
        { name: 'Porcelain', hex: '#f5f5f0', productIdSuffix: 'porcelain' }
    ],
    'Xiaomi Pad 6': [
        { name: 'Graphite Gray', hex: '#2f2f2f', productIdSuffix: 'graphite-gray' },
        { name: 'Misty Blue', hex: '#87ceeb', productIdSuffix: 'misty-blue' },
        { name: 'Gold', hex: '#ffd700', productIdSuffix: 'gold' }
    ],
    'Xiaomi Pad 5': [
        { name: 'Cosmic Gray', hex: '#2f2f2f', productIdSuffix: 'cosmic-gray' },
        { name: 'Pearl White', hex: '#f8f8f8', productIdSuffix: 'pearl-white' },
        { name: 'Forest Green', hex: '#228b22', productIdSuffix: 'forest-green' }
    ],
    'Realme Pad 2': [
        { name: 'Gray', hex: '#696969', productIdSuffix: 'gray' },
        { name: 'Green', hex: '#228b22', productIdSuffix: 'green' }
    ],
    'OPPO Pad Air': [
        { name: 'Fog Gray', hex: '#696969', productIdSuffix: 'fog-gray' },
        { name: 'Star Silver', hex: '#c0c0c0', productIdSuffix: 'star-silver' }
    ]
};

// Storage options for tablets
const TABLET_STORAGE = {
    'iPad Pro 12.9-inch (6th generation)': ['128GB', '256GB', '512GB', '1TB', '2TB'],
    'iPad Pro 11-inch (4th generation)': ['128GB', '256GB', '512GB', '1TB', '2TB'],
    'iPad Air (5th generation)': ['64GB', '256GB'],
    'iPad (10th generation)': ['64GB', '256GB'],
    'iPad mini (6th generation)': ['64GB', '256GB'],
    'Galaxy Tab S9 Ultra': ['256GB', '512GB', '1TB'],
    'Galaxy Tab S9+': ['128GB', '256GB', '512GB'],
    'Galaxy Tab S9': ['128GB', '256GB'],
    'Galaxy Tab A9+': ['64GB', '128GB'],
    'Galaxy Tab A9': ['32GB', '64GB'],
    'Huawei MatePad Pro 13.2': ['256GB', '512GB', '1TB'],
    'Huawei MatePad 11': ['128GB', '256GB'],
    'Huawei MatePad SE': ['64GB', '128GB'],
    'Lenovo Tab P12': ['128GB', '256GB'],
    'Lenovo Tab P11': ['128GB', '256GB'],
    'Lenovo Tab M10': ['32GB', '64GB'],
    'Microsoft Surface Pro 9': ['128GB', '256GB', '512GB', '1TB'],
    'Microsoft Surface Go 3': ['64GB', '128GB'],
    'Amazon Fire HD 10': ['32GB', '64GB'],
    'Amazon Fire HD 8': ['32GB', '64GB'],
    'Google Pixel Tablet': ['128GB', '256GB'],
    'Xiaomi Pad 6': ['128GB', '256GB'],
    'Xiaomi Pad 5': ['128GB', '256GB'],
    'Realme Pad 2': ['64GB', '128GB'],
    'OPPO Pad Air': ['64GB', '128GB']
};

// Tablet Info Page Class
class TabletInfoPage {
    constructor() {
        this.currentProduct = null;
        this.currentColor = null;
        this.currentStorage = null;
        this.currentPrice = null;
        this.priceHistory = [];
        this.isWishlisted = false;
        this.isInComparison = false;
        
        this.init();
    }

    async init() {
        const productId = this.getProductIdFromUrl();
        if (productId) {
            await this.loadProduct(productId);
        } else {
            // If no product ID, show a sample product for demonstration
            await this.loadProduct('ipad-pro-12');
        }
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    generateMockProduct(productId) {
        // Generate mock product data based on common tablet models
        const mockProducts = {
            'ipad-pro-12': {
                id: 'ipad-pro-12',
                model: 'iPad Pro 12.9-inch (6th generation)',
                brand: 'Apple',
                imageUrl: 'https://via.placeholder.com/400x300/007bff/ffffff?text=iPad+Pro+12.9',
                description: 'The most powerful iPad ever with the M2 chip, 12.9-inch Liquid Retina XDR display, and advanced camera system.',
                offers: [
                    { retailerName: 'Apple Store', price: 12999, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Takealot', price: 12499, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Incredible Connection', price: 12799, url: '#', condition: 'New', availability: 'In Stock' }
                ],
                specs: {
                    Display: {
                        'Screen Size': '12.9 inches',
                        'Resolution': '2732 x 2048 pixels',
                        'Display Type': 'Liquid Retina XDR'
                    },
                    Performance: {
                        'Processor': 'Apple M2 chip',
                        'Storage': '128GB',
                        'Ram': '8GB'
                    },
                    Os: {
                        'Operating System': 'iPadOS 16'
                    },
                    Camera: {
                        'Rear Camera': '12MP Wide, 10MP Ultra Wide',
                        'Front Camera': '12MP Ultra Wide'
                    },
                    Battery: {
                        'Battery Life': 'Up to 10 hours'
                    }
                }
            },
            'galaxy-tab-s9': {
                id: 'galaxy-tab-s9',
                model: 'Galaxy Tab S9',
                brand: 'Samsung',
                imageUrl: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Galaxy+Tab+S9',
                description: 'Premium Android tablet with S Pen, stunning AMOLED display, and powerful performance.',
                offers: [
                    { retailerName: 'Samsung Store', price: 8999, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Takealot', price: 8499, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Incredible Connection', price: 8799, url: '#', condition: 'New', availability: 'In Stock' }
                ],
                specs: {
                    Display: {
                        'Screen Size': '11 inches',
                        'Resolution': '2560 x 1600 pixels',
                        'Display Type': 'Dynamic AMOLED 2X'
                    },
                    Performance: {
                        'Processor': 'Snapdragon 8 Gen 2',
                        'Storage': '128GB',
                        'Ram': '8GB'
                    },
                    Os: {
                        'Operating System': 'Android 13'
                    },
                    Camera: {
                        'Rear Camera': '13MP',
                        'Front Camera': '12MP'
                    },
                    Battery: {
                        'Battery Life': 'Up to 12 hours'
                    }
                }
            },
            'surface-pro-9': {
                id: 'surface-pro-9',
                model: 'Surface Pro 9',
                brand: 'Microsoft',
                imageUrl: 'https://via.placeholder.com/400x300/0078d4/ffffff?text=Surface+Pro+9',
                description: 'The most powerful Surface Pro yet with 12th Gen Intel Core processors and all-day battery life.',
                offers: [
                    { retailerName: 'Microsoft Store', price: 15999, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Takealot', price: 15499, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Incredible Connection', price: 15799, url: '#', condition: 'New', availability: 'In Stock' }
                ],
                specs: {
                    Display: {
                        'Screen Size': '13 inches',
                        'Resolution': '2880 x 1920 pixels',
                        'Display Type': 'PixelSense'
                    },
                    Performance: {
                        'Processor': '12th Gen Intel Core i5',
                        'Storage': '256GB',
                        'Ram': '8GB'
                    },
                    Os: {
                        'Operating System': 'Windows 11'
                    },
                    Camera: {
                        'Rear Camera': '10MP',
                        'Front Camera': '5MP'
                    },
                    Battery: {
                        'Battery Life': 'Up to 15.5 hours'
                    }
                }
            },
            'huawei-matepad': {
                id: 'huawei-matepad',
                model: 'Huawei MatePad Pro 13.2',
                brand: 'Huawei',
                imageUrl: 'https://via.placeholder.com/400x300/ff0000/ffffff?text=MatePad+Pro',
                description: 'Professional tablet with HarmonyOS, large 13.2-inch display, and powerful performance.',
                offers: [
                    { retailerName: 'Huawei Store', price: 11999, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Takealot', price: 11499, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Incredible Connection', price: 11799, url: '#', condition: 'New', availability: 'In Stock' }
                ],
                specs: {
                    Display: {
                        'Screen Size': '13.2 inches',
                        'Resolution': '2880 x 1920 pixels',
                        'Display Type': 'OLED'
                    },
                    Performance: {
                        'Processor': 'Kirin 9000S',
                        'Storage': '256GB',
                        'Ram': '12GB'
                    },
                    Os: {
                        'Operating System': 'HarmonyOS 4.0'
                    },
                    Camera: {
                        'Rear Camera': '13MP',
                        'Front Camera': '8MP'
                    },
                    Battery: {
                        'Battery Life': 'Up to 11 hours'
                    }
                }
            },
            'default': {
                id: productId,
                model: 'iPad Air (5th generation)',
                brand: 'Apple',
                imageUrl: 'https://via.placeholder.com/400x300/007bff/ffffff?text=iPad+Air',
                description: 'Powerful and versatile tablet with the M1 chip, 10.9-inch Liquid Retina display, and all-day battery life.',
                offers: [
                    { retailerName: 'Apple Store', price: 8999, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Takealot', price: 8499, url: '#', condition: 'New', availability: 'In Stock' },
                    { retailerName: 'Incredible Connection', price: 8799, url: '#', condition: 'New', availability: 'In Stock' }
                ],
                specs: {
                    Display: {
                        'Screen Size': '10.9 inches',
                        'Resolution': '2360 x 1640 pixels',
                        'Display Type': 'Liquid Retina'
                    },
                    Performance: {
                        'Processor': 'Apple M1 chip',
                        'Storage': '64GB',
                        'Ram': '8GB'
                    },
                    Os: {
                        'Operating System': 'iPadOS 16'
                    },
                    Camera: {
                        'Rear Camera': '12MP Wide',
                        'Front Camera': '12MP Ultra Wide'
                    },
                    Battery: {
                        'Battery Life': 'Up to 10 hours'
                    }
                }
            }
        };

        return mockProducts[productId] || mockProducts['default'];
    }

    async loadProduct(productId) {
        try {
            this.showLoading();
            
            // Try to fetch from API first
            try {
                const response = await fetch(`https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/tablets/${productId}`);
                if (response.ok) {
                    const product = await response.json();
                    this.currentProduct = product;
            this.displayProduct(product);
            this.loadPriceHistory(productId);
                    return;
                }
            } catch (apiError) {
                console.log('API not available, using mock data:', apiError);
            }
            
            // Fallback to mock data if API is not available
            const mockProduct = this.generateMockProduct(productId);
            this.currentProduct = mockProduct;
            this.displayProduct(mockProduct);
            this.loadPriceHistory(productId);
            
        } catch (error) {
            console.error('Error loading product:', error);
            this.showError('Failed to load tablet information. Please try again later.');
        }
    }

    showLoading() {
        const main = document.querySelector('.main');
        main.innerHTML = `
            <div class="loading-container">
                <div class="modern-loader">
                    <div class="loader-content">
                        <div class="tablet-icon">
                            <i class="fas fa-tablet-alt"></i>
                        </div>
                        <div class="loading-text">
                            <h3>Loading Tablet Details</h3>
                            <p>Please wait while we fetch the latest information...</p>
                        </div>
                        <div class="progress-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="loading-bar">
                            <div class="loading-progress"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showError(message) {
        const main = document.querySelector('.main');
        main.innerHTML = `
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-message">${message}</div>
                <button class="error-retry-btn" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }

    displayProduct(product) {
        const main = document.querySelector('.main');
        main.innerHTML = `
            <div class="tablet-info-container">
                ${this.createProductHeader(product)}
                ${this.createProductMainInfo(product)}
                ${this.createPriceComparison(product)}
                ${this.createProductDescription(product)}
                ${this.createProductSpecifications(product)}
                ${this.createPriceHistory()}
            </div>
        `;

        this.addEventListeners();
        this.updateProductImage();
    }

    createProductHeader(product) {
        return `
            <div class="product-header">
                <div class="product-breadcrumb">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                            <li class="breadcrumb-item"><a href="tablets.html">Tablets</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${product.model || product.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        `;
    }

    createProductMainInfo(product) {
        const colors = TABLET_COLORS[product.model] || [];
        const storageOptions = TABLET_STORAGE[product.model] || [];
        
        return `
            <div class="product-main-info">
                <div class="product-image-section">
                    <img src="${product.imageUrl || product.image || 'https://via.placeholder.com/400?text=No+Image'}" 
                         alt="${product.model || product.title}" 
                         class="product-main-image" 
                         id="productMainImage">
                </div>
                
                <div class="product-details">
                    <h1 class="product-title">${product.model || product.title}</h1>
                    <div class="product-brand">${product.brand || 'Unknown Brand'}</div>
                    
                    ${this.createProductOptions(colors, storageOptions)}
                    ${this.createKeySpecs(product)}
                    ${this.createProductActions()}
                </div>
            </div>
        `;
    }

    createProductOptions(colors, storageOptions) {
        let colorOptionsHtml = '';
        let storageOptionsHtml = '';

        if (colors.length > 0) {
            colorOptionsHtml = `
                <div class="option-group">
                    <h4>Color</h4>
                    <div class="option-buttons" id="colorOptions">
                        ${colors.map((color, index) => `
                            <button class="color-btn ${index === 0 ? 'active' : ''}" 
                                    data-color="${color.name}" 
                                    data-hex="${color.hex}"
                                    data-suffix="${color.productIdSuffix}">
                                <div class="color-indicator" style="background-color: ${color.hex}"></div>
                                <span class="color-name">${color.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (storageOptions.length > 0) {
            storageOptionsHtml = `
                <div class="option-group">
                    <h4>Storage</h4>
                    <div class="option-buttons">
                        ${storageOptions.map((storage, index) => `
                            <button class="option-btn storage-btn ${index === 0 ? 'active' : ''}" 
                                    data-storage="${storage}">
                                ${storage}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return `
            <div class="product-options">
                ${colorOptionsHtml}
                ${storageOptionsHtml}
            </div>
        `;
    }

    createKeySpecs(product) {
        const specs = [];
        
        if (product.specs?.Display?.['Screen Size']) {
            specs.push({
                icon: 'fas fa-tv',
                label: 'Screen Size',
                value: product.specs.Display['Screen Size']
            });
        }
        
        if (product.specs?.Performance?.Storage) {
            specs.push({
                icon: 'fas fa-hdd',
                label: 'Storage',
                value: product.specs.Performance.Storage
            });
        }
        
        if (product.specs?.Performance?.Ram) {
            specs.push({
                icon: 'fas fa-memory',
                label: 'RAM',
                value: product.specs.Performance.Ram
            });
        }
        
        if (product.specs?.Os?.['Operating System']) {
            specs.push({
                icon: 'fas fa-mobile-alt',
                label: 'OS',
                value: product.specs.Os['Operating System']
            });
        }

        if (specs.length === 0) return '';

        return `
            <div class="key-specs">
                <h4>Key Specifications</h4>
                <div class="key-specs-grid">
                    ${specs.map(spec => `
                        <div class="key-spec-item">
                            <div class="key-spec-icon">
                                <i class="${spec.icon}"></i>
                            </div>
                            <div class="key-spec-content">
                                <div class="key-spec-label">${spec.label}</div>
                                <div class="key-spec-value">${spec.value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createProductActions() {
        return `
            <div class="product-actions">
                <button class="action-btn wishlist-btn" id="wishlistBtn">
                    <i class="fas fa-heart"></i>
                    <span>Add to Wishlist</span>
                </button>
                <button class="action-btn compare-btn" id="compareBtn">
                    <i class="fas fa-balance-scale"></i>
                    <span>Compare</span>
                </button>
            </div>
        `;
    }

    createPriceComparison(product) {
        if (!product.offers || product.offers.length === 0) {
            return '<div class="price-comparison"><h3><i class="fas fa-tag"></i> Price Comparison</h3><p>No pricing information available at this time.</p></div>';
        }

        const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
        const bestPrice = sortedOffers[0];

        return `
            <div class="price-comparison">
                <h3><i class="fas fa-tag"></i> Price Comparison</h3>
                <div class="price-list">
                    ${sortedOffers.map((offer, index) => `
                        <div class="price-item ${index === 0 ? 'best-price' : ''}">
                            <div class="price-item-info">
                                <img src="${offer.retailerLogo || 'https://via.placeholder.com/40?text=Store'}" 
                                     alt="${offer.retailerName}" 
                                     class="price-item-logo">
                                <div class="price-item-details">
                                    <h5>${offer.retailerName}</h5>
                                    <p>${offer.condition || 'New'} • ${offer.availability || 'In Stock'}</p>
                                </div>
                            </div>
                            <div class="price-item-price">
                                <div class="price">R${offer.price?.toLocaleString() || 'N/A'}</div>
                                ${offer.originalPrice && offer.originalPrice > offer.price ? 
                                    `<div class="original-price">R${offer.originalPrice.toLocaleString()}</div>` : ''}
                            </div>
                            <div class="price-item-actions">
                                <a href="${offer.url || '#'}" 
                                   class="btn-visit-store" 
                                   target="_blank" 
                                   rel="noopener noreferrer">
                                    <i class="fas fa-external-link-alt"></i>
                                    Visit Store
                                </a>
                                <button class="btn-price-alert" 
                                        data-retailer="${offer.retailerName}"
                                        data-price="${offer.price}">
                                    <i class="fas fa-bell"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createProductDescription(product) {
        const description = product.description || 
            `The ${product.model || product.title} is a powerful tablet that combines cutting-edge technology with elegant design. Perfect for productivity, entertainment, and creativity.`;

        return `
            <div class="product-description">
                <h3><i class="fas fa-info-circle"></i> Product Description</h3>
                <p>${description}</p>
                <ul>
                    <li>High-resolution display for crisp visuals</li>
                    <li>Powerful processor for smooth performance</li>
                    <li>Long-lasting battery life</li>
                    <li>Premium build quality</li>
                    <li>Latest operating system</li>
                </ul>
            </div>
        `;
    }

    createProductSpecifications(product) {
        if (!product.specs) {
            return '<div class="product-specifications"><h3><i class="fas fa-cogs"></i> Specifications</h3><p>No specifications available.</p></div>';
        }

        let specsHtml = '';

        Object.entries(product.specs).forEach(([category, specs]) => {
            specsHtml += `
                <div class="spec-category-header">
                    <h4>${category}</h4>
                </div>
            `;

            Object.entries(specs).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    specsHtml += `
                        <div class="spec-item spec-item-array">
                            <div class="spec-label-array">${key}</div>
                            <div class="spec-value-array">
                                <ul class="feature-list">
                                    ${value.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                } else {
                    specsHtml += `
                        <div class="spec-item">
                            <div class="spec-label">${key}</div>
                            <div class="spec-value">${value}</div>
                        </div>
                    `;
                }
            });
        });

        return `
            <div class="product-specifications">
                <h3><i class="fas fa-cogs"></i> Specifications</h3>
                <div class="specs-list">
                    ${specsHtml}
                </div>
            </div>
        `;
    }

    createPriceHistory() {
        return `
            <div class="price-history">
                <h3><i class="fas fa-chart-line"></i> Price History</h3>
                <div class="price-history-header">
                    <div class="time-filter-buttons">
                        <button class="time-filter-btn active" data-period="3m">3M</button>
                        <button class="time-filter-btn" data-period="6m">6M</button>
                        <button class="time-filter-btn" data-period="1y">1Y</button>
                        <button class="time-filter-btn" data-period="all">All</button>
                    </div>
                </div>
                <div class="price-chart-container">
                    <div class="price-chart-wrapper">
                        <div class="bar-chart-container" id="priceChart">
                            <!-- Chart will be rendered here -->
                        </div>
                    </div>
                    <div class="price-legend">
                        <div class="legend-title">Price Range</div>
                        <div class="legend-items">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #28a745;"></div>
                                <span>Lowest</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #007bff;"></div>
                                <span>Current</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #dc3545;"></div>
                                <span>Highest</span>
                            </div>
                        </div>
                    </div>
                    <div class="price-summary">
                        <div class="price-stats">
                            <div class="stat-item">
                                <span class="stat-label">Current Price</span>
                                <span class="stat-value current" id="currentPrice">R0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Lowest Price</span>
                                <span class="stat-value low" id="lowestPrice">R0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Highest Price</span>
                                <span class="stat-value high" id="highestPrice">R0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    addEventListeners() {
        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.color-btn').classList.add('active');
                this.currentColor = e.target.closest('.color-btn').dataset.color;
                this.updateProductImage();
            });
        });

        // Storage selection
        document.querySelectorAll('.storage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.storage-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.storage-btn').classList.add('active');
                this.currentStorage = e.target.closest('.storage-btn').dataset.storage;
            });
        });

        // Wishlist button
        document.getElementById('wishlistBtn')?.addEventListener('click', () => {
            this.toggleWishlist();
        });

        // Compare button
        document.getElementById('compareBtn')?.addEventListener('click', () => {
            this.toggleComparison();
        });

        // Price alert buttons
        document.querySelectorAll('.btn-price-alert').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.togglePriceAlert(e.target.closest('.btn-price-alert'));
            });
        });

        // Time filter buttons
        document.querySelectorAll('.time-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updatePriceChart(e.target.dataset.period);
            });
        });
    }

    updateProductImage() {
        const mainImage = document.getElementById('productMainImage');
        if (!mainImage || !this.currentProduct) return;

        const selectedColor = document.querySelector('.color-btn.active');
        if (selectedColor) {
            const colorSuffix = selectedColor.dataset.suffix;
            const baseImageUrl = this.currentProduct.imageUrl || this.currentProduct.image;
            
            // Update image based on selected color
            // This is a simplified example - in reality, you'd have different images for each color
            mainImage.src = baseImageUrl;
            mainImage.alt = `${this.currentProduct.model} - ${selectedColor.dataset.color}`;
        }
    }

    toggleWishlist() {
        const btn = document.getElementById('wishlistBtn');
        this.isWishlisted = !this.isWishlisted;
        
        if (this.isWishlisted) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i><span>In Wishlist</span>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-heart"></i><span>Add to Wishlist</span>';
        }
    }

    toggleComparison() {
        const btn = document.getElementById('compareBtn');
        this.isInComparison = !this.isInComparison;
        
        if (this.isInComparison) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-balance-scale"></i><span>In Comparison</span>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-balance-scale"></i><span>Compare</span>';
        }
    }

    togglePriceAlert(btn) {
        btn.classList.toggle('active');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            btn.innerHTML = '<i class="fas fa-bell"></i>';
            btn.title = 'Price alert active';
        } else {
            btn.innerHTML = '<i class="fas fa-bell"></i>';
            btn.title = 'Set price alert';
        }
    }

    async loadPriceHistory(productId) {
        try {
            // Simulate price history data
            const mockPriceHistory = this.generateMockPriceHistory();
            this.priceHistory = mockPriceHistory;
            this.renderPriceChart('3m');
            this.updatePriceStats();
        } catch (error) {
            console.error('Error loading price history:', error);
        }
    }

    generateMockPriceHistory() {
        const history = [];
        const basePrice = this.currentProduct?.offers?.[0]?.price || 10000;
        const today = new Date();
        
        for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
            const price = Math.round(basePrice * (1 + variation));
            
            history.push({
                date: date.toISOString().split('T')[0],
                price: price
            });
        }
        
        return history;
    }

    renderPriceChart(period = '3m') {
        const chartContainer = document.getElementById('priceChart');
        if (!chartContainer) return;

        let filteredHistory = [...this.priceHistory];
        
        // Filter by period
        const today = new Date();
        const cutoffDate = new Date();
        
        switch (period) {
            case '3m':
                cutoffDate.setMonth(today.getMonth() - 3);
                break;
            case '6m':
                cutoffDate.setMonth(today.getMonth() - 6);
                break;
            case '1y':
                cutoffDate.setFullYear(today.getFullYear() - 1);
                break;
            case 'all':
            default:
                // No filtering
                break;
        }
        
        if (period !== 'all') {
            filteredHistory = filteredHistory.filter(item => new Date(item.date) >= cutoffDate);
        }

        // Sample data for display (show every 7th point for readability)
        const sampledData = filteredHistory.filter((_, index) => index % 7 === 0);
        
        chartContainer.innerHTML = '';
        
        const maxPrice = Math.max(...sampledData.map(d => d.price));
        const minPrice = Math.min(...sampledData.map(d => d.price));
        const priceRange = maxPrice - minPrice;
        
        sampledData.forEach((dataPoint, index) => {
            const barHeight = ((dataPoint.price - minPrice) / priceRange) * 200 + 20;
            const barColor = dataPoint.price === minPrice ? '#28a745' : 
                           dataPoint.price === maxPrice ? '#dc3545' : '#007bff';
            
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            barContainer.style.left = `${(index / (sampledData.length - 1)) * 90}%`;
            
            const bar = document.createElement('div');
            bar.className = 'price-bar';
            bar.style.height = `${barHeight}px`;
            bar.style.setProperty('--bar-color', barColor);
            
            const priceLabel = document.createElement('div');
            priceLabel.className = 'bar-price-label';
            priceLabel.textContent = `R${dataPoint.price.toLocaleString()}`;
            priceLabel.style.bottom = `${barHeight + 10}px`;
            
            const dateLabel = document.createElement('div');
            dateLabel.className = 'bar-date-label';
            dateLabel.textContent = new Date(dataPoint.date).toLocaleDateString('en-ZA', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            barContainer.appendChild(bar);
            barContainer.appendChild(priceLabel);
            barContainer.appendChild(dateLabel);
            chartContainer.appendChild(barContainer);
        });
    }

    updatePriceChart(period) {
        this.renderPriceChart(period);
    }

    updatePriceStats() {
        if (this.priceHistory.length === 0) return;
        
        const prices = this.priceHistory.map(h => h.price);
        const currentPrice = this.currentProduct?.offers?.[0]?.price || prices[prices.length - 1];
        const lowestPrice = Math.min(...prices);
        const highestPrice = Math.max(...prices);
        
        document.getElementById('currentPrice').textContent = `R${currentPrice.toLocaleString()}`;
        document.getElementById('lowestPrice').textContent = `R${lowestPrice.toLocaleString()}`;
        document.getElementById('highestPrice').textContent = `R${highestPrice.toLocaleString()}`;
    }

}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabletInfoPage();
});
