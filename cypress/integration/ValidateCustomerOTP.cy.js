///<reference types="cypress" />
describe("Validate Customer OTP test cases",function(){

    let otp,phoneNumber,accessToken;

    before("Load otp and phone number",()=>{
        cy.authenticate().then((data)=>{
            accessToken = data;
        })
        cy.fixture("OTPValidation").then((fdata)=>{
             otp = fdata.otp;
             phoneNumber = fdata.phoneNumber;
        })
    })

  it("should validate the otp of a new phone number",function(){
    cy.request({
        "method" : "POST",
        "url" : "https://smilemoney-sandbox.renmoney.com/customer/validate_otp",
        "headers" : {
            "Authorization" : `Bearer ${accessToken}`
        },
        "body" : {
            "phoneNumber": phoneNumber,
            "otp": otp
        }
    }).then((response)=>{

        expect(response.status).to.eq(200);
    })
  })

  it("should not validate invalid otp of a new phone number",function(){
    cy.request({
        "method" : "POST",
        "url" : "https://smilemoney-sandbox.renmoney.com/customer/validate_otp",
        "headers" : {
            "Authorization" : `Bearer ${accessToken}`
        },
        "failOnStatusCode" :false,
        "body" : {
            "phoneNumber": phoneNumber,
            "otp": "111"
        }
    }).then((response)=>{

        expect(response.status).to.eq(400);
        expect(response.body.status).to.eq("failed");
        expect(response.body.message).to.eq("Invalid OTP");
    })
  })

  it("should not validate empty phone",function(){
    cy.request({
        "method" : "POST",
        "url" : "https://smilemoney-sandbox.renmoney.com/customer/validate_otp",
        "failOnStatusCode":false,
        "headers" : {
            "Authorization" : `Bearer ${accessToken}`
        },
        "body" : {
            "phoneNumber": " ",
            "otp": otp
        }
    }).then((response)=>{

        expect(response.status).to.eq(400);
        expect(response.body.status).to.eq("failed");
        expect(response.body.message).to.eq("Invalid phone number");
    })
  })
})