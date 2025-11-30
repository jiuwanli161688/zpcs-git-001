
import {http, Method} from '@/utils/request.js';
import api from "@/config/api.js";
/**
 * 获取乡愁导航商品
 * @param params
 */
export function getRegionalGoods(params) {
  return http.request({
    url: '/goods/goods/regional/list',
    method: Method.GET,
    params
  });
}
// 获取广告
export function getAdvertisement(params) {
  return http.request({
    url: '/advertising/listAll',
    method: Method.GET,
    params
  });
}
// 分页查询省份页面列表
export function getProvincePage(params) {
  return http.request({
    url: '/province/page',
    method: Method.GET,
    params
  });
}
// 根据专题id获取专题详情
export function getSpecialSectionDetail(params) {
  return http.request({
    url: '/special/section/detail',
    method: Method.GET,
    params
  });
}
// 根据专题id获取专题商品列表
export function getSpecialSectionGoodsList(params) {
  return http.request({
    url: '/special/section/goods/list',
    method: Method.GET,
    params
  });
}
// 根据专题id获取专题详情-新接口
export function getSpecialSectionDetailNew(params) {
  return http.request({
    url: '/special/section/detail/info',
    method: Method.GET,
    params
  });
}
// 获取热卖商品
export function getHotProducts(params) {
  return http.request({
    url: '/goods/goods/hotSelling/list',
    method: Method.GET,
    params
  });
}
// 获取楼层商品
export function getFloorDetail(params) {
  return http.request({
    url: '/goods/goods/floor/detail',
    method: Method.GET,
    params
  });
}
// 获取首页推荐商品
export function getRecommendGoods(params) {
  return http.request({
    url: '/goods/goods/recommend/list',
    method: Method.GET,
    params
  });
}
// 分页获取首页推荐商品列表
export function pageRecommendGoods(params) {
    return http.request({
        url: '/goods/goods/recommend/page',
        method: Method.GET,
        params
    });
}
// 获取热销榜单
export function getHotSalesRank(params) {
  return http.request({
    url: '/goods/goods/hotSelling/rank',
    method: Method.GET,
    params
  });
}
// 根据经纬度获取地区
export function getRegionByLatLng(params) {
  return http.request({
    url: `${api.common}/common/region/getAddressDetailByLonAndLat`,
    method: Method.GET,
    params
  });
}
// 获取分类
export function getPopularCategoryTree(params) {
  return http.request({
    url: `/goods/category/getPopularCategory`,
    method: Method.GET,
    loading: false,
    params
  });
}
// 获取热销榜单
export function getHotSalesRankList(params) {
  return http.request({
    url: '/goods/goods/hotSelling/rank/more',
    method: Method.GET,
    params
  });
}




