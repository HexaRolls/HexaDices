import { Service } from './Service'
import Store from 'electron-store'

export class PersistentStore extends Service {
  getStoreValue(storeKey: string, storeValue: string, defaultValue: any = null) {
    const store = new Store({
      name: storeKey
    })
    const value: any = store.get(storeValue, defaultValue)
    return value
  }

  setStore(storeKey: string, data: any) {
    const store = new Store({
      name: storeKey
    })
    store.store = data
  }

  setStoreValue(storeKey: string, storeValue: string, data: any) {
    const store = new Store({
      name: storeKey
    })
    store.set(storeValue, data)
  }
}
