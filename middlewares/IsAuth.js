const {verifyJWT}= require('../helpers/JWT')
module.exports= async(req,res,next)=>{
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        req.AuthError= "Authorization perameter not available in Header."
        return next();
    }
    const token=authHeader.split(" ")[1];
    if(!token || token===""){
        req.isAuth = false;
        req.AuthError= "Token not available."
        return next();
    }
    let decodetoken;
    try {
        decodetoken= await verifyJWT(token);
    } catch (error) {
        req.isAuth = false;
        req.AuthError="Invalid Token or Expired Token."
        return next();
    }
    if(!decodetoken){
        req.isAuth = false;
        req.AuthError="Invalid Token or Expired Token."
        return next();
    }
    req.isAuth=true;
    req.userId=decodetoken.userId;
    next();
}