/**
 * 商家详情
 */

import { http, Method } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 商家详情
 * @param
 * @returns {
  data: {
  "success": false,
  "message": "",
  "code": 0,
  "timestamp": 0,
  "result": {
    "storeName": "",
    "avgScore": 0.0,
    "linkPhone": "",
    "businessStartTime": "",
    "businessEndTime": "",
    "storeAddressDetail": "",
    "storeAddressPath": "",
    "storeDisable": "",
    "recentClockInDays": 0
  }
  }
}
 */
export function getShopDetail(storeId) {
  return http.request({
    url: `/cbdStore/detail/${storeId}`,
    method: Method.GET,
    needToken: true,
  });
}
// ------评价----
/**
 * 获取评价
 * @param
 * @returns {
  data: {
  "success": false,
  "message": "",
  "code": 0,
  "timestamp": 0,
  "result": {
    "records": [
      {
        "id": "",
        "memberName": "",
        "memberProfile": "",
        "createTime": "",
        "content": "",
        "images": "",
        "grade": "",
        "haveImage": false
      }
    ],
    "total": 0,
    "size": 0,
    "current": 0,
    "orders": [
      {
        "column": "",
        "asc": false
      }
    ],
    "optimizeCountSql": false,
    "searchCount": false,
    "optimizeJoinOfCountSql": false,
    "maxLimit": 0,
    "countId": "",
    "pages": 0
  }
}

}
 */
export function getEvaluation({ pageNumber = 1, pageSize = 5, storeId }) {
  return http.request({
    url: "/cbd/evaluation/list",
    method: Method.GET,
    needToken: true,
    params: { pageNumber, pageSize, storeId },
  });
}
/**
 * 新增评价
 * @param 
 * @returns 
 */
export function createEvaluation({ grade, content, images, storeId }) {
  return http.request({
    url: "/cbd/evaluation",
    method: Method.POST,
    needToken: true,
    params: { grade, content, images, storeId },
  });
}

// -------打卡-----
/**
 * 添加打卡记录
 * @param 
 * @returns 
 */
export function createCheckIn({ position, latitudeAndLongitude, area, photo, storeId }) {
  return http.request({
    url: "/cbd/clockIn/save",
    method: Method.POST,
    needToken: true,
    params: { position, latitudeAndLongitude, area, photo, storeId },
  });
}
/**
 * 获取连续打卡天数
 * @param 
 * @returns { 
  data: {
  "success": false,
  "message": "",
  "code": 0,
  "timestamp": 0,
  "result": 0
}
}
 */
export function getCheckInDayCount({ memberId, storeId }) {
  return http.request({
    url: "/cbd/clockIn/consecutiveDays",
    method: Method.GET,
    needToken: true,
    params: { memberId, storeId },
  });
}
/**
 * 获取最近打卡天数
 * @param 
 * @returns { 
  data: {
  "success": false,
  "message": "",
  "code": 0,
  "timestamp": 0,
  "result": 0
}
}
 */
export function getCheckInDayCount({ storeId }) {
  return http.request({
    url: "/cbd/clockIn/recentDays",
    method: Method.GET,
    needToken: true,
    params: { storeId },
  });
}