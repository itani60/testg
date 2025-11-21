/**
 * Business Management JavaScript
 * Handles product upload, viewing, and management using the new manage-business-products Lambda
 */

const BASE_URL = 'https://acc.comparehubprices.site';
const MANAGE_PRODUCTS_URL = `${BASE_URL}/business/manage-products`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProductCount();
    
    // Check if modal should be opened
    if (sessionStorage.getItem('openUploadModal') === 'true') {
        sessionStorage.removeItem('openUploadModal');
        setTimeout(() => {
            uploadProduct();
        }, 500);
    }
    
    // Setup image preview handlers
    setupImagePreviews();
});

/**
 * Setup image preview handlers for file inputs
 */
function setupImagePreviews() {
    document.querySelectorAll('input[type="file"].product-image-1, input[type="file"].product-image-2, input[type="file"].product-image-3, input[type="file"].product-image-4, input[type="file"].product-image-5, input[type="file"].product-image-6').forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size exceeds 5MB limit. Please choose a smaller image.');
                    e.target.value = '';
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    e.target.value = '';
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    const container = input.closest('.image-upload-container');
                    if (container) {
                        let previewContainer = container.querySelector('.image-preview-container');
                        if (!previewContainer) {
                            previewContainer = document.createElement('div');
                            previewContainer.className = 'image-preview-container';
                            previewContainer.style.display = 'block';
                            container.appendChild(previewContainer);
                        }
                        
                        const img = previewContainer.querySelector('.image-preview') || document.createElement('img');
                        img.className = 'image-preview';
                        img.style.cssText = 'max-width: 100%; max-height: 150px; margin-top: 10px; border-radius: 4px;';
                        img.src = e.target.result;
                        
                        if (!previewContainer.querySelector('.image-preview')) {
                            previewContainer.appendChild(img);
                        }
                        
                        // Add remove button if not exists
                        if (!previewContainer.querySelector('.remove-image-btn')) {
                            const removeBtn = document.createElement('button');
                            removeBtn.type = 'button';
                            removeBtn.className = 'btn btn-sm btn-danger mt-2 remove-image-btn';
                            removeBtn.textContent = 'Remove';
                            removeBtn.onclick = () => {
                                input.value = '';
                                previewContainer.style.display = 'none';
                            };
                            previewContainer.appendChild(removeBtn);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

/**
 * Open upload product modal
 */
function uploadProduct() {
    const modal = new bootstrap.Modal(document.getElementById('uploadProductModal'));
    modal.show();
}

/**
 * View products
 */
async function viewProducts() {
    const modal = new bootstrap.Modal(document.getElementById('viewProductsModal'));
    modal.show();
    
    // Show loading
    document.getElementById('productsLoading').style.display = 'block';
    document.getElementById('productsError').style.display = 'none';
    document.getElementById('productsContent').style.display = 'none';
    document.getElementById('productsEmpty').style.display = 'none';
    
    try {
        const response = await fetch(MANAGE_PRODUCTS_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to load products');
        }
        
        // Hide loading
        document.getElementById('productsLoading').style.display = 'none';
        
        if (data.products && data.products.length > 0) {
            // Show products
            renderProducts(data.products);
            document.getElementById('productsContent').style.display = 'block';
        } else {
            // Show empty state
            document.getElementById('productsEmpty').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsLoading').style.display = 'none';
        document.getElementById('productsError').style.display = 'block';
        document.getElementById('productsError').textContent = error.message || 'Failed to load products';
    }
}

/**
 * Render products in the modal
 */
function renderProducts(products) {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    productsList.innerHTML = products.map((product, index) => {
        const images = product.images || [];
        const imageHtml = images.slice(0, 3).map(img => {
            const imgUrl = typeof img === 'string' ? img : (img.image || img.url);
            return `<img src="${imgUrl}" alt="${product.name}" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover; margin: 5px;">`;
        }).join('');
        
        return `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name || 'Unnamed Product'}</h5>
                        <p class="card-text">${product.description || 'No description'}</p>
                        <div class="mb-2">
                            ${imageHtml}
                            ${images.length > 3 ? `<span class="text-muted">+${images.length - 3} more</span>` : ''}
                        </div>
                        <p class="text-muted small">${images.length} image(s)</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Save service/products
 */
async function saveService() {
    const form = document.getElementById('uploadProductForm');
    if (!form) return;
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get business description
    const businessDescription = document.getElementById('businessDescription').value.trim();
    if (!businessDescription) {
        alert('Business description is required');
        return;
    }
    
    // Get our services
    const ourServices = document.getElementById('ourServices').value.trim();
    
    // Collect products from all product items
    const products = [];
    const productItems = document.querySelectorAll('.product-item');
    
    for (const productItem of productItems) {
        const productName = productItem.querySelector('.product-name')?.value?.trim();
        const productDescription = productItem.querySelector('.product-description')?.value?.trim();
        
        if (!productName) continue; // Skip products without names
        
        const product = {
            name: productName,
            description: productDescription || ''
        };
        
        // Process images (up to 6)
        for (let i = 1; i <= 6; i++) {
            const imageInput = productItem.querySelector(`.product-image-${i}`);
            const priceInput = productItem.querySelector(`.product-price-${i}`);
            
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const file = imageInput.files[0];
                
                // Validate file size
                if (file.size > 5 * 1024 * 1024) {
                    alert(`Image ${i} for "${productName}" exceeds 5MB limit. Please choose a smaller image.`);
                    return;
                }
                
                // Convert to base64
                try {
                    const base64 = await fileToBase64(file);
                    product[`image${i}Base64`] = base64;
                    product[`image${i}ContentType`] = file.type;
                    
                    if (priceInput && priceInput.value) {
                        product[`image${i}Price`] = priceInput.value;
                    }
                } catch (error) {
                    console.error(`Error processing image ${i}:`, error);
                    alert(`Error processing image ${i} for "${productName}"`);
                    return;
                }
            }
        }
        
        // Only add product if it has at least one image
        if (product.image1Base64) {
            products.push(product);
        }
    }
    
    if (products.length === 0) {
        alert('Please add at least one product with at least one image');
        return;
    }
    
    // Show loading state
    const saveBtn = document.querySelector('#uploadProductModal .btn-success');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const response = await fetch(MANAGE_PRODUCTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                businessDescription: businessDescription,
                ourServices: ourServices,
                products: products
            })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to save products');
        }
        
        // Show success message
        if (typeof showSuccessToast === 'function') {
            showSuccessToast('Products saved successfully!', 'Success');
        } else {
            alert('Products saved successfully!');
        }
        
        // Close modal and reload
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadProductModal'));
        if (modal) {
            modal.hide();
        }
        
        // Reset form
        form.reset();
        document.querySelectorAll('.image-preview-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Reload product count
        loadProductCount();
        
    } catch (error) {
        console.error('Error saving products:', error);
        if (typeof showErrorToast === 'function') {
            showErrorToast(error.message || 'Failed to save products', 'Error');
        } else {
            alert('Error: ' + (error.message || 'Failed to save products'));
        }
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
}

/**
 * Convert file to base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Load product count
 */
async function loadProductCount() {
    const countElement = document.getElementById('productCount');
    if (!countElement) return;
    
    try {
        const response = await fetch(MANAGE_PRODUCTS_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            const count = data.count || 0;
            countElement.textContent = `${count} product(s)`;
        } else {
            countElement.textContent = 'Error loading count';
        }
    } catch (error) {
        console.error('Error loading product count:', error);
        countElement.textContent = 'Error loading count';
    }
}

/**
 * Add another product
 */
function addProduct() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const productItems = container.querySelectorAll('.product-item');
    const nextNumber = productItems.length + 1;
    
    const productHtml = `
        <div class="product-item mb-4 p-3 border rounded">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-primary mb-0">
                    Product/Service ${nextNumber}
                </h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeProduct(${nextNumber})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Product/Service Name *</label>
                    <input type="text" class="form-control product-name" required placeholder="e.g., Custom Birthday Cards">
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Description *</label>
                <textarea class="form-control product-description" rows="2" required placeholder="Describe what this service includes..."></textarea>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Gallery Images * (Up to 6 images)</label>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-1" accept="image/*" required>
                            <div class="form-text small">Image 1 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-1" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-2" accept="image/*" required>
                            <div class="form-text small">Image 2 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-2" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-3" accept="image/*" required>
                            <div class="form-text small">Image 3 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-3" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-4" accept="image/*" required>
                            <div class="form-text small">Image 4 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-4" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-5" accept="image/*">
                            <div class="form-text small">Image 5 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-5" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                    <div class="col-md-6 mb-2">
                        <div class="image-upload-container">
                            <input type="file" class="form-control product-image-6" accept="image/*">
                            <div class="form-text small">Image 6 (JPG, PNG, GIF - Max 5MB)</div>
                            <input type="number" class="form-control mt-2 product-price-6" placeholder="Price (optional)" step="0.01" min="0">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', productHtml);
    
    // Setup image previews for new product
    setupImagePreviews();
}

/**
 * Remove product
 */
function removeProduct(productNumber) {
    const productItems = document.querySelectorAll('.product-item');
    if (productItems.length <= 1) {
        alert('You must have at least one product');
        return;
    }
    
    const productItem = Array.from(productItems).find(item => {
        const title = item.querySelector('h6');
        return title && title.textContent.includes(`Product/Service ${productNumber}`);
    });
    
    if (productItem) {
        productItem.remove();
        
        // Renumber remaining products
        const remaining = document.querySelectorAll('.product-item');
        remaining.forEach((item, index) => {
            const title = item.querySelector('h6');
            if (title) {
                title.textContent = `Product/Service ${index + 1}`;
            }
        });
    }
}

/**
 * View full catalogue
 */
function viewFullCatalogue() {
    window.location.href = 'business_catalogue.html';
}

