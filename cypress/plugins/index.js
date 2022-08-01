/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
/*module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}*/
const mysql = require('mysql');
function queryTestDb(query,config){
  const connection =  mysql.createConnection(config.env.db);
  connection.connect();

  return new Promise((resolve, reject)=>{
    connection.query(query,(error,results) =>{
      if(error) reject(error)
      else{
        connection.end()
        return resolve(results)
      }
    })
  })

}

function queryTestDb2(query,config){
  const connection =  mysql.createConnection(config.env.db2);
  connection.connect();

  return new Promise((resolve, reject)=>{
    connection.query(query,(error,results) =>{
      if(error) reject(error)
      else{
        connection.end()
        return resolve(results)
      }
    })
  })

}


module.exports = (on, config) => {
 // tasks = sqlServer.loadDBPlugin(dbConfig.db);
 require('cypress-mochawesome-reporter/plugin')(on);
  on('task', { queryDb : query => {return queryTestDb(query,config) }});
  on('task', { queryDb2 : query => {return queryTestDb2(query,config) }});
}
