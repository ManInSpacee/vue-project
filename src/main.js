import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Применяем сохраненную тему при загрузке
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark')
  document.documentElement.style.colorScheme = 'dark'
} else if (savedTheme === 'contrast') {
  document.documentElement.setAttribute('data-theme', 'contrast')
  document.documentElement.style.colorScheme = 'dark'
} else if (savedTheme === 'light') {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.colorScheme = 'light'
} else if (savedTheme === 'auto') {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.colorScheme = 'light dark'
}

// Применяем доступность при загрузке
const savedAcc = localStorage.getItem('accessibility')
if (savedAcc) {
  try {
    const acc = JSON.parse(savedAcc)
    const root = document.documentElement
    if (acc.highContrast) {
      root.setAttribute('data-high-contrast', 'true')
    }
    if (acc.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true')
    }
    if (acc.wcagLevel) {
      root.setAttribute('data-wcag-level', acc.wcagLevel)
    }
  } catch (e) {
    console.error('Ошибка загрузки настроек доступности:', e)
  }
}

const app = createApp(App)
app.use(router)
app.mount('#app')
