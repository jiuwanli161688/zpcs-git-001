/**
 * 打卡相关API
 */

import {http,Method} from '@/utils/request.js';

/**
 * 分页查询打卡记录列表
 * @param params
 */
export function getCbdClockInList(params) {
    return http.request({
        url: '/cbd/clockIn/list',
        method: Method.GET,
        params,
    });
}

/**
 * 分页查询打卡记录列表
 * @param params
 */
export function getCbdClockInStatistics(params) {
    return http.request({
        url: '/cbd/clockIn/statistics',
        method: Method.GET,
        params,
    });
}
