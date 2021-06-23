<template>
  <router-link class="mainMenuButton" replace :to="to" :style="{ '--area': area, '--color': `linear-gradient(110deg, ${color || '#181921'} 35%, transparent)` }">
    <div class="content">
      <h2 v-text="title"></h2>
      <p v-text="description"></p>
    </div>
    <img :src="src" :alt="title">
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    area: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default() {
        return '#181921'
      }
    },
    src: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="sass">

.mainMenuButton
  position: relative
  width: 100%
  height: 100%
  background-color: #fff
  grid-area: var(--area)
  border-radius: .5em
  text-decoration: none
  color: rgba(255, 255, 255, .5)
  overflow: hidden
  background-color: #232430

  .content
    z-index: 1
    position: absolute
    height: 100%
    width: 100%
    padding: 1em
    display: flex
    flex-direction: column
    justify-content: start
    align-items: start
    overflow: hidden
    background-image: var(--color)

  img
    z-index: -1
    height: 100%
    float: right
    transition: transform .15s cubic-bezier(.3, .6, .75, 1.3), color .2s ease

  &:hover
    color: rgba(255, 255, 255, 1)

    img
      transform: scale(125%)

  p
    padding-left: .75em

</style>
