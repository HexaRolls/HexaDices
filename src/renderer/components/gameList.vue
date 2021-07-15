<template>
  <article class="container">
    <n-layout position="relative">
      <n-layout-header position="absolute" style="top: 0;height: 4.5em;display: flex;justify-content: space-between;align-items: center;padding: 0 5vw">
        <h2>Liste des parties</h2>
        <n-space class="searchBarActions">
          <n-popover trigger="hover" placement="bottom">
            <template #trigger>
              <n-button size="large" circle @click="gameAddDrawerRef?.toggle()">
                <template #icon>
                  <plus />
                </template>
              </n-button>
            </template>
            <span>Ajouter une partie</span>
          </n-popover>
          <n-popover trigger="hover" placement="bottom-end">
            <template #trigger>
              <n-button size="large" circle @click="gameSearchDrawerRef?.toggle()">
                <template #icon>
                  <list-search />
                </template>
              </n-button>
            </template>
            <span>Rechercher une partie</span>
          </n-popover>
        </n-space>
      </n-layout-header>
      <n-layout-content position="absolute" style="top: 4.5em;" content-style="padding: 1em" :native-scrollbar="false">
        <n-space vertical v-if="games && games.length">
          <draggable
            :class="['game-list', { 'dragging': drag }]"
            tag="transition-group" item-key="id"
            :component-data="{
              tag: 'ul',
              type: 'transition-group',
              name: !drag ? 'flip-list' : null
            }"
            @start="drag = true" @end="drag = false" @change="updateArray"
            v-model="games" v-bind="dragOptions" :move="checkMove"
          >
            <template #item="{ element }">
              <li class="game-item">
                <article class="game-info" :class="{ 'fixed': element.fixed }" tabindex="0">
                  <header class="game-head">
                    <span class="game-id">{{ element.id }}</span>
                  </header>
                  <div class="game-body">
                    <h2>{{ element.name }}</h2>
                    <p>{{ element.description }}</p>
                    <div class="alt">
                      <i class="icon" :class="[ element.fixed ? 'gg-unblock' : 'gg-block' ]" @click="toggleFixed($event, element)"></i>
                    </div>
                  </div>
                  <ul class="game-options">
                    <li class="game-option" tabindex="0" @click="$router.push(`/play/${element.id}`)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z" fill="currentColor" /><path d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z" fill="currentColor" /></svg></li>
                    <n-popconfirm placement="bottom-end">
                      <template #activator>
                        <li class="game-option delete" tabindex="0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z" fill="currentColor" /><path d="M9 9H11V17H9V9Z" fill="currentColor" /><path d="M13 9H15V17H13V9Z" fill="currentColor" /></svg></li>
                      </template>
                      <template #action>
                        <n-button size="small" type="warning" ghost @click="handleDelete($event, element)">Oui, supprimez !</n-button>
                      </template>
                      <template #default>
                        <p>
                          Si vous supprimez cette sauvegarde,<br/>
                          vous ne pourrez plus la récupérer par la suite,<br/>
                          êtes-vous sûr ?
                        </p>
                      </template>
                    </n-popconfirm>
                  </ul>
                </article>
              </li>
            </template>
          </draggable>
        </n-space>
        <n-empty v-else class="game-list" description="Aucune partie disponible">
          <template #extra>
            <n-button @click="gameAddDrawerRef?.toggle()">Créez en une !</n-button>
          </template>
        </n-empty>
      </n-layout-content>
    </n-layout>

    <game-search-drawer ref="gameSearchDrawerRef" :games="games" @add="gameAddDrawerRef?.toggle()" @delete="handleDelete" />
    <game-add-drawer ref="gameAddDrawerRef" :games="games" @adding="handleAdd"/>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { useService } from '../hooks'
import { Game } from '/@shared/games'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NPopconfirm,
  NButton,
  NEmpty,
  NPopover,
  NSpace
} from 'naive-ui'

import draggable from 'vuedraggable/src/vuedraggable'

import GameSearchDrawer from './forms/gameSearchDrawer.vue'
import GameAddDrawer from './forms/gameAddDrawer.vue'

import Plus from './utils/icons/plus.vue'
import ListSearch from './utils/icons/listSearch.vue'

const Store = useService('PersistentStore')

export default defineComponent({
  setup() {
    const games = ref(null as null|Game[])
    const data = reactive({
      drag: false,
      search: '',
      adding: true
    })

    const group: keyof Game = 'id'
    const dragOptions = reactive({
      group,
      animation: 200,
      disabled: false,
      ghostClass: 'ghost'
    })

    const gameSearchDrawerRef = ref(null as null | typeof GameSearchDrawer)
    const gameAddDrawerRef = ref(null as null | typeof GameAddDrawer)

    const updateGames = () => {
      if (games.value) {
        Store.setStoreValue('saved', 'games', JSON.parse(JSON.stringify(games.value)))
      }
    }

    const getGames = () => {
      Store.getStoreValue('saved', 'games', null).then((gamesList: null|Game[]) => {
        if (gamesList) games.value = gamesList
        else {
          games.value = []
          updateGames()
        }
      })
    }

    getGames()

    return {
      ...toRefs(data),
      games,
      updateGames,
      getGames,
      dragOptions,
      filtered: computed(() => games.value?.filter(game => game.name.toLowerCase().indexOf(data.search.toLowerCase()))),
      gameSearchDrawerRef,
      gameAddDrawerRef
    }
  },
  methods: {
    updateArray(updaded: any = {}) {
      if ('added' in updaded) {
        console.log('Added', updaded.added.element, `to ${updaded.added.newIndex}`)
      } else if ('removed' in updaded) {
        console.log('Deleted', updaded.removed.element, `from ${updaded.removed.oldIndex}`)
      } else if ('moved' in updaded) {
        console.log('Moved', updaded.moved.element, `from ${updaded.moved.oldIndex} to ${updaded.moved.newIndex}`)
      }
      this.updateGames()
    },
    checkMove(e: any) {
      if (e.draggedContext.element?.fixed) return false
    },
    handleDelete(event: MouseEvent, element: Game) {
      if (!this.games) return

      this.games.splice(this.games.findIndex(e => e.name === element.name), 1)
      this.updateGames()
    },
    handleAdd(data: Game) {
      if (!this.games) return

      this.games.push({
        id: data.id,
        name: data.name,
        description: data.description,
        users: [{
          id: 0,
          name: 'Maître de jeu',
          status: 'active',
          sheets: []
        }],
        vues: []
      })
      this.updateArray()
    },
    toggleFixed(event: MouseEvent, element: any) {
      element.fixed = !element.fixed
      this.updateGames()
    }
  },
  components: {
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NPopconfirm,
    NButton,
    GameAddDrawer,
    GameSearchDrawer,
    NEmpty,
    NPopover,
    NSpace,

    draggable,

    Plus,
    ListSearch
  }
})
</script>

<style lang="sass">

.game-list
  width: 100%
  padding: 3em 0
  list-style: none
  display: flex
  align-items: center
  flex-direction: column
  flex: 1
  row-gap: 1em

  &:not(.dragging) :is(.game-info:hover, .game-info:focus-within)

    &:not(.fixed)
      outline: none
      transform: translate(5px, -5px)
      box-shadow: -5px 5px 0 rgba(0, 0, 0, .25)

    .game-options
      transform: translate(15%, -50%)
      opacity: 1

.game-item
  position: relative
  width: clamp(75%, 37.5em, 90%)

.game-info
  display: flex
  border-radius: 5em
  background-color: rgba(0, 0, 0, .45)
  column-gap: 1em
  justify-content: stretch
  align-items: center
  cursor: pointer

  transition: box-shadow .15s ease, transform .15s ease

  .game-id
    box-sizing: content-box
    display: flex
    justify-content: center
    align-items: center
    height: 2em
    object-fit: contain
    border: solid 1em #232430
    padding: 0 .1em
    border-radius: 5em
    background-color: rgba(0, 0, 0, .35)
    aspect-ratio: 1 / 1

  .game-body
    display: flex
    flex: 1
    align-items: center
    column-gap: 1em
    user-select: none
    white-space: nowrap
    overflow: hidden

    .alt
      display: grid
      align-items: center
      margin-left: auto
      border-radius: 50%
      padding: .35em
      margin-right: 1.5em
      transition: background-color .15s ease, color .15s ease

      &:hover, &:focus
        background-color: #BFC9D4
        color: #232430

  .game-options
    top: 0
    right: 0
    list-style: none
    position: absolute
    display: flex
    align-items: center
    justify-content: center
    opacity: 0
    background-color: #181921
    box-shadow: -5px 5px 0 rgba(0, 0, 0, .25)
    transform: translate(0%, -50%)
    border-radius: .5em
    transition: opacity .25s ease, transform .2s ease

    .game-option
      padding: .5em
      border-radius: .5em
      display: grid
      align-items: center

      &.delete
        color: #FF446D

      &:hover, &:focus-within
        outline: none
        background-color: rgba(0, 0, 0, .25)

.flip-list-move
  transition: all .5s

.flip-list-enter, .flip-list-leave-to
  transition: all .5s
  opacity: 0
  transform: translateX(10px)

.no-move
  transition: all 0s

.ghost
  opacity: 0.5

.gg-block
  box-sizing: border-box
  position: relative
  display: block
  transform: scale(var(--ggs,1))
  width: 18px
  height: 18px
  border: 2px solid
  border-radius: 100%

.gg-block::before
  content: ""
  display: block
  box-sizing: border-box
  position: absolute
  width: 10px
  height: 2px
  background: currentColor
  border-radius: 5px
  transform: rotate(-45deg)
  top: 6px
  left: 2px

.gg-unblock
  box-sizing: border-box
  position: relative
  display: block
  transform: rotate(45deg) scale(var(--ggs,1))
  width: 18px
  height: 18px
  border: 2px solid
  border-radius: 100%

.gg-unblock::after,
.gg-unblock::before
  content: ""
  display: block
  box-sizing: border-box
  position: absolute
  width: 2px
  height: 7px
  background: currentColor
  border-radius: 5px
  left: 6px

.gg-unblock::before
  top: -2px

.gg-unblock::after
  bottom: -2px

</style>
