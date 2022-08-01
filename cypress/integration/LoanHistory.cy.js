///<reference types="cypress" />
describe("Loan History Test Cases",function(){
    let token,phoneNumber;
    before("Log user in",function(){
       cy.authenticate().then((data)=>{
        token = data;
      });
      cy.fixture('LoanHistory').then((fdata)=>{
        phoneNumber = fdata;
      })
    })

    it("should retrieve loan history of user with active loans",function(){
        console.log(token);
        cy.request({
            method : "GET",
            url : "https://smilemoney-sandbox.renmoney.com/loan/get_loans/07038729221",
            failOnStatusCode:false,
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then((response)=>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");

        })
    })

    it("should not retrieve loan history of user with no active loans",function(){
        console.log(token);
        cy.request({
            method : "GET",
            url : "https://smilemoney-sandbox.renmoney.com/loan/get_loans/07018729221",
            failOnStatusCode:false,
            headers:{
                Authorization: `Bearer ${token}`
            }
        }).then((response)=>{
            expect(response.status).to.eq(404);
            expect(response.body.status).to.eq("failed");

        })
    })

    
})