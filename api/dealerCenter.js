import { http, Method } from "@/utils/request.js";

/**
 * 查询余额、冻结金额、待入账金额、累计收入
 */
export function getDistributorMoney() {
    return http.request({
        url: '/distributor/distributor/getDistributorMoney',
        method: "GET",
        needToken: true
    })
}

/**
 * 查询当前分平台服务商用户的流水
 */
export function getStoreWallet(data) {
    return http.request({
        url: '/distributor/distributor/getStoreWallet',
        method: "GET",
        data,
        needToken: true
    })
}


/**
 * 查询店铺信息
 */
export function getDealerCompanyInfo() {
    return http.request({
        url: "/distributor/distributor/centerCompanyInfo",
        method: Method.GET,
        needToken: true,
    });
}
// 服务商待审核已拒绝店铺信息
export function getReturnAndWaitCompanyInfo() {
    return http.request({
        url: "/distributor/distributor/getReturnAndWaitCompanyInfo",
        method: Method.GET,
        needToken: true,
    });
}

/**
 * 修改店铺信息
 */
export function updateDealerCompanyInfo(data) {
    return http.request({
        url: "/distributor/distributor/updateCenterCompanyInfo",
        method: Method.PUT,
        needToken: true,
        header: {
            "Content-Type": "application/json",
        },
        data,
    });
}
/**
 * 修改银行卡信息
 */
export function dealerUpdateData(data) {
    return http.request({
        url: "/passport/member/updateSettlementMemberBankInfo",
        method: Method.POST,
        needToken: true,
        header: {
            "Content-Type": "application/json",
        },
        data,
    });
}
/**
 * 获取分平台服务商结算单列表
 */
export function getSettlementInfo(params) {
    return http.request({
        url: `/settlement/member/getSettlementInfo`,
        method: Method.GET,
        params
    });
}
// 获取服务商邀请的用户信息列表
export function getInviteUserList(params) {
    return http.request({
        url: `/distributor/distributor/getInviteUserList`,
        method: Method.GET,
        params
    });
}
// 获取服务商邀请的厂商信息列表
export function getInviteStoreList(params) {
    return http.request({
        url: `/distributor/distributor/getInviteSupplierList`,
        method: Method.GET,
        params
    });
}
/**
 * 获取分平台服务商结算单详情
 */
export function getSettlementInfoDetail(params) {
    return http.request({
        url: `/settlement/member/getSettlementDetails`,
        method: Method.GET,
        params
    });
}

/**
 * 获取售后服务记录相关数据
 * @param params 参数
 */
export function getDealerAfterSaleList(params) {
    return http.request({
        url: `/order/afterSale/DistributorPage`,
        method: Method.GET,
        needToken: true,
        params,
    });
}

/**
 * 查看售后服务详情
 * @param sn 售后服务单编号
 */
export function getDealerServiceDetail(sn) {
    return http.request({
        url: `/order/afterSale/get/${sn}`,
        method: Method.GET,
        needToken: true,
    });
}

/**
 * 售出/推荐类交易管理
 */
export function getOrder(data) {
    return http.request({
        url: "/order/order/getOrder",
        method: "GET",
        data,
        needToekn: true,
    })
}

/**
 * 售出/推荐类交易管理-详情
 */
export function getDealerOrderDetail(data) {
    return http.request({
        url: "/distributor/distributor/getOrderDetail",
        method: "GET",
        data,
        needToken: true,
    })
}

/**
 * 交易管理-快报
 */
export function statistics() {
    return http.request({
        url: "/distributor/distributor/statistics",
        method: "GET",
        needToken: true,
    })
}

/**
 * 交易管理-结果
 */
export function statisticsByDate(data) {
    return http.request({
        url: "/distributor/distributor/statisticsByDate",
        method: "GET",
        data,
        needToken: true,
    })
}
// 查看分平台服务商合作协议
export function getCooperationAgreement() {
    return http.request({
        url: "/distributor/distributor/getCooperationAgreement",
        method: "GET",
        needToken: true,
    })
}

// 获取分平台服务商详情
export function getDealerDetail() {
    return http.request({
        url: "/distributor/distributor/getInfo",
        method: "GET",
        needToken: true,
    })
}
// 获取服务商待结算
export function getEstimatedRevenue(params) {
    return http.request({
        url: "/distributor/distributor/estimatedRevenue",
        method: "GET",
        params,
        needToken: true,
    })
}
// 服务商查看未结算订单列表
export function getNoSettlementOrderList(params) {
    return http.request({
        url: "/distributor/distributor/getNoSettlementOrderList",
        method: "GET",
        params,
        needToken: true,
    })
}
// 服务商结算管理列表
export function getSettlementManage(params) {
    return http.request({
        url: "/distributor/distributor/settlementManage",
        method: "GET",
        params,
        needToken: true,
    })
}
// 生成结算单
export function submitSettlement(data) {
    return http.request({
        url: "/distributor/distributor/submit/new",
        method: "POST",
        data,
        needToken: true,
    })
}
// pdf识别
export function identifyInvoice(params) {
    return http.request({
        url: "/distributor/distributor/identifyInvoice",
        method: "GET",
        params,
        needToken: true,
    })
}
// 上传发票接口保存
export function uploadInvoice(params) {
    return http.request({
        url: "/distributor/distributor/uploadInvoice",
        method: "PUT",
        params,
        needToken: true,
    })
}




