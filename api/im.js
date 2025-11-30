import { http, Method } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 获取聊天详情接口
 * @param {*} talkId
 * @returns
 */
export function getTalk(talkId) {
  return http.request({
    url: `${api.im}/talk/${talkId}`,
    method: Method.GET,
  });
}

/**
 * 获取与用户的聊天详情
 * @param {*} talkId
 * @returns
 */
export function getTalkByUser(userId) {
  return http.request({
    url: `${api.im}/talk/by/user/${userId}`,
    method: Method.GET,
  });
}

/**
 * 获取聊天列表
 * @param {*} talkId
 * @returns
 */
export function getTalkList(params) {
  return http.request({
    url: `${api.im}/talk/list`,
    method: Method.GET,
    params
  });
}

/**
 * 获取聊天信息接口
 * @param {*} params
 * @returns
 */
export function getTalkMessage(params) {
  return http.request({
    url: `${api.im}/message`,
    method: Method.GET,
    params
  });
}

/**
 * 获取聊天信息接口
 * @param {*} params
 * @returns
 */
export function cleanUnreadMessage(params) {
  return http.request({
    url: `${api.im}/message/clean/unred`,
    method: Method.PUT,
    params
  });
}
// 从商品页点击 客服 跳转 获取商品详情
export function jumpObtain(skuId, goodsId) {
  return http.request({
    url: `/goods/goods/sku/${goodsId}/${skuId}`,
    method: Method.GET,
  });
}
// 清除未读
// /im/message/clean/unred
export function clearmeaager() {
  return http.request({
    url: `${api.im}/message/clean/unred`,
    method: Method.PUT,
  });
}

// 获取token
export function createUser(params) {
  return http.request({
    url: `${api.im}/user/createUser`,
    method: Method.POST,
    params
  });
}
// 获取历史消息
export function getMessagePage(params) {
  return http.request({
    url: `${api.im}/message/page`,
    method: Method.GET,
    header: { 'him-token': uni.getStorageSync('him-token'), },
    params
  });
}
// 获取聊天的friendld和groupId
export function createFriend(userId, params) {
  return http.request({
    url: `${api.im}/external/group/createGroup/${userId}/${userId}`,
    method: Method.POST,
    header: { 'him-token': uni.getStorageSync('him-token'), },
    params
  });
}
// 获取群组信息
export function getGroupInfoByGroupId(groupId) {
  return http.request({
    url: `${api.im}/group/getGroupInfoByGroupId/${groupId}`,
    method: Method.GET,
    header: { 'him-token': uni.getStorageSync('him-token'), },
  });
}
// 获取聊天双方的用户信息
export function getUserInfo(friendId) {
  return http.request({
    url: `${api.im}/friend/userinfo/${friendId}`,
    method: Method.GET,
    header: { 'him-token': uni.getStorageSync('him-token'), },
  });
}
// 获取分平台服务商id
export function getDistributorId(memberId) {
  return http.request({
    url: `/distributor/distributor/getDistributorId/${memberId}`,
    method: Method.GET,
  });
}
// 获取群组成员信息
export function getUserListByGroupId(groupId) {
  return http.request({
    url: `${api.im}/group/getUserListByGroupId/${groupId}`,
    method: Method.GET,
    header: { 'him-token': uni.getStorageSync('him-token'), },
  });
}
// 用户加入聊天池
export function createChatPool() {
  return http.request({
    url: `/member/chat/pool/create/chatPool`,
    method: Method.POST,
  });
}
// 用户发送评价
export function sendEvaluate(data) {
  return http.request({
    url: `${api.im}/evaluation/submit`,
    method: Method.POST,
    header: { 'him-token': uni.getStorageSync('him-token'), },
    data
  });
}
// 刷新商家正在咨询
export function refreshNowConsult(unitId, groupId, data) {
  return http.request({
    url: `${api.im}//external/group/refreshNowConsult/${unitId}/${groupId}`,
    method: Method.POST,
    header: { 'him-token': uni.getStorageSync('him-token'), },
    data
  });
}

export function revokeMessage(data) {
  return http.request({
    url: `${api.im}/message/revoke`,
    method: Method.POST,
    params: data,
    header: { 'him-token': uni.getStorageSync('him-token'), },
  });
}

export function getBroadcastId() {
    return http.request({
      url: `${api.im}/message/getBroadcastId`,
      method: Method.GET,
        header: { 'him-token': uni.getStorageSync('him-token'), },
    });
}
