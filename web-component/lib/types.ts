import type { JBColorPickerWebComponent } from "jb-color-picker";
import type { JBPopoverWebComponent } from "jb-popover";

export type ColorInputElements = {
  trigger: HTMLButtonElement;
  preview: HTMLSpanElement;
  picker: JBColorPickerWebComponent;
  popover: JBPopoverWebComponent;
};
