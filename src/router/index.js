import { createRouter, createWebHistory } from 'vue-router'
import ColorPalette from '../components/ColorPalette.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/palette',
    name: 'ColorPalette',
    component: ColorPalette
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    redirect: '/settings/generation'
  },
  {
    path: '/settings/:tab',
    name: 'SettingsTab',
    component: Settings,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

