// 🚀 RUN:REBEL Components Library
// Main entry point for component exports

// Terminal Hero Component
export { default as TerminalHero } from './components/terminal-hero/terminal-hero.js'

// Export component HTML generators
export { getTerminalHeroHTML } from './components/terminal-hero/index.js'

// Export shared utilities
export * from './shared/utils/index.js'

// Auto-initialize components when imported
if (typeof window !== 'undefined') {
  // Initialize all components on page load
  const initComponents = () => {
    // Auto-detect and initialize terminal hero components
    document.querySelectorAll('[data-cs="terminal-hero"]:not([data-init])').forEach(el => {
      import('./components/terminal-hero/terminal-hero.js').then(module => {
        new module.default(el)
        el.dataset.init = 'true'
      })
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents)
  } else {
    initComponents()
  }
}

console.log('🚀 RUN:REBEL Components loaded')
