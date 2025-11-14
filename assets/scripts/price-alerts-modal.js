// Price Alert Modal Component for CompareHub
class PriceAlertModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.attachEventListeners();
    }

    createModalHTML() {
        // Create modal HTML structure
        const modalHTML = `
            <div class="modal fade" id="priceAlertModal" tabindex="-1" aria-labelledby="priceAlertModalLabel" aria-hidden="true" role="dialog">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content price-alert-modal-content">
                        <div class="modal-header bg-success text-white justify-content-center position-relative">
                            <h5 class="modal-title text-center w-100" id="priceAlertModalLabel">
                                <i class="fas fa-bell me-2"></i>Set Price Alert
                            </h5>
                            <button type="button" class="btn-close btn-close-white position-absolute" style="right: 15px; top: 15px;" data-bs-dismiss="modal" aria-label="Close modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <!-- Product Info Section -->
                            <div class="product-info-section mb-4">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <img id="alertProductImage" src="" alt="Product" class="product-image-modal" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                                    </div>
                                    <div class="col">
                                        <h6 id="alertProductName" class="mb-1 fw-bold">Product Name</h6>
                                        <p id="alertProductBrand" class="text-muted mb-1 small">Brand</p>
                                        <p id="alertCurrentPrice" class="text-success mb-0 fw-bold">Current Price</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Alert Form -->
                            <form id="priceAlertForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="targetPrice" class="form-label">
                                                <i class="fas fa-tag me-1"></i>Target Price (ZAR)
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text">R</span>
                                                <input type="number" class="form-control" id="targetPrice" name="targetPrice" 
                                                       placeholder="Enter target price" min="1" step="0.01" required>
                                            </div>
                                            <div class="form-text">We'll notify you when the price drops to this amount or below.</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="notificationMethod" class="form-label">
                                                <i class="fas fa-bell me-1"></i>Notification Method
                                            </label>
                                            <select class="form-select" id="notificationMethod" name="notificationMethod" required>
                                                <option value="">Select method</option>
                                                <option value="email">Email</option>
                                                <option value="browser">Browser Notification</option>
                                                <option value="both">Both Email & Browser</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="alertName" class="form-label">
                                                <i class="fas fa-edit me-1"></i>Alert Name (Optional)
                                            </label>
                                            <input type="text" class="form-control" id="alertName" name="alertName" 
                                                   placeholder="e.g., iPhone 15 Pro Max Alert">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label for="emailAddress" class="form-label">
                                                <i class="fas fa-envelope me-1"></i>Email Address
                                            </label>
                                            <input type="email" class="form-control" id="emailAddress" name="emailAddress" 
                                                   placeholder="your@email.com" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="priceIncreaseAlert" name="priceIncreaseAlert">
                                        <label class="form-check-label" for="priceIncreaseAlert">
                                            Also notify me if the price increases significantly
                                        </label>
                                    </div>
                                </div>

                                <div class="alert alert-info d-flex align-items-center" role="alert">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <div>
                                        <strong>How it works:</strong> We'll monitor this product's price across all retailers and send you a notification when it reaches your target price.
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success px-4" id="savePriceAlertBtn">
                                <i class="fas fa-bell me-2"></i>Set Price Alert
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add CSS styles
        this.addModalStyles();

        // Get modal reference
        this.modal = document.getElementById('priceAlertModal');
    }

    addModalStyles() {
        const styles = `
            <style id="price-alert-modal-styles">
                /* Price Alert Modal Styles - Isolated to prevent conflicts */
                #priceAlertModal .price-alert-modal-content {
                    border-radius: 16px;
                    border: none;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    z-index: 1055 !important; /* Higher than mobile header z-index: 1000 */
                    max-height: 90vh;
                    overflow-y: auto;
                }

                #priceAlertModal .price-alert-modal-content .modal-header {
                    border-radius: 16px 16px 0 0;
                    border-bottom: none;
                    padding: 1.5rem 2rem;
                }

                #priceAlertModal .price-alert-modal-content .modal-body {
                    padding: 2rem;
                }

                #priceAlertModal .price-alert-modal-content .modal-footer {
                    border-top: 1px solid #e9ecef;
                    padding: 1.5rem 2rem;
                    border-radius: 0 0 16px 16px;
                }

                /* Product Info Section - Scoped to modal */
                #priceAlertModal .product-info-section {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid #e9ecef;
                }

                #priceAlertModal .product-image-modal {
                    border: 2px solid #e9ecef;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                /* Form Styles - Scoped to modal */
                #priceAlertModal .form-group {
                    margin-bottom: 1.5rem;
                }

                #priceAlertModal .form-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                #priceAlertModal .form-label i {
                    color: #28a745;
                    font-size: 0.9rem;
                }

                #priceAlertModal .form-control, 
                #priceAlertModal .form-select {
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                }

                #priceAlertModal .form-control:focus, 
                #priceAlertModal .form-select:focus {
                    border-color: #28a745;
                    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
                    outline: none;
                }

                #priceAlertModal .form-control.is-invalid {
                    border-color: #dc3545;
                }

                #priceAlertModal .form-control.is-invalid:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
                }

                /* Input Group Styles - Scoped to modal */
                #priceAlertModal .input-group-text {
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-right: none;
                    color: #495057;
                    font-weight: 600;
                }

                #priceAlertModal .input-group .form-control {
                    border-left: none;
                }

                #priceAlertModal .input-group .form-control:focus {
                    border-left: none;
                }

                #priceAlertModal .form-text {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-top: 0.25rem;
                }

                /* Checkbox Styles - Scoped to modal */
                #priceAlertModal .form-check {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                #priceAlertModal .form-check-input {
                    width: 1.2em;
                    height: 1.2em;
                    margin: 0;
                }

                #priceAlertModal .form-check-input:checked {
                    background-color: #28a745;
                    border-color: #28a745;
                }

                #priceAlertModal .form-check-label {
                    font-size: 0.9rem;
                    color: #495057;
                    margin: 0;
                }

                /* Alert Info Styles - Scoped to modal */
                #priceAlertModal .alert-info {
                    background: linear-gradient(135deg, #d1ecf1, #bee5eb);
                    border: 1px solid #b8daff;
                    color: #0c5460;
                    border-radius: 8px;
                    padding: 1rem;
                }

                #priceAlertModal .alert-info i {
                    color: #0c5460;
                }

                /* Button Styles - Scoped to modal */
                #priceAlertModal .btn-success {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    border: none;
                    border-radius: 8px;
                    padding: 0.75rem 2rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
                }

                #priceAlertModal .btn-success:hover {
                    background: linear-gradient(135deg, #20c997, #17a2b8);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
                }

                #priceAlertModal .btn-outline-secondary {
                    border: 2px solid #6c757d;
                    color: #6c757d;
                    border-radius: 8px;
                    padding: 0.75rem 2rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                #priceAlertModal .btn-outline-secondary:hover {
                    background: #6c757d;
                    border-color: #6c757d;
                    color: white;
                    transform: translateY(-1px);
                }

                /* Modal Animation - Scoped to prevent conflicts */
                #priceAlertModal.modal.fade .modal-dialog {
                    transition: transform 0.3s ease-out;
                    transform: translate(0, -50px);
                }

                #priceAlertModal.modal.show .modal-dialog {
                    transform: none;
                }

                /* Removed global .price-alert-bell styles to prevent overlaying headers/menus.
                   Bell styling now relies on page-level CSS (e.g., smartphones.css, laptops.css, card.css).
                   This avoids late-injected styles with higher priority and !important from overriding page intent. */

                /* Notification Styles - Scoped to prevent conflicts */
                #priceAlertModal .alert {
                    border-radius: 8px;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                #priceAlertModal .alert-success {
                    background: linear-gradient(135deg, #d4edda, #c3e6cb);
                    color: #155724;
                    border-left: 4px solid #28a745;
                }

                #priceAlertModal .alert-danger {
                    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
                    color: #721c24;
                    border-left: 4px solid #dc3545;
                }

                #priceAlertModal .alert-info {
                    background: linear-gradient(135deg, #d1ecf1, #bee5eb);
                    color: #0c5460;
                    border-left: 4px solid #17a2b8;
                }

                /* Animation Effects - Scoped to prevent conflicts */
                @keyframes priceAlertFadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #priceAlertModal .price-alert-modal-content {
                    animation: priceAlertFadeInUp 0.3s ease-out;
                }

                /* Focus States for Accessibility - Scoped to modal */
                #priceAlertModal .form-control:focus,
                #priceAlertModal .form-select:focus,
                #priceAlertModal .btn:focus {
                    outline: 3px solid rgba(40, 167, 69, 0.5);
                    outline-offset: 2px;
                }

                /* Modal Scrolling Styles */
                #priceAlertModal .modal-dialog {
                    max-height: 90vh;
                    margin: 1rem auto;
                }

                #priceAlertModal .modal-content {
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                }

                #priceAlertModal .modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                }

                #priceAlertModal .modal-header,
                #priceAlertModal .modal-footer {
                    flex-shrink: 0;
                }

                /* Custom Scrollbar for Modal */
                #priceAlertModal .modal-body::-webkit-scrollbar {
                    width: 6px;
                }

                #priceAlertModal .modal-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                #priceAlertModal .modal-body::-webkit-scrollbar-thumb {
                    background: #28a745;
                    border-radius: 3px;
                }

                #priceAlertModal .modal-body::-webkit-scrollbar-thumb:hover {
                    background: #20c997;
                }

                /* Responsive Design - Scoped to prevent conflicts */
                @media (max-width: 768px) {
                    #priceAlertModal .modal-dialog {
                        max-height: 95vh;
                        margin: 0.5rem auto;
                    }

                    #priceAlertModal .price-alert-modal-content {
                        max-height: 95vh;
                    }

                    #priceAlertModal .price-alert-modal-content .modal-header {
                        padding: 1rem 1.5rem;
                    }
                    
                    #priceAlertModal .price-alert-modal-content .modal-body {
                        padding: 1.5rem;
                        max-height: calc(95vh - 140px);
                        overflow-y: auto;
                    }
                    
                    #priceAlertModal .price-alert-modal-content .modal-footer {
                        padding: 1rem 1.5rem;
                    }
                    
                    #priceAlertModal .product-info-section {
                        padding: 1rem;
                    }
                    
                    #priceAlertModal .product-image-modal {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    #priceAlertModal .form-group {
                        margin-bottom: 1rem;
                    }
                    
                    #priceAlertModal .form-control, 
                    #priceAlertModal .form-select {
                        padding: 0.6rem 0.8rem;
                        font-size: 0.9rem;
                    }
                    
                    #priceAlertModal .btn-success, 
                    #priceAlertModal .btn-outline-secondary {
                        padding: 0.6rem 1.5rem;
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    #priceAlertModal .modal-dialog {
                        max-height: 98vh;
                        margin: 0.25rem auto;
                    }

                    #priceAlertModal .price-alert-modal-content {
                        max-height: 98vh;
                    }

                    #priceAlertModal .price-alert-modal-content .modal-header {
                        padding: 0.75rem 1rem;
                    }
                    
                    #priceAlertModal .price-alert-modal-content .modal-body {
                        padding: 1rem;
                        max-height: calc(98vh - 120px);
                        overflow-y: auto;
                    }
                    
                    #priceAlertModal .price-alert-modal-content .modal-footer {
                        padding: 0.75rem 1rem;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    #priceAlertModal .btn-success, 
                    #priceAlertModal .btn-outline-secondary {
                        width: 100%;
                        padding: 0.75rem 1rem;
                    }
                    
                    #priceAlertModal .product-info-section {
                        padding: 0.75rem;
                    }
                    
                    #priceAlertModal .product-image-modal {
                        width: 50px !important;
                        height: 50px !important;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachEventListeners() {
        // Save button event listener
        const saveButton = document.getElementById('savePriceAlertBtn');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.handlePriceAlertSubmission());
        }

        // Form submission event listener
        const form = document.getElementById('priceAlertForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePriceAlertSubmission();
            });
        }

        // Real-time validation for target price
        const targetPriceInput = document.getElementById('targetPrice');
        if (targetPriceInput) {
            targetPriceInput.addEventListener('input', () => this.validateTargetPrice());
        }

        // Modal accessibility event listeners
        this.modal.addEventListener('show.bs.modal', () => {
            this.modal.setAttribute('aria-hidden', 'false');
            this.modal.removeAttribute('inert');
        });

        this.modal.addEventListener('hide.bs.modal', () => {
            this.modal.setAttribute('aria-hidden', 'true');
            this.modal.setAttribute('inert', '');
        });

        this.modal.addEventListener('shown.bs.modal', () => {
            // Focus the first focusable element when modal is shown
            const firstFocusable = this.modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });

        // Keyboard navigation support
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = bootstrap.Modal.getInstance(this.modal);
                if (modal) {
                    modal.hide();
                }
            }
        });

        // Trap focus within modal when it's open
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = this.modal.querySelectorAll(
                    'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    show(product) {
        console.log('PriceAlertModal.show called with product:', product);
        
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        this.currentProduct = product;
        this.populateModal(product);
        
        try {
            // Show the modal
            const bootstrapModal = new bootstrap.Modal(this.modal);
            bootstrapModal.show();
            console.log('Modal shown successfully');
        } catch (error) {
            console.error('Error showing modal:', error);
            console.log('Bootstrap available:', typeof bootstrap !== 'undefined');
            console.log('Modal element:', this.modal);
        }
    }

    populateModal(product) {
        // Get modal elements
        const productImage = document.getElementById('alertProductImage');
        const productName = document.getElementById('alertProductName');
        const productBrand = document.getElementById('alertProductBrand');
        const currentPrice = document.getElementById('alertCurrentPrice');
        const targetPriceInput = document.getElementById('targetPrice');
        const notificationMethodSelect = document.getElementById('notificationMethod');
        const alertNameInput = document.getElementById('alertName');
        const emailAddressInput = document.getElementById('emailAddress');
        const priceIncreaseCheckbox = document.getElementById('priceIncreaseAlert');
        
        // Set product information
        const imageUrl = product.imageUrl || product.image || product.img || 'https://via.placeholder.com/150?text=No+Image';
        const productNameText = product.model || product.title || 'Unknown Smartphone';
        const brandName = product.brand || 'Unknown Brand';
        const lowestPrice = this.getLowestPrice(product);
        const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 'Price not available';
        
        productImage.src = imageUrl;
        productImage.alt = productNameText;
        productName.textContent = productNameText;
        productBrand.textContent = brandName;
        currentPrice.textContent = formattedPrice;
        
        // Clear form first
        document.getElementById('priceAlertForm').reset();
        
        // Check if we're updating an existing alert
        if (this.existingAlertData) {
            // Pre-fill with existing alert data
            targetPriceInput.value = this.existingAlertData.targetPrice || '';
            notificationMethodSelect.value = this.existingAlertData.notificationMethod || '';
            alertNameInput.value = this.existingAlertData.alertName || '';
            emailAddressInput.value = this.existingAlertData.emailAddress || '';
            priceIncreaseCheckbox.checked = this.existingAlertData.priceIncreaseAlert || false;
            
            // Change modal title to indicate update mode
            const modalTitle = document.getElementById('priceAlertModalLabel');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Update Price Alert';
            }
            
            // Clear the existing alert data after use
            this.existingAlertData = null;
        } else {
            // New alert - set suggested target price (10% below current price)
            if (lowestPrice > 0) {
                const suggestedTargetPrice = Math.round(lowestPrice * 0.9);
                targetPriceInput.value = suggestedTargetPrice;
            }
            
            // Reset modal title to default
            const modalTitle = document.getElementById('priceAlertModalLabel');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-bell me-2"></i>Set Price Alert';
            }
        }
        
        targetPriceInput.setAttribute('data-product-id', product.product_id || product.id);
    }

    validateTargetPrice() {
        const targetPriceInput = document.getElementById('targetPrice');
        const currentPriceText = document.getElementById('alertCurrentPrice').textContent;
        
        // Extract current price from formatted text
        const currentPriceMatch = currentPriceText.match(/[\d,]+/);
        if (currentPriceMatch) {
            const currentPrice = parseFloat(currentPriceMatch[0].replace(/,/g, ''));
            const targetPrice = parseFloat(targetPriceInput.value);
            
            if (targetPrice > currentPrice) {
                targetPriceInput.setCustomValidity('Target price should be lower than current price');
                targetPriceInput.classList.add('is-invalid');
            } else if (targetPrice <= 0) {
                targetPriceInput.setCustomValidity('Target price must be greater than 0');
                targetPriceInput.classList.add('is-invalid');
            } else {
                targetPriceInput.setCustomValidity('');
                targetPriceInput.classList.remove('is-invalid');
            }
        }
    }

    async handlePriceAlertSubmission() {
        const form = document.getElementById('priceAlertForm');
        const formData = new FormData(form);
        
        // Validate form
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Get form data
        const targetPrice = parseFloat(formData.get('targetPrice'));
        const notificationMethod = formData.get('notificationMethod');
        const alertName = formData.get('alertName') || '';
        const emailAddress = formData.get('emailAddress');
        const priceIncreaseAlert = formData.has('priceIncreaseAlert');
        const productId = document.getElementById('targetPrice').getAttribute('data-product-id');
        
        if (!this.currentProduct) {
            this.showNotification('Error: Product not found', 'error');
            return;
        }

        // Check if we're updating an existing alert
        const isUpdate = this.existingAlertData && this.existingAlertData.alertId;
        const API_BASE_URL = 'https://acc.comparehubprices.site/price-alerts/alerts';
        const url = isUpdate ? `${API_BASE_URL}/update` : `${API_BASE_URL}/add`;

        // Create alert object
        const alertData = {
            productId: productId,
            productName: this.currentProduct.model || this.currentProduct.title || 'Unknown',
            productBrand: this.currentProduct.brand || 'Unknown',
            productImage: this.currentProduct.imageUrl || this.currentProduct.image || this.currentProduct.img || '',
            currentPrice: this.getLowestPrice(this.currentProduct),
            targetPrice: targetPrice,
            notificationMethod: notificationMethod,
            alertName: alertName,
            emailAddress: emailAddress,
            priceIncreaseAlert: priceIncreaseAlert
        };

        // Add alertId if updating
        if (isUpdate) {
            alertData.alertId = this.existingAlertData.alertId;
        }

        try {
            // Save the alert to server
            const response = await fetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alertData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save price alert');
            }

            const data = await response.json();
            
            if (data.success) {
                // Show success message
                this.showNotification(
                    isUpdate 
                        ? `Price alert updated for ${alertData.productName}!` 
                        : `Price alert set for ${alertData.productName}!`, 
                    'success'
                );
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(this.modal);
                if (modal) {
                    modal.hide();
                }

                // Update bell icon state
                this.updateBellIconState(productId, true);
                
                // Refresh price alerts page if we're on it
                if (window.location.pathname.includes('price-alerts.html') && window.priceAlertsManager) {
                    await window.priceAlertsManager.refreshAlerts();
                }
            } else {
                throw new Error(data.message || 'Failed to save price alert');
            }
        } catch (error) {
            console.error('Error saving price alert:', error);
            this.showNotification(error.message || 'Failed to save price alert. Please try again.', 'error');
        }
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getLowestPrice(product) {
        if (!product.offers || product.offers.length === 0) return 0;
        return Math.min(...product.offers.map(offer => offer.price).filter(price => typeof price === 'number' && price > 0));
    }

    async loadExistingAlerts() {
        // Load existing price alerts from server and update bell icons
        try {
            const API_BASE_URL = 'https://acc.comparehubprices.site/price-alerts/alerts';
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.alerts) {
                    data.alerts.forEach(alert => {
                        if (alert.status === 'active') {
                            this.updateBellIconState(alert.productId, true);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading existing alerts:', error);
        }
    }

    // Public methods for external control
    hide() {
        const modal = bootstrap.Modal.getInstance(this.modal);
        if (modal) {
            modal.hide();
        }
    }

    destroy() {
        // Remove modal from DOM
        if (this.modal) {
            this.modal.remove();
        }
        
        // Remove styles
        const styles = document.getElementById('price-alert-modal-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing price alert modal...');
    
    // Only initialize if modal doesn't already exist
    if (!document.getElementById('priceAlertModal')) {
        try {
            window.priceAlertModal = new PriceAlertModal();
            console.log('Price alert modal initialized successfully');
        } catch (error) {
            console.error('Error initializing price alert modal:', error);
        }
    } else {
        console.log('Price alert modal already exists');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriceAlertModal;
}

