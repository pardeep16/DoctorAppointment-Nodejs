
var getConnection=require('./db'); var mysql=require('mysql');
var jwt_simple=require('jwt-simple');
var crypto=require('crypto');
var tokens=require('.././auth/secure');
var moment=require('moment');

var bookappointment=function (data,callback) {
	
	var user_id=data.user_id;
	if(!user_id){
		callback({"success":false,"msg":"Invalid Request"},null);
		return;
	}
	var datenew=new Date(data.app_date);
	var appdate=moment(datenew).format('YYYY-MM-DD');

	console.log(appdate);
	console.log(data.app_time);
	var tt=new Date(data.app_date+" "+data.app_time);
	var ttime=moment(tt).format('H:mm:ss');
	/*console.log("t1 :"+tt);
	console.log("tnew :"+ttime);*/



	//var search_appointment='Select app_id from appointment where (user_id='+mysql.escape(user_id)+' and app_status="pending") || (user_id='+mysql.escape(user_id)+' and payment_status="pending")';



	var search_appointment='Select app_id from appointment where ( user_id='+mysql.escape(user_id)+' and app_status="pending" ) || ( user_id='+mysql.escape(user_id)+' and payment_status="False")';
	var create_appointment='Insert into appointment(app_date,user_id,patient_name,patient_age,patient_gender,patient_contact,patient_email,doc_id,app_time) values('+mysql.escape(appdate)+','+mysql.escape(data.user_id)+','+mysql.escape(data.patient_name)+','+mysql.escape(data.patient_age)+','+mysql.escape(data.patient_gender)+','+mysql.escape(data.patient_contact)+','+mysql.escape(data.patient_email)+','+mysql.escape(data.doc_id)+","+mysql.escape(ttime)+');';

	var search_user='Select * from appointment where (doc_id='+mysql.escape(data.doc_id)+" and app_date="+mysql.escape(appdate)+" and app_time="+mysql.escape(app_time)+" );"

	console.log(search_appointment);
	console.log(create_appointment);
	
	getConnection(function(err,connection){
		console.log("get connection");
		if(err){
			//console.log(err);
			connection.release();
			//throw err;
			callback({"msg":"Connection not established!"},null);
		}

		else{


			connection.query(search_appointment,function(err,rowss){
				if(err){
					connection.release();
				   callback({"success":false,"msg":err},null);
				}
				else{
					if(rows.length>0){
						connection.release();
				       callback({"success":false,"msg":err},null);
					}
					else{
						connection.query(search_appointment,function(err,rows,cols){
				console.log("Search appointment");
			if(err){
				console.log("Error Searching appointment");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
			else{
				console.log("Rows Length : "+rows.length);
				if(rows.length>1){
					
							
							console.log("Appointment Found");
                    		connection.release();
							callback({"success":false,"msg":"Appointment already found"},null);
					
					
				
				}
				else{
					connection.query(create_appointment,function(err,resu){
						console.log("Creating Appointment");
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
                            connection.release();
							var send_data={"success":true};
							callback(null,send_data);
						}
					});
				}
			}
		});
					}
				}
			});
		}
	});
}

var getappointment=function (data,callback) {
	var user_id=data.user_id;
	if(!user_id){
		callback({"success":false,"msg":"Invalid Request"},null);
		return;
	}
	//implement join pls
	var search_appointment='Select * from appointment where user_id='+mysql.escape(user_id)+';';
	console.log(search_appointment);
	getConnection(function(err,connection){
		console.log("get connection");
		if(err){
			//console.log(err);
			connection.release();
			//throw err;
			callback({"msg":"Connection not established!"},null);
		}
		else{
			console.log("established");
			connection.query(search_appointment,function(err,rows,cols){
				console.log("Search appointment");
			if(err){
				console.log("Error Searching appointment");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
			else{
				console.log("Rows Length : "+rows.length);
				if(rows.length>0){
					console.log("Appointment Found");
                    connection.release();
                    var data_array=new Array();
                    for(i=0;i<rows.length;i++){
                        var date=rows[i].app_date;
                        date=date.toString();

                        data_array.push({
                            "app_date":date,
		                    "user_id":rows[i].user_id,
                            "patient_name":rows[i].patient_name,
                            "patient_age":rows[i].patient_age,
                            "patient_gender":rows[i].patient_gender,
                            "patient_contact":rows[i].patient_contact,
                            "patient_email":rows[i].patient_email,
                            "doc_id":rows[i].doc_id,
                            "payment_status":rows[i].payment_status
                        });
                    }
					var send_data={"success":true,"data":data_array};
				    callback(null,send_data);
				}
				else{
					connection.release();
                    console.log("Appointment Not Found");
                    callback({"success":false,"msg":"No Appointment found","data":[]},null);
				}
			}
		});
		}
	});
}

var getAppointmentSlots=function(data,cb){

	var apikey=data.apikey;
	var startdate=data.start_date;
	var enddate=data.end_date;
	var doc_id=data.doc_id;

	var date1=new Date(startdate);
	var mstart_date=moment(date1).format('YYYY-MM-DD');

	var date2=new Date(enddate);
	var mend_date=moment(date2).format('YYYY-MM-DD');





	var search_slot='Select app_date,GROUP_CONCAT(app_time) as app_time from appointment where doc_id='+mysql.escape(doc_id)+" and ( app_date BETWEEN "+mysql.escape(mstart_date)+" and "+mysql.escape(mend_date)+" ) GROUP BY app_date";
	var search_api='Select auth_key from user_auth where auth_key='+mysql.escape(apikey);

	
	//console.log(search_api);
	//console.log(search_slot);

	getConnection(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":"Connection Error"},null);
		}
		else{
			conn.query(search_api,function(err,rows){
				if(err){
						cb({"success":false,"msg":"Connection Error"},null);
				}
				else{
					if(rows.length>0){
								conn.query(search_slot,function(err,rows){
									if(err){
										cb({"success":false,"msg":"Connection Error"},null);
									}
									else{
										var data_arr=new Array();
										for (var i = 0; i < rows.length; i++) {
											var date=new Date(rows[i].app_date);
											var newdate=moment(date).format('ddd, DD MMM YYYY');
											var app_times=rows[i].app_time.split(',');
											//console.log(app_times);
										
											//console.log(rows[0].app_date+" "+app_times[0]);
											
												//app_times[i]=newtime;
											//console.log(newtime);
											//console.log(app_times.length);
											for (var j = 0; j < app_times.length; j++) {
												var dd=new Date(newdate+" "+app_times[j]);
												var newtime=moment(dd).format('h:mm a');
												app_times[j]=newtime.toUpperCase();
												
											}
											data_arr.push({
												"app_date":newdate,
												"app_time":app_times
											});
										}

										conn.release();
										cb(null,{"success":true,"data":data_arr});

									}
								});
					}
					else{
						conn.release();
						cb({"success":false,"msg":"Invalid API Key SignOut and try again"},null);	
					}
				}
			});
			
		}
	});

}


var getOpdCounter=function(data,cb){
	var doc_id=data.doc_id;
	var dd=new Date();
	var daten=moment(dd).format('YYYY-MM-DD');

	var search_query='Select opd_token from opd_entery where opd_doctorid='+mysql.escape(doc_id)+" and opd_date="+mysql.escape(daten);
	
	var max_token_query='Select max(opd_token) as opd_token from opd_entery where opd_doctorid='+mysql.escape(doc_id)+" and opd_date="+mysql.escape(daten);
	
	console.log(search_query);
	console.log(max_token_query);

	getConnection(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":"Connection Error"},null);
		}
		else{
			console.log("connected");
			conn.query(search_query,function(err,rows){
				if(err){
					console.log(err);
					conn.release();
						cb({"success":false,"msg":"Connection Error"},null);
				}
				else{
					if(rows.length>0){
						console.log(rows);
						conn.query(max_token_query,function(err,ressp){
							if(err){
								console.log("error2");
								conn.release();
								cb({"success":false,"msg":"Connection Error"},null);
							}
							else{
								console.log(ressp);
								var datacb={
									"success":true,
									"opd_token":ressp[0].opd_token
								};
								conn.release();
								cb(null,datacb);

							}
						});		
					}
					else{
						var datacb={
									"success":true,
									"opd_token":1
								};
								conn.release();
								cb(null,datacb);

					}
				}
			});
			
		}
	});

}


var updateCounter=function(req,cb){
	var opd_id=req.body.opd_id;
	var doc_id=req.body.doc_id;
	var patient_id=req.body.patient_id;
	var doc_name=req.body.doc_name;
	var patient_name=req.body.patient_name;
	var spec=req.body.spec;
	var opd_token=req.body.opd_token;

	var dd=new Date();
	var daten=moment(dd).format('YYYY-MM-DD');


	var insert_query='INSERT INTO opd_entery (p_id, p_name, opd_doctor, opd_doctorid, opd_date, opd_symptom, opd_prescription, opd_token, opd_diseasestype, opd_type, opd_refferal, opd_charge, opd_entry_user, opd_entry_time,opd_text1,opd_text2,opd_text3) VALUES('+mysql.escape(patient_id)+', '+mysql.escape(patient_name)+', '+mysql.escape(doc_name)+', '+mysql.escape(doc_id)+', '+mysql.escape(daten)+','+"'',NULL"+', '+mysql.escape(opd_token)+", 'VIBHA DR', 'Re-Attendance', '', '20', '', '12:18:11 PM', '', '', '')"
	//console.log(insert_query);

	var max_token_query='Select max(opd_token) as opd_token from opd_entery where opd_doctorid='+mysql.escape(doc_id)+" and opd_date="+mysql.escape(daten);
	



	getConnection(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":"Connection Error"+err},null);
		}
		else{
			conn.query(insert_query,function(err,rows){
				if(err){
					conn.release();
					cb({"success":false,"msg":"Connection Error "+err},null);
				}
				else{
					//conn.release();
					//cb(null,{"result":{"success":true,"msg":"opd update successfully"},"counter":{"token":opd_token,"doc_id":doc_id,"date":daten}});
					conn.query(max_token_query,function(err,rowss){
						if(err){
							conn.release();
							cb({"success":false,"msg":"Connection Error "+err},null);

						}
						else{
							conn.release();
							opd_token=rowss[0].opd_token;
							cb(null,{"result":{"success":true,"msg":"opd update successfully"},"counter":{"token":opd_token,"doc_id":doc_id,"date":daten}});
					
						}
					});
				}
			});
			
		}
	});
}

module.exports={
    bookappointment:bookappointment,
    getappointment:getappointment,
    getAppointmentSlots:getAppointmentSlots,
    getOpdCounter:getOpdCounter,
    updateCounter:updateCounter
}

