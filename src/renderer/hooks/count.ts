import { computed } from 'vue'
import { useStore } from './store'
import { useService } from './service'
const Store = useService('PersistentStore')

export function useCount() {
  const { state, commit } = useStore()
  const count = computed(() => state.foo.count)

  const updateRef = async () => {
    return Store.getStoreValue('foo', 'count', state.foo.count).then((store: number) => {
      state.foo.count = store || 0
    })
  }

  const increment = () => {
    Store.setStore('foo', {
      count: state.foo.count + 1
    })
    commit('increment')
  }

  updateRef()
  return {
    count,
    increment
  }
}
