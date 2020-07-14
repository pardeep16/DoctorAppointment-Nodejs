
var db=require('./db');
var mysql=require('mysql');
var addnewDoct=function(req,cb){
	
	var name=req.body.name;
	var uname=req.body.username;
	var pass=req.body.password;
	var spec=req.body.spec;
	var room=req.body.room;
	var active=req.body.active;
	var disc=req.body.discount;

var insertd='Insert into doctor_detail(doc_name,doc_username,doc_password,doc_specialization,doc_opdroom,doc_active,doctor_discount) values('+mysql.escape(name)+","+mysql.escape(uname)+","+mysql.escape(pass)+","+mysql.escape(spec)+","+mysql.escape(room)+","+mysql.escape(active)+","+mysql.escape(disc)+")";
	
	console.log(insertd);

	db(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":"Connection Error"},null);
		}
		else{
			conn.query(insertd,function(err,rows){
				if(err){
					cb("failed err :"+err,null);
				}
				else{
					cb(null,"success");
				}
			});
			
		}
	});

}

module.exports={
	addnewDoct:addnewDoct
}