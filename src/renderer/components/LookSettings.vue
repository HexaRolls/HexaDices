<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <div style="max-height: calc(100vh - 52px - 36px); overflow: auto;">
    <n-result
      status="warning"
      title="Attention"
      description="Cette section est encore en developpement, pour cette raison, les valeurs ne sont pas sauvegardés entre les démarrages"
      style="margin-top: 5em"
    />
    <n-card title="Paramètres d'apparence" :bordered="false" size="huge" style="width: 80%; margin: 0 auto;">
      <template #header-extra>
        <n-space>
          <n-button round @click="configImport">
            <template #icon>
              <import />
            </template>
            Importer
          </n-button>
          <n-button round :disabled="!Object.keys(config.naiveUi).length" @click="configSave">
            <template #icon>
              <file-add />
            </template>
            Sauvegarder
          </n-button>
          <n-button round :disabled="!Object.keys(config.naiveUi).length" @click="configReset">
            <template #icon>
              <sync />
            </template>
            Remettre les options par défaut
          </n-button>
        </n-space>
      </template>
      <n-collapse>
        <n-collapse-item title="Paramètres par défaut">
          <n-list>
            <n-list-item v-for="(attribute, attributeName, index) in defaultConfig.common" :key="index">
              <n-form-item label-placement="left" :label-width="156" :label="attributeName">
                <n-input-group>
                  <n-tooltip>
                    <template #trigger>
                      <n-button round v-if="!configHas(['common', attributeName])" @click="configSetPath(['common', attributeName], attribute)">
                        <template #icon>
                          <plus />
                        </template>
                      </n-button>
                    </template>
                    Ajouter une valeur de remplacement
                  </n-tooltip>
                  <n-color-picker v-if="(attribute.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i) || attribute.startsWith('rgb')) && !configHas(['common', attributeName])" :show-alpha="attribute.startsWith('rgba')" :value="attribute"/>
                  <n-color-picker v-else-if="attribute.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i) || attribute.startsWith('rgb')" :show-alpha="attribute.startsWith('rgba')" :default-value="attribute" v-model:value="config.naiveUi.common[attributeName]"/>
                  <n-input v-else-if="!configHas(['common', attributeName])" :value="attribute" :disabled="true"/>
                  <n-input v-else :default-value="attribute" v-model:value="config.naiveUi.common[attributeName]"/>
                  <n-tooltip>
                    <template #trigger>
                      <n-button round :disabled="!configHas(['common', attributeName])" @click="configUnsetPath(['common', attributeName])">
                        <template #icon>
                          <sync />
                        </template>
                      </n-button>
                    </template>
                    Remettre la valeur par défaut
                  </n-tooltip>
                </n-input-group>
              </n-form-item>
            </n-list-item>
          </n-list>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import {
  darkTheme,

  useMessage,

  NCollapse,
  NCollapseItem,
  NList,
  NListItem,
  NButton,
  NFormItem,
  NColorPicker,
  NInput,
  NInputGroup,
  NTooltip,
  NCard,
  NResult,
  NSpace
} from 'naive-ui'
import { useGlobalConfig, useIpc } from '../hooks'
import { has, unset, merge } from 'lodash-es'

import Plus from './utils/icons/plus.vue'
import Sync from './utils/icons/sync.vue'
import FileAdd from './utils/icons/fileAdd.vue'
import Import from './utils/icons/import.vue'
import { config } from 'process'

export default defineComponent({
  setup() {
    const globalConfig = useGlobalConfig()
    const ipc = useIpc()
    const message = useMessage()
    const defaultConfig = computed(() => {
      return merge({}, darkTheme, globalConfig.config.value.defaults.naiveUi)
    })

    return {
      config: globalConfig.config,
      defaultConfig,
      configHas: (value: any) => {
        return has(globalConfig.config.value.naiveUi, value)
      },
      configSetPath: (value: any, defaultValue: any) => {
        return globalConfig.setValue(value, defaultValue, 'naiveUi')
      },
      configUnsetPath: (value: any) => {
        return globalConfig.resetValue(value, 'naiveUi')
      },
      configReset: () => {
        return globalConfig.resetConfig('naiveUi')
      },
      configSave: () => {
        ipc.once('transfer:exported', (e, [data, err]) => {
          if (err) return console.error(err)

          message.success(`le fichier a bien été enregistré à l'emplacement suivant: "${data.filePath || '¯\\_(ツ)_/¯'}"`)
        })

        ipc.send('transfer:export', {
          file: {
            name: 'MonTheme',
            extension: 'hdtheme',
            type: 'HexaDices Theme',
            data: JSON.stringify({ ...globalConfig.config.value.naiveUi, ...globalConfig.config.value.global })
          },
          label: 'Enregistrer le thème'
        })
      },
      configImport: () => {
        ipc.once('transfer:imported', (e, [data, err]) => {
          if (err) return console.error(err)

          console.log('imported from', data.filePath)
          const jsonData = JSON.parse(data.data)
          if (typeof jsonData === 'undefined') return message.error('invalid imported data')

          globalConfig.setConfig((jsonData.naiveUi || {}), 'naiveUi')
          globalConfig.setConfig((jsonData.global || {}), 'global')
          console.log(jsonData.naiveUi)
          console.log(globalConfig.config.value.naiveUi)

          message.success('Le theme a été importé avec succès')
        })

        ipc.send('transfer:import', {
          file: {
            extension: 'hdtheme',
            type: 'HexaDices Theme'
          },
          label: 'Importer le thème'
        })
      }
    }
  },
  components: {
    NCollapse,
    NCollapseItem,
    NList,
    NListItem,
    NButton,
    NFormItem,
    NColorPicker,
    NInput,
    NInputGroup,
    NTooltip,
    NCard,
    NResult,
    NSpace,

    Plus,
    Sync,
    FileAdd,
    Import
  }
})
</script>
