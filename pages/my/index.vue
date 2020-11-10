<template>
	<view>
		<view class="myhome">
			<!-- 已登录 -->
			<view class="wx-name" v-if="wxlogin">
				<view>
					<image :src="usering.avatarUrl"></image>
				</view>
				<view class="wx-text">
					<text>{{usering.nickName}}</text>
				</view>
			</view>

			<!-- 未登录 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="wx-button-view">登录美团外卖,开启吃货旅程</view>
				<view>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">去登录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		publicing
	} from '../../api/api.js'
	import {
		wxloginurl
	} from '../../api/request.js'
	export default {
		data() {
			return {
				wxlogin: true,
				usering: {}
			}
		},
		methods: {
			//获取头像昵称
			getUserInfo(e) {
				console.info(e)
				if (e.detail.userInfo) {
					let wxing = e.detail.userInfo
					this.wxCode(wxing.nickName, wxing.avatarUrl)
				}
			},
			//获取code
			wxCode(nickName, avatarUrl) {
				wx.login({
					success: (res) => {
						console.info(res)
						let code = res.code
						this.wxLogin(nickName, avatarUrl, code)
					},
					fail: (err) => {
						console.info(err)
					}
				})
			},
			//请求登录接口
			wxLogin(nickName, avatarUrl, code) {
				let data = {
					appid: 'wx4ecdf773583f00c0',
					secret: '6ae5375d34e0265abbbede1598e5e29a',
					code,
					nickName,
					avatarUrl
				}
				publicing(wxloginurl, data).then((res) => {
					//存入本地
					if (res.data.msg == 'success') {
						uni.setStorageSync('user', res.data.datas)
						this.ifUser()
					}
				}).catch((err) => {
					console.info(err)
				})
			},

			//取出本地存入的用户信息
			ifUser() {
				let getdata = uni.getStorageSync('user')
				if (!getdata) {
					this.wxlogin = false
				} else {
					this.wxlogin = true
					this.usering = getdata
					console.info(this.usering)
				}
			}
		},
		onShow() {
			this.ifUser()
		}
	}
</script>

<style scoped>
	.myhome {
		background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
		height: 350upx;
		display: flex;
		align-items: center;
	}

	.wx-name image {
		width: 120upx !important;
		height: 120upx !important;
		border-radius: 50%;
		margin-right: 20upx;
		border: 10rpx solid #999999;
	}

	text {
		display: block;
		margin: 10upx 0;
		color: #999999;
	}

	.wx-name {
		display: flex;
		align-items: center;
		padding: 0 30upx;
		align-content: center;
		height: 200upx;
	}

	.wx-text text {
		font-size: 35upx;
	}

	/* 登录 */
	.wx-button button {
		border: none;
		font-size: 30upx;
		background: linear-gradient(to right, #28a6f1 10%, #0e8dd7 80%);
		border-radius: 50upx;
		color: #FFFFFF;
	}

	.wx-button-view {
		font-size: 35upx;
		color: #FFFFFF;
		margin-bottom: 25upx;
	}

	.wx-button {
		margin: 0 auto;
	}
</style>
