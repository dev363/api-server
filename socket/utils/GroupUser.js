const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { mongodbError } = require("../../middlewares/mongoDbErrors");
const { createJWT, verifyJWT } = require("../../helpers/JWT");
const { Group, GroupUser, Message } = require("../../models/chat");

exports.joinGroup = async (uid, group, role = "user") => {
  const isAvail = await GroupUser.find({
    uid: ObjectId(uid),
    group: ObjectId(group),
  });
  if (isAvail && isAvail.length > 0) {
    const isUpdate = await UpdateStatus(uid, group, 1);
    return { success: isUpdate };
  } else {
    try {
      const joinG = new GroupUser({
        uid: uid,
        group: group,
        role: role,
      });
      const isAdd = await joinG.save();
      return { success: isAdd };
    } catch (err) {
      const error = mongodbError(err, 1);
      return { error: error };
    }
  }
};

exports.leaveGroup = async (uid, group) => {
  try {
    const isUpdate = await UpdateStatus(uid, group, 0);
    return { success: isUpdate };
  } catch (err) {
    const error = mongodbError(err, 1);
    return { error: error };
  }
};

exports.UnJoinedGroups = async (uid) => {
  const meMember = await GroupUser.find({ uid: ObjectId(uid), status: 1 });
  if (meMember.length > 0) {
    const groupIds = meMember.map((g) => ObjectId(g.group));
    const results = await Group.find({ _id: { $nin: groupIds }, status: 1 });
    const UnJoined =
      results.length > 0 &&
      results.map((g) => ({ id: g._id, ...g._doc, id: g.id }));
    return UnJoined;
  } else {
    const results = await Group.find();
    const UnJoined =
      results.length > 0 &&
      results.map((g) => ({ id: g._id, ...g._doc, id: g.id }));
    return UnJoined;
  }
};

exports.JoinedGroups = async (uid) => {
  const meMember = await GroupUser.find({ uid: ObjectId(uid), status: 1 });
  if (meMember.length > 0) {
    const groupIds = meMember.map((g) => ObjectId(g.group));
    const results = await Group.find({ _id: { $in: groupIds }, status: 1 });
    const Joined =
      results.length > 0 &&
      results.map((g) => ({ id: g._id, ...g._doc, id: g.id }));
    return Joined;
  }
  return [];
};

const UpdateStatus = async (uid, group, status) => {
  try {
    const result = await GroupUser.findOneAndUpdate(
      { uid: ObjectId(uid), group: ObjectId(group) },
      { $set: { status: status, updated: new Date() } },
      { returnNewDocument: true, useFindAndModify: false }
    );
    if (result) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
