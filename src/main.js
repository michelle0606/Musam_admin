import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft,
  faChartLine,
  faCalendarAlt,
  faCandyCane,
  faThList,
  faPlus,
  faClock,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { faAddressBook, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faArrowLeft,
  faAddressBook,
  faChartLine,
  faCalendarAlt,
  faCandyCane,
  faThList,
  faPlus,
  faTrashAlt,
  faClock,
  faImage
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
