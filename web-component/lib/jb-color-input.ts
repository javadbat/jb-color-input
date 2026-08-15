import CSS from "./jb-color-input.css";
import VariablesCSS from "./variables.css";
import "jb-color-picker";
import "jb-input";
import "jb-popover";
import { type ColorPickerChangeEvent, type ColorSpace, type JBColorPickerValue, parseColor } from "jb-color-picker";
import { type JBInputValue, JBInputWebComponent } from "jb-input";
import type { ValidationItem } from "jb-validation";
import { createInputEvent, parseBooleanAttribute } from "jb-core";
import { i18n } from "jb-core/i18n";
import { dictionary } from "./i18n.js";
import { createColorTrigger, renderHTML } from "./render.js";
import type { ColorInputElements } from "./types.js";

export * from "./types.js";
export type { ColorSpace, JBColorPickerValue } from "jb-color-picker";
export { dictionary } from "./i18n.js";

export class JBColorInputWebComponent extends JBInputWebComponent {
  colorInputElements!: ColorInputElements;
  #isOpen = false;
  #colorSpace: ColorSpace | null = null;
  #alphaEnabled = true;
  #dependenciesReady = false;
  #dependenciesReadyPromise: Promise<void> | null = null;

  constructor() {
    super();
    this.#initColorInput();
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.#prepareDependencies();
  }

  override get value(): string {
    return super.value;
  }

  override set value(value: string) {
    super.value = value ?? "";
    this.#updateColorPresentation();
  }

  override get initialValue(): string {
    return super.initialValue;
  }

  override set initialValue(value: string) {
    super.initialValue = value ?? "";
    this.#updateColorPresentation();
  }

  override get disabled(): boolean {
    return super.disabled;
  }

  override set disabled(value: boolean) {
    super.disabled = value;
    if (!this.colorInputElements || !this.#dependenciesReady) return;
    this.colorInputElements.trigger.disabled = value;
    this.colorInputElements.picker.disabled = value;
    if (value) this.closePicker();
  }

  get colorSpace(): ColorSpace | null {
    return this.#colorSpace;
  }

  set colorSpace(value: ColorSpace | null) {
    this.#colorSpace = value === "rgb" || value === "oklch" ? value : null;
    if (this.colorInputElements && this.#dependenciesReady) {
      this.colorInputElements.picker.colorSpace = this.#colorSpace;
      this.#updateColorPresentation();
    }
  }

  get alphaEnabled(): boolean {
    return this.#alphaEnabled;
  }

  set alphaEnabled(value: boolean) {
    this.#alphaEnabled = Boolean(value);
    if (this.colorInputElements && this.#dependenciesReady) {
      this.colorInputElements.picker.alphaEnabled = this.#alphaEnabled;
    }
  }

  get valueObject(): JBColorPickerValue | null {
    return parseColor(this.value);
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }

  set isOpen(value: boolean) {
    if (value) this.openPicker();
    else this.closePicker();
  }

  openPicker(): void {
    if (this.disabled || this.#isOpen) return;
    if (!this.#dependenciesReady) {
      void this.#prepareDependencies().then(() => this.openPicker());
      return;
    }
    this.#isOpen = true;
    this.#updateColorPresentation();
    this.colorInputElements.popover.open();
    this.colorInputElements.trigger.classList.add("--active");
    this.colorInputElements.trigger.setAttribute("aria-expanded", "true");
  }

  closePicker(): void {
    if (!this.colorInputElements || !this.#dependenciesReady || !this.#isOpen) return;
    this.#isOpen = false;
    this.colorInputElements.popover.close();
    this.colorInputElements.trigger.classList.remove("--active");
    this.colorInputElements.trigger.setAttribute("aria-expanded", "false");
  }

  override formResetCallback(): void {
    super.formResetCallback();
    this.#updateColorPresentation();
    this.closePicker();
  }

  static get colorInputObservedAttributes(): string[] {
    return ["color-space", "alpha-disabled"];
  }

  static override get observedAttributes(): string[] {
    return [...JBInputWebComponent.observedAttributes, ...JBColorInputWebComponent.colorInputObservedAttributes];
  }

  override attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (JBColorInputWebComponent.colorInputObservedAttributes.includes(name)) {
      if (name === "color-space") {
        this.colorSpace = newValue === "rgb" || newValue === "oklch" ? newValue : null;
      }
      if (name === "alpha-disabled") {
        this.alphaEnabled = !parseBooleanAttribute(newValue);
      }
      return;
    }
    this.onAttributeChange(name, newValue ?? "");
  }

  #initColorInput(): void {
    const template = document.createElement("template");
    template.innerHTML = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const trigger = createColorTrigger();
    this.elements.slots.endSection.parentElement!.append(trigger);
    this.colorInputElements = {
      trigger,
      preview: trigger.querySelector(".color-preview")!,
      picker: this.shadowRoot!.querySelector("jb-color-picker")!,
      popover: this.shadowRoot!.querySelector("jb-popover")!,
    };
    this.validation.addValidationListGetter(this.#getColorValidations.bind(this));
    this.#registerColorEvents();
  }

  #registerColorEvents(): void {
    this.colorInputElements.trigger.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
    });
    this.colorInputElements.picker.addEventListener("input", event => this.#onPickerInput(event as unknown as ColorPickerChangeEvent));
    this.colorInputElements.picker.addEventListener("change", event => this.#onPickerChange(event as unknown as ColorPickerChangeEvent));
    this.colorInputElements.popover.addEventListener("close", () => {
      this.#isOpen = false;
      this.colorInputElements.trigger.classList.remove("--active");
      this.colorInputElements.trigger.setAttribute("aria-expanded", "false");
    });
    this.addEventListener("input", event => {
      if (event.target === this) this.#updateColorPresentation();
    });
    this.addEventListener("change", event => {
      if (event.target === this) this.#updateColorPresentation();
    });
    this.addEventListener("keydown", event => {
      if ((event as KeyboardEvent).key === "Escape" && this.isOpen) {
        this.closePicker();
        this.colorInputElements.trigger.focus();
      }
    });
  }

  #syncPickerConfiguration(): void {
    this.colorInputElements.picker.colorSpace = this.#colorSpace;
    this.colorInputElements.picker.alphaEnabled = this.#alphaEnabled;
    this.colorInputElements.picker.disabled = this.disabled;
    this.colorInputElements.trigger.disabled = this.disabled;
  }

  #updateColorPresentation(): void {
    if (!this.colorInputElements || !this.#dependenciesReady) return;
    const parsedColor = parseColor(this.value);
    if (!parsedColor) {
      this.style.removeProperty("--selected-color");
      return;
    }
    this.colorInputElements.picker.value = parsedColor;
    this.style.setProperty("--selected-color", this.colorInputElements.picker.value);
  }

  #onPickerInput(event: ColorPickerChangeEvent): void {
    event.stopPropagation();
    this.value = event.detail.value;
    this.validation.checkValidity({ showError: false });
    this.#dispatchInputEvent(event);
  }

  #onPickerChange(event: ColorPickerChangeEvent): void {
    event.stopPropagation();
    if (this.value !== event.detail.value) this.value = event.detail.value;
    this.validation.checkValidity({ showError: true });
    this.#dispatchChangeEvent();
  }

  #dispatchInputEvent(sourceEvent: ColorPickerChangeEvent): void {
    const event = createInputEvent("input", sourceEvent as unknown as InputEvent, {
      bubbles: true,
      cancelable: false,
      composed: true,
      data: sourceEvent.detail.value,
      inputType: "insertReplacementText",
    });
    this.dispatchEvent(event);
  }

  #dispatchChangeEvent(): void {
    const event = new Event("change", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  #getColorValidations(): ValidationItem<JBInputValue>[] {
    return [
      {
        validator: value => value.value.length === 0 || parseColor(value.value) !== null,
        message: dictionary.get(i18n, "invalidColor"),
        stateType: "badInput",
      },
    ];
  }

  async #prepareDependencies(): Promise<void> {
    if (this.#dependenciesReady) return;
    if (this.#dependenciesReadyPromise) return this.#dependenciesReadyPromise;
    this.#dependenciesReadyPromise = Promise.all([customElements.whenDefined("jb-color-picker"), customElements.whenDefined("jb-popover")]).then(() => {
      this.#dependenciesReady = true;
      this.colorInputElements.popover.bindTarget(this.colorInputElements.trigger);
      this.#syncPickerConfiguration();
      this.#updateColorPresentation();
    });
    return this.#dependenciesReadyPromise;
  }
}

if (!customElements.get("jb-color-input")) {
  customElements.define("jb-color-input", JBColorInputWebComponent);
}

declare global {
  interface HTMLElementTagNameMap {
    "jb-color-input": JBColorInputWebComponent;
  }
}
