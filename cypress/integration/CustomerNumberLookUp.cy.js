///<reference types="cypress" />
describe("Customer Phone number lookup test cases",function(){
//search the DB for phone number of the second test case and delete if found;
//or random generate a phone number to be used;
    let data,accessToken,newPhoneNumber,otp;

    before("Load data for test here",function(){
        cy.authenticate().then((fToken)=>{
            accessToken = fToken;
        })
        cy.fixture('CustomerPhoneNumber').then((fdata)=>{
            data = fdata;
        })
    })

    it("should validate an existing customer phone number",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/customer/number_look_up",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "phoneNumber":data.phoneNumber
            }
        }).then((response)=>{

            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
           // expect(response.body.message).to.eq("OTP sent successfully");
        })

    })

    it("should send OTP to non-existing customer phone number",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/customer/number_look_up",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" :{
                "phoneNumber" : "08150367435"
            }
        }).then((response)=>{
            //connect to DB to get OTP
            //write OTP and phone  number to fixture file
            //writer assertions 

            cy.task('queryDb2',"select * from v3_Authentication.otp where phone = 2348150367435 ORDER BY updated_at DESC").then((result)=>{

                console.log(result[0].code);

                otp =  result[0].code;
                newPhoneNumber = "08150367435";
                cy.writeFile('cypress/fixtures/OTPValidation.json',{
                    "otp" : otp,
                    "phoneNumber" :newPhoneNumber
                   })
            })
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
            expect(response.body.message).to.eq("OTP sent successfully");

        })

    })

    it("should not validate an empty or invalid phone number",function(){
        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/customer/number_look_up",
            "failOnStatusCode": false,
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "phoneNumber":""
            }
        }).then((response)=>{

            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Invalid phone number,Phone number is empty or invalid");
        })
        
    })

})