var app = getApp()

Page({
	data:{
    array: ['中国', '美国', '巴西', '日本'],
    dndex: 0,

    fulljobval: ['无要求','全职', '兼职'],
    educationval: ['初中', '高中', '中专', '大专', '本科', '研究生', '博士', '保密'],
    isFreeval: ['在职', '离职'],

  
    index: 0,
    fulljobindex: 0,
    educationindex: 0,
    isFreeindex: 0,
    educationYearData: '2015-09-01',
    
    provinceval: ['北京'],
    livingcityval: ['北京'],
    livingcityindex: 0,
    provinceindex: 0,

    birthdayData: '1980-01-01',

		disabled:false,
		next:"next",

    post_code:null,
	},

  onLoad: function (options) {
    var that = this;
    console.log(options);
    this.data.post_code = options.post_code;
    console.log(this.data);

    wx.request({
      url: 'http://www.backend.cn/api.php/weixin/Resume/getArea',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.success != false) {
          that.setData({
            provinceval: res.data.data
          });
        } else{ 
          that.setData({
            provinceval: []
          });
        }
      }
    });

    wx.request({
      url: 'http://www.backend.cn/api.php/weixin/Resume/getRegion?pid_name=%E5%8C%97%E4%BA%AC',
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.success != false) {
          that.setData({
            livingcityval: res.data.data
          });
        } else {
          that.setData({
            livingcityval: []
          });
        }
      }
    });
  },

  bindProvinceChange: function (e) {
    var that = this;
    console.log('bindProvinceChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      provinceindex: e.detail.value
    });
    
    wx.request({
      url: 'http://www.backend.cn/api.php/weixin/Resume/getRegion?pid_name=' + that.data.provinceval[e.detail.value],
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.success != false) {
          that.setData({
            livingcityval: res.data.data
          });
        } else {
          that.setData({
            livingcityval: []
          });
        }
      }
    });
  },

  livingcityChange: function (e) {
    console.log('livingcityChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      livingcityindex: e.detail.value
    })
  },

  bindBirthdayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthdayData: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dindex: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindEducationChange: function (e) { 
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ 
      educationindex: e.detail.value
    })
  },

  bindisFreeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      isFreeindex: e.detail.value
    })
  },

  bindEducationYearChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      educationYearData: e.detail.value
    })
  },

  bindFulljobChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      fulljobindex: e.detail.value
    })
  },

	next:function (e) {
		var value=e.detail.value;
		if(value.length>0){
			this.setData({
				disabled:false,
				next:"next red",
				a:"../res-success/res-success"
			})
		}else{
			this.setData({
				disabled:true,
				next:"next"
			})
		}
	},

  // fullname: e.detail.value.fullname,
  formSubmit: function (e) {
    var postdata = e.detail.value;
    var that =this;

    var userInfo = app.globalData.userInfo;
    postdata.openid = userInfo.openid;
    wx.request({  
      url: 'http://www.backend.cn/api.php/weixin/resume/add',
      method: 'post',
      data: {
        postdata: postdata,      
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if( res.data.success != false ){
            wx.showModal({
              title: '提示',
              content: '简历已经保存，跳回原职位投递？',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "../postdetail/index?code=" + that.data.post_code
                  });
                } else if (res.cancel) {
                }
              }
            })
            // wx.showToast({
            //   title: '成功',
            //   icon: 'success',
            //   mask: true,
            //   duration: 40000,
            //   complete: function(){
            //     wx.redirectTo({
            //       url: "../postdetail/index?code=" + that.data.post_code
            //     });
            //   }
            // });
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              image: '../../images/error.png',
              duration: 2000
            })
         }
      },
      error: function (res) {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        })
      },
    });
    console.log(postdata);
    console.log('form发生了submit事件，携带数据为：', e);
  },	
})