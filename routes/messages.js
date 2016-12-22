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
  const id = Number.parseInt(req.params.id); //req = object built in express, holds onto everything we receive from HTTP request. params = key in req object. Number.parseInt makes sure this is a number
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

router.patch('/:id' , (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  const name = req.body.name;
  const message = req.body.message;

    if (Number.isNaN(id)) {
      return next();
    }

  knex ('messages')
    .where ('id' , id)
    .first() //not sure I need this??
    .then ((results) => {
      return knex('messages')
        .update({
          name: name,
          message: message
        }) //not sure about this??
        .returning (['id', 'name', 'message'])
        .where('id' , id); //reverse this with line 85?
    })
    .then ((updatedResults) => {
      res.send(updatedResults[0]);
    })
    .catch ((err) => {
      next(err);
    });
});

router.delete('/:id' , (req, res, next) => {
  const id = Number.parseInt()
})

module.exports = router; //gives object that makes contents available to other files
