const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;

const groupSchema= new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    limit:{
        type:Number,
        default:20
    },
    image:{
        type:String,
        required:false
    },
    createdBy:{
        type:ObjectId,
        required:true
    },
    created:{
        type: Date, 
        default: Date.now
    },
    status:{
        type: Number,
        enum : [1,0],   // 1=active, 0=Inactive
        default: 1
    }
})

module.exports= mongoose.model("Group", groupSchema);