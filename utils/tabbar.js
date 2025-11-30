/**
 * 自定义tabbar跳转工具函数
 * 由于使用了自定义tabbar，原生switchTab无法使用，统一使用此函数进行tabbar页面跳转
 */

// tabbar页面路径映射
const TABBAR_PAGES = {
  home: '/pages/tabbar/home/index',
  boutique: '/pages/region/weidu-boutique',
  cart: '/pages/tabbar/cart/cartList',
  profile: '/pages/tabbar/user/profile'
}

/**
 * 跳转到tabbar页面
 * @param {string} page - 页面标识 (home|boutique|cart|profile)
 * @param {string} url - 自定义URL，优先级高于page参数
 */
export function switchTab(page, url = '') {
  const targetUrl = url || TABBAR_PAGES[page]

  if (!targetUrl) {
    console.error('Invalid tabbar page:', page)
    return
  }

  uni.reLaunch({
    url: targetUrl
  })
}

/**
 * 跳转到首页
 */
export function goHome() {
  switchTab('home')
}

/**
 * 跳转到维度精品页
 */
export function goBoutique() {
  switchTab('boutique')
}

/**
 * 跳转到购物车页
 */
export function goCart() {
  switchTab('cart')
}

/**
 * 跳转到个人中心页
 */
export function goProfile() {
  switchTab('profile')
}

export default {
  switchTab,
  goHome,
  goBoutique,
  goCart,
  goProfile
}
