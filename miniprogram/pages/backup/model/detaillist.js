const app = getApp()
const db = require("../../../lib/db.js")
const initdetaillist = function(self,callback) {
  db.selectAll("article", function (selres) { 
  	console.log(selres)  
    self.setData({ detaillistData:selres})
  })  
  callback.call(this, {})
}

const del=function(self,e){
  let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
  for (let i = 0; i < self.data.detaillistData.length;i++){
    if (self.data.detaillistData[i]._id==id){
      let selobj = self.data.detaillistData[i]
      console.log(selobj)
      let cloud=[]
      if (selobj.titleimg!=""){
        cloud[cloud.length] = selobj.titleimg
      }
      if (selobj.word.length>0){
        for (let j = 0; j < selobj.word.length;j++){
          if (selobj.word[j].type == "idimage" || selobj.word[j].type == "idvideo"){
            cloud[cloud.length] = selobj.word[j].url
          }
        }
      }
      delfile(cloud, selobj._id,function(_id){
        db.del("article", _id,function(){
          initdetaillist(self,function(){})

        })
      })
    }
  }
}

function delfile(arr,_id,callback){
  if(arr.length>0){
    wx.cloud.deleteFile({
      fileList: arr,
      fail: failres => {
        wx.showToast({
          title: '删除失败' + failres,
          icon: 'none',
          duration: 2000
        })
      },
      complete:()=>{
        callback.call(this,_id)
      }
    })
  }else{
    callback.call(this,_id)
  }
  
}

const open=function(self,e){
  let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
  for (let i = 0; i < self.data.detaillistData.length; i++) {
    if (self.data.detaillistData[i]._id == id) {
      db.update("article", id, { showtype:1},function(){
        initdetaillist(self, function () { })
      })
    }
  }  
}

const close = function (self, e) {
  let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
  for (let i = 0; i < self.data.detaillistData.length; i++) {
    if (self.data.detaillistData[i]._id == id) {
      db.update("article", id, { showtype: 0 }, function () {
        initdetaillist(self, function () { })
      })
    }
  }
}
module.exports = {
  initdetaillist: initdetaillist,
  del: del,
  open: open,
  close:close
}