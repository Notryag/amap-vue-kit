---
'@amap-vue/hooks': patch
'@amap-vue/loca': patch
---

共享服务 Hook 的异步初始化，修复首次并发查询及加载期间销毁的竞态。覆盖物加载后仅挂载到当前地图；Loca 图层记录实际挂载容器，切换和销毁时正确移除。提取图形公共操作，保持现有公开 API。
