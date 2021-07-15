<template>
  <n-drawer v-model:show="open" :width="400" placement="left" to="#main-content">
    <n-drawer-content title="Rechercher" style="text-align: left;">
      <n-input-group>
        <n-input v-model:value="query" type="input" round :placeholder="games[0]?.name">
          <template #suffix>
            <search />
          </template>
        </n-input>
        <n-popover trigger="hover" placement="bottom-end">
          <template #trigger>
            <n-button round type="primary" ghost @click="handleAdd">
              <template #icon>
                  <plus />
                </template>
            </n-button>
          </template>
          <span>Ajouter une partie</span>
        </n-popover>
      </n-input-group>
      <n-list>
        <n-list-item v-for="game in filteredGames" :key="game.id">
          <n-thing :title="game.name" :description="game.description || 'Pas de description'"></n-thing>
          <template #suffix>
            <n-space :wrap="false">
              <n-popover trigger="hover" placement="left">
                <template #trigger>
                  <n-button round @click="$router.push(`/play/${game.id}`)">
                    <template #icon>
                      <pen />
                    </template>
                  </n-button>
                </template>
                <span>Modifier</span>
              </n-popover>
              <n-popconfirm placement="bottom-end">
                <template #activator>
                  <n-button circle type="error" ghost>
                    <template #icon>
                      <trash />
                    </template>
                  </n-button>
                </template>
                <template #action>
                  <n-button size="small" type="warning" ghost @click="handleDelete($event, game)">Oui, supprimez !</n-button>
                </template>
                <template #default>
                  <p style="text-align: left">
                    Si vous supprimez cette sauvegarde,<br/>
                    vous ne pourrez plus la récupérer par la suite,<br/>
                    êtes-vous sûr ?
                  </p>
                </template>
              </n-popconfirm>
            </n-space>
          </template>
        </n-list-item>
      </n-list>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { Game } from '/@shared/games'

import {
  NDrawer,
  NDrawerContent,
  NList,
  NListItem,
  NInput,
  NInputGroup,
  NSpace,
  NThing,
  NButton,
  NPopover,
  NPopconfirm
} from 'naive-ui'

import Search from '../utils/icons/search.vue'
import Trash from '../utils/icons/trash.vue'
import Pen from '../utils/icons/pen.vue'
import Plus from '../utils/icons/plus.vue'

export default defineComponent({
  props: {
    games: {
      type: Array as () => Game[],
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      open: false,
      query: ''
    })

    const filteredGames = computed(() => {
      if (!props.games) return []
      return props.games.filter(
        game =>
          (game.name.toLowerCase().indexOf(data.query.toLowerCase()) !== -1) ||
          (typeof game.description !== 'undefined' && game.description.toLowerCase().indexOf(data.query.toLowerCase()) !== -1)
      )
    })

    return {
      ...toRefs(data),
      filteredGames,
      toggle: () => { data.open = !data.open },
      handleDelete: (e: MouseEvent, el: Game) => emit('delete', e, el),
      handleAdd: () => emit('add')
    }
  },
  components: {
    NDrawer,
    NDrawerContent,
    NList,
    NListItem,
    NInput,
    NInputGroup,
    NSpace,
    NThing,
    NButton,
    NPopover,
    NPopconfirm,

    Search,
    Trash,
    Plus,
    Pen
  }
})
</script>
