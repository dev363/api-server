exports.pagination=(input,name)=>{
    const {orderBy, order, page, limit,category}=input.info
    console.log(input.info)
    let Limit       = limit  || 10;
    let OrderBy    = orderBy || "created";
    let Order      = order   || -1;
    let Page          = page || 1;
    let Category = category || "";
    const info={
        name:name,
        total:0,
        page:Page,
        limit:Limit
    }
    return info;
}