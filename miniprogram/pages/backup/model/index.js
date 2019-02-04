const app = getApp()
const db = require("../../../lib/db.js")

const initindex = function initindex(self,callback) {
  callback.call(this, {})
}

const detailCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=detaillist',
  })
}

const fileCtrl=function(){
  db.selectAll("file", function (res) {
    app.globalData.fileData = {}
    app.globalData.fileData.showlist=res
    
    wx.navigateTo({
      url: 'index?pageid=file',
    })
  })
  
}

const newdetail=function(){
  wx.navigateTo({
    url: 'index?pageid=detail',
  })
}

const systemCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=system',
  })
}
module.exports = {
  initindex: initindex,
  detailCtrl: detailCtrl,
  fileCtrl: fileCtrl,
  newdetail: newdetail,
  systemCtrl: systemCtrl
}