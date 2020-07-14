/*
author : Gurwinder Singh
*/

var getConnection=require('./db');
var mysql=require('mysql');
var jwt_simple=require('jwt-simple');
var crypto=require('crypto');
var tokens=require('.././auth/secure');

var patientdetails=function (data,callback) {
    var uid;
	var auth_key=data.auth_key;
    console.log(auth_key);
	if(!auth_key){
		callback({"success":false,"msg":"Invalid Request"},null);
		return;
	}
	var search_patient='Select user_id from user_auth where auth_key='+mysql.escape(auth_key);
	var select_patient='Select * from patient_detail where pid1='+mysql.escape(uid);
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
			connection.query(search_patient,function(err,rows,cols){
				console.log("Search Patient");
			if(err){
				console.log("Error Searching Patient");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
			else{
				console.log("Rows Length : "+rows.length);
                uid=rows[0].user_id;
				if(rows.length>0){
					console.log("Select Patient");
					connection.query(select_patient,function(err,rows){
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
							console.log("Found Patient");
							/*var send_data={"success":true,"msg":"Welcome "+rows[0].p_name,"data":{
								"pid1":rows[0].pid1,
								"pid2":rows[0].pid2,
								"p_name":rows[0].p_name,
								"p_agetype":rows[0].p_agetype,
								"p_age":rows[0].p_age
							}};*/
                            var send_data={"sucess":sucess};
							connection.release();
							callback(null,send_data);
							
						}
					});
				}
			}
		});
		}
	});
}

module.exports={
	patientdetails:patientdetails
}