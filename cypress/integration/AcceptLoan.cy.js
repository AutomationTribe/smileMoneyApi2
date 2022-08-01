///<reference types="cypress" />
describe("Accept Loan offer test cases",function(){
    let token,mamboLoanId;
    before("Authenticate and Get mambo loan id",function(){
        cy.authenticate().then((data)=>{
            token = data;
        })

        cy.task("queryDb","select * from smilemoney.loan where loanStatus ='INITIALIZE' and mambo_loan_id IS NOT NULL order by createdOn desc limit 1;").then((result)=>{
            mamboLoanId = result[0].mambo_loan_id;
        })
    })
    it("should accept a loan offer with valid  loan id",function(){
        cy.request({
            "method" : "post",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/accept_static_offer",
            
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" : {
                "mambu_loan_id": mamboLoanId,
                "accept_status": true,
                "decline_reason": "test"
            }
        }).should((response)=>{
            expect(response.status).to.eq(200);

        })
    })

    it("should not accept a loan offer with empty loan id",function(){
        cy.request({
            "method" : "post",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/accept_static_offer",
            "failOnStatusCode" : false,
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" : {
                "mambu_loan_id": "",
                "accept_status": true,
                "decline_reason": "test"
            }
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed")
            expect(response.body.message).to.eq("mambu_loan_id must be a number string,mambu_loan_id is empty or invalid");
        })
    })
})