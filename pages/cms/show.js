// pages/resume/index.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,  // loading
    topiclist:null,
    next: "next",
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
  },

  onLoad: function (option) {
    var that = this;

    wx.request({
      url: 'http://www.backend.cn/index.php/weixin/topic/getone?id='+option.id,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data);

        WxParse.wxParse('content', 'html', res.data.data.content, that, 5);
        that.setData({
          topicinfo: res.data.data
        });

        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 500);
      },
      error: function (error){
        console.log(res.data);
      }
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})