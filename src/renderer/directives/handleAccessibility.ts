import { ObjectDirective } from 'vue'

const directive: ObjectDirective = {
  mounted(el: HTMLElement, binding, vNode) {
    console.log('-= Building Accessibility =-', el)

    window.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      binding.instance?.$router.back()
    })
  }
}

export default directive
