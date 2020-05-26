const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema= new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: true,
        required:true,
        lowercase:true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    imageUrl:{
        type: String
    },
    status:{
        type: Number,
        enum : [1,0],
        default: 1
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
})

// update date on every update in User table
userSchema.pre('save', function(next){
    now = new Date();
    this.updated = now;
    if(!this.created) {
        this.created = now
    }
    next();
});
module.exports = mongoose.model('User', userSchema);