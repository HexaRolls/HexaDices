<template>
  <n-drawer v-model:show="open" :width="486" placement="right" to="#main-content">
    <n-drawer-content title="Ajouter un utilisateur" style="text-align: left;">

      <n-form
        :model="model"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        label-align="right"
        size="medium"
        :label-width="100"
      >
        <n-form-item label="Nom" path="userName" :validation-status="inputValidationStatus" :feedback="inputFeedback">
          <n-input v-model:value="model.userName" placeholder maxlength="24" minlength="5" show-count clearable />
        </n-form-item>

        <n-form-item label="Description" path="userDesc">
          <n-input
            placeholder
            v-model:value="model.userDesc"
            type="textarea"
            maxlength="64" show-count
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </n-form-item>

        <n-form-item label="Statut" path="userStatus">
          <n-select v-model:value="model.userStatus" :options="[
            {
              label: 'Actif',
              value: 'active'
            },{
              label: 'Hors-ligne',
              value: 'offline'
            },{
              label: 'Ne pas déranger',
              value: 'dnd'
            },{
              label: 'Absent',
              value: 'idle'
            }
          ]" />
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
  data() {
    return {
      open: false,
      model: {
        userName: null,
        userDesc: null,
        userStatus: 'active'
      } as FormProps['model'],
      rules: {
        userName: {
          required: true,
          trigger: ['blur', 'input']
        }
      } as FormProps['rules']
    }
  },
  computed: {
    inputValidationStatus() {
      switch (true) {
        case !this.model?.userName:
        case this.model?.userName.length < 5:
        case this.save?.users.some((user: any) => user.name === this.model?.userName.trim()):
          return 'error'
        default:
          return undefined
      }
    },
    inputFeedback() {
      switch (true) {
        case !this.model?.userName:
        case this.model?.userName.length < 5:
          return 'Vous devez donner un nom d\'un minimum de 5 caractères'
        case this.save?.users.some((user: any) => user.name === this.model?.userName.trim()):
          return 'Vous devez utiliser un nom différent pour chaque utilisateur'
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
          console.log('Adding new user...')
          let lastID = 0
          if (this.save?.users.length) lastID = [...this.save.users].sort((a: any, b: any) => a - b).map((e: any) => e.id).pop()
          this.$emit('adding', {
            id: lastID + 1,
            name: this.model?.userName.trim(),
            description: this.model?.userDesc?.trim(),
            status: this.model?.userStatus
          })
          this.model = {
            userName: null,
            userDesc: null,
            userStatus: 'active'
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
