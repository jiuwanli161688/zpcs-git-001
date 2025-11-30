/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
  // common: "http://192.168.77.104:8890",
  // buyer: "http://192.168.77.104:8888",
  // common: "https://t-admin.zpwdsc.com/common-api",
  // buyer: "https://t-admin.zpwdsc.com/buyer-api",
  common: "http://10.120.0.12:18891",
  buyer: "http://10.120.0.12:18888",
  im: "http://192.168.77.104:9999",
  CUSTOMER_BASE_URL: 'http://192.168.77.104:8080', // 客服系统地址
  JSON_URL:'https://zpwdsc.oss-cn-beijing.aliyuncs.com/SYSTEM/api/dev/upgrade.json'

};
// 生产环境
const prod = {
  im: "https://mobile.zpwdsc.com/im-api",
  common: "https://mobile.zpwdsc.com/common-api",
  buyer: "https://mobile.zpwdsc.com/buyer-api",
  CUSTOMER_BASE_URL:'https://crm.zpwdsc.com/crm-api', // 客服系统地址
  JSON_URL:'https://zpwdsc.oss-cn-beijing.aliyuncs.com/SYSTEM/api/prod/upgrade.json'
};

//默认生产环境
let api = dev;
//如果是开发环境
if (process.env.NODE_ENV == "development") {
  api = dev;
} else {
  api = prod;
}
//微信小程序，app的打包方式建议为生产环境，所以这块直接条件编译赋值
// #ifdef MP-WEIXIN || APP-PLUS
api = dev;
// api = dev;
// #endif

api.buyer += "/buyer";
api.common += "/common";
api.im += "/him";
api.CUSTOMER_BASE_URL;
export default {
  ...api,
};
