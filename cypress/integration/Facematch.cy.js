///<reference types="cypress" />
describe("All Face Match Test Cases",function(){
    let bvnImg,accessToken,wrongBvnImg,invalidBvnImg;
    before("Get agent image",function(){
        cy.authenticate().then((fdata)=>{
            accessToken = fdata
        })
        cy.request({
            "method" : "POST",
            "url" : "https://api-sandbox-v3.renmoney.com/bvn/api/v3/validate",
            "headers" : {
                "SourceAppID" : "ckpu7zo0p0000gg5436coo7xs",
            },
            "body" :{
                "bvn" : "22271677774"
            }
        }).then((response)=>{
            bvnImg =  response.body.data.picture;
        })

        cy.fixture("facematch").then((data)=>{
            wrongBvnImg =  data.wrongSelfie
            invalidBvnImg = data.invalidSelfie
        })
    })

    it("should validate a valid agent selfie",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/agent/facematch",
            "headers" :{
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "selfie" : bvnImg
            }
        }).then((response)=>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
            expect(response.body.message).to.eq("Successful");
            expect(response.body.data.isFaceMatched).to.eq(true);
        })
    })

    
    it("should not validate a wrong agent selfie",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/agent/facematch",
            "failOnStatusCode" : false,
            "headers" :{
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "selfie" : wrongBvnImg
            }
        }).then((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Facematch failed");
           // expect(response.body.data.isFaceMatched).to.eq(true);
        })
    })

    it("should not validate an empty agent selfie",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/agent/facematch",
            "failOnStatusCode" : false,
            "headers" :{
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "selfie" : ""
            }
        }).then((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Selfie is empty or invalid");
           // expect(response.body.data.isFaceMatched).to.eq(true);
        })
    })

    it("should not validate an invalid agent selfie",function(){

        cy.request({
            "method" : "POST",
            "url" : "https://smilemoney-sandbox.renmoney.com/agent/facematch",
            "failOnStatusCode" : false,
            "headers" :{
                "Authorization" : `Bearer ${accessToken}`
            },
            "body" : {
                "selfie" : invalidBvnImg
            }
        }).then((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("Facematch failed");
           // expect(response.body.data.isFaceMatched).to.eq(true);
        })
    })

    
    
})