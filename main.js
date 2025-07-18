class AdvancedChatInterface {
    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        
        this.isTyping = false;
        this.messageCount = 0;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme();
        
        // Message history for improved conversation tracking
        this.messageHistory = [];
        
        // Enhanced responses with formatting
        this.responses = [
            {
                type: 'greeting',
                content: "Hello! I'm BGPT, Dr. Brett's AI Coaching Assistant. I'm here to help you elevate your game! 🚀"
            },
            {
                type: 'presence',
                content: "**Presence** is about being fully engaged in the current moment. Here are the key aspects:\n\n• Mindful awareness of your surroundings\n• Focus on immediate actions and goals\n• Letting go of past and future concerns\n\nWould you like to learn specific techniques for improving presence?"
            },
            {
                type: 'goals',
                content: "Setting tough goals requires a strategic approach:\n\n1. **Dream Big**: Envision your ultimate achievement\n2. **Break it Down**: Create smaller, manageable milestones\n3. **Timeline**: Set specific deadlines for each step\n4. **Accountability**: Share your goals with others\n5. **Track Progress**: Monitor and celebrate small wins\n\nWhat type of goal would you like to work on?"
            },
            {
                type: 'fundamentals',
                content: "The **5 Fundamentals** are core principles for success:\n\n1. **Mindset**: Cultivate a growth-oriented perspective\n2. **Discipline**: Build consistent, positive habits\n3. **Focus**: Maintain clarity on priorities\n4. **Resilience**: Bounce back from setbacks\n5. **Excellence**: Pursue continuous improvement\n\nWhich fundamental would you like to explore further?"
            },
            {
                type: 'discipline',
                content: "**Discipline** is about building consistent habits that align with your goals. Here's how to improve it:\n\n• Start small with manageable commitments\n• Create a structured routine and stick to it\n• Track your progress visually\n• Build accountability systems\n• Reward consistency over perfection\n\nWhich area of discipline would you like to focus on first?"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.messageInput.focus();
        this.setupPromptButtons();
        this.addInitialDelay();
        this.setupCustomEventListeners();
        this.optimizePageLoad();
    }
    
    optimizePageLoad() {
        // Preload essential images
        const imagesToPreload = ['rma-logo.svg'];
        const preloader = document.getElementById('resource-preloader');
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
            if (preloader) preloader.appendChild(img);
        });
        
        // Add page load timestamp for performance tracking
        window.pageLoadTime = Date.now();
        
        // Mark DOM as fully loaded
        document.documentElement.classList.add('dom-loaded');
    }
    
    setupCustomEventListeners() {
        // Create custom events for premium features
        this.messageSentEvent = new CustomEvent('bgpt-message-sent', { 
            detail: { message: '', sender: '' },
            bubbles: true 
        });
        
        this.botResponseEvent = new CustomEvent('bgpt-bot-response', { 
            detail: { message: '' },
            bubbles: true 
        });
        
        this.messageAddedEvent = new CustomEvent('bgpt-message-added', { 
            detail: { element: null },
            bubbles: true 
        });
    }
    
    setupPromptButtons() {
        const promptButtons = document.querySelectorAll('.prompt-btn');
        promptButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prompt = button.getAttribute('data-prompt');
                this.handlePromptClick(prompt);
            });
        });
    }
    
    handlePromptClick(prompt) {
        this.hideWelcomeScreen();
        this.addMessage(prompt, 'user');
        
        // Show typing indicator
        setTimeout(() => {
            this.showTypingIndicator();
        }, 300);
        
        // Generate response based on prompt
        const responseDelay = 1200 + Math.random() * 1000;
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generatePromptResponse(prompt);
        }, responseDelay);
    }
    
    generatePromptResponse(prompt) {
        let response;
        let context = '';
        
        if (prompt.includes('Presence')) {
            response = this.responses.find(r => r.type === 'presence').content;
            context = 'presence';
        } else if (prompt.includes('goal')) {
            response = this.responses.find(r => r.type === 'goals').content;
            context = 'goals';
        } else if (prompt.includes('Fundamentals')) {
            response = this.responses.find(r => r.type === 'fundamentals').content;
            context = 'fundamentals';
        } else if (prompt.includes('discipline')) {
            response = this.responses.find(r => r.type === 'discipline').content;
            context = 'fundamentals'; // Use fundamentals context for discipline
        } else {
            response = this.responses.find(r => r.type === 'greeting').content;
            context = 'default';
        }
        
        this.addFormattedMessage(response, 'bot', context);
    }
    
    addFormattedMessage(message, sender, context = 'default') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}${context ? ' context-' + context : ''}`;
        
        const currentTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Convert markdown-style formatting to HTML
        const formattedContent = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n•/g, '</p><ul><li>')
            .replace(/\n(\d+)\./g, '</p><ol><li>')
            .replace(/\n(?![•\d])/g, '</li><li>')
            .split('</p>').join('</p><p>');
        
        if (sender === 'user') {
            messageElement.innerHTML = `
                <div class="message-bubble">
                    ${this.escapeHtml(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
            
            // Track user message for conversation history
            this.messageHistory.push({ sender: 'user', message, timestamp: new Date() });
            
            // Dispatch message sent event for premium features
            this.messageSentEvent.detail.message = message;
            this.messageSentEvent.detail.sender = 'user';
            document.dispatchEvent(this.messageSentEvent);
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">B</div>
                <div class="message-bubble">
                    <p>${formattedContent}</p>
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
            
            // Track bot message for conversation history
            this.messageHistory.push({ sender: 'bot', message, timestamp: new Date() });
            
            // Dispatch bot response event for premium features
            this.botResponseEvent.detail.message = message;
            document.dispatchEvent(this.botResponseEvent);
        }
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        this.addMessageEffect(messageElement);
        
        // Dispatch message added event for premium features
        this.messageAddedEvent.detail.element = messageElement;
        document.dispatchEvent(this.messageAddedEvent);
    }
    
    addInitialDelay() {
        // Add a slight delay before showing the interface as fully ready
        setTimeout(() => {
            this.messageInput.placeholder = "Type your message...";
        }, 1000);
    }
    
    bindEvents() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Input field changes
        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
            this.addInputAnimation();
        });
        
        // Focus effects
        this.messageInput.addEventListener('focus', () => {
            this.addFocusEffect();
        });
        
        this.messageInput.addEventListener('blur', () => {
            this.removeFocusEffect();
        });
        
        // Settings and theme buttons
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showNotification('Settings panel coming soon! 🔧');
        });
        
        document.getElementById('themeBtn').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
        
        if (hasText && !this.isTyping) {
            this.sendButton.style.transform = 'translateY(-2px) scale(1.05)';
            this.sendButton.style.boxShadow = '0 8px 32px rgba(249, 115, 22, 0.4)';
        } else {
            this.sendButton.style.transform = '';
            this.sendButton.style.boxShadow = '';
        }
    }
    
    addInputAnimation() {
        const inputContainer = this.messageInput.parentElement;
        inputContainer.style.transform = 'translateY(-1px)';
        setTimeout(() => {
            inputContainer.style.transform = '';
        }, 150);
    }
    
    addFocusEffect() {
        const inputContainer = this.messageInput.parentElement;
        inputContainer.style.transform = 'translateY(-2px)';
    }
    
    removeFocusEffect() {
        const inputContainer = this.messageInput.parentElement;
        inputContainer.style.transform = '';
    }
    
    showError(message, suggestion = '') {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <i class="ri-error-warning-line error-icon"></i>
            <div>
                <div>${message}</div>
                ${suggestion ? `<div class="error-suggestion">${suggestion}</div>` : ''}
            </div>
        `;
        this.messagesContainer.appendChild(errorElement);
        this.scrollToBottom();
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorElement.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => errorElement.remove(), 300);
        }, 5000);
    }

    showLoadingState(message = 'Processing your request...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-state';
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <div>${message}</div>
            <div class="loading-progress">
                <div class="loading-bar"></div>
            </div>
        `;
        this.messagesContainer.appendChild(loadingElement);
        this.scrollToBottom();
        return loadingElement;
    }

    hideLoadingState(loadingElement) {
        if (loadingElement) {
            loadingElement.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => loadingElement.remove(), 300);
        }
    }

    handleError(error) {
        console.error('Error:', error);
        let message = 'Something went wrong';
        let suggestion = 'Please try again or reload the page.';
        
        if (error && error.message) {
        if (error.message.includes('network')) {
                message = 'Network error';
                suggestion = 'Please check your internet connection and try again.';
        } else if (error.message.includes('timeout')) {
            message = 'Request timed out';
                suggestion = 'Server might be busy, please try again in a moment.';
            }
        }
        
        this.showError(message, suggestion);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        this.messageInput.value = '';
            this.hideWelcomeScreen();
        this.addMessage(message, 'user');
        this.animateSendButton();
        this.updateSendButton();
        
        // Show typing indicator
        setTimeout(() => {
            this.showTypingIndicator();
        }, 300);
        
        try {
            // Generate response with dynamic delay based on message length
            const responseDelay = Math.min(1000 + message.length * 20, 3000);
            setTimeout(async () => {
                this.hideTypingIndicator();
                await this.addBotResponse(message);
            }, responseDelay);
        } catch (error) {
            this.hideTypingIndicator();
            this.handleError(error);
        }
    }
    
    animateSendButton() {
        const ripple = document.querySelector('.send-ripple');
        ripple.style.animation = 'none';
        setTimeout(() => {
            ripple.style.animation = '';
        }, 10);
        
        this.sendButton.classList.add('send-pulse');
        setTimeout(() => {
            this.sendButton.classList.remove('send-pulse');
        }, 300);
    }
    
    hideWelcomeScreen() {
        if (this.welcomeScreen && this.welcomeScreen.style.display !== 'none') {
            this.welcomeScreen.style.opacity = '0';
            this.welcomeScreen.style.transform = 'translateY(-20px)';
            
        setTimeout(() => {
            this.welcomeScreen.style.display = 'none';
            }, 300);
        }
    }
    
    addMessage(message, sender) {
        this.messageCount++;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const currentTime = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (sender === 'user') {
            messageElement.innerHTML = `
                <div class="message-bubble">
                    ${this.escapeHtml(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
            
            // Track user message for conversation history
            this.messageHistory.push({ sender: 'user', message, timestamp: new Date() });
            
            // Dispatch message sent event for premium features
            this.messageSentEvent.detail.message = message;
            this.messageSentEvent.detail.sender = 'user';
            document.dispatchEvent(this.messageSentEvent);
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">B</div>
                <div class="message-bubble">
                    ${message}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
            
            // Track bot message for conversation history
            this.messageHistory.push({ sender: 'bot', message, timestamp: new Date() });
            
            // Dispatch bot response event for premium features
            this.botResponseEvent.detail.message = message;
            document.dispatchEvent(this.botResponseEvent);
        }
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        this.addMessageEffect(messageElement);
        
        // Dispatch message added event for premium features
        this.messageAddedEvent.detail.element = messageElement;
        document.dispatchEvent(this.messageAddedEvent);
    }
    
    addMessageEffect(messageElement) {
        // Add entrance animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    async addBotResponse(userMessage) {
        const response = await this.generateResponse(userMessage);
        this.addMessage(response, 'bot');
    }
    
    async generateResponse(userMessage) {
        // Determine context from message for better responses
        let context = this.determineMessageContext(userMessage);
        let response = '';
        
        // Basic response generation logic
        const lowercaseMessage = userMessage.toLowerCase();
        
        if (this.containsWords(lowercaseMessage, ['hi', 'hello', 'hey', 'greetings'])) {
            response = this.responses.find(r => r.type === 'greeting').content;
        } 
        else if (this.containsWords(lowercaseMessage, ['presence', 'mindful', 'present', 'awareness'])) {
            response = this.responses.find(r => r.type === 'presence').content;
        } 
        else if (this.containsWords(lowercaseMessage, ['goal', 'target', 'objective', 'achievement'])) {
            response = this.responses.find(r => r.type === 'goals').content;
        } 
        else if (this.containsWords(lowercaseMessage, ['fundamental', 'principle', 'core', 'foundation'])) {
            response = this.responses.find(r => r.type === 'fundamentals').content;
        } 
        else if (this.containsWords(lowercaseMessage, ['discipline', 'habit', 'routine', 'consistent'])) {
            response = this.responses.find(r => r.type === 'discipline').content;
        } 
        else {
            // Default responses based on context or generic
            const contextResponses = {
                presence: [
                    "Presence is about being fully engaged in the moment. What aspect of presence are you most interested in?",
                    "Mindfulness and presence work together to enhance your awareness. Would you like to learn specific techniques?"
                ],
                goals: [
                    "Setting meaningful goals requires clarity and commitment. What area of your life are you focusing on?",
                    "Goals provide direction and purpose. What timeline are you considering for your objectives?"
                ],
                fundamentals: [
                    "The 5 Fundamentals form the foundation of sustained excellence. Which one resonates with you most?",
                    "Understanding these core principles can transform your approach. Which fundamental challenges you the most?"
                ],
                default: [
                    "I'm here to help you elevate your game. What specific area would you like guidance on?",
                    "Thanks for reaching out. I can assist with presence, goals, and fundamentals. What's your focus today?",
                    "As Dr. Brett's AI assistant, I'm designed to help you reach new heights. What would you like to work on?"
                ]
            };
            
            const responses = contextResponses[context] || contextResponses.default;
            response = this.getRandomResponse(responses);
        }
        
        return response;
    }
    
    determineMessageContext(message) {
        const lowercaseMessage = message.toLowerCase();
        
        if (this.containsWords(lowercaseMessage, ['presence', 'mindful', 'present', 'awareness'])) {
            return 'presence';
        } 
        else if (this.containsWords(lowercaseMessage, ['goal', 'target', 'objective', 'achievement'])) {
            return 'goals';
        } 
        else if (this.containsWords(lowercaseMessage, ['fundamental', 'principle', 'core', 'foundation', 'discipline'])) {
            return 'fundamentals';
        }
        
        return 'default';
    }
    
    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.updateSendButton();
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.updateSendButton();
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    scrollToMessage(index) {
        const messages = this.messagesContainer.querySelectorAll('.message');
        if (messages[index]) {
            messages[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the message briefly
            messages[index].classList.add('highlight');
        setTimeout(() => {
                messages[index].classList.remove('highlight');
            }, 2000);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNotification(message) {
        // Check if notification container exists
        const notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            console.error('Notification container not found');
            return;
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        return notification;
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
        
        // Show confirmation
        const themeMessage = this.currentTheme === 'dark' ? 'Dark mode activated' : 'Light mode activated';
        this.showNotification(themeMessage);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme button icon
        const themeBtn = document.getElementById('themeBtn');
        
        if (themeBtn) {
            if (this.currentTheme === 'dark') {
                themeBtn.innerHTML = '<i class="ri-moon-line"></i>';
        } else {
                themeBtn.innerHTML = '<i class="ri-sun-line"></i>';
            }
        }
    }
}

class InteractionEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addClickEffects();
        this.addKeyboardEffects();
    }
    
    addHoverEffects() {
        const interactiveElements = document.querySelectorAll('button, .prompt-btn, .action-btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.createHoverEffect(element));
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });
        });
    }
    
    addClickEffects() {
        const clickableElements = document.querySelectorAll('button, .prompt-btn, .action-btn');
        
        clickableElements.forEach(element => {
            element.addEventListener('mousedown', (e) => this.createRippleEffect(e));
            element.addEventListener('mouseup', () => {
                element.style.transform = '';
            });
        });
    }
    
    addKeyboardEffects() {
        document.addEventListener('keydown', () => this.createKeyboardEffect());
    }
    
    createHoverEffect(element) {
        element.style.transform = 'translateY(-2px)';
        element.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    }
    
    createRippleEffect(e) {
        const element = e.currentTarget;
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        // Get element dimensions and position
        const rect = element.getBoundingClientRect();
        
        // Calculate ripple size (diagonal of the element for full coverage)
        const size = Math.max(rect.width, rect.height) * 2;
        
        // Set ripple position and size
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        // Add ripple to element
        element.appendChild(ripple);
        
        // Apply subtle scale down effect
        element.style.transform = 'scale(0.98)';
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    createKeyboardEffect() {
        // Create subtle screen flash for keyboard interaction
        const flash = document.createElement('div');
        flash.classList.add('keyboard-flash');
        document.body.appendChild(flash);
        
        // Remove flash after animation
        setTimeout(() => {
            flash.remove();
        }, 300);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.chatInterface = new AdvancedChatInterface();
    new InteractionEffects();
});