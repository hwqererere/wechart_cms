var dbconnect = wx.cloud.database()
// console.log(dbconnect)
const selectAll=function(dbname,callback){
  dbconnect.collection(dbname).get({success(res){
    callback.call(this,res.data)
  }})
}

const select=function(dbname,select,callback){
  dbconnect.collection(dbname).where(select).get({success(res){
    callback.call(this,res)
  }})
}

const add=function(dbname,add,callback){
  dbconnect.collection(dbname).add({data:add,success(res){
    callback.call(this,res)
  }})
}

const update=function(dbname,id,editdata,callback){
  dbconnect.collection(dbname).doc(id).update({data:editdata,success(res){
    callback.call(this.res)
  }})
}

const del=function(dbname,id,callback){
  dbconnect.collection(dbname).doc(id).remove({success(res){
    callback.call(this,res)
  }})
}
module.exports={
  selectAll: selectAll,
  select:select,
  add:add,
  update:update,
  del:del
}