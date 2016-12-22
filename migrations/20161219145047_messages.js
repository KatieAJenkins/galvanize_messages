'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', (table) => {
    //id
    table.increments();
    //name
    table.string('name').notNullable();
    //messages
    table.string('message').notNullable();
    //created_at & updated_at
    table.timestamps(true, true);
    //OR
    //table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    //table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
