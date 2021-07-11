import { computed } from 'vue'
import { useStore } from './store'
// import { useService } from './service'
// const Store = useService('PersistentStore')

type ConfigType = 'naiveUi' | 'global'

export function useGlobalConfig() {
  const { state, commit } = useStore()
  const config = computed(() => state.globalConfig)

  const setValue = (key: string, value: any, type: ConfigType) => commit('setValue', { key, value, type })
  const resetValue = (key: string, type: ConfigType) => commit('resetValue', { key, type })
  const setConfig = (value: any, type: ConfigType) => commit('setConfig', { value, type })
  const resetConfig = (type: ConfigType) => commit('resetConfig', { type })

  return {
    config,
    setValue,
    resetValue,
    setConfig,
    resetConfig
  }
}
