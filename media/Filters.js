const path= require('path');

exports.FileFilters=(req, file, cb)=>{
    var type = file.mimetype;
    var typeArray = type.split("/");   //typeArray[0] == "video" ||
    if ( typeArray[0] == "image") {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname =  filetypes.test((path.extname(file.originalname)).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        console.log(extname,mimetype)
        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: Images Only! '+file.originalname,true);
        }

    }
    else if(typeArray[0]=="video"){
        const filetypes = /mp4|avi|mov|flv|wmv|3gp/;
        const extname =  filetypes.test((path.extname(file.originalname)).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        console.log(extname,mimetype)
        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: video Only! '+file.originalname,true);
        }
    }
    else {
      cb(null, false);
    }
  }