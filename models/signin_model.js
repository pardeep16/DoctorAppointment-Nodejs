/*

author : Pardeep Kumar

*/

var getConnection=require('./db');
var mysql=require('mysql');
var jwt_simple=require('jwt-simple');
var crypto=require('crypto');
var tokens=require('.././auth/secure');

var onSignInWithMobile=function (data,callback) {
	// body...
	var mobileno=data.mobileno;

	if(!mobileno){
		callback({"success":false,"msg":"Invalid Request"},null);
		return;
	}

	var search_mobile='Select user_phone from user_login where user_phone='+mysql.escape(mobileno);
	var create_user='Insert into user_login(user_phone) values('+mysql.escape(mobileno)+")";
	var select_user='Select u.*,a.auth_key,a.user_tel_verify from user_login u,user_auth a where u.user_id=a.user_id and u.user_phone='+mysql.escape(mobileno);
	console.log(search_mobile);
	console.log(create_user);
	console.log(select_user);

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
			connection.query(search_mobile,function(err,rows,cols){
				console.log("Search mobile");
			if(err){
				console.log("Error Searching Mobile");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
			else{
				console.log("Rows Length : "+rows.length);
				if(rows.length>0){
					console.log("Select User");
					connection.query(select_user,function(err,rows){
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
							console.log("Found User");
							if(rows[0].user_tel_verify==1){
								var send_data={"success":true,"msg":"Welcome "+rows[0].user_phone,"data":{
								"phone":rows[0].user_phone,
								"apikey":rows[0].auth_key,
								"userid":rows[0].user_id,
								"name":rows[0].user_name,
								"emailid":rows[0].user_email
							}};
							connection.release();
							callback(null,send_data);
							}
							else{
								connection.release();
								callback({"success":false,"msg":"mobile not verified"},null);
							}
							
						}
					});
				}
				else{
					connection.query(create_user,function(err,resu){
						console.log("Creating User");
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
							var secret=tokens.secret;
							console.log(secret);
							var payload={
								"iss":mobileno
							}
							var api_token=jwt_simple.encode(payload,secret);
							console.log(api_token);
							var split_token=api_token.split('.');
							console.log(split_token[2]);
							connection.query('Select * from user_login where user_phone='+"'"+mobileno+"'",function (err,rowss) {
								// body...

								if(err){
										console.log(err);
										connection.release();
										callback({"success":false,"msg":err},null);
								}

								else{
									console.log("insert");
									//console.log(rowss);
									var querr='Insert into user_auth(auth_key,user_id,user_tel_verify) values('+"'"+split_token[2]+"'"+","+rowss[0].user_id+","+1+")";
									console.log(querr);
									connection.query(querr,function(err,resuu){
										if(err){
											connection.release();
											callback({"success":false,"msg":err},null);	
										}
										else{
											connection.release();
											var send_data={"success":true,"msg":"Welcome "+rowss[0].user_phone,"data":{
											"phone":rowss[0].user_phone,
											"apikey":split_token[2],
											"userid":rowss[0].user_id,
											"name":rowss[0].user_name,
											"emailid":rowss[0].user_email
											}};
											callback(null,send_data);
										}
									});
								}
							});
						}
					});
				}
			}
		});
		}
	});
}


var onSignInWithGmail=function (data,callback) {
	// body...
	var emailid=data.emailid;
	var gmail_token=data.gmail_token;
	var name=data.name;

	var search_emailid='Select user_email,user_gmail_token from user_login where user_email='+mysql.escape(emailid)+" and user_gmail_token="+mysql.escape(gmail_token);
	var create_user='Insert into user_login(user_name,user_email,user_gmail_token) values('+"'"+name+"'"+","+"'"+emailid+"'"+","+"'"+gmail_token+"'"+")";
	var select_user='Select u.*,a.auth_key from user_login u,user_auth a where u.user_id=a.user_id and u.user_email='+mysql.escape(emailid)+" and user_gmail_token="+mysql.escape(gmail_token);
	console.log(search_emailid);
	console.log(create_user);
	console.log(select_user);

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
			connection.query(search_emailid,function(err,rows,cols){
			if(err){
				//console.log("errr");
				connection.release();
				callback({"success":false,"msg":err},null);
			}
			else{
				if(rows.length>0){
					connection.query(select_user,function(err,rows){
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
							
							var send_data={"success":true,"msg":"Welcome "+rows[0].user_name,"data":{
								"name":rows[0].user_name,
								"emailid":rows[0].user_email,
								"gmail_token":rows[0].user_gmail_token,
								"phone":rows[0].user_phone,
								"apikey":rows[0].auth_key,
								"userid":rows[0].user_id
							}};
							connection.release();
							callback(null,send_data);
						}
					});
				}
				else{
					connection.query(create_user,function(err,resu){
						if(err){
							connection.release();
							callback({"success":false,"msg":err},null);
						}
						else{
							var secret=tokens.secret;
							//console.log(secret);
							var payload={
								"iss":emailid+gmail_token
							}
							var api_token=jwt_simple.encode(payload,secret);
							//console.log(api_token);
							var split_token=api_token.split('.');
							//console.log(split_token[2]);
							connection.query('Select * from user_login where user_email='+"'"+emailid+"'"+" and user_gmail_token="+"'"+gmail_token+"'",function (err,rowss) {
								// body...

								if(err){
										//console.log(err);
										connection.release();
										callback({"success":false,"msg":err},null);
								}

								else{
									//console.log("insert");
									//console.log(rowss);
									var querr='Insert into user_auth(auth_key,user_id) values('+"'"+split_token[2]+"'"+","+rowss[0].user_id+")";
									//console.log(querr);
									connection.query(querr,function(err,resuu){
										if(err){
											connection.release();
											callback({"success":false,"msg":err},null);	
										}
										else{
											connection.release();
											var send_data={"success":true,"msg":"Welcome "+rowss[0].user_name,"data":{
											"name":rowss[0].user_name,
											"emailid":rowss[0].user_email,
											"gmail_token":rowss[0].user_gmail_token,
											"phone":rowss[0].user_phone,
											"apikey":split_token[2],
											"userid":rowss[0].user_id
											}};
											callback(null,send_data);
										}
									});
								}
							});
						}
					});

				}
			}
		});

		}
			});


}


var addNumberModel=function(data,cb){
		var apikey=data.apikey;
		var user_id=data.user_id;
		var phone=data.phone;

		var insertMob='Update user_login SET user_phone='+mysql.escape(phone)+" where user_id="+mysql.escape(user_id);
	getConnection(function(err,connection){
		console.log("get connection");
		if(err){
			//console.log(err);
			connection.release();
			//throw err;
			cb({"msg":"Connection not established!"},null);
		}

		else{
			console.log("established");
			connection.query(insertMob,function(err,rows,cols){
				console.log("Search mobile");
			if(err){
				console.log("Error Searching Mobile");
				connection.release();
				cb({"success":false,"msg":err},null);
			}
			else{
				connection.query('Update user_auth SET user_tel_verify=1 where user_id='+mysql.escape(user_id),function (argument) {
					// body...
					if(err){
						cb({"success":false,"msg":err},null);
					}
					else{
						cb(null,{"success":true,"msg":"Successfully Updated","data":{"phone":phone,"login_id":user_id}});
					}
				});
				}
			});
		}
		});
		

}

module.exports={
	onSignInWithMobile:onSignInWithMobile,
	onSignInWithGmail:onSignInWithGmail,
	addNumberModel:addNumberModel
}
