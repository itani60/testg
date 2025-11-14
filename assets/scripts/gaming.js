// Unified Gaming JavaScript - Handles different gaming categories

// API URLs for different gaming types
const GAMING_APIS = {
    'gaming-consoles': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/console-gaming',
    'laptop-gaming': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/laptop-gaming',
    'gaming-monitors': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/gaming-monitors',
    'consoles-accessories': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/consoles-cccessories',
    'pc-gaming-accessories': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/pc-gaming-acessorrries',
    'handled-gaming': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/handled-gaming'
};

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 14;
let currentGamingType = 'gaming-consoles'; // Default

// Predefined brands for each gaming category
const GAMING_BRANDS = {
    'gaming-consoles': ['Microsoft', 'Sony', 'Nintendo'],
    'laptop-gaming': ['Asus', 'HP', 'MSI', 'Lenovo', 'Acer'],
    'gaming-monitors': ['Samsung', 'LG', 'Xiaomi', 'MSI', 'Dell', 'HP', 'Acer', 'Asus'],
    'consoles-accessories': ['Microsoft', 'Sony', 'Nintendo'],
    'pc-gaming-accessories': ['Logitech', 'Razer', 'Red Dragon', 'VX Gaming'],
    'handled-gaming': ['MSI', 'Steam Deck', 'Nintendo', 'Asus']
};

// Predefined categories for each gaming category
const GAMING_CATEGORIES = {
    'consoles-accessories': [
        'Storage & Data',
        'Charging & Stands', 
        'Controllers',
        'Headsets & Communication',
        'Component Adapters',
        'Cameras and Remotes',
        'Specialty Controllers',
        'PS Remote Play'
    ],
    'pc-gaming-accessories': [
        'Gaming Headsets',
        'Gaming Keyboards',
        'Gaming Mice',
        'Gaming Controllers',
        'Gaming Speakers'
    ]
};

// Brand name variations mapping for better matching
const BRAND_VARIATIONS = {
    'hp': ['hp', 'hewlett-packard', 'hewlett packard', 'h.p.'],
    'asus': ['asus', 'asustek', 'asustek computer'],
    'msi': ['msi', 'micro-star international', 'micro star'],
    'lenovo': ['lenovo', 'legend', 'ibm'],
    'acer': ['acer', 'acer incorporated'],
    'samsung': ['samsung', 'samsung electronics'],
    'lg': ['lg', 'lg electronics', 'goldstar'],
    'xiaomi': ['xiaomi', 'mi'],
    'dell': ['dell', 'dell technologies'],
    'microsoft': ['microsoft', 'ms'],
    'sony': ['sony', 'sony corporation'],
    'nintendo': ['nintendo', 'nintendo co'],
    'logitech': ['logitech', 'logitech g'],
    'razer': ['razer', 'razer inc'],
    'red dragon': ['red dragon', 'reddragon', 'red-dragon'],
    'vx gaming': ['vx gaming', 'vx', 'vx-gaming']
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
        .replace(/\s+(inc|corp|corporation|ltd|limited|co|company|electronics|computer|international)\.?\s*$/gi, '')
        .replace(/^(hewlett[\s-]*packard|hewlett[\s-]*packard)/gi, 'hp')
        .replace(/^(asustek)/gi, 'asus')
        .replace(/^(micro[\s-]*star)/gi, 'msi');

    return cleaned;
}

// DOM elements
const productsGrid = document.getElementById('gamingProductsGrid');
const paginationContainer = document.getElementById('pagination');
const sortBySelect = document.getElementById('gamingSortSelect');
const gamingCategoryTitle = document.getElementById('gamingCategoryTitle');
const gamingBrandGrid = document.getElementById('gamingBrandGrid');
const screenSizeFilter = document.getElementById('screenSizeFilter');
const processorFilter = document.getElementById('processorFilter');
const categoriesFilter = document.getElementById('categoriesFilter');
const categoriesGrid = document.getElementById('categoriesGrid');

// Function to determine gaming type from URL
function determineGamingType() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || urlParams.get('type');

    console.log('URL parameters:', window.location.search);
    console.log('Category/Type parameter:', categoryParam);

    if (categoryParam) {
        const category = categoryParam.toLowerCase().replace(/[-\s_]/g, '');
        console.log('Normalized category:', category);
        
        // Check for unified mode
        if (category === 'all' || category === 'allproducts') {
            console.log('Unified mode requested - showing all gaming categories');
            return 'all';
        }
        
        // Map URL parameters to internal type names
        const categoryMappings = {
            'consoles': 'gaming-consoles',
            'gamingconsoles': 'gaming-consoles',
            'gaming-consoles': 'gaming-consoles',
            'laptopgaming': 'laptop-gaming',
            'gaminglaptops': 'laptop-gaming',
            'gaminglaptop': 'laptop-gaming',
            'laptop': 'laptop-gaming',
            'gamingmonitors': 'gaming-monitors',
            'gamingmonitor': 'gaming-monitors',
            'monitors': 'gaming-monitors',
            'monitor': 'gaming-monitors',
            'handledgaming': 'handled-gaming',
            'handled': 'handled-gaming',
            'handheld': 'handled-gaming',
            'consolesaccessories': 'consoles-accessories',
            'consolesaccessory': 'consoles-accessories',
            'consoleaccessories': 'consoles-accessories',
            'consoleaccessory': 'consoles-accessories',
            'accessories': 'consoles-accessories',
            'accessory': 'consoles-accessories',
            'pcgamingaccessories': 'pc-gaming-accessories',
            'pcgamingaccessory': 'pc-gaming-accessories',
            'pcaccessories': 'pc-gaming-accessories',
            'pcaccessory': 'pc-gaming-accessories'
        };
        const mapped = categoryMappings[category];
        console.log('Mapped to:', mapped);
        return mapped || 'gaming-consoles';
    }

    // Default fallback - show all categories (unified mode)
    console.log('No specific category found, defaulting to unified mode (all categories)');
    return 'all';
}

// Function to get API URL based on gaming type
function getAPIUrl(gamingType) {
    if (gamingType === 'all') {
        // Return all API URLs for unified mode
        return Object.values(GAMING_APIS);
    }
    return GAMING_APIS[gamingType] || GAMING_APIS['gaming-consoles'];
}

// Function to get display name for gaming type
function getGamingTypeDisplayName() {
    const displayNames = {
        'all': 'All Gaming Products',
        'gaming-consoles': 'Gaming Consoles',
        'laptop-gaming': 'Gaming Laptops',
        'gaming-monitors': 'Gaming Monitors',
        'consoles-accessories': 'Console Accessories',
        'pc-gaming-accessories': 'PC Gaming Accessories',
        'handled-gaming': 'Handled Gaming'
    };
    return displayNames[currentGamingType] || 'Gaming Products';
}

// Function to get display name for product category (for badges)
function getCategoryDisplayName(category) {
    const displayNames = {
        'gaming-consoles': 'Console',
        'laptop-gaming': 'Gaming Laptop',
        'gaming-monitors': 'Monitor',
        'consoles-accessories': 'Accessory',
        'pc-gaming-accessories': 'PC Accessory',
        'handled-gaming': 'Handheld'
    };
    return displayNames[category] || 'Gaming';
}

// Function to update page title dynamically
function updatePageTitle() {
    const displayName = getGamingTypeDisplayName();
    document.title = `${displayName} - Compare Hub Prices`;

    // Update section title if exists
    const sectionTitle = document.getElementById('gamingTitle') || document.getElementById('section-title') || document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = displayName;
        console.log('Updated page title to:', displayName);
    } else {
        console.log('Section title element not found');
    }

    // Update category title
    if (gamingCategoryTitle) {
        gamingCategoryTitle.textContent = displayName;
    }
}

// Function to fetch products from API
async function fetchProducts(gamingType) {
    try {
        showLoading();
        
        const apiUrls = getAPIUrl(gamingType);
        console.log('Fetching from URLs:', apiUrls);
        
        let allFetchedProducts = [];
        
        if (Array.isArray(apiUrls)) {
            // Multiple APIs (unified mode)
            const promises = apiUrls.map(url => fetch(url).then(response => response.json()));
            const results = await Promise.all(promises);
            
            results.forEach((data, index) => {
                if (data && data.products) {
                    const categoryKey = Object.keys(GAMING_APIS)[index];
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
                    allFetchedProducts = data.map(product => normalizeProductData(product, gamingType));
                } else if (data && data.products && Array.isArray(data.products)) {
                    // Response with products property
                    allFetchedProducts = data.products.map(product => normalizeProductData(product, gamingType));
                } else if (data && data.data && Array.isArray(data.data)) {
                    // Response with data property
                    allFetchedProducts = data.data.map(product => normalizeProductData(product, gamingType));
                } else if (data && typeof data === 'object') {
                    // Single product object
                    allFetchedProducts = [normalizeProductData(data, gamingType)];
                } else {
                    console.warn('Unexpected API response format:', data);
                    allFetchedProducts = [];
                }
            } catch (fetchError) {
                console.warn('API fetch failed, using mock data:', fetchError.message);
                // Use mock data when API fails
                allFetchedProducts = getMockProducts(gamingType);
            }
        }
        
        console.log('Fetched products:', allFetchedProducts.length);
        return allFetchedProducts;
        
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Using mock data as fallback');
        return getMockProducts(gamingType);
    }
}

// Function to get mock products when API fails
function getMockProducts(gamingType) {
    const mockProducts = {
        'gaming-consoles': [
            {
                id: '1',
                name: 'PlayStation 5 Console',
                brand: 'Sony',
                price: 8999,
                image: 'https://via.placeholder.com/300x200?text=PS5',
                description: 'Next-gen gaming console with 4K gaming and ray tracing',
                retailers: ['Game', 'Takealot', 'Makro']
            },
            {
                id: '2',
                name: 'Xbox Series X',
                brand: 'Microsoft',
                price: 8499,
                image: 'https://via.placeholder.com/300x200?text=Xbox+X',
                description: 'Most powerful Xbox console with 4K gaming',
                retailers: ['Game', 'Takealot', 'Makro']
            },
            {
                id: '3',
                name: 'Nintendo Switch OLED',
                brand: 'Nintendo',
                price: 5999,
                image: 'https://via.placeholder.com/300x200?text=Nintendo+Switch',
                description: 'Handheld and home console with OLED display',
                retailers: ['Game', 'Takealot', 'Makro']
            }
        ],
        'laptop-gaming': [
            {
                id: '4',
                name: 'ASUS ROG Strix G15',
                brand: 'Asus',
                price: 18999,
                image: 'https://via.placeholder.com/300x200?text=Gaming+Laptop',
                description: 'High-performance gaming laptop with RTX graphics',
                retailers: ['Evetech', 'Wootware', 'Takealot']
            },
            {
                id: '5',
                name: 'MSI Katana GF66',
                brand: 'MSI',
                price: 15999,
                image: 'https://via.placeholder.com/300x200?text=MSI+Laptop',
                description: 'Gaming laptop with Intel i7 and RTX 3060',
                retailers: ['Evetech', 'Wootware', 'Takealot']
            }
        ],
        'gaming-monitors': [
            {
                id: '6',
                name: 'Samsung Odyssey G7',
                brand: 'Samsung',
                price: 8999,
                image: 'https://via.placeholder.com/300x200?text=Gaming+Monitor',
                description: '27" 1440p 240Hz curved gaming monitor',
                retailers: ['Evetech', 'Wootware', 'Takealot']
            }
        ],
        'handled-gaming': [
            {
                id: '7',
                name: 'Steam Deck 512GB',
                brand: 'Steam Deck',
                price: 12999,
                image: 'https://via.placeholder.com/300x200?text=Steam+Deck',
                description: 'Portable gaming PC with 512GB storage',
                retailers: ['Takealot', 'Game']
            },
            {
                id: '8',
                name: 'Nintendo Switch Lite',
                brand: 'Nintendo',
                price: 3999,
                image: 'https://via.placeholder.com/300x200?text=Switch+Lite',
                description: 'Compact handheld gaming console',
                retailers: ['Game', 'Takealot', 'Makro']
            }
        ],
        'consoles-accessories': [
            {
                id: '9',
                name: 'DualSense Wireless Controller',
                brand: 'Sony',
                price: 1299,
                image: 'https://via.placeholder.com/300x200?text=PS5+Controller',
                description: 'Official PlayStation 5 controller with haptic feedback',
                retailers: ['Game', 'Takealot', 'Makro']
            }
        ],
        'pc-gaming-accessories': [
            {
                id: '10',
                name: 'Logitech G Pro X Gaming Headset',
                brand: 'Logitech',
                price: 2999,
                image: 'https://via.placeholder.com/300x200?text=Gaming+Headset',
                description: 'Professional gaming headset with Blue Voice technology',
                retailers: ['Evetech', 'Wootware', 'Takealot']
            }
        ]
    };
    
    return mockProducts[gamingType] || mockProducts['gaming-consoles'];
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
            <div class="loading-state">
                <div class="modern-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h4>Loading gaming products...</h4>
                <p>Please wait while we fetch the latest deals</p>
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
                <p>No gaming products found</p>
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
    const productCategory = product.category || currentGamingType;

    // Get retailer count
    const retailerCount = product.retailers || 0;

    return `
        <div class="smartphone-card">
            <a href="gaming-info.html?category=${productCategory}" class="card-link">
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
    
    // Screen size filter (only for gaming monitors)
    const activeScreenSizes = Array.from(document.querySelectorAll('.screen-size-option.active'))
        .map(btn => btn.dataset.screenSize);
    
    if (activeScreenSizes.length > 0 && currentGamingType === 'gaming-monitors') {
        filtered = filtered.filter(product => {
            return activeScreenSizes.some(size => {
                if (size === 'all') return true;
                // Extract screen size from product name or specifications
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                return productText.includes(size + '"') || productText.includes(size + ' inch') || productText.includes(size + '-inch');
            });
        });
    }
    
    // Processor filter (only for gaming laptops)
    const activeProcessors = Array.from(document.querySelectorAll('.processor-option.active'))
        .map(btn => btn.dataset.processor);
    
    if (activeProcessors.length > 0 && currentGamingType === 'laptop-gaming') {
        filtered = filtered.filter(product => {
            return activeProcessors.some(processor => {
                if (processor === 'all') return true;
                // Extract processor from product name or specifications
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                return productText.includes(processor.toLowerCase());
            });
        });
    }
    
    // Categories filter (for console accessories and PC gaming accessories)
    const activeCategories = Array.from(document.querySelectorAll('.category-option.active'))
        .map(btn => btn.dataset.category);
    
    if (activeCategories.length > 0 && (currentGamingType === 'consoles-accessories' || currentGamingType === 'pc-gaming-accessories')) {
        filtered = filtered.filter(product => {
            return activeCategories.some(category => {
                if (category === 'all') return true;
                // Extract category from product name or specifications
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
    
    // Reset screen size filters
    document.querySelectorAll('.screen-size-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset processor filters
    document.querySelectorAll('.processor-option').forEach(btn => {
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
    if (!gamingBrandGrid) return;
    
    const brands = GAMING_BRANDS[currentGamingType] || [];
    
    // Add "All" option at the beginning
    gamingBrandGrid.innerHTML = `
        <button class="brand-option" data-brand="all">All</button>
        ${brands.map(brand => `
            <button class="brand-option" data-brand="${brand.toLowerCase()}">${brand}</button>
        `).join('')}
    `;
    
    // Add event listeners to brand buttons
    gamingBrandGrid.querySelectorAll('.brand-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update categories filters
function updateCategoriesFilters() {
    if (!categoriesGrid) return;
    
    const categories = GAMING_CATEGORIES[currentGamingType] || [];
    
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
    // Screen size filter - only for gaming monitors
    if (screenSizeFilter) {
        if (currentGamingType === 'gaming-monitors') {
            screenSizeFilter.style.display = 'flex';
        } else {
            screenSizeFilter.style.display = 'none';
        }
    }
    
    // Processor filter - only for gaming laptops
    if (processorFilter) {
        if (currentGamingType === 'laptop-gaming') {
            processorFilter.style.display = 'flex';
        } else {
            processorFilter.style.display = 'none';
        }
    }
    
    // Categories filter - for console accessories and PC gaming accessories
    if (categoriesFilter) {
        if (currentGamingType === 'consoles-accessories' || currentGamingType === 'pc-gaming-accessories') {
            categoriesFilter.style.display = 'flex';
        } else {
            categoriesFilter.style.display = 'none';
        }
    }
}

// Function to load category
async function loadCategory(category) {
    currentGamingType = category;
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

// Initialize gaming page
function initializeGamingPage() {
    console.log('Initializing gaming page...');
    
    // Determine gaming type from URL
    const gamingType = determineGamingType();
    console.log('Determined gaming type:', gamingType);
    
    // Load initial category
    loadCategory(gamingType);
    
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
            window.location.href = `gaming-info.html?category=${category}`;
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
    initializeGamingPage();
});
