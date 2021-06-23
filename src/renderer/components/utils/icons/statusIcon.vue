<template>
  <n-avatar class="statusIcon" size="28" :src="'../../../assets/images/icons/status/' + icon + '.png'" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NAvatar } from 'naive-ui'

export default defineComponent({
  props: ['icon'],
  components: {
    NAvatar
  }
})
</script>

<style lang="sass">
.statusIcon
  background-color: transparent !important
</style>
