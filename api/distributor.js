import storage from "@/utils/storage";
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";


// 协议预览事件-服务商
export function distributorPreviewProtocol() {
  return http.request({
    url: '/distributor/distributor/previewProtocol',
    method: Method.GET,
    needToken: true,
  })
}

// 协议预览事件-供应商
export function storePreviewProtocol() {
  return http.request({
    url: '/store/store/previewProtocol',
    method: Method.GET,
    needToken: true,
  })
}

/**
 * 提交分平台服务商基本资料
 * @param data
 * @returns {*}
 */
export function distributorSubmit(data) {
  return http.request({
    url: `/distributor/distributor/submit`,
    method: Method.PUT,
    needToken: true,
    header: { "content-type": "application/json" },
    data
  })
}

/**
 * 上传分平台服务商签约信息
 * @param data
 * @returns {*}
 */
export function distributorUploadSigning(params) {
  return http.request({
    url: `/distributor/distributor/uploadSigning`,
    method: Method.PUT,
    needToken: true,
    params
  })
}

/**
 * 上传分平台服务商续签信息
 * @param data
 * @returns {*}
 */
export function renreDistributorUploadSigning(params) {
  return http.request({
    url: `/distributor/distributor/applyRenew`,
    method: Method.PUT,
    needToken: true,
    params
  })
}

/**
 * 查询分平台服务商详情
 * @returns {*}
 */
export function distributorDetail() {
  return http.request({
    url: `/distributor/distributor/echo`,
    method: Method.GET,
    needToken: true,
  })
}

/**
 * 查询分平台服务商审核信息
 */

export function distributorReviewInfo() {
  return http.request({
    url: `/distributor/distributor/reviewInfo`,
    method: Method.GET,
    needToken: true,
  })
}

/**
 * 查询供应商余额、冻结金额、待入账金额、累计收入
 */

export function getStoreMoney() {
  return http.request({
    url: '/store/store/getStoreMoney',
    method: "GET",
    needToken: true,
  })
}

/**
 * 查询当前供应商用户的流水
 */
export function getStoreWallet(data) {
  return http.request({
    url: '/store/store/getStoreWallet',
    method: "GET",
    data,
    needToken: true,
  })
}
/**
 * 查询保证金账单
 */
export function getPaymentRecord(data) {
  return http.request({
    url: '/store/store/getPaymentRecord',
    method: "GET",
    data,
    needToken: true,
  })
}
// 获取当前用户供应商缴纳保险金情况
export function getDepositPaymentMoney() {
  return http.request({
    url: '/store/store/getDepositPaymentMoney',
    method: "GET",
    needToken: true,
  })
}
// 缴纳保证金
export function depositPayment(data) {
  return http.request({
    url: `/store/store/depositPayment`,
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/json" },
    data
  })
}
/**
 * 查询账户验真信息
 */
export function getVerify(type) {
  return http.request({
    url: `/passport/member/application/payment/${type}`,
    method: "GET",
    needToken: true,
  })
}
/**
 * 查询账户验真收款信息
 */
export function getVerifyPrice(type) {
  return http.request({
    url: `/passport/member/confirm/payment/${type}`,
    method: "POST",
    needToken: true,
  })
}
//
/**
 * 重新生成验真信息
 */
export function reGetVerify() {
  return http.request({
    url: `/distributor/distributor/refresh/checkInfo`,
    method: "POST",
    needToken: true,
  })
}
