<template>
    <!-- 步骤一 添加商家 -->
    <view class=" acc">
        <view class="data-information">
            <view class="frm-sign">
                <!-- 基本信息 -->
                <view class="frm-sign-box" style="padding:0 20rpx 20rpx;">
                    <view class="frm-touse">
                        <view class="frm-touse-text">基本信息</view>
                        <image :src="iconRedTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击上传企业营业执照，图片限定500KB</view>
                    </view>

                    <view class="min-photo">
                        <view class="col-12">
                            <view class="rs-file" data-type="company" @tap="handlerUpfile">
                                <image class="icon-company" :src="iconLicenseCompany" mode="aspectFit"
                                    v-if="!objData.licencePhoto"> </image>
                                <image class="file-company" :src="objData.licencePhoto" mode="aspectFit"
                                    v-if="objData.licencePhoto">
                                </image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 基本信息2 -->
                <view class="data-manBody">
                    <view class="frm-comm">
                        <view class="rs rs-line">
                            <view class="lab">主体名称</view>
                            <view class="flex">
                                <input class="s-text s-textss" type="text" v-model="objData.storeName"
                                    placeholder="自动识别" disabled />
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">主体类型</view>
                            <view class="txt flex">
                                <picker mode="selector" :range="mainBodyType" :value="mainBodyType"
                                    @change="onSubjectTypeChange">
                                    <view class="in-picker ">
                                        <text class="text-xz">{{ objData.subjectType || '请选择' }}</text>
                                    </view>
                                </picker>
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">商号名称</view>
                            <view class="txt flex">
                                <input class="s-text" type="text" placeholder="请输入" />
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">统一社会信用代码</view>
                            <view class="txts flex">
                                <input class="s-text s-textss" type="text" v-model="objData.licenseNum"
                                    placeholder="自动识别" disabled />
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">入驻类目</view>
                            <view class="txt flex">
                                <view class="s-text region-input" @tap="showCategory"><text class="text-xz">请选择</text>
                                </view>
                            </view>
                        </view>
                        <view class="rs rs-lines">
                            <view class="lab">营业时间</view>
                            <view class="txt flex">
                                <picker mode="multiSelector" :range="hourList" :value="selectedHourIndex"
                                    @change="onHourChange">
                                    <view class="in-picker ">
                                        <text class="text-xz">{{ objData.businessTime != "" ? objData.businessTime +
                                            ":00 - " +
                                            objData.businessEndTime + ":00" : '请选择' }}</text>
                                    </view>
                                </picker>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 负责人信息 -->
                <view class="data-responsibleFor">
                    <view class="frm-sign">
                        <view class="frm-touse">
                            <view class="frm-touse-text">负责人信息</view>
                            <image :src="iconRedTips" mode="aspectFit" class="icon"></image>
                            <view class="text">图片限定500KB</view>
                        </view>
                        <view class="min-photo">
                            <view class="col-06">
                                <view class="rs-file" data-type="person-ps" @tap="handlerUpfile">
                                    <view class="re-files" v-if="!objData.legalPhoto">
                                        <view>+</view>
                                        <view>上传人像面</view>
                                    </view>
                                    <image class="file-company" :src="objData.legalPhoto" mode="aspectFit"
                                        v-if="objData.legalPhoto"></image>
                                </view>
                            </view>
                            <view class="col-06">
                                <view class="rs-file" data-type="person-dt" @tap="handlerUpfile">
                                    <view class="re-files" v-if="!objData.legalPhotoBack">
                                        <view>+</view>
                                        <view>上传国徽面</view>
                                    </view>
                                    <image class="file-company" :src="objData.legalPhotoBack" mode="aspectFit"
                                        v-if="objData.legalPhotoBack"></image>
                                </view>
                            </view>
                        </view>
                        <view class="frm-comm">

                            <view class="rs rs-line">
                                <view class="lab">负责人姓名</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" v-model="objData.legalName" type="text"
                                        placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-line">
                                <view class="lab">身份证号</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" v-model="objData.legalId" type="text"
                                        placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-line">
                                <view class="lab">证件有效期</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" v-model="objData.legaData" type="text"
                                        placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-lines">
                                <view class="lab">负责人电话</view>
                                <view class="txt flex">
                                    <input class="s-text" v-model="objData.legalPhone" type="text" placeholder="请输入" />
                                </view>
                            </view>
                        </view>
                    </view>

                </view>
                <!-- 商家信息 -->
                <view class="data-merchant">
                    <view class="frm-touse">
                        <view class="frm-touse-text">商家信息</view>
                        <image :src="iconRedTips" mode="aspectFit" class="icon"></image>
                        <view class="text">请上传您的门店照片，图片限定2000KB</view>
                    </view>
                    <view class="min-photo">
                        <view class="col-12">
                            <view class="rs-file" data-type="storePhotos" @tap="handlerUpfile">
                                <image class="icon-company" :src="iconMerchant" mode="aspectFit"
                                    v-if="!objData.cbdStorePhoto">
                                </image>
                                <image class="file-company" :src="objData.cbdStorePhoto" mode="aspectFit"
                                    v-if="objData.cbdStorePhoto">
                                </image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 地区位置 -->
                <view class="data-region">
                    <view class="frm-comm">
                        <!-- <view class="rs rs-line">
                            <view class="lab">隶属区域</view>
                            <view class="txt flex">
                                <view class="s-text region-input" @tap="showPicker"><text class="text-xz">请选择</text>
                                </view>
                            </view>
                        </view> -->
                        <view class="rs rs-lines">
                            <view class="lab">隶属地区</view>
                            <view class="txt flex" style="position: relative;">
                                <picker mode="multiSelector" :range="newWorkProvince" :value="curWorkSelected"
                                    @change="pickerWorkChange" @columnchange="pickerWorkColumnChange">
                                    <view class="in-picker ">
                                        <text class="text-xz">{{ objData.workAddressPath || '请选择' }}</text>
                                    </view>
                                </picker>
                                <!-- 加载指示器 -->
                                <view v-if="isLoading" class="loading-indicator">
                                    <uni-icons type="spinner" size="16" color="#999" :spin="true"></uni-icons>
                                </view>
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">详细地址</view>
                            <view class="txt flex">
                                <view class="flex txt">
                                    <input class="s-text" v-model="objData.workAddressDetail" type="text"
                                        placeholder="请输入" />
                                </view>
                            </view>
                        </view>

                    </view>

                    <view class="data-map">
                        <map @tap="handleMapTap" :latitude="latitude" :longitude="longitude" :markers="markers"
                            scale="16" style="width: 100%; height: 100%;"></map>
                    </view>
                    <view class="frm-touse" style="padding-bottom:8rpx">
                        <image :src="iconTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击地图通过地图选点设置您的位置</view>
                    </view>
                </view>
                <!--  确认按钮 -->
                <view class="lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
            </view>
        </view>
        <!-- 城市三级联动模块 -->
        <m-city :provinceData="list" headTitle="区域选择" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="3">
        </m-city>
    </view>
</template>
<script>
import storage from '@/utils/storage.js'
import { getRegionsById, ocrBasicDepositAccount } from '@/api/common.js'
import { businessLicenseOcr, idCardOcr, upload, uploadPrivateFile } from '@/api/common'
// import { getServicetList } from '@/api/service'
import { refreshTokenFn } from '@/api/login'
export default {
    name: "",
    props: {
        objData: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            iconRedTips: `/static/addMerchant.png`,
            iconTips: "/static/cbd/couponRules.png",
            iconLicenseCompany: `/static/cbd/service/icon-document.png`,
            iconMerchant: `/static/cbd/service/icon-merchant.png`,
            newWorkProvince: [[], [], []],					// 待选办公省市区
            curWorkSelected: [0, 0, 0],						// 选中办公省市区下标
            curWorkSelectedValue: ['', '', ''],				// 选中办公省市区ID
            curWorkSelectedLabel: ['', '', ''],				// 选中办公省市区文本
            allProvince: [],									// 全部省市区
            isLoading: false,									// 全局加载状态
            loadingStatus: {										// 各层级加载状态
                city: false,
                district: false
            },
            // objData: {
            //     licencePhoto: '',//营业执照路径
            //     storeName: '',//主体名称
            //     subjectType: '',//主体类型
            //     merchantName: '',//商号名称
            //     licenseNum: '',//统一社会信用代码 √
            //     industryId: '',//入驻类目
            //     businessTime: '',//营业开始时间
            //     businessEndTime: '',//营业结束时间
            //     legalName: '',//法人姓名
            //     legalPhoto: '',//身份证正面
            //     legalPhotoBack: '',//身份证反面
            //     legalId: '',//身份证号
            //     legalPhone: '',//手机号
            //     legaData: '',//身份证有效期
            //     cbdStorePhoto: '',//门店照片
            //     workAddressPath: '',//办公地址省市区
            //     workAddressDetail: '',//办公地址详情
            // },
            mainBodyType: [ //主体类型
                "个体工商户",
                "企业",
            ],
            mainBodyTypeIndex: 0, //类型索引
            latitude: 39.909, // 地图中心纬度（示例：北京）
            longitude: 116.397, // 地图中心经度
            markers: [{ // 地图标记点
                id: 1,
                latitude: 39.909,
                longitude: 116.397,
                title: "天安门",
                iconPath: "/static/location.png" // 自定义标记图标
            }
            ],
            adCodeData: [],  //省市区信息
            list: [
                {
                    id: '',
                    localName: '请选择',
                    children: []
                }
            ],
            hourList: [//营业时间
                ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
            ], // 存储 00~23 小时选项
            selectedHourIndex: [0, 0], // 当前选择的营业时间
            currentLat: 22.542956,  // 初始纬度（深圳）
            currentLng: 114.059563, // 初始经度（深圳）
            markers: [],             // 地图标记点（显示点击位置）
            selectedAddress: "",     // 点击位置的地址名称
            amapKey: "你的高德地图WebService密钥" // 替换为你的高德密钥
        }
    },
    created() {
        // 初始化省市区
        this.loadInitProvince()

    },
    methods: {
        async handleMapTap(e) {
            const { latitude, longitude } = e.detail;
            console.log("点击位置经纬度：", latitude, longitude);
            console.log(e);
            this.currentLat = latitude;
            this.currentLng = longitude;
        },
        //btn事件
        handlerSubmit() {
            console.log(this.objData)
        },
        // 上传营业执照
        handlerUpfile: function (e) {
            // #ifdef APP-PLUS
            if (plus.os.name == 'Android') {
                this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
            }
            // #endif
            let _this = this
            let eType = e.currentTarget.dataset.type;//当前图片上传类型
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 从相册选择
                success: (res) => {
                    uni.showLoading({ title: '正在上传' })
                    uni.uploadFile({
                        url: uploadPrivateFile,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: {
                            accessToken: storage.getAccessToken()
                        },
                        success: (uploadFileRes) => {
                            uni.hideLoading()
                            let data = JSON.parse(uploadFileRes.data)
                            if (data.code == 200) {
                                if (eType == 'person-ps') {//身份证正面
                                    _this.objData.legalPhoto = data.result
                                    _this.objData.legalName = ''
                                    _this.objData.legalId = ''
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.legalName = ocrRes.data.result.name
                                            _this.objData.legalId = ocrRes.data.result.idCardNumber
                                        } else {
                                            _this.objData.legalPhoto = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'person-dt') {//身份证背面
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            let newdata = ocrRes.data.result.expirationDate;//20190211->2019.02.11
                                            let olddata = ocrRes.data.result.issuingAuthority;//20190211
                                            newdata = newdata.slice(0, 4) + '.' + newdata.slice(4, 6) + '.' + newdata.slice(6, 8);
                                            olddata = olddata.slice(0, 4) + '.' + olddata.slice(4, 6) + '.' + olddata.slice(6, 8);
                                            _this.objData.legaData = `${newdata}-${olddata}`;//有效期
                                        } else {
                                            _this.objData.legalPhoto = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'storePhotos') { //店铺照片
                                    _this.objData.cbdStorePhoto = data.result;
                                } else {//营业执照
                                    console.log('未知类型')
                                    _this.objData.licencePhoto = res.tempFilePaths[0]
                                    // 注意：上传文件接口执行成功后渲染数组
                                    _this.objData.companyIdPhoto = data.result
                                    _this.objData.licenseNum = ''//营业执照号
                                    _this.objData.storeName = ''//店铺名称
                                    uni.showLoading({ title: '正在识别信息' })
                                    businessLicenseOcr({ businessLicenseAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.storeName = ocrRes.data.result.unitName;
                                            _this.objData.licenseNum = ocrRes.data.result.socialCreditCode;//营业执照号
                                        } else {
                                            _this.objData.licenseNum = ''//营业执照号
                                            _this.objData.storeName = ''//店铺名称
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                }
                            } else {
                                this.$u.toast('上传失败，请稍后重试')
                            }
                        }
                    })
                    // 注意：上传文件接口执行成功后渲染网络路径
                    // 调用文件上传接口
                }
            })
        },
        // 更新选中的省市区信息
        updateSelectedInfo: function (selectedIndex = this.curWorkSelected) {
            const [provIndex, cityIndex, districtIndex] = selectedIndex;

            // 确保数据完整性
            if (!this.allProvince[provIndex]) return;

            const province = this.allProvince[provIndex];
            const city = province.sons[cityIndex] || { code: '', name: '', sons: [] };
            const district = city.sons[districtIndex] || { code: '', name: '' };

            // 更新选中的code和label
            this.curWorkSelectedValue = [province.code, city.code, district.code];
            this.curWorkSelectedLabel = [province.name, city.name, district.name];
            this.objData.workAddressPath = `${province.name}/${city.name}/${district.name}`;
        },
        pickerWorkChange: function (e) {
            this.objData.workAddressPath = "";
            this.curWorkSelected = e.detail.value;
            // 调用公共函数更新选中信息
            this.updateSelectedInfo();
        },
        //主体类型
        onSubjectTypeChange(e) {
            this.mainBodyTypeIndex = e.detail.value;
            const selectedType = this.mainBodyType[this.mainBodyTypeIndex];
            this.objData.subjectType = selectedType;// 设置表单中的主体类型和登记管理部门
        },
        onHourChange(e) {
            let TimeIndex = e.detail.value[0];//开始时间
            let TimeEndIndex = e.detail.value[1];//结束时间
            if (TimeIndex > TimeEndIndex) {
                uni.showToast({
                    title: '重新选择营业时间',
                    icon: 'none', // 图标：success/loading/none（默认 none）
                    duration: 1500,
                    mask: true,
                });
                return;
            }
            this.objData.businessTime = this.hourList[0][TimeIndex];
            this.objData.businessEndTime = this.hourList[1][TimeEndIndex];

        },
        //办公省市区
        pickerWorkColumnChange: async function (e) {
            const { column, value } = e.detail;
            const curIndex = value;

            // 统一处理地区数据加载的公共函数
            const loadRegionsData = async (parentCode, level) => {
                try {
                    this.isLoading = true;
                    if (level === '城市') this.loadingStatus.city = true;
                    if (level === '区县') this.loadingStatus.district = true;

                    const res = await getRegionsById(parentCode);
                    if (res.data.success) {
                        const regions = res.data.result || [];
                        return regions.map(region => ({
                            code: region.id,
                            name: region.name,
                            sons: []
                        }));
                    }
                    return [];
                } catch (error) {
                    uni.showToast({
                        title: `加载${level}数据失败`,
                        icon: 'none'
                    });
                    return [];
                } finally {
                    this.isLoading = false;
                    if (level === '城市') this.loadingStatus.city = false;
                    if (level === '区县') this.loadingStatus.district = false;
                }
            };

            // 切换省份
            if (column === 0) {
                // 更新省份选中索引
                this.curWorkSelected[0] = curIndex;
                const selectedProvince = this.allProvince[curIndex];

                // 加载城市数据
                if (selectedProvince.sons.length === 0) {
                    const cities = await loadRegionsData(selectedProvince.code, '城市');
                    selectedProvince.sons = cities.length > 0 ? cities : [{ code: '-1', name: '--', sons: [] }];
                    // 更新城市选择列表
                    this.newWorkProvince[1] = selectedProvince.sons.map(city => city.name);
                } else {
                    // 更新城市选择列表
                    this.newWorkProvince[1] = selectedProvince.sons.map(city => city.name);
                }

                // 重置城市和区县选中索引
                this.curWorkSelected[1] = 0;
                this.curWorkSelected[2] = 0;

                // 加载区县数据（默认第一个城市）
                const firstCity = selectedProvince.sons[0];
                if (firstCity.sons.length === 0) {
                    const districts = await loadRegionsData(firstCity.code, '区县');
                    firstCity.sons = districts.length > 0 ? districts : [{ code: '-1', name: '--', sons: [] }];
                    // 更新区县选择列表
                    this.newWorkProvince[2] = firstCity.sons.map(district => district.name);
                    // 数据加载完成后立即更新选中信息
                    this.updateSelectedInfo();
                } else {
                    // 更新区县选择列表
                    this.newWorkProvince[2] = firstCity.sons.map(district => district.name);
                    // 立即更新选中信息
                    this.updateSelectedInfo();
                }
            }

            // 切换城市
            if (column === 1) {
                // 更新城市选中索引
                this.curWorkSelected[1] = curIndex;
                const selectedProvince = this.allProvince[this.curWorkSelected[0]];
                const selectedCity = selectedProvince.sons[curIndex];

                // 重置区县选中索引
                this.curWorkSelected[2] = 0;

                // 加载区县数据
                if (selectedCity.sons.length === 0) {
                    const districts = await loadRegionsData(selectedCity.code, '区县');
                    selectedCity.sons = districts.length > 0 ? districts : [{ code: '-1', name: '--', sons: [] }];
                    // 更新区县选择列表
                    this.newWorkProvince[2] = selectedCity.sons.map(district => district.name);
                    // 数据加载完成后立即更新选中信息
                    this.updateSelectedInfo();
                } else {
                    // 更新区县选择列表
                    this.newWorkProvince[2] = selectedCity.sons.map(district => district.name);
                    // 立即更新选中信息
                    this.updateSelectedInfo();
                }
            }

            // 切换区县
            if (column === 2) {
                // 仅更新区县选中索引
                this.curWorkSelected[2] = curIndex;
                // 立即更新选中信息
                this.updateSelectedInfo();
            }
        },
        // 加载地区
        loadInitProvince: async function () {
            let _this = this
            // 加载省级
            let resProvince = await getRegionsById(0)
            if (resProvince.data.success) {
                let tempRes = resProvince.data.result
                tempRes.map(o => {
                    _this.allProvince.push({ code: o.id, name: o.name, sons: [] })
                    _this.newWorkProvince[0].push(o.name)
                })
            }
            // 默认下标0省
            let curProvince = _this.allProvince[0]
            // 加载市级
            let resCity = await getRegionsById(curProvince.code)
            if (resCity.data.success) {
                let tempRes = resCity.data.result
                tempRes.map(o => {
                    curProvince.sons.push({ code: o.id, name: o.name, sons: [] })
                    _this.newWorkProvince[1].push(o.name)
                })
            }
            // 默认下标0市
            let curCity = curProvince.sons[0]
            // 加载区级
            let resDistrict = await getRegionsById(curCity.code)
            if (resDistrict.data.success) {
                let tempRes = resDistrict.data.result
                tempRes.map(o => {
                    curCity.sons.push({ code: o.id, name: o.name, sons: [] })
                    _this.newWorkProvince[2].push(o.name)
                })
            }
        },
        //省市区 三级地址联动回调
        getpickerParentValue(e) {
            // 将需要绑定的地址设置为空，并赋值
            this.adCodeData = []
            let regionId = []

            // 先过滤出有效的item，避免出现//问题
            const validItems = e.filter(item => item.id);

            // 拼接名称
            const name = validItems.map(item => item.localName).join('/');

            // 处理有效数据
            validItems.forEach(item => {
                this.adCodeData.push(item.adCode)
                regionId.push(item.id)
            })

            // 更新表单数据
            this.form.regionId = regionId.join(',')
            this.$set(this.form, 'regionPath', name)
            this.form.provinceCode = this.adCodeData[0]
            this.form.cityCode = this.adCodeData[1]
            this.form.districtCode = this.adCodeData[2]
        },
        //类目 三级地址联动回调暂时不调用
        getCategoryParentValue(e) {
            // 将需要绑定的地址设置为空，并赋值

            let name = ''
            this.adCodeData = []
            let regionId = []
        },
        // 显示三级地址联动
        showPicker() {
            this.$refs.cityPicker.show();
        },
        //显示类目三级联动
        showCategory() {
            // getServicetList().then((res) => {
            //     console.log(res)
            // })
            //     .catch((err) => {
            //         console.log(err)
            //     })
            // this.$refs.categoryPickers.show();
        }
    }

}
</script>
<style lang="scss" scoped>
.picker-container {
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin: 16px;
    color: #333;
}

.container {
    background: #f8f8f8;
    height: calc(100vh - 88rpx);
    box-sizing: border-box;
    padding: 20rpx;
    position: relative;
}


.frm-sign-box {
    width: 100%;
    height: auto;
    background-color: white;
    border-radius: 16rpx;
    margin-top: 40rpx;
}

.frm-touse-text {
    font-size: 28rpx;
    font-weight: 700;
    color: #333333;
}

.frm-touse-text~.icon {
    width: 20rpx;
    height: 20rpx;
    margin: 14rpx 8rpx 0 16rpx;
}

.frm-touse-text~.icon~.text {
    font-size: 20rpx;
    font-weight: 400;
    color: #FF0101;
    line-height: 46rpx;
}

.rs-line {
    margin: 0;
    padding: 0;
}

.frm-sign-box {
    width: 100%;
    height: auto;
    background-color: white;
    border-radius: 16rpx;
    margin-top: 40rpx;
}

.frm-touse-text {
    font-size: 28rpx;
    font-weight: 700;
    color: #333333;
}

.s-textss {
    padding-right: 0rpx !important;
}

.in-picker {
    font-size: 24rpx;
}

.frm-touse-text~.icon {
    width: 20rpx;
    height: 20rpx;
    margin: 14rpx 8rpx 0 16rpx;
}

.frm-touse-text~.icon~.text {
    font-size: 20rpx;
    font-weight: 400;
    color: #FF0101;
    line-height: 46rpx;
}

.rs-file {
    background: #f3f5f9;
}

.min-photo .icon-company {
    width: 294rpx;
    height: 184rpx;
}

.container .lab {
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
}

.frm-comm .rs .flex .s-text {
    font-size: 24rpx;
    font-weight: 400;
    padding-right: 26rpx;
}

.frm-comm .rs .lab {
    width: 200rpx;
}

.frm-comm .rs .txt {
    width: calc(100vw - 200rpx - 40rpx - 40rpx);
}

.frm-comm .rs .labs {
    width: 200rpx;
}

.frm-comm .rs .txts {
    width: calc(100vw - 200rpx - 40rpx - 40rpx);
}

.addAccount-cen .rs-line {
    padding: 0 20rpx;
}

.addAccount-cen .rs-lines {
    padding: 0 20rpx;
}

.data-manBody {
    width: 100%;
    height: auto;
    margin-top: 30rpx;
    padding: 0rpx 20rpx 0;
    background-color: white;
    border-radius: 20rpx;
}

.data-manBody-box {
    width: 100%;
    height: 74rpx;
    background-color: white;
    position: relative;
    border-bottom: 1px solid #F3F3F3;
}

.rs-lines {
    padding: 0 0rpx;
}

.fs-12 {
    font-weight: 24rpx;
    font-weight: 400;
}

.frm-comm .rs .txt .in-picker {
    padding-right: 24rpx;
    font-size: 24rpx;
}

.txt::after {
    position: absolute;
    content: "";
    width: 12rpx;
    height: 12rpx;
    border: 4rpx solid #d6d6d6;
    border-left: none;
    border-bottom: none;
    right: 10rpx !important;
    top: 48% !important;
    -webkit-transform: rotate(45deg) translateY(-45%);
    transform: rotate(45deg) translateY(-45%);
}

.data-manBody-box>view {
    line-height: 74rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #333333;

    // 统一高度
    .text,
    .view {
        display: block;
        width: 64%;
        background-color: white;
        float: right;
        margin-right: 22rpx;
        text-align: right;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        position: relative;
    }

    .text {
        height: 100%;
        border: none;
        margin-top: 16rpx;
    }

    .view {
        height: 72rpx;
    }

    .views {
        color: #333333;
    }
}

.data-responsibleFor {
    width: 100%;
    height: auto;
    padding: 0 20rpx 0;
    background-color: white;
    border-radius: 16rpx;
    margin-top: 30rpx;
}

// 负责人正反纯色背景图
.rs-file {
    border-radius: 20rpx;
}

.re-files {
    width: 100%;
    height: 100%;

    view {
        text-align: center;
        color: #666666;
    }

    view:nth-child(1) {
        width: 100%;
        height: auto;
        font-weight: 100;
        font-size: 80rpx;
    }

    view:nth-child(2) {
        font-size: 28rpx;
        font-weight: 500;
    }
}

.responsibleFor-inp {
    margin-top: 20rpx;
}

.data-responsibleFor .responsibleFor-inp {
    margin-top: 0;
}

.data-merchant {
    width: 100%;
    height: auto;
    background-color: white;
    border-radius: 16rpx;
    padding: 0 20rpx 20rpx;
}

.data-region {
    width: 100%;
    height: auto;
    border-radius: 16rpx;
    background-color: white;
    margin-top: 30rpx;
    padding: 0 20rpx;
}

.data-map {
    width: 100%;
    height: 292rpx;
    margin: 20rpx 0 0;
    border-radius: 20rpx;
}

.data-map~.frm-touse {
    padding: 10rpx 0 0rpx 0;

    .icon {
        width: 26rpx;
        height: 26rpx;
        margin: 8rpx 12rpx 0 0;
    }
}

.lnk-common {
    margin: 170rpx 0 0 0;
}

.m-top15 {
    margin-top: 30rpx;
}

.cen-enter {
    width: 100%;
    height: auto;
}

.cen-enter .frm-touse {
    margin-top: 30rpx;
}

.cen-enter-upload {
    padding-bottom: 20rpx;
    border-radius: 20rpx;
    background-color: white;
}

.addAccount {
    width: 100%;
    height: auto;
    background: white;
    border-radius: 20rpx;
}

.addAccount .frm-touse {
    display: flex;
    padding: 20rpx 0;
}

.addAccount .frm-sign-box {
    padding-bottom: 0rpx;
}

.cen-verification {
    width: 100%;
    height: auto;
    // padding: 0 20rpx;
    margin-top: 20rpx;
}

.m-tops {
    margin: 116rpx 0 0 0;
}

.cen-title {
    width: 100%;
    height: auto;
    margin-bottom: 40rpx;

    view {
        font-weight: 700;
        font-size: 32rpx;
        margin-bottom: 20rpx;
    }

    text {
        display: inline-block;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
    }
}

.col-06 {
    overflow: hidden;
}

/* 加载指示器样式 */
.loading-indicator {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>