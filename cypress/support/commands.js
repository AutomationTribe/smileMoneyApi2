// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('authenticate', (userName, password) => {
    cy.request({
        method:'POST', 
        url:'https://smilemoney-sandbox.renmoney.com/agent/login',
        body: {
            "email": "murrayataga@gmail.com",
            "password": "chemistry",
            "networkKey": "1234"
        }
      })
      .then((response) => {
        Cypress.env('token', response.body.accessToken); // either this or some global var but remember that this will only work in one test case
        return response.body.data.access_token;
      })
    
  })

  Cypress.Commands.add("SetPasswordOTP",function(){
    let reset = [];
    cy.request({
      "method":"POST",
      "url" : "https://smilemoney-sandbox.renmoney.com/agent/recover_password",
      "body" : {
          "email": "murrayataga@gmail.com",
          "networkKey": "43434343434"
      }
  }).then((response)=>{
      //perform assertions
      //save reset token to env variable
     // expect(response.body.data.token).to.eq(200);
     cy.task('queryDb2',"select * from v3_Authentication.otp where email = 'murrayataga@gmail.com' ORDER BY created_at DESC;").then((result) =>{
      
      let otp = result[0].code;
      let reset_token = response.body.data.token;
      reset.push(reset_token,otp);
      return reset;
   })
        
  })

  

  })
