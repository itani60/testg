// Tablets Page Functionality
const TABLET_API_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/tablets';

class TabletsPage {
    constructor(category = 'tablets') {
        this.category = category;
        this.allTablets = [];
        this.filteredTablets = [];
        this.tabletsContainer = document.querySelector('.tablets-content');
        this.sortSelect = document.getElementById('sortSelect');
        this.brandOptions = document.querySelectorAll('.brand-option');
        this.osOptions = document.querySelectorAll('.os-option');
        this.priceOptions = document.querySelectorAll('.price-option');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.filterOptions = document.querySelectorAll('.filter-options');
        
        this.selectedBrands = new Set();
        this.selectedOS = new Set();
        this.selectedPriceRange = null;
        
        // Temporary selections for Apply/Cancel functionality
        this.tempSelectedBrands = new Set();
        this.tempSelectedOS = new Set();
        this.tempSelectedPriceRange = null;
        
        // Pagination
        this.currentPage = 1;
        this.productsPerPage = 12;

        this.init(this.category);
    }

    async init(category = 'tablets') {
        await this.fetchTablets(category);
        this.addEventListeners();
        this.displayTablets(this.allTablets);
        this.loadExistingAlerts();
    }

    async fetchTablets(category = 'tablets') {
        this.showLoadingState();
        try {
            // Construct URL with category parameter
            const url = new URL(TABLET_API_URL);
            url.searchParams.append('category', category);
            
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.allTablets = this.extractTablets(data);
            this.displayTablets(this.allTablets);
        } catch (error) {
            console.error('Error fetching tablets:', error);
            this.showErrorState('Failed to load tablets. Please try again later.');
        }
    }

    extractTablets(data) {
        if (Array.isArray(data)) {
            return data;
        } else if (data.products && Array.isArray(data.products)) {
            return data.products;
        } else if (data.tablets && Array.isArray(data.tablets)) {
            return data.tablets;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    }

    addEventListeners() {
        // Sort functionality
        this.sortSelect.addEventListener('change', () => this.applyFiltersAndSort());

        // Filter button toggles
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterType = e.currentTarget.dataset.filter;
                this.toggleFilterOptions(filterType);
            });
        });

        // Brand filter options
        this.brandOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const brand = e.currentTarget.dataset.brand;
                this.toggleBrandFilter(brand);
            });
        });

        // OS filter options
        this.osOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const os = e.currentTarget.dataset.os;
                this.toggleOSFilter(os);
            });
        });

        // Price range options
        this.priceOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const priceRange = e.currentTarget.dataset.price;
                this.toggleTempPriceRangeFilter(priceRange);
            });
        });

        // Apply and Cancel buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-apply')) {
                const filterType = e.target.dataset.filter;
                this.applyFilter(filterType);
            } else if (e.target.classList.contains('btn-cancel')) {
                const filterType = e.target.dataset.filter;
                this.cancelFilter(filterType);
            } else if (e.target.classList.contains('page-nav')) {
                const pageAction = e.target.dataset.page;
                if (pageAction === 'prev' && this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                } else if (pageAction === 'next' && this.currentPage < this.getTotalPages()) {
                    this.goToPage(this.currentPage + 1);
                }
            } else if (e.target.classList.contains('price-alert-bell') || e.target.closest('.price-alert-bell')) {
                e.preventDefault();
                e.stopPropagation();
                const bell = e.target.classList.contains('price-alert-bell') ? e.target : e.target.closest('.price-alert-bell');
                const productId = bell.dataset.productId;
                this.togglePriceAlert(productId, bell);
            } else if (e.target.classList.contains('btn-compare')) {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                
                console.log('View button clicked for product:', productId);
                
                // Navigate to tablet-info.html with the product ID
                window.location.href = `tablet-info.html?id=${productId}`;
            }
        });
    }

    toggleFilterOptions(filterType) {
        // Hide all filter options
        this.filterOptions.forEach(option => {
            option.style.display = 'none';
        });

        // Show selected filter option
        const targetOption = document.getElementById(`${filterType}Options`);
        if (targetOption) {
            targetOption.style.display = targetOption.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleBrandFilter(brand) {
        if (this.tempSelectedBrands.has(brand)) {
            this.tempSelectedBrands.delete(brand);
        } else {
            this.tempSelectedBrands.add(brand);
        }
        
        // Update visual state
        const brandOption = document.querySelector(`[data-brand="${brand}"]`);
        if (brandOption) {
            brandOption.classList.toggle('active');
        }
    }

    toggleOSFilter(os) {
        if (this.tempSelectedOS.has(os)) {
            this.tempSelectedOS.delete(os);
        } else {
            this.tempSelectedOS.add(os);
        }
        
        // Update visual state
        const osOption = document.querySelector(`[data-os="${os}"]`);
        if (osOption) {
            osOption.classList.toggle('active');
        }
    }

    toggleTempPriceRangeFilter(priceRange) {
        // Only allow one price range selection at a time
        if (this.tempSelectedPriceRange === priceRange) {
            this.tempSelectedPriceRange = null;
        } else {
            this.tempSelectedPriceRange = priceRange;
        }
        
        // Update visual state - remove active from all, add to selected
        this.priceOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        if (this.tempSelectedPriceRange) {
            const selectedOption = document.querySelector(`[data-price="${this.tempSelectedPriceRange}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
        }
    }

    applyFilter(filterType) {
        // Commit temporary selections to actual selections
        if (filterType === 'brand') {
            this.selectedBrands = new Set(this.tempSelectedBrands);
        } else if (filterType === 'os') {
            this.selectedOS = new Set(this.tempSelectedOS);
        } else if (filterType === 'price') {
            this.selectedPriceRange = this.tempSelectedPriceRange;
        }

        // Hide filter options
        this.toggleFilterOptions(filterType);

        // Apply filters and sort (this will reset to page 1)
        this.applyFiltersAndSort();
    }

    cancelFilter(filterType) {
        // Revert temporary selections
        if (filterType === 'brand') {
            this.tempSelectedBrands = new Set(this.selectedBrands);
        } else if (filterType === 'os') {
            this.tempSelectedOS = new Set(this.selectedOS);
        } else if (filterType === 'price') {
            this.tempSelectedPriceRange = this.selectedPriceRange;
        }

        // Hide filter options
        this.toggleFilterOptions(filterType);
    }

    applyFiltersAndSort() {
        let tempTablets = [...this.allTablets];

        // Filter by Brand
        if (this.selectedBrands.size > 0) {
            tempTablets = tempTablets.filter(tablet =>
                tablet.brand && this.selectedBrands.has(tablet.brand.toLowerCase())
            );
        }

        // Filter by OS
        if (this.selectedOS.size > 0) {
            tempTablets = tempTablets.filter(tablet => {
                if (!tablet.specs?.Os?.['Operating System']) return false;
                const tabletOS = tablet.specs.Os['Operating System'].toLowerCase();
                return Array.from(this.selectedOS).some(os => tabletOS.includes(os.toLowerCase()));
            });
        }

        // Filter by Price Range
        if (this.selectedPriceRange) {
            const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map(Number);
            tempTablets = tempTablets.filter(tablet => {
                const tabletPrice = this.getLowestPrice(tablet);
                if (maxPrice === 5000) {
                    return tabletPrice < maxPrice; // Under R5,000
                } else if (minPrice === 30000) {
                    return tabletPrice >= minPrice; // R30,000+
                } else {
                    return tabletPrice >= minPrice && tabletPrice <= maxPrice;
                }
            });
        }

        // Sort
        const sortBy = this.sortSelect.value;
        tempTablets.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = (a.model || a.title || '').toLowerCase();
                const nameB = (b.model || b.title || '').toLowerCase();
                return nameA.localeCompare(nameB);
            } else if (sortBy === 'price-low') {
                return this.getLowestPrice(a) - this.getLowestPrice(b);
            } else if (sortBy === 'price-high') {
                return this.getLowestPrice(b) - this.getLowestPrice(a);
            } else if (sortBy === 'relevance') {
                // Default relevance sorting (by brand, then by price)
                const brandA = (a.brand || '').toLowerCase();
                const brandB = (b.brand || '').toLowerCase();
                if (brandA !== brandB) {
                    return brandA.localeCompare(brandB);
                }
                return this.getLowestPrice(a) - this.getLowestPrice(b);
            }
            return 0;
        });

        this.filteredTablets = tempTablets;
        this.currentPage = 1; // Reset to first page when filters change
        this.displayTablets(this.filteredTablets);
        this.updateResultsCount(tempTablets.length);
        
        return tempTablets;
    }

    updateResultsCount(count) {
        // This method can be used to update any results counter in the UI
        // For now, it's just a placeholder for future functionality
        console.log(`Showing ${count} tablets`);
    }


    getLowestPrice(tablet) {
        if (!tablet.offers || tablet.offers.length === 0) return 0;
        return Math.min(...tablet.offers.map(offer => offer.price).filter(price => typeof price === 'number' && price > 0));
    }

    togglePriceAlert(productId, bellElement) {
        // Get the product data
        const product = this.allTablets.find(tablet => (tablet.product_id || tablet.id) === productId);
        
        if (!product) {
            console.error('Product not found for ID:', productId);
            return;
        }

        // Show the price alert modal using the global modal instance
        if (window.priceAlertModal) {
            window.priceAlertModal.show(product);
        } else {
            console.error('Price alert modal not initialized');
        }
    }

    savePriceAlert(productId, product) {
        // Save price alert to localStorage (you can modify this to send to server)
        const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        const existingAlert = alerts.find(alert => alert.productId === productId);
        
        if (!existingAlert) {
            alerts.push({
                productId: productId,
                productName: product?.model || product?.title || 'Unknown',
                currentPrice: this.getLowestPrice(product),
                dateAdded: new Date().toISOString()
            });
            localStorage.setItem('priceAlerts', JSON.stringify(alerts));
        }
    }

    removePriceAlert(productId) {
        // Remove price alert from localStorage
        const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        const filteredAlerts = alerts.filter(alert => alert.productId !== productId);
        localStorage.setItem('priceAlerts', JSON.stringify(filteredAlerts));
    }

    loadExistingAlerts() {
        // Load existing price alerts from localStorage and update bell icons
        const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        
        alerts.forEach(alert => {
            if (alert.status === 'active') {
                this.updateBellIconState(alert.productId, true);
            }
        });
    }

    updateBellIconState(productId, isActive) {
        const bellElement = document.querySelector(`[data-product-id="${productId}"].price-alert-bell`);
        if (bellElement) {
            if (isActive) {
                bellElement.classList.add('active');
                bellElement.title = 'Price alert active - Click to remove';
            } else {
                bellElement.classList.remove('active');
                bellElement.title = 'Set Price Alert';
            }
        }
    }

    displayTablets(tablets) {
        if (tablets.length === 0) {
            this.showNoResultsState();
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(tablets.length / this.productsPerPage);
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentPageTablets = tablets.slice(startIndex, endIndex);

        // Display current page products
        this.tabletsContainer.innerHTML = currentPageTablets.map(tablet => this.createTabletCard(tablet)).join('');

        // Add pagination controls
        this.addPaginationControls(totalPages, tablets.length);
    }

    addPaginationControls(totalPages, totalProducts) {
        // Remove any existing pagination first
        this.removeExistingPagination();

        if (totalPages <= 1) return;

        const paginationHTML = `
            <div class="pagination-container">
                <div class="pagination-info">
                    Showing ${(this.currentPage - 1) * this.productsPerPage + 1} to ${Math.min(this.currentPage * this.productsPerPage, totalProducts)} of ${totalProducts} products
                </div>
                <div class="pagination-controls">
                    <button class="page-nav" data-page="prev" aria-label="Previous page" ${this.currentPage === 1 ? 'disabled' : ''}>«</button>
                    <div class="pagination-numbers">
                        ${this.generatePaginationNumbers(totalPages)}
                    </div>
                    <button class="page-nav" data-page="next" aria-label="Next page" ${this.currentPage === totalPages ? 'disabled' : ''}>»</button>
                </div>
            </div>
        `;

        this.tabletsContainer.insertAdjacentHTML('afterend', paginationHTML);
    }

    removeExistingPagination() {
        const existingPagination = document.querySelector('.pagination-container');
        if (existingPagination) {
            existingPagination.remove();
        }
    }

    generatePaginationNumbers(totalPages) {
        const numbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(`
                <button class="pagination-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="tabletsPage.goToPage(${i})">${i}</button>
            `);
        }

        return numbers.join('');
    }

    goToPage(page) {
        const filteredData = this.filteredTablets && this.filteredTablets.length > 0 
            ? this.filteredTablets 
            : this.allTablets;
        const totalPages = Math.ceil(filteredData.length / this.productsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displayTablets(filteredData);
        
        // Scroll to top of products
        this.tabletsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    getTotalPages() {
        const filteredData = this.filteredTablets && this.filteredTablets.length > 0 
            ? this.filteredTablets 
            : this.allTablets;
        return Math.ceil(filteredData.length / this.productsPerPage);
    }

    createTabletCard(tablet) {
        const lowestPrice = this.getLowestPrice(tablet);
        const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Price not available';
        const imageUrl = tablet.imageUrl || tablet.image || tablet.img || 'https://via.placeholder.com/150?text=No+Image';
        const productName = tablet.model || tablet.title || 'Unknown Tablet';
        const brandName = tablet.brand || 'Unknown Brand';

        // Extract specs
        const specs = [];
        if (tablet.specs?.Performance?.Ram) specs.push(tablet.specs.Performance.Ram);
        if (tablet.specs?.Performance?.Storage) specs.push(tablet.specs.Performance.Storage);
        if (tablet.specs?.Os?.['Operating System']) specs.push(tablet.specs.Os['Operating System']);

        const specsHtml = specs.length > 0 ? `<div class="product-specs"><span>${specs.join(' • ')}</span></div>` : '';

        // Get retailer count
        const retailerCount = tablet.offers?.length || 0;

        return `
            <div class="tablet-card">
                <a href="tablet-info.html?id=${tablet.product_id || tablet.id}" class="card-link">
                    <div class="card-image-container">
                        <img src="${imageUrl}" alt="${productName}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                        <button class="price-alert-bell" data-product-id="${tablet.product_id || tablet.id}" title="Set Price Alert">
                            <i class="fas fa-bell"></i>
                        </button>
                    </div>
                    <div class="card-content">
                        <span class="brand-badge">${brandName}</span>
                        <h3 class="product-name">${productName}</h3>
                        ${specsHtml}
                        <div class="product-price">
                            <span class="current-price">${formattedPrice}</span>
                        </div>
                        <div class="retailer-info">
                            <span>${retailerCount} retailers</span>
                        </div>
                    </div>
                </a>
              <div class="card-actions">
                  <button class="btn-compare" data-product-id="${tablet.product_id || tablet.id}">View</button>
                  <button class="btn-wishlist" data-product-id="${tablet.product_id || tablet.id}">Add to Wishlist</button>
              </div>
            </div>
        `;
    }

    showLoadingState() {
        this.tabletsContainer.innerHTML = `
            <div class="loading-state">
                <div class="modern-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h4>Loading tablets...</h4>
                <p>Please wait while we fetch the latest deals</p>
            </div>
        `;
    }

    showNoResultsState() {
        this.tabletsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-tablet-alt fa-3x mb-3"></i>
                <h4>No tablets found</h4>
                <p>Try adjusting your filters or clearing them all.</p>
            </div>
        `;
    }

    showErrorState(message) {
        this.tabletsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }


    viewProductDetails(productId) {
        // Navigate to tablet-info.html with the product ID
        window.location.href = `tablet-info.html?id=${productId}`;
    }
}

// Initialize when DOM is loaded
let tabletsPage;
document.addEventListener('DOMContentLoaded', () => {
    // Get category from URL parameters or use default
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'tablets';
    
    tabletsPage = new TabletsPage(category);
});

