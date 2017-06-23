//order in which you write routes is important. Middleware needs to go in order.
'use strict';

const express = require('express'); //require express

const router = express.Router();

const knex = require('../knex'); //takes out of Route folder and up folder hierarchy to where knex.js lives

router.get('/' , (req, res, next) => {
  knex('messages')
    .select( 'id', 'name', 'message')
    .then((results) => {
      // console.log(results); //logs in terminal
      res.send(results); //logs in browser
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get('/:id' , (req, res, next) => { ///:id = url param
  const id = Number.parseInt(req.params.id);
  console.log('id', id); //req = object built in express, holds onto everything we receive from HTTP request. params = key in req object. Number.parseInt makes sure this is a number
  // console.log(req.params, 'req.params');
  if (Number.isNaN(id)) { //middleware substack. Can set additional logic here with multiple if statements.
    return next();
  }
  knex('messages')
    .where('id' , id) //where variable id is the same as id in the database
    .select( 'id', 'name', 'message')
    .then((results) => {
      // console.log(results); //logs in terminal
      // var response = results[0]; //gets the first object out of the results array
      res.send(results[0]); //logs in browser
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/' , (req, res, next) => {
  //set up variables you want to post first (also same as setting up a seed file) // don't need id because will auto increment and user will not enter
  var name = req.body.name;
  var message = req.body.message;

  knex('messages')
  //need to make this into an object by adding keys first (id, name, message)//model this off seed template
    .insert({
      name: name,
      message: message
    }) //OR could also add }, '*') which will return everything
      //OR add }, ['name', 'message'])
    .returning(['name', 'message'])
    .then((results) => {
      res.send(results[0]); //logs in browser
      //OR can also delete anything we don't want in our response message
      //var newResults = results[0];
      //delete newResults.id;
      //delete newResults.created_at;
      //delete newResults.updated_at;
    })
    .catch((err) => {
      next(err);
    });
});

// router.patch('/:id' , (req, res, next) => {
//   // console.log("patch route working!");
//   // console.log(req.params);
//   // console.log(req.body);
//   const id = Number.parseInt(req.params.id);
//   console.log('id', id);
//
//   // console.log('req.body', req.body);
//   // const name = req.body.name;
//   // console.log('name', name);
//   //
//   // const message = req.body.message;
//   // console.log(message);
//   //
//
//   if (Number.isNaN(id)) {
//     return next();
//   }
//
//   knex ('messages')
//     .where ('id' , id)
//     .update({
//       name,
//       message
//     })
//     .returning (['id', 'name', 'message'])
//     .then ((results) => {
//       console.log(results);
//       res.send(results[0]);
//     })
//     .catch ((err) => {
//       next(err);
//     });
// });

/////////
router.patch('/:id', (req, res, next) => {
  // console.log('patch route working');
  var id = Number.parseInt(req.params.id);
  console.log('server id', id);

  var name = req.body.newName;
  console.log(name);
  var message = req.body.newMessage;
  console.log(message);

  knex('messages')
    .where('id', id)
    .orderBy('id')
    .then((result) => {
      if (!result) {
        res.send('user not found');
      }
      console.log(result);
      let toUpdateMessage = result[0];
      // console.log(req.body.message);
      console.log(toUpdateMessage.message);

      toUpdateMessage.name = name;
      toUpdateMessage.message = message;

      knex('messages')
        .where('id', id)
        .update(toUpdateMessage, '*')
        .then((result) => {
          // delete result[0].id;
          delete result[0].created_at;
          delete result[0].updated_at;
          console.log('result 2 knex', result);
          res.send(result[0]);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});
////////
// if (Object.keys(req.body).length === 0 ) {
//   console.log("no req.body found!");

router.delete('/:id' , (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    return next();
  }
  knex('messages')
    .where('id' , id)
    .del()
    .returning (['id' , 'name', 'message'])
    .then ((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router; //gives object that makes contents available to other files
