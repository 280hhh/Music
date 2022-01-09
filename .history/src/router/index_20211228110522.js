import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children:  [{
      path: 'upLoad',
      name: 'UpLoad',
      component: () => import(/* webpackChunkName: "about" */ '../views/UpLoad.vue')
    },
    {
      path: 'findMusic',
      name: 'FindMusic',
      component: () => import(/* webpackChunkName: "about" */ '../views/FindMusic.vue')
    },
    {
      path: 'mylove',
      name: 'MyLove',
      component: () => import(/* webpackChunkName: "about" */ '../views/MyLove.vue')
    },
  ],
  },
]

const router = new VueRouter({
  routes
})

export default router
