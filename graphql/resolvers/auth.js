const User= require('../../models/user');
const {notAvail,notMatch}= require('../../constants/authError');

module.exports=(createJWT,verifyJWT,comparePassword,transformUser)=>{
    var module={};

    module.login= async(args)=>{
        const {email,password}= args;
        const user= await User.findOne({email:email});
        if(!user){
            throw new Error(notAvail)
        }else{
            const isValid= await comparePassword(password,user.password)
            if(isValid){
                const token= await createJWT({userId:user._id});
                const userdata=transformUser(user)
                return {...userdata,token:token}
            }else{
                throw new Error(notMatch);
            }
        }
    }
    return module;
}