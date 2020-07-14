/*
author :- Gurwinder Singh
sgurwinderr@gmail.com
*/
var getdetails=require('.././models/getdetails_model');

var getdoctordetails=function (req,res,next) {
	var specialization=req.body.specialization;
	console.log("specialization :"+specialization);
	var data={
		"specialization":specialization
	}
	getdetails.doctordetails(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var getpatientdetails=function (req,res,next) {
	var auth_key=req.body.auth_key;
	console.log("auth_key :"+auth_key);
	var data={
		"auth_key":auth_key
	}
	getdetails.patientdetails(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

module.exports={
	getdoctordetails:getdoctordetails,
	getpatientdetails:getpatientdetails
}