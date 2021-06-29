<template>
  <article class="container">
    <n-card title="Nouveau rapport de bug">
      <n-form
        v-if="!success && !error"
        :model="model"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        label-align="right"
        size="medium"
        :label-width="170"
      >
        <n-form-item label="Titre" path="title">
          <n-input placeholder="Titre du bug" v-model:value="model.title" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            placeholder="Décrivez votre bug"
            v-model:value="model.description"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </n-form-item>
        <n-form-item label="Données additionnelles" path="authCheckbox">
          <n-checkbox-group v-model:value="model.authCheckbox">
            <n-space vertical>
              <n-checkbox value="version">Partager mon numéro de version (v{{ version }})</n-checkbox>
              <n-checkbox value="platform">Partager mes information système ({{ platform }})</n-checkbox>
              <n-checkbox value="electronVersion">Partager ma version d'électron (v{{ electronVersion }})</n-checkbox>
              <n-checkbox value="chromeVersion">Partager ma version de chrome (v{{ chromeVersion }})</n-checkbox>
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end;">
          <n-button :loading="loading" @click="handleValidateButtonClick" round ghost type="primary">
            Validate
          </n-button>
        </div>
      </n-form>
      <n-result v-else-if="success" status="success" title="Merci !" description="le rapport a bien été envoyé, merci d'avoir pris de temps de reporter ce bug">
        <template #footer>
          <n-button @click="$router.push('/')">Retour a l'accueil</n-button>
        </template>
      </n-result>
      <n-result v-else status="error" title="Oops..." description="Un problème est survenu, contactez un administrateur ou réésayez plus tard">
        <template #footer>
          <n-button @click="error = false">Réessayer</n-button>
        </template>
      </n-result>
    </n-card>
  </article>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { NCard, NForm, NFormItem, NInput, NResult, NButton, NSpace, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { useIpc, useService } from '../hooks'
import { log } from 'util'

export default defineComponent({
  setup() {
    const { getBasicInformation } = useService('BaseService')
    const data = reactive({
      version: '',
      platform: '',
      electronVersion: '',
      chromeVersion: ''
    })
    getBasicInformation().then(({ version, platform, electronVersion, chromeVersion, root }) => {
      data.version = version
      data.platform = platform
      data.electronVersion = electronVersion
      data.chromeVersion = chromeVersion
    })
    return {
      ...toRefs(data)
    }
  },
  mounted() {
    this.loading = this.success = this.error = false
  },
  data() {
    return {
      loading: false,
      success: false,
      error: false,
      model: {
        title: '',
        description: '',
        authCheckbox: []
      },
      rules: {
        title: {
          required: true,
          trigger: ['blur', 'input'],
          message: 'Donnez un titre en rapport avec le bug rencontré'
        },
        description: {
          required: true,
          trigger: ['blur', 'input'],
          message: 'Vous devez donner une description pour le bug'
        },
        authCheckbox: {
          required: false
        }
      }
    }
  },
  methods: {
    handleValidateButtonClick() {
      const IPC = useIpc()
      this.loading = true

      IPC.on('feedback:sendedReport', (e, [data, error]) => {
        if (error) {
          this.error = true
          console.error(error)
        } else {
          this.success = true
          console.log(data)
        }
      })

      const data = JSON.parse(JSON.stringify({
        title: this.model.title,
        description: this.model.description,
        auths: this.model.authCheckbox
      }))

      IPC.send('feedback:sendReport', data)
    }
  },
  components: {
    NResult,
    NForm,
    NFormItem,
    NInput,
    NCard,
    NButton,
    NSpace,
    NCheckbox,
    NCheckboxGroup
  }
})
</script>
