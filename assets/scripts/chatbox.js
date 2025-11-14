// Chatbox Component for CompareHub
class Chatbox {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatboxHTML();
        this.attachEventListeners();
        this.loadWelcomeMessage();
    }

    createChatboxHTML() {
        // Create chatbox container
        const chatboxHTML = `
            <div id="chatbox-container" class="chatbox-container">
                <!-- Chatbox Toggle Button -->
                <div id="chatbox-toggle" class="chatbox-toggle">
                    <i class="fas fa-comments"></i>
                    <span class="chatbox-badge">1</span>
                </div>

                <!-- Chatbox Window -->
                <div id="chatbox-window" class="chatbox-window">
                    <!-- Chatbox Header -->
                    <div class="chatbox-header">
                        <div class="chatbox-header-info">
                            <div class="chatbox-avatar">
                                <i class="fas fa-headset"></i>
                            </div>
                            <div class="chatbox-header-text">
                                <h4>CompareHubPrices Support</h4>
                                <span class="chatbox-status">Online</span>
                            </div>
                        </div>
                        <div class="chatbox-controls">
                            <button id="chatbox-minimize" class="chatbox-control-btn">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button id="chatbox-close" class="chatbox-control-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Chatbox Messages -->
                    <div id="chatbox-messages" class="chatbox-messages">
                        <!-- Messages will be dynamically added here -->
                    </div>

                    <!-- Chatbox Input -->
                    <div class="chatbox-input-container">
                        <div class="chatbox-input-wrapper">
                            <input type="text" id="chatbox-input" class="chatbox-input" placeholder="Type your message...">
                            <button id="chatbox-send" class="chatbox-send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="chatbox-quick-actions">
                            <button class="quick-action-btn" data-action="pricing">
                                <i class="fas fa-tags"></i>
                                Pricing
                            </button>
                            <button class="quick-action-btn" data-action="support">
                                <i class="fas fa-question-circle"></i>
                                Support
                            </button>
                            <button class="quick-action-btn" data-action="whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', chatboxHTML);

        // Add CSS styles
        this.addChatboxStyles();
    }

    addChatboxStyles() {
        const styles = `
            <style id="chatbox-styles">
                /* Chatbox Container */
                .chatbox-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                /* Chatbox Toggle Button */
                .chatbox-toggle {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #007bff, #0056b3 );
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(234, 49, 12, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .chatbox-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(201, 43, 32, 0.4);
                }

                .chatbox-toggle i {
                    color: white;
                    font-size: 24px;
                }

                .chatbox-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }

                /* Chatbox Window */
                .chatbox-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(32, 201, 151, 0.1);
                }

                .chatbox-window.open {
                    display: flex;
                    animation: chatboxSlideIn 0.3s ease-out;
                }

                @keyframes chatboxSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Chatbox Header */
                .chatbox-header {
                    background: linear-gradient(35deg, #007bff , #0056b3 );
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chatbox-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .chatbox-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chatbox-avatar i {
                    font-size: 18px;
                }

                .chatbox-header-text h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .chatbox-status {
                    font-size: 12px;
                    opacity: 0.9;
                }

                .chatbox-controls {
                    display: flex;
                    gap: 8px;
                }

                .chatbox-control-btn {
                    width: 30px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }

                .chatbox-control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                /* Chatbox Messages */
                .chatbox-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    background: #f8f9fa;
                }

                .chatbox-message {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }

                .chatbox-message.bot {
                    background: white;
                    color: #333;
                    align-self: flex-start;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .chatbox-message.user {
                    background: linear-gradient(45deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    align-self: flex-end;
                }

                .chatbox-message-time {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 4px;
                }

                /* Chatbox Input */
                .chatbox-input-container {
                    padding: 15px 20px;
                    background: white;
                    border-top: 1px solid #e9ecef;
                }

                .chatbox-input-wrapper {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .chatbox-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 25px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.3s ease;
                }

                .chatbox-input:focus {
                    border-color: #0056b3 100%;
                }

                .chatbox-send-btn {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(45deg, #007bff , #0056b3 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .chatbox-send-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(32, 201, 151, 0.3);
                }

                .chatbox-send-btn i {
                    font-size: 16px;
                }

                /* Quick Actions */
                .chatbox-quick-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .quick-action-btn {
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                    color: #6c757d;
                }

                .quick-action-btn:hover {
                    background: #007bff 0%;
                    color: white;
                    border-color: #007bff 0%;
                    transform: translateY(-2px);
                }

                .quick-action-btn i {
                    font-size: 12px;
                }

                /* Responsive Design */
                @media (max-width: 480px) {
                    .chatbox-container {
                        bottom: 15px;
                        right: 15px;
                    }

                    .chatbox-window {
                        width: calc(100vw - 30px);
                        height: calc(100vh - 100px);
                        bottom: 85px;
                        right: 0;
                        left: 0;
                        margin: 0 auto;
                    }

                    .chatbox-toggle {
                        width: 55px;
                        height: 55px;
                    }

                    .chatbox-toggle i {
                        font-size: 22px;
                    }
                }

                /* Typing Indicator */
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: white;
                    border-radius: 18px;
                    border: 1px solid #e9ecef;
                    align-self: flex-start;
                    max-width: 80px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #007bff 0%;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }

                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typing {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    attachEventListeners() {
        // Toggle chatbox
        document.getElementById('chatbox-toggle').addEventListener('click', () => {
            this.toggleChatbox();
        });

        // Close chatbox
        document.getElementById('chatbox-close').addEventListener('click', () => {
            this.closeChatbox();
        });

        // Minimize chatbox
        document.getElementById('chatbox-minimize').addEventListener('click', () => {
            this.closeChatbox();
        });

        // Send message
        document.getElementById('chatbox-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        document.getElementById('chatbox-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
    }

    toggleChatbox() {
        const window = document.getElementById('chatbox-window');
        if (this.isOpen) {
            this.closeChatbox();
        } else {
            this.openChatbox();
        }
    }

    openChatbox() {
        const window = document.getElementById('chatbox-window');
        const toggle = document.getElementById('chatbox-toggle');
        
        window.classList.add('open');
        toggle.style.display = 'none';
        this.isOpen = true;
        
        // Hide badge when opened
        document.querySelector('.chatbox-badge').style.display = 'none';
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatbox-input').focus();
        }, 300);
    }

    closeChatbox() {
        const window = document.getElementById('chatbox-window');
        const toggle = document.getElementById('chatbox-toggle');
        
        window.classList.remove('open');
        toggle.style.display = 'flex';
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chatbox-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                this.handleBotResponse(message);
            }, 1000);
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbox-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbox-message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div>${content}</div>
            <div class="chatbox-message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ content, sender, time });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbox-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleBotResponse(userMessage) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const responses = this.getBotResponses(userMessage.toLowerCase());
            this.addMessage(responses, 'bot');
        }, 1500);
    }

    getBotResponses(message) {
        const lowerMessage = message.toLowerCase();
        
        // About CompareHubPrices
        if (lowerMessage.includes('about') || lowerMessage.includes('what is') || lowerMessage.includes('company')) {
            return "CompareHubPrices is a comprehensive price comparison platform that helps users find the best deals on electronics and tech products across South Africa. We started this year with a clear vision to create a platform that compares products from different retailers, showing price comparisons and detailed specifications. Our main goal is to provide users with essential features including wishlist functionality and price drop alerts, making it easier for consumers to track their favorite products and get notified when prices drop.";
        }
        
        // How CompareHubPrices Works
        if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('function'))) {
            return "CompareHubPrices works by aggregating product information and prices from multiple retailers across South Africa. Here's how it works:\n\n1. **Search & Compare**: Browse products by category or search for specific items\n2. **Price Comparison**: We show prices from different retailers side by side\n3. **Product Details**: View detailed specifications, reviews, and availability\n4. **Save & Track**: Add products to your wishlist and set price alerts\n5. **Purchase**: Click through to the retailer's website to complete your purchase\n\nWe update our price database multiple times daily to ensure you have the most current pricing information.";
        }
        
        // Mission & Vision
        if (lowerMessage.includes('mission') || lowerMessage.includes('vision') || lowerMessage.includes('goal')) {
            return "**Our Mission**: To simplify the shopping experience by providing consumers with transparent, comprehensive price comparisons and product information, enabling them to make confident, informed purchasing decisions.\n\n**Our Vision**: To become the most trusted and comprehensive price comparison platform in South Africa, known for our accuracy, transparency, and commitment to consumer empowerment.\n\n**Our Values**: Transparency, Accuracy, User-Centric approach, and Innovation guide everything we do.";
        }
        
        // Privacy Policy
        if (lowerMessage.includes('privacy') || lowerMessage.includes('data') || lowerMessage.includes('personal information')) {
            return "**Privacy Protection**: Your privacy is important to us. We only collect basic information (name and email) when you register. We don't collect telephone numbers or demographic information.\n\n**Data Usage**: We use your information to create and manage your account, send email newsletters (if opted in), provide personalized price comparisons, and improve our service.\n\n**Security**: We use administrative, technical, and physical security measures to protect your personal information.\n\n**Your Rights**: You have the right to access, rectify, delete, and restrict processing of your personal data. You can also request data portability and object to processing.\n\nFor complete details, visit our Privacy Policy page.";
        }
        
        // Terms of Service
        if (lowerMessage.includes('terms') || lowerMessage.includes('agreement') || lowerMessage.includes('conditions')) {
            return "**Terms of Service**: By using CompareHubPrices, you agree to our terms which include:\n\n• **Acceptable Use**: Use our service legally and don't violate others' rights\n• **Account Responsibility**: Maintain accurate information and keep credentials secure\n• **Intellectual Property**: Our content is protected by copyright laws\n• **Third-Party Services**: We're not responsible for retailer websites or external services\n• **Disclaimers**: Service provided 'as is' with reasonable efforts for accuracy\n\nFor the complete terms, visit our Terms of Service page.";
        }
        
        // Pricing & Free Service
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('free') || lowerMessage.includes('expensive')) {
            return "**CompareHubPrices is completely FREE!** 🎉\n\n• No subscription fees or hidden costs\n• Free price comparisons across multiple retailers\n• Free wishlist functionality\n• Free price drop alerts\n• Free account creation\n\nWe're able to offer our service for free because we may earn a commission from retailers when you click through our site and make a purchase. This doesn't affect the price you pay and helps us continue providing and improving our comparison service.";
        }
        
        // Account & Registration
        if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
            return "**Account Benefits**:\n\n• **Wishlist**: Save products for later viewing\n• **Price Alerts**: Get notified when prices drop\n• **Personalized Experience**: Better product recommendations\n• **Purchase History**: Track your comparison history\n\n**Registration**: Click the 'Login' button in the top navigation, then select 'Register'. You only need your name and email address. No phone numbers or demographic information required.\n\n**Account Security**: You're responsible for maintaining your password security. We'll never ask for your password via email or phone.";
        }
        
        // Wishlist Features
        if (lowerMessage.includes('wishlist') || lowerMessage.includes('save') || lowerMessage.includes('favorite') || lowerMessage.includes('bookmark')) {
            return "**Wishlist Features**:\n\n• **Add Products**: Click the heart icon next to any product\n• **Unlimited Items**: No limit on how many products you can save\n• **Easy Access**: View your wishlist from your profile menu\n• **Price Tracking**: Monitor price changes on saved items\n• **Account Required**: You need to be logged in to use this feature\n\n**How to Use**: Simply browse products and click the heart icon to add them to your wishlist. You can access your wishlist anytime from your profile menu.";
        }
        
        // Price Alerts
        if (lowerMessage.includes('alert') || lowerMessage.includes('notification') || lowerMessage.includes('price drop') || lowerMessage.includes('notify')) {
            return "**Price Alerts**:\n\n• **Set Alerts**: Create alerts for any product when logged in\n• **Target Price**: Set your desired price threshold\n• **Email Notifications**: Get notified when prices drop to your target\n• **Multiple Alerts**: Set alerts for as many products as you want\n• **Easy Management**: View and manage all your alerts from your profile\n\n**How to Set**: Look for the bell icon next to products when you're logged in. Set your target price and we'll email you when it drops!";
        }
        
        // Contact & Support
        if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem') || lowerMessage.includes('contact')) {
            return "**Support Options**:\n\n• **Live Chat**: I'm here to help right now! 😊\n• **WhatsApp**: +27632803758 for immediate assistance\n• **Contact Form**: Use our contact form for detailed inquiries\n• **FAQs**: Check our FAQ page for common questions\n• **Response Time**: We aim to respond within 24 hours during business days\n\n**Technical Issues**: If you encounter problems, try refreshing the page first. For persistent issues, contact our support team with details about your browser and any error messages.";
        }
        
        // Retailers & Shopping
        if (lowerMessage.includes('retailer') || lowerMessage.includes('store') || lowerMessage.includes('shop') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
            return "**How Shopping Works**:\n\n• **We Don't Sell**: CompareHubPrices doesn't sell products directly\n• **Price Comparison**: We show prices from major South African retailers\n• **Retailer Links**: Click through to the retailer's website to purchase\n• **No Transactions**: We don't process payments or handle transactions\n• **Retailer Responsibility**: All purchases are handled directly by the retailer\n\n**Important**: Always verify product information and final prices on the retailer's website before purchasing, as prices can change frequently.";
        }
        
        // Technical & Browser Support
        if (lowerMessage.includes('browser') || lowerMessage.includes('technical') || lowerMessage.includes('mobile') || lowerMessage.includes('device')) {
            return "**Technical Support**:\n\n• **Browser Support**: Works with Chrome, Firefox, Safari, Edge, and Opera\n• **Mobile Friendly**: Fully responsive and optimized for mobile devices\n• **Latest Versions**: We recommend using the latest browser version\n• **Technical Issues**: Try refreshing the page first\n• **Contact Support**: For persistent issues, contact us with browser details and error messages\n\n**Mobile Experience**: CompareHubPrices is fully responsive and works great on smartphones and tablets!";
        }
        
        // Categories & Products
        if (lowerMessage.includes('category') || lowerMessage.includes('product') || lowerMessage.includes('electronics') || lowerMessage.includes('tech')) {
            return "**Product Categories**:\n\n• **Smartphones & Tablets**: Latest mobile devices and accessories\n• **Laptops & Accessories**: Windows, Mac, and Chromebook options\n• **Wearables**: Smartwatches and fitness trackers\n• **TV & Streaming**: Televisions and streaming devices\n• **Audio**: Headphones, speakers, and sound systems\n• **Gaming**: Consoles, controllers, and gaming accessories\n• **Networking**: Wi-Fi and networking equipment\n• **Appliances**: Home and kitchen appliances\n\nBrowse by category or use our search function to find specific products!";
        }
        
        // Default response with helpful suggestions
        return "Thanks for your message! I'm here to help with CompareHubPrices. Here are some things I can help you with:\n\n• **About CompareHubPrices** - Learn about our platform\n• **How it works** - Understand our price comparison process\n• **Account features** - Wishlist, alerts, and registration\n• **Privacy & Terms** - Data protection and service terms\n• **Contact support** - Get help via WhatsApp or contact form\n• **Technical issues** - Browser support and troubleshooting\n\nWhat would you like to know more about?";
    }

    handleQuickAction(action) {
        switch (action) {
            case 'pricing':
                this.addMessage('Tell me about CompareHubPrices pricing', 'user');
                setTimeout(() => {
                    this.handleBotResponse('Tell me about CompareHubPrices pricing');
                }, 500);
                break;
                
            case 'support':
                this.addMessage('I need support', 'user');
                setTimeout(() => {
                    this.handleBotResponse('I need support');
                }, 500);
                break;
                
            case 'whatsapp':
                // Open WhatsApp
                const whatsappNumber = '27632803758';
                const defaultMessage = 'Hello! I need help with CompareHubPrices.';
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
                window.open(whatsappUrl, '_blank');
                break;
        }
    }

    loadWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Hi! I'm your CompareHubPrices assistant. How can I help you today?", 'bot');
        }, 1000);
    }

    // Public methods for external control
    show() {
        if (!this.isOpen) {
            this.openChatbox();
        }
    }

    hide() {
        if (this.isOpen) {
            this.closeChatbox();
        }
    }

    addCustomMessage(content, sender = 'bot') {
        this.addMessage(content, sender);
    }
}

// Initialize chatbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if chatbox doesn't already exist
    if (!document.getElementById('chatbox-container')) {
        window.chatbox = new Chatbox();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Chatbox;
}
