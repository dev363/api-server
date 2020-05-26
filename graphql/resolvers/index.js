const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {createPassword,comparePassword}= require('../../helpers/passwordHelper');
const {mongodbError }= require('../../middlewares/mongoDbErrors');
const {transformUser, transformNews} =require('./merge')
const {createJWT,verifyJWT} = require('../../helpers/JWT')

const auth= require('./auth')(createJWT,verifyJWT,comparePassword,transformUser);
const users= require('./users')(mongodbError,createPassword,transformUser);
const newses= require('./newses')(ObjectId,mongodbError,transformNews);

const rootResolver = {
    ...users,
    ...newses,
    ...auth
  };
  
  module.exports = rootResolver;