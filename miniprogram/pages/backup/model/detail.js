const app = getApp()
const db = require("../../../lib/db.js")
function getarticle(self){
  db.selectAll("file", function (selres) {
   
  })
}

const initdetail = function(self,callback) {

  app.globalData.detailData = self.data.detailData
  callback.call(this, {})
}
const titleinput = function (self, e) {
  app.globalData.detailData.title=e.detail.value
}

const selimg=function(self,e){
  wx.chooseImage({
    count:1,
    success: function (res) {
      app.globalData.detailData.showimg = res.tempFilePaths[0]
      self.setData({ detailData: app.globalData.detailData})
    }
  })
}

const delselimg=function(self,e){
  app.globalData.detailData.showimg=""
  self.setData({ detailData: app.globalData.detailData })
}

const addword=function(self,e){
  if (!app.globalData.detailData.word){
    app.globalData.detailData.word=[]
  }
  app.globalData.detailData.word[app.globalData.detailData.word.length]={type:"word",word:""}
  self.setData({ detailData: app.globalData.detailData })
}

const addpic=function(self,e){
  wx.chooseImage({
    count: 1,
    success: function (res) {
      app.globalData.detailData.word = app.globalData.detailData.word ? app.globalData.detailData.word : []
      app.globalData.detailData.word[app.globalData.detailData.word.length] = { type: "image", url: res.tempFilePaths[0]}
      self.setData({ detailData: app.globalData.detailData })
    }
  })
}
const addvid=function(self,e){
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success(res) {
      app.globalData.detailData.word = app.globalData.detailData.word ? app.globalData.detailData.word:[]
      app.globalData.detailData.word[app.globalData.detailData.word.length] = { type: "video", url: res.tempFilePath }
      self.setData({ detailData: app.globalData.detailData })
    }
  })
}


const delline=function(self,e){
  let ind = e.currentTarget.dataset.ind ? e.currentTarget.dataset.ind : e.target.dataset.ind
  app.globalData.detailData.word.splice(ind, 1)
  self.setData({ detailData: app.globalData.detailData })
}

const checkboxChange=function(self,e){
  app.globalData.detailData.showtype=e.detail.value
  self.setData({ detailData: app.globalData.detailData })
}
const formSubmit=function(self,e){
  let val=e.detail.value
  let subData={}
  subData.title = app.globalData.detailData.title
  subData.showtype=app.globalData.detailData.showtype?app.globalData.detailData.showtype:'0'
  app.globalData.detailData.word = app.globalData.detailData.word ? app.globalData.detailData.word : []
  db.add("article", subData, function (res) {
    let _id=res._id

    for (let i = 0; i < app.globalData.detailData.word.length; i++) {
      if (app.globalData.detailData.word[i].type == "word") {
        app.globalData.detailData.word[i] = { type: "word", word: val["t" + i] }
      }
    }
    wx.showLoading({
      title: '文件上传中',
    })

    uplaoadset(_id,function () {      
      app.globalData.detailData.showimg = app.globalData.detailData.showimg ? app.globalData.detailData.showimg : ""
      if (app.globalData.detailData.showimg != "") {
        let pathname = app.globalData.detailData.showimg.split(".")        
        let filename = _id +"_titimg"  + "." + pathname[pathname.length - 1]
        wx.cloud.uploadFile({
          cloudPath: 'article/' + filename, // 上传至云端的路径
          filePath: app.globalData.detailData.showimg, // 小程序临时文件路径
          success: res => {
            app.globalData.detailData.titleimg = res.fileID
            
            db.update("article", _id, app.globalData.detailData, function (r) {              
              wx.hideLoading()
              console.log("编辑成功")
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
              app.globalData.detailData = {}
              self.setData({ detailData: {} })
            })
          },
          fail: console.error
        })
      } else {
        subData.titleimg = ""
        db.update("article", _id, app.globalData.detailData, function (r) {          
          wx.hideLoading()
          console.log("编辑成功")
          app.globalData.detailData={}
          self.setData({ detailData:{}})
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        })
      }
    })

  })


  

  
}

function uplaoadset(_id,callback){
  let key=true
  console.log(app.globalData.detailData.word)
  for(let i=0;i<app.globalData.detailData.word.length;i++){
    if ((app.globalData.detailData.word[i].type == "image" && key) || (app.globalData.detailData.word[i].type == "video" && key)){
      key=false
      let pathname = app.globalData.detailData.word[i].url.split(".")     
      let filename = _id + "_" + i +"."+pathname[pathname.length-1]     
      
      wx.cloud.uploadFile({
          cloudPath: 'article/'+filename, // 上传至云端的路径
          filePath: app.globalData.detailData.word[i].url, // 小程序临时文件路径
          success: res => {
            if (app.globalData.detailData.word[i].type=="image"){
              app.globalData.detailData.word[i] = { type: "idimage", url: res.fileID }     
            }else{
              app.globalData.detailData.word[i] = { type: "idvideo", url: res.fileID }     
            }             
            
            uplaoadset(_id,callback)
          },
          fail: console.error
      })
    }
  }

  if(key){
    callback.call()
  }
}

module.exports = {
  initdetail: initdetail,
  selimg: selimg,
  delselimg: delselimg,
  addword: addword,
  titleinput: titleinput,
  addpic: addpic,
  addvid:addvid,
  delline: delline,
  checkboxChange: checkboxChange,
  formSubmit: formSubmit
}