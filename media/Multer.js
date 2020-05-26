const path = require('path')
var uuid = require("uuid");
const multer = require('multer');
const {FileFilters}= require('./Filters');

var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './uploads');    
    }, 
    filename: function (req, file, cb) { 
        console.log(req,456)
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
 });
 const upload = multer({ storage: storage ,fileFilter:FileFilters});
 module.exports= upload;