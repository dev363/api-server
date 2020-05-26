let nodeGeocoder = require('node-geocoder');

exports.addressByLatLng=(data)=>{
    let options = {
        provider: 'openstreetmap'
    };
    let geoCoder = nodeGeocoder(options);
   
    return geoCoder.reverse({lat:data[0], lon:data[1]})
    .then((res)=> {
        return (res);
    })
    .catch((err)=> {
        return false;
    });
}