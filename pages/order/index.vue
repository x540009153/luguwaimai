<template>
	<view>
		<block v-for="(item,index) in neworder" :key="index">
			<view class="order-back">
				<view class="order-view">
					<view class="order-img">
						<image src="http://lstkk.oss-cn-beijing.aliyuncs.com/meituan/public/uploads/1583591740906.png" mode="aspectFill"></image>
					</view>
					<view class="goods-commodity">{{item.shopname}}</view>
					<view class="order-succ">
						{{item.pay}}
					</view>
				</view>
				<view>
					<block v-for="(itemdata,index) in item.Paymentinfor" :key="index">
						<view class="order-dishes">
							<text>{{itemdata.input}}</text>
							<text>x{{itemdata.amount}}</text>
						</view>
					</block>
				</view>

				<view class="order-Total">
					<view class="order-left" @click="popup(item.isevaluate)">
						<text>{{item.isevaluate}}</text>
					</view>
					<view class="order-right">
						<text>共{{item.num}}件商品</text>
						<text>合计：{{item.total}}元</text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				neworder: [{
						shopname: '九丰土菜馆',
						pay: '付款成功',
						Paymentinfor: [{
								input: '狮子头',
								amount: 2
							},
							{
								input: '可乐鸡翅',
								amount: 3
							},
							{
								input: '芝麻汤圆',
								amount: 1
							}
						],
						isevaluate: '已评价',
						num: 6,
						total: 2.3
					},
					{
						shopname: '九丰土菜馆',
						pay: '付款成功',
						Paymentinfor: [{
							input: '五香牛肉米粉',
							amount: 5
						}],
						isevaluate: '未评价',
						num: 5,
						total: 5.3
					},
					{
						shopname: '九丰土菜馆',
						pay: '付款成功',
						Paymentinfor: [{
								input: '农家小炒肉',
								amount: 1
							},
							{
								input: '酸菜鸭血豆腐',
								amount: 2
							}
						],
						isevaluate: '未评价',
						num: 3,
						total: 3.1
					},
					{
						shopname: '九丰土菜馆',
						pay: '付款成功',
						Paymentinfor: [{
								input: '番茄炒鸡蛋',
								amount: 3
							},
							{
								input: '青椒炒鸡蛋',
								amount: 4
							},
							{
								input: '烧鸡',
								amount: 1
							},
							{
								input: '尖椒炒猪头肉',
								amount: 1
							}
						],
						isevaluate: '未评价',
						num: 9,
						total: 4.5
					}
				]
			}
		},
		methods: {
			popup(evaluate) {
				console.info(evaluate)
				if (evaluate === '未评价') {
					wx.showModal({
						title: '提示',
						content: '该页面未做交互处理',
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
	page {
		background: #f2f3f4;
	}

	.order-back {
		background: #FFFFFF;
		margin: 10upx;
		padding: 20upx 10upx;
		border-radius: 9upx;
	}

	.order-img {
		width: 100upx;
		height: 100upx;
		padding-right: 20upx;
	}

	.order-view image {
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
	}

	.order-view {
		height: 106upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
	}

	.goods-commodity {
		flex-grow: 1;
		font-size: 30upx;
		font-weight: bold;
	}

	.order-succ {
		font-size: 28upx;
		color: #666666;
	}

	.order-dishes {
		font-size: 28upx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}

	.order-Total text {
		display: block;
	}

	.order-right text:nth-child(1) {
		padding-right: 10upx;
	}

	.order-Total {
		font-size: 28upx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}

	.order-right {
		display: flex;
		align-items: center;
	}

	.order-left text {
		background: #f2f3f4;
		border-radius: 10upx;
		padding: 5upx 10upx;
	}
</style>
