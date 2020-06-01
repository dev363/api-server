const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;

const groupUserSchema= new Schema({
    uid:{
        type:ObjectId,
        // unique:true,
        required:true
    },
    role:{
        type:String,
        enum:["admin",'user'],
        default:"user"
    },
    group:{
        type:ObjectId,
        required:true
    },
    joined:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Number,
        enum:[0,1], // 1=active, 0=Blocked
        default:1
    },
    blockReq:{
        type:[{_id:{type:ObjectId, required:true},date:{type:Date,default:Date.now}}]
    }
});

module.exports= mongoose.model("GroupUser", groupUserSchema);