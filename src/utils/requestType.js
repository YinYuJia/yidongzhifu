//引入axios
import axios from 'axios'
import Indicator from "mint-ui/lib/indicator/index";
import {
  Toast
} from 'mint-ui/lib/toast/index'
import Utils from './util'

axios.defaults.baseURL = process.env.ApiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

//请求拦截器
axios.interceptors.request.use(config => {
  if(config.flag!=1){
    Indicator.open()
  }else{
    Indicator.close()
  }
 
  config.headers.token = Utils.getToken();
  config.headers.channelNo = sessionStorage.getItem("channelNo") || '';
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  Indicator.close()
  return response.data
}, error => {
  Indicator.close()
  if (error && error.response) {
    if (error.response.status == 401) {
      //生产环境下
      Utils.setToken();
      Utils.setUser();
      dsBridge.call("close", "");
      return response.data;
    }
    switch (error.response.status) {
      case 400:
        error.response.message = '错误请求'
        break;
      case 401:
        error.response.message = '未授权，请重新登录'
        break;
      case 403:
        error.response.message = '拒绝访问'
        break;
      case 404:
        error.response.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.response.message = '请求方法未允许'
        break;
      case 408:
        error.response.message = '请求超时'
        break;
      case 500:
        error.response.message = '服务器端出错'
        break;
      case 501:
        error.response.message = '网络未实现'
        break;
      case 502:
        error.response.message = '网络错误'
        break;
      case 503:
        error.response.message = '服务不可用'
        break;
      case 504:
        error.response.message = '网络超时'
        break;
      case 505:
        error.response.message = 'http版本不支持该请求'
        break;
      default:
        error.response.message = `连接错误${error.response.status}`
    }
  } else {
    Utils.setToken();
    Utils.setUser();
    dsBridge.call("close", "");
  }
  Toast(error.response.message)
  return Promise.resolve(error.response)
})

axios.defaults.timeout = 15000;

/**
 * post请求 参数参照
 * @param url
 * @param data
 * @param config
 */
function post(url, data, config) {
  return axios.post(url, data, config)
  
}console.log(this.config)

/**
 * get请求 参数参照
 * @param url
 * @param data
 * @param config
 */
function get(url, config) {
  return axios.get(url, config)
}

function all(url, data, config) {
  return axios.all(url, data, config)
}

function spread(fun) {
  return axios.spread(fun)
}
export default {
  post,
  get,
  all,
  spread
}
