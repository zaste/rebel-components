// Terminal Hero Component Exports

// Export component HTML generator
export const getTerminalHeroHTML = (config = {}) => {
  const {
    phrases = ["READY"],
    speed = 50,
    cta = "START",
    useRealCoords = true,
    debugMode = false
  } = config;

  return `
    <div data-cs="terminal-hero" 
         data-phrases='${JSON.stringify(phrases)}'
         data-speed="${speed}"
         data-cta="${cta}"
         data-use-real-coords="${useRealCoords}"
         data-debug-mode="${debugMode}">
      <!-- Component will be auto-initialized -->
    </div>
  `;
};

// Export default config
export const defaultConfig = {
  phrases: ["REAL MISSION", "REAL STAKES", "REAL REWARDS"],
  speed: 50,
  cta: "RUN: REBEL",
  useRealCoords: true,
  debugMode: false
};

console.log('🎯 Terminal Hero component loaded');