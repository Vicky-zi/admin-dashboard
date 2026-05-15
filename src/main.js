import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'


// ApexCharts
import VueApexCharts from 'vue3-apexcharts'

import vuetify from './plugins/vuetify.js'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(vuetify)

app.component('apexchart', VueApexCharts)

app.mount('#app')