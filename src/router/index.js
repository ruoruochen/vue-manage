import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

const User = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/User')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params')

const GoodsList = () => import(/* webpackChunkName: "goodslist_addgoods" */ '../components/goods/List')
const AddGoods = () => import(/* webpackChunkName: "goodslist_addgoods" */ '../components/goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report')

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
      { path: "/orders", component: Order },
      { path: "/reports", component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) return next('/login');
  next();
})
export default router
