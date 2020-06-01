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
  faImage,
  faPlusCircle,
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
  faImage,
  faPlusCircle
)

import BottomBar from './components/BottomBar'
import TopBar from './components/TopBar.vue'
import Spinner from './components/Spinner'

Vue.component('TopBar', TopBar)
Vue.component('Spinner', Spinner)
Vue.component('BottomBar', BottomBar)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
