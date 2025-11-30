import storage from "@/utils/storage";
import { http, Method } from "@/utils/request.js";


/**
 * 查询本人发票模板列表
 */
export function invoiceTemplate(params) {
    return http.request({
        url: "/member/invoiceTemplate",
        method: Method.GET,
        needToken: true,
        params,
    });
}

/**
 * 添加发票模板
 */
export function addInvoiceTemplate(data) {
    return http.request({
        url: "/member/invoiceTemplate",
        method: Method.POST,
        needToken: true,
        header: { "content-type": "application/json" },
        data,
    });
}
// 根据公司名称获取公司信息
export function getCompanyInfo(params) {
    return http.request({
        url: "/passport/member/getCompanyInfo",
        method: Method.GET,
        needToken: true,
        params,
    });
}

/**
 * 添加发票模板
 */
export function updateInvoiceTemplate(data) {
    return http.request({
        url: "/member/invoiceTemplate",
        method: Method.PUT,
        needToken: true,
        header: { "content-type": "application/json" },
        data,
    });
}

/**
 * 删除发票模板
 */
export function delInvoiceTemplate(params) {
    return http.request({
        url: "/member/invoiceTemplate",
        method: Method.DELETE,
        needToken: true,
        params,
    });
}

/**
 * 查看发票详情
 */
export function detailInvoiceTemplate(params) {
    return http.request({
        url: "/member/invoiceTemplate/"+params.id,
        method: Method.GET,
        needToken: true,
    });
}

/**
 * 发票列表
 * @param params
 */
export function getReceiptList(params) {
    return http.request({
      url: "/trade/receipt",
      method: Method.GET,
      needToken: true,
      params,
    });
  }
  /**
 * 申请发票信息
 */
export function getInvoiceInfo(orderSn) {
    return http.request({
        url: "/trade/receipt/before/"+orderSn,
        method: Method.GET,
        needToken: true,
    });
}
/**
 * 申请发票信息
 */
export function applyInvoice(data) {
    return http.request({
        url: "/trade/receipt/requestRequest",
        method: Method.POST,
        needToken: true,
        header: { "content-type": "application/json" },
        data,
    });
}

/**
 * 发票详情
 *
*/
  export function invoiceDetail(orderSn) {
    return http.request({
        url: "/trade/receipt/get/"+orderSn,
        method: Method.GET,
        needToken: true,
    });
}
/**
 * 申请重开发票
 */
export function reopenInvoice(data) {
    return http.request({
        url: "/trade/receipt/reissue/",
        method: Method.PUT,
        needToken: true,
        header: { "content-type": "application/json" },
        data,
    });
}
/**
 * 下载发票
 *
*/
export function invoiceDownload(id) {
    return http.request({
        url: "/trade/receipt/download/"+id,
        method: Method.GET,
        needToken: true,
    });
}

/**
 * 发送发票到邮箱
 *
*/
export function invoiceSendEmail(id) {
    return http.request({
        url: "/trade/receipt/sendEmail/"+id,
        method: Method.GET,
        needToken: true,
    });
}
// 获取是否设置过企业发票模板
export function getIseSetInvoice(){
    return http.request({
      url: `/member/invoiceTemplate/hasEnterpriseTemplate`,
      method: Method.GET,
      needToken: true,
    })
  }




