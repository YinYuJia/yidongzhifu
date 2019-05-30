const Qrcode = () => import( /* webpackChunkName: "Qrcode" */ '../pages/qrCode/qrCodePage.vue')
const Paycode = () => import( /* webpackChunkName: "Qrcode" */ '../pages/qrCode/payCode.vue')
const MedicalGuide = () => import( /* webpackChunkName: "Qrcode" */ '../pages/qrCode/medicalGuide.vue')
const Blank = () => import( /* webpackChunkName: "Qrcode" */ '../pages/qrCode/blank.vue')

export default [
  {
    path: '/qrcode',
    name: 'Qrcode',
    component: Qrcode,
    meta: {
      title: '电子社保卡二维码'
    }
  },
  {
    path: '/paycode',
    name: 'Paycode',
    component: Paycode,
    meta: {
      title: '支付码'
    }
  },
   {
     path: '/medicalGuide',
     name: 'MedicalGuide',
     component: MedicalGuide,
     meta: {
       title: '导诊信息'
     }
   },
   {
    path: '/blank',
    name: 'Blank',
    component: Blank,
    meta: {
      title: '温馨提醒'
    }
  },
]
