# BreetGPT Premium Chat Interface

A premium conversational AI interface for Role Model Academy featuring advanced visual effects, dynamic elements, and enhanced user experience features.

## Features

### Advanced Visual Features
- **Dynamic Backgrounds**: Context-aware background changes based on conversation topics
- **Advanced Animations**: Smooth page transitions and element animations
- **Custom Icons**: Using Remix Icon set for a consistent and modern look
- **Enhanced Typography**: Dynamic text sizing and improved hierarchy

### Premium UX Features
- **Smart Suggestions**: Context-aware follow-up questions based on conversation
- **Conversation History**: Visual conversation threads with easy navigation
- **Quick Actions**: Buttons for frequently used functions (clear, export, history, share)
- **Call-to-Action Integration**: Subtle links to Role Model Academy resources

### Advanced Interactions
- **Gesture Support**: Swipe actions for mobile users
- **Keyboard Shortcuts**: Press `F1` to see all available shortcuts
- **Contextual Menus**: Right-click on messages for additional options
- **Voice Input**: Speech-to-text integration for hands-free interaction

### Technical Excellence
- **Performance Optimization**: Lazy loading resources and efficient animations
- **Advanced Accessibility**: Screen reader support and keyboard navigation
- **Analytics Integration**: Tracking user interactions and behavior
- **Offline Capability**: Basic offline message queue when connection is lost

## Using the Interface

### Keyboard Shortcuts
- `/` - Focus the input field
- `Escape` - Blur the input field
- `Up Arrow` - Cycle through previous messages
- `F1` - Show keyboard shortcuts help

### Quick Actions
- **Clear Chat** - Delete all conversation history
- **Export Chat** - Download conversation as a text file
- **History** - View and navigate conversation threads
- **Share** - Share conversation with others

### Context Menus
Right-click on any message to:
- Copy message text
- Delete the message
- Edit your messages
- Share the message

### Smart Suggestions
After each assistant response, you'll see suggested follow-up questions based on the conversation context.

## Technical Implementation

The project consists of:

- `index.html` - Main structure and UI elements
- `style.css` - Styling for all components
- `main.js` - Core chat functionality
- `enhanced-features.js` - Premium features implementation

## Browser Support

The interface works best on modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Mobile support includes iOS Safari and Chrome for Android.

## Development

### Adding New Features

New features should be added to the `enhanced-features.js` file as methods of the `PremiumFeatures` class.

### Styling New Components

Add new component styles to the appropriate sections in `style.css` following the existing design patterns and using CSS variables for colors, shadows, and border radius.

### Analytics Integration

All user interactions are tracked through the analytics system. New features should implement tracking using:

```javascript
this.analytics.track('event_name', { property: value });
```

## License

This project is proprietary software of Role Model Academy.

## Credits

- Remix Icon - [remixicon.com](https://remixicon.com/)
- Inter Font - [rsms.me/inter](https://rsms.me/inter/) 