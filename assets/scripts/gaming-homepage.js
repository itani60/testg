// Gaming Homepage Functionality - Load All Products from All Gaming Endpoints

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
let currentPage = 1;
const productsPerPage = 10;

// DOM elements
const gamingProductsShowcase = document.querySelector('.gaming-products-showcase');

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
        brand: product.brand || 'Unknown Brand',
        price: price,
        originalPrice: originalPrice,
        image: product.imageUrl || product.image || 'assets/images/placeholder.jpg',
        category: product.category || category,
        retailers: retailers,
        url: product.url || '#',
        description: product.description || '',
        specifications: product.specs || product.specifications || {},
        offers: product.offers || [],
        product_id: product.product_id || product.id || Math.random().toString(36).substr(2, 9)
    };
}

// Function to fetch products from all gaming APIs
async function fetchAllGamingProducts() {
    try {
        console.log('Fetching products from all gaming APIs...');
        const allProductsArray = [];
        
        // Fetch from all gaming APIs in parallel
        const promises = Object.entries(GAMING_APIS).map(async ([category, apiUrl]) => {
            try {
                console.log(`Fetching ${category} products from: ${apiUrl}`);
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(`${category} API Response:`, data);

                // Handle different response formats
                let products = [];
                if (Array.isArray(data)) {
                    products = data;
                } else if (data && data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else if (data && data.data && Array.isArray(data.data)) {
                    products = data.data;
                } else if (data && typeof data === 'object') {
                    products = [data];
                }

                // Add category information to each product
                return products.map(product => ({
                    ...normalizeProductData(product, category),
                    category: category
                }));
            } catch (error) {
                console.error(`Error fetching ${category} products:`, error);
                return [];
            }
        });

        // Wait for all API calls to complete
        const results = await Promise.all(promises);
        
        // Flatten and combine all products
        results.forEach(products => {
            allProductsArray.push(...products);
        });

        // Shuffle the products to mix different categories
        allProducts = allProductsArray.sort(() => Math.random() - 0.5);
        
        console.log(`Successfully fetched ${allProducts.length} total gaming products from all categories`);
        return allProducts;
    } catch (error) {
        console.error('Error fetching all gaming products:', error);
        allProducts = [];
        return [];
    }
}

// Function to create product card HTML
function createProductCard(product) {
    const formattedPrice = product.price ? product.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Price not available';
    const imageUrl = product.image || 'https://via.placeholder.com/150?text=No+Image';
    const productName = product.name || 'Unknown Product';
    const brandName = product.brand || 'Unknown Brand';
    const productCategory = product.category || 'gaming-consoles';

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

// Function to display products with pagination
function displayProducts() {
    if (!gamingProductsShowcase) return;
    
    if (allProducts.length === 0) {
        gamingProductsShowcase.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No gaming products found</p>
                <p>Please try again later</p>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    // Display products
    gamingProductsShowcase.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    
    // Add pagination controls
    addPaginationControls(totalPages);
}

// Function to add pagination controls
function addPaginationControls(totalPages) {
    // Remove existing pagination
    const existingPagination = document.querySelector('.gaming-pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    if (totalPages <= 1) return;
    
    const paginationHTML = `
        <div class="gaming-pagination">
            <div class="pagination-info">
                Showing ${(currentPage - 1) * productsPerPage + 1} to ${Math.min(currentPage * productsPerPage, allProducts.length)} of ${allProducts.length} products
            </div>
            <div class="pagination-controls">
                <button class="page-nav" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="pagination-numbers">
                    ${generatePaginationNumbers(totalPages)}
                </div>
                <button class="page-nav" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
    
    gamingProductsShowcase.insertAdjacentHTML('afterend', paginationHTML);
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.page-nav').forEach(btn => {
        btn.addEventListener('click', function() {
            const pageAction = this.dataset.page;
            if (pageAction === 'prev' && currentPage > 1) {
                currentPage--;
                displayProducts();
            } else if (pageAction === 'next' && currentPage < totalPages) {
                currentPage++;
                displayProducts();
            }
        });
    });
    
    document.querySelectorAll('.pagination-number').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            if (page !== currentPage) {
                currentPage = page;
                displayProducts();
            }
        });
    });
}

// Function to generate pagination numbers
function generatePaginationNumbers(totalPages) {
    const numbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        numbers.push(`
            <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}">${i}</button>
        `);
    }

    return numbers.join('');
}

// Function to show loading state
function showLoading() {
    if (gamingProductsShowcase) {
        gamingProductsShowcase.innerHTML = `
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

// Function to navigate to gaming category
function navigateToGamingCategory(category) {
    // Navigate to gaming page with category parameter
    window.location.href = `gaming.html?category=${category}`;
}

// Initialize gaming homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing gaming homepage...');
    
    // Show loading state
    showLoading();
    
    // Fetch all products from all gaming APIs
    await fetchAllGamingProducts();
    
    // Display products
    displayProducts();
    
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
            const product = allGamingProducts.find(p => p.id === productId);
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
    
    // Handle gaming category card clicks
    const gamingCategoryCards = document.querySelectorAll('.gaming-category-card');
    
    gamingCategoryCards.forEach(card => {
        const viewButton = card.querySelector('.gaming-category-btn');
        if (viewButton) {
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const href = this.getAttribute('href');
                let category = '';
                
                // Map href to category parameter
                if (href.includes('#consoles')) {
                    category = 'gaming-consoles';
                } else if (href.includes('#gaming-laptops')) {
                    category = 'laptop-gaming';
                } else if (href.includes('#gaming-monitors')) {
                    category = 'gaming-monitors';
                } else if (href.includes('#handled-gaming')) {
                    category = 'handled-gaming';
                } else if (href.includes('#console-accessories') || href.includes('#consoles-accessories')) {
                    category = 'consoles-accessories';
                } else if (href.includes('#pc-accessories') || href.includes('#pc-gaming-accessories')) {
                    category = 'pc-gaming-accessories';
                }
                
                if (category) {
                    navigateToGamingCategory(category);
                }
            });
        }
    });
    
    // Also handle any direct links in the gaming homepage
    const gamingLinks = document.querySelectorAll('a[href*="#consoles"], a[href*="#gaming-laptops"], a[href*="#gaming-monitors"], a[href*="#handled-gaming"], a[href*="#console-accessories"], a[href*="#consoles-accessories"], a[href*="#pc-accessories"], a[href*="#pc-gaming-accessories"]');
    
    gamingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let category = '';
            
            // Map href to category parameter
            if (href.includes('#consoles')) {
                category = 'gaming-consoles';
            } else if (href.includes('#gaming-laptops')) {
                category = 'laptop-gaming';
            } else if (href.includes('#gaming-monitors')) {
                category = 'gaming-monitors';
            } else if (href.includes('#handled-gaming')) {
                category = 'handled-gaming';
            } else if (href.includes('#console-accessories') || href.includes('#consoles-accessories')) {
                category = 'consoles-accessories';
            } else if (href.includes('#pc-accessories') || href.includes('#pc-gaming-accessories')) {
                category = 'pc-gaming-accessories';
            }
            
            if (category) {
                navigateToGamingCategory(category);
            }
        });
    });
});