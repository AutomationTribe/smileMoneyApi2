///<reference types="cypress" />
describe("Initialize Loan Test cases",function(){

    let token,data;

    before("Load data and Login",function(){
        cy.authenticate().then((user)=>{
            token = user;
          });
        cy.fixture("initializeLoan").then((fdata)=>{

            data =  fdata
        })
    })

    it("should initialize a Loan",function(){
      //should check if loan is pending first
      cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/initialize_offer",
           
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" :
                {
                    "phoneNumber": data.phoneNumber,
                    "bvn": data.bvn,
                    "accountNumber": data.accountNumber,
                    "bank_name": data.bank_name
                }
            
        }).should((response)=>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
        })

    })

    it("should not initialize a Loan with phone number of non-existing customer",function(){
        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/initialize_offer",
           "failOnStatusCode" : false,
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" :
                {
                    "phoneNumber": "0800000000",
                    "bvn": data.bvn,
                    "accountNumber": data.accountNumber,
                    "bank_name": data.bank_name
                }
            
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Invalid phone number");
        })
        
    })

    it("should not initialize a Loan with incomplete account number",function(){
        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/initialize_offer",
           "failOnStatusCode" : false,
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" :
                {
                    "phoneNumber": "0800000000",
                    "bvn": data.bvn,
                    "accountNumber": "310034424",
                    "bank_name": data.bank_name
                }
            
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            //expect(response.body.message).to.eq("Invalid phone number");
        })
    })
})