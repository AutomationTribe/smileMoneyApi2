///<reference types="cypress" />

describe("Reset password", function(){
    let otp,resetToken;
    before("Get Reset Token and OTP from fixture",function(){
        cy.SetPasswordOTP().then((fdata)=>{
            resetToken = fdata[0];
            otp =  fdata[1];
        });
    })
    it("should reset password",function(){
        
        cy.fixture('passwordrecovery').then((data)=>{
            //this.otp = data.otp;
            //this.resetToken = data.reset_token;
            cy.request({
                "method":"POST",
                "url":"https://smilemoney-sandbox.renmoney.com/agent/reset_password",
                "body":{
                    "otp": otp,
                    "token": resetToken,
                    "password": "chemistry",
                    "networkKey": "8437483748343"
                }
            }).then((response)=>{
    
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq('successful');
                expect(response.body.message).to.eq('Password reset succcessful');
            })
        })

        
       
    })

    it("should not reset password with wrong OTP",function(){
        
        cy.fixture('passwordrecovery').then((data)=>{
            //this.otp = data.otp;
            //this.resetToken = data.reset_token;
            cy.request({
                "method":"POST",
                "url":"https://smilemoney-sandbox.renmoney.com/agent/reset_password",
                "failOnStatusCode":false, 
                "body":{
                    "otp": otp + 5,
                    "token": resetToken,
                    "password": "NoLimit@2022__",
                    "networkKey": "8437483748343"
                }
            }).then((response)=>{
    
                expect(response.status).to.eq(400);
                expect(response.body.status).to.eq('failed');
                expect(response.body.message).to.eq('Invalid OTP');
            })
        })    
    })
    
    it("should not reset password with invalid TOKEN",function(){
        
        cy.fixture('passwordrecovery').then((data)=>{
            //this.otp = data.otp;
            //this.resetToken = data.reset_token;
            cy.request({
                "method":"POST",
                "url":"https://smilemoney-sandbox.renmoney.com/agent/reset_password",
                "failOnStatusCode" : false,
                "body":{
                    "otp": otp,
                    "token": resetToken + 4,
                    "password": "NoLimit@2022__",
                    "networkKey": "8437483748343"
                }
            }).then((response)=>{
    
                expect(response.status).to.eq(400);
                expect(response.body.status).to.eq('failed');
               // expect(response.body.message).to.eq('');
            })
        })

        
       
    })
})

