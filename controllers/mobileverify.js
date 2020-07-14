/*
created by Pardeep Kumar 19-06-2017
*/

var request=require('request');

var token=require('.././auth/secure');
var mobileVerify=function(req,res,next){
		var phoneno=req.body.mobile;
		var data={
			"phoneno":phoneno
		}
		var api_key_sms=token.sms_apikey1;
		var url="https://2factor.in/API/V1/"+api_key_sms+"/SMS/+91"+phoneno+"/AUTOGEN";
		/*request({
   			 uri: url,
    qs: {
      
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
        res.send(body);
      } else {
        res.send(error);
      }
    }
  });
*/
	request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  console.log('body:', body);
  if(error){
  	console.log(error);
  	res.send(error);
  }
  else{
  	console.log(body);
  	res.send(body);
  }
});

		

}

var verifyOtpMobile=function (req,res,next) {
	// body...

	var session=req.body.session;
	var otp_number=req.body.otp;
	var mobile_no=req.body.mobile;
	console.log(req.body);
		var api_key_sms=token.sms_apikey1;
		var url_verfiy="https://2factor.in/API/V1/"+api_key_sms+"/SMS/VERIFY/"+session+"/"+otp_number;

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
					sendRequestForSignIn(mobile_no,res);	
				}
				else{
					res.send({"success":false,"message":"Otp n't mached"});
				}
			}
		});
}

function sendRequestForSignIn(mobile_no,ress){
	console.log("request");
	request.post({
		method:'POST',
		url:'http://139.59.74.116:3030/api/v1/signin/mobile',
		json:{mobileno:mobile_no}

	},function(err,response,body){
		if(err){
			console.log(body);
			ress.send(body);
		}
		else{
			console.log(body);
			ress.send(body);
		}
	});

}


module.exports={
	mobileVerify:mobileVerify,
	verifyOtpMobile:verifyOtpMobile
}
