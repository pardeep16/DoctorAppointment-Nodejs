/*
author :- Pardeep Kumar
pk.raswant@gmail.com
*/
var signin=require('.././models/signin_model');
var token=require('.././auth/secure');
var request=require('request');

var onMLogin=function (req,res,next) {
	// body...
	var mobileno=req.body.mobileno;
	console.log("mobile no :"+mobileno);
	var data={
		"mobileno":mobileno
	}
	signin.onSignInWithMobile(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var onLogin=function (req,res,next) {
	// body...
	var emailid=req.body.emailid;
	var name=req.body.name;
	var gmail_token=req.body.gmail_token;
	var data={
		"emailid":emailid,
		"name":name,
		"gmail_token":gmail_token
	}
	signin.onSignInWithGmail(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var addPhoneNumber=function(req,res){
	var user_id=req.body.user_id;
	var apikey=req.body.apikey;
	var sessionkey=req.body.session;
	var phone=req.body.mobile;
	var otp_number=req.body.otp;

	console.log(req.body);	
	

	var data={
		"user_id":user_id,
		"apikey":apikey,
		"phone":phone
	}
	var api_key_sms=token.sms_apikey1;
		var url_verfiy="https://2factor.in/API/V1/"+api_key_sms+"/SMS/VERIFY/"+sessionkey+"/"+otp_number;

		console.log(url_verfiy);

		request.post(url_verfiy,function(err,response,body){
			if(err){
				console.log(err);
				res.send({"success":false,"message":err});
			}
			else{
				console.log(body);
				/*;
				console.log(result);*/
				var result11=JSON.parse(body);
				console.log(result11);
				var result=result11.Status;
				console.log("result "+result);
				if(result=="Success"){
					signin.addNumberModel(data,function(errorr,results){
						if(errorr){
							res.send(errorr);
						}
						else{
							res.send(results);
						}
					});	
				}
				else{
					res.send({"success":false,"message":"Otp n't mached"});
				}
			}
		});
	
}


module.exports={
	onLogin:onLogin,
	onMLogin:onMLogin,
	addPhoneNumber:addPhoneNumber
}
