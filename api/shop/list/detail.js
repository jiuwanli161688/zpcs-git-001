/**
 * 商家详情
 */

import { http, Method } from "@/utils/request.js"

/**
 * 商家详情
 * @param
 * @returns 
 */
export function getShopDetail(storeId) {
  return http.request({
    url: `/cbdStore/detail/${storeId}`,
    method: Method.GET,
    needToken: true,
  })
}
// ------评价----
/**
 * 获取评价列表
 * @param
 * @returns 
 */
export function getEvaluation({ pageNumber = 1, pageSize = 5, storeId }) {
  return http.request({
    url: "/cbd/evaluation/list",
    method: Method.GET,
    needToken: true,
    params: { pageNumber, pageSize, storeId },
  })
}

/**
 * 新增评价
 */
export function createEvaluation({ grade, content, images, storeId }) {
  return http.request({
    url: "/cbd/evaluation",
    method: Method.POST,
    needToken: true,
    params: { grade, content, images, storeId },
  })
}

/**
 * 最近24小时内是否评论过
 */
export function isRecentDays() {
  return http.request({
    url: "/cbd/evaluation/check/recent",
    method: Method.GET,
    needToken: true,
  })
}

// -------打卡-----
/**
 * 添加打卡记录
 */
export function createCheckIn({ position, latitudeAndLongitude, area, photo, storeId }) {
  return http.request({
    url: "/cbd/clockIn/save",
    method: Method.POST,
    needToken: true,
    params: { position, latitudeAndLongitude, area, photo, storeId },
  })
}

/**
 * 获取连续打卡天数
 */
export function getConsecutiveDays({ memberId, storeId }) {
  return http.request({
    url: "/cbd/clockIn/consecutiveDays",
    method: Method.GET,
    needToken: true,
    params: { memberId, storeId },
  })
}

/**
 * 获取最近打卡天数
 */
export function getRecentCheckInDays({ storeId }) {
  return http.request({
    url: "/cbd/clockIn/recentDays",
    method: Method.GET,
    needToken: true,
    params: { storeId },
  })
}

/**
 * 获取审核过的相册(相册列表)
 * @param 
 * @returns 
 */
export function getApprovedAlbum({ storeId, pageNumber = 1, pageSize = 10 }) {
  return http.request({
    url: "/cbd/storeAlbumManage/approved/images",
    method: Method.GET,
    needToken: true,
    params: { storeId, pageNumber, pageSize },
  })
}
