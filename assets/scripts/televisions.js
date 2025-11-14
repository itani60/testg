// Television and Streaming Devices JavaScript

// API Configuration
const TELEVISION_API_CONFIG = {
    endpoint: 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/televisions',
    category: 'television'
};

const STREAMING_API_CONFIG = {
    endpoint: 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/streaming-devices',
    category: 'streaming-devices'
};

// Television brands
const TELEVISION_BRANDS = [
    'TCL', 'Samsung', 'Hisense', 'LG', 'Skyworth', 'JVC', 'Orion', 'Xiaomi', 'Toshiba'
];

// Streaming device brands
const STREAMING_BRANDS = [
    'Nova', 'Xiaomi', 'Mecool', 'Mediabox', 'Apple', 'Skyworth', 'Amazon Fire TV'
];

// Brand variations for normalization
const BRAND_VARIATIONS = {
    'tcl': ['tcl', 'tcl electronics'],
    'samsung': ['samsung', 'samsung electronics'],
    'hisense': ['hisense', 'hisense international'],
    'lg': ['lg', 'lg electronics'],
    'skyworth': ['skyworth', 'skyworth group'],
    'jvc': ['jvc', 'jvc kenwood'],
    'orion': ['orion', 'orion electronics'],
    'xiaomi': ['xiaomi', 'xiaomi corporation'],
    'toshiba': ['toshiba', 'toshiba corporation'],
    'nova': ['nova', 'nova tv'],
    'mecool': ['mecool', 'mecool box'],
    'mediabox': ['mediabox', 'media box'],
    'apple': ['apple', 'apple tv'],
    'amazon fire tv': ['amazon fire tv', 'fire tv', 'amazon']
};

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentTelevisionType = 'televisions'; // 'televisions' or 'streaming-devices'

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page
function initializePage() {
    // Determine television type from URL parameters
    determineTelevisionType();
    
    // Update page title
    updatePageTitle();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load initial category
    loadCategory(currentTelevisionType);
}

// Determine television type from URL parameters
function determineTelevisionType() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type === 'streaming-devices') {
        currentTelevisionType = 'streaming-devices';
    } else {
        currentTelevisionType = 'televisions';
    }
}

// Get API URL based on television type
function getAPIUrl() {
    if (currentTelevisionType === 'streaming-devices') {
        return STREAMING_API_CONFIG.endpoint;
    } else {
        return TELEVISION_API_CONFIG.endpoint;
    }
}

// Get television type display name
function getTelevisionTypeDisplayName() {
    if (currentTelevisionType === 'streaming-devices') {
        return 'Streaming Devices';
    } else {
        return 'Televisions';
    }
}

// Update page title
function updatePageTitle() {
    const titleElement = document.getElementById('televisionTitle');
    const categoryTitleElement = document.getElementById('televisionCategoryTitle');
    
    if (titleElement) {
        titleElement.textContent = `${getTelevisionTypeDisplayName()} Hub`;
    }
    
    if (categoryTitleElement) {
        categoryTitleElement.textContent = getTelevisionTypeDisplayName();
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Sort dropdown
    const sortSelect = document.getElementById('televisionSortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            toggleFilterOptions(filterType);
        });
    });
    
    // Apply and cancel buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-apply')) {
            const filterType = e.target.dataset.filter;
            applyFilter(filterType);
            hideFilterOptions(filterType);
        } else if (e.target.classList.contains('btn-cancel')) {
            const filterType = e.target.dataset.filter;
            hideFilterOptions(filterType);
        }
    });
    
    // Brand buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('brand-option')) {
            e.target.classList.toggle('active');
        }
    });
    
    // Screen size buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('screen-size-option')) {
            e.target.classList.toggle('active');
        }
    });
    
    // Resolution buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('resolution-option')) {
            e.target.classList.toggle('active');
        }
    });
    
    // Category buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('category-option')) {
            e.target.classList.toggle('active');
        }
    });
    
    // Price range buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('price-option')) {
            e.target.classList.toggle('active');
        }
    });
    
    // Price alert bell buttons
    document.addEventListener('click', function(e) {
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
    });
}

// Toggle filter options
function toggleFilterOptions(filterType) {
    const optionsElement = document.getElementById(filterType + 'Options');
    if (optionsElement) {
        if (optionsElement.style.display === 'none' || optionsElement.style.display === '') {
            // Hide all other filter options
            document.querySelectorAll('.filter-options').forEach(el => {
                el.style.display = 'none';
            });
            // Show current filter options
            optionsElement.style.display = 'block';
        } else {
            optionsElement.style.display = 'none';
        }
    }
}

// Hide filter options
function hideFilterOptions(filterType) {
    const optionsElement = document.getElementById(filterType + 'Options');
    if (optionsElement) {
        optionsElement.style.display = 'none';
    }
}

// Apply filter
function applyFilter(filterType) {
    applyFilters();
}


// Fetch products from API
async function fetchProducts(category) {
    try {
        const apiUrl = getAPIUrl();
        console.log('Fetching products from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Normalize product data
        const products = normalizeProductData(data);
        console.log('Normalized products:', products);
        
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Normalize product data from API
function normalizeProductData(data) {
    let products = [];
    
    if (Array.isArray(data)) {
        products = data;
    } else if (data.products && Array.isArray(data.products)) {
        products = data.products;
    } else if (data.body && Array.isArray(data.body)) {
        products = data.body;
    } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
    }
    
    return products.map(product => ({
        id: product.id || product.productId || Math.random().toString(36).substr(2, 9),
        name: product.name || product.title || product.productName || 'Unknown Product',
        price: parseFloat(product.price || product.priceValue || 0),
        image: product.image || product.imageUrl || product.thumbnail || 'assets/images/placeholder.jpg',
        brand: product.brand || product.manufacturer || 'Unknown Brand',
        description: product.description || product.details || '',
        url: product.url || product.productUrl || '#',
        category: product.category || product.type || 'television',
        screenSize: product.screenSize || product.size || '',
        resolution: product.resolution || product.displayResolution || '',
        features: product.features || product.specifications || []
    }));
}

// Display products
function displayProducts(products) {
    const productsGrid = document.getElementById('televisionProductsGrid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = products.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-tv fa-3x"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="smartphone-card" data-product-id="${product.id}">
            <a href="${product.url}" class="card-link">
                <div class="card-image-container">
                    <button class="price-alert-bell" data-product-id="${product.id}" title="Set Price Alert">
                        <i class="fas fa-bell"></i>
                    </button>
                    <img src="${product.image}" alt="${product.name}" class="card-image" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="card-content">
                    <div class="brand-badge">${product.brand}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-specs">
                        ${product.screenSize ? `<span>Screen: ${product.screenSize}</span>` : ''}
                        ${product.resolution ? `<span>Resolution: ${product.resolution}</span>` : ''}
                    </div>
                    <div class="product-price">
                        <span class="current-price">R${product.price.toLocaleString()}</span>
                    </div>
                    <div class="retailer-info">
                        <span>${Math.floor(Math.random() * 5) + 1} retailers</span>
                    </div>
                </div>
            </a>
            <div class="card-actions">
                <button class="btn-compare" onclick="compareProduct('${product.id}')">View</button>
                <button class="btn-wishlist" onclick="addToWishlist('${product.id}')">Add to Wishlist</button>
            </div>
        </div>
    `).join('');
    
    // Update pagination
    updatePagination(products.length);
}

// Update pagination
function updatePagination(totalProducts) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="page-btn" onclick="goToPage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// Go to page
function goToPage(page) {
    currentPage = page;
    displayProducts(filteredProducts);
}

// Apply filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Brand filter
    const activeBrands = Array.from(document.querySelectorAll('.brand-option.active'))
        .map(btn => btn.dataset.brand);
    
    if (activeBrands.length > 0 && !activeBrands.includes('all')) {
        filtered = filtered.filter(product => {
            const productBrand = normalizeBrand(product.brand);
            return activeBrands.some(brand => 
                productBrand.includes(brand.toLowerCase()) || 
                brand.toLowerCase().includes(productBrand)
            );
        });
    }
    
    // Screen size filter
    const activeScreenSizes = Array.from(document.querySelectorAll('.screen-size-option.active'))
        .map(btn => btn.dataset.screenSize);
    
    if (activeScreenSizes.length > 0 && !activeScreenSizes.includes('all')) {
        filtered = filtered.filter(product => {
            return activeScreenSizes.some(size => 
                product.screenSize && product.screenSize.includes(size)
            );
        });
    }
    
    // Resolution filter
    const activeResolutions = Array.from(document.querySelectorAll('.resolution-option.active'))
        .map(btn => btn.dataset.resolution);
    
    if (activeResolutions.length > 0 && !activeResolutions.includes('all')) {
        filtered = filtered.filter(product => {
            return activeResolutions.some(resolution => 
                product.resolution && product.resolution.toLowerCase().includes(resolution.toLowerCase())
            );
        });
    }
    
    // Category filter
    const activeCategories = Array.from(document.querySelectorAll('.category-option.active'))
        .map(btn => btn.dataset.category);
    
    if (activeCategories.length > 0 && !activeCategories.includes('all')) {
        filtered = filtered.filter(product => {
            return activeCategories.some(category => 
                product.category && product.category.toLowerCase().includes(category.toLowerCase())
            );
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
    const sortBy = document.getElementById('televisionSortSelect') ? document.getElementById('televisionSortSelect').value : '';
    filtered = sortProducts(filtered, sortBy);
    
    filteredProducts = filtered;
    currentPage = 1;
    displayProducts(filteredProducts);
}

// Sort products
function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'name':
            return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'relevance':
        default:
            return products;
    }
}

// Normalize brand name
function normalizeBrand(brand) {
    if (!brand) return '';
    
    const brandLower = brand.toLowerCase();
    
    for (const [normalized, variations] of Object.entries(BRAND_VARIATIONS)) {
        if (variations.some(variation => brandLower.includes(variation))) {
            return normalized;
        }
    }
    
    return brandLower;
}

// Update brand filters
function updateBrandFilters() {
    const brandGrid = document.getElementById('televisionBrandGrid');
    if (!brandGrid) return;
    
    // Choose brands based on current television type
    const brandsToShow = currentTelevisionType === 'streaming-devices' ? STREAMING_BRANDS : TELEVISION_BRANDS;
    
    // Always show all predefined brands with "All" button first
    const brandOptions = '<button class="brand-option" data-brand="all">All Brands</button>' + 
        brandsToShow.map(brand => 
            `<button class="brand-option" data-brand="${brand.toLowerCase()}">${brand}</button>`
        ).join('');
    
    brandGrid.innerHTML = brandOptions;
}

// Update categories filters
function updateCategoriesFilters() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;
    
    let categoryOptions = '<button class="category-option" data-category="all">All Categories</button>';
    
    if (currentTelevisionType === 'streaming-devices') {
        // Streaming device categories
        categoryOptions += `
            <button class="category-option" data-category="stick">Stick</button>
            <button class="category-option" data-category="box">Box</button>
            <button class="category-option" data-category="streaming-device">Streaming Device</button>
        `;
    } else {
        // Television categories
        categoryOptions += `
            <button class="category-option" data-category="smart-tv">Smart TV</button>
            <button class="category-option" data-category="led-tv">LED TV</button>
            <button class="category-option" data-category="oled-tv">OLED TV</button>
            <button class="category-option" data-category="qled-tv">QLED TV</button>
        `;
    }
    
    categoriesGrid.innerHTML = categoryOptions;
}

// Function to load category
async function loadCategory(category) {
    currentTelevisionType = category;
    currentPage = 1;
    
    // Update page title
    updatePageTitle();
    
    // Update brand filters
    updateBrandFilters();
    
    // Update categories filters
    updateCategoriesFilters();
    
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

// Function to view deals
function viewDeals(productId) {
    console.log('View deals for product:', productId);
    // Add view deals logic here
}
