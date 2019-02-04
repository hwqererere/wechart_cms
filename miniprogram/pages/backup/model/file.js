const app = getApp()
const db=require("../../../lib/db.js")

function showlist(self){
  db.selectAll("file", function (selres) {
    app.globalData.fileData = {}
    app.globalData.fileData.showlist = selres
    self.setData({fileData:{list:selres,dellist:[]}})
  })
}

const initfile = function(self,callback) {
  self.setData({ fileData: { list: app.globalData.fileData.showlist, dellist: [] } })
}

const addimg=function(self,callback){
  wx.chooseImage({
    success: function(res) {
      let myDate = new Date();
      for(let i=0;i<res.tempFiles.length;i++){
        let pathname = res.tempFiles[i].path.split(".")
        let filename = i + "i" + myDate.getTime() +"."+pathname[pathname.length-1]
        wx.cloud.uploadFile({
          cloudPath: 'images/'+filename, // 上传至云端的路径
          filePath: res.tempFiles[i].path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            // console.log(res.fileID)
            db.add("file", { type: "image", pathid: res.fileID},function(){
              showlist(self)
            })
          },
          fail: console.error
        })
      }
    }
  })
}
const checkboxChange=function(self,e){
  app.globalData.fileData.dellist=e.detail.value
}

const delchose=function(self,e){
  let dellist = app.globalData.fileData.dellist
  wx.showModal({
    title: '提示',
    content: '确定要删除所选的'+dellist.length+'个文件吗？',
    success(res) {
      if (res.confirm) {
        let filedellist=[]
        for (let i = 0; i < dellist.length;i++){
          for(let j=0;j<app.globalData.fileData.showlist.length;j++){
            if (dellist[i] == app.globalData.fileData.showlist[j]._id){
              filedellist[filedellist.length] = app.globalData.fileData.showlist[j].pathid
            }
          }
        }
        wx.cloud.deleteFile({
          fileList: filedellist,
          success: res => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            for(let i=0;i<dellist.length;i++){
              db.del("file",dellist[i],function(){
                if(i==(dellist.length-1)){
                  app.globalData.fileData.dellist=[]
                  showlist(self)
                }
              })
            }
            
          },
          fail: failres => {
            wx.showToast({
              title: '删除失败' + failres,
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
module.exports = {
  initfile: initfile,
  addimg:addimg,
  checkboxChange: checkboxChange,
  delchose:delchose
}