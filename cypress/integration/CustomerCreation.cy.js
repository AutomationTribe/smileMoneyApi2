///<reference types="cypress" />
describe("Customer Creation",function(){
let token;
    before("Remove test user",()=>{
       // cy.authenticate().as("authToken");
        cy.authenticate().then((fToken)=>{
            token = fToken;
        })
        cy.task('queryDb',"select * from smilemoney.customer where bvn = 22271677774;").then((result) =>{
            
            if(result.length > 0){

                cy.task("queryDb","Delete from smilemoney.customer where bvn = 22271677774").then((result)=>{
                    cy.log('deleted');
                })

            }else {
                cy.log("Not found")
            }

        })   
    });

    it("should create customer successfully",()=>{
        cy.request({
            method: "POST",
            url:"https://smilemoney-sandbox.renmoney.com/customer/creation",
            headers:{
                Authorization: `Bearer ${token}`
            },
            body:{
               "bvn":"22271677774",
               "phoneNumber" : "07068181972",
               "bankId" : "000013",
               "accountNumber" : "0040054466",
               "pin":"2937"
            }
        }).should((response) =>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
            expect(response.body.message).to.eq("Customer created Successfully");
        })
    
    })

    it("should not create customer when PIN is more than 4 digits",()=>{
      
            cy.request({
                method: "POST",
                url:"https://smilemoney-sandbox.renmoney.com/customer/creation",
                headers:{
                    Authorization: `Bearer ${token}`
                },
                failOnStatusCode: false,
                body:{
                   "bvn":"22271677774",
                   "phoneNumber" : "07068181972",
                   "bankId" : "000013",
                   "accountNumber" : "0040054466",
                   "pin":"29378"
                }
            }).should((response) =>{
                expect(response.status).to.eq(400);
                expect(response.body.status).to.eq("failed");
                expect(response.body.message).to.eq("Invalid pin");
            })
       
        })
   

        it("should not create customer with already existing bvn",()=>{
          
                cy.request({
                    method: "POST",
                    url:"https://smilemoney-sandbox.renmoney.com/customer/creation",
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                    failOnStatusCode: false,
                    body:{
                       "bvn":"22271677774",
                       "phoneNumber" : "07068181972",
                       "bankId" : "000013",
                       "accountNumber" : "0040054466",
                       "pin":"2937"
                    }
                }).should((response) =>{
                    expect(response.status).to.eq(406);
                    expect(response.body.status).to.eq("failed");
                   // expect(response.body.message).to.eq("BVN already exist");
                })
           
            })

     
})