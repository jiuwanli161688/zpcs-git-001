/**
 * 订单相关API
 */

import { http, Method } from "@/utils/request.js";




/**
 * 选择发票
 * @param params
 */
export function getReceipt(params) {
  return http.request({
    url: "/trade/carts/select/receipt",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 选择发票
 * @param id
 */
export function getReceiptDetail(id) {
  return http.request({
    url: `/trade/receipt/${id}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 选择配送方式
 * @param params
 */
export function selectedShipMethod(params) {
  return http.request({
    url: "/trade/carts/shippingMethod",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取订单列表
 * @param params
 */
export function getOrderList(params) {
  return http.request({
    url: "/order/order",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取订单详情
 * @param orderSn 订单编号
 */
export function getOrderDetail(orderSn) {
  return http.request({
    url: `/order/order/${orderSn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 取消订单
 * @param orderSn 订单编号
 */
export function cancelOrder(orderSn) {
  return http.request({
    url: `/order/order/cancel`,
    method: Method.POST,
    needToken: true,
    // header: { "content-type": "application/x-www-form-urlencoded" },
    data: orderSn,
  });
}

/**
 * 确认收货
 * @param orderSn 订单编号
 */
export function confirmReceipt(orderSn) {
  return http.request({
    url: `/order/order/${orderSn}/receiving`,
    method: Method.POST,
    needToken: true,
  });
}



/**
 * 获取当前拼团订单的拼团分享信息
 * @param {*} parentOrderSn
 * @param {*} skuId
 */
export function getPinTuanShare(parentOrderSn, skuId) {
  return http.request({
    url: `promotion/pintuan/share`,
    method: Method.GET,
    needToken: true,
    params: { parentOrderSn, skuId }
  });
}

/**
 * 根据订单获取是否可以修改收货地址（只有未发货状态）
 */
export function getAddressStatus(id) {
  return http.request({
    url: `/order/order/getUpdateConsigneeAddressFlag/${id}`,
    method: Method.GET,
    needToken: true
  });
}

/**
 * 修改收货地址
 */
export function updateAddress(data) {
  return http.request({
    url: `/order/order/updateConsigneeAddress`,
    method: Method.POST,
    needToken: true,
    data
  });
}
/**
 * 根据订单查询包裹列表
 */
export function getPackage(orderSn) {
  return http.request({
    url: `/order/order/getPackage/${orderSn}`,
    method: Method.GET,
    needToken: true
  });
}
/**
 * 订单再次购买
 */
export function repurchaseOrder(orderSn) {
  return http.request({
    url: `/trade/carts/addFromOrder/${orderSn}`,
    method: Method.POST,
    needToken: true
  });
}

/**
 * 订单催单
 * @param {string} orderSn 订单编号
 */
export function urgeOrder(orderSn) {
  return http.request({
    url: `/order/order/urge/${orderSn}`,
    method: Method.POST,
    needToken: true
  });
}
