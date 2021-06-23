<template>
  <n-grid :cols="3" style="height: 100%; text-align: left">
    <n-grid-item v-for="user in save.users" :key="user.id">
      <n-thing>
        <template #avatar>
          <icon style="margin: 1em" :status="userStatus(user)" />
        </template>
        <template #header>{{ user.name }}</template>
        <template #header-extra>
          <n-tag type="default">Tour 1</n-tag>
        </template>
        <template #description>
          Joue {{ user.sheets[0].name }}
        </template>

        <template #default>
        </template>

        <template #footer>
          footer
        </template>
        <template #action>
          actions
        </template>
      </n-thing>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NThing, NGrid, NGridItem, NTag } from 'naive-ui'
import Icon from './utils/icon.vue'

export default defineComponent({
  components: {
    NThing,
    NGrid,
    NGridItem,
    NTag,
    Icon
  },
  props: ['save'],
  methods: {
    userStatus(user: any) {
      let status = 'default'
      switch (user.status) {
        case 'active':
          status = 'success'
          break
        case 'offline':
          status = 'info'
          break
        case 'dnd':
          status = 'error'
          break
        case 'idle':
          status = 'warning'
          break
      }

      return status
    }
  }
})
</script>

<style lang="scss">
.n-thing {
  height: 100%;
  padding: 1em;
  background: linear-gradient(#232430, transparent, #232430), url('../assets/images/6b9e8aaf91df33931508a010bc9459b5.png');
  background-size: cover;
}

.n-thing-main {
  display: flex;
  flex-direction: column;
}

.n-thing-main__content {
  flex: 1
}
</style>
