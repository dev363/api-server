const bcrypt= require('bcryptjs');

module.exports={
    createPassword:(password)=>{
        return bcrypt.hash(password, 12);
    },
    comparePassword:(password1,password2)=>{
        return bcrypt.compare(password1,password2);
    }
}