<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @beforeLeave="beforeLeave"
    @enter="enter"
    @afterEnter="afterEnter"
    >
    <slot/>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLoadingBar } from 'naive-ui'
import { useIpc } from '../../hooks'
const DEFAULT_TRANSITION = 'fade'
const DEFAULT_TRANSITION_MODE = 'out-in'

export default defineComponent({
  data() {
    return {
      prevHeight: 0,
      transitionName: DEFAULT_TRANSITION,
      transitionMode: DEFAULT_TRANSITION_MODE,
      transitionEnterActiveClass: ''
    }
  },
  setup() {
    const loadingBar = useLoadingBar()

    return {
      loadingStart() {
        loadingBar?.start()
      },
      loadingEnd() {
        loadingBar?.finish()
      },
      loadingError() {
        loadingBar?.error()
      }
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.loadingStart()
      let transitionName = to.meta.transitionName as string || from.meta.transitionName as string || DEFAULT_TRANSITION

      if (transitionName === 'slide') {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }

      this.transitionMode = DEFAULT_TRANSITION_MODE
      this.transitionEnterActiveClass = `${transitionName}-enter-active`

      if (to.meta.transitionName === 'zoom') {
        this.transitionMode = 'in-out'
        this.transitionEnterActiveClass = 'zoom-enter-active'
        document.body.style.overflow = 'hidden'
      }

      // if (from.meta.transitionName === 'zoom') {
      //   this.transitionMode = null
      //   this.transitionEnterActiveClass = null
      //   document.body.style.overflow = null
      // }

      this.transitionName = transitionName

      next()
    })

    this.$router.afterEach(() => {
      this.loadingEnd()
    })

    this.$router.onError(() => {
      this.loadingError()
    })

    useIpc().on('discord:askRouteData', () => {
      useIpc().send('discord:routeData', {
        name: this.$route.name,
        path: this.$route.path,
        meta: this.$route.meta
      })
    })
  },
  methods: {
    beforeLeave(element: HTMLElement) {
      this.prevHeight = Number(getComputedStyle(element).height)
    },
    enter(element: HTMLElement) {
      const { height } = getComputedStyle(element)

      element.style.height = String(this.prevHeight)

      setTimeout(() => {
        element.style.height = height
      })
    },
    afterEnter(element: HTMLElement) {
      element.style.height = 'auto'
    }
  }
})
</script>

<style lang="sass">
@mixin animationmixin($type:'animation', $style:'', $properties, $timing:ease, $duration:1s)
  .#{$style}
    &-enter-active, &-leave-active
        opacity: 1
        transform: none
        transition: initial
        transition-duration: #{$duration}
        transition-property: #{$properties}
        transition-timing-function: #{$timing}
        overflow: hidden
    &-enter-from, &-leave-to
      @content

@include animationmixin($style:'fade', $duration:.3s, $properties:opacity height)
  opacity: 0

@include animationmixin($style:'slide-left', $duration:.5s, $properties:opacity transform height, $timing:cubic-bezier(0.55, 0, 0.1, 1))
  opacity: 0
  transform: translate(2em, 0)

@include animationmixin($style:'slide-right', $duration:.5s, $properties:opacity transform height, $timing:cubic-bezier(0.55, 0, 0.1, 1))
  opacity: 0
  transform: translate(-2em, 0)

@include animationmixin($style:'zoom', $duration:.5s, $properties:opacity transform)
  opacity: 0
  transform: scale3d(0.3, 0.3, 0.3)

.zoom-enter-active
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  background-color: #232430

.zoom-leave-active
  position: absolute
  display: none !important
</style>
