# 🎨 Rebel Components Design System

A comprehensive, production-ready design system built for modern web development with accessibility, performance, and developer experience at its core.

## 📋 Overview

The Rebel Design System provides a complete foundation for building consistent, accessible, and performant user interfaces. Built with CSS custom properties, semantic HTML, and progressive enhancement principles.

## 🚀 Quick Start

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/rebel-components.git

# Navigate to design system
cd rebel-components/design-system
```

### **Basic Usage**

```html
<!-- Import complete system -->
<link rel="stylesheet" href="design-system/index.css">

<!-- Or import individual modules -->
<link rel="stylesheet" href="design-system/tokens.css">
<link rel="stylesheet" href="design-system/typography.css">
<link rel="stylesheet" href="design-system/spacing.css">
<link rel="stylesheet" href="design-system/colors.css">
```

### **First Component**

```html
<div class="rebel-p-4 rebel-bg-primary rebel-text-white rebel-radius-md">
  <h2 class="rebel-text-xl rebel-font-bold rebel-mb-2">Welcome</h2>
  <p class="rebel-text-base rebel-leading-relaxed">
    Built with Rebel Design System
  </p>
</div>
```

## 📁 File Structure

```
design-system/
├── 📄 index.css                 # Complete system import
├── 📄 variables.css             # Variables only (no utilities)
├── 🎨 tokens.css               # Complete design token system
├── 📊 tokens.json              # Token definitions for tools
├── 📝 typography.css           # Typography scale & styles
├── 📏 spacing.css              # Spacing system & utilities
├── 🌈 colors.css               # Color palette & utilities
└── 📚 guidelines/
    ├── ♿ accessibility.md      # Accessibility standards
    ├── ⚡ performance.md        # Performance guidelines
    └── 🌐 webflow.md           # Webflow integration guide
```

## 🎯 Design Tokens

### **Color System**
- **Primary Scale**: 50-900 with semantic variants
- **Secondary**: Full grayscale palette
- **Semantic**: Success, warning, error, info
- **Surface**: Background and overlay colors
- **Interactive**: Hover, focus, active states

### **Typography Scale**
- **Sizes**: xs (12px) → 9xl (128px) with fluid scaling
- **Weights**: 100-900 with semantic names
- **Families**: Sans, serif, monospace with system fonts
- **Line Heights**: none → loose for optimal readability

### **Spacing System**
- **Base**: 0.5rem (8px) for consistent grid alignment
- **Scale**: 0 → 32 (256px) following mathematical progression
- **Utilities**: Margin, padding, gap with logical properties
- **Semantic**: Component-specific spacing patterns

## 🛠️ Usage Patterns

### **Design Tokens**

```css
/* Use design tokens in custom CSS */
.my-component {
  padding: var(--rebel-spacing-4);
  background: var(--rebel-primary);
  color: var(--rebel-text-on-primary);
  border-radius: var(--rebel-radius-md);
  transition: all var(--rebel-duration-fast) var(--rebel-easing);
}
```

### **Utility Classes**

```html
<!-- Spacing utilities -->
<div class="rebel-p-4 rebel-m-2 rebel-gap-3">
  
  <!-- Typography utilities -->
  <h1 class="rebel-text-3xl rebel-font-bold rebel-tracking-tight">
    Heading
  </h1>
  
  <!-- Color utilities -->
  <p class="rebel-text-secondary rebel-bg-surface-alt rebel-border-light">
    Content with semantic colors
  </p>
  
</div>
```

### **Semantic Components**

```html
<!-- Pre-styled semantic components -->
<article class="rebel-card-content">
  <header class="rebel-heading-2">Article Title</header>
  <main class="rebel-body">Article content...</main>
  <footer class="rebel-caption">Published today</footer>
</article>
```

## 🎨 Theming Support

### **Built-in Themes**
- **Light Theme**: Default, optimized for readability
- **Dark Theme**: Automatic with `prefers-color-scheme: dark`
- **High Contrast**: WCAG compliance with `prefers-contrast: high`
- **Print**: Optimized for print media

### **Custom Themes**

```css
/* Custom theme implementation */
[data-theme="brand"] {
  --rebel-primary: #your-brand-color;
  --rebel-surface: #your-surface-color;
  /* Override any tokens needed */
}
```

```html
<!-- Apply custom theme -->
<div data-theme="brand">
  <!-- Content uses custom theme -->
</div>
```

## 📱 Responsive Design

### **Container Queries First**
```css
/* Modern responsive design */
.component {
  container-name: component;
  container-type: inline-size;
}

@container component (max-width: 400px) {
  .component__content {
    flex-direction: column;
    gap: var(--rebel-spacing-2);
  }
}
```

### **Breakpoint System**
```css
/* Available breakpoints */
--rebel-breakpoint-xs: 475px;
--rebel-breakpoint-sm: 640px;
--rebel-breakpoint-md: 768px;
--rebel-breakpoint-lg: 1024px;
--rebel-breakpoint-xl: 1280px;
--rebel-breakpoint-2xl: 1536px;
```

## ♿ Accessibility Features

### **Built-in Compliance**
- ✅ **WCAG 2.1 AA** color contrast ratios
- ✅ **Focus management** with clear indicators
- ✅ **Touch targets** minimum 44px size
- ✅ **Motion preferences** respect user settings
- ✅ **Screen reader** optimized semantic markup

### **Accessibility Utilities**

```html
<!-- Screen reader only content -->
<span class="sr-only">Additional context for screen readers</span>

<!-- Skip links -->
<a href="#main-content" class="rebel-skip-link">Skip to main content</a>

<!-- Focus management -->
<button class="rebel-focus-enhanced">Accessible button</button>
```

## ⚡ Performance Optimization

### **Size Budgets**
- **Core tokens**: ~4KB (gzipped)
- **Typography**: ~3KB (gzipped)  
- **Spacing**: ~5KB (gzipped)
- **Colors**: ~4KB (gzipped)
- **Total system**: ~16KB (gzipped)

### **Loading Strategies**

```html
<!-- Critical CSS inline -->
<style>
  /* Critical above-the-fold styles */
  @import url('design-system/variables.css');
  .hero { /* critical styles */ }
</style>

<!-- Non-critical CSS lazy loaded -->
<link rel="preload" href="design-system/index.css" as="style" onload="this.rel='stylesheet'">
```

## 🔧 Integration Guides

### **Webflow Integration**
See [webflow.md](guidelines/webflow.md) for complete Webflow integration guide including:
- Embed widget patterns
- CMS integration
- IX2 coordination
- Performance optimization

### **Framework Integration**

#### **React/Next.js**
```jsx
import 'design-system/index.css';

function MyComponent() {
  return (
    <div className="rebel-p-4 rebel-bg-primary">
      <h1 className="rebel-text-xl rebel-font-bold">
        React Component
      </h1>
    </div>
  );
}
```

#### **Vue/Nuxt**
```vue
<template>
  <div class="rebel-p-4 rebel-bg-primary">
    <h1 class="rebel-text-xl rebel-font-bold">
      Vue Component
    </h1>
  </div>
</template>

<style>
@import 'design-system/index.css';
</style>
```

#### **Vanilla HTML**
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="design-system/index.css">
</head>
<body>
  <div class="rebel-p-4 rebel-bg-primary">
    <h1 class="rebel-text-xl rebel-font-bold">
      Vanilla HTML
    </h1>
  </div>
</body>
</html>
```

## 🎨 Design Tool Integration

### **Figma Integration**
```javascript
// Import tokens into Figma using Token Studio
// File: tokens.json
import tokens from './tokens.json';

// Use with Figma Token Studio plugin
// https://docs.tokens.studio/
```

### **Style Dictionary**
```javascript
// style-dictionary.config.js
module.exports = {
  source: ['design-system/tokens.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [{
        destination: '_variables.scss',
        format: 'scss/variables'
      }]
    },
    javascript: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
};
```

## 📊 Browser Support

### **Modern Browsers**
- Chrome 88+ ✅
- Firefox 78+ ✅  
- Safari 14+ ✅
- Edge 88+ ✅

### **Progressive Enhancement**
- CSS custom properties fallbacks
- Container query fallbacks
- Modern CSS feature detection

```css
/* Progressive enhancement example */
.component {
  margin: 1rem; /* fallback */
  margin: var(--rebel-spacing-4); /* modern */
}

@supports (container-type: inline-size) {
  .component {
    container: component / inline-size;
  }
}
```

## 🧪 Testing and Validation

### **Automated Testing**
```bash
# CSS validation
npm run validate:css

# Accessibility testing
npm run test:a11y

# Performance budgets
npm run test:performance

# Browser compatibility
npm run test:browsers
```

### **Manual Testing Checklist**
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Mobile touch targets
- [ ] Performance within budgets

## 🔄 Versioning and Updates

### **Semantic Versioning**
- **Major**: Breaking changes to tokens or utilities
- **Minor**: New tokens, utilities, or components  
- **Patch**: Bug fixes and optimizations

### **Migration Guide**
See migration documentation for updating between versions:
- Token changes and deprecations
- Utility class updates
- Breaking change handling

## 🤝 Contributing

### **Development Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### **Adding New Tokens**
1. Add token to `tokens.json`
2. Update corresponding CSS file
3. Add utility classes if needed
4. Update documentation
5. Add tests and examples

### **Guidelines**
- Follow existing naming conventions
- Ensure accessibility compliance
- Add documentation and examples
- Test across supported browsers
- Update version numbers appropriately

## 📚 Resources

### **Documentation**
- [Accessibility Guidelines](guidelines/accessibility.md)
- [Performance Standards](guidelines/performance.md)
- [Webflow Integration](guidelines/webflow.md)

### **Tools and Libraries**
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Token transformation
- [Figma Token Studio](https://docs.tokens.studio/) - Design tool integration
- [PostCSS](https://postcss.org/) - CSS processing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance testing

### **Inspiration**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chakra UI](https://chakra-ui.com/) - Component library design
- [Material Design](https://material.io/) - Design system principles
- [Polaris](https://polaris.shopify.com/) - Shopify's design system

## 📞 Support

### **Getting Help**
- 📖 Read the documentation first
- 🔍 Search existing issues
- 💬 Join the community discussions
- 🐛 Report bugs with reproduction steps
- 💡 Request features with use cases

### **Community**
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and community help
- Discord: Real-time community chat

---

## 🏆 Key Benefits

### **For Developers**
- ⚡ **Fast Development**: Pre-built utilities and patterns
- 🔧 **Great DX**: Autocomplete, documentation, examples
- 🎯 **Consistency**: Enforced design standards
- ♿ **Accessibility**: Built-in WCAG compliance

### **For Designers**
- 🎨 **Design Tokens**: Single source of truth
- 📐 **Consistent Spacing**: Mathematical scale
- 🌈 **Color System**: Semantic and accessible
- 📱 **Responsive**: Mobile-first approach

### **For Teams**
- 🤝 **Collaboration**: Shared design language
- 📈 **Scalability**: System grows with your needs
- 🔄 **Maintainability**: Centralized updates
- 🎯 **Quality**: Performance and accessibility built-in

---

**Ready to build amazing experiences with the Rebel Design System!** 🚀

For detailed implementation guides, see the individual documentation files in the `guidelines/` directory.