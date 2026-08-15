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
    await waitFor(() => expect(colorInput.showPicker).toBe(true));
    expect(colorInput.colorInputElements.popover.isOpen).toBe(true);

    nativeInput.focus();
    await userEvent.clear(nativeInput);
    await userEvent.type(nativeInput, "oklch(0.7 0.15 250)");
    expect(colorInput.valueObject?.colorSpace).toBe("oklch");
    expect(args.onInput).toHaveBeenCalled();
  },
};

export const LockedRGB: Story = {
  args: { colorSpace: "rgb", value: "oklch(0.72 0.16 250 / 0.8)" },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.colorInputElements.picker.colorSpace).toBe("rgb"));
  },
};

export const WithoutAlpha: Story = {
  args: { alphaEnabled: false },
  play: async ({ canvasElement }) => {
    const colorInput = getColorInput(canvasElement);
    await waitFor(() => expect(colorInput.colorInputElements.picker.alphaEnabled).toBe(false));
  },
};

export const Sizes: Story = {
  render: args => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map(size => (
        <JBColorInput {...args} key={size} label={size.toUpperCase()} size={size} />
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
