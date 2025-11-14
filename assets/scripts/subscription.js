// Subscription Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const billingToggle = document.getElementById('billing-toggle');
    const billingOptions = document.querySelectorAll('.billing-option');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const selectPlanButtons = document.querySelectorAll('.btn-select-plan');

    // Initialize billing toggle
    let isYearly = false;

    // Handle billing toggle change
    billingToggle.addEventListener('change', function() {
        isYearly = this.checked;
        updateBillingDisplay();
        updatePrices();
    });

    // Handle billing option clicks
    billingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const billingType = this.getAttribute('data-billing');
            isYearly = billingType === 'yearly';
            billingToggle.checked = isYearly;
            updateBillingDisplay();
            updatePrices();
        });
    });

    // Update billing display
    function updateBillingDisplay() {
        billingOptions.forEach(option => {
            const billingType = option.getAttribute('data-billing');
            if ((isYearly && billingType === 'yearly') || (!isYearly && billingType === 'monthly')) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Update prices based on billing period
    function updatePrices() {
        priceAmounts.forEach(priceElement => {
            const monthlyPrice = priceElement.getAttribute('data-monthly');
            const yearlyPrice = priceElement.getAttribute('data-yearly');
            
            if (isYearly) {
                priceElement.textContent = yearlyPrice;
            } else {
                priceElement.textContent = monthlyPrice;
            }
        });
    }

    // Handle plan selection
    selectPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            const billingPeriod = isYearly ? 'yearly' : 'monthly';
            
            // Get the price for the selected plan
            const planCard = this.closest('.plan-card');
            const priceElement = planCard.querySelector('.price-amount');
            const price = priceElement.textContent;
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;
            
            // Simulate processing (replace with actual payment processing)
            setTimeout(() => {
                // Reset button state
                this.textContent = originalText;
                this.disabled = false;
                
                // Show success message
                showPlanSelected(planType, billingPeriod, price);
            }, 2000);
        });
    });

    // Show plan selected message
    function showPlanSelected(planType, billingPeriod, price) {
        // Create modal or notification
        const modal = document.createElement('div');
        modal.className = 'plan-selected-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Plan Selected!</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>You have selected the <strong>${planType.charAt(0).toUpperCase() + planType.slice(1)}</strong> plan.</p>
                        <p>Billing: <strong>${billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1)}</strong></p>
                        <p>Price: <strong>${price}/month</strong></p>
                        <p>You will be redirected to the payment page shortly.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-continue">Continue to Payment</button>
                        <button class="btn-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .plan-selected-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 1.5rem 0 1.5rem;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 1.5rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-body {
                    padding: 1rem 1.5rem;
                }
                .modal-body p {
                    margin: 0.5rem 0;
                    color: #555;
                }
                .modal-footer {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem 1.5rem 1.5rem 1.5rem;
                }
                .btn-continue, .btn-cancel {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-continue {
                    background: #007bff;
                    color: white;
                }
                .btn-continue:hover {
                    background: #0056b3;
                }
                .btn-cancel {
                    background: #6c757d;
                    color: white;
                }
                .btn-cancel:hover {
                    background: #545b62;
                }
            </style>
        `;

        // Add styles to head
        const styleElement = document.createElement('div');
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);

        // Add modal to body
        document.body.appendChild(modal);

        // Handle modal close
        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(styleElement);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Handle continue to payment
        modal.querySelector('.btn-continue').addEventListener('click', function() {
            // Redirect to payment page (replace with actual payment URL)
            window.location.href = `payment.html?plan=${planType}&billing=${billingPeriod}&price=${price}`;
        });
    }

    // Handle business form submission
    const businessForm = document.getElementById('businessForm');
    if (businessForm) {
        businessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const businessData = {
                businessName: formData.get('businessName'),
                businessType: formData.get('businessType'),
                businessAddress: formData.get('businessAddress'),
                businessPhone: formData.get('businessPhone'),
                businessEmail: formData.get('businessEmail'),
                businessDescription: formData.get('businessDescription'),
                membershipPlan: formData.get('membershipPlan')
            };
            
            // Show loading state
            const submitButton = this.querySelector('.btn-apply-membership');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Simulate form processing (replace with actual API call)
            setTimeout(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Show success message
                showFormSuccess(businessData);
                
                // Reset form
                this.reset();
            }, 2000);
        });
    }

    // Show form success message
    function showFormSuccess(businessData) {
        const modal = document.createElement('div');
        modal.className = 'form-success-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Application Submitted!</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Thank you for your interest in joining CompareHubPrices!</p>
                        <p><strong>Business:</strong> ${businessData.businessName}</p>
                        <p><strong>Plan:</strong> ${businessData.membershipPlan}</p>
                        <p>We will review your application and contact you within 2-3 business days.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-continue">Continue</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            <style>
                .form-success-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 1.5rem 0 1.5rem;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 1.5rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-body {
                    padding: 1rem 1.5rem;
                }
                .modal-body p {
                    margin: 0.5rem 0;
                    color: #555;
                }
                .modal-footer {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem 1.5rem 1.5rem 1.5rem;
                }
                .btn-continue {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #007bff;
                    color: white;
                }
                .btn-continue:hover {
                    background: #0056b3;
                }
            </style>
        `;

        // Add styles to head
        const styleElement = document.createElement('div');
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);

        // Add modal to body
        document.body.appendChild(modal);

        // Handle modal close
        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(styleElement);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-continue').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Initialize the page
    updateBillingDisplay();
    updatePrices();
});
