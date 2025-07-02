import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/tailwind.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import PaginatedTable from './components/dashboard/PaginatedTable.vue'
import PaginatedColumn from './components/dashboard/PaginatedColumn.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) app.component(key, component)

app.component('paginated-table', PaginatedTable)
app.component('paginated-table-column', PaginatedColumn)

app.mount('#app')