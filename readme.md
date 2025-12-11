# Tipnix Tooltip

**Tipnix Tooltip** is a lightweight, fast, and fully customizable tooltip library for React and Next.js applications. Add beautiful, interactive tooltips to your project with minimal setup and maximum flexibility.

🔗 **Documentation**: [Tipnix Documentation](https://tipnix-documentation.vercel.app/)  
🐙 **GitHub**: [Dimuthu-Pinsara/tipnix-tooltip-js](https://github.com/Dimuthu-Pinsara/tipnix-npm)

---

## ✨ Features

- 🎯 **Easy Integration** - Works seamlessly with React and Next.js
- 🎨 **Fully Customizable** - Control colors, fonts, sizes, animations, and more
- ⚡ **Lightweight** - No external dependencies, minimal bundle size
- 🏃 **Fast Performance** - Optimized for speed and responsiveness
- 🎞️ **Rich Animations** - Multiple animation styles (bounce, fade, slide, zoom, etc.)
- 📱 **Responsive** - Works perfectly on all screen sizes
- 🌍 **RTL Support** - Built-in support for right-to-left languages

---

## 📦 Installation

Install Tipnix Tooltip via npm:

```bash
npm install tipnix
```

Or with yarn:

```bash
yarn add tipnix
```

Or with pnpm:

```bash
pnpm add tipnix
```

---

## 🚀 Quick Start

### React

To use this package effectively, create your own tooltip component first :

```jsx
import React from "react";
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function Tooltip({ className='', ...props }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    initTipNixTooltip({
      backgroundColor: "#000000",
      textColor: "#ffffff",
      fontSize: "16px",
      animation: "wobble",
      width: "225px",
      padding: "10px",
    });
  }, []);
  return (
    <div className={`tipnix ${className}`} {...props}>
      {props.children}
    </div>
  );
}
```

## Import this component into your main layout

```js
import './App.css';
import Tooltip from './components/tooltip';

function App() {

  return (
    <>
      <div>
          <Tooltip
            key={index}
            tipnix-bg="#00aaff"
            tipnix-text-color="#ffffff"
            tipnix-font-size="12px"
            tipnix-text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem inventore sapiente necessitatibus voluptates cum totam nihil maiores est corrupti beatae nam animi cupiditate aperiam, reprehenderit aspernatur. Dicta velit illo est."
            tipnix-width="200px"
            tipnix-padding="16px"
            tipnix-animation="wobble"
          >
          <span style={{ cursor: "pointer" }}>Hover</span>
          </Tooltip>
      </div>
    </>
  );
}

export default App;
```

### Next.js

To use this package effectively, create your own tooltip component first :

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function Tooltip({ className='', ...props }) {
    const initializedRef = useRef(false);

    useEffect(() => {
      if (initializedRef.current) return;
      initializedRef.current = true;
  
      initTipNixTooltip({
        backgroundColor: "#000000",
        textColor: "#ffffff",
        fontSize: "16px",
        animation: "wobble",
        width: "225px",
        padding: "10px",
      });
    }, []);
    return (
      <div className={`tipnix ${className}`} {...props}>
        {props.children}
      </div>
    );
}
```

## Import this component into your main layout

```jsx
import Tooltip from "@/components/tooltip";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans py-8 test">
      <Tooltip
        tipnix-bg="#00aaff"
        tipnix-text-color="#ffffff"
        tipnix-font-size="12px"
        tipnix-text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum quos, quaerat quidem quam omnis nobis optio? Unde voluptas tempore ipsam iure iusto obcaecati officiis, aliquam eos sapiente dolorem similique dolore."
        tipnix-padding="16px"
        tipnix-animation="wobble"
      >
        <span style={{ cursor: "pointer" }}>Hover</span>
      </Tooltip>
    </div>
  );
}
```

---

## 🛠️ Configuration Options

Initialize Tipnix with these options:

```javascript
initTipNixTooltip({
  backgroundColor: '#000000',    // Tooltip background color (HEX/RGB)
  textColor: '#FFFFFF',          // Tooltip text color (HEX/RGB)
  fontSize: '14px',              // Font size (px, em, rem)
  width: '200px',                // Tooltip width
  padding: '10px',               // Inner padding
  animation: 'fade',             // Animation style
  parentWrapElement: '.parent',  // Parent element selector
});
```

---

## 📋 Available Attributes

Use these `tipnix-*` attributes on your HTML elements to customize individual tooltips:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `tipnix-text` | Tooltip content text | `tipnix-text="Help text"` |
| `tipnix-bg` | Background color | `tipnix-bg="#333333"` |
| `tipnix-text-color` | Text color | `tipnix-text-color="#FFFFFF"` |
| `tipnix-font-size` | Font size | `tipnix-font-size="14px"` |
| `tipnix-width` | Tooltip width | `tipnix-width="250px"` |
| `tipnix-padding` | Inner padding | `tipnix-padding="12px"` |
| `tipnix-animation` | Animation style | `tipnix-animation="bounce"` |
| `tipnix-parent` | Parent element selector | `tipnix-parent=".container"` |

---

## 🎞️ Available Animations

Tipnix supports multiple animation styles:

- `fade` - Smooth fade in/out
- `bounce` - Bouncy entrance
- `slide` - Slide animation
- `slideUp` - Slide up animation
- `slideInLeft` - Slide in from left
- `zoom` - Zoom in/out
- `pulse` - Pulsing effect
- `flipIn` - Flip entrance
- `swing` - Swinging motion
- `fadeInScale` - Fade with scale
- `tiltFadeIn` - Tilt and fade
- `shake` - Shaking effect

---

## 💡 Usage Examples

### Basic Tooltip

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function BasicTooltip() {
  initTipNixTooltip({
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  });

  return (
    <button className="tipnix" tipnix-text="Click me!">
      Hover for tooltip
    </button>
  );
}
```

### Custom Styled Tooltip

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function CustomTooltip() {
  initTipNixTooltip({
    backgroundColor: '#FF6B6B',
    textColor: '#FFFFFF',
    fontSize: '14px',
    padding: '12px',
    animation: 'bounce',
  });

  return (
    <div 
      className="tipnix" 
      tipnix-text="Custom styled tooltip"
      tipnix-animation="bounce"
    >
      Hover me
    </div>
  );
}
```

### Multiple Tooltips with Different Styles

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function MultipleTooltips() {
  initTipNixTooltip({
    backgroundColor: '#333333',
    textColor: '#FFFFFF',
  });

  return (
    <div>
      <button 
        className="tipnix" 
        tipnix-text="Save your work"
        tipnix-bg="#4CAF50"
      >
        Save
      </button>
      
      <button 
        className="tipnix" 
        tipnix-text="Delete this item"
        tipnix-bg="#F44336"
      >
        Delete
      </button>
      
      <button 
        className="tipnix" 
        tipnix-text="Edit settings"
        tipnix-bg="#2196F3"
      >
        Settings
      </button>
    </div>
  );
}
```

### With Tailwind CSS

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function TailwindTooltip() {
  initTipNixTooltip({
    backgroundColor: '#1F2937',
    textColor: '#F3F4F6',
    fontSize: '13px',
  });

  return (
    <div className="flex gap-4 p-4">
      <button 
        className="tipnix px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        tipnix-text="This is a helpful tooltip"
      >
        Hover me
      </button>
    </div>
  );
}
```

---

## 🔧 Advanced Usage

### Dynamic Tooltip Content

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";
import { useState } from 'react';

export default function DynamicTooltip() {
  const [tooltipText, setTooltipText] = useState('Initial text');

  initTipNixTooltip({
    backgroundColor: '#333333',
    textColor: '#FFFFFF',
  });

  return (
    <div>
      <button 
        className="tipnix" 
        tipnix-text={tooltipText}
        onClick={() => setTooltipText('Updated text!')}
      >
        Click to update tooltip
      </button>
    </div>
  );
}
```

### Conditional Tooltips

```jsx
'use client'

import React from 'react'
import { useEffect,useRef } from "react";
import { initTipNixTooltip } from "tipnix";
import "tipnix/tipnix.css";

export default function ConditionalTooltip({ isDisabled }) {
  initTipNixTooltip({
    backgroundColor: '#333333',
    textColor: '#FFFFFF',
  });

  return (
    <button 
      className="tipnix" 
      tipnix-text={isDisabled ? "This feature is disabled" : "Click to proceed"}
      disabled={isDisabled}
    >
      Action Button
    </button>
  );
}
```

---

## 📱 Browser Support

Tipnix Tooltip works on all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🐛 Troubleshooting

### Tooltip not appearing?

1. Ensure you've called `useTooltip()` in your component
2. Add the `tipnix` class to your element
3. Include the `tipnix-text` attribute with your tooltip content

### Styling not applying?

1. Check that your configuration options are valid CSS values
2. Verify that `tipnix-*` attributes are spelled correctly
3. Ensure the component is wrapped with `useTooltip()` initialization

### Performance issues?

1. Avoid creating too many tooltips on a single page
2. Use CSS classes for styling instead of inline styles when possible
3. Consider lazy-loading components with tooltips

---

## 📚 API Reference

### `useTooltip(options)`

Initializes Tipnix Tooltip with the provided configuration.

**Parameters:**
- `options` (Object) - Configuration object with the following properties:
  - `backgroundColor` (string) - HEX or RGB color code
  - `textColor` (string) - HEX or RGB color code
  - `fontSize` (string) - CSS font size value
  - `width` (string) - CSS width value
  - `padding` (string) - CSS padding value
  - `animation` (string) - Animation style name
  - `parentWrapElement` (string) - CSS selector for parent element

**Example:**
```javascript
initTipNixTooltip({
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  fontSize: '14px',
});
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests on [GitHub](https://github.com/Dimuthu-Pinsara/tipnix-tooltip-js).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created and maintained by **Dimuthu Pinsara**

- GitHub: [@Dimuthu-Pinsara](https://github.com/Dimuthu-Pinsara)
- Follow for updates and new releases!

---

## 🙏 Support

If you find Tipnix Tooltip helpful, please consider:

- ⭐ Starring the [GitHub repository](https://github.com/Dimuthu-Pinsara/tipnix-tooltip-js)
- 📢 Sharing it with your network
- 🐛 Reporting bugs and suggesting features
- 💬 Providing feedback and improvements

---

## 📝 Changelog

### v1.0.0 (Current)
- Initial npm release
- React and Next.js support
- Full customization options
- Multiple animation styles
- RTL language support

### Upcoming Features
- 🎞️ More animation options
- ⏳ Delay and timing controls
- 📍 Smart positioning algorithms
- 🎯 Keyboard accessibility improvements

---

## 📞 Support & Feedback

For issues, questions, or feature requests, please visit:
- [GitHub Issues](https://github.com/Dimuthu-Pinsara/tipnix-tooltip-js/issues)
- [Documentation](https://tipnix-documentation.vercel.app/)

Happy tooltipping! 🎉
