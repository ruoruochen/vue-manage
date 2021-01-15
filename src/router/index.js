import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import AddGoods from '../components/goods/Add'
import Order from '../components/order/Order'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'

  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      { path: "", redirect: '/welcome' },
      { path: "/welcome", component: Welcome },
      { path: "/users", component: User },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
      { path: "/goods", component: GoodsList },
      { path: "/goods/add", component: AddGoods },
      { path: "/orders", component: Order }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
})
export default router
