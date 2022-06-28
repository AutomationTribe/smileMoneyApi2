///<reference types="cypress" />
describe("Email validation test cases",function(){

    before("Retrieve or insert email to DB",function(){
        let existingUserEmail;
        cy.task("querDb","select * from smilemoney.agent").then((data)=>{
            if(data.length > 0){
                existingUserEmail = data[0].email;
            }else{
                
                console.log("No agent found");
            }
        })
    })
   
    it("should validate an existing email",function(){

        cy.request({
            "method" : "POST",
            "url": "https://smilemoney-sandbox.renmoney.com/customer/email_validation",
            "body" : {
                "email":existingUserEmail,
                "networkKey":"4342424"
            }
        }).then((response)=>{

            expect(response.status).to.eq(200);
        })

    })

    it("should not validate a non-existing email",function(){

        cy.request({
            "method" : "POST",
            "url": "https://smilemoney-sandbox.renmoney.com/customer/email_validation",
            "body" : {
                "email":"foo@bar.com",
                "networkKey":"4342424"
            }
        }).then((response)=>{

            expect(response.status).to.eq(404);
        })

    })

})