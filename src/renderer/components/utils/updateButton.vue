<template>
  <n-popover trigger="hover" placement="bottom">
    <template #trigger>
      <button v-if="canReload" @click="reloadApp">
        <n-text type="success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.17154 7.28839L7.75732 8.7026L11.9999 12.9453L16.2426 8.70263L14.8284 7.28842L12 10.1168L9.17154 7.28839Z" fill="currentColor" /><path d="M8.00001 14H16V16H8.00001V14Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M1 5C1 2.79086 2.79086 1 5 1H19C21.2091 1 23 2.79086 23 5V19C23 21.2091 21.2091 23 19 23H5C2.79086 23 1 21.2091 1 19V5ZM5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" fill="currentColor" /></svg>
        </n-text>
      </button>
      <button v-else-if="!updating" @click="checkForUpdate">
        <n-text :type="failed ? 'error' : 'default'">
          <svg :class="{ 'spin': checking }" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.56079 10.6418L6.35394 3.94971L8.25402 5.84979C11.7312 3.6588 16.3814 4.07764 19.41 7.1063L17.9958 8.52052C15.7536 6.27827 12.3686 5.87519 9.71551 7.31128L11.2529 8.84869L4.56079 10.6418Z" fill="currentColor" /><path d="M19.4392 13.3581L17.646 20.0502L15.7459 18.1501C12.2688 20.3411 7.61857 19.9223 4.58991 16.8936L6.00413 15.4794C8.24638 17.7217 11.6313 18.1247 14.2844 16.6887L12.747 15.1512L19.4392 13.3581Z" fill="currentColor" /></svg>
        </n-text>
      </button>
      <button v-else :style="{
        'display': 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'min-width': '15em',
        'column-gap': '.5em'
      }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" /><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" /></svg>
        <n-progress
          type="line"
          :status="getStatus"
          :percentage="percentage"
          :show-indicator="false"
          :processing="(percentage < 100) && !failed"
        />
      </button>
    </template>
    <span v-text="popoverText"></span>
  </n-popover>
</template>

<script>
import { defineComponent, h } from 'vue'
import { useIpc } from '../../hooks'
import { NPopover, NProgress, NText, useNotification, NIcon, NButton } from 'naive-ui'
import SoftwareDownload from '../utils/icons/softwareDownload.vue'

export default defineComponent({
  setup() {
    const notification = useNotification()

    return {
      sendUpdateNotification(version) {
        const date = new Date()
        function checkTime(i) {
          return (i < 10) ? '0' + i : i
        }

        const n = notification.create({
          title: 'Une mise à jour est disponible',
          description: `v${version}`,
          meta: `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}`,
          avatar: () => h(NIcon, {
            size: 32
          }, {
            default: () => h(SoftwareDownload)
          }),
          action: () =>
            h(
              NButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  this.reloadApp()
                  n.destroy()
                }
              },
              {
                default: () => 'Redemarrer maintenant'
              }
            )
        })
      }
    }
  },
  data() {
    return {
      checking: false,

      updating: false,

      updated: false,

      failed: false,

      canReload: false,

      percentage: 0
    }
  },
  mounted() {
    useIpc().on('update:checked', (e, data) => {
      console.log(data)
      this.checking = false
    })

    useIpc().on('update:downloaded', (e, data) => {
      console.log(data)
      this.updating = true
      this.percentage = 100
      this.sendUpdateNotification(data.info.version)

      setTimeout(() => {
        this.updating = false
        this.canReload = true
      }, 750)
    })

    useIpc().on('update:progress', (e, data) => {
      console.log(data)
      this.updating = true
      this.percentage = Math.ceil(data.percent)
    })

    useIpc().on('update:error', (e, data) => {
      console.error(data)
      this.failed = true
    })
  },
  methods: {
    checkForUpdate() {
      this.checking = true
      useIpc().send('update:check')
    },
    reloadApp() {
      useIpc().send('update:reload')
    }
  },
  computed: {
    popoverText() {
      if (this.canReload) {
        return "Mettre à jour l'application"
      } else if (this.failed) {
        return 'La mise à jour a échouée'
      } else if (this.updating) {
        return `mise à jour (${this.percentage}%)`
      } else {
        return 'Rechercher des mises a jour'
      }
    },
    getStatus() {
      if (this.failed) return 'error'
      else if (this.percentage === 100) return 'success'
      else return 'info'
    }
  },
  components: {
    NPopover,
    NProgress,
    NText
  }
})
</script>

<style lang="sass">
.spin
  animation: spin 1.5s linear infinite

@keyframes spin
  from
    transform: rotate(0deg)

  to
    transform: rotate(360deg)

</style>
