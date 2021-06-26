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
            <n-button round type="primary" ghost @click="toggleAdd">
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
import { defineComponent } from 'vue'
import { NDrawer, NDrawerContent, NList, NListItem, NThing, NInput, NSpace, NButton, NPopover, NPopconfirm, NInputGroup } from 'naive-ui'
import { Game } from '/@shared/games'

import Search from '../utils/icons/search.vue'
import Trash from '../utils/icons/trash.vue'
import Pen from '../utils/icons/pen.vue'
import Plus from '../utils/icons/plus.vue'

export default defineComponent({
  props: {
    games: {
      type: Array as () => Game[],
      required: true
    }
  },
  data() {
    return {
      open: false,
      query: ''
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    handleDelete(event, element) {
      this.$emit('delete', event, element)
    },
    toggleAdd() {
      this.$emit('add')
    }
  },
  computed: {
    filteredGames(): Game[] {
      return this.games.filter(
        (game: Game) =>
          (game.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1) ||
          (typeof game.description !== 'undefined' && game.description.toLowerCase().indexOf(this.query.toLowerCase()) !== -1)
      )
    }
  },
  components: {
    NDrawer,
    NDrawerContent,
    NList,
    NListItem,
    NThing,
    NInput,
    NSpace,
    NPopover,
    NButton,
    NPopconfirm,
    NInputGroup,
    Search,
    Trash,
    Plus,
    Pen
  }
})
</script>
