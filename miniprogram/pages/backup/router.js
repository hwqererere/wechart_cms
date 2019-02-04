const app = getApp()
var lib = {}
lib.index = require("model/index.js")
lib.detail = require("model/detail.js")
lib.file = require("model/file.js")
lib.manager = require("model/manager.js")
lib.system = require("model/system.js")

const pageCtrl = function pageCtrl(self,pageid, callback) { //获取url信息  
  let action = "init" + pageid;
  app.globalData.pageid = pageid
  callback.call(this, { pageid: pageid })
  lib[pageid][action](self,callback)
}

const click = function click(self,e, callack) {
  let fn = e.currentTarget.dataset.fn ? e.currentTarget.dataset.fn : e.target.dataset.fn
  // console.log(fn)
  lib[app.globalData.pageid][fn](self,e, callack)
}

module.exports = {
  
  pageCtrl: pageCtrl,
  click: click
  
}
