import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import type { JBColorInputWebComponent } from "jb-color-input";
import { JBColorInput } from "jb-color-input/react";

const meta = {
  title: "Components/form elements/Inputs/JBColorInput",
  component: JBColorInput,
  args: {
    label: "Color",
    value: "#3b66f5",
    alphaEnabled: true,
    onInput: fn(),
    onChange: fn(),
  },
  argTypes: {
    colorSpace: { control: "inline-radio", options: [null, "rgb", "oklch"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    alphaEnabled: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof JBColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function getColorInput(canvasElement: HTMLElement): JBColorInputWebComponent {
  return canvasElement.querySelector<JBColorInputWebComponent>("jb-color-input")!;
}

export const Normal: Story = {
  play: async ({ canvasElement, args }) => {
    const colorInput = getColorInput(canvasElement);
    const nativeInput = colorInput.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    const trigger = colorInput.shadowRoot!.querySelector<HTMLButtonElement>(".color-trigger")!;

    await userEvent.click(trigger);
    await waitFor(() => expect(colorInput.isOpen).toBe(true));
    expect(colorInput.colorInputElements.popover.isOpen).toBe(true);
    const inputBoxBounds = colorInput.elements.inputBox.getBoundingClientRect();
    const popoverBounds = colorInput.colorInputElements.popover.elements.componentWrapper.getBoundingClientRect();
    expect(Math.abs(popoverBounds.left - inputBoxBounds.left)).toBeLessThan(1);
    expect(Math.abs(popoverBounds.top - inputBoxBounds.bottom)).toBeLessThan(1);

    nativeInput.focus();
    await userEvent.keyboard("{Control>}a{/Control}");
    await userEvent.keyboard("oklch(0.7 0.15 250)");
    expect(colorInput.valueObject?.colorSpace).toBe("oklch");
    expect(args.onInput).toHaveBeenCalled();

    const pickerSurface = colorInput.colorInputElements.picker.shadowRoot!.querySelector<HTMLElement>(".surface")!;
    pickerSurface.focus();
    expect(colorInput.isOpen).toBe(true);

    const outsideButton = document.createElement("button");
    canvasElement.append(outsideButton);
    outsideButton.focus();
    await waitFor(() => expect(colorInput.isOpen).toBe(false));
    outsideButton.remove();
  },
};

export const LockedRGB: Story = {
  args: { colorSpace: "rgb", value: "oklch(0.72 0.16 250 / 0.8)" },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.colorInputElements.picker.colorSpace).toBe("rgb"));
  },
};

export const LockedOKLCH: Story = {
  args: { colorSpace: "oklch", value: "rgb(59 102 245 / 0.8)" },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.colorInputElements.picker.colorSpace).toBe("oklch"));
    expect(colorInput.colorSpace).toBe("oklch");
    expect(colorInput.valueObject?.colorSpace).toBe("rgb");
  },
};

export const WithoutAlpha: Story = {
  args: { alphaEnabled: false },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.colorInputElements.picker.alphaEnabled).toBe(false));
  },
};

export const ArrowKeyParameters: Story = {
  args: { value: "rgb(10 20 30 / 0.5)" },
  play: async ({ canvasElement, args }) => {
    const colorInput = getColorInput(canvasElement);
    const nativeInput = colorInput.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    nativeInput.focus();

    nativeInput.setSelectionRange(colorInput.value.indexOf("20") + 1, colorInput.value.indexOf("20") + 1);
    await userEvent.keyboard("{ArrowUp}");
    expect(colorInput.value).toBe("rgb(10 21 30 / 0.5)");

    nativeInput.setSelectionRange(colorInput.value.indexOf("0.5") + 2, colorInput.value.indexOf("0.5") + 2);
    await userEvent.keyboard("{ArrowDown}");
    expect(colorInput.value).toBe("rgb(10 21 30 / 0.4)");
    expect(args.onInput).toHaveBeenCalledTimes(2);

    colorInput.value = "oklch(0.7 0.15 250 / 0.5)";
    nativeInput.setSelectionRange(colorInput.value.indexOf("0.15") + 2, colorInput.value.indexOf("0.15") + 2);
    await userEvent.keyboard("{ArrowUp}");
    expect(colorInput.value).toBe("oklch(0.7 0.151 250 / 0.5)");

    nativeInput.setSelectionRange(colorInput.value.indexOf("250") + 1, colorInput.value.indexOf("250") + 1);
    await userEvent.keyboard("{ArrowDown}");
    expect(colorInput.value).toBe("oklch(0.7 0.151 249 / 0.5)");
  },
};

export const SizeVariants: Story = {
  render: args => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map(size => (
        <JBColorInput {...args} key={size} label={size.toUpperCase()} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const colorInputs = Array.from(canvasElement.querySelectorAll<JBColorInputWebComponent>("jb-color-input"));
    await waitFor(() => expect(colorInputs).toHaveLength(5));
    expect(colorInputs.map(input => input.getAttribute("size"))).toEqual(["xs", "sm", "md", "lg", "xl"]);

    const triggerSizes = colorInputs.map(input => parseFloat(getComputedStyle(input.colorInputElements.trigger).height));
    expect(triggerSizes).toEqual([...triggerSizes].sort((a, b) => a - b));
    expect(new Set(triggerSizes).size).toBe(5);

    for (const colorInput of colorInputs) {
      const nativeInputBounds = colorInput.elements.input.getBoundingClientRect();
      const triggerBounds = colorInput.colorInputElements.trigger.getBoundingClientRect();
      const previewBounds = colorInput.colorInputElements.preview.getBoundingClientRect();
      const inputCenter = nativeInputBounds.top + nativeInputBounds.height / 2;
      const triggerCenter = triggerBounds.top + triggerBounds.height / 2;
      const previewCenter = previewBounds.top + previewBounds.height / 2;
      expect(Math.abs(triggerCenter - inputCenter)).toBeLessThan(1);
      expect(Math.abs(previewCenter - inputCenter)).toBeLessThan(1);
      expect(triggerBounds.width).toBeCloseTo(triggerBounds.height, 1);
    }
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled color",
    value: "#94a3b8",
  },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    const nativeInput = colorInput.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    const trigger = colorInput.colorInputElements.trigger;

    await waitFor(() => expect(trigger.disabled).toBe(true));
    expect(colorInput.disabled).toBe(true);
    expect(nativeInput.disabled).toBe(true);
    expect(colorInput.colorInputElements.picker.disabled).toBe(true);
    expect(colorInput.isOpen).toBe(false);

    await userEvent.click(trigger);
    expect(colorInput.isOpen).toBe(false);
  },
};

export const InvalidColor: Story = {
  args: {
    label: "CSS color",
    value: "not-a-color",
  },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.value).toBe("not-a-color"));
    expect(colorInput.valueObject).toBeNull();
    expect(colorInput.reportValidity()).toBe(false);
    expect(colorInput.validationMessage.length).toBeGreaterThan(0);
  },
};

export const ImperativePicker: Story = {
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);

    colorInput.open();
    await waitFor(() => expect(colorInput.isOpen).toBe(true));
    expect(colorInput.colorInputElements.trigger.getAttribute("aria-expanded")).toBe("true");

    colorInput.close();
    await waitFor(() => expect(colorInput.isOpen).toBe(false));
    expect(colorInput.colorInputElements.trigger.getAttribute("aria-expanded")).toBe("false");
  },
};

const cornerVariants = [
  { label: "Square", radius: "0", shape: "round" },
  { label: "Rounded", radius: "0.75rem", shape: "round" },
  { label: "Scoop", radius: "1.25rem", shape: "scoop" },
  { label: "Bevel", radius: "1.25rem", shape: "bevel" },
  { label: "Squircle", radius: "1.5rem", shape: "squircle" },
] as const;

export const RadiusAndCornerShapes: Story = {
  render: args => (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
      {cornerVariants.map(({ label, radius, shape }) => (
        <JBColorInput
          {...args}
          key={label}
          label={`${label} Â· ${radius}`}
          style={
            {
              "--jb-input-border-radius": radius,
              "--jb-input-corner-shape": shape,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  ),
};

export const Required: Story = {
  args: { value: "", required: true },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    const nativeInput = colorInput.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    nativeInput.focus();
    await userEvent.tab();
    await waitFor(() => expect(colorInput.checkValidity()).toBe(false));
  },
};
