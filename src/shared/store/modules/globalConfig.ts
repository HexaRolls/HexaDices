import { ModuleOption } from '../definition'
import { darkTheme, GlobalThemeOverrides } from 'naive-ui'
import { get, set, unset, omitBy, isObject, isEmpty } from 'lodash-es'

type ConfigType = 'naiveUi' | 'global'

interface State {
  naiveUi: GlobalThemeOverrides
  global: any
  defaults: {
    naiveUi: GlobalThemeOverrides,
    global: any
  }
}

interface Getters {

}

interface Mutations {
  setValue: { key: string, value: any, type: ConfigType }
  resetValue: { key: string, type: ConfigType }
  setConfig: { value: any, type: ConfigType }
  resetConfig: { type: ConfigType }
}

export type GlobalConfigModule = ModuleOption<State, Getters, Mutations>;

const mod: GlobalConfigModule = {
  state: {
    naiveUi: {},
    global: {},
    defaults: {
      naiveUi: {
        common: {
          fontFamily: "'Nunito', Helvetica, Arial, sans-serif",

          primaryColor: '#2BB3F0',
          primaryColorHover: '#5ED1F6',
          primaryColorPressed: '#1F8CCE',
          primaryColorSuppl: '#156AAC',

          infoColor: '#6C83F7',
          infoColorHover: '#90A3FA',
          infoColorPressed: '#4E62D4',
          infoColorSuppl: '#3646B1',

          successColor: '#4BC145',
          successColorHover: '#7ED970',
          successColorPressed: '#32A536',
          successColorSuppl: '#228A2F',

          warningColor: '#FFC30F',
          warningColorHover: '#FFD64B',
          warningColorPressed: '#DBA10A',
          warningColorSuppl: '#B78207',

          errorColor: '#FF446D',
          errorColorHover: '#FF7284',
          errorColorPressed: '#DB3167',
          errorColorSuppl: '#B7225F',

          baseColor: '#232430',
          bodyColor: '#232430',

          modalColor: '#1E1E29',

          cardColor: '#181921',
          tableColor: '#181921',
          popoverColor: '#181921',

          textColorBase: '#BFC9D4',

          avatarColor: '#13131A'
        }
      },
      global: {}
    }
  },
  getters: {

  },
  mutations: {
    setValue: (state, { key, value, type }) => {
      if (!(type in state)) throw new Error('illegal type in state')
      if (!get(darkTheme, key, null)) throw new Error('illegal property mutation ' + key)
      set(state[type], key, value)
    },
    resetValue: (state, { key, type }) => {
      if (!(type in state)) throw new Error('illegal type in state')
      if (!get(darkTheme, key, null)) throw new Error('illegal property mutation ' + key)

      function clean(obj: any) {
        for (var propName in obj) {
          if (isObject(obj[propName])) {
            clean(obj[propName])
          }
          if (obj[propName] === null || obj[propName] === undefined || (isObject(obj[propName]) && isEmpty(obj[propName]))) {
            delete obj[propName]
          }
        }
      }

      unset(state[type], key)
      clean(state[type])
    },
    setConfig: (state, { value, type }) => {
      if (!(type in state)) throw new Error('illegal type in state')
      state[type] = value
    },
    resetConfig: (state, { type }) => {
      if (!(type in state)) throw new Error('illegal type in state')
      state[type] = {}
    }
  }
}

export default mod
