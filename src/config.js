
/*
* Code in file written by Stephen Wright from Stackoverflow on 12th of Mar 2014 at 23:00
*
*https://stackoverflow.com/questions/22348705/best-way-to-store-db-config-in-node-js-express-app
*/

const config = {
  port: ':7475',
  remotehost: 'http://10.201.84.137',
  localhost: 'http://localhost',
  transaction: '/db/data/transaction/commit',
  login:{
    username:'neo4j',
    password:'neo4j'
  }
};
module.exports = config;
