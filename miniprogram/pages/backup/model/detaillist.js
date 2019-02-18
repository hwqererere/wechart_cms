const app = getApp()
const db = require("../../../lib/db.js")
const initdetaillist = function(self,callback) {
  db.selectAll("article", function (selres) { 
  	console.log(selres)  
    self.setData({ detaillistData:selres})
  })  
  callback.call(this, {})
}


module.exports = {
  initdetaillist: initdetaillist
}