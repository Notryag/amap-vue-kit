---
'@amap-vue/core': patch
'@amap-vue/hooks': patch
---

修复地图卸载时先销毁父地图导致子图层清理异常的问题，取消卸载后尚未完成的地图初始化，并避免热力图重复解绑。
