const User = require('../../models/user');
const NoImage= require('../../config/index.json')['USER_NO_IMAGE']
module.exports = (mongodbError, createPassword, transformUser) => {
    var module = {};
    module.users = async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user);
            });
        } catch (err) {
            throw err;
        }

    }
    module.profile = async(args,req)=>{
        if (!req.isAuth) {
            throw new Error(req.AuthError);
          }
        const user= await User.findById(req.userId);
        return transformUser(user);
    }
    module.addUser = async (args) => {
        const { fname, lname, email, phone, password,imageUrl } = args.userInput;
        const bPassword = await createPassword(password);
        let image= !imageUrl ? NoImage :imageUrl;
        const user = new User({
            fname: fname,
            lname: lname,
            phone: phone,
            email: email,
            imageUrl:image,
            password: bPassword
        });
        return user.save()
            .then((result) => {
                // return { ...result._doc, _id: result._id }
                return transformUser(user);
            })
            .catch(err => {
                mongodbError(err);
            })
    }
    

    return module;
}