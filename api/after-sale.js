/**
 * 申请售后相关API
 */

import { http, Method } from "@/utils/request.js";

/**
 * 获取售后列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getAfterSale(params) {
  return http.request({
    url: "after-sales/refunds",
    method: Method.GET,
    needToken: true,
    loading: false,
    params,
  });
}


/******************* 以下为新方法 ***********************/
/**
 * 申请取消订单
 * @param params
 */
export function applyCancelOrder(params) {
  return http.request({
    url: "after-sales/apply/cancel/order",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
/**
 * 获取商家售后收件地址
 */
export function getStoreAfterSaleAddress(sn) {
  return http.request({
    url: `/order/afterSale/getStoreAfterSaleAddress/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}
/**
 * 取消售后
 */
export function cancelAfterSale(afterSaleSn) {
  return http.request({
    url: `/order/afterSale/cancel/${afterSaleSn}`,
    method: Method.POST,
    needToken: true,
  });
}



/**
 * 获取售后服务记录相关数据
 * @param params 参数
 */
export function getAfterSaleList(params) {
  return http.request({
    url: `/order/afterSale/page`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 查看售后服务详情
 * @param sn 售后服务单编号
 */
export function getServiceDetail(sn) {
  return http.request({
    url: `/order/afterSale/get/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}
/**
 * 查看申请售后商品
 * @param sn 订单编号
 */
export function getGoodsDetail(sn) {
  return http.request({
    url: `/order/order/orderItem/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

//计算售后退款金额与积分
export function getSalesRefund(sn, num) {
  return http.request({
    url: `/order/afterSale/calcAfterSaleReturn?orderItemSn=${sn}&count=${num}`,
    method: Method.GET,
    needToken: true,
  });
}


/**
 * 添加投诉
 */
export function addComplain(params) {
  return http.request({
    url: `/order/complain`,
    method: Method.POST,
    needToken: true,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}

/**
 * 取消投诉
 */
export function clearComplain(id, params) {
  return http.request({
    url: `/order/complain/status/${id}`,
    method: Method.PUT,
    needToken: true,
    params,
  });
}

/**
 * 取消投诉
 */
export function getAfterSaleLog(sn) {
  return http.request({
    url: `/order/afterSale/get/getAfterSaleLog/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 投诉列表
 */
export function getComplain(params) {
  return http.request({
    url: `/order/complain`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取申请原因
 */
export function getAfterSaleReason() {
  return http.request({
    url: `/order/afterSale/get/afterSaleReason`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取取消原因
 */
export function getClearReason() {
  return http.request({
    url: `/order/afterSale/get/afterSaleReason/CANCEL`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取投诉原因
 */
export function getComplainReason() {
  return http.request({
    url: `/order/afterSale/get/afterSaleReason/COMPLAIN`,
    method: Method.GET,
    needToken: true,
  });
}
/**
 * 获取投诉详情
 */
export function getComplainDetail(id) {
  return http.request({
    url: `/order/complain/${id}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取申请售后页面信息
 */
export function getAfterSaleInfo(sn) {
  return http.request({
    url: `/order/afterSale/applyAfterSaleInfo/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 申请退货服务
 * @param params
 */
export function applyReturn(orderItemSn, params) {
  return http.request({
    url: `/order/afterSale/save/${orderItemSn}`,
    method: Method.POST,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}

/**
 * 填充物流信息
 * @param afterSaleSn 售后服务单号
 * @param params 参数信息
 */
export function fillShipInfo(afterSaleSn, params) {
  return http.request({
    url: `/order/afterSale/delivery/${afterSaleSn}`,
    method: Method.POST,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}
/**
 * 发起投诉前返回信息
 */
export function orderComplainInfo(params) {
  return http.request({
    url: `/order/complain/before`,
    method: Method.GET,
    needToken: true,
    params: params
  });
}
/**
 * 继续举证
 * @param params 参数信息
 */
export function complainAdd(params) {
  return http.request({
    url: `/order/complain/evidence/add`,
    method: Method.POST,
    data: params,
  });
}



// 获取上门取件服务时间
export function checkDoorServiceOpen(params) {
  return http.request({
    url: `/order/afterSale/pickUpCheck`,
    method: Method.POST,
    data: params,
  });
}


// 上们取件提交
export function doorReceiveSubmit(sn, params) {
  return http.request({
    url: `/order/afterSale/pickUp/${sn}`,
    method: Method.POST,
    data: params,
  });
}



// 获取上门取件下单订单详情
export function getDoorPickup(afterSaleSn) {
  return http.request({
    url: `/order/afterSale/pickUp/${afterSaleSn}`,
    method: Method.GET,
    needToken: true,
  });
}


// 获取上门取件订单日志
export function getDoorPickupLog(afterSaleSn) {
  return http.request({
    url: `/order/afterSale/pickUpLog/${afterSaleSn}`,
    method: Method.GET,
    needToken: true,
  });
}


// 取消上门取件下单
export function submitCancel(cancelOrderObj) {
  return http.request({
    url: `/order/afterSale/cancelOrder`,
    method: Method.POST,
    data: cancelOrderObj,
  });
}


// 工单提交----快递异常处理
export function submitWork(params) {
  return http.request({
    url: `/order/afterSale/workSubmit`,
    method: Method.POST,
    data: params,
  });
}


// 获取工单详情信息
export function getWorkOrder(complaintNumber) {
  return http.request({
    url: `/order/afterSale/getWorkDetail/${complaintNumber}`,
    method: Method.GET,
    needToken: true,
  });
}

//上门取件修改订单时间
export function updateDoorTime(afterSaleSn, data) {
  return http.request({
    url: `/order/afterSale/updatePickUp/${afterSaleSn}`,
    method: Method.PUT,
    needToken: true,
    data,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

/**
 * 获取可申请退换货订单列表
 * @param params 参数
 */
export function getAfterSaleApplyList(params) {
  return http.request({
    url: `/order/afterSale/applyList`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取可申请交易纠纷的订单列表
 * @param params 查询参数，包含keywords(关键词), pageNo(页码), pageSize(每页数量)
 */
export function getCanComplainOrders(params) {
  return http.request({
    url: '/order/complain/canComplainOrders',
    method: Method.GET,
    params
  });
}