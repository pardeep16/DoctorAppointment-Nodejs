var express=require('express');
var router=express.Router();
var signin=require('.././controllers/signin');
var verify=require('.././controllers/mobileverify');
var getdetails=require('.././controllers/getdetails');
var appointment=require('.././controllers/appointment');



var doctCont=require('.././controllers/doctorscont');

var testt=require('.././controllers/testcont');

var otherapi=require('.././others/mailsend');


var payment=require('.././controllers/paymentcont');

var patients=require('.././controllers/patients');

var request=require('request');

router.post('/signin/gmail',signin.onLogin);

router.post('/signin/mobile',signin.onMLogin);

router.post('/sendotp/mobile',verify.mobileVerify);

router.post('/verify/mobileno',verify.verifyOtpMobile);

router.post('/appointment/book',appointment.bookappointment);

router.post('/appointment/get',appointment.getappointment);

router.post('/add/phone',signin.addPhoneNumber);

router.get('/get/doctorlist',doctCont.getDoctors);

router.post('/get/timeslots',appointment.getTimeSlots);
router.get('/get/departmentlist',doctCont.getDepartmentList);

//router.post('/appointment/cancel',appointment.cancelAppointment);

router.post('/get/opd',appointment.getOpd);

router.get('/get/departmentlist',doctCont.getDepartmentList);

router.post('/get/paymentrequest',payment.getPaymentRequest);

//router.post('/verifyPaymentStatus',payment.verifyPayment);

router.get('/getPatientProfiles',patients.getPatients);



//router.post('/patientdetails',getdetails.getpatientdetails);

/*router.post('/demo',function (req,res) {
	// body...
	request.post({
		headers	: {'content-type' : 'application/json'},
		method : 'POST',
		url : 'http://localhost:3000/api/v1/demo2',
		body : "{"+"msg"+":"+req.body.msg+"}"
		json: {msg: req.body.msg}
	},function(err,response,body){
		//console.log(response);
		if(err){

			res.send(err);
		}
		else{
			res.send(body);
		}
	});
});

router.post('/demo2',function(req,res){
	console.log("hello..");
		res.send("hello");
});*/


/*

Temorary Urls For Testing
*/

router.post('/addnew/doctor',testt.adddoctor);

router.get('/sendmail',otherapi.sendmail);

module.exports=router;

