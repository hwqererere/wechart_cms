const app = getApp()
const db = require("../../lib/db.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    db.selectAll("article", function (selres) {    
 
      self.setData({ list: selres })
    })  
  },
  link:function(e){
    let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
    wx.navigateTo({
      url: 'detail?id='+id,
    })
  }
})