///<reference types="cypress" />
describe("Get Loan Offer Test cases",function(){

    //check for a user that has active loan
        //if found test test repay loan
        //if not found, create  a user with 
    
    let accessToken;
    before("Authenticate and Check if user has Loan",function(){
        cy.authenticate().then((fdata)=>{
            accessToken = fdata;
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
                "phoneNumber":"07038729221",
                "amount": "1",
                "loanAccount": "4000005"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
        })

    })

    /*it("should not repay invalid loan account",function(){

        cy.request({
            "method": "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/repay_loan",
            "headers" : {
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "phoneNumber":"07038729221",
                "amount": "1",
                "loanAccount": "4100x05"
            }
        }).then((response)=>{
            expect(response.status).to.eq(200)
        })

    })*/
    
})