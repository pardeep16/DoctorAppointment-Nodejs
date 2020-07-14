
var db=require('./db');
var mysql=require('mysql');
var getDoctorsList=function(data,cb){
	var apikey=data.apikey;
	var spec_doct=data.doct_spec;
	var doct_spec=spec_doct;
	doct_spec=doct_spec.toLowerCase().toString();
	
	console.log(data);

	var select_doctors='Select * from doctor_detail where LOWER(doc_specialization)='+mysql.escape(doct_spec);
	var search_api='Select auth_key from user_auth where auth_key='+mysql.escape(apikey);

	console.log(select_doctors);
	console.log(search_api);

	db(function(err,conn){
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
								conn.query(select_doctors,function(err,rows){
									if(err){
										conn.release();
										cb({"success":false,"msg":"Connection Error"},null);
									}
									else{
										var datadoc=new Array();
										if(rows.length>0){
											for(var i=0;i<rows.length;i++){
												datadoc.push({"doc_id":rows[i].doc_id,"doc_name":rows[i].doc_name,"doc_active":rows[i].doc_active});
											}
											conn.release();
											if(rows.length==1){
												cb(null,{"success":true,"msg":rows.length+" doctor Available","data":datadoc});
											}
											else{
												cb(null,{"success":true,"msg":rows.length+" doctors Available","data":datadoc});
											}		
						
										}
										else{	
											conn.release();
											cb({"success":false,"msg":"No doctors Found"},null);
										}
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


var getDepartments=function(cb){


	var search_dept='select Distinct(doc_specialization)  from doctor_detail';

	db(function(err,conn){
		if(err){
			conn.release();
			cb({"success":false,"msg":"Connection Error"},null);
		}
		else{
			conn.query(search_dept,function(err,rows){
				if(err){
					cb({"success":false,"msg":"Connection Error"},null);
				}
				else{
					var dataArr=new Array();
					if(rows.length>0){
						for(var i=0;i<rows.length;i++){
							dataArr.push(rows[i].doc_specialization);
						}
						conn.release();
						cb(null,{"success":true,"data":dataArr});
					}
					else{
						cb(null,{"success":true,"data":dataArr});
					}
				}
			});
		}
	});

}

module.exports={
	getDoctorsList:getDoctorsList,
	getDepartments:getDepartments

}

