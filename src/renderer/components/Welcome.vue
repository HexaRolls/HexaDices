<template>
  <div class="grid">
    <main-menu-button to="/games/" title="Mes parties" description="Voir toutes les parties enregistrés" color="#13131A" area="main" :src="imageRef1"/>
    <main-menu-button to="/settings" title="Paramètres" description="Options de configuration" area="asideOne" :src="imageRef2"/>
    <!-- <main-menu-button to="/assets/" title="Assets" description="Gestions des assets" area="asideTwo" :src="imageRef3"/> -->
    <!-- <main-menu-button to="/sheets/" title="Fiches enregistrés" description="Personnages enregistrés" area="middleLeft" :src="imageRef3"/> -->
    <!-- <main-menu-button to="/profile" title="Profil HexaRolls" description="Obtenir les information sur le profil"  area="middleRight" :src="imageRef2"/> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MainMenuButton from './utils/mainMenuButton.vue'
import imageRef1 from '../assets/images/screenshots/Games.png'
import imageRef2 from '../assets/images/screenshots/Settings.png'
import imageRef3 from '../assets/images/screenshots/Sheets.png'

export default defineComponent({
  components: {
    MainMenuButton
  },
  data() {
    return {
      imageRef1: imageRef1,
      imageRef2: imageRef2,
      imageRef3: imageRef3
    }
  }
})
</script>

<style lang="sass">

.grid
  display: grid
  overflow: auto
  height: 100%
  width: 100%
  grid-template-rows: 1fr 1fr 1fr 1fr
  grid-template-columns: 1fr 1fr 1fr 1fr
  gap: 2.5vw
  padding: 2.5vw
  grid-template-areas: "main main main asideOne" "main main main asideTwo" "middleLeft middleLeft middleRight middleRight" "footerLeft footerLeft footerRight footerRight"

</style>
