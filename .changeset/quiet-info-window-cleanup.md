---
'@amap-vue/core': patch
'@amap-vue/hooks': patch
---

信息窗体清理改用公开 close API，避免内部 destroy 导致地图销毁时重复删除 DOM。隔离地图画布与 Vue 子组件，并通过 Teleport 保持信息窗体插槽内容的响应式更新与正确卸载。
