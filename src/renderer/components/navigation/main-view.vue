<template>
  <n-spin :show="loading" style="height: calc(100% - 39px - 44px)">
    <webview v-if="vue.type === 'webview'" key="webview" :id="vue.id + '-webview'" :src="vue.url" style="height: 100%" webpreferences="enableremotemodule=no, contextisolation=yes"></webview>
    <heroic-view v-else-if="vue.type === 'heroic'" key="heroic" :save="save"/>
  </n-spin>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NSpin } from 'naive-ui'
import { WebviewTag } from 'electron'
import HeroicView from '../heroicView.vue'

export default defineComponent({
  props: ['vue', 'save'],
  data() {
    return {
      loading: false,
      webview: null as null|WebviewTag
    }
  },
  methods: {
    listenEvents(activeView: any) {
      if (activeView.type === 'webview') {
        this.webview = document.getElementById(`${activeView.id}-webview`) as WebviewTag
        console.log(this.webview)
        if (!this.webview) return
        this.$emit('navigation', this.webview)

        this.webview.addEventListener('did-start-loading', () => {
          this.loading = true
        })
        this.webview.addEventListener('did-stop-loading', () => {
          this.loading = false
          this.$emit('finished-loading', {
            back: this.webview?.canGoBack(),
            loading: false,
            forward: this.webview?.canGoForward()
          })
        })
      }
    }
  },
  watch: {
    vue: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal)
        if (!newVal) return
        this.$nextTick(() => {
          this.listenEvents(newVal)
        })
      }
    }
  },
  components: {
    NSpin,
    HeroicView
  }
})
</script>

<style lang="sass">

.n-spin-content
  height: 100%

.mode-fade-enter-active, .mode-fade-leave-active
  transition: opacity .5s ease

.mode-fade-enter-from, .mode-fade-leave-to
  opacity: 0

</style>
