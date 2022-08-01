///<reference types="cypress" />
describe("Select Loan offer",function(){
    //connect to database get loan id 
    let offerId,token;
    before("Get offer id from database and Login",function(){
        cy.authenticate().then((data)=>{
            token = data;
        })
        cy.task('queryDb',"select * from smilemoney.loan where loanStatus = 'INITIALIZE' and mambo_loan_id IS NULL order by createdOn desc limit 1;").then((result)=>{
            if(result.length > 0){
               // console.log(result[0].bvn);
               offerId =  result[0].offer_id;
            }
        })
    })

    it("should select loan offer with valid loan id",function(){
        console.log(offerId)
       cy.request({
        "method" : "post",
        "url" : "https://smilemoney-sandbox.renmoney.com/loan/select_static_offer",
        
        "headers" : {
            "Authorization" : `Bearer ${token}`
        },
        "body" : {
            "offer_id" : offerId
        }
       }).should((response)=>{

        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq("successful");
        expect(response.body.message).to.eq("successful");
       })
    });

    it("should not select loan offer with non-existing loan id",function(){
        cy.request({
            "method" : "post",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/select_static_offer",
            "failOnStatusCode" : false,
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" : {
                "offer_id" : "203782"
            }
           }).should((response)=>{
    
            expect(response.status).to.eq(404);
            expect(response.body.status).to.eq("failed");
           // expect(response.body.message).to.eq("successful");
           })
    });

    it("should select loan offer with empty loan id",function(){
        cy.request({
            "method" : "post",
            "url" : "https://smilemoney-sandbox.renmoney.com/loan/select_static_offer",
            "failOnStatusCode" : false,
            "headers" : {
                "Authorization" : `Bearer ${token}`
            },
            "body" : {
                "offer_id" : ""
            }
           }).should((response)=>{
    
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            //expect(response.body.message).to.eq("successful");
           })
    });

    
})