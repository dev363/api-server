const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
const Schema= mongoose.Types;
const ObjectId = Schema.ObjectId;
const path= require('path');
//****Config data****/
const config= require('./config');
const mode='development';
const {port,db} = config[mode];
const {MONGO_USER,MONGO_PASSWORD,MONGO_DB}= db;

const {Group, GroupUser, Message} = require("./models/chat"); 

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-pxyis.mongodb.net/${MONGO_DB}?retryWrites=true`,{ useNewUrlParser: true },)
.then(res=>{
    var server = app.listen(port,(res)=>{
        let host = server.address().address;
        let port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
        userNotJoinedGroups("5ec4083d13be752f745245ba")
    })

})
.catch(err=>{
    console.log(err)
})

const userNotJoinedGroups= async(uid)=>{
    const results= await Group.aggregate([
        {$match:{status:1}},
        {$lookup:{ from: 'groupusers', localField: '_id', foreignField: 'group', as: 'members' }},
    ])
    const ee= results.length > 0 && results.map(g=>{
      if(g.members.length > 0){
        const isAvail= (g.members).some(g=> (g.uid).toString() == (uid).toString() && g.status===0)
        console.log(isAvail,222)
        if(!isAvail){
            return {...g,members:false}
        }
      }else{
        return {...g,members:false};
      }
        
    })
    console.log(ee)    
    // // console.log(meMember)
}