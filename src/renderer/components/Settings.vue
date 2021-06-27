<template>
  <article class="container">
    <n-card>
      <n-tabs display-directive="show" type="bar" size="large" justify-content="space-evenly" style="height: 100%">
        <n-tab-pane name="general" tab="Générales">
          <n-result
            status="warning"
            title="Options générales"
            description="Cette section est encore en construction, revenez plus tard~~"
            style="margin-top: 5em"
          />
        </n-tab-pane>
        <n-tab-pane display-directive="show" name="look" tab="Apparence">
          <n-result
            status="warning"
            title="Options d'apparence"
            description="Cette section est encore en construction, revenez plus tard~~"
            style="margin-top: 5em"
          />
        </n-tab-pane>
        <n-tab-pane display-directive="show" name="about" tab="A propos" style="text-align: center; height: 100%">
          <about />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NTabs, NTabPane, NCard, NResult } from 'naive-ui'
import About from './About.vue'

export default defineComponent({
  components: {
    NResult,
    NTabs,
    NTabPane,
    NCard,
    About
  }
})
</script>

<style>

</style>
