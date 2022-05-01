import { createApp } from 'vue'
import { pinia } from '@/store/initStore'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './assets/styles/main.sass'

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
