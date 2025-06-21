# Terminal Hero Component

Advanced typing animation component with GTM integration for RUN:REBEL.

## Features

- ⌨️ **Realistic typing animation** with configurable speed
- 📊 **GTM event tracking** for detailed analytics
- 🌍 **Real-time geolocation** with IP-based coordinates
- 📱 **Fully responsive** design with mobile optimization
- 🎮 **Interactive controls** (click to restart, ESC to skip)
- 🧪 **Debug mode** for development

## Usage

### Basic HTML

```html
<div data-cs="terminal-hero" 
     data-phrases='["REAL MISSION", "REAL STAKES", "REAL REWARDS"]'
     data-speed="50"
     data-cta="RUN: REBEL"
     data-use-real-coords="true"
     data-debug-mode="true">
</div>
```

### JavaScript Integration

```javascript
import { TerminalHero, getTerminalHeroHTML } from '@run-rebel/components';

// Generate HTML
const html = getTerminalHeroHTML({
  phrases: ['CUSTOM', 'PHRASES'],
  speed: 30,
  cta: 'CUSTOM CTA'
});

// Manual initialization
const element = document.querySelector('[data-cs="terminal-hero"]');
const instance = new TerminalHero(element);
```

## Configuration

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-phrases` | JSON Array | `["READY"]` | Text phrases to type |
| `data-speed` | Number | `50` | Typing speed in milliseconds |
| `data-cta` | String | `"START"` | Call-to-action button text |
| `data-use-real-coords` | Boolean | `false` | Use real geolocation |
| `data-debug-mode` | Boolean | `false` | Enable debug logging |
| `data-pause-on-dot` | Number | `400` | Pause duration on periods |

## GTM Events

The component automatically sends these events to `dataLayer`:

### `terminal_load`
Fired when component initializes.

### `terminal_typing_start`
Fired when typing animation begins.

### `terminal_typing_complete`
Fired when typing animation finishes.

### `terminal_cta_click` ⭐ **Main Conversion Event**
Fired when user clicks the CTA button.

```javascript
{
  event: 'terminal_cta_click',
  interaction_id: 'uuid_uuid_timestamp',
  anonymous_id: 'user_uuid',
  session_id: 'session_uuid',
  device_type: 'desktop|tablet|mobile',
  coordinates: { latitude: 40.7128, longitude: -74.0060 },
  engagement_score: 8,
  time_to_click: 15420,
  // ... additional properties
}
```

### `coordinates_located`
Fired when geolocation is successful.

### `coordinates_failed`
Fired when geolocation fails.

## Styling

The component uses CSS custom properties for theming:

```css
:root {
  --primary: #FF3131;      /* Brand color */
  --white: #FFF;           /* Text color */
  --black: #000;           /* Background */
  --transition: all 0.3s ease;
}
```

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Debug Mode

Enable debug mode to see events in console:

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