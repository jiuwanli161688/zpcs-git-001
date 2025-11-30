import storage from "@/utils/storage";
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";
/**
 * 意见反馈
 */
export function feedBack(params) {
  return http.request({
    url: "/other/feedback",
    method: Method.POST,
    needToken: true,
    params,
  });
}

// 提现
export function withdrawalApply(params) {
  return http.request({
    url: "/wallet/wallet/withdrawal",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 支付结果查询
 * @param orderType 交易类型,可用值:TRADE,ORDER,RECHARGE
 * @param sn   订单编号
 */
export function payCallback(params) {
  return http.request({
    url: `/payment/cashier/result`,
    method: Method.GET,
    params,
  });
}

// 在线充值
export function recharge(params) {
  return http.request({
    url: "/trade/recharge",
    method: Method.POST,
    params,
  });
}

/**
 * 分页获取预存款充值记录
 * @param params
 */
export function getUserRecharge(params) {
  return http.request({
    url: "/member/recharge",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 分页获取预存款充值记录
 * @param params
 */
export function getWalletLog(params) {
  return http.request({
    url: "/wallet/log/selectBySearch",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取优惠券列表
 * @param params
 */
export function getCoupons(params) {
  return http.request({
    url: "/promotion/coupon/getCoupons",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 领取优惠券
 * @param couponId
 */
export function receiveCoupons(couponId) {
  return http.request({
    url: `/promotion/coupon/receive/${couponId}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取积分明细数据
 * @param params
 * @returns {AxiosPromise}
 */
export function getPointsData(params) {
  return http.request({
    url: "member/memberPointsHistory/getByPage",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取我的评价列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getComments(params) {
  return http.request({
    url: "/member/evaluation",
    method: Method.GET,
    needToken: true,
    params,
  });
}


/**
 * 获取当前用户的浏览数量是多少
 * @param params
 * @returns {AxiosPromise}
 */
export function getFootprintNum(params) {
  return http.request({
    url: "/member/footprint/getFootprintNum",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 订单评价
 * @param params
 */
export function commentsMemberOrder(params) {
  return http.request({
    url: "/member/evaluation",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}


/**
 * 追加评价
 * @param params
 */
export function AppendCommentsOrder(params) {
  return http.request({
    url: "members/comments/additional",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}

// TODO 第一版本暂未实现此功能
/**
 * 商品咨询
 * @param goods_id
 * @param ask_content
 */
export function consultating(goods_id, ask_content, anonymous) {
  return http.request({
    url: "members/asks",
    method: Method.POST,
    header: { "content-type": "application/x-www-form-urlencoded" },
    needToken: true,
    data: {
      goods_id,
      ask_content,
      anonymous,
    },
  });
}

/**
 * 获取商品收藏
 * @param params
 * @returns {AxiosPromise}
 */
export function getGoodsCollection(params, type) {
  return http.request({
    url: `/member/collection/${type}`,
    method: Method.GET,
    needToken: true,
    loading: false,
    message: false,
    params,
  });
}

/**
 * 获取商品收藏
 * @param params
 * @returns {AxiosPromise}
 */
export function getStoreCollection(params, type) {
  return http.request({
    url: `/member/storeCollection/${type}`,
    method: Method.GET,
    needToken: true,
    loading: false,
    message: false,
    params,
  });
}

/**
 * 收藏商品
 * @returns {AxiosPromise}
 */
export function collectionGoods(type, id) {
  return http.request({
    url: `/member/collection/add/${type}/${id}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 删除商品收藏
 * @param ids 收藏ID【集合或单个商品ID】
 * @returns {AxiosPromise}
 */
export function deleteGoodsCollection(ids) {
  // if (Array.isArray(ids)) {
  //   ids = ids.join(",");
  // }
  return http.request({
    url: `/member/collection/delete/GOODS`,
    method: Method.DELETE,
    needToken: true,
    data: ids
  });
}

/**
 * 删除店铺收藏
 * @param store_id
 */
export function deleteStoreCollection(store_id) {
  return http.request({
    url: `/member/storeCollection/delete/STORE/${store_id}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 获取商品是否被收藏
 * @param good_id
 */
export function getGoodsIsCollect(type, good_id) {
  return http.request({
    url: `/member/collection/isCollection/${type}/${good_id}`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}


/**
 * 获取商品是否被收藏
 * @param good_id
 */
export function getStoreIsCollect(type, store_id) {
  return http.request({
    url: `/member/storeCollection/isCollection/${type}/${store_id}`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 收藏店铺
 * @param store_id 店铺ID
 * @returns {AxiosPromise}
 */
export function collectionStore(store_id) {
  return http.request({
    url: `/member/storeCollection/add/STORE/${store_id}`,
    method: Method.POST,
    needToken: true,
  });
}
/**
 * 清空我的收藏列表
 * @param pageNumber  pageSize
 *
 */
export function delMyCollectList(params) {
  return http.request({
    url: `/member/collection/delete/allGoods`,
    method: Method.DELETE,
    needToken: true,
    params,
  });
}
/**
 * 获取当前登录的用户信息
 * @returns {AxiosPromise}
 */
export function getUserInfo() {
  return http.request({
    url: "/passport/member",
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取当前用户的预存款
 * @returns {AxiosPromise}
 */
export function getUserWallet() {
  return http.request({
    url: "/wallet/wallet",
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 保存用户信息
 * @param params
 * @returns {AxiosPromise}
 */
export function saveUserInfo(params) {
  return http.request({
    url: "/passport/member/editOwn",
    method: Method.PUT,
    header: { "content-type": "application/json" },
    needToken: true,
    data: params,
  });
}

/**
 * 添加发票
 * @param params
 */
export function addReceipt(params) {
  return http.request({
    url: "/trade/receipt",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 获取商品评价列表
 * @param goodsId
 * @param params
 */
export function getGoodsComments(goodsId, params) {
  return http.request({
    url: `/member/evaluation/${goodsId}/goodsEvaluation`,
    method: Method.GET,
    loading: false,
    params,
  });
}

/**
 * 获取商品评价数量统计
 * @param goodsId
 */
export function getGoodsCommentsCount(goodsId) {
  return http.request({
    url: `/member/evaluation/${goodsId}/evaluationNumber`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取未读消息数量信息
 */
export function getNoReadMessageNum() {
  return http.request({
    url: `members/member-nocice-logs/number`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 我的足迹列表
 * @param pageNumber  pageSize
 *
 */
export function myTrackList(params) {
  return http.request({
    url: `/member/footprint`,
    method: Method.GET,
    needToken: true,
    params,
  });
}
/**
 * 清空我的足迹列表
 * @param pageNumber  pageSize
 *
 */
export function delMyTrackList(params) {
  return http.request({
    url: `/member/footprint`,
    method: Method.DELETE,
    needToken: true,
    params,
  });
}

/**
 * 根据id删除用户足迹
 * @param id
 */
export function deleteHistoryListId(ids) {
  return http.request({
    url: `/member/footprint/delByIds/${ids}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 获取当前用户优惠券列表
 * @param
 */
export function getMemberCoupons(data) {
  return http.request({
    url: `/promotion/coupon/getCoupons`,
    method: Method.GET,
    needToken: true,
    params: data,
  });
}

/**
 * 获取当前用户可使用的优惠券数量
 *
 */
export function getCouponsNum() {
  return http.request({
    url: `/promotion/coupon/getCouponsNum`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取用户积分VO
 * @param
 */
export function getMemberPointSum() {
  return http.request({
    url: `member/memberPointsHistory/getMemberPointsHistoryVO`,
    method: Method.GET,
  });
}

/**
 * 获取用户积分VO
 * @param
 */
export function withdrawalSettingVO() {
  return http.request({
    url: `/wallet/wallet/withdrawalSettingVO`,
    method: Method.GET,
    needToken: true,
  });
}
// 获取用户积分列表
export function getPointsList(params) {
  return http.request({
    url: `/member/memberPointsHistory/getPointsDetails`,
    method: Method.GET,
    needToken: true,
    params
  });
}

/**
 * 查询用户身材
 * @param
 */
export function getMemberFigure() {
  return http.request({
    url: `member/figure`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 修改用户身材
 * @param params
 * @returns {AxiosPromise}
 */
export function saveUserFigure(params) {
  return http.request({
    url: "member/figure",
    method: Method.PUT,
    needToken: true,
    data: params,
  });
}
/**
 * 我的偏好列表
 * @param pageNumber  pageSize
 *
 */
export function preferenceList(params) {
  return http.request({
    url: `/member/preference/list`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 用户实名认证
 * @param params
 *
 */
export function certification(params) {
  return http.request({
    url: `/passport/member/certification`,
    method: Method.POST,
    needToken: true,
    data: params,
  });
}
/**
 * 识别身份证号
 */
export function OCRIdCard(params) {
  return http.request({
    url: api.common + "/common/ocr/IdCard",
    method: Method.POST,
    needToken: true,
    params
  });
}
/**
 * 用户是否实名认证过
 *
 */
export function getAuthenticationFlag() {
  return http.request({
    url: `/passport/member/getAuthenticationFlag`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 绑定手机号
 */
export function bindMobile(params) {
  return http.request({
    url: `/passport/member/bindMobile`,
    method: Method.POST,
    needToken: true,
    params
  })
}
/**
 * 绑定邮箱
 */
export function bindMailBox(params) {
  return http.request({
    url: `/member/mailbox/update`,
    method: Method.PUT,
    needToken: true,
    params
  })
}

/**
 * 绑定中品一号用户
 */
export function bindZpMember(params) {
  return http.request({
    url: `/member/bind/update`,
    method: Method.PUT,
    needToken: true,
    params
  })
}
/**
 * 绑定中品一号用户
 */
export function bindUpdateByType(params) {
  return http.request({
    url: `/member/bind/updateByType`,
    method: Method.PUT,
    needToken: true,
    params
  })
}
/**
 * 订单评价
 * @param params
 */
export function evaluationAdd(params) {
  return http.request({
    url: "/member/evaluation/add",
    method: Method.POST,
    needToken: true,
    data: params,
  });
}
/**
 * 修改评价
 * @param params
 */
export function batchUpdate(params) {
  return http.request({
    url: "/member/evaluation/batchUpdate",
    method: Method.PUT,
    needToken: true,
    data: params,
  });
}
/**
 * 查询订单商品
 * @param orderSn 订单编号
 */
export function getOrderGoods(orderSn) {
  return http.request({
    url: `/member/evaluation/${orderSn}/before`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 根据手机号和验证码获取中品一号用户信息
 */
export function getZpMemberInfo(params) {
  return http.request({
    url: `/member/ZhongPin/checkZPByPhone`,
    method: Method.GET,
    needToken: true,
    params
  })
}
// 提交分平台服务商入驻第1步 校验用户资格
export function applyDealerCheckAccount(params) {
  return http.request({
    url: `/member/ZhongPin/checkAccount`,
    method: Method.GET,
    needToken: true,
    params
  })
}

/**
 * 根据用户订单sn获取订单评价
 * @param orderSn 订单编号
 */
export function getMemberEvaluation(orderSn) {
  return http.request({
    url: `/member/evaluation/${orderSn}/get`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 取消申请
 */
export function applyCancel() {
  return http.request({
    url: `/passport/member/cancel`,
    method: Method.POST,
    needToken: true,
  })
}


/**
 * 忘记密码-短信验证码验证
 */
export function memberResetByMobile(params) {
  return http.request({
    url: `/passport/member/resetByMobile`,
    method: Method.POST,
    params
  })
}

/**
 * 忘记密码-短信验证码验证
 */
export function getUserNameByMobile(params) {
  return http.request({
    url: `/passport/member/getUserNameByMobile`,
    method: Method.GET,
    params
  })
}

/**
 * 忘记密码-短信验证码验证
 */
export function memberRePassword(params) {
  return http.request({
    url: `/passport/member/resetPassword`,
    method: Method.POST,
    params
  })
}
// 获取用户银行卡列表
export function getMemberBank() {
  return http.request({
    url: `/member/bank`,
    method: Method.GET,
    needToken: true,
  })
}
// 添加银行卡
export function addMemberBank(data) {
  return http.request({
    url: "/member/bank",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/json" },
    data,
  });
}
// 删除银行卡
export function delMemberBank(id) {
  return http.request({
    url: `/member/bank/${id}`,
    method: Method.DELETE,
    needToken: true,
  });
}
// 设置默认银行卡
export function updateDefaultMemberBank(params) {
  return http.request({
    url: `/member/bank`,
    method: Method.PUT,
    needToken: true,
    params
  });
}
// 验证手机验证码
export function verifyMobile(params) {
  return http.request({
    url: `/passport/member/changeMobileCode?mobile=${params.mobile}&code=${params.code}`,
    method: Method.POST,
    needToken: true,
  });
}









