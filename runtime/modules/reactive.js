/*!
 * Rebel Reactive Module v10.2 - Advanced state management
 * Size: ~3kb gzipped | Requires: rebel-core.js
 * Reactive state, computed properties, and watchers
 */

(function(global) {
  'use strict';
  
  // Reactive state management system
  const ReactiveSystem = {
    // Active effect tracking
    activeEffect: null,
    effectStack: [],
    
    // Create reactive proxy for an object
    reactive(target) {
      if (typeof target !== 'object' || target === null) {
        return target;
      }
      
      // Already reactive
      if (target.__isReactive) {
        return target;
      }
      
      const deps = new Map(); // Property -> Set of effects
      
      const proxy = new Proxy(target, {
        get(obj, key) {
          // Mark as reactive
          if (key === '__isReactive') return true;
          
          // Track dependency
          this.track(deps, key);
          
          const value = obj[key];
          
          // Deep reactivity for objects
          if (typeof value === 'object' && value !== null) {
            return ReactiveSystem.reactive(value);
          }
          
          return value;
        },
        
        set(obj, key, value) {
          const oldValue = obj[key];
          
          // Only trigger if value actually changed
          if (oldValue !== value) {
            obj[key] = value;
            
            // Trigger effects
            this.trigger(deps, key);
          }
          
          return true;
        },
        
        track(deps, key) {
          if (ReactiveSystem.activeEffect) {
            if (!deps.has(key)) {
              deps.set(key, new Set());
            }
            deps.get(key).add(ReactiveSystem.activeEffect);
          }
        },
        
        trigger(deps, key) {
          const effects = deps.get(key);
          if (effects) {
            effects.forEach(effect => {
              if (effect !== ReactiveSystem.activeEffect) {
                effect();
              }
            });
          }
        }
      });
      
      return proxy;
    },
    
    // Create computed property
    computed(getter) {
      let value;
      let dirty = true;
      
      const effect = () => {
        if (dirty) {
          const prevEffect = this.activeEffect;
          this.activeEffect = effect;
          try {
            value = getter();
          } finally {
            this.activeEffect = prevEffect;
          }
          dirty = false;
        }
        return value;
      };
      
      // Mark effect as needing recomputation when dependencies change
      const originalEffect = effect;
      effect.computed = true;
      effect.invalidate = () => { dirty = true; };
      
      return {
        get value() {
          return effect();
        }
      };
    },
    
    // Watch for changes
    watch(source, callback, options = {}) {
      let getter;
      
      if (typeof source === 'function') {
        getter = source;
      } else if (typeof source === 'object' && source.__isReactive) {
        getter = () => source;
      } else {
        console.warn('[Rebel Reactive] Invalid watch source');
        return;
      }
      
      let oldValue;
      let initialized = false;
      
      const effect = () => {
        const newValue = getter();
        
        if (initialized || !options.immediate) {
          if (newValue !== oldValue) {
            callback(newValue, oldValue);
          }
        }
        
        oldValue = newValue;
        initialized = true;
      };
      
      // Run immediately if requested
      if (options.immediate) {
        effect();
      } else {
        // Just get initial value
        const prevEffect = this.activeEffect;
        this.activeEffect = effect;
        try {
          oldValue = getter();
        } finally {
          this.activeEffect = prevEffect;
        }
        initialized = true;
      }
      
      // Return unwatch function
      return () => {
        // Remove effect from all dependencies
        // This would require more complex dependency tracking
        // For now, effects will be garbage collected
      };
    },
    
    // Create reactive reference for primitives
    ref(value) {
      const r = {
        __isRef: true,
        _value: value,
        
        get value() {
          ReactiveSystem.track(r._deps, 'value');
          return r._value;
        },
        
        set value(newValue) {
          if (newValue !== r._value) {
            r._value = newValue;
            ReactiveSystem.trigger(r._deps, 'value');
          }
        }
      };
      
      r._deps = new Map();
      return r;
    },
    
    // Helper to track dependencies
    track(deps, key) {
      if (this.activeEffect) {
        if (!deps.has(key)) {
          deps.set(key, new Set());
        }
        deps.get(key).add(this.activeEffect);
      }
    },
    
    // Helper to trigger effects
    trigger(deps, key) {
      const effects = deps.get(key);
      if (effects) {
        effects.forEach(effect => {
          if (effect !== this.activeEffect) {
            // Schedule effect to run
            if (effect.scheduler) {
              effect.scheduler();
            } else {
              effect();
            }
          }
        });
      }
    }
  };
  
  // Reactive store for global state
  const ReactiveStore = {
    state: ReactiveSystem.reactive({}),
    
    set(key, value) {
      this.state[key] = value;
    },
    
    get(key) {
      return this.state[key];
    },
    
    has(key) {
      return key in this.state;
    },
    
    delete(key) {
      delete this.state[key];
    },
    
    watch(key, callback) {
      return ReactiveSystem.watch(
        () => this.state[key],
        callback
      );
    },
    
    computed(key, getter) {
      const comp = ReactiveSystem.computed(getter);
      
      // Create getter on state
      Object.defineProperty(this.state, key, {
        get() {
          return comp.value;
        },
        enumerable: true,
        configurable: true
      });
      
      return comp;
    }
  };
  
  // Enhanced component mixin for reactive features
  const ReactiveComponent = {
    // Mixin methods for existing components
    mixins: {
      reactive(data = {}) {
        // Make component data reactive
        this.reactive_data = ReactiveSystem.reactive(data);
        
        // Auto-update UI when reactive data changes
        ReactiveSystem.watch(
          () => this.reactive_data,
          () => {
            if (typeof this.updateUI === 'function') {
              this.updateUI();
            }
          },
          { deep: true }
        );
        
        return this.reactive_data;
      },
      
      computed(key, getter) {
        if (!this.computed_values) {
          this.computed_values = {};
        }
        
        const comp = ReactiveSystem.computed(getter);
        this.computed_values[key] = comp;
        
        // Create getter on component
        Object.defineProperty(this, key, {
          get() {
            return comp.value;
          },
          enumerable: true,
          configurable: true
        });
        
        return comp;
      },
      
      watch(source, callback, options) {
        if (!this.watchers) {
          this.watchers = [];
        }
        
        const unwatch = ReactiveSystem.watch(source, callback, options);
        this.watchers.push(unwatch);
        
        return unwatch;
      },
      
      // Cleanup watchers on destroy
      destroy() {
        if (this.watchers) {
          this.watchers.forEach(unwatch => unwatch());
          this.watchers = [];
        }
        
        // Call original destroy if it exists
        if (this.originalDestroy) {
          this.originalDestroy();
        }
      }
    },
    
    // Enhance existing component class
    enhance(ComponentClass) {
      const proto = ComponentClass.prototype;
      
      // Add reactive methods
      Object.assign(proto, this.mixins);
      
      // Wrap destroy method
      if (proto.destroy) {
        proto.originalDestroy = proto.destroy;
      }
      proto.destroy = this.mixins.destroy;
      
      return ComponentClass;
    }
  };
  
  // Utility functions
  const Utils = {
    // Check if value is reactive
    isReactive(value) {
      return value && value.__isReactive === true;
    },
    
    // Check if value is ref
    isRef(value) {
      return value && value.__isRef === true;
    },
    
    // Get raw value (unwrap reactive/ref)
    toRaw(value) {
      if (this.isRef(value)) {
        return value.value;
      }
      if (this.isReactive(value)) {
        // Return the original object
        return value.__raw || value;
      }
      return value;
    },
    
    // Convert value to reactive if not already
    ensureReactive(value) {
      if (this.isReactive(value)) {
        return value;
      }
      return ReactiveSystem.reactive(value);
    },
    
    // Batch multiple updates
    batch(fn) {
      const prevEffect = ReactiveSystem.activeEffect;
      ReactiveSystem.activeEffect = null;
      
      try {
        fn();
      } finally {
        ReactiveSystem.activeEffect = prevEffect;
      }
    }
  };
  
  // Define the module
  if (global.R && global.R.define) {
    global.R.define('reactive', () => ({
      // Core reactive system
      reactive: ReactiveSystem.reactive.bind(ReactiveSystem),
      computed: ReactiveSystem.computed.bind(ReactiveSystem),
      watch: ReactiveSystem.watch.bind(ReactiveSystem),
      ref: ReactiveSystem.ref.bind(ReactiveSystem),
      
      // Global store
      store: ReactiveStore,
      
      // Component enhancement
      enhance: ReactiveComponent.enhance.bind(ReactiveComponent),
      mixins: ReactiveComponent.mixins,
      
      // Utilities
      isReactive: Utils.isReactive.bind(Utils),
      isRef: Utils.isRef.bind(Utils),
      toRaw: Utils.toRaw.bind(Utils),
      ensureReactive: Utils.ensureReactive.bind(Utils),
      batch: Utils.batch.bind(Utils),
      
      // Factory methods
      create: ReactiveSystem.reactive.bind(ReactiveSystem),
      state: (initial = {}) => ReactiveSystem.reactive(initial)
    }));
  } else {
    console.warn('[Rebel Reactive] Core system not found');
  }
  
})(typeof window !== 'undefined' ? window : global);
