<template>
  <header id="window-bar" :class="{ 'maximized': isMaximized }">
    <div id="drag-region" :class="{ 'isMac': platform === 'darwin' }">
      <div id="window-title">
        <span class="appTitle">HexaDices {{ $route.name ? `- ${String($route.name)}` : null }}</span>
        <div id="window-buttons">
          <n-popover trigger="hover" placement="bottom">
            <template #trigger>
              <button @click="$router.push('/')" :disabled="$route.path === '/'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 8.77217L14.0208 1.79299C12.8492 0.621414 10.9497 0.621413 9.77817 1.79299L3 8.57116V23.0858H10V17.0858C10 15.9812 10.8954 15.0858 12 15.0858C13.1046 15.0858 14 15.9812 14 17.0858V23.0858H21V8.77217ZM11.1924 3.2072L5 9.39959V21.0858H8V17.0858C8 14.8767 9.79086 13.0858 12 13.0858C14.2091 13.0858 16 14.8767 16 17.0858V21.0858H19V9.6006L12.6066 3.2072C12.2161 2.81668 11.5829 2.81668 11.1924 3.2072Z" fill="currentColor" /></svg>
              </button>
            </template>
            <span>Accueil</span>
          </n-popover>
          <n-popover trigger="hover" placement="bottom">
            <template #trigger>
              <button @click="$router.push('/games/')" :disabled="$route.path === '/games/'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 7H7V9H9V7Z" fill="currentColor" /><path d="M7 13V11H9V13H7Z" fill="currentColor" /><path d="M7 15V17H9V15H7Z" fill="currentColor" /><path d="M11 15V17H17V15H11Z" fill="currentColor" /><path d="M17 13V11H11V13H17Z" fill="currentColor" /><path d="M17 7V9H11V7H17Z" fill="currentColor" /></svg>
              </button>
            </template>
            <span>Mes parties</span>
          </n-popover>
          <n-popover trigger="hover" placement="bottom">
            <template #trigger>
              <button @click="$router.push('/bugReport')" :disabled="$route.path === '/bugReport'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H11C10.4477 12 10 11.5523 10 11Z" fill="currentColor" /><path d="M11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16H13C13.5523 16 14 15.5523 14 15C14 14.4477 13.5523 14 13 14H11Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M9.09447 4.74918C8.41606 4.03243 8 3.0648 8 2H10C10 3.10457 10.8954 4 12 4C13.1046 4 14 3.10457 14 2H16C16 3.0648 15.5839 4.03243 14.9055 4.74918C16.1782 5.45491 17.1673 6.6099 17.6586 8H19C19.5523 8 20 8.44772 20 9C20 9.55229 19.5523 10 19 10H18V12H19C19.5523 12 20 12.4477 20 13C20 13.5523 19.5523 14 19 14H18V16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H17.6586C16.8349 20.3304 14.6124 22 12 22C9.38756 22 7.16508 20.3304 6.34141 18H5C4.44772 18 4 17.5523 4 17C4 16.4477 4.44772 16 5 16H6V14H5C4.44772 14 4 13.5523 4 13C4 12.4477 4.44772 12 5 12H6V10H5C4.44772 10 4 9.55229 4 9C4 8.44772 4.44772 8 5 8H6.34141C6.83274 6.6099 7.82181 5.45491 9.09447 4.74918ZM8 16V10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16Z" fill="currentColor" /></svg>
              </button>
            </template>
            <span>Report un bug</span>
          </n-popover>
          <update-button />
        </div>
      </div>

      <div id="window-controls">

        <div class="button" id="min-button" @click="minimize">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" draggable="false"><path d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z" fill="currentColor" /></svg>
        </div>

        <div class="button" id="max-button" @click="toggleMaximize">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" draggable="false"><path d="M3 3H9V5H5V9H3V3Z" fill="currentColor" /><path d="M3 21H9V19H5V15H3V21Z" fill="currentColor" /><path d="M15 21H21V15H19V19H15V21Z" fill="currentColor" /><path d="M21 3H15V5H19V9H21V3Z" fill="currentColor" /></svg>
        </div>

        <div class="button" id="restore-button" @click="toggleMaximize">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" draggable="false"><path d="M9 9H3V7H7V3H9V9Z" fill="currentColor" /><path d="M9 15H3V17H7V21H9V15Z" fill="currentColor" /><path d="M21 15H15V21H17V17H21V15Z" fill="currentColor" /><path d="M15 9.00012H21V7.00012H17V3.00012H15V9.00012Z" fill="currentColor" /></svg>
        </div>

        <div class="button" id="close-button" @click="close">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" draggable="false"><path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" /></svg>
        </div>

      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useService, useIpc } from '../../hooks'
import { NPopover } from 'naive-ui'
import UpdateButton from '../utils/updateButton.vue'

const win = useService('WindowsControl')

export default defineComponent({
  setup() {
    const { getBasicInformation } = useService('BaseService')
    const ipc = useIpc()
    const isMaximized = ref(false)
    const osPlatform = ref(null as null|NodeJS.Platform)
    getBasicInformation().then(({ platform }) => {
      osPlatform.value = platform
    })

    const maximize = reactive({
      on: () => {
        isMaximized.value = true
      },
      off: () => {
        isMaximized.value = false
      }
    })

    ipc.on('maximize', maximize.on)
    ipc.on('minimize', maximize.off)

    return {
      platform: osPlatform,
      isMaximized,
      maximize
    }
  },
  beforeUnmount() {
    const ipc = useIpc()

    ipc.off('maximize', this.maximize.on)
    ipc.off('minimize', this.maximize.off)
  },
  methods: {
    minimize() {
      win.minimize()
    },
    toggleMaximize() {
      win.toggle()
    },
    close() {
      win.close()
    },
    checkForUpdate() {
      useIpc().send('update:check')
    }
  },
  components: {
    NPopover,
    UpdateButton
  }
})
</script>

<style lang="sass">

#window-bar
  display: block
  position: fixed
  height: 32px
  width: 100%
  background: #13131A
  max-width: calc(100vw - 2px)
  z-index: 99999

  #drag-region
    width: 100%
    height: 100%
    display: grid
    grid-template-columns: auto 138px
    -webkit-app-region: drag

    &.isMac
      grid-template-columns: 138px auto

      #window-title
        grid-column: 2
        justify-content: center

        .appTitle
          flex: unset

      #window-buttons
        width: auto

      #window-controls
          display: none

    #window-controls
      -webkit-app-region: no-drag
      display: grid
      grid-template-columns: repeat(3, 46px)
      position: absolute
      top: 0
      right: 0
      height: 100%

      .button
        user-select: none
        grid-row: 1 / span 1
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 100%
        color: #fff

        &:hover
          background: rgba(255,255,255,0.1)

        &:active
          background: rgba(255,255,255,0.2)

#min-button
  grid-column: 1

#max-button, #restore-button
  grid-column: 2

#restore-button
  display: none !important

#close-button
  grid-column: 3

  &:hover
    background: #E81123 !important

  &:active
    background: #F1707A !important

    .icon
      filter: invert(1)

@media (-webkit-device-pixel-ratio: 1.5), (device-pixel-ratio: 1.5), (-webkit-device-pixel-ratio: 2), (device-pixel-ratio: 2), (-webkit-device-pixel-ratio: 3), (device-pixel-ratio: 3)
  #window-controls .icon
    width: 10px
    height: 10px

#window-title
  grid-column: 1
  display: flex
  align-items: center
  overflow: hidden
  font-family: "Baumans", sans-serif
  font-size: 20px

  .appTitle
    flex: 1 0 auto
    margin: 0 8px

  #window-buttons
    width: 100%
    height: 100%
    display: flex
    align-items: stretch

    button
      padding: 0 8px
      -webkit-app-region: no-drag
      border: 0
      background-color: unset
      color: #BFC9D4
      flex: 0 0 auto
      &:disabled
        -webkit-app-region: drag
        opacity: .5
        color: #A8B6C5

      &:is(&:hover, &:focus):not(&:disabled)
        background-color: rgba(0, 0, 0, .5)

  .appTitle
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    line-height: 1.5

header.maximized
  width: 100%
  padding: 0

  #window-title
    margin-left: 12px

  #restore-button
    display: flex !important

  #max-button
    display: none !important

</style>
