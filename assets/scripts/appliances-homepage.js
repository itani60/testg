// Appliances Homepage Functionality - Load All Products from All Appliances Endpoints

// API URLs for different appliances types
const APPLIANCES_APIS = {
    'fridges': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/fridges',
    'microwaves': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/microwaves',
    'kettles': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/kettles',
    'dishwashers': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/dishwashers',
    'washing-machines': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/washing-machines',
    'air-fryers': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/air-fryers',
    'heaters': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/heaters',
    'food-preparations': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/food-preparations',
    'stoves': 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/stoves'
};

// Global variables
let allProducts = [];
let currentPage = 1;
const productsPerPage = 10;

// DOM elements
const appliancesProductsShowcase = document.querySelector('.appliances-products-showcase');

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

// Function to fetch products from all appliances APIs
async function fetchAllAppliancesProducts() {
    try {
        console.log('Fetching products from all appliances APIs...');
        const allProductsArray = [];
        
        // Fetch from all appliances APIs in parallel
        const promises = Object.entries(APPLIANCES_APIS).map(async ([category, apiUrl]) => {
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
        
        console.log(`Successfully fetched ${allProducts.length} total appliances products from all categories`);
        return allProducts;
    } catch (error) {
        console.error('Error fetching all appliances products:', error);
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
    const productCategory = product.category || 'fridges';

    // Get retailer count
    const retailerCount = product.retailers || 0;

    return `
        <div class="smartphone-card">
            <a href="appliances-info.html?category=${productCategory}" class="card-link">
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
    if (!appliancesProductsShowcase) return;
    
    if (allProducts.length === 0) {
        appliancesProductsShowcase.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No appliances products found</p>
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
    appliancesProductsShowcase.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    
    // Add pagination controls
    addPaginationControls(totalPages);
}

// Function to add pagination controls
function addPaginationControls(totalPages) {
    // Remove existing pagination
    const existingPagination = document.querySelector('.appliances-pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    if (totalPages <= 1) return;
    
    const paginationHTML = `
        <div class="appliances-pagination">
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
    
    appliancesProductsShowcase.insertAdjacentHTML('afterend', paginationHTML);
    
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
    if (appliancesProductsShowcase) {
        appliancesProductsShowcase.innerHTML = `
            <div class="loading-state">
                <div class="modern-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h4>Loading appliances products...</h4>
                <p>Please wait while we fetch the latest deals</p>
            </div>
        `;
    }
}

// Function to navigate to appliances category
function navigateToAppliancesCategory(category) {
    // Navigate to appliances page with category parameter
    window.location.href = `appliances.html?category=${category}`;
}

// Initialize appliances homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing appliances homepage...');
    
    // Show loading state
    showLoading();
    
    // Fetch all products from all appliances APIs
    await fetchAllAppliancesProducts();
    
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
            const product = allAppliancesProducts.find(p => p.id === productId);
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
            window.location.href = `appliances-info.html?category=${category}`;
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
    
    // Handle appliances category card clicks
    const appliancesCategoryCards = document.querySelectorAll('.appliances-category-card');
    
    appliancesCategoryCards.forEach(card => {
        const viewButton = card.querySelector('.appliances-category-btn');
        if (viewButton) {
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const href = this.getAttribute('href');
                let category = '';
                
                // Map href to category parameter
                if (href.includes('#fridges')) {
                    category = 'fridges';
                } else if (href.includes('#microwaves')) {
                    category = 'microwaves';
                } else if (href.includes('#kettles')) {
                    category = 'kettles';
                } else if (href.includes('#dishwashers')) {
                    category = 'dishwashers';
                } else if (href.includes('#washing-machines')) {
                    category = 'washing-machines';
                } else if (href.includes('#air-fryers')) {
                    category = 'air-fryers';
                }
                
                if (category) {
                    navigateToAppliancesCategory(category);
                }
            });
        }
    });
    
    // Also handle any direct links in the appliances homepage
    const appliancesLinks = document.querySelectorAll('a[href*="#fridges"], a[href*="#microwaves"], a[href*="#kettles"], a[href*="#dishwashers"], a[href*="#washing-machines"], a[href*="#air-fryers"]');
    
    appliancesLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            let category = '';
            
            // Map href to category parameter
            if (href.includes('#fridges')) {
                category = 'fridges';
            } else if (href.includes('#microwaves')) {
                category = 'microwaves';
            } else if (href.includes('#kettles')) {
                category = 'kettles';
            } else if (href.includes('#dishwashers')) {
                category = 'dishwashers';
            } else if (href.includes('#washing-machines')) {
                category = 'washing-machines';
            } else if (href.includes('#air-fryers')) {
                category = 'air-fryers';
            }
            
            if (category) {
                navigateToAppliancesCategory(category);
            }
        });
    });
});
