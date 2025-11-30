/**
 * 评价相关API
 */

import {http,Method} from '@/utils/request.js';

/**
 * 分页查询根据会员ID查询评价记录
 * @param params
 */
export function getCbdEvaluationMemberList(params) {
    return http.request({
        url: '/cbd/evaluation/member/records',
        method: Method.GET,
        params,
    });
}
