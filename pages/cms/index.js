//index.js
var util = require("../../utils/util")
//获取应用实例

var app = getApp()
Page({
  data: {
    navbarArray: [{
      text: '视频',
      type: 'navbar-item-active',
      hidden:false
    }, {
      text: '牢骚',
      type: '',
      hidden: true
    }, {
      text: '职场',
      type: '',
      hidden: true
    }, {
      text: '政策',
      type: '',
      hidden: true
    }, {
      text: '笑话',
      type: '',
      hidden: true
    }, {
      text: '热点',
      type: '',
      hidden: true
    }],
    navbarShowIndexArray: Array.from(Array(12).keys()),
    navbarHideIndexArray: [],
    windowWidth: 375,
    scrollNavbarLeft: 0,
    currentChannelIndex: 0,
    startTouchs: {
      x: 0,
      y: 0
    },
    channelSettingShow: '',
    channelSettingModalShow: '',
    channelSettingModalHide: true,
    articlesHide: false,
    articleContent: '',
    loadingModalHide: false,
    temporaryArray: Array.from(new Array(9), (val, index) => index + 1),

    lists: [],
    lslists: [],
    zcanglists: [],
    zchelists: [],
    xhlists: [],
    rdlists: [],
    controls: true//是否显示播放控件
  },

  onLoad: function () {
    const that = this;

    let navbarShowIndexArrayData = wx.getStorageSync('navbarShowIndexArray');
    if (navbarShowIndexArrayData) {
      that.setData({
        navbarShowIndexArray: navbarShowIndexArrayData
      });
    } else {
      that.storeNavbarShowIndexArray();
    }

    that.getArticles(0);

    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowWidth: res.windowWidth
        });
      }
    });

    let navbarArray = that.data.navbarArray;
    let navbarShowIndexArray = that.data.navbarShowIndexArray;
    let navbarHideIndexArray = [];
    navbarArray.forEach((item, index, array) => {
      if (-1 === navbarShowIndexArray.indexOf(index)) {
        navbarHideIndexArray.push(index);
      }
    });
    that.setData({
      navbarHideIndexArray: navbarHideIndexArray
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onTapNavbar: function (e) {
    this.switchChannel(parseInt(e.currentTarget.id));
  },
  switchChannel: function (targetChannelIndex) {
    this.getArticles(targetChannelIndex);

    let navbarArray = this.data.navbarArray;
    navbarArray.forEach((item, index, array) => {
      item.type = '';
      if (index === targetChannelIndex) {
        item.type = 'navbar-item-active';
        item.hidden = false;
      }else{
        item.hidden = true;
      }
    });
    this.setData({
      navbarArray: navbarArray,
      currentChannelIndex: targetChannelIndex
    });
  },

  getArticles: function (index) {
    const that = this;
    console.log(this.data.navbarArray);
    wx.request({
      url: 'http://www.backend.cn/index.php/weixin/topic/getlist?tab=' + index,
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      // lists: [],
      // lslists: [],
      // zcanglists: [],
      // zchelists: [],
      // xhlists: [],
      // rdlists: [],
      success: function (res) {
        console.log(index);
        console.log(res);
        if(index==0){
          that.setData({
            lists: res.data
          })
        } else if (index == 1) {
          that.setData({
            lslists: res.data
          })
        } else if (index == 2) {
          that.setData({
            zcanglists: res.data
          })
        } else if (index == 3) {
          that.setData({
            zchelists: res.data
          })
        } else if (index == 4) {
          that.setData({
            xhlists: res.data
          })
        } else if (index == 5) {
          that.setData({
            rdlists: res.data
          })
        }

        console.log(that.data.lslists);
      }
    });

    that.setData({
      loadingModalHide: false,
      articleContent: ''
    });
    setTimeout(() => {
      that.setData({
        loadingModalHide: true,
        articleContent: that.data.navbarArray[index].text
      });
    }, 500);
  },

  onTouchstartArticles: function (e) {
    this.setData({
      'startTouchs.x': e.changedTouches[0].clientX,
      'startTouchs.y': e.changedTouches[0].clientY
    });
  },

  onTouchendArticles: function (e) {
    let deltaX = e.changedTouches[0].clientX - this.data.startTouchs.x;
    let deltaY = e.changedTouches[0].clientY - this.data.startTouchs.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      let deltaNavbarIndex = deltaX > 0 ? -1 : 1;
      let currentChannelIndex = this.data.currentChannelIndex;
      let navbarShowIndexArray = this.data.navbarShowIndexArray;
      let targetChannelIndexOfNavbarShowIndexArray = navbarShowIndexArray.indexOf(currentChannelIndex) + deltaNavbarIndex;
      let navbarShowIndexArrayLength = navbarShowIndexArray.length;
      if (targetChannelIndexOfNavbarShowIndexArray >= 0 && targetChannelIndexOfNavbarShowIndexArray <= navbarShowIndexArrayLength - 1) {
        let targetChannelIndex = navbarShowIndexArray[targetChannelIndexOfNavbarShowIndexArray];
        if (navbarShowIndexArrayLength > 6) {
          let scrollNavbarLeft;
          if (targetChannelIndexOfNavbarShowIndexArray < 5) {
            scrollNavbarLeft = 0;
          } else if (targetChannelIndexOfNavbarShowIndexArray === navbarShowIndexArrayLength - 1) {
            scrollNavbarLeft = this.rpx2px(110 * (navbarShowIndexArrayLength - 6));
          } else {
            scrollNavbarLeft = this.rpx2px(110 * (targetChannelIndexOfNavbarShowIndexArray - 4));
          }
          this.setData({
            scrollNavbarLeft: scrollNavbarLeft
          });
        }
        this.switchChannel(targetChannelIndex);
      }
    }
  },
  rpx2px: function (rpx) {
    return this.data.windowWidth * rpx / 750;
  },
  showChannelSettingModal: function () {
    const that = this;
    that.setData({
      channelSettingShow: 'channel-setting-show',
      articlesHide: true,
      channelSettingModalHide: false
    });
    setTimeout(() => {
      that.setData({
        channelSettingModalShow: 'channel-setting-modal-show'
      });
    }, 50);
  },
  hideChannelSettingModal: function () {
    const that = this;

    that.resetNavbar();

    that.setData({
      channelSettingShow: '',
      channelSettingModalShow: ''
    });
    setTimeout(() => {
      that.setData({
        channelSettingModalHide: true,
        articlesHide: false
      });
      that.getArticles(0);
    }, 500);
  },
  hideChannel: function (e) {
    let navbarShowIndexArray = this.data.navbarShowIndexArray;
    let navbarHideIndexArray = this.data.navbarHideIndexArray;
    navbarHideIndexArray.push(navbarShowIndexArray.splice(navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
    this.setData({
      navbarShowIndexArray: navbarShowIndexArray,
      navbarHideIndexArray: navbarHideIndexArray
    });
    this.storeNavbarShowIndexArray();
  },
  upChannel: function (e) {
    let navbarShowIndexArray = this.data.navbarShowIndexArray;
    let index = navbarShowIndexArray.indexOf(parseInt(e.currentTarget.id));
    let temp = navbarShowIndexArray[index];
    navbarShowIndexArray[index] = navbarShowIndexArray[index - 1];
    navbarShowIndexArray[index - 1] = temp;
    this.setData({
      navbarShowIndexArray: navbarShowIndexArray
    });
    this.storeNavbarShowIndexArray();
  },
  showChannel: function (e) {
    let navbarShowIndexArray = this.data.navbarShowIndexArray;
    let navbarHideIndexArray = this.data.navbarHideIndexArray;
    navbarShowIndexArray.push(navbarHideIndexArray.splice(navbarHideIndexArray.indexOf(parseInt(e.currentTarget.id)), 1)[0]);
    this.setData({
      navbarShowIndexArray: navbarShowIndexArray,
      navbarHideIndexArray: navbarHideIndexArray
    });
    this.storeNavbarShowIndexArray();
  },
  storeNavbarShowIndexArray: function () {
    const that = this;
    wx.setStorage({
      key: 'navbarShowIndexArray',
      data: that.data.navbarShowIndexArray
    });
  },
  resetNavbar: function () {
    let navbarArray = this.data.navbarArray;
    navbarArray.forEach((item, index, array) => {
      item.type = '';
      if (0 === index) {
        item.type = 'navbar-item-active';
      }
    });
    this.setData({
      navbarArray: navbarArray,
      scrollNavbarLeft: 0
    });
  },


  //下拉刷新
  onPullDownRefresh: function () {

  },
  //上拉加载
  onReachBottom: function () {

  },
  //点击video对象播放当前视频
  play: function (e) {
    //当前对象索引
    var index = e.currentTarget.id.split("-")[1],
      lists = this.data.lists,
      video = wx.createVideoContext(e.currentTarget.id);
    //当前video对象 isPlay设置     
    lists[index].isPlay = !!lists[index].isPlay ? false : true;

    console.log(lists[index].isPlay)

    //isPlay为true 执行播放操作
    if (lists[index].isPlay) {
      //播放当前video对象时其他video对象全部停止
      lists.forEach(function (item, i) {
        if (item.isVideo) {
          var video = wx.createVideoContext("vds-" + i);
          video.pause();
          //设置其他其他video对象isPlay为false
          if (i != index)
            item.isPlay = false;
        }
      });
      video.play();
    } else {
      video.pause();
    }
  },
  //进入详情
  detail: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title
    })
  }
})
