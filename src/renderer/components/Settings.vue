<template>
  <n-tabs display-directive="if" size="large" justify-content="space-evenly" type="line">
    <n-tab-pane name="general" tab="Générales">
      <n-result
        status="warning"
        title="Options générales"
        description="Cette section est encore en construction, revenez plus tard~~"
        style="margin-top: 5em"
      />
    </n-tab-pane>
    <n-tab-pane name="look" tab="Apparence" style="padding: 0;">
      <look-settings />
    </n-tab-pane>
    <n-tab-pane name="about" tab="A propos" style="text-align: center;">
      <about />
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  NTabs,
  NTabPane,
  NResult
} from 'naive-ui'
import LookSettings from './LookSettings.vue'
import About from './About.vue'

export default defineComponent({
  components: {
    NResult,
    NTabs,
    NTabPane,
    LookSettings,
    About
  }
})
</script>

<style>

</style>
