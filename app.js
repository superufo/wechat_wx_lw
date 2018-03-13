//app.js
var app = getApp()

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo('')
  },
  getUserInfo:function(cb){
    var that = this;
    console.log(this.globalData);
    //this.globalData.userInfo &&  this.globalData.use!==null
    if ( this.globalData.userInfo  ){
      this.globalData.userInfo.openid = 'ab77611314db87d981e2';

      console.log(this.globalData.userInfo.openid);
      this.globalData.userInfo.expires_in = 1;
      wx.setStorageSync('userInfo', this.globalData.userInfo);

      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              try {
                wx.setStorageSync('userInfo', res.userInfo);
              } catch (e) {
                console.log('error:' + e);
              }
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });

      that.globalData.userInfo.openid = 'ab77611314db87d981e2';
      console.log(that.globalData.userInfo.openid);
      that.globalData.userInfo.expires_in = res.data.expires_in;
      wx.setStorageSync('userInfo', that.globalData.userInfo);


      var staticData = that.globalData;//这里存储了appid、secret、token串    
      var link = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + staticData.appid + '&secret=' + staticData.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
      wx.request({
        url: link,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT     
        success: function (res) {
          var user = {};
          user.openid = res.data.openid;
          user.expires_in = Date.now() + res.data.expires_in;

          that.globalData.userInfo.openid = res.data.openid;
          that.globalData.userInfo.expires_in = res.data.expires_in;
          wx.setStorageSync('userInfo', that.globalData.userInfo);//存储openid
          console.log(that.globalData.userInfo);
        }
      });

      //获取用户信息
      var  openid = staticData.user.openid==null ? 'ab77611314db87d981e2' : staticData.user.openid;
      //注册
      wx.request({
        url: 'http://www.backend.cn/api.php/weixin/user/add',
        method: 'post',
        data: {
          openid: openid,
          avatarUrl: staticData.userInfo.avatarUrl,
          nickName: staticData.userInfo.nickName,
          gender: staticData.userInfo.gender,
          province: staticData.userInfo.province,
          city: staticData.userInfo.city,
          existResume: 0
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
        },
        error: function (res) {
          console.log(res);
        }
      });
    }  
  },
  globalData:{
    appid: 'wx1665d7c6e8e50e1e',//appid需自己提供，此处的appid我随机编写  
    secret: 'f348d07a7469fc7a49513c50ec04166a',//secret需自己提供，此处的secret我随机编写  
    userInfo:null,
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
})

// /***微信开发者
// AppID(应用ID)
// wx1665d7c6e8e50e1e
// AppSecret(应用密钥)
// f348d07a7469fc7a49513c50ec04166a***/

// App({
//   globalData: {
//     appid: 'wx1665d7c6e8e50e1e',//appid需自己提供，此处的appid我随机编写  
//     secret: 'f348d07a7469fc7a49513c50ec04166a',//secret需自己提供，此处的secret我随机编写  
//     userInfo: null
//   },
//   onLaunch: function () {
//     var that = this
//     var user = wx.getStorageSync('user') || {};
//     var userInfo = wx.getStorageSync('userInfo') || {};
//     if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
//       wx.login({
//         success: function (res) {
//           if (res.code) {
//             wx.getUserInfo({
//               success: function (res) {
//                 var objz = {};
//                 objz.avatarUrl = res.userInfo.avatarUrl;
//                 objz.nickName = res.userInfo.nickName;
//                 //console.log(objz);  
//                 wx.setStorageSync('userInfo', objz);//存储userInfo  
//                 that.globalData.userInfo = res.userInfo;
//               }
//             });
//             var d = that.globalData;//这里存储了appid、secret、token串    
//             var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
//             wx.request({
//               url: l,
//               data: {},
//               method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
//               // header: {}, // 设置请求的 header    
//               success: function (res) {
//                 var obj = {};
//                 obj.openid = res.data.openid;
//                 obj.expires_in = Date.now() + res.data.expires_in;
//                 console.log(obj);  
//                 wx.setStorageSync('user', obj);//存储openid    
//               }
//             });
//           } else {
//             console.log('获取用户登录态失败！' + res.errMsg)
//           }
//         }
//       });
//     }
//   },
// })  

