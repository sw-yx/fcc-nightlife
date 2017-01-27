'use strict';
const Yelp = require('yelp-api-v3');
// var yelp = new Yelp({
//   app_id: process.env.YELP_API_ID,
//   app_secret: process.env.YELP_API_SECRET
// });
console.log('yelp-api-v3')
function YelpApi () {
    this.search = function(req,res){
        const param = req.query.loc;
        if (!param) {
            res.json({
                error: 'Missing required parameter `loc`',
            });
            return;
        }
        var connection = new Yelp({
            app_id: process.env.YELP_API_ID,
            app_secret: process.env.YELP_API_SECRET
        })
        // See http://www.yelp.com/developers/documentation/v2/search_api
        connection.search({ term: 'bar', location: param , limit: 25})
        .then(function (data) {
            var biz = JSON.parse(data)['businesses']
            // console.log('YelpApi result length',biz.length)
            res.json(biz);
        })
        .catch(function (err) {
            console.error(err);
            res.json(err)
        });
    }   
}


module.exports = new YelpApi;