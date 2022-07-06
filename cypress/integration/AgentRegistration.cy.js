///<reference types="cypress" />

describe("Register Agent",function(){
    before("Check if an agent exists",function(){

        //cy.authenticate().as("authToken");

        cy.task('queryDb',"select * from smilemoney.agent where bvn = 22200279145;").then((result) =>{
            
            if(result.length > 0){

                cy.task("queryDb","Delete from smilemoney.agent where bvn = 22200279145").then((result)=>{
                    cy.log('deleted');
                })

            }else {
                cy.log("Not found")
            }

        })

        cy.fixture("agent").then(function(data){

            console.log(data.agentRegister.invalidEmail);
            this.email =  data.agentRegister.email;
            this.bvn  = data.agentRegister.bvn;
            this.nin = data.agentRegister.nin;
            this.password = data.agentRegister.password;
            this.networkKey = data.agentRegister.networkKey;

            this.invalidEmail =  data.agentRegister.invalidEmail;
            this.invalidBVN = data.agentRegister.invalidBVN;
            this.invalidNIN =data.agentRegister.invalidNIN;

        })
    })

    
    it("should not register an agent with invalid BVN",function(){
        cy.request({
            method: "POST",
            url:"https://smilemoney-sandbox.renmoney.com/agent/registration",
            failOnStatusCode: false,
            body:{
                "email":this.email,
                "bvn" : this.invalidBVN,
                "nin":this.nin,
                "password" : this.password,
                "networkKey" : this.networkKey
            }
        }).should((response) =>{
           expect(response.status).to.eq(400);
           expect(response.body.status).to.eq("failed");
           expect(response.body.message).to.eq("Invalid BVN");
        })
    })
    it("should not register an agent with invalid NIN",function(){
            cy.request({
                method: "POST",
                url:"https://smilemoney-sandbox.renmoney.com/agent/registration",
                failOnStatusCode: false,
                body:{
                    "email":this.email,
                    "bvn" : this.bvn,
                    "nin":this.invalidNIN,
                    "password" : this.password,
                    "networkKey" : this.networkKey
                }
            }).should((response) =>{
                expect(response.status).to.eq(400);
                expect(response.body.status).to.eq("failed");
                expect(response.body.message).to.eq("Invalid NIN");
            })
    })

    it("should successfully register an agent ",function(){
        cy.request({
            method: "POST",
            url:"https://smilemoney-sandbox.renmoney.com/agent/registration",
            failOnStatusCode: false,
            body:{
                "email":this.email,
                "bvn" : this.bvn,
                "nin":this.nin,
                "password" : this.password,
                "networkKey" : this.networkKey
            }
        }).should((response) =>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
            expect(response.body.message).to.eq("Agent created successfully");
        })
    })

    it("should not register an already existing agent",()=>{
                cy.request({
                    method: "POST",
                    url:"https://smilemoney-sandbox.renmoney.com/agent/registration",
                    failOnStatusCode: false,
                    body:{
                        "email":"austin@yopmail.com",
                        "bvn" : "22271677774",
                        "nin":"34299589242",
                        "password" : "NoLimit@2022",
                        "networkKey" : "4342424"
                    }
                }).should((response) =>{
                    expect(response.status).to.eq(406);
                    expect(response.body.status).to.eq("failed");
                   // expect(response.body.message).to.eq("Agent email address already exist");
                })
            })
   
})