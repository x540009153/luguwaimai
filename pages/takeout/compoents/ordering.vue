<template>
	<view>
		<!-- 并排布局 -->
		<view class="ordering-fls">
			<!-- 左边商品分类 -->
			<view class="ordering-left">
				<block v-for="(item,index) in orderclass" :key="index">
					<text :class="{active:index==num}" @click="orderClick(index,item)">{{item}}</text>
				</block>
			</view>
			<!-- 右边商品信息 -->
			<view class="ordering-right">
				<text class="ordering-right-title">{{ordertitle}}</text>
				<view>
					<block v-for="(item,index) in classifarr" :key="index">
						<view class="content-view">
							<!-- 左边商品图片 -->
							<view class="content-img">
								<image :src="item.objdis.image" mode="aspectFill"></image>
							</view>
							<!-- 右边商品 -->
							<view class="content-title">
								<text class="conteng-take">{{item.objdis.input}}</text>
								<view class="conteng-monthly">
									<block v-for="(itemdata,index) in item.objdis.tags" :key="index">
										<text>{{itemdata}}</text>
									</block>
								</view>
								<view class="conteng-starting">
									<text>月售10</text>
								</view>
								<view class="conteng-price">
									<view class="conteng-shi">{{item.objdis.Discount}}</view>
									<view class="conteng-hua">{{item.objdis.Price}}</view>
									<view class="conteng-price">
										<image @click="reDuce(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)"
										 src="../../../static/coen/jianhao.png" mode="widthFix"></image>
										<text class="amounting">{{item.amount}}</text>
										<image @click="plus(item.amount,item._id,index,item.objdis.Discount,item.objdis.image,item.objdis.input)" src="../../../static/coen/jiahao.png"
										 mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 购物车 -->
			<view class="shopping">
				<!-- 骑手 -->
				<view class="qishou">
					<image v-if="!isActive" src="../../../static/coen/weigou.png" mode="widthFix"></image>
					<image v-if="isActive" src="../../../static/coen/yigou.png" mode="widthFix"></image>
				</view>
				<!-- 多少量 -->
				<view class="numbering" v-if="isActive">{{takeNum}}</view>
				<!-- 金额 -->
				<view class="shopping-dis">
					<view class="shopping-left">
						<view class="cost-money">
							<text class="total-price">￥{{finalprice}}</text>
							<text class="delivery">另需配送费{{physical}}元</text>
						</view>
					</view>
					<view class="shopping-right" :class="{shoppactive:isActive}" @click="flag && settLement()">
						<text v-if="!isActive">{{delivering}}元起送</text>
						<text v-if="isActive">{{difference}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 登录弹窗 -->
		<loginPopup ref="login"></loginPopup>
	</view>
</template>

<script>
	import loginPopup from '../../../common/loginPopup.vue'
	export default {
		components: {
			loginPopup
		},
		props: {
			orderingdata: Array,
			busidata: Object
		},
		data() {
			return {
				num: 0,
				//左边商品分类
				orderclass: [],
				isActive: false,
				// 右边默认展示的分类
				ordertitle: '',
				// 右边默认展示的商品
				classifarr: [],
				// 所有的商品数据
				commodity: [],
				//配送费
				physical: Number,
				//起送费
				delivering: Number,
				//商品数量
				amount: '',
				// 存放得到总价的商品
				arrtotalPrice: [],
				//最终的总价
				finalprice: 0,
				//选择商品的数量
				takeNum: 0,
				//还差多少金额起送
				difference: '',
				//禁止点击去结算
				flag: false,
				//商品
				shop: [],
				//商家标识
				MerchantId: '',
				//商家名字
				shopname: '',
				//商家logo
				logi: ''
			}
		},
		methods: {
			//左边商品分类的切换
			orderClick(index, itemclass) {
				this.num = index
				this.ordertitle = itemclass
				let itemarr = this.commodity.filter((item) => {
					return itemclass == item.optidata
				})
				this.classifarr = itemarr
			},
			//加价
			plus(amount, indexs, indexdata, price, image, input) {
				this.amount = Number(amount) + Number(1)
				this.pullData(indexs, indexdata, price, image, input)
			},
			//减价
			reDuce(amount, indexs, indexdata, price, image, input) {
				this.amount = Number(amount) - Number(1)
				this.pullData(indexs, indexdata, price, image, input)
			},

			//加减价的公共函数
			pullData(indexs, indexdata, price, image, input) {
				let findarr = this.classifarr.filter((item) => {
					if (indexs == item._id) {
						if (this.amount < 1) {
							return item.amount = '0'
						} else {
							return item.amount = this.amount
						}
					}
				})
				// 得到更改的数组重新更新classifarr数组，数组顺序要保持不变
				this.classifarr[indexdata] = findarr[0]
				//计算总量
				if (Number(this.amount) <= 0) {
					this.amount = 0
				}
				let Totalnum = price * Number(this.amount)
				//解决总价为浮点数的情况
				let Totalprice = parseFloat((Totalnum).toFixed(10))
				//把单个商品得到的总价作为一个对象push到数组里，方便后面
				//多个商品总价计算来得到最终的价格
				let fands = {
					indexs,
					Totalprice,
					price,
					image,
					input,
					amount: this.amount
				}
				this.arrtotalPrice.push(fands)
				let findarrdata = this.arrtotalPrice.map((item) => {
					return item.indexs == indexs ? fands : item
				})
				this.arrtotalPrice = findarrdata
			},

			//去结算
			settLement() {
				//去结算的条件是有用户信息
				let getdata = uni.getStorageSync('user')
				if (!getdata) {
					this.$nextTick(() => {
						this.$refs.login.init()
					})
				} else {
					//跳转下单
					//商品总金额，配送费，用户openid，商家标识，商家名字，商家logo，点的商品个数
					let payment = parseFloat((this.finalprice + this.physical).toFixed(10))
					let data = {
						payment,
						physical: this.physical,
						openid: getdata.openid,
						MerchantId: this.MerchantId,
						shopname: this.shopname,
						logo: this.logo,
						allorder: this.shop
					}
					//路径不能带对象，数组，只能是字符串
					let strorder = JSON.stringify(data)
					wx.navigateTo({
						url: '../placeorder/index?ide=' + strorder
					})
				}
			}
		},
		watch: {
			//用户进入页面，1.默认展示在第一个tab上.2.并且展示该分类下面的商品
			orderingdata(newValue, oldValue) {
				//1.取出左边的商品分类
				let classifarr = newValue.map((item) => {
					return item.optidata
				})
				//去重
				let setdataarr = Array.from(new Set(classifarr))
				//渲染
				this.orderclass = setdataarr
				//2.右边的商品
				this.commodity = newValue
				//3.右边默认分类为第一个分类
				this.ordertitle = newValue[0].optidata
				//4.往商品里添加一个字段(商品选购数量，默认为0)
				let commoditydata = newValue.map((item) => {
					let key = 'amount'
					let value = 0
					return item[key] = value
				})
				//5.右边默认展示的商品是第一个分类下的商品
				let classifarrdata = this.commodity.filter((item) => {
					return item.optidata == newValue[0].optidata
				})
				this.classifarr = classifarrdata
			},
			//商家介绍
			busidata(newValue, oldValue) {
				//配送费
				this.physical = newValue.physical
				//起送费
				this.delivering = newValue.delivering
				//商家标识
				this.MerchantId = newValue.openid
				//商家logo
				this.logo = newValue.logo
				//商家名字
				this.shopname = newValue.shop
			}
		},
		computed: {
			calculation() {
				//监听总价
				//数组对象去重：reduce累加器
				let arr = []
				let arrdata = this.arrtotalPrice.reduce((preVal, curVal) => {
					arr[curVal.indexs] ? '' : arr[curVal.indexs] = true && preVal.push(curVal)
					return preVal
				}, [])
				//除去总价为0的商品
				let taoarr = arrdata.filter((item) => {
					return item.Totalprice != 0
				})
				this.shop = taoarr
				//所有商品累计之和
				let number = 0
				arrdata.forEach((item) => {
					number += item.Totalprice
				})
				this.finalprice = parseFloat((number).toFixed(10))
				//监听选择的数量
				let num = 0
				arrdata.forEach((item) => {
					num += item.amount
				})
				this.takeNum = num
			},

			//监听是否已经选择商品
			choiceTake() {
				if (this.finalprice === 0) {
					this.isActive = false
					this.flag = false
				} else {
					this.isActive = true
					//监听起送价是否满足
					if (this.delivering > this.finalprice) {
						let preceMen = parseFloat((this.delivering - this.finalprice).toFixed(10))
						this.difference = '还差' + preceMen + '元'
						this.flag = false
					} else {
						this.difference = '去结算'
						this.flag = true
					}
				}
			}
		}
	}
</script>

<style scoped>
	.ordering-fls {
		display: flex;
		justify-content: space-between;
	}

	/* 左边商品分类 */
	.ordering-left {
		width: 190upx;
		background: #fafafa;
		overflow-y: auto;
		height: 100%;
	}

	.ordering-left text {
		color: #a8a8a8;
		display: block;
		font-size: 28upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}

	.active {
		background: #FFFFFF !important;
		font-weight: bold !important;
	}

	/* 右边商品信息 */
	.ordering-right {
		width: 100%;
		padding: 9upx 9upx 130upx 9upx;
		overflow: hidden;
		overflow-y: auto;
	}

	.activeord {
		background: #FFFFFF !important;
		font-weight: bold !important;
	}

	.ordering-right-title {
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
	}

	.content-view {
		display: flex;
		justify-content: space-between;
		height: 200upx !important;
		overflow: hidden;
		margin: 30upx 0;
		color: #898989;
	}

	.content-img {
		width: 180rpx !important;
		height: 200rpx !important;
		overflow: hidden;
	}

	.content-img image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
		overflow: hidden;
	}

	.content-title {
		/* width: 100%; */
		padding-left: 10upx;
		font-size: 24upx;
	}

	.conteng-take {
		color: #333333;
		height: 50upx;
		font-size: 33upx;
		font-weight: bold;
		line-height: 50upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.conteng-monthly {
		display: flex;
	}

	.conteng-monthly text {
		background: #f1f1f1;
		margin-right: 9upx;
		padding: 4upx 13upx;
		border-radius: 7upx;
		display: block;
	}

	.conteng-starting {
		display: flex;
		align-items: center;
		height: 50upx;
		line-height: 50upx;
	}

	.conteng-price image {
		width: 60upx;
		height: 60upx;
	}

	.conteng-price {
		display: flex;
		align-items: center;
	}

	.ordering-price {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
	}

	/* 数量 */
	.amounting {
		width: 50upx;
		text-align: center;
	}

	.conteng-hua {
		text-decoration: line-through;
	}

	.conteng-shi {
		color: #fb4e44;
		font-size: 33upx;
		width: 180upx;
		overflow: hidden;
	}

	/* 购物车 */
	.shopping {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
	}

	.shopping-left {
		height: 130upx;
		background: #000000;
		flex-grow: 2;
		border-top-left-radius: 50upx;
		border-bottom-left-radius: 50upx;
	}

	.shopping-right {
		height: 130upx;
		line-height: 130upx;
		font-size: 30upx;
		color: #7f7f7f;
		text-align: center;
		background: #000000;
		flex-grow: 1;
		border-top-right-radius: 50upx;
		border-bottom-right-radius: 50upx;
	}

	.shopping-dis {
		display: flex;
		height: 130upx;
		margin: 0 20upx;
	}

	.qishou {
		width: 120upx;
		height: 150upx;
		position: fixed;
		bottom: 0upx;
		left: 50upx;
	}

	.qishou image {
		width: 120upx;
		height: 150upx !important;
	}

	/* 定位 */
	.delivery {
		color: #999999;
		font-size: 28upx;
		height: 65upx;
	}

	.shopping-left text {
		display: block;
	}

	.total-price {
		font-size: 40upx;
		color: #FFFFFF;
		height: 65upx;
		line-height: 65upx;
	}

	.cost-money {
		padding-left: 170upx;
		color: #4CD964;
		height: 130upx;
	}

	/* 数量 */
	.numbering {
		background: red;
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		font-size: 20upx;
		color: #FFFFFF;
		text-align: center;
		line-height: 40upx;
		position: fixed;
		bottom: 50upx;
		left: 130upx;
	}

	/* 选中菜品 */
	.shoppactive {
		background: #ffd300 !important;
		color: #000000 !important;
	}
</style>
