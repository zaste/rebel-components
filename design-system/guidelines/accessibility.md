# 🌟 Rebel Components - Accessibility Guidelines

Complete accessibility standards and implementation guide for WCAG AA compliance and inclusive design.

## 📋 Overview

All Rebel components are designed to meet or exceed **WCAG 2.1 AA standards** and provide inclusive experiences for users with disabilities. This document outlines our accessibility principles, requirements, and implementation guidelines.

## 🎯 Accessibility Principles

### 1. **Perceivable**
Information and UI components must be presentable to users in ways they can perceive.

### 2. **Operable** 
UI components and navigation must be operable by all users.

### 3. **Understandable**
Information and the operation of the UI must be understandable.

### 4. **Robust**
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

---

## 🎨 Visual Design Requirements

### Color and Contrast

#### **Contrast Ratios (WCAG AA)**
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio for borders and interactive elements
- **Graphics**: Minimum 3:1 contrast ratio for meaningful graphics

```css
/* Use design tokens for guaranteed contrast */
.rebel-text-primary { 
  color: var(--rebel-text); /* 4.5:1+ contrast on surface */
}

.rebel-button-primary {
  background: var(--rebel-primary); /* 3:1+ contrast */
  color: var(--rebel-text-on-primary); /* 4.5:1+ contrast */
}
```

#### **Color Independence**
- Never convey information through color alone
- Always provide additional visual cues (icons, text, patterns)
- Use semantic colors with clear labeling

```html
<!-- ✅ Good: Multiple indicators -->
<div class="rebel-alert-error">
  <svg class="error-icon" aria-hidden="true">...</svg>
  <span class="sr-only">Error:</span>
  Your form submission failed. Please check the highlighted fields.
</div>

<!-- ❌ Bad: Color only -->
<div style="color: red;">
  Your form submission failed.
</div>
```

### Typography

#### **Font Size and Readability**
- Minimum font size: 16px (1rem) for body text
- Line height: 1.5 minimum for body text
- Adequate letter spacing for improved readability
- Support for user zoom up to 200% without horizontal scrolling

```css
.rebel-body {
  font-size: var(--rebel-text-base); /* 16px minimum */
  line-height: var(--rebel-leading-normal); /* 1.5 */
  letter-spacing: var(--rebel-tracking-normal);
}
```

#### **Typography Hierarchy**
- Clear heading structure (h1-h6)
- Logical content flow
- Adequate spacing between elements

---

## ⌨️ Keyboard Navigation

### **Focus Management**

#### **Visible Focus Indicators**
All interactive elements must have clear, visible focus indicators.

```css
*:focus-visible {
  outline: var(--rebel-focus-outline); /* 2px solid */
  outline-offset: var(--rebel-focus-offset); /* 2px */
  border-radius: var(--rebel-radius-sm);
}

/* Enhanced focus for high contrast */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 3px;
    outline-offset: 3px;
  }
}
```

#### **Focus Order**
- Logical tab order following visual layout
- Skip links for main content navigation
- Focus trapping in modals and overlays

```html
<!-- Skip link example -->
<a href="#main-content" class="rebel-skip-link">
  Skip to main content
</a>

<!-- Focus trap in modal -->
<div role="dialog" aria-labelledby="modal-title" data-focus-trap="true">
  <h2 id="modal-title">Modal Title</h2>
  <!-- Modal content -->
  <button data-close-modal>Close</button>
</div>
```

### **Keyboard Interaction Patterns**

#### **Standard Key Bindings**
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals, dropdowns, and overlays
- **Tab/Shift+Tab**: Navigate between focusable elements
- **Arrow keys**: Navigate within components (tabs, menus, etc.)
- **Home/End**: Jump to first/last item in lists
- **Page Up/Page Down**: Scroll in large content areas

#### **Component-Specific Patterns**

**Tabs Navigation:**
```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">
    Account
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2">
    Security
  </button>
</div>
```

**Menu Navigation:**
```html
<nav role="navigation" aria-label="Main menu">
  <ul role="menubar">
    <li role="none">
      <button role="menuitem" aria-expanded="false" aria-haspopup="menu">
        Products
      </button>
    </li>
  </ul>
</nav>
```

---

## 🗣️ Screen Reader Support

### **Semantic HTML**

#### **Use Proper HTML Elements**
Always use semantic HTML elements for their intended purpose.

```html
<!-- ✅ Good: Semantic structure -->
<article>
  <header>
    <h1>Article Title</h1>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  <main>
    <p>Article content...</p>
  </main>
  <footer>
    <p>Author: John Doe</p>
  </footer>
</article>

<!-- ❌ Bad: Generic elements -->
<div class="article">
  <div class="title">Article Title</div>
  <div class="date">January 15, 2024</div>
  <div class="content">Article content...</div>
</div>
```

### **ARIA Labels and Descriptions**

#### **Required ARIA Attributes**

**Buttons and Links:**
```html
<!-- Descriptive button -->
<button aria-label="Delete item 'Project Alpha'">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Link with context -->
<a href="/article/123" aria-describedby="article-preview">
  Read more
</a>
<div id="article-preview" class="sr-only">
  About the future of web development and accessibility best practices.
</div>
```

**Form Controls:**
```html
<!-- Proper labeling -->
<label for="email">Email Address</label>
<input 
  type="email" 
  id="email" 
  aria-describedby="email-help email-error"
  aria-invalid="false"
  required
>
<div id="email-help">We'll never share your email.</div>
<div id="email-error" aria-live="polite"></div>
```

**Dynamic Content:**
```html
<!-- Live regions for updates -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status">
  <!-- Status updates announced to screen readers -->
</div>

<!-- Loading states -->
<button aria-busy="true" aria-describedby="loading-text">
  Submit
</button>
<span id="loading-text" class="sr-only">Submitting form, please wait...</span>
```

### **Screen Reader Only Content**

```css
/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 📱 Touch and Mobile Accessibility

### **Touch Target Requirements**

#### **Minimum Touch Target Size**
- **Minimum**: 44px × 44px (iOS HIG)
- **Recommended**: 48px × 48px (Material Design)
- **Spacing**: 8px minimum between touch targets

```css
.rebel-touch-target {
  min-height: var(--rebel-touch-target-recommended); /* 48px */
  min-width: var(--rebel-touch-target-recommended);
  padding: var(--rebel-spacing-2) var(--rebel-spacing-3);
}

/* Ensure spacing between targets */
.rebel-touch-group > * + * {
  margin-inline-start: var(--rebel-spacing-2); /* 8px */
}
```

### **Mobile-Specific Considerations**

#### **Orientation Support**
- Support both portrait and landscape orientations
- Maintain functionality across orientation changes
- Preserve scroll position during rotation

#### **Zoom and Scaling**
- Support pinch-to-zoom (don't disable user-scalable)
- Ensure content remains accessible at 200% zoom
- Prevent horizontal scrolling at standard zoom levels

```html
<!-- ✅ Good: Allows user zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- ❌ Bad: Prevents zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

---

## 🔧 Implementation Guidelines

### **Component Development Checklist**

#### **HTML Structure**
- [ ] Use semantic HTML elements
- [ ] Provide meaningful heading structure
- [ ] Include skip links for navigation
- [ ] Use lists for grouped items
- [ ] Implement proper form labeling

#### **ARIA Implementation**
- [ ] Add appropriate ARIA roles
- [ ] Provide ARIA labels for non-semantic elements
- [ ] Use ARIA states (expanded, selected, etc.)
- [ ] Implement live regions for dynamic content
- [ ] Hide decorative elements with aria-hidden

#### **Keyboard Support**
- [ ] All interactive elements are keyboard accessible
- [ ] Logical tab order is maintained
- [ ] Focus indicators are visible and clear
- [ ] Keyboard shortcuts follow conventions
- [ ] Focus trapping works in modals

#### **Visual Design**
- [ ] Color contrast meets WCAG AA standards
- [ ] Information isn't conveyed by color alone
- [ ] Text is readable at 200% zoom
- [ ] Touch targets meet minimum size requirements

### **Testing Requirements**

#### **Automated Testing**
```javascript
// Example: Axe-core integration
import { axe } from 'jest-axe';

test('component should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### **Manual Testing Checklist**
- [ ] **Keyboard only navigation**: Navigate entire component using only keyboard
- [ ] **Screen reader testing**: Test with NVDA, JAWS, or VoiceOver
- [ ] **High contrast mode**: Verify visibility in Windows High Contrast
- [ ] **Zoom testing**: Test at 200% zoom level
- [ ] **Mobile testing**: Verify touch accessibility on actual devices

#### **Screen Reader Testing Commands**

**NVDA (Windows):**
- `Ctrl + Alt + N`: Start NVDA
- `Insert + Space`: Toggle browse/focus mode
- `H`: Navigate by headings
- `B`: Navigate by buttons
- `F`: Navigate by form fields

**VoiceOver (macOS):**
- `Cmd + F5`: Toggle VoiceOver
- `Ctrl + Option + →`: Navigate next
- `Ctrl + Option + Shift + ↓`: Enter group
- `Ctrl + Option + U`: Open rotor

**JAWS (Windows):**
- `Ctrl + Alt + J`: Start JAWS
- `H`: Navigate by headings
- `T`: Navigate by tables
- `Insert + F7`: List all links

---

## 📊 Design Token Accessibility

### **Color System Compliance**

All color tokens in the Rebel design system meet WCAG AA requirements:

```css
/* Text on surface backgrounds */
--rebel-text: #212529;           /* 16.18:1 on white */
--rebel-text-secondary: #6c757d; /* 4.52:1 on white */

/* Interactive elements */
--rebel-primary: #007bff;         /* 4.51:1 on white */
--rebel-focus: #0066cc;          /* 5.89:1 on white */

/* Status colors */
--rebel-success: #28a745;        /* 3.84:1 on white */
--rebel-error: #dc3545;          /* 5.94:1 on white */
--rebel-warning: #ffc107;        /* 1.76:1 - requires dark text */
```

### **Typography Scale Accessibility**

```css
/* Fluid typography with accessibility constraints */
.rebel-text-base {
  font-size: clamp(1rem, 2.5vw, 1.125rem); /* Never below 16px */
  line-height: var(--rebel-leading-normal); /* 1.5 minimum */
}

.rebel-text-sm {
  font-size: clamp(0.875rem, 2vw, 1rem); /* Never below 14px */
  line-height: var(--rebel-leading-normal);
}
```

---

## 🚨 Common Accessibility Issues to Avoid

### **HTML and Structure Issues**
1. **Missing alt text** on informative images
2. **Incorrect heading hierarchy** (jumping from h1 to h3)
3. **Generic link text** ("click here", "read more")
4. **Missing form labels** or incorrect associations
5. **Empty buttons or links** without accessible names

### **ARIA Issues**
1. **Overusing ARIA** when semantic HTML would suffice
2. **Incorrect ARIA roles** that conflict with element semantics
3. **Missing required ARIA properties** (aria-expanded, aria-controls)
4. **Inaccessible custom components** without proper roles
5. **Redundant ARIA labels** that repeat visible text

### **Keyboard Issues**
1. **Focus trap failures** in modals and overlays
2. **Invisible focus indicators** or poor contrast
3. **Illogical tab order** that doesn't follow visual flow
4. **Missing keyboard alternatives** for mouse-only interactions
5. **Focus management** not updated when content changes

### **Visual Issues**
1. **Insufficient color contrast** for text and backgrounds
2. **Color-only communication** without text or icons
3. **Small touch targets** below 44px minimum
4. **Text that doesn't reflow** at 200% zoom
5. **Poor responsive design** that breaks accessibility

---

## 📚 Resources and Tools

### **Testing Tools**
- **[axe DevTools](https://www.deque.com/axe/devtools/)**: Browser extension for automated testing
- **[WAVE](https://wave.webaim.org/)**: Web accessibility evaluation tool
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)**: Built-in Chrome accessibility auditing
- **[Color Oracle](https://colororacle.org/)**: Color blindness simulator
- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)**: Color contrast validation

### **Screen Readers**
- **[NVDA](https://www.nvaccess.org/)**: Free Windows screen reader
- **[VoiceOver](https://www.apple.com/accessibility/mac/vision/)**: Built-in macOS/iOS screen reader
- **[JAWS](https://www.freedomscientific.com/products/software/jaws/)**: Popular Windows screen reader
- **[Orca](https://help.gnome.org/users/orca/stable/)**: Linux screen reader

### **Guidelines and Standards**
- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**: Web Content Accessibility Guidelines
- **[ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)**: Implementation patterns for ARIA
- **[Section 508](https://www.section508.gov/)**: US federal accessibility requirements
- **[EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)**: European accessibility standard

### **Design Resources**
- **[Inclusive Design Toolkit](https://www.microsoft.com/design/inclusive/)**: Microsoft's inclusive design guide
- **[Material Design Accessibility](https://material.io/design/usability/accessibility.html)**: Google's accessibility guidelines
- **[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility/overview/introduction/)**: iOS/macOS accessibility

---

## 🎯 Implementation Examples

### **Complete Accessible Modal**

```html
<div class="rebel-modal-overlay" 
     data-cs="disclosure-modal" 
     data-focus-trap="true"
     aria-hidden="true">
  
  <div class="rebel-modal" 
       role="dialog" 
       aria-labelledby="modal-title"
       aria-describedby="modal-desc">
    
    <!-- Close button -->
    <button class="rebel-modal-close" 
            aria-label="Close dialog"
            data-close-modal>
      <svg aria-hidden="true">...</svg>
    </button>
    
    <!-- Modal content -->
    <header class="rebel-modal-header">
      <h2 id="modal-title" class="rebel-heading-2">
        Confirm Delete
      </h2>
    </header>
    
    <main class="rebel-modal-content">
      <p id="modal-desc">
        Are you sure you want to delete "Project Alpha"? 
        This action cannot be undone.
      </p>
    </main>
    
    <footer class="rebel-modal-footer">
      <button class="rebel-btn-secondary" data-close-modal>
        Cancel
      </button>
      <button class="rebel-btn-error" data-confirm-delete>
        Delete Project
      </button>
    </footer>
  </div>
</div>
```

### **Complete Accessible Form**

```html
<form class="rebel-form" novalidate>
  <fieldset>
    <legend class="rebel-heading-3">Personal Information</legend>
    
    <!-- Email field -->
    <div class="rebel-field-group">
      <label for="email" class="rebel-label">
        Email Address
        <span class="rebel-required" aria-label="required">*</span>
      </label>
      <input type="email" 
             id="email" 
             class="rebel-input"
             aria-describedby="email-help email-error"
             aria-invalid="false"
             required>
      <div id="email-help" class="rebel-help-text">
        We'll use this to send you updates.
      </div>
      <div id="email-error" 
           class="rebel-error-text" 
           aria-live="polite"
           aria-atomic="true"></div>
    </div>
    
    <!-- Password field -->
    <div class="rebel-field-group">
      <label for="password" class="rebel-label">
        Password
        <span class="rebel-required" aria-label="required">*</span>
      </label>
      <div class="rebel-input-group">
        <input type="password" 
               id="password" 
               class="rebel-input"
               aria-describedby="password-help"
               minlength="8"
               required>
        <button type="button" 
                class="rebel-input-addon"
                aria-label="Toggle password visibility"
                data-toggle-password>
          <svg aria-hidden="true">...</svg>
        </button>
      </div>
      <div id="password-help" class="rebel-help-text">
        Must be at least 8 characters long.
      </div>
    </div>
  </fieldset>
  
  <!-- Submit button with loading state -->
  <button type="submit" 
          class="rebel-btn-primary"
          aria-describedby="submit-status">
    <span data-default-text>Create Account</span>
    <span data-loading-text class="sr-only">Creating account, please wait...</span>
  </button>
  
  <div id="submit-status" 
       aria-live="polite" 
       aria-atomic="true" 
       class="sr-only"></div>
</form>
```

---

## ✅ Accessibility Validation

All Rebel components undergo comprehensive accessibility testing:

1. **Automated Testing**: axe-core integration catches 40-80% of issues
2. **Manual Testing**: Keyboard navigation and screen reader testing
3. **User Testing**: Testing with actual users who rely on assistive technology
4. **Continuous Monitoring**: Regular audits and updates for emerging standards

**Remember**: Accessibility is not a checklist—it's an ongoing commitment to inclusive design that benefits all users.

---

*For questions about accessibility implementation or to report accessibility issues, please open an issue in the rebel-components repository with the "accessibility" label.*