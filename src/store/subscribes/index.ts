import { PiniaPluginContext } from 'pinia'
import { storageKey } from '@/models/products'
const actionsToSubscribe: string[] = [
  'add',
  'remove',
  'toggleCheck',
  'toggleCheckAll'
]
export function productsSub (ctx: PiniaPluginContext) {
  const { store } = ctx
  store.$onAction(({ name, store, after }) => {
    if (actionsToSubscribe.includes(name)) {
      after(() => {
        localStorage.setItem(storageKey, JSON.stringify(store.products))
      })
    }
  })
}
