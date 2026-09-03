# Changelog

## [1.0.0] - 2026-09-03

### Changed

- Added the standard public `reset()` method; native form reset delegates to it and closes the picker.
- Breaking: renamed `openPicker()`/`closePicker()` to `open()`/`close()`.
- Breaking: updated color-picker styling parts to use the shared `root` contract.
- Breaking: renamed React keyboard event props to the React convention: `onBeforeInput`, `onKeyDown`, and `onKeyUp`; old prop names are removed.

## [0.2.0] 

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.

- add none input mode to input so it don't open virtual keyboard
