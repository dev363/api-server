const {mongodbError }= require('../../middlewares/mongoDbErrors');
const {createJWT,verifyJWT} = require('../../helpers/JWT');
const {Group, GroupUser, Message} = require("../../models/chat");

exports.newGroup= async({ admin, group,description })=>{
    try {
        const isAvail= await Group.find({name:group});
        if(isAvail && isAvail.length > 0){
            return {error: `'${group}' is already available.`}
        }else{
            const createGroup= new Group({
                name:group,
                description:description,
                createdBy:admin
              })
            const group= await createGroup.save()
            return group;
        }
    } catch (err) {
        const error= mongodbError(err,1);
        return error;
    }
}

exports.allGroups= async()=>{
    try {
        const results= await Group.find({status:1});
        if(results.length > 0){
            const groups= await (results).map(group =>{
                return {id:group._id, name:group.name, description:group.description,image:group.image}
            })
            return groups;
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}
