/**
 * Created by lijian on 2017/12/19.
 */
let order = {};

function setOrder(orderParam){
  for ( var property in orderParam) {
    order[property] = orderParam[property];
  }
}

function resetOrder(){
  order = {};
}

function getOrder(){
  return order;
}

function updateOrder(key,value){
  order[key] = value;
}

export default {
  setOrder, getOrder,resetOrder,updateOrder
}
