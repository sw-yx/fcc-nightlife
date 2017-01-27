const express = require('express');
var path = process.cwd();
// const yelpApi = require(path + '/server/routes/YelpApi.js');
// console.log(JSON.stringify(yelpApi))

const Yelp = require('yelp-api-v3');
var connection = new Yelp({
  app_id: process.env.YELP_API_ID,
  app_secret: process.env.YELP_API_SECRET
});

const router = new express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

router.get('/yelp', (req, res) => {
  const param = req.query.loc;
  // console.log('req.query',req.query)
  if (!param) {
      res.json({
          error: 'Missing required parameter `loc`',
      });
      return;
  }
  connection.search({ term: 'bar', location: param , limit: 25})
  .then(function (data) {
      console.log(data)
      var biz = JSON.parse(data)['businesses']
      var parsed = biz.map((x) => {
        return {
          name: x.name,
          rating: x.rating,
          reviews: x.review_count,
          id: x.id,
          img: x.image_url,
          loc: x.location.address1,
          url: x.url
      }})
      // console.log('bar api',parsed)
      res.status(200).json({
        message: parsed
      });
      // res.json(biz);
  })
  .catch(function (err) {
      console.error(err);
      res.json(err)
  });
});

module.exports = router;


// 'use strict';
// const Yelp = require('yelp-api-v3');
// // var yelp = new Yelp({
// //   app_id: process.env.YELP_API_ID,
// //   app_secret: process.env.YELP_API_SECRET
// // });
// console.log('yelp-api-v3')
// function YelpApi () {
//     this.search = function(req,res){
//         const param = req.query.loc;
//         if (!param) {
//             res.json({
//                 error: 'Missing required parameter `loc`',
//             });
//             return;
//         }
//         var connection = new Yelp({
//             app_id: process.env.YELP_API_ID,
//             app_secret: process.env.YELP_API_SECRET
//         })
//         // See http://www.yelp.com/developers/documentation/v2/search_api
//         connection.search({ term: 'bar', location: param , limit: 25})
//         .then(function (data) {
//             var biz = JSON.parse(data)['businesses']
//             // console.log('YelpApi result length',biz.length)
//             res.json(biz);
//         })
//         .catch(function (err) {
//             console.error(err);
//             res.json(err)
//         });
//     }   
// }


// module.exports = new YelpApi;