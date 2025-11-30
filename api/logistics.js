/**
 * 信任登录相关API
 */

import {
	http,
	Method
} from '@/utils/request.js';
const request = http.request;


// 获取物流轨迹
export function getTraces(params) {
	return http.request({
		url: `/order/order/getLogisticsTraces`,
		method: Method.GET,
		needToken: true,
		params: params
	});
}
