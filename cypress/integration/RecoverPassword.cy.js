///<reference types="cypress" />
describe("Recover Password",function(){

    //before hook should query the customer table 
    //if agent exist - email of first row should be returned
    //if not - seed agent table and return first row email


    it("should send OTP for existing customer email",()=>{

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
           cy.task('queryDb2',"select * from v3_Authentication.otp where email = 'austin@yopmail.com' ORDER BY created_at DESC;").then((result) =>{
            
            let otp = result[0].code;
            let reset_token = response.body.data.token;
           cy.writeFile('cypress/fixtures/passwordrecovery.json',{
            "reset_token" : reset_token,
            "otp" :otp
           })
     
         })
           
           expect(response.status).to.eq(200);
           expect(response.body.status).to.eq("successful");
           expect(response.body.message).to.eq("We have sent you an OTP to reset your password");
           expect(response.body.data.token).to.exist;
            
        })
    })

    it("should not send OTP for non-existing customer email ",()=>{

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
           cy.task('queryDb2',"select * from v3_Authentication.otp where email = 'austin@yopmail.com' ORDER BY created_at DESC;").then((result) =>{
            
            let otp = result[0].code;
            let reset_token = response.body.data.token;
           cy.writeFile('cypress/fixtures/passwordrecovery.json',{
            "reset_token" : reset_token,
            "otp" :otp
           })
     
         })
           
           expect(response.status).to.eq(200);
           expect(response.body.status).to.eq("successful");
           expect(response.body.message).to.eq("We have sent you an OTP to reset your password");
           expect(response.body.data.token).to.exist;
            
        })
    })

})