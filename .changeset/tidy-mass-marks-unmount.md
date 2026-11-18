---
'@amap-vue/hooks': patch
---

修复 `useMassMarkers` 在组件卸载时未清理海量点实例的问题，并取消尚未完成的初始化。
