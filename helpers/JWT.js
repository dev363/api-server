const jwt= require('jsonwebtoken');
const config= require('../config');
const {SECERT, EXPIRE}= config[config.mode]['JWT'];

exports.createJWT= async(data)=>{
    const token =  await jwt.sign(
        data,
        SECERT,
        {expiresIn: EXPIRE}
      );
    return token;
}

exports.verifyJWT= async(token)=>{
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, SECERT);
  } catch (err) {
    decodedToken=false;
  }
  return decodedToken;
}