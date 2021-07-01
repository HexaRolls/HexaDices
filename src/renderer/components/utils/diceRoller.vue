<template>
  <n-space justify="end" style="padding: 4px 16px">
    <n-badge show-zero :value="String(dices.d4)" :show="dices.d4 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d4 !== 0 ? 'primary': 'default'" ghost @click="dices.d4++" @contextmenu="dices.d4 -= 1">d4</n-button>
    </n-badge>
    <n-badge show-zero :value="String(dices.d6)" :show="dices.d6 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d6 !== 0 ? 'primary': 'default'" ghost @click="dices.d6++" @contextmenu="dices.d6 -= 1">d6</n-button>
    </n-badge>
    <n-badge show-zero :value="String(dices.d8)" :show="dices.d8 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d8 !== 0 ? 'primary': 'default'" ghost @click="dices.d8++" @contextmenu="dices.d8 -= 1">d8</n-button>
    </n-badge>
    <n-badge show-zero :value="String(dices.d12)" :show="dices.d12 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d12 !== 0 ? 'primary': 'default'" ghost @click="dices.d12++" @contextmenu="dices.d12-= 1">d12</n-button>
    </n-badge>
    <n-badge show-zero :value="String(dices.d20)" :show="dices.d20 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d20 !== 0 ? 'primary': 'default'" ghost @click="dices.d20++" @contextmenu="dices.d20 -= 1">d20</n-button>
    </n-badge>
    <n-badge show-zero :value="String(dices.d100)" :show="dices.d100 !== 0">
      <n-button :disabled="rolling" size="small" :type="dices.d100 !== 0 ? 'primary': 'default'" ghost @click="dices.d100++" @contextmenu="dices.d100 -= 1">d100</n-button>
    </n-badge>
    <n-input-group>
      <n-input-number :disabled="rolling" size="small" v-model:value="dices.add" placeholder="Bonus" style="width: 10em"/>
      <n-button :disabled="rolling" :loading="rolling" round size="small" :type="rolled ? 'success' : 'primary'" ghost @click="roll">
        <template v-if="rolled" #icon>
          <check/>
        </template>
        Roll
      </n-button>
    </n-input-group>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, h, ref, reactive, VNode } from 'vue'
import {
  NSpace,
  NInputGroup,
  NInputNumber,
  NButton,
  NBadge,

  useNotification
} from 'naive-ui'

import DiceContent from './diceContent.vue'
import Check from './icons/check.vue'

export default defineComponent({
  setup() {
    const notification = useNotification()
    const dices = reactive({
      d4: 0,
      d6: 0,
      d8: 0,
      d12: 0,
      d20: 0,
      d100: 0,
      add: null as null|number
    })
    const rolling = ref(false)
    const rolled = ref(false)

    const showResult = (results: any[], add: null|number) => {
      const date = new Date()
      function checkTime(i: number) {
        return (i < 10) ? '0' + i : i
      }

      notification.create({
        title: 'Résultat :',
        meta: `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}`,
        content: () => h(DiceContent as unknown as VNode, { results: results, add: add })
      })
    }

    return {
      dices,
      rolling,
      rolled,
      showResult,
      roll() {
        rolling.value = true
        const { add, ...numbers } = dices
        const numArray = Object.entries(numbers)
        const results = [] as any[]
        numArray.forEach(([dice, value]) => {
          if (value === 0) return
          const diceValue = Number(dice.split('d')[1])
          const diceResults = []
          if (value < 0) {
            for (let i = 0; i < -(value); i++) {
              diceResults.push(-(Math.floor(Math.random() * diceValue) + 1))
            }
          } else {
            for (let i = 0; i < value; i++) {
              diceResults.push(Math.floor(Math.random() * diceValue) + 1)
            }
          }
          results.push({
            dice,
            values: diceResults
          })
        })
        setTimeout(() => {
          rolled.value = true

          setTimeout(() => {
            dices.d4 = dices.d6 = dices.d8 = dices.d12 = dices.d20 = dices.d100 = 0
            dices.add = null
            console.log(results, add)
            showResult(results, add)
            rolling.value = false

            setTimeout(() => {
              rolled.value = false
            }, 2000)
          }, 150)
        }, 1000)
      }
    }
  },
  components: {
    NSpace,
    NInputGroup,
    NInputNumber,
    NBadge,
    NButton,
    Check
  }
})
</script>
