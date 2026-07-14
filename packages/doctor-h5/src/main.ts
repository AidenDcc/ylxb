import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupMock } from '@ylxb/shared'
import 'vant/lib/index.css'
import './styles/global.css'

setupMock()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
