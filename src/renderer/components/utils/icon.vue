<template>
  <n-badge dot :type="status" processing>
    <n-avatar size="small">
      <user-icon />
    </n-avatar>
  </n-badge>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NBadge, NAvatar } from 'naive-ui'
import userIcon from './icons/user.vue'

export default defineComponent({
  props: ['status'],
  components: {
    userIcon,
    NAvatar,
    NBadge
  }
})
</script>
