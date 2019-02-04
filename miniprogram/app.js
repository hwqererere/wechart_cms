//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-552fc8',
        traceUser: true,
      })
    }

    this.globalData = {}
    this.db=require('lib/db.js')
    /*this.db.selectAll('admin',function(res){
      let adminer=false
      for(let i=0;i<res.length;i++){
        // if(res[i].adminer==)
      }
      console.log(res)
    })*/
  }
})
