import { http, Method } from "@/utils/request.js";


export function toSpecial(data) {
  return http.request({
    url: `/other/pageData/getSpecial`,
    method: Method.GET,
    data
  });
}
/**
 * 专题内容
 */
export function getSpecial(id) {
  return http.request({
    url: `/other/pageData/get/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取广告图
 */
export function getAdvertisement(params) {
  return http.request({
    url: "/advertising/list",
    method: Method.GET,
    params
  });
}


/**
 * 获取首页楼层分类
 */
export function getFloorList(params) {
  return http.request({
    url: "/floor/floor/list",
    method: Method.GET,
    params
  })

}

/**
 * 获取首页热门分类
 */
export function getCategoryPopular(params) {
  return http.request({
    url: "/goods/categoryPopular",
    method: Method.GET,
    params
  })
}

/**
 * 热卖商品查询
 */
export function getHotSelling(params) {
  return http.request({
    url: "/goods/goods/es/hotSelling",
    method: Method.GET,
    params
  })
}

/**
 * 推荐商品查询
 */
export function getRecommendGoods(params) {
  return http.request({
    url: "/goods/goods/category/recommend",
    method: Method.GET,
    params
  })
}



/**
 * 获取首页商品分类
 * @param parent_id
 */
export function getCategory(parent_id = 0) {
  return http.request({
    url: `goods/categories/${parent_id}/children`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取热门关键词
 * @param num
 */
export function getHotKeywords(count) {
  return http.request({
    url: "/goods/goods/hot-words",
    method: Method.GET,
    loading: false,
    params: { count },
  });
}

/**
 * 获取楼层数据
 * @param client_type
 * @param page_type
 */
export function getFloorData(params) {
  return http.request({
    url: `/other/pageData/getIndex?clientType=H5`,
    method: "get",
    params
  });
}

/**
 * 获取店铺楼层数据
 */
export function getFloorStoreData(params) {
  return http.request({
    url: `/other/pageData?pageClientType=H5`,
    method: "get",
    params
  });
}

/**
 * 获取获取首页分类数据
 */
export function getCategoryIndexData(parentId = 0) {
  return http.request({
    // url: `/goods/category/get/${parentId}`,
    url: `/goods/category/topTwoLevel`,
    method: "get",
  });
}
/**
 * 获取公告管理查询接口
 */
export function getNoticeList() {
  return http.request({
    url: `/information/list`,
    method: "get",
  });
}
/**
 * 获取公告详情
 */
export function getNoticeDetail(params) {
  return http.request({
    url: `/information/detail`,
    method: "get",
    params
  });
}
/**
 * 获取首页最近购买商品
 */
export function getRecentlyBuyGood(params) {
  return http.request({
    url: "/goods/goods/recently/recommend",
    method: Method.GET,
    params
  })
}

