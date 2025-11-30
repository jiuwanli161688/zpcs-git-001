/**
 * 公共API
 */
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";

/**
 * 获取地区数据
 * @param id
 */
export function getRegionsById(id = 0) {
  return http.request({
    url: `${api.common}/common/region/item/${id}`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 获取站点基本信息
 */
export function getSiteBase() {
  return http.request({
    url: `${api.common}/common/site`,
    method: Method.GET,
    message: false,
  });
}
/**
 * 获取站点客服信息
 */
export function getSiteCustomService() {
  return http.request({
    url: `${api.common}/common/site/IM`,
    method: Method.GET,
    message: false,
  });
}

// 获取IM接口前缀
export function getIMDetail() {
  return http.request({
    url: `${api.common}/IM`,
    method: Method.GET,
    message: false,
  });
}
// 查询字典
export function getDictData(params) {
  return http.request({
    url: `${api.common}/common/dict/buyerData`,
    method: Method.GET,
    message: false,
    params: params
  });
}

// 营业执照识别
export function businessLicenseOcr(params) {
  return http.request({
    url: `${api.common}/common/ocr/businessLicense`,
    method: Method.POST,
    message: false,
    params: params
  });
}
// 身份证识别
export function idCardOcr(params) {
  return http.request({
    url: `${api.common}/common/ocr/IdCard`,
    method: Method.POST,
    message: false,
    params: params
  });
}
// 企业签章识别
export function signatureOcr(params) {
  return http.request({
    url: `${api.common}/common/ocr/seal`,
    method: Method.POST,
    message: false,
    params: params
  });
}
// 银行卡识别
export function ocrBank(params) {
  return http.request({
    url: `${api.common}/common/ocr/bank`,
    method: Method.POST,
    message: false,
    needToken: true,
    params: params
  });
}

// 计算
export function mathCalc(params) {
  return http.request({
    url: `${api.common}/common/math/calc`,
    method: Method.GET,
    message: false,
    needToken: true,
    params: params
  });
}


/**
 * 文件上传地址
 * @type {string}
 */
// 公共上传
export const upload = api.common + "/common/upload/file";
// 私桶上传
export const uploadPrivateFile = api.common + "/common/file/privateFile";
/**
 * 获取服务商权益内容
 */
export function getBriefContent() {
  return http.request({
    url: `${api.common}/setting/get/DISTRIBUTOR_SETTING`,
    method: "get"
  });
}
// 获取分页数量配置
export function getPageConfig() {
  return http.request({
    url: `${api.common}/setting/get/PAGE_SETTING`,
    method: "get"
  });
}
// 识别 基础存款账户信息

export function ocrBasicDepositAccount(params){
  return http.request ({
    url:`${api.common}/common/ocr/basicDepositAccount`,
    method: Method.POST,
    needToken: true,
    params
  })
}
// 文件上传·
export function uploadFile(params){
  return http.request({
    url: `${api.common}/common/upload/file`,
    method: Method.POST,
    needToken: true,
    data:params
  })
}
export function getUpgradeStatus() {
  // 与项目其他配置保持一致的环境判断
  const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
  return http.request({
    url: api.JSON_URL,
    method: Method.GET,
    needToken: false
  });
}