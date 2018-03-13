var WxParse = require('../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    position: {},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,  // loading
  },

  //事件处理函数
  sendResume: function(e) {
    //https://mp.weixin.qq.com/debug/wxadoc/dev/api/getPhoneNumber.html  bindgetphonenumber="sendResume"
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData) 
    var that = this;

    var userInfo = app.globalData.userInfo;
    
    console.log(userInfo)
    console.log(userInfo.openid)
    //userInfo.openid = 'ab77611314db87d981e2';
    if (userInfo.openid) {
      userInfo.openid = 'ab77611314db87d981e2';
      //获取用户是否有简历
      wx.request({
        url: 'http://www.backend.cn/api.php/weixin/user/getone.html?openid=' + userInfo.openid,
        method: 'get',
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.data.resumeId == '' || res.data.data.resumeId == null ){
            //简历新增页面
            wx.redirectTo({
              url: '../resume/add?openid=' + userInfo.openid + '&post_code=' + that.data.position.data.code
            })
          }else{
            var postdata = {
                    resume_id: res.data.data.resumeId,
                    post_code: that.data.position.data.code,
                    post_name: that.data.position.data.name,
                    openid: userInfo.openid
                };
            console.log(postdata); 
            wx.showModal({
              title: '发送确认',
              content: '发送不可撤回，确定要投递吗',
              confirmText: "立即发送",
              cancelText: "再考虑下",
              success: function (cmOK) {
                console.log(res);
                if (cmOK.confirm) {
                  wx.request({
                    url: 'http://www.backend.cn/api.php/weixin/position/sendresume',
                    method: 'post',
                    data: postdata,
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (dres) {
                      console.log(dres);
                      if (dres.data.success !== false) {
                        wx.showModal({
                          title: '提示',
                          content: dres.data.msg,
                          success: function (dres) {
                            if (dres.confirm) {
                              wx.switchTab({
                                url: '../position/index?type=1'
                              });
                            } else if (dres.cancel) {
                            }
                          }
                        })
                      } else {
                        wx.showToast({
                          title: dres.data.msg,
                          icon: 'fail',
                          image: '../../images/error.png',
                          duration: 2000
                        })
                      }
                    },
                    error: function (dres) {
                      wx.showToast({
                        title: '失败',
                        icon: 'fail',
                        image: '../../images/error.png',
                        duration: 2000
                      })
                    },
                  });
                } else if (cmOK.cancel) {
                   console.log('再考虑下')
                }
              }
            })
          }
        }
      });
    }else{
      //跳转首页重新授权
      wx.redirectTo({
        url: '../index/index'
      })
    }


  },

  onLoad: function (options) {
        var that = this;

        wx.request({
          url: 'http://www.backend.cn/api.php/weixin/position/getone.html?code=' + options.code,
            method: 'GET',
            data: {},
            header: {
                //'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                /**  http://www.jianshu.com/p/3de027555e77
                 * WxParse.wxParse(bindName , type, data, target,imagePadding)
                 * 1.bindName绑定的数据名(必填)
                 * 2.type可以为html或者md(必填)
                 * 3.data为传入的具体数据(必填)
                 * 4.target为Page对象,一般为this(必填)
                 * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                 */
              
                WxParse.wxParse('request', 'html', res.data.request, that, 5);
                WxParse.wxParse('duty', 'html', res.data.duty, that, 5);

                that.setData({
                  position: res
                });

                setTimeout(function () {
                  that.setData({
                    loadingHidden: true
                  })
                }, 500);
            }
        })
    }
})