/**
 * 店铺相关API
 */

import { http, Method } from '@/utils/request.js';




/**
 * 获取店铺列表
 * @param params
 */
export function getStoreList(params) {
    return http.request({
        url: '/store/store',
        method: Method.GET,
        params,
    });
}

/**
 * 获取店铺基本信息
 * @param storeId
 */
export function getStoreBaseInfo(storeId) {
    return http.request({
        url: `/store/store/get/detail/${storeId}`,
        method: Method.GET,
        loading: false,
    });
}
/**
 * 获取修改店铺待审核基本信息
 * @param storeId
 */
export function getReturnAndWaitCompanyInfo(storeId) {
    return http.request({
        url: `/store/store/getReturnAndWaitCompanyInfo`,
        method: Method.GET,
        loading: false,
    });
}



/**
 * 获取店铺分类
 * @param id
 */
export function getStoreCategory(id) {
    return http.request({
        url: `/store/store/label/get/${id}`,
        method: Method.GET,
    });
}


/**
 * 营业执照
 * @param id
 */
export function getLicencePhoto(id) {
    return http.request({
        url: `/store/store/get/licencePhoto/${id}`,
        method: Method.GET,
    });
}


/**
 * 获取自提点信息
 * @param id
 */
export function getStoreAddress(storeId, params) {
    return http.request({
        url: `/store/address/page/${storeId}`,
        method: Method.GET,
        params
    });
}


/**
 * 提交店铺资料 第一步
 * @param params
 */
export function applySupplierFirst(params) {
    return http.request({
        url: `/store/store/applySupplier/first`,
        method: Method.PUT,
        params
    });
}

/**
 * 提交店铺资料 第一步-新接口
 * @param params
 */
export function applySupplierFirst2(data) {
    return http.request({
        url: `/store/store/applySupplier/first2`,
        method: Method.PUT,
        data
    });
}

/**
 * 店铺资料 第一步回显
 */
export function applySupplierFirstEcho() {
    return http.request({
        url: `/store/store/applySupplier/firstEcho`,
        method: Method.GET,
    });
}

/**
 * 提交店铺资料 第二步，类目与资质
 * @param data
 */
export function applySupplierSecond(data) {
    return http.request({
        url: `/store/store/applySupplier/second`,
        method: Method.PUT,
        data
    });
}

/**
 * 提交店铺资料 第二步，类目与资质
 */
export function applySupplierThirdCheck(params) {
    return http.request({
        url: `/store/store/applySupplier/thirdCheck`,
        method: Method.POST,
        params
    });
}

/**
 * 提交店铺资料 第二步，类目与资质
 */
export function applySupplierSecondEcho() {
    return http.request({
        url: `/store/store/applySupplier/secondEcho`,
        method: Method.GET,
    });
}

/**
 * 提交店铺资料 提交预览
 * @param params
 */
export function applySupplierEcho(params) {
    return http.request({
        url: `/store/store/applySupplier/echo`,
        method: Method.GET,
        params
    });
}
/**
 * 提交店铺资料 -第四步 添加企业签章与签字照片
 * @param params
 */
export function applySupplierFourth(params) {
    return http.request({
        url: `/store/store/applySupplier/fourth`,
        method: Method.PUT,
        params
    });
}

/**
 * 提交店铺资料 -续签 添加企业签章与签字照片
 * @param params
 */
export function renewApplySupplierFourth(params) {
    return http.request({
        url: `/store/store/applyRenew`,
        method: Method.PUT,
        params
    });
}

/**
 * 提交店铺资料 -第四步 添加企业签章与签字照片 回显
 * @param params
 */
export function applySupplierFourthEcho(params) {
    return http.request({
        url: `/store/store/applySupplier/fourthEcho`,
        method: Method.GET,
        params
    });
}

/**
 * 提交店铺资料 - 获取审核信息
 * @param params
 */
export function applySupplierReviewInfo(params) {
    return http.request({
        url: `/store/store/applySupplier/reviewInfo`,
        method: Method.GET,
        params
    });
}

/**
 * 获取店铺信息
 */
export function getStoreInfo() {
    return http.request({
        url: `/store/store/getStore`,
        method: Method.GET,
    });
}

/**
 * 修改店铺基本资料
 * @param params
 */
export function editStoreBaseInfo(params) {
    return http.request({
        url: `/store/store/editStoreBaseInfo`,
        method: Method.PUT,
        params
    });
}

/**
 * 获取店铺退件地址列表
 */
export function getStoreAddressList() {
    return http.request({
        url: `/store/address/getList`,
        method: Method.GET,
    });
}

/**
 * 获取店铺配送模板列表
 */
export function getStoreFreightTemplates() {
    return http.request({
        url: `/store/store/getFreightTemplates`,
        method: Method.GET,
    });
}/**
 * 获取店铺配送模板详情
 */
export function getFreightTemplateDetail(params) {
    return http.request({
        url: `/store/store/getFreightTemplateDetail`,
        method: Method.GET,
        params
    });
}


/**
 * 新增修改店铺退件地址
 */
export function editStoreAddress(params) {
    return http.request({
        url: `/store/address/edit`,
        method: Method.PUT,
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: params,
    });
}
/**
 * 查看店铺退件地址
 */
export function getStoreAddressDetail(id) {
    return http.request({
        url: `/store/address/getAddressDetail/${id}`,
        method: Method.GET,
    });
}
/**
 * 删除店铺退件地址
 */
export function deleteStoreAddressDetail(id) {
    return http.request({
        url: `/store/address/delete/${id}`,
        method: Method.DELETE,
    });
}

/**
 * 获取店铺经营类目
 */
export function getStoreAllCategory() {
    return http.request({
        url: `/store/store/getAllCategory`,
        method: Method.GET,
    });
}

/**
 * 追加店铺经营类目
 */
export function appendStoreAllCategory(data) {
    return http.request({
        url: `/store/store/appendCategory`,
        method: Method.PUT,
        data
    });
}

/**
 * 获取店铺结算单列表
 */
export function getStoreSettlementInfo(params) {
    return http.request({
        url: `/settlement/member/getSettlementInfo`,
        method: Method.GET,
        params
    });
}

/**
 * 获取店铺结算单详情
 */
export function getStoreSettlementInfoDetail(params) {
    return http.request({
        url: `/settlement/member/getSettlementDetails`,
        method: Method.GET,
        params
    });
}

/**
 * 获取商品详情
 */
export function getStoreGoodsList(params) {
    return http.request({
        url: `/store/goods/list`,
        method: Method.GET,
        params
    });
}

/**
 * 供应商商品商家
 */
export function storeGoodsUp(params) {
    return http.request({
        url: `/store/goods/up`,
        method: Method.PUT,
        params
    });
}
/**
 * 供应商商品下架
 */
export function storeGoodsUnder(params) {
    return http.request({
        url: `/store/goods/under`,
        method: Method.PUT,
        params
    });
}

/**
 * 供应商商品删除
 */
export function storeGoodsDelete(params) {
    return http.request({
        url: `/store/goods/delete`,
        method: Method.PUT,
        params
    });
}

/**
 * 供应商商品规格信息查询
 */
export function storeGoodsSkuInfo(goodsId) {
    return http.request({
        url: `/store/goods/sku/${goodsId}`,
        method: Method.GET,
    });
}


/**
 * 统一修改商品下的全部规格库存
 */
export function storeGoodsUpdateStock(data) {
    return http.request({
        url: `/store/goods/update/stocks`,
        method: Method.PUT,
        data
    });
}

/**
 * 统一修改商品下的全部规格价格--新接口
 */
export function storeGoodsUpdatePriceSelfCost(data) {
    return http.request({
        url: `/store/goods/update/prices`,
        method: Method.PUT,
        data
    });
}

/**
 * 查询供应商自己的订单列表
 */
export function storeOrderList(params) {
    return http.request({
        url: `/order/order/store/page`,
        method: Method.GET,
        params
    });
}

/**
 * 查询供应商自己的订单详情
 */
export function storeOrderDetail(sn) {
    return http.request({
        url: `/order/order/${sn}`,
        method: Method.GET,
    });
}

/**
 * 获取上次填写的寄件人手机号
 */
export function getLastDeliveryPhone() {
    return http.request({
        url: `/order/order/last/delivery/phone`,
        method: Method.GET,
    });
}

/**
 * 商家查看自己的售后列表
 */
export function storeAfterSalePage(params) {
    return http.request({
        url: `/order/afterSale/StorePage`,
        method: Method.GET,
        params
    });
}

/**
 * 商家查看自己的售后详情
 */
export function storeAfterSaleDetail(sn) {
    return http.request({
        url: `/order/afterSale/get/${sn}`,
        method: Method.GET,
    });
}

/**
 * 商家审核自己的售后
 */
export function storeAfterSaleReview(sn, params) {
    return http.request({
        url: `/order/afterSale/review/${sn}`,
        method: Method.PUT,
        params
    });
}

/**
 * 商家签收自己的售后
 */
export function storeAfterSaleConfirm(sn, params) {
    return http.request({
        url: `/order/afterSale/confirm/${sn}`,
        method: Method.PUT,
        params
    });
}

/**
 * 商家处理自己的售后退换货
 */
export function storeAfterSaleHandlingGoods(sn, params) {
    return http.request({
        url: `/order/afterSale/handlingGoods/${sn}`,
        method: Method.PUT,
        params
    });
}
/**
 * 商家补发售后
 */
export function storeAfterSaleReissue(sn, params) {
    return http.request({
        url: `/order/afterSale/reissue/${sn}`,
        method: Method.POST,
        params
    });
}
/**
 * 获取商家自己的物流公司
 */
export function storeLogistics(params) {
    return http.request({
        url: `/order/order/store/logistics`,
        method: Method.GET,
        params
    });
}

/**
 * 商家发货
 */
export function storeDelivery(params) {
    return http.request({
        url: `/order/order/${params.sn}/partDelivery`,
        method: Method.POST,
        data: params,
    });
}

/**
 * 商家查看自己的投诉列表
 */
export function storeComplainPage(params) {
    return http.request({
        url: `/order/complain/seller`,
        method: Method.GET,
        params
    });
}

/**
 * 商家查看自己的投诉详情
 */
export function storeComplainDetail(id) {
    return http.request({
        url: `/order/complain/${id}`,
        method: Method.GET,
    });
}

/**
 * 商家举证
 */
export function storeComplainEvidenceAdd(data) {
    return http.request({
        url: `/order/complain/evidence/add/seller`,
        method: Method.POST,
        data
    });
}
/**
 * 修改服务商/供应商 结算信息
 */
export function updateInformation(data) {
    return http.request({
        url: `/passport/member/updateSettlementMemberBankInfo`,
        method: Method.POST,
        data
    });
}
/**
 * 供应商修改基本信息
 */
export function updateBasicInformation(data) {
    return http.request({
        url: `/store/store/updateBaseInformation`,
        method: Method.POST,
        data
    });
}




