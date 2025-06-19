# ⚡ Rebel Components - Performance Standards

Comprehensive performance guidelines and optimization strategies for fast, efficient, and scalable components.

## 📋 Overview

Rebel components are built with performance as a core principle. This document outlines our performance standards, optimization techniques, and monitoring strategies to ensure exceptional user experiences across all devices and network conditions.

## 🎯 Performance Goals

### **Core Web Vitals Targets**
- **Largest Contentful Paint (LCP)**: ≤ 2.5 seconds
- **First Input Delay (FID)**: ≤ 100 milliseconds  
- **Cumulative Layout Shift (CLS)**: ≤ 0.1
- **Interaction to Next Paint (INP)**: ≤ 200 milliseconds

### **Component-Specific Metrics**
- **Bundle Size**: ≤ 8KB per interactive component (gzipped)
- **Initialization Time**: ≤ 50ms for component setup
- **First Paint**: Component visible within 200ms
- **Memory Usage**: ≤ 2MB per component instance
- **CPU Impact**: ≤ 5ms total blocking time

---

## 📦 Bundle Size Optimization

### **Size Budgets by Component Type**

| Component Type | Max Size (Gzipped) | Examples |
|---------------|-------------------|----------|
| **Static** | 2KB | Cards, badges, alerts |
| **Interactive** | 5KB | Buttons, inputs, toggles |
| **Complex** | 8KB | Modals, dropdowns, tabs |
| **Data-Heavy** | 12KB | Tables, charts, calendars |
| **Advanced** | 15KB | Rich text editors, file uploads |

### **Bundle Analysis Tools**

```javascript
// Webpack Bundle Analyzer configuration
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    })
  ]
};

// Check component size
const fs = require('fs');
const gzip = require('gzip-size');

const componentCode = fs.readFileSync('component.html', 'utf8');
const gzipSize = gzip.sync(componentCode);
console.log(`Component size: ${gzipSize} bytes (gzipped)`);
```

### **Tree Shaking and Dead Code Elimination**

```javascript
// Mark side-effect-free code
// package.json
{
  "sideEffects": false
}

// Use ES modules for better tree shaking
// ✅ Good: ES modules
export const primaryButton = () => { /* ... */ };
export const secondaryButton = () => { /* ... */ };

// ❌ Bad: CommonJS
module.exports = {
  primaryButton: () => { /* ... */ },
  secondaryButton: () => { /* ... */ }
};
```

### **Code Splitting Strategies**

```javascript
// Dynamic imports for large features
async function loadAdvancedFeature() {
  const { AdvancedComponent } = await import('./advanced-component.js');
  return new AdvancedComponent();
}

// Conditional loading based on usage
if (element.dataset.advanced === 'true') {
  loadAdvancedFeature().then(component => {
    component.init(element);
  });
}
```

---

## 🚀 Loading Performance

### **Initialization Strategies**

#### **Lazy Initialization**
```javascript
// Initialize components when needed
class ComponentManager {
  constructor() {
    this.observers = new Map();
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.initializeComponent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      rootMargin: '50px' // Load slightly before visible
    });

    // Observe all uninitialized components
    document.querySelectorAll('[data-cs]:not([data-init="true"])')
      .forEach(el => observer.observe(el));
  }

  initializeComponent(element) {
    const componentName = element.dataset.cs;
    const ComponentClass = this.getComponentClass(componentName);
    
    if (ComponentClass) {
      new ComponentClass(element);
    }
  }
}
```

#### **Progressive Enhancement**
```html
<!-- Base HTML works without JavaScript -->
<div data-cs="disclosure" class="rebel-accordion">
  <details open>
    <summary>Section 1</summary>
    <div>Content 1</div>
  </details>
  <details>
    <summary>Section 2</summary>
    <div>Content 2</div>
  </details>
</div>

<!-- JavaScript enhances the experience -->
<script>
// Component enhances native details/summary
class AccordionComponent {
  constructor(element) {
    this.el = element;
    this.enhanceNativeControls();
  }
  
  enhanceNativeControls() {
    // Add smooth animations
    // Implement keyboard navigation
    // Add ARIA attributes
  }
}
</script>
```

### **Resource Loading Optimization**

#### **Critical Resource Prioritization**
```html
<!-- Preload critical fonts -->
<link rel="preload" 
      href="/fonts/inter-var.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>

<!-- Preconnect to external services -->
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- Critical CSS inline -->
<style>
  /* Critical above-the-fold styles */
  .rebel-hero { /* ... */ }
</style>

<!-- Non-critical CSS lazy loaded -->
<link rel="preload" 
      href="/css/components.css" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

#### **Image Optimization**
```html
<!-- Responsive images with lazy loading -->
<img src="placeholder.jpg"
     data-src="image-large.webp"
     data-srcset="image-small.webp 400w, 
                  image-medium.webp 800w, 
                  image-large.webp 1200w"
     sizes="(max-width: 400px) 400px, 
            (max-width: 800px) 800px, 
            1200px"
     loading="lazy"
     decoding="async"
     alt="Descriptive alt text">

<!-- SVG optimization -->
<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true">
  <path d="M12 2l3.09..." fill="currentColor"/>
</svg>
```

---

## 🔧 Runtime Performance

### **Efficient DOM Manipulation**

#### **Batch DOM Operations**
```javascript
// ✅ Good: Batch DOM updates
function updateMultipleElements(elements, data) {
  // Use DocumentFragment for batch operations
  const fragment = document.createDocumentFragment();
  
  elements.forEach((element, index) => {
    const clone = element.cloneNode(true);
    clone.textContent = data[index];
    fragment.appendChild(clone);
  });
  
  // Single DOM update
  container.appendChild(fragment);
}

// ❌ Bad: Multiple DOM updates
function updateElementsIndividually(elements, data) {
  elements.forEach((element, index) => {
    element.textContent = data[index]; // Each causes reflow
    element.style.display = 'block';   // Multiple style updates
  });
}
```

#### **Avoid Layout Thrashing**
```javascript
// ✅ Good: Batch reads and writes
function efficientLayout(elements) {
  // Batch all reads first
  const measurements = elements.map(el => ({
    element: el,
    width: el.offsetWidth,
    height: el.offsetHeight
  }));
  
  // Then batch all writes
  measurements.forEach(({ element, width, height }) => {
    element.style.width = `${width * 1.1}px`;
    element.style.height = `${height * 1.1}px`;
  });
}

// ❌ Bad: Interleaved reads and writes
function inefficientLayout(elements) {
  elements.forEach(element => {
    const width = element.offsetWidth;    // Read (triggers layout)
    element.style.width = `${width * 1.1}px`; // Write
    const height = element.offsetHeight; // Read (triggers layout again)
    element.style.height = `${height * 1.1}px`; // Write
  });
}
```

### **Event Handling Optimization**

#### **Passive Event Listeners**
```javascript
// ✅ Good: Passive listeners for scroll/touch
element.addEventListener('scroll', handleScroll, { 
  passive: true // Browser can optimize scrolling
});

element.addEventListener('touchstart', handleTouch, { 
  passive: true // Improves touch responsiveness
});

// ✅ Good: Debounce expensive operations
const debouncedResize = debounce(() => {
  updateLayout();
}, 150);

window.addEventListener('resize', debouncedResize, { passive: true });
```

#### **Event Delegation**
```javascript
// ✅ Good: Single listener for multiple elements
container.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) {
    const action = button.dataset.action;
    handleAction(action, button);
  }
});

// ❌ Bad: Multiple listeners
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    handleAction(button.dataset.action, button);
  });
});
```

### **Memory Management**

#### **Cleanup and Garbage Collection**
```javascript
class Component {
  constructor(element) {
    this.el = element;
    this.observers = [];
    this.timers = [];
    this.listeners = new Map();
    
    this.init();
  }
  
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    
    // Track for cleanup
    this.listeners.set(`${element}_${event}`, {
      element, event, handler, options
    });
  }
  
  destroy() {
    // Clean up event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners.clear();
    
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // Clear timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
    
    // Remove DOM references
    this.el = null;
  }
}
```

#### **Weak References for Large Objects**
```javascript
// Use WeakMap for component instances
const componentInstances = new WeakMap();

function getComponentInstance(element) {
  return componentInstances.get(element);
}

function setComponentInstance(element, instance) {
  componentInstances.set(element, instance);
}

// Automatic cleanup when element is removed from DOM
```

---

## 🎨 CSS Performance

### **Efficient Selectors**

#### **Selector Performance Guidelines**
```css
/* ✅ Good: Efficient selectors */
.rebel-button { }                    /* Class selector - fast */
[data-cs="button"] { }              /* Attribute selector - acceptable */
.rebel-button:hover { }             /* Pseudo-class - fast */

/* ⚠️ Acceptable: Moderate performance */
.rebel-form .rebel-input { }        /* Descendant - acceptable if specific */
.rebel-button[data-variant] { }     /* Class + attribute - acceptable */

/* ❌ Bad: Avoid these patterns */
* { }                               /* Universal selector - slow */
.rebel-form input[type="text"] { }  /* Complex descendant - slow */
div > span + p { }                  /* Complex combinators - slow */
```

#### **CSS Containment**
```css
/* Optimize rendering with containment */
.rebel-component {
  contain: layout style paint;
}

.rebel-isolated-component {
  contain: strict; /* Maximum containment */
}

.rebel-list-item {
  contain: layout; /* Prevent layout recalculation */
}
```

### **Animation Performance**

#### **GPU-Accelerated Animations**
```css
/* ✅ Good: GPU-accelerated properties */
.rebel-slide-in {
  transform: translateX(100%);
  transition: transform var(--rebel-duration-fast) var(--rebel-easing);
}

.rebel-slide-in.active {
  transform: translateX(0);
}

.rebel-fade {
  opacity: 0;
  transition: opacity var(--rebel-duration-fast) var(--rebel-easing);
}

.rebel-fade.active {
  opacity: 1;
}

/* ❌ Bad: CPU-intensive animations */
.rebel-bad-animation {
  left: 100px;
  transition: left 300ms; /* Triggers layout */
}

.rebel-bad-animation.active {
  left: 0;
}
```

#### **will-change Optimization**
```css
/* Use will-change sparingly and remove when done */
.rebel-animating {
  will-change: transform, opacity;
}

.rebel-animation-complete {
  will-change: auto; /* Remove hint when animation is done */
}
```

### **Critical CSS Strategy**
```html
<!-- Inline critical CSS -->
<style>
/* Above-the-fold component styles only */
.rebel-hero { 
  display: flex;
  min-height: 50vh;
  background: var(--rebel-primary);
}

.rebel-button-primary {
  background: var(--rebel-primary);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
}
</style>

<!-- Async load non-critical CSS -->
<link rel="preload" href="/css/components.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/components.css"></noscript>
```

---

## 📊 Performance Monitoring

### **Real User Monitoring (RUM)**

#### **Web Vitals Tracking**
```javascript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Track component-specific metrics
function trackComponentPerformance(componentName, duration) {
  if ('performance' in window) {
    performance.mark(`${componentName}-start`);
    
    setTimeout(() => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        `${componentName}-init`,
        `${componentName}-start`,
        `${componentName}-end`
      );
      
      const measure = performance.getEntriesByName(`${componentName}-init`)[0];
      sendToAnalytics({
        name: 'component-init',
        component: componentName,
        duration: measure.duration
      });
    }, 0);
  }
}
```

#### **Performance Observer**
```javascript
// Monitor long tasks
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 50) {
      console.warn('Long task detected:', {
        duration: entry.duration,
        startTime: entry.startTime,
        name: entry.name
      });
    }
  });
});

observer.observe({ entryTypes: ['longtask'] });

// Monitor layout shifts
const clsObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.hadRecentInput) return; // Ignore user-initiated shifts
    
    console.log('Layout shift:', {
      value: entry.value,
      sources: entry.sources
    });
  });
});

clsObserver.observe({ entryTypes: ['layout-shift'] });
```

### **Performance Testing**

#### **Lighthouse CI Integration**
```yaml
# .github/workflows/performance.yml
name: Performance Testing
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.8.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

#### **Bundle Size Monitoring**
```javascript
// bundle-size-check.js
const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');

const COMPONENT_SIZE_LIMITS = {
  'button': 2048,      // 2KB
  'modal': 8192,       // 8KB
  'table': 12288,      // 12KB
  'datepicker': 15360  // 15KB
};

function checkComponentSizes() {
  const componentsDir = path.join(__dirname, 'components');
  const components = fs.readdirSync(componentsDir);
  
  const results = [];
  
  components.forEach(componentDir => {
    const componentPath = path.join(componentsDir, componentDir);
    const files = fs.readdirSync(componentPath);
    
    files.forEach(file => {
      if (file.endsWith('.html')) {
        const filePath = path.join(componentPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const size = gzipSize.sync(content);
        const componentName = file.replace('.html', '');
        const limit = COMPONENT_SIZE_LIMITS[componentName] || 8192;
        
        results.push({
          component: componentName,
          size,
          limit,
          passing: size <= limit,
          ratio: (size / limit * 100).toFixed(1)
        });
      }
    });
  });
  
  return results;
}

const results = checkComponentSizes();
const failing = results.filter(r => !r.passing);

if (failing.length > 0) {
  console.error('Components exceeding size limits:');
  failing.forEach(result => {
    console.error(`❌ ${result.component}: ${result.size}B (${result.ratio}% of limit)`);
  });
  process.exit(1);
} else {
  console.log('✅ All components within size limits');
}
```

---

## 🔧 Development Tools

### **Performance Budget Configuration**

#### **Webpack Performance Budget**
```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 8192,      // 8KB per component
    maxEntrypointSize: 8192, // 8KB total
    hints: 'error',
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.html');
    }
  }
};
```

#### **Lighthouse Budget**
```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 2000
      },
      {
        "metric": "largest-contentful-paint", 
        "budget": 2500
      },
      {
        "metric": "cumulative-layout-shift",
        "budget": 0.1
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 50000
      },
      {
        "resourceType": "stylesheet",
        "budget": 20000
      }
    ]
  }
]
```

### **Performance Testing Utilities**

#### **Component Performance Tester**
```javascript
class PerformanceTester {
  constructor() {
    this.metrics = new Map();
  }
  
  async testComponent(componentName, iterations = 100) {
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Create component
      const element = document.createElement('div');
      element.dataset.cs = componentName;
      document.body.appendChild(element);
      
      // Initialize component
      const ComponentClass = this.getComponentClass(componentName);
      const instance = new ComponentClass(element);
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      // Cleanup
      instance.destroy();
      element.remove();
    }
    
    const metrics = this.calculateMetrics(times);
    this.metrics.set(componentName, metrics);
    
    return metrics;
  }
  
  calculateMetrics(times) {
    times.sort((a, b) => a - b);
    
    return {
      mean: times.reduce((a, b) => a + b) / times.length,
      median: times[Math.floor(times.length / 2)],
      p95: times[Math.floor(times.length * 0.95)],
      p99: times[Math.floor(times.length * 0.99)],
      min: times[0],
      max: times[times.length - 1]
    };
  }
  
  generateReport() {
    console.table(Array.from(this.metrics.entries()).map(([name, metrics]) => ({
      Component: name,
      'Mean (ms)': metrics.mean.toFixed(2),
      'P95 (ms)': metrics.p95.toFixed(2),
      'P99 (ms)': metrics.p99.toFixed(2)
    })));
  }
}
```

---

## 📱 Mobile Performance

### **Network Optimization**

#### **Adaptive Loading**
```javascript
// Detect network conditions and adapt
function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    effectiveType: connection?.effectiveType || '4g',
    downlink: connection?.downlink || 10,
    rtt: connection?.rtt || 50,
    saveData: connection?.saveData || false
  };
}

function shouldLoadFeature(feature) {
  const { effectiveType, saveData } = getNetworkInfo();
  
  // Skip non-essential features on slow connections or data saver
  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    return feature.essential;
  }
  
  // Load progressively based on network speed
  if (effectiveType === '3g') {
    return feature.priority <= 2;
  }
  
  return true; // Load everything on 4g+
}

// Example usage
if (shouldLoadFeature({ essential: false, priority: 3 })) {
  loadAdvancedAnimations();
}
```

#### **Resource Hints**
```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/rebel-icons.woff2" as="font" type="font/woff2" crossorigin>

<!-- Prefetch likely next resources -->
<link rel="prefetch" href="/components/modal.html">

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

### **Battery and CPU Optimization**

#### **Intersection Observer for Efficiency**
```javascript
// Efficient viewport monitoring
class VisibilityManager {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: '50px'
      }
    );
    
    this.visibleComponents = new Set();
  }
  
  observe(element) {
    this.observer.observe(element);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      const component = entry.target._instance;
      
      if (entry.isIntersecting) {
        this.visibleComponents.add(component);
        component?.onVisible?.(entry.intersectionRatio);
      } else {
        this.visibleComponents.delete(component);
        component?.onHidden?.();
      }
    });
  }
  
  // Optimize animations only for visible components
  requestAnimationFrame(callback) {
    if (this.visibleComponents.size > 0) {
      requestAnimationFrame(callback);
    }
  }
}
```

#### **Reduce Background Activity**
```javascript
// Page Visibility API to pause non-essential work
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations, timers, and polling
    pauseNonEssentialActivity();
  } else {
    // Resume activity
    resumeActivity();
  }
});

function pauseNonEssentialActivity() {
  // Stop animations
  document.querySelectorAll('.rebel-animated').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
  
  // Clear intervals
  if (window.rebelIntervals) {
    window.rebelIntervals.forEach(id => clearInterval(id));
  }
}
```

---

## 🏆 Performance Best Practices

### **Component Architecture**

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Build complex components from simple ones
3. **Lazy Loading**: Initialize components only when needed
4. **Progressive Enhancement**: Work without JavaScript, enhance with it
5. **Clean Boundaries**: Clear APIs and minimal external dependencies

### **Code Organization**

1. **Minimize Global Scope Pollution**: Use modules and namespaces
2. **Efficient Data Structures**: Choose appropriate data structures for your use case
3. **Avoid Memory Leaks**: Clean up event listeners, observers, and timers
4. **Cache Expensive Operations**: Store results of expensive calculations
5. **Optimize Loops**: Minimize work inside loops, prefer built-in methods

### **Asset Optimization**

1. **Compress Everything**: Use gzip/brotli compression
2. **Optimize Images**: Use modern formats (WebP, AVIF) with fallbacks
3. **Minimize Requests**: Bundle related resources, use CSS sprites
4. **Cache Strategically**: Set appropriate cache headers
5. **CDN Usage**: Serve static assets from CDNs

---

## 📊 Performance Checklist

### **Development Phase**
- [ ] Component size is within budget
- [ ] No memory leaks in destroy() method
- [ ] Event listeners use passive option where appropriate
- [ ] Expensive operations are debounced/throttled
- [ ] CSS uses efficient selectors
- [ ] Animations use GPU-accelerated properties

### **Testing Phase**
- [ ] Lighthouse score ≥ 90 for Performance
- [ ] No layout shifts (CLS ≤ 0.1)
- [ ] Fast initialization (≤ 50ms)
- [ ] Responsive under load
- [ ] Works on slow networks (3G simulation)

### **Production Phase**
- [ ] Real User Monitoring (RUM) implemented
- [ ] Performance budgets enforced
- [ ] Regular performance audits scheduled
- [ ] Error tracking for performance issues
- [ ] A/B testing for performance optimizations

---

## 🔗 Tools and Resources

### **Performance Testing**
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)**: Automated performance auditing
- **[WebPageTest](https://www.webpagetest.org/)**: Detailed performance analysis
- **[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)**: Built-in performance profiling
- **[Calibre](https://calibreapp.com/)**: Continuous performance monitoring
- **[SpeedCurve](https://speedcurve.com/)**: Performance monitoring and optimization

### **Bundle Analysis**
- **[Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)**: Visualize bundle contents
- **[Bundlephobia](https://bundlephobia.com/)**: Analyze package sizes
- **[Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)**: VS Code extension for import sizes

### **Monitoring Services**
- **[Core Web Vitals](https://web.dev/vitals/)**: Google's web performance metrics
- **[Sentry Performance](https://sentry.io/features/performance-monitoring/)**: Error and performance monitoring
- **[New Relic](https://newrelic.com/)**: Application performance monitoring
- **[DataDog](https://www.datadoghq.com/)**: Infrastructure and application monitoring

---

*Performance is not just about speed—it's about creating inclusive experiences that work for everyone, regardless of their device or network conditions.*