/**
 * 兑换卷相关API
 */

import {http,Method} from '@/utils/request.js';

/**
 * 分页查询兑换券流水
 * @param params
 */
export function getCbdWatermcCouponFlowList(params) {
    return http.request({
        url: '/watermc/couponFlow/page',
        method: Method.GET,
        params,
    });
}

/**
 * 兑换券总额度
 * @param params
 */
export function getCbdWatermcCouponFlowTotal() {
    return http.request({
        url: '/watermc/couponFlow/total',
        method: Method.GET,
    });
}
