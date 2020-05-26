const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;

const newsSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    shortDesc:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    location:{address:{type:Object}, coordinates: [Number]},
    ip:{
        type:String,
        required:true
    },
    imageUrl:{
        type: String
    },
    videoUrl:{
        type: String
    },
    addedBy:{
        type:ObjectId,
        required:true
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
})

// newsSchema.virtual('reporter',{
//     ref: 'User',
//     localField: 'addedBy',
//     foreignField: '_id',
//     justOne: true
// });
// // console.log(newsSchema)
// newsSchema.set('toObject', { virtuals: true });

module.exports= mongoose.model('News',newsSchema);
