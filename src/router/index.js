import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from './layout.router'
import Icbc from './icbc.router'
import Payment from './payment.router'
import QrCode from './qrCode.router'
import Public from './public.router'

export default new Router({
  saveScrollPosition: true,
  routes: [
    ...Layout,
    ...Icbc,
    ...Payment,
    ...QrCode,
    ...Public
  ]
});
