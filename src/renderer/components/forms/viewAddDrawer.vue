<template>
  <n-drawer v-model:show="open" :width="486" placement="right" to="#main-content">
    <n-drawer-content title="Ajouter une vue" style="text-align: left;">

      <n-form
        :model="model"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        label-align="right"
        size="medium"
        :label-width="100"
      >
        <n-form-item label="Nom" path="viewTitle" :validation-status="inputValidationStatus" :feedback="inputFeedback">
          <n-input v-model:value="model.viewTitle" placeholder maxlength="24" minlength="5" show-count clearable />
        </n-form-item>

        <n-form-item label="Type" path="viewType">
          <n-select v-model:value="model.viewType" :options="[
            {
              label: 'Tableau',
              value: 'canvas'
            }, {
              label: 'Page Web',
              value: 'webview'
            }, {
              label: 'Héroique',
              value: 'heroic'
            }
          ]" />
        </n-form-item>

        <n-form-item label="Nom" path="viewUrl" :validation-status="inputUrlValidationStatus" :feedback="inputUrlFeedback" v-if="model.viewType === 'webview'">
          <n-input v-model:value="model.viewUrl" placeholder clearable />
        </n-form-item>

        <div style="display: flex; justify-content: flex-end;">
          <n-button @click="handleValidateButtonClick" type="primary" ghost>
            <template #icon>
              <plus/>
            </template>
            Ajouter
          </n-button>
        </div>
      </n-form>

    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, FormProps, NSelect } from 'naive-ui'
import Plus from '../utils/icons/plus.vue'
import { Game } from '/@shared/games'

export default defineComponent({
  props: {
    save: {
      type: Object as () => Game,
      required: false,
      default: null
    }
  },
  setup() {
    const formRef = ref(null)
    return {
      formRef
    }
  },
  data() {
    return {
      open: false,
      model: {
        viewTitle: null,
        viewType: 'canvas',
        viewUrl: null
      } as FormProps['model'],
      rules: {
        viewTitle: {
          required: true,
          trigger: ['blur', 'input']
        },
        viewType: {
          required: true
        },
        viewUrl: {
          required: true,
          trigger: ['blur', 'input']
        }
      } as FormProps['rules']
    }
  },
  computed: {
    inputValidationStatus() {
      switch (true) {
        case !this.model?.viewTitle:
        case this.model?.viewTitle.length < 5:
        case this.save?.vues.some(view => view.title === this.model?.viewTitle.trim()):
          return 'error'
        default:
          return undefined
      }
    },
    inputFeedback() {
      switch (true) {
        case !this.model?.viewTitle:
        case this.model?.viewTitle.length < 5:
          return 'Vous devez donner un nom d\'un minimum de 5 caractères'
        case this.save?.vues.some(view => view.title === this.model?.viewTitle.trim()):
          return 'Vous devez utiliser un nom différent pour chaque vue'
        default:
          return 'Tout est en ordre !'
      }
    },
    inputUrlValidationStatus() {
      switch (true) {
        case !this.model?.viewUrl:
        case this.model?.viewUrl.length < 5:
        case this.save?.vues.some(view => view.type === 'webview' && view.url === this.model?.viewUrl.trim()):
          return 'error'
        default:
          return undefined
      }
    },
    inputUrlFeedback() {
      switch (true) {
        case !this.model?.viewUrl:
        case this.model?.viewUrl.length < 5:
          return 'Vous devez donner un nom d\'un minimum de 5 caractères'
        case this.save?.vues.some(view => view.type === 'webview' && view.url === this.model?.viewUrl.trim()):
          return 'Vous devez utiliser un nom différent pour chaque vue'
        default:
          return 'Tout est en ordre !'
      }
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    handleValidateButtonClick(e: MouseEvent) {
      e.preventDefault()
      this.$refs.formRef.validate((errors: any) => {
        if (!errors) {
          console.log('Adding new view...')
          let lastID = 0
          if (this.save?.vues.length) lastID = [...this.save.vues].sort((a: any, b: any) => a - b).map((e: any) => e.id).pop()
          const object = {
            id: lastID + 1,
            title: this.model?.viewTitle.trim(),
            type: this.model?.viewType
          } as Game['vues'][0]

          if (object.type === 'webview') object.url = this.model?.viewUrl

          this.$emit('adding', object)
          this.model = {
            viewTitle: null,
            viewType: 'canvas',
            viewUrl: null
          }
          this.toggle()
        } else {
          console.log(errors)
        }
      })
    }
  },
  components: {
    NDrawer,
    NDrawerContent,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NSelect,
    Plus
  }
})
</script>

<style>

</style>
