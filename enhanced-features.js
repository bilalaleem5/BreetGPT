/**
 * BreetGPT Premium Features
 * This file implements the premium features as specified in the requirements.
 */

class PremiumFeatures {
    constructor(chatInterface) {
        this.chatInterface = chatInterface;
        this.initDynamicBackground();
        this.initSmartSuggestions();
        this.initKeyboardShortcuts();
        this.initGestureSupport();
        this.initVoiceInput();
        this.initContextualMenus();
        this.initAccessibility();
        this.initAnalytics();
        this.initOfflineCapability();
        this.setupQuickActions();
        this.setupShortcutsButton();
    }

    /**
     * Dynamic Backgrounds
     * Context-aware background changes based on conversation topic
     */
    initDynamicBackground() {
        this.backgrounds = {
            default: {
                orbs: [
                    { color: 'rgba(59, 130, 246, 0.3)', intensity: '0.3' },
                    { color: 'rgba(249, 115, 22, 0.2)', intensity: '0.2' },
                    { color: 'rgba(59, 130, 246, 0.2)', intensity: '0.2' },
                    { color: 'rgba(249, 115, 22, 0.3)', intensity: '0.3' }
                ]
            },
            presence: {
                orbs: [
                    { color: 'rgba(16, 185, 129, 0.3)', intensity: '0.4' },  // Green
                    { color: 'rgba(59, 130, 246, 0.2)', intensity: '0.2' },  // Blue
                    { color: 'rgba(16, 185, 129, 0.2)', intensity: '0.3' },  // Green
                    { color: 'rgba(59, 130, 246, 0.3)', intensity: '0.25' }  // Blue
                ]
            },
            goals: {
                orbs: [
                    { color: 'rgba(249, 115, 22, 0.3)', intensity: '0.35' }, // Orange
                    { color: 'rgba(236, 72, 153, 0.2)', intensity: '0.25' }, // Pink
                    { color: 'rgba(249, 115, 22, 0.25)', intensity: '0.3' }, // Orange
                    { color: 'rgba(236, 72, 153, 0.3)', intensity: '0.2' }   // Pink
                ]
            },
            fundamentals: {
                orbs: [
                    { color: 'rgba(124, 58, 237, 0.3)', intensity: '0.35' }, // Purple
                    { color: 'rgba(59, 130, 246, 0.2)', intensity: '0.2' },  // Blue
                    { color: 'rgba(124, 58, 237, 0.2)', intensity: '0.3' },  // Purple
                    { color: 'rgba(59, 130, 246, 0.3)', intensity: '0.25' }  // Blue
                ]
            }
        };

        // Listen to chat messages to change background context
        document.addEventListener('bgpt-message-sent', (e) => {
            const message = e.detail.message.toLowerCase();
            
            if (message.includes('presence') || message.includes('mindful') || message.includes('awareness')) {
                this.changeBackground('presence');
            } else if (message.includes('goal') || message.includes('achieve') || message.includes('target')) {
                this.changeBackground('goals');
            } else if (message.includes('fundamental') || message.includes('principle') || message.includes('core')) {
                this.changeBackground('fundamentals');
            }
        });
    }

    changeBackground(theme) {
        const orbs = document.querySelectorAll('.floating-orb');
        const bgConfig = this.backgrounds[theme] || this.backgrounds.default;
        
        orbs.forEach((orb, index) => {
            if (bgConfig.orbs[index]) {
                const config = bgConfig.orbs[index];
                // Apply smooth transition
                orb.style.transition = 'background 1.5s ease-in-out, filter 1.5s ease-in-out';
                orb.style.background = `radial-gradient(circle, ${config.color} 0%, transparent 70%)`;
                orb.style.filter = `blur(${40 + parseInt(config.intensity * 20)}px)`;
            }
        });
        
        // Dispatch event for other components to react to theme change
        document.dispatchEvent(new CustomEvent('bgpt-theme-changed', { detail: { theme } }));
    }

    /**
     * Smart Suggestions
     * Context-aware follow-up questions based on conversation
     */
    initSmartSuggestions() {
        this.suggestionsByContext = {
            presence: [
                "How can I improve my presence during meetings?",
                "What mindfulness techniques work best for beginners?",
                "How does presence affect performance?"
            ],
            goals: [
                "How do I stay motivated when facing obstacles?",
                "What's the best way to track progress on goals?",
                "How often should I review my goals?"
            ],
            fundamentals: [
                "Which fundamental should I focus on first?",
                "How do these fundamentals work together?",
                "Are there exercises for improving discipline?"
            ],
            default: [
                "Tell me more about Role Model Academy",
                "What coaching programs do you offer?",
                "How can I apply these concepts today?"
            ]
        };

        // Create suggestion container if it doesn't exist
        if (!document.querySelector('.smart-suggestions')) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'smart-suggestions';
            document.querySelector('.input-container').insertBefore(
                suggestionsContainer, 
                document.querySelector('.input-wrapper')
            );
        }

        // Listen for bot responses to show smart suggestions
        document.addEventListener('bgpt-bot-response', (e) => {
            const message = e.detail.message.toLowerCase();
            this.showSmartSuggestions(this.getContextFromMessage(message));
        });
    }

    getContextFromMessage(message) {
        if (message.includes('presence') || message.includes('mindful') || message.includes('awareness')) {
            return 'presence';
        } else if (message.includes('goal') || message.includes('achieve') || message.includes('target')) {
            return 'goals';
        } else if (message.includes('fundamental') || message.includes('principle') || message.includes('core')) {
            return 'fundamentals';
        }
        return 'default';
    }

    showSmartSuggestions(context) {
        const suggestionsContainer = document.querySelector('.smart-suggestions');
        suggestionsContainer.innerHTML = '';
        
        const suggestions = this.suggestionsByContext[context] || this.suggestionsByContext.default;
        
        // Add suggestions with animation delay
        suggestions.forEach((suggestion, index) => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.className = 'suggestion-chip';
            suggestionBtn.textContent = suggestion;
            suggestionBtn.style.animationDelay = `${index * 0.1}s`;
            
            suggestionBtn.addEventListener('click', () => {
                this.chatInterface.messageInput.value = suggestion;
                this.chatInterface.messageInput.focus();
                this.chatInterface.updateSendButton();
                suggestionsContainer.innerHTML = '';
            });
            
            suggestionsContainer.appendChild(suggestionBtn);
        });

        // Add role model academy call-to-action
        const ctaBtn = document.createElement('a');
        ctaBtn.className = 'suggestion-chip cta-chip';
        ctaBtn.href = 'https://rolemodelacademy.com';
        ctaBtn.target = '_blank';
        ctaBtn.textContent = '🌟 Learn more at RMA';
        ctaBtn.style.animationDelay = `${suggestions.length * 0.1}s`;
        suggestionsContainer.appendChild(ctaBtn);
    }

    /**
     * Keyboard Shortcuts
     * Power user features for faster interaction
     */
    initKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Escape', action: () => this.chatInterface.messageInput.blur() },
            { key: '/', action: () => this.chatInterface.messageInput.focus() },
            { key: 'ArrowUp', action: () => this.showPreviousMessage(), condition: () => document.activeElement === this.chatInterface.messageInput },
            { key: 'F1', action: () => this.showKeyboardShortcutsHelp() }
        ];

        document.addEventListener('keydown', (e) => {
            shortcuts.forEach(shortcut => {
                if (e.key === shortcut.key) {
                    if (!shortcut.condition || shortcut.condition()) {
                        e.preventDefault();
                        shortcut.action();
                    }
                }
            });
        });

        this.chatHistory = [];
        this.historyIndex = -1;

        // Store messages for history
        document.addEventListener('bgpt-message-sent', (e) => {
            if (e.detail.sender === 'user') {
                this.chatHistory.push(e.detail.message);
                this.historyIndex = this.chatHistory.length;
            }
        });
    }

    showPreviousMessage() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.chatInterface.messageInput.value = this.chatHistory[this.historyIndex];
            this.chatInterface.updateSendButton();
            
            // Move cursor to end of input
            setTimeout(() => {
                this.chatInterface.messageInput.selectionStart = 
                this.chatInterface.messageInput.selectionEnd = 
                this.chatInterface.messageInput.value.length;
            }, 0);
        }
    }

    showKeyboardShortcutsHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'shortcuts-modal';
        helpModal.innerHTML = `
            <div class="shortcuts-content">
                <h2>Keyboard Shortcuts</h2>
                <div class="shortcut-list">
                    <div class="shortcut-item"><span class="key">/</span> <span>Focus input</span></div>
                    <div class="shortcut-item"><span class="key">Esc</span> <span>Blur input</span></div>
                    <div class="shortcut-item"><span class="key">↑</span> <span>Previous messages</span></div>
                    <div class="shortcut-item"><span class="key">F1</span> <span>Show this help</span></div>
                </div>
                <button class="close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        helpModal.querySelector('.close-btn').addEventListener('click', () => {
            helpModal.classList.add('fade-out');
            setTimeout(() => helpModal.remove(), 300);
        });
        
        setTimeout(() => helpModal.classList.add('show'), 10);
    }

    /**
     * Setup Shortcuts Button
     */
    setupShortcutsButton() {
        const shortcutsBtn = document.getElementById('shortcutsBtn');
        if (shortcutsBtn) {
            shortcutsBtn.addEventListener('click', () => {
                this.showKeyboardShortcutsHelp();
            });
        }
    }

    /**
     * Quick Actions
     * Handle functionality for the quick action buttons
     */
    setupQuickActions() {
        const quickActionButtons = document.querySelectorAll('.quick-action-btn');
        
        quickActionButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            button.addEventListener('click', () => {
                switch(action) {
                    case 'clear':
                        this.clearChat();
                        break;
                    case 'export':
                        this.exportChat();
                        break;
                    case 'history':
                        this.showConversationHistory();
                        break;
                    case 'share':
                        this.shareConversation();
                        break;
                }
            });
        });
    }

    clearChat() {
        // Show confirmation dialog
        const confirmClear = confirm('Are you sure you want to clear all messages?');
        
        if (confirmClear) {
            // Remove all messages but keep the welcome screen
            const messages = document.querySelectorAll('.message');
            messages.forEach(message => message.remove());
            
            // Show welcome screen again
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'block';
                welcomeScreen.style.opacity = '1';
                welcomeScreen.style.transform = 'translateY(0)';
            }
            
            // Clear message history
            this.chatInterface.messageHistory = [];
            
            // Show notification
            this.chatInterface.showNotification('Chat cleared successfully');
            
            // Track analytics
            this.analytics.track('chat_cleared');
        }
    }

    exportChat() {
        // Get all messages
        const messages = this.chatInterface.messageHistory;
        
        if (messages.length === 0) {
            this.chatInterface.showNotification('No messages to export');
            return;
        }
        
        // Format messages for export
        const formattedChat = messages.map(msg => {
            const sender = msg.sender === 'user' ? 'You' : 'BGPT';
            const time = new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            return `[${time}] ${sender}: ${msg.message}`;
        }).join('\n\n');
        
        // Create export content
        const exportContent = `BGPT Conversation Export\nDate: ${new Date().toLocaleDateString()}\n\n${formattedChat}`;
        
        // Create download link
        const blob = new Blob([exportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bgpt-conversation-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show notification
        this.chatInterface.showNotification('Conversation exported successfully');
        
        // Track analytics
        this.analytics.track('chat_exported');
    }

    shareConversation() {
        // Format the last few messages for sharing
        const messages = this.chatInterface.messageHistory;
        
        if (messages.length === 0) {
            this.chatInterface.showNotification('No messages to share');
            return;
        }
        
        // Take the last 5 messages or less
        const recentMessages = messages.slice(-5);
        const shareText = recentMessages.map(msg => {
            const sender = msg.sender === 'user' ? 'Me' : 'BGPT';
            return `${sender}: ${msg.message}`;
        }).join('\n\n');
        
        // Create share text with attribution
        const fullShareText = `${shareText}\n\nShared from BGPT - Role Model Academy`;
        
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'My BGPT Conversation',
                text: fullShareText,
                url: 'https://rolemodelacademy.com'
            }).then(() => {
                this.analytics.track('conversation_shared', { method: 'web_share_api' });
            }).catch(err => {
                console.error('Error sharing:', err);
                this.fallbackShare(fullShareText);
            });
        } else {
            this.fallbackShare(fullShareText);
        }
    }

    fallbackShare(text) {
        // Fallback to clipboard copy
        navigator.clipboard.writeText(text).then(() => {
            this.chatInterface.showNotification('Conversation copied to clipboard');
            this.analytics.track('conversation_shared', { method: 'clipboard' });
        }).catch(err => {
            console.error('Could not copy text: ', err);
            this.chatInterface.showNotification('Could not share conversation');
        });
    }

    /**
     * Gesture Support
     * Swipe actions for mobile users
     */
    initGestureSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        // Initialize swipe gestures on messages container
        const messagesContainer = this.chatInterface.messagesContainer;
        
        messagesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        messagesContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            const xDiff = touchStartX - touchEndX;
            const yDiff = touchStartY - touchEndY;
            
            // Detect horizontal swipe
            if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
                if (xDiff > 0) {
                    // Swipe left - show conversation history
                    this.showConversationHistory();
                } else {
                    // Swipe right - maybe show settings?
                    document.getElementById('settingsBtn').click();
                }
            }
        }, false);
    }

    showConversationHistory() {
        // Create conversation history modal if it doesn't exist
        if (!document.querySelector('.history-modal')) {
            const historyModal = document.createElement('div');
            historyModal.className = 'history-modal';
            
            const historyContent = document.createElement('div');
            historyContent.className = 'history-content';
            
            const historyHeader = document.createElement('div');
            historyHeader.className = 'history-header';
            historyHeader.innerHTML = '<h2>Conversation History</h2>';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'history-close-btn';
            closeBtn.innerHTML = '&times;';
            historyHeader.appendChild(closeBtn);
            
            const historyList = document.createElement('div');
            historyList.className = 'history-list';
            
            // Get messages from container
            const messages = Array.from(document.querySelectorAll('.message'));
            
            if (messages.length === 0) {
                historyList.innerHTML = '<div class="no-history">No conversation history yet</div>';
            } else {
                messages.forEach((msg, index) => {
                    const isUser = msg.classList.contains('user');
                    const content = isUser 
                        ? msg.querySelector('.message-bubble').textContent.replace(/\n.*$/m, '') 
                        : msg.querySelector('.message-bubble').textContent.split('\n')[0];
                    
                    const historyItem = document.createElement('div');
                    historyItem.className = `history-item ${isUser ? 'user' : 'bot'}`;
                    historyItem.textContent = content.length > 60 ? content.substring(0, 57) + '...' : content;
                    
                    historyItem.addEventListener('click', () => {
                        this.chatInterface.scrollToMessage(index);
                        historyModal.classList.add('fade-out');
                        setTimeout(() => historyModal.remove(), 300);
                    });
                    
                    historyList.appendChild(historyItem);
                });
            }
            
            historyContent.appendChild(historyHeader);
            historyContent.appendChild(historyList);
            historyModal.appendChild(historyContent);
            
            document.body.appendChild(historyModal);
            
            closeBtn.addEventListener('click', () => {
                historyModal.classList.add('fade-out');
                setTimeout(() => historyModal.remove(), 300);
            });
            
            setTimeout(() => historyModal.classList.add('show'), 10);
        }
    }

    /**
     * Voice Input Support
     * Basic speech-to-text integration
     */
    initVoiceInput() {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            // Create voice button if it doesn't exist
            if (!document.querySelector('.voice-input-btn')) {
                const voiceBtn = document.createElement('button');
                voiceBtn.className = 'voice-input-btn';
                voiceBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                `;
                
                // Add button to input wrapper before send button
                const inputWrapper = document.querySelector('.input-wrapper');
                inputWrapper.insertBefore(voiceBtn, document.getElementById('sendButton'));
                
                // Initialize speech recognition
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                
                let isListening = false;
                
                voiceBtn.addEventListener('click', () => {
                    if (!isListening) {
                        // Start listening
                        recognition.start();
                        isListening = true;
                        voiceBtn.classList.add('listening');
                        
                        // Add pulsing animation
                        voiceBtn.innerHTML = `
                            <div class="voice-pulse"></div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        `;
                    } else {
                        // Stop listening
                        recognition.stop();
                        isListening = false;
                        voiceBtn.classList.remove('listening');
                        
                        // Remove pulsing animation
                        voiceBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        `;
                    }
                });
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.chatInterface.messageInput.value = transcript;
                    this.chatInterface.updateSendButton();
                };
                
                recognition.onend = () => {
                    isListening = false;
                    voiceBtn.classList.remove('listening');
                    
                    // Remove pulsing animation
                    voiceBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    `;
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    isListening = false;
                    voiceBtn.classList.remove('listening');
                    
                    // Show error notification
                    this.chatInterface.showNotification('Voice recognition error: ' + event.error);
                    
                    // Remove pulsing animation
                    voiceBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    `;
                };
            }
        }
    }

    /**
     * Contextual Menus
     * Right-click options for messages
     */
    initContextualMenus() {
        // Create context menu element if it doesn't exist
        if (!document.querySelector('.context-menu')) {
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            document.body.appendChild(contextMenu);
            
            // Hide context menu on document click
            document.addEventListener('click', () => {
                contextMenu.style.display = 'none';
            });
        }
        
        const contextMenu = document.querySelector('.context-menu');
        
        // Add context menu to messages
        document.addEventListener('bgpt-message-added', (e) => {
            const messageElement = e.detail.element;
            
            messageElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                
                // Position menu at cursor
                contextMenu.style.left = `${event.pageX}px`;
                contextMenu.style.top = `${event.pageY}px`;
                
                // Clear previous menu items
                contextMenu.innerHTML = '';
                
                // Add menu items based on message type
                const isUser = messageElement.classList.contains('user');
                
                if (isUser) {
                    this.addMenuItem(contextMenu, 'Edit', () => {
                        const messageText = messageElement.querySelector('.message-bubble').textContent.trim();
                        this.chatInterface.messageInput.value = messageText;
                        this.chatInterface.messageInput.focus();
                        this.chatInterface.updateSendButton();
                    });
                } else {
                    this.addMenuItem(contextMenu, 'Copy', () => {
                        const messageText = messageElement.querySelector('.message-bubble').textContent.trim();
                        navigator.clipboard.writeText(messageText);
                        this.chatInterface.showNotification('Message copied to clipboard');
                    });
                }
                
                this.addMenuItem(contextMenu, 'Delete', () => {
                    messageElement.classList.add('fade-out');
                    setTimeout(() => messageElement.remove(), 300);
                });
                
                // Add share option
                this.addMenuItem(contextMenu, 'Share', () => {
                    const messageText = messageElement.querySelector('.message-bubble').textContent.trim();
                    
                    if (navigator.share) {
                        navigator.share({
                            title: 'BGPT Conversation',
                            text: messageText,
                            url: 'https://rolemodelacademy.com'
                        }).catch(console.error);
                    } else {
                        navigator.clipboard.writeText(messageText);
                        this.chatInterface.showNotification('Message copied to clipboard for sharing');
                    }
                });
                
                // Show context menu
                contextMenu.style.display = 'block';
            });
        });
    }
    
    addMenuItem(menu, text, action) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.textContent = text;
        menuItem.addEventListener('click', action);
        menu.appendChild(menuItem);
    }

    /**
     * Accessibility Enhancements
     * Screen reader support and keyboard navigation
     */
    initAccessibility() {
        // Add ARIA roles and labels
        document.querySelector('.chat-container').setAttribute('role', 'main');
        document.querySelector('.chat-header').setAttribute('role', 'banner');
        document.querySelector('.messages-container').setAttribute('role', 'log');
        document.querySelector('.messages-container').setAttribute('aria-live', 'polite');
        document.querySelector('.input-container').setAttribute('role', 'form');
        
        // Improve focus styles
        const focusableElements = document.querySelectorAll('button, input, a');
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.classList.add('a11y-focus');
            });
            
            el.addEventListener('blur', () => {
                el.classList.remove('a11y-focus');
            });
        });
        
        // Add skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#messageInput';
        skipLink.textContent = 'Skip to message input';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Make messages accessible to screen readers
        document.addEventListener('bgpt-message-added', (e) => {
            const messageElement = e.detail.element;
            const isUser = messageElement.classList.contains('user');
            
            messageElement.setAttribute('role', 'article');
            messageElement.setAttribute('aria-label', `${isUser ? 'You' : 'BGPT'} message`);
        });
    }

    /**
     * Analytics Integration
     * Track user interactions
     */
    initAnalytics() {
        // Simple analytics tracker
        this.analytics = {
            events: [],
            
            track(eventName, properties = {}) {
                const event = {
                    eventName,
                    properties,
                    timestamp: new Date().toISOString()
                };
                
                this.events.push(event);
                console.log('Analytics event:', event);
                
                // In a real implementation, you would send this to a server
                // or analytics service like Google Analytics
                this.sendToAnalyticsServer(event);
            },
            
            sendToAnalyticsServer(event) {
                // Mock implementation - in a real app, this would send data to a server
                // localStorage.setItem('bgpt_analytics', JSON.stringify(this.events));
            }
        };
        
        // Track user interactions
        document.addEventListener('bgpt-message-sent', (e) => {
            this.analytics.track('message_sent', {
                sender: e.detail.sender,
                messageLength: e.detail.message.length
            });
        });
        
        document.addEventListener('bgpt-theme-changed', (e) => {
            this.analytics.track('theme_changed', {
                theme: e.detail.theme
            });
        });
        
        // Add session tracking
        this.analytics.track('session_start', {
            sessionId: Date.now().toString(),
            userAgent: navigator.userAgent
        });
        
        // Track page exit
        window.addEventListener('beforeunload', () => {
            this.analytics.track('session_end', {
                duration: Math.floor((Date.now() - parseInt(this.analytics.events[0].properties.sessionId)) / 1000)
            });
        });
    }

    /**
     * Offline Capability
     * Basic offline messaging queue
     */
    initOfflineCapability() {
        this.messageQueue = [];
        
        // Check network status
        window.addEventListener('online', () => {
            this.handleNetworkChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleNetworkChange(false);
        });
        
        // Initial network check
        this.isOnline = navigator.onLine;
        if (!this.isOnline) {
            this.handleNetworkChange(false);
        }
    }
    
    handleNetworkChange(isOnline) {
        this.isOnline = isOnline;
        
        if (isOnline) {
            // Process queued messages
            if (this.messageQueue.length > 0) {
                this.chatInterface.showNotification('Back online! Sending queued messages...');
                
                this.messageQueue.forEach(message => {
                    // In a real implementation, you would send these to your server
                    console.log('Sending queued message:', message);
                });
                
                this.messageQueue = [];
            } else {
                this.chatInterface.showNotification('You are back online!');
            }
        } else {
            this.chatInterface.showNotification('You are offline. Messages will be queued.');
        }
    }
    
    queueMessage(message) {
        if (!this.isOnline) {
            this.messageQueue.push(message);
            return true; // Message was queued
        }
        return false; // Message was not queued
    }
}

// Initialize premium features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for chat interface to initialize
    setTimeout(() => {
        window.premiumFeatures = new PremiumFeatures(window.chatInterface);
    }, 500);
}); 