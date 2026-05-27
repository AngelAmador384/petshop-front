import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 1. Cambia la importación a la versión nombrada (usando llaves):
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// 2. Ejecuta la función creadora al usar el plugin:
pinia.use(createPersistedState())

app.use(pinia)
app.use(router)

app.mount('#app')
