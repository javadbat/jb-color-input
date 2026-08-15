import type { JBColorInputWebComponent } from "jb-color-input";
import type { ValidationValue } from "jb-input";
import type { ValidationItem } from "jb-validation";
import { type RefObject, useEffect } from "react";

export type JBColorInputAttributes = {
  validationList?: ValidationItem<ValidationValue>[];
  disabled?: boolean;
  required?: boolean | string;
};

export function useJBColorInputAttributes(element: RefObject<JBColorInputWebComponent | null>, props: JBColorInputAttributes): void {
  useEffect(() => {
    let isActive = true;
    void customElements.whenDefined("jb-color-input").then(() => {
      if (isActive && element.current) {
        element.current.validation.list = props.validationList ?? [];
      }
    });
    return () => {
      isActive = false;
    };
  }, [element, props.validationList]);

  useEffect(() => {
    element.current?.toggleAttribute("disabled", props.disabled === true);
  }, [element, props.disabled]);

  useEffect(() => {
    if (typeof props.required === "string") {
      element.current?.setAttribute("required", props.required);
    } else if (typeof props.required === "boolean") {
      element.current?.toggleAttribute("required", props.required);
    }
  }, [element, props.required]);
}
