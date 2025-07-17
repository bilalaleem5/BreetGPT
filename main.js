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
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.messageInput.focus();
        this.setupPromptButtons();
        this.addInitialDelay();
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
        
        if (prompt.includes('Presence')) {
            response = this.responses.find(r => r.type === 'presence').content;
        } else if (prompt.includes('goal')) {
            response = this.responses.find(r => r.type === 'goals').content;
        } else if (prompt.includes('Fundamentals')) {
            response = this.responses.find(r => r.type === 'fundamentals').content;
        } else {
            response = this.responses.find(r => r.type === 'greeting').content;
        }
        
        this.addFormattedMessage(response, 'bot');
    }
    
    addFormattedMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
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
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">B</div>
                <div class="message-bubble">
                    <p>${formattedContent}</p>
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        }
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        this.addMessageEffect(messageElement);
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
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
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
        let suggestion = 'Please try again or rephrase your request';
        
        if (error.message.includes('network')) {
            message = 'Network connection issue';
            suggestion = 'Please check your internet connection and try again';
        } else if (error.message.includes('timeout')) {
            message = 'Request timed out';
            suggestion = 'The server is taking too long to respond. Please try again';
        }
        
        this.showError(message, suggestion);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Hide welcome screen on first message
        if (this.messageCount === 0) {
            this.hideWelcomeScreen();
        }
        
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.updateSendButton();
        this.messageCount++;
        
        // Add send button animation
        this.animateSendButton();
        
        try {
            const loadingElement = this.showLoadingState();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            this.hideLoadingState(loadingElement);
            this.addBotResponse(message);
        } catch (error) {
            this.handleError(error);
        }
    }
    
    animateSendButton() {
        const ripple = this.sendButton.querySelector('.send-ripple');
        ripple.style.transform = 'scale(1)';
        setTimeout(() => {
            ripple.style.transform = 'scale(0)';
        }, 600);
    }
    
    hideWelcomeScreen() {
        this.welcomeScreen.style.animation = 'welcomeFadeOut 0.5s ease-in forwards';
        setTimeout(() => {
            this.welcomeScreen.style.display = 'none';
        }, 500);
        
        // Add fade out animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes welcomeFadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addMessage(message, sender) {
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
        } else {
            messageElement.innerHTML = `
                <div class="message-avatar">B</div>
                <div class="message-bubble">
                    ${this.escapeHtml(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        }
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add message sound effect (visual feedback)
        this.addMessageEffect(messageElement);
    }
    
    addMessageEffect(messageElement) {
        // Add a subtle glow effect when message appears
        const bubble = messageElement.querySelector('.message-bubble');
        bubble.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
        setTimeout(() => {
            bubble.style.boxShadow = '';
        }, 1000);
    }
    
    addBotResponse(userMessage) {
        const response = this.generateResponse(userMessage);
        this.addMessage(response, 'bot');
    }
    
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for contextual responses
        if (this.containsWords(message, ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getRandomResponse(this.contextualResponses.greeting);
        }
        
        if (this.containsWords(message, ['help', 'what can you do', 'capabilities', 'assist', 'support'])) {
            return this.getRandomResponse(this.contextualResponses.help);
        }
        
        if (this.containsWords(message, ['thank you', 'thanks', 'appreciate', 'grateful'])) {
            return this.getRandomResponse(this.contextualResponses.thanks);
        }
        
        if (this.containsWords(message, ['bye', 'goodbye', 'see you', 'farewell', 'take care'])) {
            return this.getRandomResponse(this.contextualResponses.goodbye);
        }
        
        // Specific topic responses
        if (this.containsWords(message, ['weather', 'temperature', 'climate'])) {
            return "I don't have access to real-time weather data, but I'd recommend checking a reliable weather service for current conditions. However, I'd be happy to discuss climate patterns, weather phenomena, or help you plan for different weather conditions! 🌤️";
        }
        
        if (this.containsWords(message, ['time', 'clock', 'hour', 'minute'])) {
            const currentTime = new Date().toLocaleString();
            return `According to your device, it's currently ${currentTime}. Is there anything time-related I can help you with? Perhaps scheduling, time zones, or time management tips? ⏰`;
        }
        
        if (this.containsWords(message, ['name', 'who are you', 'what are you'])) {
            return "I'm BGPT, your advanced AI assistant! I'm designed to be helpful, informative, and engaging. I love learning about new topics and helping solve problems. Think of me as your intelligent digital companion! 🤖✨";
        }
        
        if (this.containsWords(message, ['joke', 'funny', 'humor', 'laugh'])) {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "I told my computer a joke about UDP... but I'm not sure if it got it! 💻😂",
                "Why did the AI go to therapy? It had too many deep learning issues! 🤖😅"
            ];
            return this.getRandomResponse(jokes);
        }
        
        // Default responses with more personality
        return this.getRandomResponse(this.responses);
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
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
        
        const themeText = this.currentTheme === 'dark' ? 'Dark' : 'Light';
        this.showNotification(`Switched to ${themeText} theme! 🎨`);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme button icon
        const themeBtn = document.getElementById('themeBtn');
        const themeIcon = themeBtn.querySelector('svg');
        
        if (this.currentTheme === 'light') {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        } else {
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        }
    }
}

// Enhanced interaction effects
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
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('button, .feature-card, .message-bubble');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createHoverEffect(e.target);
            });
        });
    }
    
    addClickEffects() {
        // Add click ripple effects
        const clickableElements = document.querySelectorAll('button, .feature-card');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
    }
    
    addKeyboardEffects() {
        // Add keyboard interaction feedback
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement.id === 'messageInput') {
                this.createKeyboardEffect();
            }
        });
    }
    
    createHoverEffect(element) {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (button.contains(ripple)) {
                button.removeChild(ripple);
            }
        }, 600);
    }
    
    createKeyboardEffect() {
        const input = document.getElementById('messageInput');
        input.style.transform = 'scale(1.02)';
        setTimeout(() => {
            input.style.transform = '';
        }, 150);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple animation styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);
    
    // Initialize chat interface and effects
    new AdvancedChatInterface();
    new InteractionEffects();
    
    // Add loading completion effect
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});

// Add initial loading styles
document.body.style.cssText += `
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-out;
`;