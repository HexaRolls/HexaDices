<template>
  <n-drawer v-model:show="open" :width="486" placement="right" to="#main-content">
    <n-drawer-content title="Ajouter une partie" style="text-align: left;">

      <n-form
        :model="model"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        label-align="right"
        size="medium"
        :label-width="100"
      >
        <n-form-item label="Nom" path="saveName" :validation-status="inputValidationStatus" :feedback="inputFeedback">
          <n-input v-model:value="model.saveName" placeholder maxlength="24" minlength="5" show-count clearable />
        </n-form-item>

        <n-form-item label="Description" path="saveDesc">
          <n-input
            placeholder
            v-model:value="model.saveDesc"
            type="textarea"
            maxlength="64" show-count
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
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
import { defineComponent } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NButton, FormProps } from 'naive-ui'
import Plus from '../utils/icons/plus.vue'
import { Game } from '/@shared/games'

export default defineComponent({
  props: {
    games: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      open: false,
      model: {
        saveName: null,
        saveDesc: null
      } as FormProps['model'],
      rules: {
        saveName: {
          required: true,
          trigger: ['blur', 'input']
        }
      } as FormProps['rules']
    }
  },
  computed: {
    inputValidationStatus() {
      switch (true) {
        case !this.model?.saveName:
        case this.model?.saveName.length < 5:
          return 'error'
        case this.games.some((save: any) => save.name === this.model?.saveName.trim()):
          return 'warning'
        default:
          return undefined
      }
    },
    inputFeedback() {
      switch (true) {
        case !this.model?.saveName:
        case this.model?.saveName.length < 5:
          return 'Vous devez donner un nom d\'un minimum de 5 caractères'
        case this.games.some((save: any) => save.name === this.model?.saveName.trim()):
          return 'Il est conseillé de donner un nom différent entre chaque parties'
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
          console.log('Adding new save...')
          const lastID = [...this.games].sort((a: any, b: any) => a - b).map((e: any) => e.id).pop()
          this.$emit('adding', {
            id: lastID + 1,
            name: this.model?.saveName.trim(),
            description: this.model?.saveDesc?.trim()
          })
          this.model = {
            saveName: null,
            saveDesc: null
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
    Plus
  }
})
</script>
