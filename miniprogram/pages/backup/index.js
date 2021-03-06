// pages/backup/index.js
const router=require("router.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageid:"index",
    detailData:{},
    fileData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.options=options
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    let allpages = getCurrentPages()
    let thispage = allpages[allpages.length - 1]
    let pageid = thispage.options.pageid ? thispage.options.pageid : "index"
    router.pageCtrl(self,pageid, function (redata) {
      self.setData(redata)
    })
  },
  clickFn: function (e) {
    let self = this
    router.click(self,e, function (data) {
      self.setData(data)
    })
  },
  
})