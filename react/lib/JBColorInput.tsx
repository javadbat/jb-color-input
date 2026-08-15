"use client";

// biome-ignore lint/correctness/noUnusedImports: required by the classic React JSX transform
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "jb-color-input";
import type { ColorSpace, JBColorInputWebComponent, JBColorPickerValue } from "jb-color-input";
import { type BaseProps, useJBInputEvents } from "jb-input/react";
import { useJBColorInputAttributes } from "./attributes-hook.js";
import "./module-declaration.js";

export type JBColorInputProps = BaseProps<JBColorInputWebComponent> & {
  colorSpace?: ColorSpace | null;
  alphaEnabled?: boolean;
  showPicker?: boolean;
};

export type { ColorSpace, JBColorPickerValue };

export const JBColorInput = forwardRef<JBColorInputWebComponent | undefined, JBColorInputProps>((props, ref) => {
  const element = useRef<JBColorInputWebComponent>(null);
  useImperativeHandle(ref, () => element.current ?? undefined, []);

  const {
    alphaEnabled,
    colorSpace,
    disabled,
    initialValue,
    onBeforeinput,
    onBlur,
    onChange,
    onEnter,
    onFocus,
    onInput,
    onKeydown,
    onKeyup,
    required,
    showPicker,
    validationList,
    value,
    ...otherProps
  } = props;

  useJBColorInputAttributes(element, { disabled, required, validationList });
  useJBInputEvents(element, {
    onBeforeinput,
    onBlur,
    onChange,
    onEnter,
    onFocus,
    onInput,
    onKeydown,
    onKeyup,
  });

  useEffect(() => {
    if (element.current && colorSpace !== undefined) {
      element.current.colorSpace = colorSpace;
    }
  }, [colorSpace]);
  useEffect(() => {
    if (element.current && alphaEnabled !== undefined) {
      element.current.alphaEnabled = alphaEnabled;
    }
  }, [alphaEnabled]);
  useEffect(() => {
    if (element.current && showPicker !== undefined) {
      element.current.showPicker = showPicker;
    }
  }, [showPicker]);

  const valueProps = value === undefined ? {} : { value: value?.toString() ?? "" };
  return (
    <jb-color-input ref={element} initialValue={initialValue?.toString() ?? ""} {...valueProps} {...otherProps}>
      {props.children}
    </jb-color-input>
  );
});

JBColorInput.displayName = "JBColorInput";
