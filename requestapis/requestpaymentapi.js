/*
author : Pardeep Kumar
Email : pk.raswant@gmail.com
*/


var request=require('request');
var token=require('.././auth/secure');

var getAccessToken=function(cb){



	var grant_type="client_credentials";
	var c_id=token.c_id;
	var c_sec=token.c_secret;

	var urll='https://api.instamojo.com/oauth2/token/';

	var payload={
      'grant_type': 'client_credentials',
      'client_id': c_id,
      'client_secret': c_sec
}

//console.log(payload);

	request.post(urll,{form: payload},function(err,respo,body){
		//console.log(err+'\n'+respo+"\n"+body);

		if(!err && respo.statusCode == 200){
			cb(null,body);
		}
		else{
			cb({"success":false,"msg":err},null);
		}
	});


}


module.exports={
	getAccessToken:getAccessToken
}