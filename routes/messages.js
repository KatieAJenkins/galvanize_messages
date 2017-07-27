'use strict';

const express = require('express');

const router = express.Router();

const knex = require('../knex');

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

router.get('/:id' , (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  console.log('variable id', id); //req = object built in express, holds onto everything we receive from HTTP request. params = key in req object. Number.parseInt makes sure this is a number
  // console.log(req.params, 'req.params');
  if (Number.isNaN(id)) { //middleware substack. Can set additional logic here with multiple if statements.
    return next();
  }
  knex('messages')
    .where('id' , id) //where variable id is the same as "id" in the database
    .select( 'id', 'name', 'message')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/' , (req, res, next) => {
  //set up variables you want to post first (also same as setting up a seed file)
  // don't need id because will auto increment and user will not enter
  var name = req.body.name;
  var message = req.body.message;

  knex('messages')
  //need to make this into an object by adding keys first (id, name, message), then values
  //model this off seed template
    .insert({
      name: name,
      message: message
    }) //OR could also add }, '*') which will return everything
    //OR add }, ['name', 'message'])
    .returning(['name', 'message'])
    .then((results) => {
      res.send(results[0]);
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

router.patch('/:id', (req, res, next) => {
  var id = Number.parseInt(req.params.id);
  console.log(req.body);
  var newName = req.body.name;
  console.log(newName);
  var newMessage = req.body.message;

  knex('messages')
    .where('id', id)
    .orderBy('id')
    .then((result) => {
      if (!result) {
        res.send('message not found');
      }

      let messageToUpdate = result[0];
      messageToUpdate.name = newName;
      messageToUpdate.message = newMessage;
      console.log(messageToUpdate.message);

      knex('messages')
        .where('id', id)
        .update(messageToUpdate, '*')
        .then((result) => {
          delete result[0].created_at;
          delete result[0].updated_at;
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

module.exports = router;
