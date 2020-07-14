
var apis=require('.././controllers/instamojopayapis');
	var request=require('request');
	var mail=require('.././controllers/sendmail');

module.exports=function(io){
	var express=require('express');
	var pay_mod=require('.././models/paymentmod');

	var apis=require('.././controllers/instamojopayapis');
	var request=require('request');
	var mail=require('.././controllers/sendmail');

	var router=express.Router();
	var appointment=require('.././models/appointment_model');
	var payment=require('.././controllers/paymentcont');


	router.get('/getcounter',function(req,res){
		/*io.on('connection',function(socket){
			console.log("user connected");
			socket.on('getcounter',function(data){
					var doc_id=data.doc_id;
					var data={
						"doc_id":doc_id
					}
					appointment.getOpdCounter(data,function(err,result){
						if(err){
							
						}
						else{
							socket.emit('counter',result);
						}
					});
			});
		});*/
					console.log("getcounter");
					var doc_id=data.doc_id;
					var data={
						"doc_id":req.query.doc_id
					}
					appointment.getOpdCounter(data,function(err,result){
						if(err){
							
						}
						else{
							io.sockets.emit('counter',result);
						}
					});
		
	});

	router.get('/getopd',function(req,res){
		console.log("req");
		res.send('hello');
	});

	router.post('/updatecounter',function(req,res){
		appointment.updateCounter(req,function(err,resu){
		if(err){
			res.send(err);
		}
		else{
			console.log(resu);
			io.sockets.emit('updatecounter',resu.counter);
			res.send(resu.result);
		}
	});
	});

	router.post('/verifyPaymentStatus',function(req,res,next){
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
			if(typeof result.status==="boolean" && result.status==true){
				var data={
					"param":req.body,
					"payment_result":result
				};
				pay_mod.bookAppointMent(data,io,function(err,resultt){
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
	});

	return router;
}


var checkPaymentStatus=function(token,pay_id,cb){
	var api_url="https://api.instamojo.com/v2/payments/";
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



function getopdcounter(data) {
	// body...
	
}


