

var patients=require('.././models/patient_models');


var getPatients=function(req,res,next) {
	// body...

	var apikey=req.query.apikey;
	var phone=req.query.phone;
	var data={
		"apikey":apikey,
		"phone":phone
	}
	patients.getPatientsProfile(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}



module.exports={
	getPatients:getPatients
}