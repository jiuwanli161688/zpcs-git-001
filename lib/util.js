//公共js，主要做表单验证，以及基本方法封装
const utils = {
	isNullOrEmpty: function(value) {
		//是否为空
		return (value === null || value === 'null' || value === '' || value === undefined||value==={}) ? true : false;
	},
	trim: function(value) {
		//去空格
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	isMobile: function(value) {
		//是否为手机号
		return /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/
			.test(value);
	},
	isFloat: function(value) {
		//金额，只允许保留两位小数
		return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
	},
	isNum: function(value) {
		//是否全为数字
		return /^[0-9]+$/.test(value);
	},
	isName: function(value) {
		// 是否为汉字
		return /^[\u4E00-\u9FA5A-Za-z]+$/.test(value);
	},
	checkPwd: function(value) {
		//密码为8~20位数字和字母组合
		return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value);
	},
	formatNum: function(num) {
		//格式化手机号码
		if (utils.isMobile(num)) {
			num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
		}
		return num;
	},
	rmoney: function(money) {
		//金额格式化
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,')
			.replace(
				/\,$/, '').split('').reverse().join('');
	},
	rAge: function(birth) {
		let dBirth = new Date(birth)
		let dNowDate = new Date()
		let tampBirth = Date.parse(dBirth)
		let tampNow = Date.parse(dNowDate)
		let dayDiff = Math.ceil((tampNow - tampBirth) / (60 * 60 * 1000 * 24))
		let age = 0
		let yAge = Math.floor(dayDiff / 365)
		let yMod = dayDiff % 365
		let mMod = Math.floor(yMod / 30)
		let dMod = Math.floor(dayDiff % 365 % 30)
		// age = `${yAge}岁${mMod}月${dMod}天`
		// age = `${yAge}岁`
		age = yAge
		return age
	},
	formatDate: function(formatStr, fdate) {
		//日期格式化
		if (fdate) {
			if (~fdate.indexOf('.')) {
				fdate = fdate.substring(0, fdate.indexOf('.'));
			}
			fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
			var fTime, fStr = 'ymdhis';
			if (!formatStr)
				formatStr = "y-m-d h:i:s";
			if (fdate)
				fTime = new Date(fdate);
			else
				fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			hours = hours < 10 ? ('0' + hours) : hours;
			minu = minu < 10 ? '0' + minu : minu;
			second = second < 10 ? '0' + second : second;
			var formatArr = [
				fTime.getFullYear().toString(),
				month.toString(),
				day.toString(),
				hours.toString(),
				minu.toString(),
				second.toString()
			]
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	},
	tampToDate: function(tamp, formatStr = 'Y-M-D h:m:s') {
		var date
		tamp.toString().length == 10 ? date = new Date(Number(tamp) * 1000) : date = new Date(
			Number(tamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear();
		var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
		var D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
		var h = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
		var m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes();
		var s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();
		switch (formatStr) {
			case 'Y':
				return `${Y}`
				break
			case 'Y-M':
				return `${Y}-${M}`
				break
			case 'Y.M':
				return `${Y}.${M}`
				break
			case 'Y-M-D':
				return `${Y}-${M}-${D}`
				break
			case 'h:m:s':
				return `${h}:${m}:${s}`
				break
			case 'h:m':
				return `${h}:${m}`
				break
			case 'Y-M-D h:m':
				return `${Y}-${M}-${D} ${h}:${m}`
				break
			default:
				return `${Y}-${M}-${D} ${h}:${m}:${s}`
		}
	},

	queryURLparams: function(url) {
	    let obj = {}
	    if (url.indexOf('?') < 0) return obj
	    let arr = url.split('?')
	    url = arr[1]
	    let array = url.split('&')
	    for (let i = 0; i < array.length; i++) {
	        let arr2 = array[i]
	        let arr3 = arr2.split('=')
	        obj[arr3[0]] = arr3[1]
	    }
	    return obj

	}

}

module.exports = {
	isNullOrEmpty: utils.isNullOrEmpty,
	trim: utils.trim,
	isMobile: utils.isMobile,
	isFloat: utils.isFloat,
	isNum: utils.isNum,
	isName: utils.isName,
	checkPwd: utils.checkPwd,
	formatNum: utils.formatNum,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	tampToDate: utils.tampToDate,
	rAge: utils.rAge,
	queryURLparams: utils.queryURLparams
}
