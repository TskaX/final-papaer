import pinia from '../stores/index'
import { useUserStore } from '../stores/store'
import router from '../router/routes'
import { createApp } from 'vue'
import App from '../App.vue'

export async function registerPlugins (app) {
  app.use(pinia)
  await useUserStore().getUser()
  app.use(router)
}

(async () => {
  const app = createApp(App)

  await registerPlugins(app)

  app.mount('#app')
})()
