import type { JBColorInputWebComponent } from "jb-color-input";
import type { SizeVariants } from "jb-input";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-color-input": JBColorInputType;
    }
    interface JBColorInputType extends React.DetailedHTMLProps<React.HTMLAttributes<JBColorInputWebComponent>, JBColorInputWebComponent> {
      class?: string;
      label?: string;
      name?: string;
      message?: string;
      placeholder?: string;
      size?: SizeVariants;
      value?: string;
      initialValue?: string;
      ref: React.RefObject<JBColorInputWebComponent | null>;
    }
  }
}
