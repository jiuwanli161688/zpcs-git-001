/**
 * 公共导航跳转工具
 * 统一处理应用内的页面跳转逻辑
 */


/**
 * 跳转类型枚举
 */
export const JUMP_TYPE = {
  ABOUT_ZPWD: 'ABOUT_ZPWD',           // 关于我们
  GOODS_DETAIL: 'GOODS_DETAIL',   // 商品详情页
  SHOPPING_CART: 'SHOPPING_CART', // 购物车页
  MY_COLLECTION: 'MY_COLLECTION', // 我的收藏
  SPECIAL_SECTION: 'SPECIAL_SECTION', // 专题页
  MY_FOOTPRINT: 'MY_FOOTPRINT',   // 我的足迹
  MY_ORDER: 'MY_ORDER',           // 我的订单
  MY_WALLET: 'MY_WALLET'          // 我的钱包
}

/**
 * 统一的页面跳转方法
 * @param {Object} params - 跳转参数对象
 * @param {string} params.jumpType - 跳转类型，使用 JUMP_TYPE 枚举值
 * @param {string} params.skuId - 商品skuId（商品详情页需要）
 * @param {string} params.goodsId - 商品goodsId（商品详情页需要）
 * @param {string} params.specialSectionId - 专题ID（专题页需要）
 * @param {string} params.title - 页面标题
 * @param {string} params.url - 外部链接URL
 * @param {string} params.path - 直接页面路径
 */
export function handleNavigation(params) {
  if (!params) {
    return
  }

  const { jumpType, skuId, goodsId, specialSectionId, title, url, path } = params

  // 如果提供了直接的页面路径，优先使用
  if (path && path.startsWith('/pages/')) {
    uni.navigateTo({
      url: path
    })
    return
  }

  // 如果提供了外部链接，跳转到webView
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    uni.navigateTo({
      url: `/pages/webView/webView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '详情')}`
    })
    return
  }

  // 根据跳转类型处理内部页面跳转
  let targetUrl = ''
  switch (jumpType) {
    case JUMP_TYPE.ABOUT_ZPWD:
      // 关于我们
      targetUrl = '/pages/profile/about'
      break

    case JUMP_TYPE.GOODS_DETAIL:
      // 商品详情页（需要两个参数：id和goodsId）
      if (goodsId && skuId) {
        targetUrl = `/pages/product/goods?id=${skuId}&goodsId=${goodsId}`
      }
      break

    case JUMP_TYPE.SHOPPING_CART:
      // 购物车
      targetUrl = '/pages/tabbar/cart/cartList'
      break

    case JUMP_TYPE.MY_COLLECTION:
      // 我的收藏
      targetUrl = '/pages/profile/collect'
      break

    case JUMP_TYPE.SPECIAL_SECTION:
      // 专题页（需要一个参数）
      if (specialSectionId) {
        targetUrl = `/pages/region/thematic-page?id=${specialSectionId}`
      }
      break

    case JUMP_TYPE.MY_FOOTPRINT:
      // 我的足迹
      targetUrl = '/pages/profile/track'
      break

    case JUMP_TYPE.MY_ORDER:
      // 我的订单
      targetUrl = '/pages/profile/order/home?state=0'
      break

    case JUMP_TYPE.MY_WALLET:
      // 我的钱包
      targetUrl = '/pages/profile/wallet/home'
      break

    default:
      return
  }

  if (targetUrl) {
    uni.navigateTo({
      url: targetUrl
    })
  }
}


