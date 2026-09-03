# jb-color-input React component

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-color-input/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-color-input)](https://www.npmjs.com/package/jb-color-input)

React wrapper for [`jb-color-input`](https://github.com/javadbat/jb-color-input). It registers the underlying web component, provides typed color-specific props, forwards the shared `jb-input` props and events, and exposes the web-component instance through a ref.

## Demo

- [Interactive Storybook demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--normal)
- [Size variants](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--size-variants)
- [Disabled state](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--disabled)
- [Validation](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--invalid-color)

## Installation

```sh
npm i jb-color-input
```

```tsx
import { JBColorInput } from "jb-color-input/react";
```

## Basic usage

```tsx
import { useState } from "react";
import { JBColorInput } from "jb-color-input/react";

export function BrandColorField() {
  const [value, setValue] = useState("#3b66f5");

  return <JBColorInput label="Brand color" name="brandColor" value={value} onInput={event => setValue(event.target.value)} />;
}
```

## Color-specific props

| prop | type | description |
| --- | --- | --- |
| `colorSpace` | `"rgb" \| "oklch" \| null` | Locks the picker to a color space. Use `null` to allow switching. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--locked-rgb) |
| `alphaEnabled` | `boolean` | Shows or hides picker alpha controls. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--without-alpha) |
| `isOpen` | `boolean` | Imperatively synchronizes the popover's open state when the prop changes. |

The wrapper also accepts shared `jb-input` props including `value`, `initialValue`, `label`, `message`, `name`, `placeholder`, `required`, `disabled`, `error`, `validationList`, and `size`. Standard `className`, `style`, `aria-*`, and `data-*` props are forwarded.

## Values and events

`value` is CSS color text. Use `event.target.value` from `onInput` or `onChange`, and use `event.target.valueObject` when parsed channel data is needed.

```tsx
<JBColorInput
  value="oklch(0.72 0.16 250 / 0.9)"
  onInput={event => console.log(event.target.value)}
  onChange={event => console.log(event.target.valueObject)}
/>;
```

`valueObject` is `null` while the field is empty or contains unsupported color text.

## Color-space and alpha controls

```tsx
<JBColorInput colorSpace="rgb" value="#3b66f5" />
<JBColorInput alphaEnabled={false} value="oklch(0.72 0.16 250)" />
```

Locking the picker does not reject valid input text written in another supported color syntax.

## Validation

Use `required`, `error`, and `validationList` as with `JBInput`. A built-in validator rejects non-empty text that cannot be parsed as RGB, hexadecimal, or OKLCH color syntax. [Demo](https://javadbat.github.io/design-system/?path=/story/components-form-elements-inputs-jbcolorinput--invalid-color)

```tsx
<JBColorInput label="Brand color" required message="Enter a CSS color" />
```

## Sizes and disabled state

```tsx
<JBColorInput size="xs" label="Compact color" />
<JBColorInput size="xl" label="Large color" />
<JBColorInput disabled label="Unavailable color" value="#94a3b8" />
```

The five size props change both the shared input shell and color trigger. Disabled state also disables the picker and prevents the popover from opening.

## Ref access

The forwarded ref exposes `JBColorInputWebComponent`, including `valueObject`, `isOpen`, `open()`, `close()`, validation methods, and `colorInputElements`.

```tsx
import { useRef } from "react";
import type { JBColorInputWebComponent } from "jb-color-input";

const inputRef = useRef<JBColorInputWebComponent | undefined>(undefined);

<JBColorInput ref={inputRef} label="Color" />;
```

## Slots

Pass children with `slot="inline-start"` or `slot="inline-end"` to use the inherited inline sections.

```tsx
<JBColorInput label="Accent color">
  <span slot="inline-start">Theme</span>
</JBColorInput>
```

## Styling

The React wrapper uses the same `jb-color-input`, `jb-input`, and `jb-color-picker` CSS variables and parts as the web component. See the shared [CSS variables and parts](../README.md#css-variables).

## Shared documentation

For CSS color formats, keyboard parameter changes, form behavior, validation, events, accessibility, CSS variables, and CSS parts, see the shared [`jb-color-input` documentation](../README.md).

## Related docs

- See [`jb-color-input`](https://github.com/javadbat/jb-color-input) for pure JavaScript and web-component usage.
- See [`jb-color-picker`](https://github.com/javadbat/jb-color-picker) for a standalone picker.
- See [`jb-input`](https://github.com/javadbat/jb-input) for the inherited React input contract.
- See [all JB Design System components](https://javadbat.github.io/design-system/).

## AI agent notes

- Import `JBColorInput` from `jb-color-input/react`; it registers the custom element.
- Use `event.target.value`, not `event.detail.value`, for this input wrapper.
- Use camelCase props `colorSpace`, `alphaEnabled`, and `isOpen`.
- Treat `valueObject` as nullable while users type.
- Use `size` directly; supported values are `xs`, `sm`, `md`, `lg`, and `xl`.
- Use a ref when imperative picker or validation access is required.
