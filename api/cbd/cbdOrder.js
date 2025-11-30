/**
 * 商圈订单相关API
 */

import {http,Method} from '@/utils/request.js';

/**
 * 分页订单查询列表
 * @param params
 */
export function getCbdOrderList(params) {
    return http.request({
        url: '/cbd/order',
        method: Method.GET,
        params,
    });
}
