/**
 * 公共API
 */
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";

// 获取账户问题数据 -- crm问题管理获取
export function getProblemList(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/problem/query`,
    method: Method.GET,
    params
  })
}

// 获取指定ID 预约回电详情
export function getScheduledCallBackDetail(id) {
	return http.request({
		url: `${api.CUSTOMER_BASE_URL}/scheduledCallBack/get/`+id,
		method: Method.GET
	})
}
// 取消 预约回电
export function cancelScheduledCallBack(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/scheduledCallBack/cancel`,
    method: Method.PUT,
    params
  })
}

// 预约回电取消原因 - 字典
export function cancelScheduledDict(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/system/dict/data/type/${params.type}`,
    method: Method.GET,
  })
}

// 新增 预约回电
export function addScheduledCallBack(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/scheduledCallBack/add`,
    method: Method.POST,
    data: params,
  })
}

// 获取 预约回电
export function getScheduledCallBack(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/scheduledCallBack/page`,
    method: Method.GET,
    params,
  })
}

// 获取购买问题数据
export function getUnpaidOrder(params) {
  return http.request({
    url: `/customerService/getUnpaidOrder`,
    method: Method.GET,
    params
  })
}
// 获取客服工作时间
export function getCustomerWorkTime() {
  return http.request({
    url: `/customerService/info`,
    method: Method.GET,
  })
}
// 获取客服400电话
export function get400Phone() {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/system/config/get400Phone`,
    method: Method.GET,
  })
}

// 获取常见问题分类
export function getSolutionCategories() {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/knowledgeBase/knowledgeDoc/getSolutionCategories`,
    method: Method.GET,
  })
}

// 获取常见问题分类的子分类
export function getSolutionById(id) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/knowledgeBase/knowledgeDoc/getSolutionById/${id}`,
    method: Method.GET,
  })
}

// 获取常见问题页面 列表数据
export function getCommonTypePageQuery(params) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/knowledgeBase/knowledgeDoc/commonTypePageQuery`,
    method: Method.GET,
    params
  })
}

// 获取公告
export function getAnnouncementData(params = {}) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/knowledgeBase/knowledgeDoc/getAnnouncementData`,
    method: Method.GET,
    params,
  })
}
// 获取公告/问题详情数据
export function getProblemDetailInfo(id) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/knowledgeBase/knowledgeDoc/${id}`,
    method: Method.GET,
  })
}
// 获取 公告/问题的 视频/图片内容
export function getVideosOrImagesCont(ossIds) {
  return http.request({
    url: `${api.CUSTOMER_BASE_URL}/system/oss/listByIds/${ossIds}`,
    method: Method.GET,
  })
}

// 获取用户问题订单列表
export function getQuestionOrder(params) {
  return http.request({
    url: `/customerService/getQuestionOrder`,
    method: Method.GET,
    params
  })
}
// 猜你想问
export function wantToAskQuestion(params) {
  return http.request({
    url: `/customerService/wantToAskQuestion`,
    method: Method.GET,
    params
  })
}