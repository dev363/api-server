 const MongoError= require('../constants/mongodbErrors');
 
 module.exports={
    mongodbError:(err)=>{
        if(err.name && err.name==='MongoError'){
            const fields= Object.keys(err.keyPattern);
            switch(err.code){
                case 11000:
                    throw new Error(MongoError.uniqueError(fields[0]),err);
                default:
                    throw new Error("Another Database validation error.");
            }
        
        }else{
            throw new Error('EEE.',err);
        }
    }
 }