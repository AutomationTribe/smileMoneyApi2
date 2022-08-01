///<reference types="cypress" />
describe("Repay Loan Test cases",function(){

    //check for a user that has active loan
        //if found test test repay loan
        //if not found, create  a user with 
    
    let accessToken,Customerbvn,customerPhoneNumber,loanAccount;

    before("Authenticate and Check if user has Loan",function(){
        cy.authenticate().then((fdata)=>{
            accessToken = fdata;
        })

        cy.task("queryDb","select * from smilemoney.loan where loanStatus = 'APPROVED' and mambo_loan_id IS NOT NULL order by createdon limit 1").then((result)=>{
            if(result < 0){
                console.log("No approved loan in DB");
            }
            Customerbvn =  result[0].bvn;
            loanAccount =  result[0].mambo_loan_id;
            cy.task("queryDb","select * from smilemoney.customer where bvn = " + Customerbvn  ).then((result2)=>{
                customerPhoneNumber =  result2[0].phone;
            })
        })
    })

    it("should repay customer loan",function(){

        cy.request({
            "method": "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/repay_loan",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "phoneNumber":customerPhoneNumber,
                "amount": "1",
                "loanAccount": loanAccount
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
        })

    })

    it("should not repay invalid loan account",function(){

        cy.request({
            "method": "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/repay_loan",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "failOnStatusCode" : false,
            "body" : {
                "phoneNumber":customerPhoneNumber,
                "amount": "10",
                "loanAccount": loanAccount + 1
            }
        }).then((response)=>{
            expect(response.status).to.eq(404)
        })

    })

    it("should not repay non-existing customer phone number",function(){

        cy.request({
            "method": "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/repay_loan",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "failOnStatusCode" : false,
            "body" : {
                "phoneNumber":"07000000000",
                "amount": "10",
                "loanAccount": "4000044"
            }
        }).then((response)=>{
            expect(response.status).to.eq(404)
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Customer not found");
        })

    })
    
})