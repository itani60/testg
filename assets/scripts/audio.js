// Unified Audio JavaScript - Handles different audio categories

// API URLs for different audio types
const AUDIO_APIS = {
    'earbuds': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/earbuds',
    'soundbars': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/soundbars',
    'portable-speakers': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/portable-speakers',
    'bluetooth-speakers': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/bluetooth-speakers',
    'headphones': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/headphones',
    'hifi-systems': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/hifi-systems'
};

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 14;
let currentAudioType = 'earbuds'; // Default

// Predefined brands for each audio category
const AUDIO_BRANDS = {
    'earbuds': ['Apple', 'Huawei', 'JBL', 'Volkano', 'Samsung', 'Oppo', 'Xiaomi', 'Soundcore', 'Sony', 'Lenovo'],
    'soundbars': ['Samsung', 'JBL', 'Hisense', 'Skyworth', 'LG', 'JVC', 'Volkano', 'Sony', 'TCL', 'Creative'],
    'portable-speakers': ['JBL', 'Bose', 'Sony', 'Ultimate Ears', 'Anker', 'Marshall'],
    'bluetooth-speakers': ['JBL', 'Volkano', 'Apple', 'Soundcore', 'Orion'],
    'headphones': ['Sony', 'Volkano', 'JBL', 'Bose', 'Beats', 'Soundcore', 'Sennheiser'],
    'hifi-systems': ['Sony', 'Yamaha', 'Denon', 'Marantz', 'Pioneer', 'Onkyo', 'Cambridge Audio']
};

// Predefined categories for each audio category
const AUDIO_CATEGORIES = {
    'headphones': [
        'Wired',
        'Wireless'
    ]
};

// Brand name variations mapping for better matching
const BRAND_VARIATIONS = {
    'apple': ['apple', 'apple inc', 'apple computer'],
    'huawei': ['huawei', 'huawei technologies'],
    'jbl': ['jbl', 'jbl audio', 'harman'],
    'volkano': ['volkano', 'volkano audio'],
    'samsung': ['samsung', 'samsung electronics'],
    'oppo': ['oppo', 'oppo digital'],
    'xiaomi': ['xiaomi', 'mi', 'xiaomi inc'],
    'soundcore': ['soundcore', 'anker soundcore', 'anker'],
    'sony': ['sony', 'sony corporation'],
    'lenovo': ['lenovo', 'lenovo group'],
    'orion': ['orion', 'orion audio'],
    'bose': ['bose', 'bose corporation'],
    'beats': ['beats', 'beats by dre', 'beats electronics'],
    'sennheiser': ['sennheiser', 'sennheiser electronic'],
    'jabra': ['jabra', 'jabra communications'],
    'hisense': ['hisense', 'hisense international'],
    'skyworth': ['skyworth', 'skyworth digital'],
    'lg': ['lg', 'lg electronics', 'goldstar'],
    'jvc': ['jvc', 'jvc kenwood', 'victor company'],
    'tcl': ['tcl', 'tcl electronics'],
    'creative': ['creative', 'creative technology', 'creative labs'],
    'yamaha': ['yamaha', 'yamaha corporation'],
    'vizio': ['vizio', 'vizio inc'],
    'ultimate ears': ['ultimate ears', 'ue', 'logitech'],
    'anker': ['anker', 'anker innovations'],
    'marshall': ['marshall', 'marshall amplification'],
    'harman kardon': ['harman kardon', 'harman', 'kardon'],
    'audio-technica': ['audio-technica', 'audio technica', 'at'],
    'beyerdynamic': ['beyerdynamic', 'beyerdynamic gmbh'],
    'akg': ['akg', 'akg acoustics'],
    'philips': ['philips', 'philips electronics'],
    'denon': ['denon', 'denon electronics'],
    'marantz': ['marantz', 'marantz japan'],
    'pioneer': ['pioneer', 'pioneer corporation'],
    'onkyo': ['onkyo', 'onkyo corporation'],
    'cambridge audio': ['cambridge audio', 'cambridge']
};

// Function to normalize brand names for better matching
function normalizeBrandName(brandName) {
    if (!brandName) return '';

    const normalized = brandName.toLowerCase().trim();

    // Check if the brand matches any known variations
    for (const [canonicalBrand, variations] of Object.entries(BRAND_VARIATIONS)) {
        if (variations.some(variation => normalized.includes(variation) || variation.includes(normalized))) {
            return canonicalBrand;
        }
    }

    // Remove common suffixes and prefixes
    let cleaned = normalized
        .replace(/\s+(inc|corp|corporation|ltd|limited|co|company|electronics|computer|international|audio|acoustics)\.?\s*$/gi, '')
        .replace(/^(apple)/gi, 'apple')
        .replace(/^(samsung)/gi, 'samsung')
        .replace(/^(sony)/gi, 'sony');

    return cleaned;
}

// DOM elements
const productsGrid = document.getElementById('audioProductsGrid');
const paginationContainer = document.getElementById('pagination');
const sortBySelect = document.getElementById('audioSortSelect');
const audioCategoryTitle = document.getElementById('audioCategoryTitle');
const audioBrandGrid = document.getElementById('audioBrandGrid');
const connectivityFilter = document.getElementById('connectivityFilter');
const featuresFilter = document.getElementById('featuresFilter');
const categoriesFilter = document.getElementById('categoriesFilter');
const categoriesGrid = document.getElementById('categoriesGrid');

// Function to determine audio type from URL
function determineAudioType() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || urlParams.get('type');

    console.log('URL parameters:', window.location.search);
    console.log('Category/Type parameter:', categoryParam);

    if (categoryParam) {
        const category = categoryParam.toLowerCase().replace(/[-\s_]/g, '');
        console.log('Normalized category:', category);
        
        // Check for unified mode
        if (category === 'all' || category === 'allproducts') {
            console.log('Unified mode requested - showing all audio categories');
            return 'all';
        }
        
        // Map URL parameters to internal type names
        const categoryMappings = {
            'earbuds': 'earbuds',
            'earbud': 'earbuds',
            'truewireless': 'earbuds',
            'soundbars': 'soundbars',
            'soundbar': 'soundbars',
            'portablespeakers': 'portable-speakers',
            'portablespeaker': 'portable-speakers',
            'portable': 'portable-speakers',
            'bluetoothspeakers': 'bluetooth-speakers',
            'bluetoothspeaker': 'bluetooth-speakers',
            'bluetooth': 'bluetooth-speakers',
            'headphones': 'headphones',
            'headphone': 'headphones',
            'overear': 'headphones',
            'onear': 'headphones',
            'hifisystems': 'hifi-systems',
            'hifisystem': 'hifi-systems',
            'hifi': 'hifi-systems',
            'stereo': 'hifi-systems'
        };
        const mapped = categoryMappings[category];
        console.log('Mapped to:', mapped);
        return mapped || 'earbuds';
    }

    // Default fallback - show all categories (unified mode)
    console.log('No specific category found, defaulting to unified mode (all categories)');
    return 'all';
}

// Function to get API URL based on audio type
function getAPIUrl(audioType) {
    if (audioType === 'all') {
        // Return all API URLs for unified mode
        return Object.values(AUDIO_APIS);
    }
    return AUDIO_APIS[audioType] || AUDIO_APIS['earbuds'];
}

// Function to get display name for audio type
function getAudioTypeDisplayName() {
    const displayNames = {
        'all': 'All Audio Products',
        'earbuds': 'Earbuds',
        'soundbars': 'Soundbars',
        'portable-speakers': 'Portable Speakers',
        'bluetooth-speakers': 'Bluetooth Speakers',
        'headphones': 'Headphones',
        'hifi-systems': 'Hi-fi Systems'
    };
    return displayNames[currentAudioType] || 'Audio Products';
}

// Function to get display name for product category (for badges)
function getCategoryDisplayName(category) {
    const displayNames = {
        'earbuds': 'Earbuds',
        'soundbars': 'Soundbar',
        'portable-speakers': 'Portable Speaker',
        'bluetooth-speakers': 'Bluetooth Speaker',
        'headphones': 'Headphones',
        'hifi-systems': 'Hi-fi System'
    };
    return displayNames[category] || 'Audio';
}

// Function to update page title dynamically
function updatePageTitle() {
    const displayName = getAudioTypeDisplayName();
    document.title = `${displayName} - Compare Hub Prices`;

    // Update section title if exists
    const sectionTitle = document.getElementById('audioTitle') || document.getElementById('section-title') || document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = displayName;
        console.log('Updated page title to:', displayName);
    } else {
        console.log('Section title element not found');
    }

    // Update category title
    if (audioCategoryTitle) {
        audioCategoryTitle.textContent = displayName;
    }
}

// Function to fetch products from API
async function fetchProducts(audioType) {
    try {
        showLoading();
        
        const apiUrls = getAPIUrl(audioType);
        console.log('Fetching from URLs:', apiUrls);
        
        let allFetchedProducts = [];
        
        if (Array.isArray(apiUrls)) {
            // Multiple APIs (unified mode)
            const promises = apiUrls.map(url => fetch(url).then(response => response.json()));
            const results = await Promise.all(promises);
            
            results.forEach((data, index) => {
                if (data && data.products) {
                    const categoryKey = Object.keys(AUDIO_APIS)[index];
                    const normalizedProducts = data.products.map(product => normalizeProductData(product, categoryKey));
                    allFetchedProducts = allFetchedProducts.concat(normalizedProducts);
                }
            });
        } else {
            // Single API
            try {
                const response = await fetch(apiUrls);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Response:', data);
                
                // Handle different response formats
                if (Array.isArray(data)) {
                    // Direct array response
                    allFetchedProducts = data.map(product => normalizeProductData(product, audioType));
                } else if (data && data.products && Array.isArray(data.products)) {
                    // Response with products property
                    allFetchedProducts = data.products.map(product => normalizeProductData(product, audioType));
                } else if (data && data.data && Array.isArray(data.data)) {
                    // Response with data property
                    allFetchedProducts = data.data.map(product => normalizeProductData(product, audioType));
                } else if (data && typeof data === 'object') {
                    // Single product object
                    allFetchedProducts = [normalizeProductData(data, audioType)];
                } else {
                    console.warn('Unexpected API response format:', data);
                    allFetchedProducts = [];
                }
            } catch (fetchError) {
                console.warn('API fetch failed:', fetchError.message);
                // No fallback data available
                allFetchedProducts = [];
            }
        }
        
        console.log('Fetched products:', allFetchedProducts.length);
        return allFetchedProducts;
        
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('No fallback data available');
        return [];
    }
}


// Function to normalize product data
function normalizeProductData(product, category) {
    console.log('Normalizing product:', product);
    
    // Extract price from offers array if available
    let price = 0;
    let originalPrice = 0;
    let retailers = 0;
    
    if (product.offers && Array.isArray(product.offers) && product.offers.length > 0) {
        retailers = product.offers.length;
        // Get the lowest price from offers
        const prices = product.offers.map(offer => offer.price).filter(p => p && !isNaN(p));
        if (prices.length > 0) {
            price = Math.min(...prices);
        }
        // Get the highest original price from offers
        const originalPrices = product.offers.map(offer => offer.originalPrice).filter(p => p && !isNaN(p));
        if (originalPrices.length > 0) {
            originalPrice = Math.max(...originalPrices);
        }
    } else if (product.price) {
        price = parseFloat(product.price) || 0;
        originalPrice = parseFloat(product.originalPrice) || price;
        retailers = 1;
    }
    
    return {
        id: product.product_id || product.id || Math.random().toString(36).substr(2, 9),
        name: product.model || product.name || product.title || 'Unknown Product',
        brand: product.brand || extractBrandFromName(product.model || product.name || product.title),
        price: price,
        originalPrice: originalPrice,
        image: product.imageUrl || product.image || 'assets/images/placeholder.jpg',
        category: product.category || category,
        retailers: retailers,
        url: product.url || '#',
        description: product.description || '',
        specifications: product.specs || product.specifications || {},
        offers: product.offers || [],
        product_id: product.product_id || product.id || Math.random().toString(36).substr(2, 9) // Keep original for reference
    };
}

// Function to extract brand from product name
function extractBrandFromName(name) {
    if (!name) return 'Unknown';
    
    const normalizedName = name.toLowerCase();
    
    for (const [brand, variations] of Object.entries(BRAND_VARIATIONS)) {
        if (variations.some(variation => normalizedName.includes(variation))) {
            return brand.charAt(0).toUpperCase() + brand.slice(1);
        }
    }
    
    return 'Unknown';
}

        // Function to show loading state
        function showLoading() {
            if (productsGrid) {
                productsGrid.innerHTML = `
                    <div class="loading-spinner">
                        <div class="modern-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                        <p>Loading audio products...</p>
                    </div>
                `;
            }
        }

// Function to hide loading state
function hideLoading() {
    // Loading will be hidden when products are displayed
}

// Function to display products
function displayProducts(products) {
    if (!productsGrid) return;
    
    hideLoading();
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No audio products found</p>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    // Display products
    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    
    // Setup pagination
    setupPagination(totalPages);
}

// Function to create product card HTML (using smartphones.js structure)
function createProductCard(product) {
    const formattedPrice = product.price ? product.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Price not available';
    const imageUrl = product.image || 'https://via.placeholder.com/150?text=No+Image';
    const productName = product.name || 'Unknown Product';
    const brandName = product.brand || 'Unknown Brand';
    const productCategory = product.category || currentAudioType;

    // Get retailer count
    const retailerCount = product.retailers || 0;

    return `
        <div class="smartphone-card">
            <a href="audio-info.html?category=${productCategory}" class="card-link">
                <div class="card-image-container">
                    <img src="${imageUrl}" alt="${productName}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                    <button class="price-alert-bell" data-product-id="${product.id}" title="Set Price Alert">
                        <i class="fas fa-bell"></i>
                    </button>
                </div>
                <div class="card-content">
                    <span class="brand-badge">${brandName}</span>
                    <h3 class="product-name">${productName}</h3>
                    <div class="product-price">
                        <span class="current-price">${formattedPrice}</span>
                    </div>
                    <div class="retailer-info">
                        <span>${retailerCount} retailers</span>
                    </div>
                </div>
            </a>
            <div class="card-actions">
                <button class="btn-compare" data-category="${productCategory}">View</button>
                <button class="btn-wishlist" data-category="${productCategory}">Add to Wishlist</button>
            </div>
        </div>
    `;
}

// Function to setup pagination
function setupPagination(totalPages) {
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-nav" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-nav" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Function to change page
function changePage(page) {
    if (page < 1 || page > Math.ceil(filteredProducts.length / productsPerPage)) return;
    
    currentPage = page;
    displayProducts(filteredProducts);
    
    // Scroll to top of products
    if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'brand':
            return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        default:
            return sorted;
    }
}

// Function to apply filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Brand filter
    const activeBrands = Array.from(document.querySelectorAll('.brand-option.active'))
        .map(btn => btn.dataset.brand);
    
    if (activeBrands.length > 0) {
        // Check if "All" is selected
        if (activeBrands.includes('all')) {
            // If "All" is selected, don't filter by brand
        } else {
            // Filter by specific brands
            filtered = filtered.filter(product => 
                activeBrands.some(brand => 
                    normalizeBrandName(product.brand) === normalizeBrandName(brand)
                )
            );
        }
    }
    
    // Connectivity filter (for wireless audio products, excluding earbuds and bluetooth-speakers)
    const activeConnectivity = Array.from(document.querySelectorAll('.connectivity-option.active'))
        .map(btn => btn.dataset.connectivity);
    
    if (activeConnectivity.length > 0 && currentAudioType !== 'earbuds' && currentAudioType !== 'bluetooth-speakers') {
        filtered = filtered.filter(product => {
            return activeConnectivity.some(connectivity => {
                if (connectivity === 'all') return true;
                // Extract connectivity from product name or specifications
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                return productText.includes(connectivity.toLowerCase());
            });
        });
    }
    
    // Features filter (excluding bluetooth-speakers and headphones)
    const activeFeatures = Array.from(document.querySelectorAll('.feature-option.active'))
        .map(btn => btn.dataset.feature);
    
    if (activeFeatures.length > 0 && currentAudioType !== 'bluetooth-speakers' && currentAudioType !== 'headphones') {
        filtered = filtered.filter(product => {
            return activeFeatures.some(feature => {
                if (feature === 'all') return true;
                
                // Special handling for power output features (mainly for soundbars)
                if (feature === 'up-to-69w') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for power output up to 69W
                    return productText.includes('69w') || 
                           productText.includes('69 w') ||
                           productText.includes('up to 69') ||
                           (productText.match(/\d+w/) && parseInt(productText.match(/\d+w/)[0]) <= 69);
                }
                
                if (feature === '70-to-134w') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for power output between 70W and 134W
                    const powerMatch = productText.match(/(\d+)w/);
                    if (powerMatch) {
                        const power = parseInt(powerMatch[1]);
                        return power >= 70 && power <= 134;
                    }
                    return productText.includes('70w') || productText.includes('134w') || 
                           productText.includes('70 w') || productText.includes('134 w');
                }
                
                if (feature === '135-to-199w') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for power output between 135W and 199W
                    const powerMatch = productText.match(/(\d+)w/);
                    if (powerMatch) {
                        const power = parseInt(powerMatch[1]);
                        return power >= 135 && power <= 199;
                    }
                    return productText.includes('135w') || productText.includes('199w') || 
                           productText.includes('135 w') || productText.includes('199 w');
                }
                
                if (feature === '200w-and-above') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for power output 200W and above
                    const powerMatch = productText.match(/(\d+)w/);
                    if (powerMatch) {
                        const power = parseInt(powerMatch[1]);
                        return power >= 200;
                    }
                    return productText.includes('200w') || productText.includes('200 w') ||
                           productText.includes('above 200') || productText.includes('200+');
                }
                
                // Fallback for other features
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                const featureText = feature.toLowerCase().replace('-', ' ');
                return productText.includes(featureText);
            });
        });
    }
    
    // Categories filter (for headphones only, removed earbuds)
    const activeCategories = Array.from(document.querySelectorAll('.category-option.active'))
        .map(btn => btn.dataset.category);
    
    if (activeCategories.length > 0 && currentAudioType === 'headphones') {
        filtered = filtered.filter(product => {
            return activeCategories.some(category => {
                if (category === 'all') return true;
                
                // Special handling for Wired/Wireless categories
                if (category === 'Wired') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for wired indicators
                    return productText.includes('wired') || 
                           productText.includes('cable') || 
                           productText.includes('cord') ||
                           (!productText.includes('wireless') && !productText.includes('bluetooth'));
                }
                
                if (category === 'Wireless') {
                    const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                    // Look for wireless indicators
                    return productText.includes('wireless') || 
                           productText.includes('bluetooth') || 
                           productText.includes('wi-fi') ||
                           productText.includes('wifi');
                }
                
                // Fallback for other categories
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                const categoryText = category.toLowerCase().replace('-', ' ').replace('and', '&');
                return productText.includes(categoryText);
            });
        });
    }
    
    // Price range filter
    const activePriceRanges = Array.from(document.querySelectorAll('.price-option.active'))
        .map(btn => btn.dataset.price);
    
    if (activePriceRanges.length > 0) {
        filtered = filtered.filter(product => {
            return activePriceRanges.some(range => {
                const [min, max] = range.split('-').map(Number);
                return product.price >= min && product.price <= max;
            });
        });
    }
    
    // Sort
    const sortBy = sortBySelect ? sortBySelect.value : '';
    filtered = sortProducts(filtered, sortBy);
    
    filteredProducts = filtered;
    currentPage = 1;
    displayProducts(filteredProducts);
}

// Function to reset filters
function resetFilters() {
    if (sortBySelect) sortBySelect.value = 'relevance';
    
    // Reset brand filters
    document.querySelectorAll('.brand-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset connectivity filters
    document.querySelectorAll('.connectivity-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset features filters
    document.querySelectorAll('.feature-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset categories filters
    document.querySelectorAll('.category-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset price filters
    document.querySelectorAll('.price-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    applyFilters();
}

// Function to update brand filters
function updateBrandFilters() {
    if (!audioBrandGrid) return;
    
    const brands = AUDIO_BRANDS[currentAudioType] || [];
    
    // Add "All" option at the beginning
    audioBrandGrid.innerHTML = `
        <button class="brand-option" data-brand="all">All</button>
        ${brands.map(brand => `
            <button class="brand-option" data-brand="${brand.toLowerCase()}">${brand}</button>
        `).join('')}
    `;
    
    // Add event listeners to brand buttons
    audioBrandGrid.querySelectorAll('.brand-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update categories filters
function updateCategoriesFilters() {
    if (!categoriesGrid) return;
    
    const categories = AUDIO_CATEGORIES[currentAudioType] || [];
    
    if (categories.length > 0) {
        // Add "All" option at the beginning
        categoriesGrid.innerHTML = `
            <button class="category-option" data-category="all">All Categories</button>
            ${categories.map(category => `
                <button class="category-option" data-category="${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}">${category}</button>
            `).join('')}
        `;
        
        // Add event listeners to category buttons
        categoriesGrid.querySelectorAll('.category-option').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    } else {
        categoriesGrid.innerHTML = '';
    }
}

// Function to update filter visibility based on category
function updateFilterVisibility() {
    // Connectivity filter - for wireless audio products (excluding earbuds and bluetooth-speakers)
    if (connectivityFilter) {
        if (currentAudioType === 'portable-speakers') {
            connectivityFilter.style.display = 'flex';
        } else {
            connectivityFilter.style.display = 'none';
        }
    }
    
    // Features filter - for all audio products (excluding bluetooth-speakers and headphones)
    if (featuresFilter) {
        if (currentAudioType !== 'bluetooth-speakers' && currentAudioType !== 'headphones') {
            featuresFilter.style.display = 'flex';
        } else {
            featuresFilter.style.display = 'none';
        }
    }
    
    // Categories filter - for headphones only (removed earbuds)
    if (categoriesFilter) {
        if (currentAudioType === 'headphones') {
            categoriesFilter.style.display = 'flex';
        } else {
            categoriesFilter.style.display = 'none';
        }
    }
}

// Function to load category
async function loadCategory(category) {
    currentAudioType = category;
    currentPage = 1;
    
    // Update page title
    updatePageTitle();
    
    // Update brand filters
    updateBrandFilters();
    
    // Update categories filters
    updateCategoriesFilters();
    
    // Update filter visibility
    updateFilterVisibility();
    
    // Fetch and display products
    allProducts = await fetchProducts(category);
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
}

// Function to compare product
function compareProduct(productId) {
    console.log('Compare product:', productId);
    // Add comparison logic here
}

// Function to add to wishlist
function addToWishlist(productId) {
    console.log('Add to wishlist:', productId);
    // Add wishlist logic here
}

// Initialize audio page
function initializeAudioPage() {
    console.log('Initializing audio page...');
    
    // Determine audio type from URL
    const audioType = determineAudioType();
    console.log('Determined audio type:', audioType);
    
    // Load initial category
    loadCategory(audioType);
    
    // Add event listeners
    if (sortBySelect) {
        sortBySelect.addEventListener('change', applyFilters);
    }
    
    // Filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const optionsDiv = document.getElementById(filterType + 'Options');
            
            if (optionsDiv) {
                // Close all other filter options
                document.querySelectorAll('.filter-options').forEach(div => {
                    if (div !== optionsDiv) {
                        div.style.display = 'none';
                    }
                });
                
                // Toggle current filter options
                optionsDiv.style.display = optionsDiv.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
    
    // Apply/Cancel button event listeners
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const optionsDiv = document.getElementById(filterType + 'Options');
            if (optionsDiv) {
                optionsDiv.style.display = 'none';
            }
            applyFilters();
        });
    });
    
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const optionsDiv = document.getElementById(filterType + 'Options');
            if (optionsDiv) {
                optionsDiv.style.display = 'none';
            }
        });
    });
    
    // Add event listeners for product card buttons (using event delegation)
    document.addEventListener('click', function(e) {
        // Handle price alert bell clicks
        if (e.target.closest('.price-alert-bell')) {
            e.preventDefault();
            e.stopPropagation();
            const bell = e.target.closest('.price-alert-bell');
            const productId = bell.dataset.productId;
            console.log('Price alert clicked for product ID:', productId);
            
            // Get the product data
            const product = allProducts.find(p => p.id === productId);
            if (product && window.priceAlertModal) {
                window.priceAlertModal.show(product);
            } else {
                console.log('Product not found or modal not available');
            }
        }
        
        // Handle compare button clicks
        if (e.target.closest('.btn-compare')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.closest('.btn-compare');
            const category = button.dataset.category;
            console.log('Compare clicked for category:', category);
            window.location.href = `audio-info.html?category=${category}`;
        }
        
        // Handle wishlist button clicks
        if (e.target.closest('.btn-wishlist')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.closest('.btn-wishlist');
            const category = button.dataset.category;
            console.log('Wishlist clicked for category:', category);
            // Add wishlist functionality here if needed
        }
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPage();
});
