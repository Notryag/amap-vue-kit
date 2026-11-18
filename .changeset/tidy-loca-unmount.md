---
'@amap-vue/loca': patch
---

修复 Loca 组件卸载顺序，先解绑并销毁子图层，再销毁 Loca 容器。
