<template>
  <main id="main-content" ref="main-content" style="position:relative;overflow-x:hidden">
    <div class="container">
      <router-view v-slot="{ Component }">
        <page-transition>
          <component :is="Component" :key="$route.path"/>
        </page-transition>
      </router-view>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NLoadingBarProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
import PageTransition from '/@/components/navigation/pageTransition.vue'

export default defineComponent({
  components: {
    NLoadingBarProvider,
    NMessageProvider,
    NNotificationProvider,
    PageTransition
  }
})
</script>

<style>

</style>
