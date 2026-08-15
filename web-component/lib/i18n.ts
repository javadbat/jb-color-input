import { JBDictionary } from "jb-core/i18n";

export type JBColorInputDictionary = {
  invalidColor: string;
  openColorPicker: string;
};

export const dictionary = new JBDictionary<JBColorInputDictionary>({
  en: {
    invalidColor: "Enter a valid CSS color",
    openColorPicker: "Open color picker",
  },
  fa: {
    invalidColor: "یک رنگ CSS معتبر وارد کنید",
    openColorPicker: "باز کردن انتخاب‌گر رنگ",
  },
});
