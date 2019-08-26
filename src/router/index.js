import Vue from 'vue'
import Router from 'vue-router'
import GoogleMapsComponent from '@/components/GoogleMapsComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoogleMapsComponent',
      component: GoogleMapsComponent
    }
  ]
})
