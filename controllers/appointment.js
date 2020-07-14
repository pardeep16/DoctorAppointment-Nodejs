var appointment=require('.././models/appointment_model');


var bookappointment=function (req,res,next) {
	var user_id=req.body.user_id;
    var app_date=req.body.app_date;
    var patient_name=req.body.patient_name;
    var patient_age=req.body.patient_age;
    var patient_contact=req.body.patient_contact;
    var patient_gender=req.body.patient_gender;
    var patient_email=req.body.patient_email;
    var doc_id=req.body.doc_id;
    var payment_status=req.body.payment_status;
    var app_time=req.body.app_time;

	console.log("user_id :"+user_id);
    console.log("App Date : "+app_date);
	var data={
        "app_date":app_date,
		"user_id":user_id,
        "patient_name":patient_name,
        "patient_age":patient_age,
        "patient_gender":patient_gender,
        "patient_contact":patient_contact,
        "patient_email":patient_email,
        "doc_id":doc_id,
        "payment_status":payment_status,
        "app_time":app_time
	}
	appointment.bookappointment(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var getappointment=function (req,res,next) {
	var user_id=req.body.user_id;
	console.log("user_id :"+user_id);
	var data={
		"user_id":user_id
	}
	appointment.getappointment(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var getTimeSlots=function(req,res,next){
	var doc_id=req.body.doc_id;
	var start_date=req.body.start_date;
	var end_date=req.body.end_date;
	var apikey=req.body.apikey;
	var data={
		"doc_id":doc_id,
		"start_date":start_date,
		"end_date":end_date,
		"apikey":apikey
	}
	appointment.getAppointmentSlots(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});

}

//int socketCount=0;

var getOpd=function(req,res,next){
	var doc_id=req.body.doc_id;
	var data={
		"doc_id":doc_id
	}
	appointment.getOpdCounter(data,function(err,res){
		if(err){

		}
		else{
			
		}
	});

}


module.exports={
	bookappointment:bookappointment,
    getappointment:getappointment,
    getTimeSlots:getTimeSlots,
    getOpd:getOpd
}