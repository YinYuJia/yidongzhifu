const MedicalPay = () => import( /* webpackChunkName: "MedicalPay" */ '../pages/layout/medicalPay.vue')


export default [{
    path: '/',
    name: 'MedicalPay',
    component: MedicalPay,
    meta: {
      title: '医保移动支付',
      sign: 'special'
    }
  }
]
