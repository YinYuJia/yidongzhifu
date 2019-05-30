const PayOrder = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payOrder.vue')
// const PayList = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payList.vue')
// const HistoryList = () => import( /* webpackChunkName: "payment" */ '../pages/payment/historyList.vue')
// const Refund = () => import( /* webpackChunkName: "payment" */ '../pages/payment/refund.vue')
// const Payfial = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payFail.vue')
// const ExpireList = () => import( /* webpackChunkName: "payment" */ '../pages/payment/expirePayList.vue')
const PayDetail = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payDetail.vue')
const PayConfirm = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payConfirm.vue')
const PayHisDetail = () => import( /* webpackChunkName: "payment" */ '../pages/payment/payHisDetail.vue')
const PayResult = () => import( /* webpackChunkName: "payment" */ '../pages/payment/result.vue')

const checkPayresult = () => import( '../pages/payment/checkPayresult.vue')
const OrderList = () => import( /* webpackChunkName: "payment" */ '../pages/payment/orderList.vue')

const freeCode = () => import( '../pages/payment/freepay/freeCode.vue')
const defaultPay = () => import( '../pages/payment/freepay/defaultPay.vue')
const agreeOpen = () => import( '../pages/payment/freepay/agreeOpen.vue')
const codeProtocol = () => import( '../pages/payment/freepay/codeProtocol.vue')
const openSuccess = () => import( '../pages/payment/freepay/openSuccess.vue')

export default [{
    path: '/payOrder',
    name: 'PayOrder',
    component: PayOrder,
    meta: {
      title: '订单列表'
    }
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: '待支付订单',
      sign: 'special'
    }
  },
  // {
  //   path: '/payList',
  //   name: 'PayList',
  //   component: PayList,
  //   meta: {
  //     title: '待支付订单'
  //   }
  // },
  // {
  //   path: '/historyList',
  //   name: 'HistoryList',
  //   component: HistoryList,
  //   meta: {
  //     title: '支付成功订单'
  //   }
  // },
  // {
  //   path: '/refund',
  //   name: 'Refund',
  //   component: Refund,
  //   meta: {
  //     title: '退款订单'
  //   }
  // },
  // {
  //   path: '/payfial',
  //   name: 'Payfial',
  //   component: Payfial,
  //   meta: {
  //     title: '作废订单'
  //   }
  // },
  // {
  //   path: '/expireList',
  //   name: 'ExpireList',
  //   component: ExpireList,
  //   meta: {
  //     title: '失效订单'
  //   }
  // },
  {
    path: '/payDetail',
    name: 'PayDetail',
    component: PayDetail,
    meta: {
      title: '支付订单详情'
    }
  },
  {
    path: '/payConfirm',
    name: 'PayConfirm',
    component: PayConfirm,
    meta: {
      title: '在线支付'
    }
  },
  {
    path: '/payHisDetail',
    name: 'PayHisDetail',
    component: PayHisDetail,
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/checkPayresult',
    name: 'checkPayresult',
    component: checkPayresult,
    meta: {
      title: '支付结果查询'
    }
  },
  {
    path: '/payResult',
    name: 'PayResult',
    component: PayResult,
    meta: {
      title: '支付结果',
    }
  },
  {
    path: '/freeCode',
    name: 'freeCode',
    component: freeCode,
    meta: { title: '小额免密支付' }
  },
  {
    path: '/defaultPay',
    name: 'defaultPay',
    component: defaultPay,
    meta: { title: '支付渠道设置' }
  },
  {
    path: '/agreeOpen',
    name: 'agreeOpen',
    component: agreeOpen,
    meta: { title: '开通免密支付' }
  },
  {
    path: '/codeProtocol',
    name: 'codeProtocol',
    component: codeProtocol,
    meta: { title: '免密支付协议' }
  },
  {
    path: '/openSuccess',
    name: 'openSuccess',
    component: openSuccess,
    meta: { title: '免密支付' }
  },
]
