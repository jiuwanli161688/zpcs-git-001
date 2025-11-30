/**
 * 商家列表
 */

import { http, Method } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 商家列表
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
          "storeName": "",
          "storeLogo": "",
          "grade": "",
          "avgScore": 0.0,
          "storeDisable": "",
          "storeAddressDetail": "",
          "storeAddressPath": "",
          "storeCenter": "",
          "storeDesc": "",
          "industryId": "",
          "cbdStorePhoto": "",
          "salesVolume": 0,
          "distance": 0.0
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
export function getShopList({
  pageNumber = 1,
  pageSize = 10,
  sort = "comprehensive",
  order = "desc",
  firstCategoryId,
  secondCategoryId,
  thirdCategoryId,
  addressId,
  storeCenter,
  distance,
}) {
  return http.request({
    url: "/cbdStore/list/es",
    method: Method.GET,
    needToken: true,
    params: {
      pageNumber,
      pageSize,
      sort,
      order,
      firstCategoryId,
      secondCategoryId,
      thirdCategoryId,
      addressId,
      storeCenter,
      distance,
    },
  });
}
/**
 * 获取行业分类列表（支持一级、二级、三级分类查询）
 * @param
 * @returns {
  data: {
    "success": false,
    "message": "",
    "code": 0,
    "timestamp": 0,
    "result": [
      {
        "id": "",
        "name": "",
        "icon": "",
        "sort": 0,
        "parentId": "",
        "parentName": "",
        "level": 0,
        "code": "",
        "isHot": false
      }
    ]
  }
}
 */
export function getCategories({ parentId, level = 1 }) {
  return http.request({
    url: "/cbd/industry/categories",
    method: Method.GET,
    needToken: true,
    params: { parentId, level },
  });
}
