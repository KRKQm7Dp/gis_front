import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VeLine from 'v-charts/lib/line.common'

import Video from 'video.js'
import'videojs-flash'
import 'video.js/dist/video-js.css'

import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import BaiduMap from 'vue-baidu-map'

Vue.prototype.$video = Video

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO(process.env.VUE_APP_RTMP_MONITOR_URL)
}))
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'KAgZVujST65ourNvr5EibnPMYH3XUS85'
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !   development
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'development') {
//   mockXHR()
// }

// Vue.use(new VueSocketIO({
//   debug: true,
//   onnection: SocketIO('http://192.168.234.130:9991')
// }))
// set ElementUI lang to EN
Vue.component(VeLine.name, VeLine)
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
