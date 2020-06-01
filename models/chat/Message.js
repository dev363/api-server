const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const ObjectId= Schema.ObjectId;

const messageSchema= new Schema({
    type:{
        type:Number,
        enum:[0,1,2],    // 0=Broadcast, 1=Private, 2=Group
        default:2
    },
    sender:{
        type:ObjectId,
        required:true
    },
    reciver:{
        type:ObjectId
    },
    group:{
        type:ObjectId
    },
    message:{
        type:String,
        required:true
    },
    seen:{
        type:[{
            id:{
                type:ObjectId,
                required:true
            },
            time:{
                type:Date,
                default:Date.now
            }
        }]
    },
    created:{
        type:Date,
        default:Date.now
    },
    deleted:{
        type:Number,
        enum:[0,1],    // 0=active, 1=deleted
        default:0
    }
})

module.exports= mongoose.model("Message", messageSchema);