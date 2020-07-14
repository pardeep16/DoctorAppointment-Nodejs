
/*
author : Pardeep Kumar
Email : pk.raswant@gmail.com
*/

var pay_mod=require('.././models/paymentmod');

var apis=require('./instamojopayapis');
var request=require('request');
var mail=require('./sendmail');

var getPaymentRequest=function (req,res,next) {
	// body...
	console.log(req.headers);
	if(req.headers.authorization){
			var api_key=req.headers.authorization;
			/*res.send(api_key);*/

			pay_mod.getPaymentParameters(api_key,function(err,resp){
				if(err){
					res.send(err);
				}
				else{
					res.send(resp);
				}
			});
	}
	else{
		res.send({"Success":false,"msg":"Authorization failed"});
	}
}


var verifyPayment=function(req,res,next){
	var pay_id=req.body.pay_id;
	var trans_id=req.body.trans_id;
	//var patient_id=req.body.patient_id;
	var p_id=req.body.p_id;
	var user_id=req.body.user_id;
	var name=req.body.name;
	var emailid=req.body.emailid;
	var phone=req.body.phone;
	var access_token=req.headers.authorization;
	// console.log("Auth :"+access_token);
	 //console.log("req :"+req.headers.authorization);
	//doctor & opd details

	var doc_id=req.body.doc_id;
	var doc_name=req.body.doc_name;
	var opd_counter=req.body.opd_token;

	//console.log(req.body);


	checkPaymentStatus(access_token,pay_id,function(err,result){
		if(err){
			res.send({"status":false,"msg":err});
		}
		else{
			var result=result;
			console.log("status :"+result.status);
			if(typeof result.status==="boolean" && result.status==false){
				var data={
					"param":req.body,
					"payment_result":result
				};
				pay_mod.bookAppointMent(data,function(err,resultt){
					if(err){
						res.send({
							"status":false,
							"msg":err
						});
					}
					else{
						res.send(resultt);
						mail.sendMail(resultt.data);
					}
				});
			}
			else{
				res.send({
					"status":false,
					"msg":"Your payment was either cancelled or not been confirmed.If there is any problem contact to support team."+"Your Payment id is :"+result.id
				});
				var datatemp={
					"email":emailid,
					"msg":"Your payment was either cancelled or not been confirmed.If there is any problem contact to support team."
				}
				mail.sendTempMail(datatemp);
				
			}
		}
	});
}

var checkPaymentStatus=function(token,pay_id,cb){
	var api_url=apis.payment_status;
	console.log(api_url);
	api_url=api_url+pay_id+"/";
	console.log(api_url);


	var head={
		"Authorization":"Bearer "+token
	}
		
	console.log(head);
	request.get(api_url,{
		headers:head
	},function(err,response,body){
		if(!err && response.statusCode==200){
			//console.log(response);
			cb(null,JSON.parse(response.body));
		}
		else{
			//console.log(err);
			cb(err,null);
		}
	});

}



module.exports={
	getPaymentRequest:getPaymentRequest,
	verifyPayment:verifyPayment
}