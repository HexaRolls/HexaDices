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
          <n-tab-pane v-for="tabPanel in save?.vues" :name="tabPanel.title" :key="tabPanel.id">
            <span></span>
          </n-tab-pane>
          <template #suffix>
            <n-space justify="end">
              <n-button-group v-if="tabView?.type === 'webview'">
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
                  <n-button ghost type="default" @click="$refs.gameSettingsModal.toggle()">
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
      <!-- <n-button :loading="loading" @click="reloadSave">
        <template #icon>
          <sync />
        </template>
        Reload Save
      </n-button>
      <n-button @click="callForServer">
        Look for webserver
      </n-button>
      <n-button @click="startServer">
        Start server
      </n-button>
      <n-button @click="stopServer">
        Stop server
      </n-button> -->

      <game-settings-modal ref="gameSettingsModal" :save="save"
        @userAdd="$refs.addUserDrawer.toggle()" @userDelete="handleUserDelete"
        @viewAdd="$refs.viewAddDrawer.toggle()" @viewDelete="handleViewDelete"
      />
      <user-add-drawer ref="addUserDrawer" :save="save" @adding="handleAddUser"/>
      <view-add-drawer ref="viewAddDrawer" :save="save" @adding="handleAddView"/>
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import {
  NLayout, NLayoutSider, NMenu, NIcon, MenuProps, NButton, NTabs, NTabPane,
  NLayoutHeader, NLayoutFooter, NSpace, NButtonGroup, NPopconfirm, NPopover,
  MenuOption
} from 'naive-ui'
import userIcon from './utils/icons/user.vue'
import userAddIcon from './utils/icons/userAdd.vue'
import icon from './utils/icon.vue'
import statusIcon from './utils/icons/statusIcon.vue'
import { useService, useIpc } from '../hooks'
import { Game, SheetItem, SheetItemGroup, GameUser, GameView } from '/@shared/games'
import Sync from './utils/icons/sync.vue'
import MainView from './navigation/main-view.vue'
import { WebviewTag } from 'electron'
import ArrowLeft from './utils/icons/arrowLeft.vue'
import ArrowRight from './utils/icons/arrowRight.vue'
import Feed from './utils/icons/feed.vue'
import LogOut from './utils/icons/logOut.vue'
import UserAddDrawer from './forms/userAddDrawer.vue'
import ViewAddDrawer from './forms/viewAddDrawer.vue'
import gameSettingsModal from './forms/gameSettingsModal.vue'
import DiceRoller from './utils/diceRoller.vue'
const Store = useService('PersistentStore')

function renderIcon(icon: any, color: string = '', data: any = null) {
  return () => h(NIcon, { color: color }, { default: () => h(icon, data) })
}

function render(element: any, data: any = null) {
  return () => h(NIcon, null, { default: () => h(element, data) })
}

const menuOptions: MenuProps['options'] = [
  {
    label: 'Astroalex',
    key: 'id:1',
    icon: render(icon),
    children: [
      {
        type: 'group',
        label: 'Altaïr Orélion',
        key: 'id:1-sheet:1',
        children: [
          {
            label: 'Stats',
            key: 'id:1-sheet:1-stats'
          },
          {
            label: 'Inventaire',
            key: 'id:1-sheet:1-inventory',
            children: [
              {
                label: 'Argent',
                extra: '12g',
                key: 'id:1-sheet:1-money'
              }
            ]
          },
          {
            label: 'Options',
            key: 'id:1-sheet:1-settings',
            children: [
              {
                label: 'Modifier',
                key: 'id:1-sheet:1-modify'
              },
              {
                label: 'Sauvegarder',
                key: 'id:1-sheet:1-save'
              },
              {
                label: 'Supprimer',
                key: 'id:1-sheet:1-delete'
              }
            ]
          }
        ]
      },
      {
        type: 'group',
        label: 'PNJ n°3',
        key: 'id:1-sheet:2',
        children: [
          {
            label: 'Stats',
            key: 'id:1-sheet:2-stats'
          },
          {
            label: 'Inventaire',
            key: 'id:1-sheet:2-inventory',
            children: [
              {
                label: 'Argent',
                extra: '12g',
                key: 'id:1-sheet:2-money'
              }
            ]
          },
          {
            label: 'Options',
            key: 'id:1-sheet:2-settings',
            children: [
              {
                label: 'Modifier',
                key: 'id:1-sheet:2-modify'
              },
              {
                label: 'Sauvegarder',
                key: 'id:1-sheet:2-save'
              },
              {
                label: 'Supprimer',
                key: 'id:1-sheet:2-delete'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Azura',
    key: 'id:2',
    icon: renderIcon(userIcon),
    children: [
      {
        type: 'group',
        label: 'Azura Orélion',
        key: 'id:2-sheet:1',
        children: [
          {
            label: 'Stats',
            key: 'id:2-sheet:1-stats'
          },
          {
            label: 'Inventaire',
            key: 'id:2-sheet:1-inventory',
            children: [
              {
                label: 'Argent',
                extra: '150g',
                key: 'id:2-sheet:1-money'
              }
            ]
          },
          {
            label: 'Options',
            key: 'id:2-sheet:1-settings',
            children: [
              {
                label: 'Modifier',
                key: 'id:2-sheet:1-modify'
              },
              {
                label: 'Sauvegarder',
                key: 'id:2-sheet:1-save'
              },
              {
                label: 'Supprimer',
                key: 'id:2-sheet:1-delete'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Ajouter un utilisateur',
    key: 'addUser',
    icon: renderIcon(userAddIcon)
  }
]

export default defineComponent({
  data() {
    return {
      activeKey: null,
      collapsed: true,
      save: null as null|Game,
      menuOptions,
      loading: false,
      tabValue: 1,
      webview: null as null|WebviewTag,
      navigation: {
        back: false,
        loading: true,
        forward: false
      }
    }
  },
  mounted() {
    this.reloadSave()
  },
  methods: {
    async reloadSave() {
      this.loading = true
      const data: Game[] = await Store.getStoreValue('saved', 'games', null)
      console.log('retrived result of', data, '\nWith params', this.$route.params)
      if (data) this.save = data.find(game => game.id === Number(this.$route.params?.id)) || null
      this.loading = false
    },
    async updateSave() {
      const data: Game[] = await Store.getStoreValue('saved', 'games', null)
      if (data && this.save) {
        data[data.findIndex(game => game.id === Number(this.$route.params?.id))] = JSON.parse(JSON.stringify(this.save))
        Store.setStoreValue('saved', 'games', data)
      }
    },
    handleUpdateValue(key, item) {
      if (key === 'addUser') this.$refs.addUserDrawer.toggle()
    },
    handleUserDelete(event: MouseEvent, user: GameUser) {
      this.save?.users.splice(this.save.users.findIndex(e => e.id === user.id), 1)
      this.updateSave()
    },
    handleViewDelete(event: MouseEvent, view: GameView) {
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
    callForServer() {
      useIpc().on('host:found', (e, service: any) => {
        console.log('service found:', service)
      })

      useIpc().send('host:search')
    },
    startServer() {
      useIpc().on('host:started', (e, service: any) => {
        console.log('service started:', service)
      })

      useIpc().send('host:start')
    },
    stopServer() {
      useIpc().on('host:stopped', () => {
        console.log('service stopped')
      })

      useIpc().send('host:stop')
    },
    loadInventory(inv: (SheetItem | SheetItemGroup)[] = [], userID: number, sheetID: number): MenuProps['options'] {
      return inv.map(item => {
        const itemData = {
          label: item.name,
          key: `id:${userID}-sheet:${sheetID}-item:${item.id}`,
          icon: renderIcon(statusIcon, '', {
            icon: item.icon
          })
        }

        switch (item.type) {
          case 'group':
            return {
              ...itemData,
              children: this.loadInventory(item.items, userID, sheetID)
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
              icon: render(icon, {
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
        icon: renderIcon(userAddIcon)
      })
      return arr
    },
    tabView() {
      return this.save?.vues?.find(vue => vue.title === this.tabValue) || {}
    }
  },
  components: {
    NLayout,
    NLayoutSider,
    NMenu,
    NButton,
    Sync,
    MainView,
    NTabs,
    NTabPane,
    NLayoutHeader,
    NLayoutFooter,
    NSpace,
    NButtonGroup,
    ArrowLeft,
    ArrowRight,
    Feed,
    LogOut,
    NPopconfirm,
    NPopover,
    DiceRoller,
    UserAddDrawer,
    ViewAddDrawer,
    gameSettingsModal
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
