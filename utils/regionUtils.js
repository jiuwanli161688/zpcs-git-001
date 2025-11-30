/**
 * 地区工具类
 * 用于地区名称与adCode之间的转换
 */

// 省份数据映射 - 基于国家标准行政区划代码
const PROVINCE_AD_CODE_MAP = {
  '北京市': '110000',
  '天津市': '120000',
  '河北省': '130000',
  '山西省': '140000',
  '内蒙古自治区': '150000',
  '辽宁省': '210000',
  '吉林省': '220000',
  '黑龙江省': '230000',
  '上海市': '310000',
  '江苏省': '320000',
  '浙江省': '330000',
  '安徽省': '340000',
  '福建省': '350000',
  '江西省': '360000',
  '山东省': '370000',
  '河南省': '410000',
  '湖北省': '420000',
  '湖南省': '430000',
  '广东省': '440000',
  '广西壮族自治区': '450000',
  '海南省': '460000',
  '重庆市': '500000',
  '四川省': '510000',
  '贵州省': '520000',
  '云南省': '530000',
  '西藏自治区': '540000',
  '陕西省': '610000',
  '甘肃省': '620000',
  '青海省': '630000',
  '宁夏回族自治区': '640000',
  '新疆维吾尔自治区': '650000',
  '台湾省': '710000',
  '香港特别行政区': '810000',
  '澳门特别行政区': '820000'
}

// 省份简称映射
const PROVINCE_SHORT_NAME_MAP = {
  '北京': '北京市',
  '天津': '天津市',
  '河北': '河北省',
  '山西': '山西省',
  '内蒙古': '内蒙古自治区',
  '辽宁': '辽宁省',
  '吉林': '吉林省',
  '黑龙江': '黑龙江省',
  '上海': '上海市',
  '江苏': '江苏省',
  '浙江': '浙江省',
  '安徽': '安徽省',
  '福建': '福建省',
  '江西': '江西省',
  '山东': '山东省',
  '河南': '河南省',
  '湖北': '湖北省',
  '湖南': '湖南省',
  '广东': '广东省',
  '广西': '广西壮族自治区',
  '海南': '海南省',
  '重庆': '重庆市',
  '四川': '四川省',
  '贵州': '贵州省',
  '云南': '云南省',
  '西藏': '西藏自治区',
  '陕西': '陕西省',
  '甘肃': '甘肃省',
  '青海': '青海省',
  '宁夏': '宁夏回族自治区',
  '新疆': '新疆维吾尔自治区',
  '台湾': '台湾省',
  '香港': '香港特别行政区',
  '澳门': '澳门特别行政区'
}

/**
 * 将地区名称转换为adCode
 * @param {string} regionName - 地区名称（如：北京市、北京、广西壮族自治区等）
 * @returns {string} adCode - 地区编码，如果未找到返回空字符串
 */
export function getAdCodeByRegionName(regionName) {
  if (!regionName || typeof regionName !== 'string') {
    return ''
  }

  // 去除首尾空格
  const trimmedName = regionName.trim()

  // 直接匹配完整名称
  if (PROVINCE_AD_CODE_MAP[trimmedName]) {
    return PROVINCE_AD_CODE_MAP[trimmedName]
  }

  // 匹配简称
  if (PROVINCE_SHORT_NAME_MAP[trimmedName]) {
    const fullName = PROVINCE_SHORT_NAME_MAP[trimmedName]
    return PROVINCE_AD_CODE_MAP[fullName]
  }

  // 模糊匹配：处理可能包含其他信息的地区名称
  for (const [fullName, adCode] of Object.entries(PROVINCE_AD_CODE_MAP)) {
    // 检查是否以该省份名称开头
    if (trimmedName.startsWith(fullName)) {
      return adCode
    }

    // 检查简称匹配
    const shortName = Object.keys(PROVINCE_SHORT_NAME_MAP).find(key =>
      PROVINCE_SHORT_NAME_MAP[key] === fullName
    )
    if (shortName && trimmedName.startsWith(shortName)) {
      return adCode
    }
  }

  console.warn(`未找到地区"${regionName}"对应的adCode`)
  return ''
}

/**
 * 将adCode转换为地区名称
 * @param {string} adCode - 地区编码
 * @returns {string} 地区名称，如果未找到返回空字符串
 */
export function getRegionNameByAdCode(adCode) {
  if (!adCode || typeof adCode !== 'string') {
    return ''
  }

  for (const [regionName, code] of Object.entries(PROVINCE_AD_CODE_MAP)) {
    if (code === adCode) {
      return regionName
    }
  }

  console.warn(`未找到adCode"${adCode}"对应的地区名称`)
  return ''
}

/**
 * 获取所有省份的adCode映射
 * @returns {Object} 省份名称到adCode的映射对象
 */
export function getAllProvinceAdCodeMap() {
  return { ...PROVINCE_AD_CODE_MAP }
}

/**
 * 验证adCode是否有效
 * @param {string} adCode - 地区编码
 * @returns {boolean} 是否为有效的adCode
 */
export function isValidAdCode(adCode) {
  if (!adCode || typeof adCode !== 'string') {
    return false
  }

  return Object.values(PROVINCE_AD_CODE_MAP).includes(adCode)
}

/**
 * 标准化地区名称（转换为完整的官方名称）
 * @param {string} regionName - 地区名称
 * @returns {string} 标准化后的地区名称
 */
export function normalizeRegionName(regionName) {
  if (!regionName || typeof regionName !== 'string') {
    return ''
  }

  const trimmedName = regionName.trim()

  // 如果已经是完整名称，直接返回
  if (PROVINCE_AD_CODE_MAP[trimmedName]) {
    return trimmedName
  }

  // 如果是简称，转换为完整名称
  if (PROVINCE_SHORT_NAME_MAP[trimmedName]) {
    return PROVINCE_SHORT_NAME_MAP[trimmedName]
  }

  // 模糊匹配
  for (const fullName of Object.keys(PROVINCE_AD_CODE_MAP)) {
    if (trimmedName.startsWith(fullName)) {
      return fullName
    }

    const shortName = Object.keys(PROVINCE_SHORT_NAME_MAP).find(key =>
      PROVINCE_SHORT_NAME_MAP[key] === fullName
    )
    if (shortName && trimmedName.startsWith(shortName)) {
      return fullName
    }
  }

  return regionName
}

/**
 * 从地址信息中提取一级行政区（省/直辖市/自治区/特别行政区）
 * @param {Object} locationData - 位置数据对象，包含address等字段
 * @returns {string} 提取到的一级行政区名称
 */
export function extractFirstLevelRegion(locationData) {
  // 方法1: 直接从返回数据中获取（某些版本的chooseLocation会返回province字段）
  if (locationData.province) {
    return locationData.province
  }

  // 方法2: 从详细地址字符串中解析一级行政区
  if (locationData.address) {
    const address = locationData.address
    // 一级行政区匹配模式（按优先级排序）
    const regionPatterns = [
      // 直辖市（完整匹配）
      /^(北京市|天津市|上海市|重庆市)/,

      // 特别行政区
      /^(香港特别行政区|澳门特别行政区)/,
      /^(香港|澳门)(?=特别行政区|$)/,

      // 自治区
      /^([^市县区]+自治区)/,

      // 省份
      /^([^市县区]+省)/,

      // 处理简写形式的直辖市（如"北京"）
      /^(北京|天津|上海|重庆)(?=[市区县]|$)/
    ]

    for (let pattern of regionPatterns) {
      const match = address.match(pattern)
      if (match) {
        let region = match[1]
        // 对于简写的直辖市，补充"市"字
        if (['北京', '天津', '上海', '重庆'].includes(region)) {
          region += '市'
        }
        return region
      }
    }

    // 如果没有匹配到标准格式，尝试从地址开头提取可能的一级行政区
    const addressParts = address.split(/[市县区]/)
    if (addressParts.length > 0) {
      const possibleRegion = addressParts[0]
      // 检查是否是已知的一级行政区简称
      const knownRegions = [
        '内蒙古',
        '广西',
        '西藏',
        '宁夏',
        '新疆', // 自治区简称
        '黑龙江',
        '吉林',
        '辽宁',
        '河北',
        '河南',
        '山东',
        '山西',
        '陕西',
        '湖北',
        '湖南',
        '江苏',
        '浙江',
        '安徽',
        '福建',
        '江西',
        '广东',
        '海南',
        '四川',
        '贵州',
        '云南',
        '甘肃',
        '青海',
        '台湾' // 省份简称
      ]

      if (knownRegions.includes(possibleRegion)) {
        // 为自治区和省份补充完整后缀
        if (['内蒙古', '广西', '西藏', '宁夏', '新疆'].includes(possibleRegion)) {
          return possibleRegion === '内蒙古'
            ? '内蒙古自治区'
            : possibleRegion === '广西'
            ? '广西壮族自治区'
            : possibleRegion === '西藏'
            ? '西藏自治区'
            : possibleRegion === '宁夏'
            ? '宁夏回族自治区'
            : '新疆维吾尔自治区'
        } else {
          return possibleRegion + '省'
        }
      }

      // 简单判断是否可能是一级行政区（长度合理且不包含街道等关键词）
      if (
        possibleRegion.length >= 2 &&
        possibleRegion.length <= 8 &&
        !possibleRegion.includes('街') &&
        !possibleRegion.includes('路') &&
        !possibleRegion.includes('号') &&
        !possibleRegion.includes('镇') &&
        !possibleRegion.includes('村')
      ) {
        return possibleRegion
      }
    }
  }

  // 方法3: 如果都没有获取到，返回空字符串
  return ''
}

export default {
  getAdCodeByRegionName,
  getRegionNameByAdCode,
  getAllProvinceAdCodeMap,
  isValidAdCode,
  normalizeRegionName,
  extractFirstLevelRegion
}
