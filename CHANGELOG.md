# Changelog

## [0.2.0] 

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.

- add none input mode to input so it don't open virtual keyboard