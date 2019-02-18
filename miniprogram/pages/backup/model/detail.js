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
      app.globalData.detailData.word[app.globalData.detailData.word.length] = { type: "image", url: res.tempFilePaths[0]}
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
  console.log(val,val["title"])
  subData.title=val["title"]
  subData.showtype=app.globalData.detailData.showtype?app.globalData.detailData.showtype:'1'
  app.globalData.detailData.word=app.globalData.detailData.word?app.globalData.detailData.word:[]
  
  for(let i=0;i<app.globalData.detailData.word.length;i++){
    if(app.globalData.detailData.word[i].type=="word"){
      app.globalData.detailData.word[i]={type:"word",word:val["t"+i]}
    }
  }

  uplaoadset(function(){
    subData.word=app.globalData.detailData.word
    console.log(subData)
    app.globalData.detailData.showimg=app.globalData.detailData.showimg?app.globalData.detailData.showimg:""
    if(app.globalData.detailData.showimg!=""){
      let pathname = app.globalData.detailData.showimg.split(".")
      let myDate = new Date();
      let filename = "t" + myDate.getTime() +"."+pathname[pathname.length-1]     
      wx.cloud.uploadFile({
            cloudPath: 'article/'+filename, // 上传至云端的路径
            filePath: app.globalData.detailData.showimg, // 小程序临时文件路径
            success: res => {
              subData.titleimg=res.fileID
              db.add("article", subData, function () {
                console.log("编辑成功")              
              })
            },
            fail: console.error
      })
    }else{
      subData.titleimg=""
      db.add("article", subData, function () {
                console.log("编辑成功")              
              })
    }
    
  })
}

function uplaoadset(callback){
  let key=true
  
  for(let i=0;i<app.globalData.detailData.word.length;i++){
    if(app.globalData.detailData.word[i].type=="image" && key){
      key=false
      let pathname = app.globalData.detailData.word[i].url.split(".")
      let myDate = new Date();
      let filename = i + "a" + myDate.getTime() +"."+pathname[pathname.length-1]     
      wx.cloud.uploadFile({
          cloudPath: 'article/'+filename, // 上传至云端的路径
          filePath: app.globalData.detailData.word[i].url, // 小程序临时文件路径
          success: res => {
            app.globalData.detailData.word[i]={type:"idimage",url:res.fileID}            
            uplaoadset(callback)
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
  addpic: addpic,
  delline: delline,
  checkboxChange: checkboxChange,
  formSubmit: formSubmit
}