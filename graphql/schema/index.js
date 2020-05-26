const {buildSchema} =require('graphql');


module.exports=buildSchema(`
    input PaginationInput{
        page:Int
        limit:Int
        orderBy:String
        order:Int
    }
    type PageInfo{
        name:String
        total:Int
        page:Int
        limit:Int
        orderBy:String
        order:Int
    }
    type User{
        _id:ID!
        fname:String!
        lname:String!
        phone:String!
        email:String!
        imageUrl:String!
        created:String!
        updated:String!
        status:String!
        token:String
    }
    input UserInput{
        fname:String!
        lname:String!
        phone:String!
        email:String!
        imageUrl:String
        password:String!
    }
    type Address{
        formattedAddress:String
        city:String
        state:String
        zipcode:String
        country:String
        latitude:Float
        longitude:Float
    }
    
    type News{
        _id:ID!
        title:String!
        shortDesc:String
        description:String!
        location:Address
        ip:String!
        addedBy:String!
        reporter:User!
        imageUrl:String
        videoUrl:String
        creted:String!
        updated:String!
    }
    
    type NewsPagination{
        info:PageInfo!
        data:[News!]!
    }
    input NewsInput{
        title:String!
        shortDesc:String
        description:String!
        ip:String!
        location:[Float]!
        imageUrl:String
        videoUrl:String
    }

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type RootQuery{
        users:[User!]!
        login(email:String!,password:String):User
        profile:User!
        allNews(info:PaginationInput):NewsPagination
        newsById(id:ID!):News!
    }

    type RootMutation{
        addUser(userInput:UserInput):User
        postNews(newsInput:NewsInput):News
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
`)