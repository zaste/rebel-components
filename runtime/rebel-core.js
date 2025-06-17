/*!
 * Rebel Core v10.2 - Framework-agnostic component system
 * Size: ~2kb gzipped | License: MIT
 * Optimized for Webflow and modern web development
 */

(function(global) {
  'use strict';
  
  // Core namespace
  const R = global.R = global.Rebel = {
    version: '10.2.0',
    components: new Map(),
    modules: new Map(),
    config: {
      debug: false,
      autoInit: true,
      observer: true
    }
  };
  
  // Component registry and lifecycle management
  const ComponentRegistry = {
    register(name, ComponentClass) {
      R.components.set(name, ComponentClass);
      if (R.config.debug) {
        console.log(`[Rebel] Registered component: ${name}`);
      }
    },
    
    create(element, name = null) {
      const componentName = name || element.dataset.cs;
      const ComponentClass = R.components.get(componentName);
      
      if (!ComponentClass) {
        console.warn(`[Rebel] Component not found: ${componentName}`);
        return null;
      }
      
      try {
        const instance = new ComponentClass(element);
        element._rebelInstance = instance;
        return instance;
      } catch (error) {
        console.error(`[Rebel] Failed to create ${componentName}:`, error);
        element.dataset.state = 'error';
        return null;
      }
    },
    
    destroy(element) {
      const instance = element._rebelInstance;
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
        delete element._rebelInstance;
      }
    },
    
    get(element) {
      return element._rebelInstance || null;
    }
  };
  
  // Module system for progressive enhancement
  const ModuleSystem = {
    define(name, factory) {
      R.modules.set(name, {
        factory,
        instance: null,
        loaded: false
      });
    },
    
    async load(names) {
      const moduleNames = Array.isArray(names) ? names : [names];
      const promises = moduleNames.map(name => this.loadSingle(name));
      return Promise.all(promises);
    },
    
    async loadSingle(name) {
      const module = R.modules.get(name);
      if (!module) {
        throw new Error(`Module not found: ${name}`);
      }
      
      if (module.loaded) {
        return module.instance;
      }
      
      try {
        module.instance = await module.factory();
        module.loaded = true;
        return module.instance;
      } catch (error) {
        console.error(`[Rebel] Failed to load module ${name}:`, error);
        throw error;
      }
    },
    
    get(name) {
      const module = R.modules.get(name);
      return module?.instance || null;
    }
  };
  
  // Event system for component communication
  const EventBus = {
    events: new Map(),
    
    on(event, handler) {
      if (!this.events.has(event)) {
        this.events.set(event, new Set());
      }
      this.events.get(event).add(handler);
      
      // Return unsubscribe function
      return () => this.off(event, handler);
    },
    
    off(event, handler) {
      const handlers = this.events.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.events.delete(event);
        }
      }
    },
    
    emit(event, data = {}) {
      const handlers = this.events.get(event);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`[Rebel] Event handler error for ${event}:`, error);
          }
        });
      }
    },
    
    once(event, handler) {
      const onceHandler = (data) => {
        handler(data);
        this.off(event, onceHandler);
      };
      return this.on(event, onceHandler);
    }
  };
  
  // Component base class
  class RebelComponent {
    constructor(element) {
      this.el = element;
      this.id = element.id || this.generateId();
      this.name = element.dataset.cs;
      this.destroyed = false;
      
      // Basic state management
      this.state = this.createState({
        isOpen: false,
        isLoading: false,
        isDisabled: false,
        error: null
      });
      
      // Configuration from data attributes
      this.config = this.parseConfig();
      
      // Initialize if not lazy
      if (this.config.init !== 'manual') {
        this.init();
      }
    }
    
    generateId() {
      return `rebel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    createState(initialState) {
      // Simple reactive state - can be enhanced with modules
      const state = { ...initialState };
      
      // If reactive module is available, use it
      if (R.get && R.get('reactive')) {
        return R.get('reactive').create(state);
      }
      
      return state;
    }
    
    parseConfig() {
      const config = {};
      const dataset = this.el.dataset;
      
      // Parse boolean attributes
      ['animation', 'persist', 'sync', 'debug'].forEach(key => {
        if (dataset[key] !== undefined) {
          config[key] = dataset[key] !== 'false';
        }
      });
      
      // Parse JSON config
      if (dataset.config) {
        try {
          Object.assign(config, JSON.parse(dataset.config));
        } catch (e) {
          console.warn(`[Rebel] Invalid config JSON for ${this.name}:`, e);
        }
      }
      
      return config;
    }
    
    init() {
      if (this.destroyed) return;
      
      try {
        // Mark as initializing
        this.el.dataset.state = 'initializing';
        
        // Cache elements
        this.cacheElements();
        
        // Bind events
        this.bindEvents();
        
        // Component-specific initialization
        if (typeof this.onInit === 'function') {
          this.onInit();
        }
        
        // Mark as ready
        this.el.dataset.state = 'ready';
        this.el.dataset.init = 'true';
        
        // Emit ready event
        this.emit('ready');
        
      } catch (error) {
        this.handleError(error);
      }
    }
    
    cacheElements() {
      // Override in subclasses
      this.elements = {};
    }
    
    bindEvents() {
      // Override in subclasses
    }
    
    onInit() {
      // Override in subclasses
    }
    
    emit(eventName, detail = {}) {
      // Component-specific event
      const event = new CustomEvent(`rebel:${this.name}:${eventName}`, {
        detail: { instance: this, ...detail },
        bubbles: true,
        cancelable: true
      });
      
      this.el.dispatchEvent(event);
      
      // Global event bus
      R.emit(`${this.name}:${eventName}`, { instance: this, ...detail });
      
      return event;
    }
    
    on(eventName, handler) {
      this.el.addEventListener(`rebel:${this.name}:${eventName}`, handler);
      return () => this.off(eventName, handler);
    }
    
    off(eventName, handler) {
      this.el.removeEventListener(`rebel:${this.name}:${eventName}`, handler);
    }
    
    setState(updates) {
      if (this.destroyed) return;
      
      Object.assign(this.state, updates);
      this.updateUI();
      this.emit('stateChange', { state: this.state });
    }
    
    updateUI() {
      // Update data attributes based on state
      Object.entries(this.state).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          this.el.dataset[key] = value.toString();
        } else if (value !== null && value !== undefined) {
          this.el.dataset[key] = value.toString();
        }
      });
    }
    
    handleError(error) {
      console.error(`[Rebel] ${this.name} error:`, error);
      this.setState({ error: error.message });
      this.el.dataset.state = 'error';
      this.emit('error', { error });
    }
    
    destroy() {
      if (this.destroyed) return;
      
      this.destroyed = true;
      
      // Component-specific cleanup
      if (typeof this.onDestroy === 'function') {
        this.onDestroy();
      }
      
      // Remove from registry
      delete this.el._rebelInstance;
      
      // Mark as destroyed
      this.el.dataset.state = 'destroyed';
      this.el.dataset.init = 'false';
      
      this.emit('destroyed');
    }
    
    onDestroy() {
      // Override in subclasses
    }
  }
  
  // Auto-initialization system
  const AutoInit = {
    selector: '[data-cs]:not([data-init=\"true\"]):not([data-init=\"false\"])',
    
    init() {
      const elements = document.querySelectorAll(this.selector);
      elements.forEach(element => this.initElement(element));
    },
    
    initElement(element) {
      const strategy = element.dataset.init || 'eager';
      
      switch (strategy) {
        case 'eager':
          ComponentRegistry.create(element);
          break;
          
        case 'idle':
          this.initWhenIdle(element);
          break;
          
        case 'visible':
          this.initWhenVisible(element);
          break;
          
        case 'interaction':
          this.initOnInteraction(element);
          break;
      }
    },
    
    initWhenIdle(element) {
      if (window.requestIdleCallback) {
        requestIdleCallback(() => ComponentRegistry.create(element));
      } else {
        setTimeout(() => ComponentRegistry.create(element), 1);
      }
    },
    
    initWhenVisible(element) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            ComponentRegistry.create(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '50px' });
      
      observer.observe(element);
    },
    
    initOnInteraction(element) {
      const events = ['mouseenter', 'focus', 'click'];
      const initOnce = () => {
        ComponentRegistry.create(element);
        events.forEach(event => {
          element.removeEventListener(event, initOnce);
        });
      };
      
      events.forEach(event => {
        element.addEventListener(event, initOnce, { once: true, passive: true });
      });
    }
  };
  
  // Mutation observer for dynamic content
  const DynamicObserver = {
    observer: null,
    
    start() {
      if (!window.MutationObserver || this.observer) return;
      
      this.observer = new MutationObserver((mutations) => {
        let hasNewComponents = false;
        
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && node.matches(AutoInit.selector)) {
                hasNewComponents = true;
              } else if (node.querySelector) {
                const children = node.querySelectorAll(AutoInit.selector);
                if (children.length > 0) {
                  hasNewComponents = true;
                }
              }
            }
          });
        });
        
        if (hasNewComponents) {
          // Debounce initialization
          clearTimeout(this.initTimeout);
          this.initTimeout = setTimeout(() => AutoInit.init(), 10);
        }
      });
      
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
    
    stop() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  };
  
  // Public API
  Object.assign(R, {
    // Component management
    register: ComponentRegistry.register.bind(ComponentRegistry),
    create: ComponentRegistry.create.bind(ComponentRegistry),
    destroy: ComponentRegistry.destroy.bind(ComponentRegistry),
    get: ComponentRegistry.get.bind(ComponentRegistry),
    
    // Module system
    define: ModuleSystem.define.bind(ModuleSystem),
    load: ModuleSystem.load.bind(ModuleSystem),
    module: ModuleSystem.get.bind(ModuleSystem),
    
    // Event system
    on: EventBus.on.bind(EventBus),
    off: EventBus.off.bind(EventBus),
    emit: EventBus.emit.bind(EventBus),
    once: EventBus.once.bind(EventBus),
    
    // Base class
    Component: RebelComponent,
    
    // Utilities
    init: AutoInit.init.bind(AutoInit),
    
    // Configuration
    configure(options) {
      Object.assign(this.config, options);
      
      if (options.debug !== undefined) {
        this.config.debug = options.debug;
      }
      
      if (options.observer === false) {
        DynamicObserver.stop();
      } else if (options.observer === true) {
        DynamicObserver.start();
      }
    }
  });
  
  // Initialize when DOM is ready
  function domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }
  
  // Bootstrap the system
  domReady(() => {
    if (R.config.autoInit) {
      AutoInit.init();
    }
    
    if (R.config.observer) {
      DynamicObserver.start();
    }
    
    // Webflow integration
    if (window.Webflow) {
      window.Webflow.push(() => AutoInit.init());
    }
    
    // Signal ready
    R.emit('ready');
    
    if (R.config.debug) {
      console.log('[Rebel] Core system initialized');
    }
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    DynamicObserver.stop();
    R.emit('cleanup');
  });
  
})(typeof window !== 'undefined' ? window : global);
