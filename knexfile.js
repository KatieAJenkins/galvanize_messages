'use strict';

module.exports = { 

  development: {
    client: 'pg', //technology using on backend - what language to speak
    connection: 'postgres://localhost/messages_dev' //location of where database exists -- running db locally -- hosting on postgres
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/messages_test'
  },

  production: { }

};
