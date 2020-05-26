const DataLoader = require('dataloader');
const {dateToString}= require('../../helpers/date');
const User = require("../../models/user")

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
        ...user._doc,
        _id: user.id
        };
    } catch (err) {
        throw err;
    }
};

module.exports={
    transformUser:(user)=>{
        return(
            {
                ...user._doc,
                 _id: user.id,
                created: dateToString(user._doc.created),
                updated: dateToString(user._doc.updated)
            }
        )
    },

    transformNews:(news)=>{
        return {
            ...news,
            _id:news._id,
            location:{...news.location.address},
            reporter: user.bind(this, news.addedBy)
        };
    }
}