# `useTransfer`

使用高德的 `AMap.Transfer` 插件查询公交、地铁和步行换乘方案。Hook 返回方案数据，可用于自定义绘制或结果面板。

## 最小示例

```ts
import { useTransfer } from '@amap-vue/hooks'

const { search } = useTransfer({ city: '北京市' })

async function findRoutes() {
  const result = await search('北京西站', '北京站')
  return result?.plans ?? []
}
```

## TS 签名

```ts
type TransferEndpoint = LngLatLike | string | AMap.TransferKeyword

function useTransfer(options?: MaybeRefOrGetter<UseTransferOptions | undefined>): {
  transfer: ShallowRef<AMap.Transfer | null>
  search: (origin: TransferEndpoint, destination: TransferEndpoint) => Promise<AMap.TransferResult | null>
  clear: () => void
  destroy: () => void
}
```

`UseTransferOptions` 支持 `city`、`cityd`、`policy`、`nightflag` 和 `loadOptions`。每个方案包含 `segments`，其中 `transit_mode` 表示出行方式，`transit.path` 包含该路段的坐标。

## 常见错误

- 起终点须同时使用坐标，或同时使用名称。名称查询可指定城市来减少歧义。
- 无结果、SDK 回调失败或清除后的旧查询返回 `null`。组件卸载会清理原生实例。

## 完整示例

```ts
async function getTransitSegments() {
  const { search, destroy } = useTransfer({ city: '北京市' })
  try {
    const result = await search([116.3217, 39.8949], [116.4288, 39.9026])
    return (result?.plans[0]?.segments ?? []).flatMap(segment => segment.transit?.path?.length
      ? [
          { mode: segment.transit_mode, path: segment.transit.path }
        ]
      : [])
  }
  finally {
    destroy()
  }
}
```

[打开地图示例和完整源码](../components/transfer) · [在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
