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
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NResult, NButton, NSpace, NCheckbox, NCheckboxGroup, FormInst } from 'naive-ui'
import { useIpc, useService } from '../hooks'

export default defineComponent({
  setup() {
    const ipc = useIpc()
    const formRef = ref(null as null|FormInst)
    const { getBasicInformation } = useService('BaseService')
    const data = reactive({
      version: '',
      platform: '',
      electronVersion: '',
      chromeVersion: '',
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
    })
    getBasicInformation().then(({ version, platform, electronVersion, chromeVersion, root }) => {
      data.version = version
      data.platform = platform
      data.electronVersion = electronVersion
      data.chromeVersion = chromeVersion
    })
    return {
      formRef,
      ...toRefs(data),
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()

        formRef.value?.validate((errors) => {
          if (!errors) {
            data.loading = true

            ipc.once('feedback:sendedReport', (e, [reportData, error]) => {
              if (error) {
                data.error = true
                console.error(error)
              } else if (reportData > 299) {
                data.error = true
                console.error(reportData)
              } else {
                data.success = true
                console.log(reportData)
              }
            })

            const sendingData = JSON.parse(JSON.stringify({
              title: data.model.title,
              description: data.model.description,
              auths: data.model.authCheckbox
            }))

            ipc.send('feedback:sendReport', sendingData)
          } else {
            console.log(errors)
          }
        })
      }
    }
  },
  mounted() {
    this.loading = this.success = this.error = false
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
