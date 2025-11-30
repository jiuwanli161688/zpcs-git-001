import { http } from "@/utils/request.js";

import api from "@/config/api.js";

import storage from "@/utils/storage.js";

/**
 * 通过短信重置密码
 * @param  mobile
 */
export function resetByMobile(params) {
  return http.request({
    url: `/passport/member/resetByMobile`,
    method: "POST",
    params,
  });
}


//获取自动发券
export function getAutoCoup() {
  return http.request({
    url: `/promotion/coupon/activity`,
    method: "GET",
    needToken: true,
  });
}

/**
 * 账号密码登陆
 * @params  password
 * @params  username
 */
export function userLogin(params, clientType) {
  return http.request({
    method: "POST",
    url: `/passport/member/userLogin`,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  })
}


/**
 * 发送验证码
 * @param  mobile
 */
export function sendMobile(mobile, type = 'LOGIN') {
  return http.request({
    url: `${api.common}/common/sms/${type}/${mobile}`,
    method: "GET",
  });
}
/**
 * 发送邮件验证码
 * @param  mobile
 */
export function sendMailCode(mailBox, type = 'BIND_MAIL') {
  return http.request({
    url: `/member/mailbox/sendCode`,
    method: "GET",
    params: { mailBox: mailBox, verificationEnums: type }
  });
}



/**
 * 短信登录
 * @param  mobile
 * @param  smsCode
 */
export function smsLogin(params, clientType) {
  return http.request({
    url: `/passport/member/smsLogin`,
    method: "POST",
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  });
}
/**
 * 注册用户
 * @param  mobilePhone
 * @param  code
 * @param  password
 * @param  username
 */
export function userRegister(params) {
  return http.request({
    url: `/passport/member/register`,
    method: "POST",
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
}

/**
 * 修改密码
 * @param  newPassword
 * @param  password
 */

export function modifyPass(params) {
  return http.request({
    url: `/passport/member/modifyPass`,
    method: "PUT",
    params,
  });
}

/**
 * 刷新token
 */
export function refreshTokenFn(refresh_token) {
  return http.request({
    url: `/passport/member/refresh/${refresh_token}`,
    method: "GET",
    needToken: false,
  });
}

// 获取密码状态
export function logout() {
  return http.request({
    url: '/passport/member/logout',
    method: "POST",
    needToken: true,
  })
}

export function scannerCodeLogin(params) {
  return http.request({
    url: '/passport/member/app_scanner',
    method: "POST",
    params,
    needToken: true,
  });
}
export function scannerCodeLoginConfirm(params) {
  return http.request({
    url: '/passport/member/app_confirm',
    method: "POST",
    params,
    needToken: true,
  });
}

/**
 * 账号注销
 */
export function userCancellation(params) {
  return http.request({
    url: '/passport/member/cancellation',
    method: "PUT",
    params,
    needToken: true
  })
}

/**
 * 绑定分平台服务商
 * @param params
 * @returns {*}
 */
export function distributorBind(params) {
  return http.request({
    url: '/distributor/distributor/bind',
    method: 'PUT',
    params,
    needToken: true,
  })
}

/**
 * 用户查询要绑定的分平台服务商接口
 */
export function distributorCheckInfo(data) {
  return http.request({
    url: '/distributor/distributor/checkInfo',
    method: "GET",
    data,
    needToken: true
  })
}
// 弹出第三方登录
export function webLogin(type, registerSource, url) {
  window.open(`${api.buyer}/passport/connect/connect/login/web/${type}?url=${url}&registerSource=${registerSource}&token=` + storage.getAccessToken(), 'blank');
}

// 第三方登录回调
export function webloginCallback(code) {
  return http.request({
    url: `/passport/connect/connect/result?state=${code}`,
    method: "GET",
    needToken: false,
  });
}
/**
 * 解除第三方登录绑定
 */
export function unBindWebLogin(type) {
  return http.request({
    url: `/passport/member/cancellationConnect/${type}`,
    method: 'POST',
    needToken: true
  });
}
/**
 * 供应商分平台服务商自检
 */
export function cancelCheck() {
  return http.request({
    url: `/passport/member/self`,
    method: 'GET',
    needToken: true
  });
}
/**
 * 注销分平台服务商或供应商
 */
export function cancelDisAndSup(logoutType) {
  return http.request({
    url: `/passport/member/cancellation/${logoutType}`,
    method: 'POST',
    needToken: true
  });
}
/**
 * 申请注销分平台服务商或供应商
 */
export function applyCancelDisAndSup(logoutType) {
  return http.request({
    url: `/passport/member/applyCancellation/${logoutType}`,
    method: 'POST',
    needToken: true
  });
}
/**
 * 获取注销申请记录
 */
export function getCancelRecord(logoutType) {
  return http.request({
    url: `/passport/member/getMemberLogout/${logoutType}`,
    method: 'GET',
    needToken: true
  });
}
/**
 * 查询资质，品牌，类目信息
 */
export function checkMemberLicenseEndTime() {
  return http.request({
    url: `/member/license/checkLicenseEndTime`,
    method: 'GET',
    needToken: true
  });
}
