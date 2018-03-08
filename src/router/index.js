import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import chatRoom from '@/components/chatRoom'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name:'login',
      component: Login
    },
    {
      path: "/room",
      name:'room',
      component: chatRoom
    }
  ]
});
