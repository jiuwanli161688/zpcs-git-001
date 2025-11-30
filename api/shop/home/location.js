/**
 * 定位相关
 */

import { http, Method } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 热门城市
 * @returns 
 */
export function getHotCities({pageNumber = 1, pageSize = 8, cityCode}) {
  return http.request({
    url: "/cbd/City/popularCity/list",
    method: Method.GET,
    needToken: true,
    params: { pageNumber, pageSize, cityCode },
  });
}
/**
 * 根据关键字搜索市区
 * @param {*} keyword 搜索关键词
 * @returns 
 */
export function searchCities(keyword) {
  return http.request({
    url: "/cbd/City/region/search",
    method: Method.GET,
    needToken: true,
    params: { keyword },
  });
}
