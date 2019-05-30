const MobilePayment = () => import( /* webpackChunkName: "public" */ '../pages/public/mobilePayment.vue')
const PublicCard = () => import( /* webpackChunkName: "public" */ '../pages/public/publicCard.vue')
const SupportHosp = () => import( /* webpackChunkName: "public" */ '../pages/public/supportHosp.vue')
const HospitalInfo = () => import( /* webpackChunkName: "public" */ '../pages/public/hospitalInfo.vue')
const Navigation = () => import( /* webpackChunkName: "public" */ '../pages/public/navigation.vue')
const Message = () => import( /* webpackChunkName: "public" */ '../pages/public/message.vue')

export default [{
    path: '/mobilePayment',
    name: 'MobilePayment',
    component: MobilePayment,
    meta: {
      isLogin: 'no',
      title: '关于移动支付'
    }
  },
  {
    path: '/publicCard',
    name: 'PublicCard',
    component: PublicCard,
    meta: {
      isLogin: 'no',
      title: '关于电子社保卡'
    }
  },
  {
    path: '/supportHosp',
    name: 'SupportHosp',
    component: SupportHosp,
    meta: {
      title: '支持医院'
    }
  },
  {
    path: '/hospital-info',
    name: 'HospitalInfo',
    component: HospitalInfo,
    meta: {
      title: '医院详情'
    }
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: Navigation,
    meta: {
      title: '地图导航'
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: Message,
    meta: {
      title: '我的消息'
    }
  },
]
