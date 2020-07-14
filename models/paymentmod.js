/*

author : Pardeep Kumar
Email : pk.raswant@gmail.com

*/

var app=require('../app');

var getConnection=require('./db');
var mysql=require('mysql');
var sec=require('.././auth/secure');
var requ=require('.././requestapis/requestpaymentapi');
var moment=require('moment');

var getPaymentParameters=function(api_key,cb){

	var search_api='Select * from user_auth where auth_key='+mysql.escape(api_key);
	console.log(search_api);
	var dd=new Date();
	var trans_id="Rotary-";

	getConnection(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":err},null);
		}
		else{
			conn.query(search_api,function(err,rowss){
				if(err){
					conn.release();
					cb({"success":false,"msg":err},null);
				}
				else{
					if(rowss.length>0){
						requ.getAccessToken(function(err,resp){
							if(err){
								conn.release();
								cb({"success":false,"msg":err},null);
							}
							else{
								trans_id=trans_id+api_key+dd.getTime();
								conn.release();
								cb(null,{"success":true,"trans_id":trans_id,"data":resp});
							}
						});
					}
					else{
						conn.release();
						cb({"success":false,"msg":"Invalid API Key SignIn Again"},null);
					}
				}
			});
		}
	});

}

var bookAppointMent=function(data,io,cb){
	var pay_id=data.param.pay_id;
	var trans_id=data.param.trans_id;
	//var patient_id=req.body.patient_id;
	var name=data.param.name;
	var emailid=data.param.emailid;
	var phone=data.param.phone;
	//var access_token=req.headers.authorization;
	// console.log("Auth :"+access_token);
	 //console.log("req :"+req.headers.authorization);
	//doctor & opd details

	var user_id=data.param.user_id;
	var p_id=data.param.p_id;
	var p_age=data.param.p_age;
	var doc_id=data.param.doc_id;
	var doc_name=data.param.doc_name;
	var opd_counter=parseInt(data.param.opd_counter);
	var p_sex=data.param.p_sex;

	var payment_id=data.payment_result.id;
	var amount=data.payment_result.amount;
	var status=data.payment_result.status;
	var instrument_type=data.payment_result.instrument_type;
	var pay_status="";

	if(status==true){
		pay_status="Accepted";
	}
	else{
		pay_status="Declined";
	}

	var dd=new Date();
	console.log("today date");

	var newdd=moment(dd).format('h:mm:ss a');
	console.log(newdd);

	var daten=moment(dd).format('YYYY-MM-DD');

	var max_token_query='Select max(opd_token) as opd_token from opd_entery where opd_doctorid='+mysql.escape(doc_id)+" and opd_date="+mysql.escape(daten);
	
	var p_name=name.toLowerCase();
	var search_max_patient='Select MAX(id) as p_id from patient_detail';
	var insert_patient='INSERT INTO `patient_detail` (`id`, `pid1`, `pid2`, `p_name`, `p_agetype`, `p_age`, `p_birthdate`, `p_sex`, `p_addresss`, `p_city`, `p_telephone`, `p_bloodtype`, `p_guardiantype`, `p_father_husband`, `p_insurancetype`) VALUES(';

	getConnection(function(err,connection){
		connection.query(max_token_query,function(err,rows){
			if(err){
				connection.release();
				cb(err,null);
			}
			else{
			if(rows.length>0){
				var max_no=rows[0].opd_token;
				console.log("max token :"+max_no);
				if(max_no>=opd_counter){
					opd_counter=parseInt(max_no)+1;
					console.log("your opd_counter :"+opd_counter);
				}
				else{
					opd_counter=opd_counter;
				}

				if(p_id==null || p_id=="undefined"){
								connection.query(search_max_patient,function(err,rows){
									if(err){
											connection.release();
							//console.log(io);
									}
									else{
										var max=parseInt(rows[0].p_id);
										max=max+1;
										var newid="0000"+moment(dd).format('YY')+"00000"+max;
										console.log("max :"+max);
										insert_patient=insert_patient+mysql.escape(max)+","+mysql.escape(newid)+","+mysql.escape(newid)+","+mysql.escape(name)+","+mysql.escape("age")+","+mysql.escape(p_age)+","+mysql.escape("1111-11-11")+","+mysql.escape(p_sex)+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape(phone)+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape("na")+")";
										console.log(insert_patient);
										p_id=newid;
										connection.query(insert_patient,function(err,rows){
											var insertOpd='Insert into opd_entery(p_id,p_name,opd_doctor,opd_doctorid,opd_date,opd_token,opd_diseasestype,opd_charge,opd_entry_user,opd_entry_time) values('+mysql.escape(p_id)+","+mysql.escape(name)+","+mysql.escape(doc_name)+","+mysql.escape(doc_id)+","+mysql.escape(daten)+","+mysql.escape(opd_counter)+","+mysql.escape("Online OPD")+","+mysql.escape(amount)+","+mysql.escape("Through App")+","+mysql.escape(newdd)+")";
				console.log(insertOpd);
				connection.query(insertOpd,function(err,rows){
				if(err){
					connection.release();
					cb(err,null);
				}
				else{
					var insertid=rows.insertId;
					console.log("Insert Id:- "+insertid);
					var payment_query='Insert into payment_details(pay_id,user_id,amount,payment_via,payment_status,p_id) values('+mysql.escape(pay_id)+","+mysql.escape(user_id)+","+mysql.escape(amount)+","+mysql.escape(instrument_type)+","+mysql.escape(pay_status)+","+mysql.escape(p_id)+")";
					console.log(payment_query);

					connection.query(payment_query,function(err,rowss){
						if(err){
							connection.release();
							cb(err,null);
						}
						else{

							connection.release();
							//console.log(io);


							io.sockets.emit('updatecounter',{"token":opd_counter,"doc_id":doc_id});
							cb(null,{"status":true,"data":{
						"name":name,
						"email":emailid,
						"phone":phone,
						"opd_token":opd_counter,
						"payment_status":status,
						"payment_id":payment_id,
						"doc_name":doc_name,
						"date":daten,
						"timemail":dd.getTime(),
						"opd_id":insertid,
						"p_id":p_id
					}});
						



						}
					});
				}
			});	
										});
									}
								});
						}
						else{
							var insertOpd='Insert into opd_entery(p_id,p_name,opd_doctor,opd_doctorid,opd_date,opd_token,opd_diseasestype,opd_charge,opd_entry_user,opd_entry_time) values('+mysql.escape(p_id)+","+mysql.escape(name)+","+mysql.escape(doc_name)+","+mysql.escape(doc_id)+","+mysql.escape(daten)+","+mysql.escape(opd_counter)+","+mysql.escape("Online OPD")+","+mysql.escape(amount)+","+mysql.escape("Through App")+","+mysql.escape(newdd)+")";
				console.log(insertOpd);
				connection.query(insertOpd,function(err,rows){
				if(err){
					connection.release();
					cb(err,null);
				}
				else{
					var insertid=rows.insertId;
					console.log("Insert Id:- "+insertid);
					var payment_query='Insert into payment_details(pay_id,user_id,amount,payment_via,payment_status,p_id) values('+mysql.escape(pay_id)+","+mysql.escape(user_id)+","+mysql.escape(amount)+","+mysql.escape(instrument_type)+","+mysql.escape(pay_status)+","+mysql.escape(p_id)+")";
					console.log(payment_query);

					connection.query(payment_query,function(err,rowss){
						if(err){
							connection.release();
							cb(err,null);
						}
						else{

							connection.release();
							//console.log(io);


							io.sockets.emit('updatecounter',{"token":opd_counter,"doc_id":doc_id});
							cb(null,{"status":true,"data":{
						"name":name,
						"email":emailid,
						"phone":phone,
						"opd_token":opd_counter,
						"payment_status":status,
						"payment_id":payment_id,
						"doc_name":doc_name,
						"date":daten,
						"timemail":dd.getTime(),
						"opd_id":insertid,
						"p_id":p_id
					}});
						



						}
					});
				}
			});	
						}	

			}
			else{
					/*var insertOpd='Insert into opd_entery(p_id,p_name,opd_doctor,opd_doctorid,opd_date,opd_token,opd_diseasestype,opd_charge,opd_entery_user,opd_entery_time) values('+mysql.escape(p_id)+","+mysql.escape(name)+","+mysql.escape(doc_name)+","+mysql.escape(doc_id)+","+mysql.escape(daten)+","+mysql.escape(opd_counter)+","+mysql.escape("Online OPD")+mysql.escape(amount)+mysql.escape("Through App")+mysql.escape(newdd)+")";
				console.log(insertOpd);
				connection.query(insertOpd,function(err,rows){
				if(err){
					connection.release();
					cb(err,null);
				}
				else{
					var payment_query='Insert into payment_details(pay_id,user_id,amount,payment_via,payment_status,p_id) values('+mysql.escape(pay_id)+","+mysql.escape(user_id)+","+mysql.escape(amount)+","+mysql.escape(instrument_type)+","+mysql.escape(pay_status)+","+mysql.escape(p_id)+")";
					console.log(payment_query);

					connection.query(payment_query,function(err,rowss){
						if(err){
							connection.release();
							cb(err,null);
						}
						else{
							connection.release();
							console.log(io);
							io.sockets.emit('updatecounter',{"token":opd_counter,"doc_id":doc_id});
							cb(null,{"status":true,"data":{
						"name":name,
						"email":emailid,
						"phone":phone,
						"opd_token":opd_counter,
						"payment_status":status,
						"payment_id":payment_id,
						"doc_name":doc_name,
						"date":daten,
						"timemail":dd.getTime()
					}});
						}
					});
					
				}
			});*/	
			if(p_id==null || p_id=="undefined"){
								connection.query(search_max_patient,function(err,rows){
									if(err){
											connection.release();
							//console.log(io);
									}
									else{
										var max=parseInt(rows[0].p_id);
										max=max+1;
										var newid="0000"+moment(dd).format('YY')+"00000"+max;
										console.log("max :"+max);
										insert_patient=insert_patient+mysql.escape(max)+","+mysql.escape(newid)+","+mysql.escape(newid)+","+mysql.escape(name)+","+mysql.escape("age")+","+mysql.escape(p_age)+","+mysql.escape("1111-11-11")+","+mysql.escape(p_sex)+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape(phone)+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape("na")+","+mysql.escape("na")+")";
										console.log(insert_patient);
										p_id=newid;
										connection.query(insert_patient,function(err,rows){
											var insertOpd='Insert into opd_entery(p_id,p_name,opd_doctor,opd_doctorid,opd_date,opd_token,opd_diseasestype,opd_charge,opd_entry_user,opd_entry_time) values('+mysql.escape(p_id)+","+mysql.escape(name)+","+mysql.escape(doc_name)+","+mysql.escape(doc_id)+","+mysql.escape(daten)+","+mysql.escape(opd_counter)+","+mysql.escape("Online OPD")+","+mysql.escape(amount)+","+mysql.escape("Through App")+","+mysql.escape(newdd)+")";
				console.log(insertOpd);
				connection.query(insertOpd,function(err,rows){
				if(err){
					connection.release();
					cb(err,null);
				}
				else{
					var insertid=rows.insertId;
					console.log("Insert Id:- "+insertid);
					var payment_query='Insert into payment_details(pay_id,user_id,amount,payment_via,payment_status,p_id) values('+mysql.escape(pay_id)+","+mysql.escape(user_id)+","+mysql.escape(amount)+","+mysql.escape(instrument_type)+","+mysql.escape(pay_status)+","+mysql.escape(p_id)+")";
					console.log(payment_query);

					connection.query(payment_query,function(err,rowss){
						if(err){
							connection.release();
							cb(err,null);
						}
						else{

							connection.release();
							//console.log(io);


							io.sockets.emit('updatecounter',{"token":opd_counter,"doc_id":doc_id});
							cb(null,{"status":true,"data":{
						"name":name,
						"email":emailid,
						"phone":phone,
						"opd_token":opd_counter,
						"payment_status":status,
						"payment_id":payment_id,
						"doc_name":doc_name,
						"date":daten,
						"timemail":dd.getTime(),
						"opd_id":insertid,
						"p_id":p_id
					}});
						



						}
					});
				}
			});	
										});
									}
								});
						}
						else{
							var insertOpd='Insert into opd_entery(p_id,p_name,opd_doctor,opd_doctorid,opd_date,opd_token,opd_diseasestype,opd_charge,opd_entry_user,opd_entry_time) values('+mysql.escape(p_id)+","+mysql.escape(name)+","+mysql.escape(doc_name)+","+mysql.escape(doc_id)+","+mysql.escape(daten)+","+mysql.escape(opd_counter)+","+mysql.escape("Online OPD")+","+mysql.escape(amount)+","+mysql.escape("Through App")+","+mysql.escape(newdd)+")";
				console.log(insertOpd);
				connection.query(insertOpd,function(err,rows){
				if(err){
					connection.release();
					cb(err,null);
				}
				else{
					var insertid=rows.insertId;
					console.log("Insert Id:- "+insertid);
					var payment_query='Insert into payment_details(pay_id,user_id,amount,payment_via,payment_status,p_id) values('+mysql.escape(pay_id)+","+mysql.escape(user_id)+","+mysql.escape(amount)+","+mysql.escape(instrument_type)+","+mysql.escape(pay_status)+","+mysql.escape(p_id)+")";
					console.log(payment_query);

					connection.query(payment_query,function(err,rowss){
						if(err){
							connection.release();
							cb(err,null);
						}
						else{

							connection.release();
							//console.log(io);


							io.sockets.emit('updatecounter',{"token":opd_counter,"doc_id":doc_id});
							cb(null,{"status":true,"data":{
						"name":name,
						"email":emailid,
						"phone":phone,
						"opd_token":opd_counter,
						"payment_status":status,
						"payment_id":payment_id,
						"doc_name":doc_name,
						"date":daten,
						"timemail":dd.getTime(),
						"opd_id":insertid,
						"p_id":p_id
					}});
						



						}
					});
				}
			});	
						}
			}
		}
		});
	});
}



module.exports={
	getPaymentParameters:getPaymentParameters,
	bookAppointMent:bookAppointMent
}