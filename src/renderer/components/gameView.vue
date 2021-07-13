<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      show-trigger
      native-scrollbar
      collapse-mode="width"
      :collapsed-width="64"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :options="asideMenu"
        v-model="activeKey"
        @update:value="handleUpdateValue"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header>
        <n-tabs
          v-model:value="tabValue"
          type="card"
          tab-style="min-width: 80px;"
          >
          <template #default v-if="save?.vues.length">
            <n-tab-pane v-for="gameVue in save.vues" :name="gameVue.title" :key="gameVue.id">
              <span></span>
            </n-tab-pane>
          </template>
          <template #suffix>
            <n-space justify="end">
              <n-button-group v-if="tabView && tabView?.type === 'webview'">
                <n-button type="primary" round :disabled="!navigation.back" @click="navGoBack">
                  <template #icon>
                    <arrow-left/>
                  </template>
                </n-button>
                <n-button type="primary" ghost :loading="navigation.loading" @click="navReload">
                  <template #icon>
                    <sync/>
                  </template>
                </n-button>
                <n-button type="primary" :disabled="!navigation.forward" @click="navGoForward">
                  <template #icon>
                    <arrow-right/>
                  </template>
                </n-button>
              </n-button-group>
              <n-popover position="bottom" trigger="hover">
                <template #trigger>
                  <n-button ghost type="default" @click="gameSettingsModalRef?.toggle()">
                    <template #icon>
                      <feed/>
                    </template>
                  </n-button>
                </template>
                <span>Paramètres</span>
              </n-popover>
              <n-popconfirm placement="bottom-end">
                <template #activator>
                  <n-button dashed type="default">
                    <template #icon>
                      <log-out/>
                    </template>
                  </n-button>
                </template>
                <template #action>
                  <n-button size="small" type="warning" ghost @click="$router.push('/games/')">Confirmer</n-button>
                </template>
                <template #default>
                  <p>
                    Vous êtes sur le point de quitter la partie<br/>
                    êtes-vous sûr ?
                  </p>
                </template>
              </n-popconfirm>
            </n-space>
          </template>
        </n-tabs>
      </n-layout-header>
      <main-view :vue="tabView" :save="save" @navigation="handleNav" @finished-loading="handleNavFinish"/>
      <n-layout-footer bordered position="absolute" style="bottom: 0">
        <dice-roller />
      </n-layout-footer>

      <game-settings-modal ref="gameSettingsModalRef" :save="save"
        @userAdd="userAddDrawerRef?.toggle()" @userDelete="handleUserDelete"
        @viewAdd="viewAddDrawerRef?.toggle()" @viewDelete="handleViewDelete"
      />
      <user-add-drawer ref="userAddDrawerRef" :save="save" @adding="handleAddUser"/>
      <view-add-drawer ref="viewAddDrawerRef" :save="save" @adding="handleAddView"/>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, h, reactive, ref, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
import { WebviewTag } from 'electron'
import { useService } from '../hooks'
import { Game, SheetItem, SheetItemGroup, GameUser, GameView } from '/@shared/games'

import {
  MenuOption,
  MenuProps,

  NLayout,
  NLayoutSider,
  NMenu,
  NIcon,
  NButton,
  NButtonGroup,
  NTabs,
  NTabPane,
  NLayoutHeader,
  NLayoutFooter,
  NSpace,
  NPopconfirm,
  NPopover
} from 'naive-ui'

import MainView from './navigation/main-view.vue'
import DiceRoller from './utils/diceRoller.vue'

import UserAddDrawer from './forms/userAddDrawer.vue'
import ViewAddDrawer from './forms/viewAddDrawer.vue'
import GameSettingsModal from './forms/gameSettingsModal.vue'

import Icon from './utils/icon.vue'
import StatusIcon from './utils/icons/statusIcon.vue'

import Feed from './utils/icons/feed.vue'
import Sync from './utils/icons/sync.vue'
import LogOut from './utils/icons/logOut.vue'
import UserAddIcon from './utils/icons/userAdd.vue'
import ArrowLeft from './utils/icons/arrowLeft.vue'
import ArrowRight from './utils/icons/arrowRight.vue'

const Store = useService('PersistentStore')

const renderIcon = (icon: any, color: string = '', data: any = null) => {
  return () => h(NIcon, { color: color }, { default: () => h(icon, data) })
}

const render = (element: any, data: any = null) => {
  return () => h(NIcon, null, { default: () => h(element, data) })
}

export default defineComponent({
  setup() {
    const route = useRoute()

    const save = ref(null as null|Game)
    const webview = ref(null as null|WebviewTag)
    const navigation = reactive({
      back: false,
      loading: true,
      forward: false
    })
    const data = reactive({
      activeKey: null,
      collapsed: true,
      loading: false,
      tabValue: '1'
    })

    const gameSettingsModalRef = ref(null as null | typeof GameSettingsModal)
    const userAddDrawerRef = ref(null as null | typeof UserAddDrawer)
    const viewAddDrawerRef = ref(null as null | typeof ViewAddDrawer)

    const tabView = computed((): (Game['vues'][0] | null) => save.value?.vues?.find(vue => vue.title === data.tabValue) || null)

    const reloadSave = () => {
      data.loading = true
      Store.getStoreValue('saved', 'games', null).then((games: null | Game[]) => {
        console.log('retrived result of', games, '\nWith params', route.params)

        if (games) save.value = games.find(game => game.id === Number(route.params.id)) || null
        data.loading = false
      })
    }

    const updateSave = () => {
      Store.getStoreValue('saved', 'games', null).then((games: null | Game[]) => {
        const toReturn = games ? [...games] : null

        if (toReturn && save.value) {
          toReturn[toReturn.findIndex(game => game.id === Number(route.params.id))] = JSON.parse(JSON.stringify(save.value))
          Store.setStoreValue('saved', 'games', toReturn)
        }
      })
    }

    reloadSave()

    return {
      ...toRefs(data),
      gameSettingsModalRef,
      userAddDrawerRef,
      viewAddDrawerRef,
      save,
      webview,
      navigation,
      reloadSave,
      updateSave,
      tabView
    }
  },
  methods: {
    handleUpdateValue(key: string, item: any) {
      if (key === 'addUser') this.userAddDrawerRef?.toggle()
    },
    handleUserDelete(e: MouseEvent, user: GameUser) {
      this.save?.users.splice(this.save.users.findIndex(e => e.id === user.id), 1)
      this.updateSave()
    },
    handleViewDelete(e: MouseEvent, view: GameView) {
      this.save?.vues.splice(this.save.vues.findIndex(e => e.id === view.id), 1)
      this.updateSave()
    },
    navGoBack() {
      console.log('going back')
      this.webview?.goBack()
    },
    navReload() {
      console.log('reloading')
      this.navigation.loading = true
      this.webview?.reload()
    },
    navGoForward() {
      console.log('going forward')
      this.webview?.goForward()
    },
    handleNav(NewVal: WebviewTag) {
      this.webview = NewVal
    },
    handleNavFinish(NewVal: any) {
      this.navigation = NewVal
    },
    loadInventory(inv: (SheetItem | SheetItemGroup)[] = [], userID: number, sheetID: number): MenuProps['options'] {
      return inv.map(item => {
        const itemData = {
          label: item.name,
          key: `id:${userID}-sheet:${sheetID}-item:${item.id}`,
          icon: renderIcon(StatusIcon, '', {
            icon: item.icon
          })
        }

        switch (item.type) {
          case 'group':
            return {
              ...itemData,
              children: this.loadInventory((item as SheetItemGroup).items, userID, sheetID)
            }
          case 'currency':
            return {
              ...itemData,
              extra: `${item.value}g`
            }
          default:
            return itemData
        }
      })
    },
    handleAddUser(data: GameUser) {
      this.save?.users.push({
        id: data.id,
        name: data.name,
        status: data.status,
        sheets: []
      })
      this.updateSave()
    },
    handleAddView(data: Game['vues'][0]) {
      this.save?.vues.push(data)
      this.updateSave()
    }
  },
  computed: {
    asideMenu() {
      const arr: MenuProps['options'] = []

      if (this.save && 'users' in this.save) {
        arr.push(
          ...this.save.users.map(user => {
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

            const userData: MenuOption = {
              label: user.name,
              key: `id:${user.id}`,
              icon: render(Icon, {
                status: status
              })
            }

            if (user.sheets.length) {
              userData.children = user.sheets.map(sheet => {
                return {
                  key: `id:${user.id}-sheet:${sheet.id}`,
                  label: sheet.name,
                  type: 'group',
                  children: [
                    {
                      key: `id:${user.id}-sheet:${sheet.id}-stats`,
                      label: 'Stats',
                      children: [
                        ...sheet.stats.map(stat => {
                          return {
                            label: stat.name,
                            key: `id:${user.id}-sheet:${sheet.id}-stat:${stat.id}`,
                            type: 'group'
                          }
                        })
                      ]
                    },
                    {
                      key: `id:${user.id}-sheet:${sheet.id}-inventory`,
                      label: 'Inventaire',
                      children: this.loadInventory(sheet.inventory, user.id, sheet.id)
                    },
                    {
                      key: `id:${user.id}-sheet:${sheet.id}-options`,
                      label: 'Options',
                      children: [
                        {
                          key: `id:${user.id}-sheet:${sheet.id}-modify`,
                          label: 'Modifier'
                        },
                        {
                          key: `id:${user.id}-sheet:${sheet.id}-save`,
                          label: 'Sauvegarder'
                        },
                        {
                          key: `id:${user.id}-sheet:${sheet.id}-delete`,
                          label: 'Supprimer'
                        }
                      ]
                    }
                  ]
                }
              })
            }

            return userData
          })
        )
      }

      arr.push({
        label: 'Ajouter un utilisateur',
        key: 'addUser',
        icon: renderIcon(UserAddIcon)
      })
      return arr
    }
  },
  components: {
    NLayout,
    NLayoutSider,
    NMenu,
    NButton,
    NButtonGroup,
    NTabs,
    NTabPane,
    NLayoutHeader,
    NLayoutFooter,
    NSpace,
    NPopconfirm,
    NPopover,

    MainView,
    DiceRoller,

    UserAddDrawer,
    ViewAddDrawer,
    GameSettingsModal,

    Sync,
    ArrowLeft,
    ArrowRight,
    Feed,
    LogOut
  }
})
</script>

<style lang="sass" scoped>

.container
  padding: 0
  max-width: 100vw
  flex-direction: column
  text-align: left
  align-items: stretch

.n-tab-pane
  padding: 0

.n-layout-scroll-container
  display: flex
  flex-direction: column

</style>
