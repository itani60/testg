// Unified Laptops JavaScript - Handles different laptop categories

// API URLs for different laptop types
const LAPTOP_APIS = {
    'windows-laptops': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/windows-laptops',
    'macbooks-laptops': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/macbooks-laptops',
    'chromebooks-laptops': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/chromebooks-laptops'
};

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 14;
let currentLaptopType = 'windows-laptops'; // Default

// Predefined brands for each laptop category
const LAPTOP_BRANDS = {
    'windows-laptops': ['Samsung', 'Huawei', 'Dell', 'Acer', 'HP', 'MSI', 'Asus', 'Lenovo', 'Microsoft'],
    'macbooks-laptops': ['Apple'],
    'chromebooks-laptops': ['Google', 'Samsung', 'Acer', 'Asus', 'HP', 'Lenovo', 'Dell']
};

// Predefined categories for each laptop category
const LAPTOP_CATEGORIES = {
    'windows-laptops': [
        'Business Laptops',
        'Gaming Laptops', 
        'Ultrabooks',
        'Budget Laptops',
        '2-in-1 Laptops'
    ],
    'macbooks-laptops': [
        'MacBook Air',
        'MacBook Pro',
        'MacBook'
    ],
    'chromebooks-laptops': [
        'Budget Chromebooks',
        'Premium Chromebooks',
        '2-in-1 Chromebooks',
        'Gaming Chromebooks'
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
    'dell': ['dell', 'dell technologies'],
    'apple': ['apple', 'apple inc', 'apple computer'],
    'google': ['google', 'google llc'],
    'huawei': ['huawei', 'huawei technologies'],
    'microsoft': ['microsoft', 'ms', 'microsoft corporation']
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
const productsGrid = document.getElementById('laptopsProductsGrid');
const paginationContainer = document.getElementById('pagination');
const sortBySelect = document.getElementById('laptopsSortSelect');
const laptopsCategoryTitle = document.getElementById('laptopsCategoryTitle');
const laptopsBrandGrid = document.getElementById('laptopsBrandGrid');
const screenSizeFilter = document.getElementById('screenSizeFilter');
const processorFilter = document.getElementById('processorFilter');
const categoriesFilter = document.getElementById('categoriesFilter');
const categoriesGrid = document.getElementById('categoriesGrid');

// Function to determine laptop type from URL
function determineLaptopType() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || urlParams.get('type');

    console.log('URL parameters:', window.location.search);
    console.log('Category/Type parameter:', categoryParam);

    if (categoryParam) {
        const category = categoryParam.toLowerCase().replace(/[-\s_]/g, '');
        console.log('Normalized category:', category);
        
        // Check for unified mode
        if (category === 'all' || category === 'allproducts') {
            console.log('Unified mode requested - showing all laptop categories');
            return 'all';
        }
        
        // Map URL parameters to internal type names
        const categoryMappings = {
            'windows': 'windows-laptops',
            'windowslaptops': 'windows-laptops',
            'windows-laptops': 'windows-laptops',
            'macbook': 'macbooks-laptops',
            'macbooks': 'macbooks-laptops',
            'macbooks-laptops': 'macbooks-laptops',
            'macbookslaptops': 'macbooks-laptops',
            'chromebook': 'chromebooks-laptops',
            'chromebooks': 'chromebooks-laptops',
            'chromebooks-laptops': 'chromebooks-laptops',
            'chromebookslaptops': 'chromebooks-laptops'
        };
        const mapped = categoryMappings[category];
        console.log('Mapped to:', mapped);
        return mapped || 'windows-laptops';
    }

    // Default fallback - show all categories (unified mode)
    console.log('No specific category found, defaulting to unified mode (all categories)');
    return 'all';
}

// Function to get API URL based on laptop type
function getAPIUrl(laptopType) {
    if (laptopType === 'all') {
        // Return all API URLs for unified mode
        return Object.values(LAPTOP_APIS);
    }
    return LAPTOP_APIS[laptopType] || LAPTOP_APIS['windows-laptops'];
}

// Function to get display name for laptop type
function getLaptopTypeDisplayName() {
    const displayNames = {
        'all': 'All Laptops',
        'windows-laptops': 'Windows Laptops',
        'macbooks-laptops': 'MacBooks',
        'chromebooks-laptops': 'Chromebooks'
    };
    return displayNames[currentLaptopType] || 'Laptops';
}

// Function to get display name for product category (for badges)
function getCategoryDisplayName(category) {
    const displayNames = {
        'windows-laptops': 'Windows',
        'macbooks-laptops': 'MacBook',
        'chromebooks-laptops': 'Chromebook'
    };
    return displayNames[category] || 'Laptop';
}

// Function to update page title dynamically
function updatePageTitle() {
    const displayName = getLaptopTypeDisplayName();
    document.title = `${displayName} - Compare Hub Prices`;

    // Update section title if exists
    const sectionTitle = document.getElementById('laptopsTitle') || document.getElementById('section-title') || document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = displayName;
        console.log('Updated page title to:', displayName);
    } else {
        console.log('Section title element not found');
    }

    // Update category title
    if (laptopsCategoryTitle) {
        laptopsCategoryTitle.textContent = displayName;
    }
}

// Function to fetch products from API
async function fetchProducts(laptopType) {
    try {
        showLoading();
        
        const apiUrls = getAPIUrl(laptopType);
        console.log('Fetching from URLs:', apiUrls);
        
        let allFetchedProducts = [];
        
        if (Array.isArray(apiUrls)) {
            // Multiple APIs (unified mode)
            const promises = apiUrls.map(url => fetch(url).then(response => response.json()));
            const results = await Promise.all(promises);
            
            results.forEach((data, index) => {
                if (data && data.products) {
                    const categoryKey = Object.keys(LAPTOP_APIS)[index];
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
                    allFetchedProducts = data.map(product => normalizeProductData(product, laptopType));
                } else if (data && data.products && Array.isArray(data.products)) {
                    // Response with products property
                    allFetchedProducts = data.products.map(product => normalizeProductData(product, laptopType));
                } else if (data && data.data && Array.isArray(data.data)) {
                    // Response with data property
                    allFetchedProducts = data.data.map(product => normalizeProductData(product, laptopType));
                } else if (data && typeof data === 'object') {
                    // Single product object
                    allFetchedProducts = [normalizeProductData(data, laptopType)];
                } else {
                    console.warn('Unexpected API response format:', data);
                    allFetchedProducts = [];
                }
            } catch (fetchError) {
                console.warn('API fetch failed, using mock data:', fetchError.message);
                // Use mock data when API fails
                allFetchedProducts = getMockProducts(laptopType);
            }
        }
        
        console.log('Fetched products:', allFetchedProducts.length);
        return allFetchedProducts;
        
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Using mock data as fallback');
        return getMockProducts(laptopType);
    }
}

// Function to get mock products when API fails
function getMockProducts(laptopType) {
    const mockProducts = {
        'windows-laptops': [
            {
                id: '1',
                name: 'Dell XPS 13',
                brand: 'Dell',
                price: 25999,
                image: 'https://via.placeholder.com/300x200?text=Dell+XPS+13',
                description: 'Premium ultrabook with Intel i7 and 16GB RAM',
                retailers: ['Dell', 'Takealot', 'Makro']
            },
            {
                id: '2',
                name: 'HP Pavilion 15',
                brand: 'HP',
                price: 15999,
                image: 'https://via.placeholder.com/300x200?text=HP+Pavilion+15',
                description: 'Budget-friendly laptop with AMD Ryzen 5',
                retailers: ['HP', 'Takealot', 'Makro']
            },
            {
                id: '3',
                name: 'Lenovo ThinkPad X1',
                brand: 'Lenovo',
                price: 32999,
                image: 'https://via.placeholder.com/300x200?text=ThinkPad+X1',
                description: 'Business laptop with Intel i7 and 32GB RAM',
                retailers: ['Lenovo', 'Takealot', 'Makro']
            }
        ],
        'macbooks-laptops': [
            {
                id: '4',
                name: 'MacBook Air M2',
                brand: 'Apple',
                price: 22999,
                image: 'https://via.placeholder.com/300x200?text=MacBook+Air+M2',
                description: 'Lightweight laptop with Apple M2 chip',
                retailers: ['Apple', 'iStore', 'Takealot']
            },
            {
                id: '5',
                name: 'MacBook Pro 16" M3',
                brand: 'Apple',
                price: 45999,
                image: 'https://via.placeholder.com/300x200?text=MacBook+Pro+16',
                description: 'Professional laptop with Apple M3 Pro chip',
                retailers: ['Apple', 'iStore', 'Takealot']
            }
        ],
        'chromebooks-laptops': [
            {
                id: '6',
                name: 'Google Pixelbook Go',
                brand: 'Google',
                price: 12999,
                image: 'https://via.placeholder.com/300x200?text=Pixelbook+Go',
                description: 'Premium Chromebook with Intel i5',
                retailers: ['Google', 'Takealot']
            },
            {
                id: '7',
                name: 'Samsung Galaxy Chromebook',
                brand: 'Samsung',
                price: 18999,
                image: 'https://via.placeholder.com/300x200?text=Galaxy+Chromebook',
                description: '2-in-1 Chromebook with AMOLED display',
                retailers: ['Samsung', 'Takealot', 'Makro']
            }
        ]
    };
    
    return mockProducts[laptopType] || mockProducts['windows-laptops'];
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
                <h4>Loading laptops...</h4>
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
                <p>No laptops found</p>
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
    const productCategory = product.category || currentLaptopType;

    // Get retailer count
    const retailerCount = product.retailers || 0;

    return `
        <div class="smartphone-card">
            <a href="laptops-info.html?category=${productCategory}" class="card-link">
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
    
    // Screen size filter (for all laptop types)
    const activeScreenSizes = Array.from(document.querySelectorAll('.screen-size-option.active'))
        .map(btn => btn.dataset.screenSize);
    
    if (activeScreenSizes.length > 0) {
        filtered = filtered.filter(product => {
            return activeScreenSizes.some(size => {
                if (size === 'all') return true;
                // Extract screen size from product name or specifications
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                return productText.includes(size + '"') || productText.includes(size + ' inch') || productText.includes(size + '-inch');
            });
        });
    }
    
    // Processor filter (for all laptop types)
    const activeProcessors = Array.from(document.querySelectorAll('.processor-option.active'))
        .map(btn => btn.dataset.processor);
    
    if (activeProcessors.length > 0) {
        filtered = filtered.filter(product => {
            return activeProcessors.some(processor => {
                if (processor === 'all') return true;
                // Extract processor from product name or specifications
                const productText = (product.name + ' ' + (product.description || '')).toLowerCase();
                return productText.includes(processor.toLowerCase());
            });
        });
    }
    
    // Categories filter (for all laptop types)
    const activeCategories = Array.from(document.querySelectorAll('.category-option.active'))
        .map(btn => btn.dataset.category);
    
    if (activeCategories.length > 0) {
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
    if (!laptopsBrandGrid) return;
    
    const brands = LAPTOP_BRANDS[currentLaptopType] || [];
    
    // Hide brand filter for MacBooks
    if (currentLaptopType === 'macbooks-laptops') {
        laptopsBrandGrid.innerHTML = '';
        // Also hide the brand options div
        const brandOptions = document.getElementById('brandOptions');
        if (brandOptions) {
            brandOptions.style.display = 'none';
        }
        return;
    }
    
    // Add "All" option at the beginning
    laptopsBrandGrid.innerHTML = `
        <button class="brand-option" data-brand="all">All</button>
        ${brands.map(brand => `
            <button class="brand-option" data-brand="${brand.toLowerCase()}">${brand}</button>
        `).join('')}
    `;
    
    // Add event listeners to brand buttons
    laptopsBrandGrid.querySelectorAll('.brand-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update categories filters
function updateCategoriesFilters() {
    if (!categoriesGrid) return;
    
    const categories = LAPTOP_CATEGORIES[currentLaptopType] || [];
    
    // Hide categories filter for all laptop types
    categoriesGrid.innerHTML = '';
    const categoriesOptions = document.getElementById('categoriesOptions');
    if (categoriesOptions) {
        categoriesOptions.style.display = 'none';
    }
}

// Function to update screen size filters based on laptop type
function updateScreenSizeFilters() {
    const screenSizeGrid = document.querySelector('.screen-size-grid');
    if (!screenSizeGrid) return;
    
    let screenSizeOptions = '<button class="screen-size-option" data-screen-size="all">All Screen Sizes</button>';
    
    if (currentLaptopType === 'macbooks-laptops') {
        // MacBooks: Common MacBook screen sizes
        screenSizeOptions += `
            <button class="screen-size-option" data-screen-size="13.3">13.3-inch</button>
            <button class="screen-size-option" data-screen-size="14">14-inch</button>
            <button class="screen-size-option" data-screen-size="15.6">15.6-inch</button>
            <button class="screen-size-option" data-screen-size="16">16-inch</button>
        `;
    } else if (currentLaptopType === 'chromebooks-laptops') {
        // Chromebooks: Common Chromebook screen sizes
        screenSizeOptions += `
            <button class="screen-size-option" data-screen-size="11.6">11.6-inch</button>
            <button class="screen-size-option" data-screen-size="13.3">13.3-inch</button>
            <button class="screen-size-option" data-screen-size="14">14-inch</button>
            <button class="screen-size-option" data-screen-size="15.6">15.6-inch</button>
        `;
    }
    
    screenSizeGrid.innerHTML = screenSizeOptions;
    
    // Add event listeners to screen size buttons
    screenSizeGrid.querySelectorAll('.screen-size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update processor filters based on laptop type
function updateProcessorFilters() {
    const processorGrid = document.querySelector('.processor-grid');
    if (!processorGrid) return;
    
    let processorOptions = '<button class="processor-option" data-processor="all">All Processors</button>';
    
    if (currentLaptopType === 'windows-laptops') {
        // Windows laptops: Intel, AMD, Qualcomm only
        processorOptions += `
            <button class="processor-option" data-processor="intel">Intel</button>
            <button class="processor-option" data-processor="intel inside">Intel Inside</button>
            <button class="processor-option" data-processor="intel celeron">Intel Celeron</button>
            <button class="processor-option" data-processor="intel core i3">Intel Core i3</button>
            <button class="processor-option" data-processor="intel core i5">Intel Core i5</button>
            <button class="processor-option" data-processor="intel core i7">Intel Core i7</button>
            <button class="processor-option" data-processor="intel core 5">Intel Core 5</button>
            <button class="processor-option" data-processor="intel core 7">Intel Core 7</button>
            <button class="processor-option" data-processor="intel core ultra 5">Intel Core Ultra 5</button>
            <button class="processor-option" data-processor="intel core ultra 7">Intel Core Ultra 7</button>
            <button class="processor-option" data-processor="intel core ultra 9">Intel Core Ultra 9</button>
            <button class="processor-option" data-processor="amd">AMD</button>
            <button class="processor-option" data-processor="amd athlon">AMD Athlon</button>
            <button class="processor-option" data-processor="amd ryzen">AMD Ryzen</button>
            <button class="processor-option" data-processor="amd ryzen 3">AMD Ryzen 3</button>
            <button class="processor-option" data-processor="amd ryzen 5">AMD Ryzen 5</button>
            <button class="processor-option" data-processor="amd ryzen 7">AMD Ryzen 7</button>
            <button class="processor-option" data-processor="amd ryzen 9">AMD Ryzen 9</button>
            <button class="processor-option" data-processor="amd ryzen ai 7">AMD Ryzen™ AI 7</button>
            <button class="processor-option" data-processor="qualcomm snapdragon">Qualcomm Snapdragon</button>
        `;
    } else if (currentLaptopType === 'macbooks-laptops') {
        // MacBooks: Apple processors only
        processorOptions += `
            <button class="processor-option" data-processor="apple m1">Apple M1</button>
            <button class="processor-option" data-processor="apple m2">Apple M2</button>
            <button class="processor-option" data-processor="apple m3">Apple M3</button>
            <button class="processor-option" data-processor="apple m4">Apple M4</button>
        `;
    } else if (currentLaptopType === 'chromebooks-laptops') {
        // Chromebooks: Intel and AMD only
        processorOptions += `
            <button class="processor-option" data-processor="intel">Intel</button>
            <button class="processor-option" data-processor="intel inside">Intel Inside</button>
            <button class="processor-option" data-processor="intel celeron">Intel Celeron</button>
            <button class="processor-option" data-processor="intel core i3">Intel Core i3</button>
            <button class="processor-option" data-processor="intel core i5">Intel Core i5</button>
            <button class="processor-option" data-processor="amd">AMD</button>
            <button class="processor-option" data-processor="amd athlon">AMD Athlon</button>
            <button class="processor-option" data-processor="amd ryzen">AMD Ryzen</button>
            <button class="processor-option" data-processor="amd ryzen 3">AMD Ryzen 3</button>
        `;
    }
    
    processorGrid.innerHTML = processorOptions;
    
    // Add event listeners to processor buttons
    processorGrid.querySelectorAll('.processor-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update price range filters
function updatePriceRangeFilters() {
    const priceRangeGrid = document.querySelector('.price-range-grid');
    if (!priceRangeGrid) return;
    
    // Price range options are the same for all laptop types
    const priceOptions = `
        <button class="price-option" data-price="0-10000">Under R10,000</button>
        <button class="price-option" data-price="10000-20000">R10,000 - R20,000</button>
        <button class="price-option" data-price="20000-30000">R20,000 - R30,000</button>
        <button class="price-option" data-price="30000-50000">R30,000 - R50,000</button>
        <button class="price-option" data-price="50000-999999">Over R50,000</button>
    `;
    
    priceRangeGrid.innerHTML = priceOptions;
    
    // Add event listeners to price range buttons
    priceRangeGrid.querySelectorAll('.price-option').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Function to update filter visibility based on category
function updateFilterVisibility() {
    // Brand filter - only for Windows laptops and Chromebooks (not MacBooks)
    const brandFilter = document.querySelector('.filter-btn[data-filter="brand"]');
    if (brandFilter) {
        if (currentLaptopType === 'macbooks-laptops') {
            brandFilter.style.display = 'none';
        } else {
            brandFilter.style.display = 'flex';
        }
    }
    
    // Screen size filter - only for MacBooks (not Windows laptops or Chromebooks)
    if (screenSizeFilter) {
        if (currentLaptopType === 'macbooks-laptops') {
            screenSizeFilter.style.display = 'flex';
        } else {
            screenSizeFilter.style.display = 'none';
        }
    }
    
    // Processor filter - for all laptop types
    if (processorFilter) {
        processorFilter.style.display = 'flex';
    }
    
    // Categories filter - hidden for all laptop types (MacBooks, Windows laptops, and Chromebooks)
    if (categoriesFilter) {
        categoriesFilter.style.display = 'none';
    }
}

// Function to load category
async function loadCategory(category) {
    currentLaptopType = category;
    currentPage = 1;
    
    // Update page title
    updatePageTitle();
    
    // Update brand filters
    updateBrandFilters();
    
    // Update categories filters
    updateCategoriesFilters();
    
    // Update screen size filters
    updateScreenSizeFilters();
    
    // Update processor filters
    updateProcessorFilters();
    
    // Update price range filters
    updatePriceRangeFilters();
    
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

// Initialize laptops page
function initializeLaptopsPage() {
    console.log('Initializing laptops page...');
    
    // Determine laptop type from URL
    const laptopType = determineLaptopType();
    console.log('Determined laptop type:', laptopType);
    
    // Load initial category
    loadCategory(laptopType);
    
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
            window.location.href = `laptops-info.html?category=${category}`;
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
    initializeLaptopsPage();
});
