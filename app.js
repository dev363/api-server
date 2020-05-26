const express= require('express')
const app= express();
const bodyParser= require('body-parser');
const graphqlHttp= require('express-graphql');
const mongoose= require('mongoose');

//****Config data****/
const config= require('./config');
const mode='development';
const {port,db} = config[mode];
const {MONGO_USER,MONGO_PASSWORD,MONGO_DB}= db;

const isAuth = require('./middlewares/IsAuth');
const Schema= require('./graphql/schema')
const Resolvers= require('./graphql/resolvers')

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  app.use(isAuth);

app.get('/',(req,res)=>{
    res.json({message:'Api working fine'})
})


app.use('/graphql',graphqlHttp({
    schema:Schema,
    rootValue:Resolvers,
    graphiql:true
}))

require('./routes')(app);

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-pxyis.mongodb.net/${MONGO_DB}?retryWrites=true`,{ useNewUrlParser: true },)
.then(res=>{
    var server = app.listen(port,(res)=>{
        let host = server.address().address;
        let port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
      })
})
.catch(err=>{
    console.log(err)
})