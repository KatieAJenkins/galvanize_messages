'use strict';

const environment = process.env.NODE_ENV || 'development'; //normally have .env file -- allows us to access env variables --|| sets to equal env variables OR development environment

const knexConfig = require('./knexfile')[environment]; //hands on knexfile.js object accessing environment using bracket notation -- accessing development key in module.exports object

const knex = require('knex')(knexConfig); //setting up instance of knex function in which knexConfig is passed in as an arguement

module.exports = knex;
