<template>
  <n-collapse arrow-placement="right">

    <n-collapse-item name="diceResult">
      <template #header>
        <n-text code>{{ total }}</n-text>
      </template>

      <n-list>
        <n-list-item v-if="add">
          <n-statistic label="Valeur ajouté" :value="add" />
        </n-list-item>
        <n-list-item v-for="result in results" :key="result.dice">
          <n-statistic :label="labelize(result)">
            <n-breadcrumb separator="=">
              <n-breadcrumb-item v-for="(value, index) in result.values" :key="`${index}${result.dice}`">
                <template #separator>
                  <plus v-if="index < result.values.length - 1" />
                  <equal v-else/>
                </template>
                <n-text :type="checkType(result.dice, value)">{{ value }}</n-text>
              </n-breadcrumb-item>
              <n-breadcrumb-item>
                <n-text>{{ sum(result.values) }}</n-text>
              </n-breadcrumb-item>
            </n-breadcrumb>
          </n-statistic>
        </n-list-item>
      </n-list>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import {
  NText,
  NCollapse,
  NCollapseItem,
  NList,
  NListItem,
  NStatistic,
  NBreadcrumb,
  NBreadcrumbItem
} from 'naive-ui'

import Plus from './icons/plus.vue'
import Equal from './icons/equal.vue'

export default defineComponent({
  props: {
    results: {
      type: Array as () => any[],
      required: false,
      default: null
    },
    add: {
      type: Number,
      required: false,
      default: null
    }
  },
  setup(props) {
    const sum = (values: number[]) => {
      return values.reduce((a, b) => a + b, 0)
    }

    const labelize = (result: any) => {
      const prefix = result.values[0] < 0 ? '-' : ''
      const diceNumber = `${prefix}${result.values.length}`

      return `${diceNumber}${result.dice}`
    }

    const total = computed(() => {
      if (props.results) {
        const diceResults = [].concat(...props.results.map((dice: any) => dice.values)) as number[]
        const totalValue = sum(diceResults)

        return totalValue + props.add
      } else {
        return props.add || 0
      }
    })
    const checkType = (dice: string, value: number) => {
      const diceValue = Number(dice.split('d')[1])
      switch (true) {
        case diceValue === value:
          return 'success'
        case value === 1:
          return 'error'
        default:
          return 'default'
      }
    }

    return {
      total,
      checkType,
      sum,
      labelize
    }
  },
  components: {
    NText,
    NCollapse,
    NCollapseItem,
    NList,
    NListItem,
    NStatistic,
    NBreadcrumb,
    NBreadcrumbItem,
    Equal,
    Plus
  }
})
</script>

<style lang="sass" scoped>
.n-breadcrumb
    white-space: pre-wrap !important
</style>
