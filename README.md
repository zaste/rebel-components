# 🚀 RUN:REBEL Components

**Advanced interactive components library for RUN:REBEL**

Framework-agnostic UI components optimized for Webflow and modern web development with integrated GTM analytics.

## ✨ Features

- 🏗️ **Framework-agnostic** components (HTML/CSS/JS)
- 📊 **GTM Integration** built-in for advanced analytics
- 📱 **Responsive design** with mobile-first approach
- 🎨 **Design system** powered by CSS custom properties
- 📚 **Live preview** environment for rapid development
- 🧪 **Debug tools** integrated for development
- 📦 **Ready for production** deployment

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended)

1. Click **Code** → **Open with Codespaces**
2. Wait for auto-installation
3. **Live preview automatically opens at port 3000**

### Option 2: Local Development

```bash
git clone https://github.com/zaste/rebel-components.git
cd rebel-components
npm install
npm run dev
```

**🌐 Open http://localhost:3000**

## 📱 Live Preview URLs

The development environment automatically forwards these ports:

- **Port 3000**: Main live preview (Vite dev server)
- **Port 3001**: Playground environment  
- **Port 4000**: Build preview
- **Port 6006**: Storybook documentation

## 🎯 Available Components

### Terminal Hero
Advanced typing animation component with GTM tracking:

```html
<div data-cs="terminal-hero" 
     data-phrases='["REAL MISSION", "REAL STAKES", "REAL REWARDS"]'
     data-speed="50"
     data-cta="RUN: REBEL"
     data-use-real-coords="true"
     data-debug-mode="true">
</div>
```

**Features:**
- ⌨️ Realistic typing animation
- 📊 GTM event tracking (5+ events)
- 🌍 Real-time geolocation
- 📱 Fully responsive
- 🎮 Interactive (click to restart, ESC to skip)

## 📊 GTM Integration

Components automatically send events to `window.dataLayer`:

- `terminal_load` - Component initialization
- `terminal_typing_start` - Animation begins
- `terminal_typing_complete` - Animation finished
- `terminal_cta_click` - User interaction (main conversion event)
- `coordinates_located` - Geolocation success

### Event Data Structure
```javascript
{
  event: 'terminal_cta_click',
  anonymous_id: 'uuid',
  session_id: 'uuid', 
  device_type: 'desktop|tablet|mobile',
  coordinates: { latitude: 40.7128, longitude: -74.0060 },
  engagement_score: 8,
  // ... additional properties
}
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start live preview (port 3000)
npm run playground       # Alternative preview (port 3001)

# Build & Preview  
npm run build           # Build for production
npm run preview         # Preview build (port 4000)

# Documentation
npm run storybook       # Start Storybook (port 6006)

# Code Quality
npm run lint            # ESLint
npm run format          # Prettier
npm run test            # Vitest
```

## 📁 Project Structure

```
rebel-components/
├── src/
│   ├── index.html              # Main live preview
│   ├── components/             # Component library
│   │   └── terminal-hero/      # Terminal Hero component
│   ├── shared/                 # Shared utilities
│   │   ├── styles/            # Design system
│   │   └── utils/             # JavaScript utilities
│   └── preview/               # Development playground
├── design-system.css          # Base design system
├── vite.config.js            # Build configuration
└── package.json              # Dependencies & scripts
```

## 🎨 Design System

The library includes a comprehensive design system with:

- **Color tokens** (Brand red #FF3131 + neutrals)
- **Typography** (JetBrains Mono optimized)
- **Spacing** (4px base scale)
- **Components** (Button, Input, Card, Terminal, etc.)
- **Responsive** breakpoints
- **Glassmorphism** effects
- **Accessibility** features

## 🚀 Usage in Webflow

### 1. Add Component HTML
Copy the component HTML from the live preview or documentation.

### 2. Include Styles
Link to the design system CSS:
```html
<link rel="stylesheet" href="path/to/design-system.css">
```

### 3. Add Component Script
Include the component JavaScript:
```html
<script src="path/to/component.js"></script>
```

### 4. GTM Setup (Optional)
Components automatically send events to `dataLayer` if GTM is configured in your Webflow project.

## 🧪 Debug Mode

Enable debug mode to see GTM events in console:

```html
<div data-cs="terminal-hero" data-debug-mode="true">
```

Debug helpers available at `window.RR_DEBUG`:

```javascript
// Get current dataLayer
RR_DEBUG.getDataLayer()

// Get anonymous ID
RR_DEBUG.getAnonymousId()

// Send test event
RR_DEBUG.testEvent('test_event', { test: true })
```

## 🌍 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in live preview
5. Submit a pull request

---

**Built with ❤️ by the RUN:REBEL team**