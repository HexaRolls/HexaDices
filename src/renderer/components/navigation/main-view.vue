<template>
  <n-spin v-if="vue" :show="loading" style="height: calc(100% - 39px - 44px)">
    <webview v-if="vue.type === 'webview'" key="webview" :id="vue.id + '-webview'" :src="vue.url" style="height: 100%" webpreferences="enableremotemodule=no, contextisolation=yes"/>
    <heroic-view v-else-if="vue.type === 'heroic'" key="heroic" :save="save"/>
  </n-spin>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { WebviewTag } from 'electron'
import { Game } from '/@shared/games'

import { NSpin } from 'naive-ui'

import HeroicView from '../heroicView.vue'

export default defineComponent({
  props: {
    vue: {
      type: Object as PropType<Game['vues'][0]>,
      default: null,
      required: false
    },
    save: {
      type: Object as PropType<Game>,
      default: null,
      required: false
    }
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const webview = ref(null as null|WebviewTag)

    const onViewChange = (activeView: Game['vues'][0] | null) => {
      if (!activeView) return

      if (activeView.type === 'webview') {
        webview.value = document.getElementById(`${activeView.id}-webview`) as WebviewTag
        if (!webview.value) return

        emit('navigation', webview.value)

        webview.value.addEventListener('did-start-loading', () => {
          loading.value = true
        })
        webview.value.addEventListener('did-stop-loading', () => {
          if (!webview.value) return

          loading.value = false
          emit('finished-loading', {
            back: webview.value.canGoBack(),
            loading: false,
            forward: webview.value.canGoForward()
          })
        })
      } else {
        loading.value = false
      }
    }

    return {
      loading,
      webview,
      onViewChange
    }
  },
  watch: {
    vue: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return

        this.$nextTick(() => {
          this.onViewChange(newVal)
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

</style>
