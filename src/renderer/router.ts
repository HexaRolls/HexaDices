import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '/@/components/Home.vue'
import About from '/@/components/About.vue'
import Welcome from '/@/components/Welcome.vue'
import gameList from '/@/components/gameList.vue'
import gameView from '/@/components/gameView.vue'
import BugReport from '/@/components/BugReport.vue'
import Settings from '/@/components/Settings.vue'

const router = createRouter({
  history: createMemoryHistory(window.location.pathname),
  routes: [
    {
      path: '/',
      component: Welcome,
      name: 'Accueil',
      meta: {
        transitionName: 'slide',
        details: "Dans l'accueil"
      }
    },
    {
      path: '/about/',
      component: About,
      name: 'A propos',
      meta: {
        transitionName: 'slide'
      }
    },
    {
      path: '/welcome',
      component: Home,
      name: 'Test Zone',
      meta: {
        transitionName: 'zoom',
        dismissible: true
      }
    },
    {
      path: '/bugReport',
      component: BugReport,
      name: 'Report un bug',
      meta: {
        transitionName: 'slide'
      }
    },
    {
      path: '/games',
      component: gameList,
      name: 'Mes parties',
      meta: {
        transitionName: 'slide',
        details: 'Gères ses parties',
        smallImageKey: 'hexagon_list_light_512x512'
      }
    },
    {
      path: '/settings',
      component: Settings,
      name: 'Paramètres',
      meta: {
        transitionName: 'slide',
        details: 'Change ses options'
      }
    },
    {
      path: '/play/:id',
      component: gameView,
      name: 'Partie active',
      meta: {
        transitionName: 'slide',
        details: 'Dans une partie',
        state: 'En solo',
        largeImageKey: 'hexagon_list_dark_512x512',
        smallImageKey: 'hexagon_profile_light_512x512',
        smallImageText: 'Maître de jeu',
        partySize: 1,
        partyMax: 1
      }
    },
    {
      path: '/profile',
      component: About,
      name: 'Mon profil HexaRolls',
      meta: {
        transitionName: 'slide',
        details: 'Paramètre son profil',
        largeImageKey: 'hexagon_profile_light_512x512',
        smallImageKey: 'hexagon_hexarolls_light_512x512',
        smallImageText: 'HexaRolls'
      }
    }
  ]
})

export default router
