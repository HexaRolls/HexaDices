<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="Paramètres de partie"
    style="width: 75%"
    :bordered="false"
    size="huge"
    :segmented="{
      content: 'hard',
      footer: 'soft'
    }"
  >
    <n-tabs display-directive="show" type="bar" size="large" justify-content="space-evenly" style="height: 100%">
      <n-tab-pane display-directive="show" name="users" tab="Utilisateurs">
        <n-list>
          <template #header>
            <n-input-group>
              <n-input v-model:value="query" type="input" round :placeholder="save.users[0]?.name || ''">
                <template #suffix>
                  <search />
                </template>
              </n-input>
              <n-popover trigger="hover" placement="bottom-end">
                <template #trigger>
                  <n-button round type="primary" ghost @click="handleUserAdd">
                    <template #icon>
                        <plus />
                      </template>
                  </n-button>
                </template>
                <span>Ajouter un utilisateur</span>
              </n-popover>
            </n-input-group>
          </template>

          <n-list-item v-for="user in filteredUser" :key="user.id">
            <n-thing>
              <template #avatar>
                <icon :status="getStatus(user)"/>
              </template>
              <template #header>
                {{ user.name }}
              </template>
              <template #description v-if="user.sheets.length">
                Joue {{ user.sheets[0].name }}
              </template>
            </n-thing>
            <template #suffix>
              <n-space :wrap="false">
                <n-popover trigger="hover" placement="left">
                  <template #trigger>
                    <n-button round>
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
                    <n-button size="small" type="warning" ghost @click="handleUserDelete($event, user)">Oui, supprimez !</n-button>
                  </template>
                  <template #default>
                    <p style="text-align: left">
                      Si vous supprimez cette utilisateur,<br/>
                      vous ne pourrez plus le récupérer par la suite,<br/>
                      êtes-vous sûr ?
                    </p>
                  </template>
                </n-popconfirm>
              </n-space>
            </template>
          </n-list-item>
        </n-list>
      </n-tab-pane>
    </n-tabs>

    <!-- <template #footer>
      Footer
    </template> -->
  </n-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NModal, NTabs, NTabPane, NButton, NList, NListItem, NThing, NPopover, NPopconfirm, NSpace, NInputGroup, NInput } from 'naive-ui'
import { Game, GameUser, GameView } from '/@shared/games'
import icon from '../utils/icon.vue'

import Search from '../utils/icons/search.vue'
import Trash from '../utils/icons/trash.vue'
import Pen from '../utils/icons/pen.vue'
import Plus from '../utils/icons/plus.vue'

export default defineComponent({
  props: {
    save: {
      type: Object as () => Game,
      required: false,
      default: null
    }
  },
  data() {
    return {
      show: false,
      query: ''
    }
  },
  methods: {
    toggle() {
      console.log('Toggle modal')
      this.show = !this.show
    },
    handleUserAdd() {
      this.$emit('userAdd')
    },
    handleVueAdd() {
      this.$emit('vueAdd')
    },
    handleUserDelete(event: any, user: GameUser) {
      this.$emit('userDelete', event, user)
    },
    handleVueDelete(event: any, vue: GameView) {
      this.$emit('vueDelete', event, vue)
    },
    getStatus(user: GameUser) {
      let status = 'default'
      switch (user.status) {
        case 'active':
          status = 'success'
          break
        case 'offline':
          status = 'info'
          break
        case 'dnd':
          status = 'error'
          break
        case 'idle':
          status = 'warning'
          break
      }

      return status
    }
  },
  computed: {
    filteredUser(): GameUser[] {
      return this.save.users.filter(
        (user: GameUser) => (user?.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1)
      )
    },
    filteredVues(): GameView[] {
      return this.save.vues.filter(
        (vue: GameView) => (vue?.title.toLowerCase().indexOf(this.query.toLowerCase()) !== -1)
      )
    }
  },
  components: {
    NModal,
    NTabs,
    NTabPane,
    NButton,
    NList,
    NListItem,
    NThing,
    icon,
    Search,
    Pen,
    Trash,
    Plus,
    NPopover,
    NPopconfirm,
    NInputGroup,
    NInput,
    NSpace
  }
})
</script>
