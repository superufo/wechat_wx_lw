//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '欢迎晨鸟劳务平台',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  rederectTap: function () {
    var staticData = app.globalData;
    //添加用户
    var openid = staticData.user==null ? 'ab77611314db87d981e2' : '';
    console.log(staticData);
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
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(45555444); console.log(res);
      },
      error: function (res) {
        //console.log(88888888888);
      },
    });

    wx.switchTab({
      url: '../position/index?type=1'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})




