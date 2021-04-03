import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import axios from "axios"
import TreeTable from "vue-table-with-tree-grid"
import Crumb from "./components/commons/crumb"
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入包
import NProgress from "nprogress"
// 导入样式
import 'nprogress/nprogress.css'



Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = "http://118.31.171.210:8801/api/private/v1/"

// 在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config);
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})

// 在response拦截器中，隐藏进度条 .....done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.component('tree-table', TreeTable);
Vue.component('crumb', Crumb);
// 将富文本编辑器注册成全局可用
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.config.devtools = true;
// 引入公共样式
require('./assets/css/global.css')