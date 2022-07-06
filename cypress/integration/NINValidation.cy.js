///<reference types="cypress" />
describe("NIN Validation",function(){

    before("Load NIN data from fixture",function(){
        cy.fixture("NIN").then(function(data){
           // console.log(data.validNIN.nin);
            this.nin = data.validNIN;
            this.bvn = data.validBVN;
            this.invalidNIN = data.invalidNIN;
            this.invalidBVN =data.invalidBVN;
        })
    })

    it("should validate valid NIN",function(){
        cy.request({
            method: "POST",
            url: "https://smilemoney-sandbox.renmoney.com/agent/nin_validation",
            failOnStatusCode: false,
            body: {
                "nin": "34299589242",
                "bvn": "22271677774"
              }
        }).should((response)=>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("successful");
            expect(response.body.message).to.eq("Successful");
        })
    })

    it("should not validate empty NIN",function(){
        cy.request({
            method: "POST",
            url: "https://smilemoney-sandbox.renmoney.com/agent/nin_validation",
            failOnStatusCode: false,
            body: {
                "nin": "",
                "bvn": "22271677774"
              }
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("NIN is empty or invalid");
        })
    })

    it("should not validate empty BVN",function(){
        cy.request({
            method: "POST",
            url: "https://smilemoney-sandbox.renmoney.com/agent/nin_validation",
            failOnStatusCode: false,
            body: {
                "nin": "34299589242",
                "bvn": ""
              }
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("BVN is empty or invalid");
        })
    })

    it("should not validate empty NIN or BVN",function(){
        cy.request({
            method: "POST",
            url: "https://smilemoney-sandbox.renmoney.com/agent/nin_validation",
            failOnStatusCode: false,
            body: {
                "nin": "",
                "bvn": ""
              }
        }).should((response)=>{
            expect(response.status).to.eq(400);
            expect(response.body.status).to.eq("failed");
            expect(response.body.message).to.eq("NIN is empty or invalid,BVN is empty or invalid");
        })
    })
})