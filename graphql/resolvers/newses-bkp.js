const News= require('../../models/news');
const {addressByLatLng}= require('../../helpers/geoLocation');

module.exports= (mongodbError,transformNews)=>{
    var module={};
    module.allNews= async(input,req)=>{
        console.log(input.info)
        const {orderBy, order, page, limit,category} =input.info
        let Limit       = limit  || 10;
        let OrderBy    = orderBy || "created";
        let Order      = order   || -1;
        let Page          = page || 1;
        let Category = category || "";
        const info={
            name:"News Api",
            total:18,
            page:Page,
            limit:Limit
        }
        if(input.info){

        }
        try {
            let obj={};
            let [ results, total ] = await Promise.all([
            News.aggregate([
                // {$match:obj},
                {$sort :{[OrderBy]: parseInt(Order)}},
                {$skip: (Page-1)*Limit},
                {$limit: parseInt(Limit)},
                {
                    $lookup: {
                        from: "users",
                        localField: "addedBy",
                        foreignField: "_id",
                        as: "reporter"
                    }
                },
                { $unwind: { path: "$reporter" } },
                {$project:{
                    __v:0,
                    ip:0,
                    addedBy:0,
                    reporter:{
                        __v:0,
                        password:0,
                        created:0,
                        updated:0,
                        status:0
                        
                    }
                }}
            ]),
            News.count().exec()
            ]);
            info.total=total;
            console.log(results, total)
           
            // const newses = await News.find({}).populate('reporter');
            let allNews= await results.map(news => transformNews(news))
            return {info:info,data:allNews}
        } catch (err) {
            throw new Error(err);
        }
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
    return module;
}