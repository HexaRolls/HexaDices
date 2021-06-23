import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '/@/components/Home.vue'
import About from '/@/components/About.vue'
import Welcome from '/@/components/Welcome.vue'
import gameList from '/@/components/gameList.vue'
import gameView from '/@/components/gameView.vue'

const router = createRouter({
  history: createMemoryHistory(window.location.pathname),
  routes: [
    {
      path: '/',
      component: Welcome,
      name: 'Accueil',
      meta: { transitionName: 'slide' }
    },
    {
      path: '/about/',
      component: About,
      name: 'A propos',
      meta: { transitionName: 'slide' }
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
      component: Welcome,
      name: 'Report un bug',
      meta: {
        transitionName: 'slide'
      }
    },
    {
      path: '/games',
      component: gameList,
      name: 'Mes parties',
      meta: { transitionName: 'slide' }
    },
    {
      path: '/play/:id',
      component: gameView,
      name: 'Partie active',
      meta: { transitionName: 'slide' }
    },
    {
      path: '/profile',
      component: About,
      name: 'Mon profil HexaRolls',
      meta: {
        transitionName: 'slide'
      }
    }
  ]
})

export default router
