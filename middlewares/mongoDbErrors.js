 const MongoError= require('../constants/mongodbErrors');
 
 module.exports={
    mongodbError:(err,type=null)=>{
        if(err.name && err.name==='MongoError'){
            console.log(23336665)
            const fields= Object.keys(err.keyPattern);
            switch(err.code){
                case 11000:
                    if(type){
                        return {error:MongoError.uniqueError(fields[0]),code:11000}
                    }
                    throw new Error(MongoError.uniqueError(fields[0]));
                default:
                    if(type){
                        return {error:"Another Database validation error."}
                    }
                    throw new Error("Another Database validation error.");
            }
        
        }else{
            throw new Error('EEE.',err);
        }
    }
 }