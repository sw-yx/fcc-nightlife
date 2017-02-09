const express = require('express');
const User = require('mongoose').model('User');
var path = process.cwd();
const _ = require('lodash');
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




//USER INTERACTION API
router.get('/addBarToUser', (req, res) => { // expects uid and barid param
  console.log('ClickHandler.server addBarToUser')
  const userid = req.query.uid || req.user
  if (!(userid && req.query.barid)) {
      res.json({error: 'Missing required parameter `uid` or `barid`'});
      return;
  }
  
  User.findOne({ 'email': userid }, function (err, user) {
      if (err) throw err; //should already be authenticated
      console.log('user',user);
      var newbarlist = user.barIDs;
      newbarlist.push({barid: req.query.barid, img: req.query.barimg, name: req.query.barname, url: req.query.barurl, loc: req.query.barloc});
      newbarlist = _.uniqBy(newbarlist)
      User
          .findOneAndUpdate({ 'email': userid}, { 'barIDs': newbarlist })
          .exec(function (err, result) {
                  if (err) { throw err; }
                  console.log ('added bar ' + req.query.barid + 'to user profile');
                  res.json({message:'added bar ' + req.query.barid + 'to user profile'})
              }
          );
  })
});
router.get('/viewUser', (req, res) => { // expects uid param
  // console.log('ClickHandler.server req.client',Object.keys(req.client))
  // // console.log('ClickHandler.server req.body',)
  // console.log('ClickHandler.server req.passport',req._passport.instance)
  // console.log('ClickHandler.server req.passport',req._passport.instance._strategies)
  // console.log('ClickHandler.server req.query',req.query)
  console.log('hello from viewUser')
  const userid = req.query.uid || req.user
  if (!userid) {
      res.json({error: 'Missing required parameter `uid`'});
      return;
  }


  User.findOne({'email':userid}, { '_id': false })
      .exec(function (err, result) {
              if (err) { throw err; }
              console.log('db search results',result)

                var promiselist = []
                result.barIDs.map((x) => {
                    var promise = new Promise(function(resolve,reject){
                        var barids_with_users = []
                        User
                            .find({'barIDs.barid':x.barid}, { '_id': false })
                            .exec(function (err, result) {
                                if (err) { throw err; }
                                if (result) {
                                    x = x.toJSON();
                                    // console.log('barids_with_users result found for ' + x.barid,result)
                                    x.going = result.map(y => y.name)
                                    // console.log('going',x.going)
                                    // barids_with_users.push(x)
                                    // console.log(result.map(y => y.name))
                                    // console.log(x)
                                    resolve(x)
                                } else {
                                    // console.log('bar ' + x.barid + 'not found')    
                                    // barids_with_users.push(x)
                                    resolve(x)
                                }
                            })
                    })
                    promiselist.push(promise);
            })           
            Promise.all(promiselist).then(function(promiseresults){
                // console.log('promiseresults',promiseresults);
                result = result.toJSON();
                result.barIDs = promiseresults;
                console.log('result',result)
                res.json(result);
                
            }, function (err){
                console.log(err)
                res.json(err)
            })
          });
});
router.get('/removeBarFromUser', (req, res) => {
  console.log('ClickHandler.server removeBarFromUser ' + req.query.barid)
  const userid = req.query.uid || req.user.twitter.username
  if (!(userid && req.query.barid)) {
      res.json({error: 'Missing required parameter `uid` or `barid`'});
      return;
  }
  
  User.findOne({ 'email': userid }, function (err, user) {
      if (err) throw err; //should already be authenticated
      console.log('user',user);
      var newbarlist = [];
      //remove from array
    //   const index = newbarlist.indexOf(req.query.barid)
    //   if (index < 0) {
    //       console.log('bar not found ',req.query.barid)
    //   } else {
    //       newbarlist.splice(index,1)
    //   }
      user.barIDs.map((x) => {
          if (x.barid != req.query.barid) newbarlist.push(x)
      })
      //put it back into db
      User
          .findOneAndUpdate({ 'email': userid}, { "barIDs": newbarlist })
          .exec(function (err, result) {
                  if (err) { throw err; }
                  console.log ('added bar ' + req.query.barid + ' to user profile');
                  res.json({message:'added bar ' + req.query.barid + ' to user profile'})
              }
          );
  })
});

//unused
router.get('/getClicks', (req, res) => {
  console.log('ClickHandler.server getclicks ',req.query.barid)
  if (!req.query.barid) {
      res.json({error: 'Missing required parameter `id`'});
      return;
  }
  User
      .findOne({'barIDs.barid':req.query.barid}, { '_id': false })
      .exec(function (err, result) {
          if (err) { throw err; }
          if (result) {
              console.log('result found')
              res.json(result)
          } else {
              console.log('bar not found')
              res.json(result)                    
          }
      })
});



//YELP API
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
      // console.log(data)
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