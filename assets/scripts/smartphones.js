// Smartphones Page Functionality
// API Configuration - matching admin-product-management.html
const API_CONFIG = {
    BASE_URL: 'https://acc.comparehubprices.site/data',
    LIST_PRODUCTS_ENDPOINT: '/products',
};

class SmartphonesPage {
    constructor(category = 'smartphones') {
        this.category = category;
        this.allSmartphones = [];
        this.filteredSmartphones = [];
        this.smartphonesContainer = document.querySelector('.smartphones-content');
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

    async init(category = 'smartphones') {
        await this.fetchSmartphones(category);
        this.addEventListeners();
        this.loadExistingAlerts();
        
        // Load saved filters after everything is initialized
        setTimeout(() => {
            this.loadSavedFilters();
        }, 100);
    }

    async fetchSmartphones(category = 'smartphones') {
        this.showLoadingState();
        try {
            // Construct URL with category parameter using new API endpoints
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.LIST_PRODUCTS_ENDPOINT}?category=${category}`;
            
            console.log('Fetching smartphones from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            console.log('API Response:', data);
            
            // Parse response - handle different response structures
            let productsData = data;
            if (data.body) {
                productsData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
            }
            
            // Extract products array from response
            const products = productsData.products || productsData.items || productsData;
            
            console.log('Extracted products:', products);
            
            this.allSmartphones = this.extractSmartphones(products);
            console.log('Processed smartphones:', this.allSmartphones.length);
            this.displaySmartphones(this.allSmartphones);
        } catch (error) {
            console.error('Error fetching smartphones:', error);
            this.showErrorState('Failed to load smartphones. Please try again later.');
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

        // Apply, Cancel, and Clear buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-apply')) {
                const filterType = e.target.dataset.filter;
                this.applyFilter(filterType);
            } else if (e.target.classList.contains('btn-cancel')) {
                const filterType = e.target.dataset.filter;
                this.cancelFilter(filterType);
            } else if (e.target.classList.contains('btn-clear')) {
                const filterType = e.target.dataset.filter;
                this.clearFilter(filterType);
            } else if (e.target.classList.contains('filter-reset-btn')) {
                this.clearAllFilters();
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
                
                // Navigate to smartphone-info.html with the product ID
                window.location.href = `smartphones-info.html?id=${productId}`;
            } else if (e.target.classList.contains('btn-wishlist')) {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                
                // Get product data
                const product = this.allSmartphones.find(phone => (phone.product_id || phone.id) === productId);
                if (product && window.wishlistManager) {
                    window.wishlistManager.toggleWishlist(product);
                    // Update wishlist count badges
                    if (window.updateWishlistCount) {
                        window.updateWishlistCount();
                    }
                }
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
        if (this.selectedBrands.has(brand)) {
            this.selectedBrands.delete(brand);
        } else {
            this.selectedBrands.add(brand);
        }
        
        // Update visual state
        const brandOption = document.querySelector(`[data-brand="${brand}"]`);
        if (brandOption) {
            brandOption.classList.toggle('active');
        }
        
        this.applyFiltersAndSort();
    }

    toggleOSFilter(os) {
        if (this.selectedOS.has(os)) {
            this.selectedOS.delete(os);
        } else {
            this.selectedOS.add(os);
        }
        
        // Update visual state
        const osOption = document.querySelector(`[data-os="${os}"]`);
        if (osOption) {
            osOption.classList.toggle('active');
        }
        
        this.applyFiltersAndSort();
    }

    togglePriceRangeFilter(priceRange) {
        // Only allow one price range selection at a time
        if (this.selectedPriceRange === priceRange) {
            this.selectedPriceRange = null;
        } else {
            this.selectedPriceRange = priceRange;
        }
        
        // Update visual state - remove active from all, add to selected
        this.priceOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        if (this.selectedPriceRange) {
            const priceOption = document.querySelector(`[data-price="${this.selectedPriceRange}"]`);
            if (priceOption) {
                priceOption.classList.add('active');
            }
        }
        
        this.applyFiltersAndSort();
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

        // Hide filter options panel
        const targetOption = document.getElementById(`${filterType}Options`);
        if (targetOption) {
            targetOption.style.display = 'none';
        }

        // Update filter indicators
        this.updateFilterIndicators();

        // Apply filters and sort (this will reset to page 1)
        this.applyFiltersAndSort();
        
        // Save filters to localStorage
        this.saveFilters();
    }

    cancelFilter(filterType) {
        // Revert temporary selections
        if (filterType === 'brand') {
            this.tempSelectedBrands = new Set(this.selectedBrands);
            // Update visual state to match actual selections
            this.brandOptions.forEach(option => {
                const brand = option.dataset.brand;
                if (this.selectedBrands.has(brand)) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        } else if (filterType === 'os') {
            this.tempSelectedOS = new Set(this.selectedOS);
            // Update visual state to match actual selections
            this.osOptions.forEach(option => {
                const os = option.dataset.os;
                if (this.selectedOS.has(os)) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        } else if (filterType === 'price') {
            this.tempSelectedPriceRange = this.selectedPriceRange;
            // Update visual state to match actual selections
            this.priceOptions.forEach(option => {
                const priceRange = option.dataset.price;
                if (this.selectedPriceRange === priceRange) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }

        // Hide filter options panel
        const targetOption = document.getElementById(`${filterType}Options`);
        if (targetOption) {
            targetOption.style.display = 'none';
        }
    }

    applyFiltersAndSort(resetPage = true) {
        let tempSmartphones = [...this.allSmartphones];

        // Filter by Brand
        if (this.selectedBrands.size > 0) {
            tempSmartphones = tempSmartphones.filter(phone =>
                phone.brand && this.selectedBrands.has(phone.brand.toLowerCase())
            );
        }

        // Filter by OS
        if (this.selectedOS.size > 0) {
            tempSmartphones = tempSmartphones.filter(phone => {
                if (!phone.specs?.Os?.['Operating System']) return false;
                const phoneOS = phone.specs.Os['Operating System'].toLowerCase();
                const selectedOSArray = Array.from(this.selectedOS);
                
                return selectedOSArray.some(os => phoneOS.includes(os.toLowerCase()));
            });
        }

        // Filter by Price Range
        if (this.selectedPriceRange) {
            const [minPrice, maxPrice] = this.selectedPriceRange.split('-').map(Number);
            tempSmartphones = tempSmartphones.filter(phone => {
                const phonePrice = this.getLowestPrice(phone);
                if (maxPrice === 3000) {
                    return phonePrice < maxPrice; // Under R3,000
                } else {
                    return phonePrice >= minPrice && phonePrice <= maxPrice;
                }
            });
        }

        // Sort
        const sortBy = this.sortSelect.value;
        tempSmartphones.sort((a, b) => {
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

        this.filteredSmartphones = tempSmartphones;
        
        // Only reset to page 1 when filters are applied, not when loading saved state
        if (resetPage) {
            this.currentPage = 1;
        }
        
        this.displaySmartphones(this.filteredSmartphones);
        this.updateResultsCount(tempSmartphones.length);
        this.updateFilterIndicators();
        
        return tempSmartphones;
    }

    updateResultsCount(count) {
        const resultsInfo = document.getElementById('filterResultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        
        if (resultsInfo && resultsCount) {
            resultsCount.textContent = count;
            
            // Check if any filters are active
            const hasActiveFilters = this.selectedBrands.size > 0 || this.selectedOS.size > 0 || this.selectedPriceRange;
            
            // Only show results count if filters are applied
            resultsInfo.style.display = (count > 0 && hasActiveFilters) ? 'block' : 'none';
        }
        console.log(`Showing ${count} smartphones`);
    }

    // New filter management methods
    clearFilter(filterType) {
        if (filterType === 'brand') {
            this.selectedBrands.clear();
            this.tempSelectedBrands.clear();
            // Clear visual state
            this.brandOptions.forEach(option => option.classList.remove('active'));
        } else if (filterType === 'os') {
            this.selectedOS.clear();
            this.tempSelectedOS.clear();
            // Clear visual state
            this.osOptions.forEach(option => option.classList.remove('active'));
        } else if (filterType === 'price') {
            this.selectedPriceRange = null;
            this.tempSelectedPriceRange = null;
            // Clear visual state
            this.priceOptions.forEach(option => option.classList.remove('active'));
        }
        
        this.applyFiltersAndSort();
    }

    clearAllFilters() {
        // Clear all selected filters
        this.selectedBrands.clear();
        this.selectedOS.clear();
        this.selectedPriceRange = null;
        
        // Clear temporary selections
        this.tempSelectedBrands.clear();
        this.tempSelectedOS.clear();
        this.tempSelectedPriceRange = null;
        
        // Clear visual states
        this.brandOptions.forEach(option => option.classList.remove('active'));
        this.osOptions.forEach(option => option.classList.remove('active'));
        this.priceOptions.forEach(option => option.classList.remove('active'));
        
        // Hide all filter options
        this.filterOptions.forEach(option => option.style.display = 'none');
        
        this.applyFiltersAndSort();
        
        // Clear saved filters from localStorage
        this.clearSavedFilters();
    }

    updateFilterIndicators() {
        // Update filter button highlighting
        const brandBtn = document.querySelector('[data-filter="brand"]');
        const osBtn = document.querySelector('[data-filter="os"]');
        const priceBtn = document.querySelector('[data-filter="price"]');
        const resetBtn = document.getElementById('resetAllFilters');
        
        // Highlight brand button if filters are applied
        if (brandBtn) {
            if (this.selectedBrands.size > 0) {
                brandBtn.classList.add('filter-active');
            } else {
                brandBtn.classList.remove('filter-active');
            }
        }
        
        // Highlight OS button if filters are applied
        if (osBtn) {
            if (this.selectedOS.size > 0) {
                osBtn.classList.add('filter-active');
            } else {
                osBtn.classList.remove('filter-active');
            }
        }
        
        // Highlight price button if filters are applied
        if (priceBtn) {
            if (this.selectedPriceRange) {
                priceBtn.classList.add('filter-active');
            } else {
                priceBtn.classList.remove('filter-active');
            }
        }
        
        // Show/hide reset button
        const hasActiveFilters = this.selectedBrands.size > 0 || this.selectedOS.size > 0 || this.selectedPriceRange;
        if (resetBtn) {
            resetBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
        }
    }


    getPriceRangeText(priceRange) {
        const ranges = {
            '0-3000': 'Under R3,000',
            '3000-8000': 'R3,000 - R8,000',
            '8000-15000': 'R8,000 - R15,000',
            '15000-25000': 'R15,000 - R25,000'
        };
        return ranges[priceRange] || priceRange;
    }

    // Filter persistence methods
    saveFilters() {
        const filterState = {
            selectedBrands: Array.from(this.selectedBrands),
            selectedOS: Array.from(this.selectedOS),
            selectedPriceRange: this.selectedPriceRange,
            currentPage: this.currentPage,
            category: this.category
        };
        localStorage.setItem('smartphoneFilters', JSON.stringify(filterState));
    }

    loadSavedFilters() {
        try {
            const savedFilters = localStorage.getItem('smartphoneFilters');
            
            if (savedFilters) {
                const filterState = JSON.parse(savedFilters);
                
                // Only restore filters if it's the same category
                if (filterState.category === this.category) {
                    this.selectedBrands = new Set(filterState.selectedBrands || []);
                    this.selectedOS = new Set(filterState.selectedOS || []);
                    this.selectedPriceRange = filterState.selectedPriceRange || null;
                    this.currentPage = filterState.currentPage || 1;
                    
                    // Update visual states
                    this.updateVisualStates();
                    
                    // Apply filters if any are active
                    const hasActiveFilters = this.selectedBrands.size > 0 || this.selectedOS.size > 0 || this.selectedPriceRange;
                    
                    if (hasActiveFilters) {
                        this.applyFiltersAndSort(false); // Don't reset page when loading saved state
                    } else {
                        // If no filters, display all smartphones
                        this.displaySmartphones(this.allSmartphones);
                    }
                    
                    // Update filter indicators to show active state
                    this.updateFilterIndicators();
                }
            }
        } catch (error) {
            console.error('Error loading saved filters:', error);
            // Clear invalid saved filters
            localStorage.removeItem('smartphoneFilters');
        }
    }

    updateVisualStates() {
        // Update brand filter visual states
        this.brandOptions.forEach(option => {
            const brand = option.dataset.brand;
            if (this.selectedBrands.has(brand)) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Update OS filter visual states
        this.osOptions.forEach(option => {
            const os = option.dataset.os;
            if (this.selectedOS.has(os)) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Update price filter visual states
        this.priceOptions.forEach(option => {
            const priceRange = option.dataset.price;
            if (this.selectedPriceRange === priceRange) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    clearSavedFilters() {
        localStorage.removeItem('smartphoneFilters');
    }


    getLowestPrice(phone) {
        if (!phone.offers || phone.offers.length === 0) return 0;
        return Math.min(...phone.offers.map(offer => offer.price).filter(price => typeof price === 'number' && price > 0));
    }

    togglePriceAlert(productId, bellElement) {
        // Get the product data
        const product = this.allSmartphones.find(phone => (phone.product_id || phone.id) === productId);
        
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

    displaySmartphones(smartphones) {
        if (smartphones.length === 0) {
            this.showNoResultsState();
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(smartphones.length / this.productsPerPage);
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentPageSmartphones = smartphones.slice(startIndex, endIndex);

        // Display current page products
        this.smartphonesContainer.innerHTML = currentPageSmartphones.map(phone => this.createSmartphoneCard(phone)).join('');

        // Add pagination controls
        this.addPaginationControls(totalPages, smartphones.length);
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

        this.smartphonesContainer.insertAdjacentHTML('afterend', paginationHTML);
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
                        onclick="smartphonesPage.goToPage(${i})">${i}</button>
            `);
        }

        return numbers.join('');
    }

    goToPage(page) {
        const filteredData = this.filteredSmartphones && this.filteredSmartphones.length > 0 
            ? this.filteredSmartphones 
            : this.allSmartphones;
        const totalPages = Math.ceil(filteredData.length / this.productsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displaySmartphones(filteredData);
        
        // Save current page to localStorage
        this.saveFilters();
        
        // Scroll to top of products
        this.smartphonesContainer.scrollIntoView({ behavior: 'smooth' });
    }

    getTotalPages() {
        const filteredData = this.filteredSmartphones && this.filteredSmartphones.length > 0 
            ? this.filteredSmartphones 
            : this.allSmartphones;
        return Math.ceil(filteredData.length / this.productsPerPage);
    }

    createSmartphoneCard(phone) {
        const lowestPrice = this.getLowestPrice(phone);
        const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Price not available';
        const imageUrl = phone.imageUrl || phone.image || phone.img || 'https://via.placeholder.com/150?text=No+Image';
        const productName = phone.model || phone.title || 'Unknown Smartphone';
        const brandName = phone.brand || 'Unknown Brand';

        // Extract specs
        const specs = [];
        if (phone.specs?.Performance?.Ram) specs.push(phone.specs.Performance.Ram);
        if (phone.specs?.Performance?.Storage) specs.push(phone.specs.Performance.Storage);
        if (phone.specs?.Os?.['Operating System']) specs.push(phone.specs.Os['Operating System']);

        const specsHtml = specs.length > 0 ? `<div class="product-specs"><span>${specs.join(' • ')}</span></div>` : '';

        // Get retailer count
        const retailerCount = phone.offers?.length || 0;

        return `
            <div class="smartphone-card">
                <div class="card-image-container">
                    <img src="${imageUrl}" alt="${productName}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                    <button class="price-alert-bell" data-product-id="${phone.product_id || phone.id}" title="Set Price Alert">
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
                <div class="card-actions">
                    <button class="btn-compare" data-product-id="${phone.product_id || phone.id}">View</button>
                    <button class="btn-wishlist" data-product-id="${phone.product_id || phone.id}">Add to Wishlist</button>
                </div>
            </div>
        `;
    }

    showLoadingState() {
        this.smartphonesContainer.innerHTML = `
            <div class="loading-state">
                <div class="modern-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h4>Loading smartphones...</h4>
                <p>Please wait while we fetch the latest deals</p>
            </div>
        `;
    }

    showNoResultsState() {
        this.smartphonesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-mobile-alt fa-3x mb-3"></i>
                <h4>No smartphones found</h4>
                <p>Try adjusting your filters or clearing them all.</p>
            </div>
        `;
    }

    showErrorState(message) {
        this.smartphonesContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }


    viewProductDetails(productId) {
        // Navigate to smartphones-info.html with the product ID
        window.location.href = `smartphones-info.html?id=${productId}`;
    }
}

// Initialize when DOM is loaded
let smartphonesPage;
document.addEventListener('DOMContentLoaded', () => {
    // Get category from URL parameters or use default
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'smartphones';
    
    smartphonesPage = new SmartphonesPage(category);
    // Make it globally available for wishlist
    window.smartphonesPage = smartphonesPage;
});
