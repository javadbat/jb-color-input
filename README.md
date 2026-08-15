# jb-color-input

A form-associated CSS color input that combines the standard `jb-input`
experience with `jb-color-picker` in a popover.

## Installation

```sh
npm install jb-color-input
```

## Web component

```js
import "jb-color-input";
```

```html
<jb-color-input
  label="Brand color"
  name="brandColor"
  value="oklch(0.72 0.16 250 / 0.9)"
></jb-color-input>
```

The input accepts supported CSS RGB, hex, and OKLCH colors. It submits its CSS
color string through native forms. Set `color-space="rgb"` or
`color-space="oklch"` to lock the picker, and add `alpha-disabled` to hide alpha
controls.

The inherited `size` attribute supports `xs`, `sm`, `md`, `lg`, and `xl`; it
changes both the input and color trigger dimensions.

## React

```tsx
import { JBColorInput } from "jb-color-input/react";

export function Example() {
  return <JBColorInput label="Brand color" value="#3b66f5" colorSpace="rgb" />;
}
```

## API

- `value`: CSS color string.
- `valueObject`: parsed RGB or OKLCH value, or `null` for empty/invalid text.
- `colorSpace`: `"rgb"`, `"oklch"`, or `null` to allow switching.
- `alphaEnabled`: shows or hides alpha controls.
- `showPicker`: opens or closes the picker.
- `openPicker()` / `closePicker()`: imperative picker controls.

All standard `jb-input` properties, validation methods, events, form behavior,
inline slots, and size variants are inherited.

Color input web component for the JB Design System
