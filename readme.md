# Tipnix - Advanced Tooltip Library for React & Next.js

A lightweight, customizable tooltip library for React and Next.js applications. Tipnix provides smooth animations, intelligent positioning, RTL support, and extensive customization options with minimal setup.

## Features

- **Easy Integration** - Simple hook-based API for React and Next.js
- **Highly Customizable** - Control colors, fonts, sizes, padding, and animations
- **Smart Positioning** - Automatically adjusts tooltip position based on viewport
- **RTL Support** - Full support for right-to-left languages
- **Multiple Animations** - 10+ built-in animations (shake, bounce, zoom, pulse, and more)
- **Dynamic Elements** - Automatically detects and initializes tooltips added to the DOM
- **Lightweight** - Minimal bundle size with no external dependencies
- **Per-Tooltip Customization** - Override global settings on individual tooltips
- **Responsive** - Adapts to different screen sizes automatically

## Installation

Install Tipnix via npm:

\`\`\`bash
npm install tipnix
\`\`\`

Or with yarn:

\`\`\`bash
yarn add tipnix
\`\`\`

Or with pnpm:

\`\`\`bash
pnpm add tipnix
\`\`\`

## Quick Start

### React

\`\`\`jsx
import { useTooltip } from "tipnix";

export default function App() {
  useTooltip({
    textColor: "#ffffff",
    backgroundColor: "#333333",
    fontSize: "16px",
  });

  return (
    <div className="tipnix" tipnix-text="This is a tooltip example">
      Hover over me
    </div>
  );
}
\`\`\`

### Next.js (App Router)

\`\`\`jsx
"use client";

import { useTooltip } from "tipnix";

export default function Page() {
  useTooltip({
    textColor: "#ffffff",
    backgroundColor: "#333333",
    fontSize: "16px",
  });

  return (
    <div className="tipnix" tipnix-text="This is a tooltip example">
      Hover over me
    </div>
  );
}
\`\`\`

### Using TooltipProvider

For a cleaner approach, use the `TooltipProvider` component:

\`\`\`jsx
"use client";

import { TooltipProvider } from "tipnix";

export default function Layout({ children }) {
  return (
    <>
      <TooltipProvider
        options={{
          textColor: "#ffffff",
          backgroundColor: "#333333",
          fontSize: "16px",
        }}
      />
      {children}
    </>
  );
}
\`\`\`

## Usage

### Basic Tooltip

Add the `tipnix` class to any element and set the `tipnix-text` attribute:

\`\`\`jsx
<div className="tipnix" tipnix-text="Tooltip text here">
  Hover me
</div>
\`\`\`

### With Custom Styling

\`\`\`jsx
<div
  className="tipnix"
  tipnix-text="Custom styled tooltip"
  tipnix-bg="#FF6B6B"
  tipnix-text-color="#FFFFFF"
  tipnix-font-size="14px"
  tipnix-padding="12px"
  tipnix-width="200px"
>
  Styled Tooltip
</div>
\`\`\`

### With Animation

\`\`\`jsx
<div
  className="tipnix"
  tipnix-text="Animated tooltip"
  tipnix-animation="bounce"
>
  Animated Tooltip
</div>
\`\`\`

## API Reference

### useTooltip Hook

Initialize tooltips with global configuration:

\`\`\`jsx
useTooltip(options);
\`\`\`

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `textColor` | string | `"#ffffff"` | Tooltip text color |
| `backgroundColor` | string | `"#333333"` | Tooltip background color |
| `fontSize` | string | `"16px"` | Tooltip font size |
| `animation` | string | `"shake"` | Default animation name |
| `width` | string | `"225px"` | Tooltip width |
| `padding` | string | `"16px"` | Tooltip padding |
| `parentWrapElement` | string | - | CSS selector for parent element |

**Returns:**

\`\`\`jsx
{
  reinitialize: () => void,  // Manually reinitialize tooltips
  isInitialized: boolean     // Check if tooltips are initialized
}
\`\`\`

### TooltipProvider Component

Wrap your app with the provider for automatic initialization:

\`\`\`jsx
<TooltipProvider options={TooltipOptions} />
\`\`\`

### HTML Attributes

Customize individual tooltips using data attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| `tipnix-text` | string | Tooltip content text |
| `tipnix-bg` | string | Background color override |
| `tipnix-text-color` | string | Text color override |
| `tipnix-font-size` | string | Font size override |
| `tipnix-width` | string | Width override |
| `tipnix-padding` | string | Padding override |
| `tipnix-animation` | string | Animation override |
| `tipnix-parent` | string | Parent element selector |

## Animations

Tipnix includes 10 built-in animations. Use any of these with the `tipnix-animation` attribute or `animation` option:

- **shake** - Shakes side to side (default)
- **bounce** - Bounces up and down
- **fadeSlideUp** - Fades in while sliding up
- **zoom** - Zooms in and out
- **pulse** - Pulses with scale effect
- **flipIn** - Flips in on X axis
- **slideInLeft** - Slides in from the left
- **swing** - Swings back and forth
- **fadeInScale** - Fades in with scale
- **tiltFadeIn** - Tilts and fades in

### Custom Animation

Define your own animation in CSS and pass the animation name:

\`\`\`jsx
<style>
  @keyframes myCustomAnimation {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
</style>

<div
  className="tipnix"
  tipnix-text="Custom animation"
  tipnix-animation="myCustomAnimation"
>
  Custom Animation
</div>
\`\`\`

## Examples

### Complete React Example

\`\`\`jsx
"use client";

import { useTooltip } from "tipnix";

export default function Dashboard() {
  useTooltip({
    textColor: "#ffffff",
    backgroundColor: "#1f2937",
    fontSize: "14px",
    animation: "fadeSlideUp",
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="flex gap-4">
        <button
          className="tipnix px-4 py-2 bg-blue-500 text-white rounded"
          tipnix-text="Click to save your changes"
        >
          Save
        </button>

        <button
          className="tipnix px-4 py-2 bg-red-500 text-white rounded"
          tipnix-text="Delete this item permanently"
          tipnix-animation="pulse"
        >
          Delete
        </button>

        <button
          className="tipnix px-4 py-2 bg-green-500 text-white rounded"
          tipnix-text="Export data as CSV"
          tipnix-bg="#10b981"
        >
          Export
        </button>
      </div>
    </div>
  );
}
\`\`\`

### Next.js with Layout

\`\`\`jsx
// app/layout.tsx
"use client";

import { TooltipProvider } from "tipnix";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider
          options={{
            textColor: "#ffffff",
            backgroundColor: "#333333",
            fontSize: "16px",
          }}
        />
        {children}
      </body>
    </html>
  );
}
\`\`\`

\`\`\`jsx
// app/page.tsx
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>

      <div
        className="tipnix inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
        tipnix-text="This is a tooltip"
      >
        Hover me
      </div>
    </main>
  );
}
\`\`\`

## RTL Support

Tipnix automatically detects RTL languages from the HTML `dir` attribute:

\`\`\`jsx
<html dir="rtl">
  <body>
    {/* Tooltips will automatically adjust for RTL */}
  </body>
</html>
\`\`\`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Use TooltipProvider** - More efficient than calling `useTooltip` in multiple components
2. **Batch Initialization** - Initialize all tooltips at once rather than in separate components
3. **Limit Animations** - Complex animations may impact performance on low-end devices
4. **Debounce Dynamic Content** - If adding many tooltips dynamically, consider debouncing

## Troubleshooting

### Tooltips not appearing

- Ensure the element has the `tipnix` class
- Check that `tipnix-text` attribute is set
- Verify `useTooltip()` or `TooltipProvider` is initialized

### Positioning issues

- Check if parent element has `position: relative`
- Verify viewport has enough space for tooltip
- Use `tipnix-parent` attribute to specify parent container

### Animations not working

- Ensure animation name is correct
- Check browser console for errors
- Verify CSS animations are not disabled globally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects!

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Made with care for the React and Next.js community.
