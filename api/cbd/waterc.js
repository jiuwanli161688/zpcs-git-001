/**
 * 智能水机相关API
 */

import { http, Method } from '@/utils/request.js';

/**
 * 获取水机列表
 * @param params
 */
export function getWatermcProductList(params) {
    return http.request({
        url: '/watermc/product/list',
        method: Method.GET,
        params,
    });
}

/**
 * 获取水机列表
 * @param params
 */
export function getWatermcProductDetail(id) {
    return http.request({
        url: '/watermc/product/detail/' + id,
        method: Method.GET,
    });
}
