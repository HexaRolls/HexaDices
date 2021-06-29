<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
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
import TitleBar from '/@/components/navigation/TitleBar.vue'
import MainNavigation from '/@/components/MainNavigation.vue'

const themeOverrides: import('naive-ui').GlobalThemeOverrides = {
  common: {
    fontFamily: "'Nunito', Helvetica, Arial, sans-serif",

    primaryColor: '#2BB3F0',
    primaryColorHover: '#5ED1F6',
    primaryColorPressed: '#1F8CCE',
    primaryColorSuppl: '#156AAC',

    infoColor: '#6C83F7',
    infoColorHover: '#90A3FA',
    infoColorPressed: '#4E62D4',
    infoColorSuppl: '#3646B1',

    successColor: '#4BC145',
    successColorHover: '#7ED970',
    successColorPressed: '#32A536',
    successColorSuppl: '#228A2F',

    warningColor: '#FFC30F',
    warningColorHover: '#FFD64B',
    warningColorPressed: '#DBA10A',
    warningColorSuppl: '#B78207',

    errorColor: '#FF446D',
    errorColorHover: '#FF7284',
    errorColorPressed: '#DB3167',
    errorColorSuppl: '#B7225F',

    baseColor: '#232430',
    bodyColor: '#232430',

    modalColor: '#1E1E29',

    cardColor: '#181921',
    tableColor: '#181921',
    popoverColor: '#181921',

    textColorBase: '#BFC9D4',

    avatarColor: '#13131A'
  }
}

export default defineComponent({
  components: {
    TitleBar,
    NConfigProvider,
    NGlobalStyle,
    NLoadingBarProvider,
    NMessageProvider,
    NNotificationProvider,
    MainNavigation
  },
  data() {
    return {
      themeOverrides: themeOverrides,
      darkTheme: darkTheme
    }
  },
  mounted() {
    this.$router.push('/')
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
