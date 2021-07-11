<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="mergeConfig(config.defaults.naiveUi, config.naiveUi)">
    <n-global-style />

    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <title-bar />
          <main-navigation />
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang=ts>
import { defineComponent } from 'vue'
import { NConfigProvider, darkTheme, NGlobalStyle, NLoadingBarProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
import { useGlobalConfig } from './hooks'
import { merge } from 'lodash-es'

import TitleBar from '/@/components/navigation/TitleBar.vue'
import MainNavigation from '/@/components/MainNavigation.vue'

export default defineComponent({
  setup() {
    const globalConfig = useGlobalConfig()

    return {
      config: globalConfig.config,
      darkTheme,
      mergeConfig: (object: any, ...args: any[]) => {
        return merge({}, object, ...args)
      }
    }
  },
  mounted() {
    this.$router.push('/')
  },
  components: {
    TitleBar,
    NConfigProvider,
    NGlobalStyle,
    NLoadingBarProvider,
    NMessageProvider,
    NNotificationProvider,
    MainNavigation
  }
})
</script>

<style>

.box {
  position: relative;
  overflow: hidden;
  max-width: 100vw;
  display: flex;
  flex: 1;
}

</style>
