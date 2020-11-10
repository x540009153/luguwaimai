//公共地址
let url = 'https://meituan.thexxdd.cn/api/'

//为你优选
let getpreferurl = `${url}forshop/getprefer`

//附近商家
let wxshopurl = `${url}forshop/wxshop`

//综合排序
let sorturl = `${url}forshop/starting`

//筛选
let multipleurl = `${url}forshop/multiple`

//搜索
let searchurl = `${url}forshop/search`

//商家介绍
let shopurl = `${url}forshop/shop`

//菜品商品
let getdishesurl = `${url}forshop/getdishes`

//评论
let discussurl = `${url}message/discuss`

//登录
let wxloginurl = `${url}wxuser/wxlogin`

// 微信支付
let wxpayingurl = `${url}wxpay/wxpaying`

export {
	getpreferurl,
	wxshopurl,
	sorturl,
	multipleurl,
	searchurl,
	shopurl,
	getdishesurl,
	discussurl,
	wxloginurl,
	wxpayingurl
}
