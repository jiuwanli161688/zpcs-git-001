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
/**
 * 最近24小时内是否评论过（新增评论时，先校验，若有评论过，则不可以提交）
 * @param 
 * @returns 
 */
export function isRecentDays() {
  return http.request({
    url: "/cbd/evaluation/check/recent",
    method: Method.GET,
    needToken: true,
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
 * 获取最近打卡天数，若有天数，则展示 用户评分区
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
// -----

/**
 * 获取审核过的相册(相册列表)
 * @param 
 * @returns {
  data: {
    "success": true,
    "message": "success",
    "code": 200,
    "timestamp": 1764466927866,
    "result": {
        "records": [
            {
                "id": "1994396572233801728",
                "createBy": "admin",
                "createTime": "2025-11-28 21:22:51",
                "updateBy": "admin",
                "updateTime": "2025-11-28 21:23:22",
                "storeId": "1798246165884223489",
                "imageId": null,
                "imageTitle": "5d86baf3af894f2f9590554345ce466a.png",
                "imageDesc": null,
                "imageUrl": "https://zpwdsc.oss-cn-beijing.aliyuncs.com/MANAGER/cbd/album/6d19acf349e245948d8c171ae6a22535.png",
                "fileKey": "MANAGER/cbd/album/6d19acf349e245948d8c171ae6a22535.png",
                "images": null,
                "storeName": "中品维度商城",
                "storeNumber": null,
                "auditStatus": 2,
                "auditTime": "2025-11-28 21:23:22",
                "qcUserName": "admin"
            },
            {
                "id": "1004",
                "createBy": "admin",
                "createTime": "2025-11-27 10:15:00",
                "updateBy": "admin",
                "updateTime": "2025-11-28 21:33:44",
                "storeId": "1798246165884223489",
                "imageId": 3004,
                "imageTitle": "门头招牌夜景",
                "imageDesc": "照片不清晰，审核未通过",
                "imageUrl": "https://img.example.com/store/2001/sign_front.jpg",
                "fileKey": null,
                "images": null,
                "storeName": "中品维度商城",
                "storeNumber": null,
                "auditStatus": 2,
                "auditTime": "2025-11-28 21:33:44",
                "qcUserName": "admin"
            }
        ],
        "total": 2,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
}
 
 */
export function getCheckInDayCount({ storeId, pageNumber, pageSize }) {
  return http.request({
    url: "/cbd/storeAlbumManage/approved/images",
    method: Method.GET,
    needToken: true,
    params: { storeId, pageNumber, pageSize },
  });
}