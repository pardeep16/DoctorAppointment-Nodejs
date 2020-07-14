/*
*/

var getConnection=require('./db');
var mysql=require('mysql');

var getPatientsProfile=function(data,cb) {
	// body...

	var auth_key=data.apikey;
	var phone=data.phone;

	var search_patient='Select user_id from user_auth where auth_key='+mysql.escape(auth_key);
	var select_patient='Select * from patient_detail where p_telephone='+mysql.escape(phone);

	console.log(select_patient);

	 getConnection(function(err,connection){
		console.log("get connection");
		if(err){
			//console.log(err);
			connection.release();
			//throw err;
			cb({"status":false,"msg":"Connection not established!"},null);
		}

		else{
			//console.log("established");
			connection.query(search_patient,function(err,rows,cols){
				//console.log("Search Patient");
			if(err){
				connection.release();
			//throw err;
				cb({"status":false,"msg":"Connection not established!"},null);
			}
			else{
				console.log("Rows Length : "+rows.length);
                //uid=rows[0].user_id;
				if(rows.length>0){
					console.log("Select Patient");
					connection.query(select_patient,function(err,rowss){
						if(err){
							connection.release();
							cb({"status":false,"msg":err},null);
						}
						else{
							var profile=new Array();
							for(var i=0;i<rowss.length;i++){
								profile.push({
									"p_id":rowss[i].pid1,
									"p_name":rowss[i].p_name,
									"p_age":rowss[i].p_age,
									"p_telephone":rowss[i].p_telephone,
									"p_sex":rowss[i].p_sex
								});
							}
							connection.release();
							cb(null,{"status":true,"data":profile,"total":profile.length});
						}
					});
				}
				else{
					connection.release();
					cb({"status":false,"msg":"Invalid Apikey or phone"},null);
				}
			}
		});
		}
	});
}


module.exports={
	getPatientsProfile:getPatientsProfile
}