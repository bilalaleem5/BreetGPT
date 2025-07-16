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
        
        // Enhanced responses with more personality
        this.responses = [
            "Hello! I'm BGPT, your advanced AI assistant. I'm excited to help you with anything you need! 🚀",
            "That's a fascinating question! Let me process that and give you a thoughtful response. 🤔",
            "I love how you think! Here's my perspective on what you've shared... ✨",
            "Excellent point! I can definitely help you explore that topic further. 💡",
            "Thank you for that interesting message! I'm here to provide you with the best assistance possible. 🌟",
            "I appreciate your curiosity! Let me break this down for you in a helpful way. 📚",
            "What an intriguing topic! I'm always excited to dive deep into subjects like this. 🔍",
            "I'm impressed by your question! Here's what I think would be most helpful... 🎯",
            "That's exactly the kind of challenge I enjoy tackling! Let me help you with that. ⚡",
            "Great question! I can see you're really thinking about this. Here's my detailed response... 🧠"
        ];
        
        // Contextual responses based on keywords
        this.contextualResponses = {
            greeting: [
                "Hello there! Welcome to BGPT! I'm thrilled to meet you and ready to assist with anything you need. How can I make your day better? 😊",
                "Hi! Great to see you here! I'm BGPT, your intelligent AI companion. What exciting topic shall we explore together today? 🌟",
                "Hey! Welcome aboard! I'm BGPT, and I'm absolutely delighted to help you with whatever you have in mind. What's on your agenda? 🚀"
            ],
            help: [
                "I'm here to help with absolutely anything! I can answer questions, solve problems, provide explanations, have conversations, help with creative tasks, and so much more. What would you like to explore? 💪",
                "My capabilities are quite extensive! I can assist with research, writing, problem-solving, creative projects, learning new topics, and engaging discussions. What interests you most? 🎯",
                "I'd love to help you! I'm designed to assist with a wide range of tasks - from answering questions to helping with complex problems. What challenge can we tackle together? ⚡"
            ],
            thanks: [
                "You're absolutely welcome! It's my pleasure to help. I'm always here whenever you need assistance or just want to chat! 😊",
                "Thank you for the kind words! I really enjoy our conversation and I'm glad I could be helpful. Anything else on your mind? 🌟",
                "My pleasure entirely! Helping you is what I'm here for, and I love every moment of it. What else can we explore together? ✨"
            ],
            goodbye: [
                "It's been wonderful chatting with you! Feel free to come back anytime - I'll be right here, ready to help with whatever you need. Take care! 👋",
                "Goodbye for now! I've really enjoyed our conversation. Remember, I'm always here whenever you want to chat or need assistance. Have a fantastic day! 🌟",
                "See you later! Thanks for the great conversation. I'll be here waiting for your return with more exciting topics to discuss! 🚀"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.messageInput.focus();
        this.addInitialDelay();
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
    
    sendMessage() {
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
        
        // Show typing indicator with delay
        setTimeout(() => {
            this.showTypingIndicator();
        }, 300);
        
        // Generate response with realistic delay
        const responseDelay = 1200 + Math.random() * 1800;
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addBotResponse(message);
        }, responseDelay);
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