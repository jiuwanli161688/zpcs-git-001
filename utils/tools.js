/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
function urlParse(url) {
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split("=");
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr.splice(1).join("="));
      obj[key] = val;
    });
  }
  return obj;
}

const getNetworkType = () => {
  uni.getNetworkType({
    success: res => {
      if (res.networkType === "none") {
        uni.showToast({
          title: "网络好像有点问题,请检查后重试！",
          duration: 2000,
          icon: "none"
        });
        let pages = getCurrentPages();
        if (pages.length) {
          let route = pages[pages.length - 1].route;
          if (route !== "pages/empty/empty") {
            uni.navigateTo({
              url: `/pages/empty/empty?type=wifi`
            });
          }
        } else {
          uni.navigateTo({
            url: `/pages/empty/empty?type=wifi`
          });
        }
      }
    }
  });
};

const throttle = (fn, that, gapTime) => {
  // export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1800;
  }
  let _lastTime = that.lastTime;
  let _nowTime = +new Date();
  if (_nowTime - _lastTime > gapTime || !_lastTime) {
    fn.apply(that, arguments); //将this和参数传给原函数
    that.lastTime = _nowTime;
  }
};

/**
 * 计算传秒数的倒计时【天、时、分、秒】
 * @param seconds
 * @returns {{day : *, hours : *, minutes : *, seconds : *}}
 */
const countTimeDown = seconds => {
  const leftTime = time => {
    if (time < 10) time = "0" + time;
    return time + "";
  };
  return {
    day: leftTime(parseInt(seconds / 60 / 60 / 24, 10)),
    hours: leftTime(parseInt((seconds / 60 / 60) % 24, 10)),
    minutes: leftTime(parseInt((seconds / 60) % 60, 10)),
    seconds: leftTime(parseInt(seconds % 60, 10))
  };
};

/**
 * 计算当前时间到第二天0点的倒计时[秒]
 * @returns {number}
 */
const theNextDayTime = () => {
  const nowDate = new Date();
  const time =
    new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate() + 1,
      0,
      0,
      0
    ).getTime() - nowDate.getTime();
  return parseInt(time / 1000);
};
// 防抖
const debounce = (fn, delay) => {
  // 时间期限
  var delays = delay || 200;
  var timer;
  // 闭包
  return function() {
    // 考虑作用域，上下文环境，apply需要用到this对象
    var th = this;
    // 接收的参数用 ES6 中的 rest 参数统一存储到变量 args 中。arguments就是传入的参数数组,而且个数可以不确定的传回给fn（不确定函数到底有多少个参数，用arguments来接收）
    var args = arguments;
    // 判断还在定时，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      // 执行方法
      fn.apply(th, args);
    }, delays);
  };
};
// 格式化文件大小
const formatSize=(value)=> {
  if (null == value || value == "") {
    return "0";
  }
  let unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  let srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  size = size.toFixed(2); //保留的小数位数
  return size + unitArr[index];
}

/**
 * 检测设备类型并跳转到相应的链接
 * 开发环境：不跳转（通过NODE_ENV判断）
 * 测试环境：手机跳转到t-mobile.zpwdsc.com，PC跳转到t-buyer.zpwdsc.com（通过域名包含t-前缀判断）
 * 生产环境：手机跳转到mobile.zpwdsc.com，PC跳转到zpwdsc.com（其他域名）
 *
 * 注意：H5打包后NODE_ENV也会是production，所以环境判断主要依赖域名
 */
const redirectToWebsite = () => {
  // #ifdef H5
  // 开发环境不跳转
  if (process.env.NODE_ENV === "development") {
    console.log('开发环境，跳转功能已禁用');
    return;
  }

  // 排除特定路径，不进行跳转（如隐私政策、服务协议等页面）
  const currentPath = window.location.pathname;
  const excludePaths = ['/License', '/privacy', '/agreement'];
  if (excludePaths.some(path => currentPath.includes(path))) {
    console.log('隐私政策或协议页面，跳转功能已禁用');
    return;
  }

  // 检测是否为移动设备
  const isMobile = () => {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    // 也可以通过屏幕宽度进一步判断
    const screenWidth = window.screen.width;
    const isMobileByWidth = screenWidth <= 768;

    return mobileRegex.test(userAgent) || isMobileByWidth;
  };

  // 根据环境和设备类型执行跳转逻辑
  const currentHost = window.location.hostname;

  let targetUrl = '';

  // 通过域名判断环境，而不是NODE_ENV（因为H5打包后也是production）
  const isTestEnvironment = currentHost.includes('t-mobile') || currentHost.includes('t-buyer') || currentHost.includes('localhost') || currentHost.includes('127.0.0.1');

  if (isMobile()) {
    // 手机端跳转逻辑
    if (isTestEnvironment) {
      // 测试环境 - 只有当前不是目标域名时才跳转
      if (!currentHost.includes('t-mobile.zpwdsc.com')) {
        targetUrl = 'https://t-mobile.zpwdsc.com';
      }
    } else {
      // 生产环境 - 只有当前不是目标域名时才跳转
      if (!currentHost.includes('mobile.zpwdsc.com')) {
        targetUrl = 'https://mobile.zpwdsc.com';
      }
    }
  } else {
    // PC端跳转逻辑
    if (isTestEnvironment) {
      // 测试环境 - 只有当前不是目标域名时才跳转
      if (!currentHost.includes('t-buyer.zpwdsc.com')) {
        targetUrl = 'https://t-buyer.zpwdsc.com';
      }
    } else {
      // 生产环境 - 只有当前不是目标域名时才跳转
      if (!currentHost.includes('zpwdsc.com') || currentHost.includes('t-') || currentHost.includes('mobile.')) {
        targetUrl = 'https://zpwdsc.com';
      }
    }
  }

  if (targetUrl) {
    console.log(`准备跳转到: ${targetUrl}`);
    window.location.href = targetUrl;
  }
  // #endif

  // #ifndef H5
  // 非H5环境（如APP、小程序等）不执行跳转
  console.log('当前不是H5环境，跳转功能仅在H5端生效');
  // #endif
};

export { getNetworkType, throttle, countTimeDown, theNextDayTime, debounce, formatSize, redirectToWebsite };
