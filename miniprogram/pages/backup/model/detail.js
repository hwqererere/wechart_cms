const app = getApp()


const initdetail = function(self,callback) {
  callback.call(this, {})
}

const detailCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=detail',
  })
}

const fileCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=file',
  })
}

const managerCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=manager',
  })
}

const systemCtrl=function(){
  wx.navigateTo({
    url: 'index?pageid=system',
  })
}
module.exports = {
  initdetail: initdetail
 
}