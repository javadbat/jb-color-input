import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-color-input",
    path: "./web-component/lib/jb-color-input.ts",
    outputPath: "./web-component/dist/jb-color-input.js",
    tsConfigPath: "./web-component/tsconfig.json",
    umdName: "JBColorInput",
    external: ["jb-color-picker", "jb-input", "jb-popover", "jb-validation", "jb-core", "jb-core/i18n"],
    globals: {
      "jb-color-picker": "JBColorPicker",
      "jb-input": "JBInput",
      "jb-popover": "JBPopover",
      "jb-validation": "JBValidation",
      "jb-core": "JBCore",
      "jb-core/i18n": "JBCoreI18n",
    },
  },
];

export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-color-input-react",
    path: "./react/lib/JBColorInput.tsx",
    outputPath: "./react/dist/JBColorInput.js",
    external: ["react", "jb-color-input", "jb-input", "jb-input/react", "jb-core"],
    globals: {
      react: "React",
      "jb-color-input": "JBColorInput",
      "jb-input": "JBInput",
      "jb-input/react": "JBInputReact",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName: "JBColorInputReact",
    dir: "./react",
  },
];
