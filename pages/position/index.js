var app = getApp()
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false  // loading
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
  },

  onLoad: function() {
        var that = this;
        
        //sliderList
        wx.request({
          url: 'http://www.backend.cn/api.php/weixin/Slider/getlist',
          method: 'GET',
          data: {},
          header: {
            //'Accept': 'application/json'
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              images: res.data
            })
          }
        })

        wx.request({
          url: 'http://www.backend.cn/api.php/weixin/position/getlist',
            method: 'GET',
            data: {},
            header: {
                //'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res.data);

                that.setData({
                    positionList: res.data
                });

                setTimeout(function () {
                  that.setData({
                    loadingHidden: true
                  })
                }, 500);
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