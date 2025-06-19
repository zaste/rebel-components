# 🌐 Rebel Components - Webflow Integration Guidelines

Comprehensive guide for implementing Rebel components in Webflow with best practices, limitations, and optimization strategies.

## 📋 Overview

Rebel components are specifically designed to work seamlessly within Webflow's ecosystem while maintaining full functionality and performance. This guide covers integration patterns, platform-specific considerations, and optimization techniques for Webflow projects.

## 🎯 Webflow Architecture Understanding

### **Webflow Rendering Pipeline**
1. **Designer**: Visual editing environment
2. **Code Export**: Clean, semantic HTML generation
3. **Hosting**: CDN-optimized delivery
4. **CMS**: Dynamic content integration
5. **E-commerce**: Shopping functionality layer

### **Component Integration Points**
- **Embed Widgets**: Primary integration method for Rebel components
- **Custom Code Blocks**: Head/body code injection
- **Collection Templates**: Dynamic content rendering
- **Interactions (IX2)**: Native animation system
- **Custom Attributes**: Data attribute configuration

---

## 🛠️ Implementation Methods

### **Method 1: Embed Widgets (Recommended)**

#### **Single Component Embed**
```html
<!-- Place in Webflow Embed Widget -->
<div data-cs="disclosure-modal" data-config='{"animation": true}'>
  <button data-trigger class="w-button">Open Modal</button>
  
  <div data-content role="dialog" aria-hidden="true">
    <div class="modal-content">
      <h2>Modal Title</h2>
      <p>Modal content goes here...</p>
      <button data-close class="w-button">Close</button>
    </div>
  </div>
</div>

<style>
/* Scoped component styles */
[data-cs="disclosure-modal"] {
  /* Component styles here */
}
</style>

<script>
/* Component JavaScript here */
</script>
```

#### **Multiple Components Embed**
```html
<!-- Single embed for multiple related components -->
<div class="rebel-components-container">
  <!-- Component 1 -->
  <div data-cs="input-form" id="contact-form">
    <!-- Form content -->
  </div>
  
  <!-- Component 2 -->
  <div data-cs="feedback-alert" id="form-feedback">
    <!-- Alert content -->
  </div>
</div>

<!-- Shared styles and scripts at bottom -->
<style>/* Shared component styles */</style>
<script>/* Component initialization */</script>
```

### **Method 2: Custom Code Integration**

#### **Head Code (Global Setup)**
```html
<!-- In Project Settings > Custom Code > Head Code -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">
<style>
  /* Critical Rebel design tokens */
  :root {
    --rebel-primary: #007bff;
    --rebel-text: #212529;
    --rebel-surface: #ffffff;
    /* Other essential tokens */
  }
  
  /* Base component styles */
  [data-cs] {
    position: relative;
    box-sizing: border-box;
  }
</style>
```

#### **Footer Code (Global Scripts)**
```html
<!-- In Project Settings > Custom Code > Footer Code -->
<script>
// Global Rebel component manager
window.RebelComponents = {
  instances: new Map(),
  ready: false,
  
  register(name, ComponentClass) {
    this[name] = ComponentClass;
  },
  
  init() {
    if (this.ready) return;
    this.ready = true;
    
    // Auto-initialize components
    this.scanAndInit();
    
    // Webflow-specific initialization
    if (window.Webflow) {
      window.Webflow.push(() => this.scanAndInit());
    }
  },
  
  scanAndInit() {
    document.querySelectorAll('[data-cs]:not([data-init="true"])')
      .forEach(el => this.initComponent(el));
  },
  
  initComponent(element) {
    const componentName = element.dataset.cs;
    const ComponentClass = this[componentName];
    
    if (ComponentClass) {
      const instance = new ComponentClass(element);
      this.instances.set(element, instance);
      element.dataset.init = 'true';
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RebelComponents.init());
} else {
  RebelComponents.init();
}
</script>
```

---

## 🎨 Webflow-Specific Styling

### **Working with Webflow Classes**

#### **Combining Webflow and Rebel Styles**
```html
<!-- Webflow Designer Structure -->
<div class="modal-wrapper">
  <!-- Rebel Component Embed -->
  <div data-cs="disclosure-modal" class="w-embed">
    <div class="rebel-modal-trigger">
      <!-- Use Webflow button classes -->
      <button class="button w-button" data-trigger>
        Open Modal
      </button>
    </div>
    
    <div class="rebel-modal-overlay" data-content>
      <!-- Combine Webflow layout with Rebel functionality -->
      <div class="modal-card w-container">
        <div class="modal-header">
          <h3 class="heading-3">Modal Title</h3>
          <button class="close-button w-button" data-close>×</button>
        </div>
        <div class="modal-body">
          <p class="paragraph">Modal content using Webflow typography.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### **Responsive Design Integration**
```css
/* Respect Webflow breakpoints */
@media screen and (max-width: 991px) {
  [data-cs="disclosure-modal"] .modal-card {
    width: 90vw;
    margin: var(--rebel-spacing-4);
  }
}

@media screen and (max-width: 767px) {
  [data-cs="disclosure-modal"] .modal-card {
    width: 95vw;
    margin: var(--rebel-spacing-2);
  }
}

@media screen and (max-width: 479px) {
  [data-cs="disclosure-modal"] .modal-card {
    width: 100vw;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }
}
```

### **Design System Integration**

#### **Inheriting Webflow Variables**
```css
/* Use Webflow's CSS custom properties when available */
[data-cs="component"] {
  --rebel-primary: var(--primary-color, #007bff);
  --rebel-text: var(--text-color, #333333);
  --rebel-surface: var(--background-color, #ffffff);
  
  /* Inherit Webflow typography */
  font-family: inherit;
  color: inherit;
}

/* Webflow color inheritance */
.rebel-inherit-colors {
  background-color: inherit;
  color: inherit;
  border-color: currentColor;
}
```

---

## 📦 CMS and Dynamic Content Integration

### **Collection List Integration**

#### **Dynamic Component Initialization**
```html
<!-- Collection Item Template -->
<div class="collection-item w-dyn-item">
  <div data-cs="collection-card" 
       data-config='{"itemId": "{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"}'>
    
    <!-- CMS Content -->
    <h3 class="card-title">{{wf {&quot;path&quot;:&quot;name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</h3>
    <p class="card-description">{{wf {&quot;path&quot;:&quot;description&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</p>
    
    <!-- Component Triggers -->
    <button data-trigger="view" class="w-button">
      View Details
    </button>
    <button data-trigger="edit" class="w-button">
      Edit Item
    </button>
  </div>
</div>

<script>
// Handle collection list updates
class CollectionCardComponent {
  constructor(element) {
    this.el = element;
    this.config = JSON.parse(element.dataset.config || '{}');
    this.itemId = this.config.itemId;
    
    this.init();
  }
  
  init() {
    // Bind events to CMS data
    this.bindCMSEvents();
    this.setupCollectionObserver();
  }
  
  bindCMSEvents() {
    this.el.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-trigger]');
      if (trigger) {
        const action = trigger.dataset.trigger;
        this.handleCMSAction(action);
      }
    });
  }
  
  handleCMSAction(action) {
    switch (action) {
      case 'view':
        window.location.href = `/items/${this.itemId}`;
        break;
      case 'edit':
        this.openEditModal();
        break;
    }
  }
  
  setupCollectionObserver() {
    // Watch for Webflow collection updates
    const listWrapper = this.el.closest('.w-dyn-list');
    if (listWrapper) {
      this.observeCollectionChanges(listWrapper);
    }
  }
  
  observeCollectionChanges(listWrapper) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList.contains('w-dyn-item')) {
            const component = node.querySelector('[data-cs="collection-card"]');
            if (component && !component.dataset.init) {
              new CollectionCardComponent(component);
            }
          }
        });
      });
    });
    
    observer.observe(listWrapper, {
      childList: true,
      subtree: true
    });
  }
}

// Register component
window.RebelComponents?.register('collection-card', CollectionCardComponent);
</script>
```

### **CMS Field Integration**

#### **Dynamic Configuration from CMS**
```html
<!-- CMS Template with JSON configuration -->
<div data-cs="dynamic-component"
     data-config='{{wf {&quot;path&quot;:&quot;component-config&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}'>
  
  <!-- CMS-driven content -->
  <h2>{{wf {&quot;path&quot;:&quot;title&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</h2>
  
  <!-- Conditional rendering based on CMS -->
  {{wf {&quot;path&quot;:&quot;show-advanced&quot;,&quot;type&quot;:&quot;Bool&quot;\} wf-conditional="true"}}
  <div data-advanced-features>
    <!-- Advanced features content -->
  </div>
  {{wf {&quot;path&quot;:&quot;show-advanced&quot;,&quot;type&quot;:&quot;Bool&quot;\} wf-conditional="true"}}
  
</div>

<!-- CMS Configuration Example -->
<!-- In CMS field "component-config": -->
<!-- {"variant": "featured", "autoplay": true, "duration": 5000} -->
```

---

## 🎭 Interactions (IX2) Integration

### **Coordinating with Webflow Animations**

#### **IX2-Aware Components**
```javascript
class IX2AwareComponent {
  constructor(element) {
    this.el = element;
    this.ixElements = new Map();
    
    this.init();
    this.setupIX2Integration();
  }
  
  setupIX2Integration() {
    // Wait for IX2 to be ready
    if (window.Webflow && window.Webflow.require) {
      this.ix2 = window.Webflow.require('ix2');
      this.bindIX2Events();
    } else {
      // Fallback for older Webflow versions
      this.setupFallbackAnimations();
    }
  }
  
  bindIX2Events() {
    // Listen for IX2 timeline events
    document.addEventListener('ix2:timeline:start', (e) => {
      if (this.el.contains(e.target)) {
        this.onIX2AnimationStart(e.detail);
      }
    });
    
    document.addEventListener('ix2:timeline:complete', (e) => {
      if (this.el.contains(e.target)) {
        this.onIX2AnimationComplete(e.detail);
      }
    });
  }
  
  onIX2AnimationStart(detail) {
    // Pause component animations during IX2
    this.pauseComponentAnimations();
  }
  
  onIX2AnimationComplete(detail) {
    // Resume component functionality
    this.resumeComponentAnimations();
  }
  
  triggerIX2Animation(elementId, animationName) {
    const element = document.querySelector(`[data-ix2-element="${elementId}"]`);
    if (element && this.ix2) {
      // Trigger IX2 animation programmatically
      element.click(); // or other trigger method
    }
  }
}
```

#### **Custom Easing Integration**
```css
/* Use Webflow's easing functions in components */
[data-cs="component"] {
  --rebel-easing-webflow-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --rebel-easing-webflow-ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --rebel-easing-webflow-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
  --rebel-easing-webflow-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
}

.rebel-webflow-animation {
  transition: all 300ms var(--rebel-easing-webflow-ease);
}
```

---

## 🔧 Platform Limitations and Workarounds

### **HTML/CSS Limitations**

#### **Template Tag Workaround**
```html
<!-- ❌ Won't work: Template tags are stripped -->
<template id="item-template">
  <div class="item">Content</div>
</template>

<!-- ✅ Workaround: Hidden div with data attribute -->
<div data-template="item" style="display: none;">
  <div class="item">Content</div>
</div>

<script>
function getTemplate(name) {
  const template = document.querySelector(`[data-template="${name}"]`);
  return template ? template.innerHTML : '';
}
</script>
```

#### **CSS @import Limitations**
```css
/* ❌ Won't work: @import not supported in embeds */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

/* ✅ Workaround: Use link tag in head */
/* Add to Project Settings > Custom Code > Head */
```

```html
<!-- In Head Code -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

### **JavaScript Limitations**

#### **ES Modules Workaround**
```html
<!-- ❌ Won't work: ES modules not supported -->
<script type="module">
  import { MyComponent } from './components.js';
</script>

<!-- ✅ Workaround: Use traditional scripts with namespace -->
<script>
(function() {
  'use strict';
  
  // Component namespace
  window.RebelComponents = window.RebelComponents || {};
  
  // Component definition
  window.RebelComponents.MyComponent = class {
    constructor(element) {
      // Component logic
    }
  };
})();
</script>
```

#### **External Resource Loading**
```javascript
// Safe external resource loading
function loadExternalScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  script.onerror = () => {
    console.warn(`Failed to load script: ${src}`);
    callback(); // Still call callback to prevent hanging
  };
  document.head.appendChild(script);
}

// Usage
loadExternalScript('https://cdn.jsdelivr.net/npm/library@1.0.0/dist/library.min.js', () => {
  // Library is loaded
  initializeComponent();
});
```

### **Performance Considerations**

#### **Embed Size Optimization**
```html
<!-- Minimize embed content -->
<div data-cs="component" id="comp-1"></div>

<!-- Move bulk content to external initialization -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const component = document.getElementById('comp-1');
  
  // Build component content programmatically
  component.innerHTML = generateComponentHTML();
  
  // Initialize after content is built
  new RebelComponents.ComponentClass(component);
});

function generateComponentHTML() {
  return `
    <div class="component-content">
      <!-- Large template content -->
    </div>
  `;
}
</script>
```

---

## 🚀 Performance Optimization for Webflow

### **Webflow-Specific Optimizations**

#### **Defer Non-Critical Components**
```javascript
// Defer heavy components until after Webflow is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize critical components first
  initializeCriticalComponents();
  
  // Defer heavy components
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      initializeHeavyComponents();
    });
  } else {
    setTimeout(initializeHeavyComponents, 100);
  }
});

function initializeCriticalComponents() {
  // Above-the-fold components only
  document.querySelectorAll('[data-cs][data-priority="high"]')
    .forEach(el => RebelComponents.initComponent(el));
}

function initializeHeavyComponents() {
  // Below-the-fold and heavy components
  document.querySelectorAll('[data-cs]:not([data-init="true"])')
    .forEach(el => RebelComponents.initComponent(el));
}
```

#### **Lazy Loading with Intersection Observer**
```javascript
// Efficient lazy loading for Webflow
class WebflowLazyLoader {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    
    this.init();
  }
  
  init() {
    // Observe all uninitialized components
    document.querySelectorAll('[data-cs]:not([data-init="true"])')
      .forEach(el => {
        if (el.dataset.lazy !== 'false') {
          this.observer.observe(el);
        } else {
          // Initialize immediately if lazy=false
          RebelComponents.initComponent(el);
        }
      });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Initialize component
        RebelComponents.initComponent(element);
        
        // Stop observing
        this.observer.unobserve(element);
      }
    });
  }
}

// Initialize lazy loader after Webflow is ready
if (window.Webflow) {
  window.Webflow.push(() => {
    new WebflowLazyLoader();
  });
} else {
  new WebflowLazyLoader();
}
```

### **CDN and Caching Strategies**

#### **External Resource Management**
```javascript
// Cache external resources
class ResourceManager {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }
  
  async loadCSS(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    if (this.loading.has(url)) {
      return this.loading.get(url);
    }
    
    const promise = this.fetchCSS(url);
    this.loading.set(url, promise);
    
    try {
      const css = await promise;
      this.cache.set(url, css);
      this.loading.delete(url);
      return css;
    } catch (error) {
      this.loading.delete(url);
      throw error;
    }
  }
  
  async fetchCSS(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSS: ${url}`);
    }
    return response.text();
  }
  
  injectCSS(css, id) {
    if (document.getElementById(id)) return;
    
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

// Usage
const resourceManager = new ResourceManager();
resourceManager.loadCSS('https://cdn.jsdelivr.net/npm/component-styles@1.0.0/dist/styles.css')
  .then(css => resourceManager.injectCSS(css, 'component-styles'));
```

---

## 🎯 Best Practices

### **Development Workflow**

#### **Component Testing in Webflow**
1. **Local Development**: Test components in isolated environment
2. **Staging Site**: Test in actual Webflow project on staging
3. **Preview Mode**: Verify functionality in Webflow Preview
4. **Cross-Device Testing**: Test on actual devices, not just DevTools
5. **CMS Testing**: Test with real CMS content and edge cases

#### **Version Control for Embeds**
```javascript
// Version your embedded components
const COMPONENT_VERSION = '1.2.3';

class VersionedComponent {
  constructor(element) {
    this.version = COMPONENT_VERSION;
    this.el = element;
    
    // Check for version compatibility
    const requiredVersion = element.dataset.minVersion;
    if (requiredVersion && this.isVersionLower(requiredVersion)) {
      console.warn(`Component requires version ${requiredVersion}, but ${this.version} is loaded`);
    }
    
    this.init();
  }
  
  isVersionLower(required) {
    const current = this.version.split('.').map(Number);
    const req = required.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (current[i] < req[i]) return true;
      if (current[i] > req[i]) return false;
    }
    return false;
  }
}
```

### **Error Handling and Debugging**

#### **Webflow-Specific Error Handling**
```javascript
// Enhanced error handling for Webflow environment
class WebflowErrorHandler {
  constructor() {
    this.setupErrorTracking();
    this.setupWebflowSpecificChecks();
  }
  
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason
      });
    });
  }
  
  setupWebflowSpecificChecks() {
    // Check if Webflow is loaded
    if (typeof window.Webflow === 'undefined') {
      this.logWarning('Webflow not detected', {
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
    
    // Check for common Webflow issues
    this.checkWebflowIssues();
  }
  
  checkWebflowIssues() {
    // Check for IX2 conflicts
    const ix2Elements = document.querySelectorAll('[data-w-id]');
    const rebelComponents = document.querySelectorAll('[data-cs]');
    
    ix2Elements.forEach(ix2El => {
      const rebelComponent = ix2El.closest('[data-cs]');
      if (rebelComponent) {
        this.logInfo('IX2 element inside Rebel component', {
          componentType: rebelComponent.dataset.cs,
          ix2Id: ix2El.dataset.wId
        });
      }
    });
  }
  
  logError(type, details) {
    console.error(`[Rebel Components] ${type}:`, details);
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `${type}: ${details.message || details.reason}`,
        fatal: true
      });
    }
  }
  
  logWarning(message, details) {
    console.warn(`[Rebel Components] ${message}:`, details);
  }
  
  logInfo(message, details) {
    console.info(`[Rebel Components] ${message}:`, details);
  }
}

// Initialize error handler
new WebflowErrorHandler();
```

---

## 📊 Testing and QA

### **Webflow-Specific Testing Checklist**

#### **Functionality Testing**
- [ ] Components work in Webflow Designer preview
- [ ] Components work on published site
- [ ] Components work with Webflow hosting
- [ ] Components work with custom domain
- [ ] Components survive Webflow republishing
- [ ] Components work with Webflow CMS content
- [ ] Components work with Webflow E-commerce
- [ ] Components work with Webflow Forms

#### **Integration Testing**
- [ ] No conflicts with Webflow's jQuery
- [ ] IX2 animations don't break components
- [ ] Components don't interfere with Webflow interactions
- [ ] Custom code doesn't conflict with Webflow's CSS
- [ ] Components work with Webflow's responsive system
- [ ] Components respect Webflow's style inheritance

#### **Performance Testing**
- [ ] Embed size is reasonable (< 50KB per embed)
- [ ] Components don't slow down page load
- [ ] Components don't conflict with Webflow's lazy loading
- [ ] Components work with Webflow's image optimization
- [ ] No memory leaks during navigation

### **Common Issues and Solutions**

#### **CSS Conflicts**
```css
/* Issue: Webflow's normalize conflicts with component styles */
/* Solution: Scope component styles and reset specific properties */

[data-cs="component"] {
  /* Reset Webflow's base styles if needed */
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[data-cs="component"] * {
  /* Ensure consistent box model */
  box-sizing: inherit;
}

/* Prevent Webflow's utility classes from interfering */
[data-cs="component"] .w-button {
  /* Override only necessary properties */
  background: var(--rebel-primary) !important;
  border: none !important;
}
```

#### **JavaScript Conflicts**
```javascript
// Issue: Webflow's jQuery version conflicts
// Solution: Use noConflict mode or vanilla JS

(function($) {
  'use strict';
  
  // Use local jQuery reference
  // or use vanilla JS entirely
  
})(window.jQuery || window.$);

// Better: Use vanilla JS to avoid conflicts entirely
class WebflowSafeComponent {
  constructor(element) {
    // No jQuery dependencies
    this.el = element;
    this.init();
  }
  
  // Vanilla JS methods only
}
```

---

## 🔗 Resources and Tools

### **Webflow-Specific Tools**
- **[Webflow University](https://university.webflow.com/)**: Official learning resources
- **[Webflow Developer Documentation](https://developers.webflow.com/)**: API and integration docs
- **[Finsweet Attributes](https://finsweet.com/attributes)**: Webflow enhancement library
- **[Client-First](https://www.finsweet.com/client-first)**: CSS naming methodology for Webflow

### **Testing Tools**
- **[Webflow Preview](https://webflow.com/feature/preview-mode)**: Test designs before publishing
- **[Webflow Staging](https://university.webflow.com/lesson/staging-subdomain)**: Test with real hosting
- **[Browser Developer Tools](https://developers.google.com/web/tools/chrome-devtools)**: Debug in production
- **[Webflow Console](https://console.webflow.com/)**: Monitor site performance

### **Community Resources**
- **[Webflow Forum](https://forum.webflow.com/)**: Community discussions
- **[FinSweet](https://www.finsweet.com/)**: Advanced Webflow development
- **[Flow Ninja](https://www.flowninja.co/)**: Webflow tutorials and resources
- **[Webflow Conf](https://conf.webflow.com/)**: Annual conference and updates

---

## 🎯 Implementation Examples

### **Complete E-commerce Integration**
```html
<!-- Product component with Webflow E-commerce -->
<div data-cs="ecommerce-product" 
     data-product-id="{{wf {&quot;path&quot;:&quot;ec-product-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"
     class="w-commerce-productquickviewwrapper">
  
  <!-- Product image with Webflow commerce -->
  <img src="{{wf {&quot;path&quot;:&quot;ec-product-images&quot;,&quot;type&quot;:&quot;ImageRef&quot;\} }}" 
       alt="{{wf {&quot;path&quot;:&quot;name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"
       class="w-commerce-productquickviewimage">
  
  <!-- Product details -->
  <div class="product-details">
    <h3>{{wf {&quot;path&quot;:&quot;name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</h3>
    <div class="w-commerce-productquickviewprice">
      {{wf {&quot;path&quot;:&quot;ec-product-price&quot;,&quot;type&quot;:&quot;CommercePrice&quot;\} }}
    </div>
    
    <!-- Enhanced add to cart with quantity selector -->
    <div data-rebel-quantity-selector>
      <button data-action="decrease">-</button>
      <input type="number" value="1" min="1" data-quantity>
      <button data-action="increase">+</button>
    </div>
    
    <!-- Webflow add to cart form -->
    <form data-commerce-type="add-to-cart-form" class="w-commerce-productquickviewaddtocartform">
      <input type="hidden" data-commerce-product-id="{{wf {&quot;path&quot;:&quot;ec-product-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">
      <button type="submit" data-commerce-add-to-cart="Add to Cart" 
              class="w-commerce-productquickviewaddtocartbutton">
        Add to Cart
      </button>
    </form>
  </div>
</div>

<script>
class EcommerceProductComponent {
  constructor(element) {
    this.el = element;
    this.productId = element.dataset.productId;
    this.quantityInput = element.querySelector('[data-quantity]');
    this.form = element.querySelector('[data-commerce-type="add-to-cart-form"]');
    
    this.init();
  }
  
  init() {
    this.bindQuantityControls();
    this.bindCartEvents();
  }
  
  bindQuantityControls() {
    this.el.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'increase' || action === 'decrease') {
        e.preventDefault();
        this.updateQuantity(action);
      }
    });
  }
  
  updateQuantity(action) {
    const current = parseInt(this.quantityInput.value) || 1;
    const newValue = action === 'increase' ? current + 1 : Math.max(1, current - 1);
    
    this.quantityInput.value = newValue;
    this.quantityInput.dispatchEvent(new Event('change'));
  }
  
  bindCartEvents() {
    this.form.addEventListener('submit', (e) => {
      // Add custom tracking or validation
      this.trackAddToCart();
    });
  }
  
  trackAddToCart() {
    // Custom analytics tracking
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: this.getProductPrice(),
        items: [{
          item_id: this.productId,
          item_name: this.getProductName(),
          quantity: parseInt(this.quantityInput.value)
        }]
      });
    }
  }
}

// Register component
window.RebelComponents?.register('ecommerce-product', EcommerceProductComponent);
</script>
```

---

*Remember: Webflow is a powerful platform, and Rebel components are designed to enhance, not replace, its native capabilities. Always leverage Webflow's strengths while adding the interactive functionality you need.*