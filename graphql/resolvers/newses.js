const News= require('../../models/news');
const {addressByLatLng}= require('../../helpers/geoLocation');
const {pagination} = require("./pagination")

module.exports= (ObjectId,mongodbError,transformNews)=>{
    var module={};
    
    module.allNews= async(input,req)=>{
        const results= await module.getAllNews(input);
        if((results.data).length > 0){
            let allNews= await (results.data).map(news =>{
                return transformNews(news)
            })
            return {info:results.info,data:allNews}
        }else{
            return {info:results.info,results:data}
        }
    }
    module.newsById= async(args,req)=>{
        const news= await News.findById(args.id);
        return transformNews(news._doc)
    }
    module.postNews= async(input,req)=>{
        if (!req.isAuth) {
            throw new Error(req.AuthError);
        }
        const{title,shortDesc,description,ip,location,addedBy,imageUrl,videoUrl} = input.newsInput;
       
        // Get news address by lat,lng
        let address= await addressByLatLng(location)
        if(address){
            address=address[0]
        }else{
            address={}
        }
        const newsData={
            title:title,
            shortDesc:shortDesc,
            description:description,
            ip:ip,
            location:{address:address,coordinates:location},
            addedBy:req.userId
        }
        if(imageUrl){
            newsData.imageUrl=imageUrl;
        }
        if(videoUrl){
            newsData.videoUrl=videoUrl;
        }

        const news= new News(newsData);
        return news.save()
        .then((result) => {
            return transformNews(result);
        })
        .catch(err => {
            console.log(err)
            mongodbError(err);
        })
    }

    module.getAllNews= async(input, next)=>{
        const {orderBy, order, page, limit,category} =input.info
        let Limit       = limit  || 10;
        let OrderBy    = orderBy || "created";
        let Order      = order   || -1;
        let Page          = page || 1;
        let Category = category || "";
        const info={
            name:"News Api",
            total:0,
            page:Page,
            limit:Limit
        }
        let obj={};
        let [ results, total ] = await Promise.all([
        News.aggregate([
            {$match:obj},
            {$sort :{[OrderBy]: parseInt(Order)}},
            {$skip: (Page-1)*Limit},
            {$limit: parseInt(Limit)}
        ]),
        News.count(obj).exec()
        ]);
        info.total= total;
        return({
            data:results,
            total:total,
            info:info
        })
    }
    return module;
}