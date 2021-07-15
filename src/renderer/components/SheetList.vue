<template>
  <article class="container">
    <n-layout position="relative">
      <n-layout-header position="absolute" style="top: 0;height: 4.5em;display: flex;justify-content: space-between;align-items: center;padding: 0 5vw">
        <h2>Liste des fiches personnage</h2>
        <!-- <n-space class="searchBarActions">
          <n-popover trigger="hover" placement="bottom">
            <template #trigger>
              <n-button size="large" circle>
                <template #icon>
                  <plus />
                </template>
              </n-button>
            </template>
            <span>Ajouter une fiches</span>
          </n-popover>
          <n-popover trigger="hover" placement="bottom-end">
            <template #trigger>
              <n-button size="large" circle>
                <template #icon>
                  <list-search />
                </template>
              </n-button>
            </template>
            <span>Réoganiser ses fiches</span>
          </n-popover>
        </n-space> -->
      </n-layout-header>
      <n-layout-content position="absolute" style="top: 4.5em;" content-style="padding: 1em" :native-scrollbar="false">
        <n-grid style="padding: 0 5vw" cols="1 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" :x-gap="15" :y-gap="15" :collapsed="collapsed" :collapsed-rows="2" v-if="sheets && sheets.length">
          <n-grid-item v-for="sheet in sheets" :key="sheet.id">
            <n-card title="Card with Cover" hoverable>
              <template #cover>
                <div style="height: 24vh;overflow: hidden">
                  <img src="../assets/images/6b9e8aaf91df33931508a010bc9459b5.png" />
                </div>
              </template>
              Card Content
            </n-card>
          </n-grid-item>
          <n-grid-item suffix v-slot="{ overflow }">
            <template v-if="overflow || !collapsed">
              <n-card style="height: 100%" :bordered="false">
                <n-result size="small" status="info" :title="collapsed ? 'Voir plus' : 'Voir moins'" :description="collapsed ? 'Quelques fiches ont été cachés pour une meilleure lecture' : 'Toutes les fiches ont été affichées'">
                  <template #footer>
                    <n-button @click="collapsed = !collapsed">{{ collapsed ? 'Afficher' : 'Cacher' }}</n-button>
                  </template>
                </n-result>
              </n-card>
            </template>
          </n-grid-item>
        </n-grid>
        <n-empty v-else size="huge" description="Vous n'avez aucune fiche pour le moment" style="margin-top: 5em">
          <template #extra>
            <!-- <n-button>Créer une fiche</n-button> -->
          </template>
        </n-empty>
      </n-layout-content>
    </n-layout>
  </article>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useService } from '../hooks'
import { GameSheet } from '/@shared/games'

import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NGrid,
  NGridItem,
  NEmpty,
  NCard,
  NResult,
  NButton,
  NPopover,
  NSpace
} from 'naive-ui'

import Plus from './utils/icons/plus.vue'
import ListSearch from './utils/icons/listSearch.vue'

const Store = useService('PersistentStore')

export default defineComponent({
  setup() {
    const sheets = ref(null as null|GameSheet[])
    const collapsed = ref(true)

    const updateSheets = () => {
      if (sheets.value) {
        Store.setStoreValue('saved', 'sheets', JSON.parse(JSON.stringify(sheets.value)))
      }
    }

    const getSheets = () => {
      Store.getStoreValue('saved', 'sheets', null).then((sheetList: null|GameSheet[]) => {
        if (sheetList) sheets.value = sheetList
        else {
          sheets.value = []
          updateSheets()
        }
      })
    }

    getSheets()

    return {
      sheets,
      collapsed,
      getSheets,
      updateSheets,
      NGridComponentData: reactive({
        cols: '1 s:3 m:4 l:5 xl:6 2xl:7',
        responsive: 'screen',
        xGap: 15,
        yGap: 15,
        collapsed: collapsed.value,
        collapsedRows: 2
      })
    }
  },
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NGrid,
    NGridItem,
    NEmpty,
    NCard,
    NResult,
    NButton,
    NPopover,
    NSpace,

    Plus,
    ListSearch
  }
})
</script>
