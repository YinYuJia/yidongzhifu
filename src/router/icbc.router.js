const Protocol = () => import( /* webpackChunkName: "icbc" */ '../pages/icbc/protocol.vue')
const Sign = () => import( /* webpackChunkName: "icbc" */ '../pages/icbc/sign.vue')


export default [{
    path: '/protocol',
    name: 'Protocol',
    component: Protocol,
    meta: {
      title: '委托代扣协议'
    }
  },
  {
    path: '/sign',
    name: 'Sign',
    component: Sign,
    meta: {
      title: '签约委托代扣'
    }
  }
]
