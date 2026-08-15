import "jb-color-picker";
import "jb-popover";
import { i18n } from "jb-core/i18n";
import { dictionary } from "./i18n.js";

export function createColorTrigger(): HTMLButtonElement {
  const template = document.createElement("template");
  template.innerHTML = /* html */ `
    <button class="color-trigger" type="button" aria-label="${dictionary.get(i18n, "openColorPicker")}" aria-haspopup="dialog" aria-expanded="false">
      <span class="color-preview" aria-hidden="true"></span>
    </button>
  `;
  return template.content.firstElementChild as HTMLButtonElement;
}

export function createColorPickerPopover(): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = /* html */ `
    <jb-popover class="color-popover" part="popover" exportparts="content: popover-content">
      <jb-color-picker part="color-picker"></jb-color-picker>
    </jb-popover>
  `;
  return template.content.cloneNode(true) as DocumentFragment;
}
