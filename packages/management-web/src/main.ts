import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { setupMock } from '@ylxb/shared'
import App from './App.vue'

import 'element-plus/dist/index.css'
import './styles/global.css'

const app = createApp(App)

setupMock()

app.use(createPinia())
app.use(router)

app.mount('#app')
