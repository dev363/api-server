const LOCAL_UPLOAD= require("./media/Multer")
const S3_UPLOAD= require("./media/S3Bucket")

module.exports = function(app){
    // upload images to local server
    app.post('/upload/local', function (req, res) {
        try {
            const UploadFiles= LOCAL_UPLOAD.array('files',4);
            UploadFiles(req, res, async (err, some) => {
                console.log(req.files,err, some,1111)
                if(err){
                    res.status(400).json({message:err});
                }else{
                    res.json({message:"Files upload successfully",images:req.files})
                }
            })
        } catch (error) {
            throw new Error(error,333)
        }
        
    })

    // Upload files to S3 Bucket
    app.post('/upload/live/:folder', function (req, res) {
        const UploadFiles = S3_UPLOAD.any();
        try {
            UploadFiles(req, res, async function (err, some) {
                console.log(req.file,err, some,1111)
                if(err){
                    res.status(400).json({message:err});
                }else{
                    res.json({message:"images upload successfully",images:req.files})
                }
            })
        }catch(err){
            console.log(err)
        }
    })
}