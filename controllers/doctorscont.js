

/*

Author :- Pardeep Kumar

*/
var doctorsmodel=require('.././models/doctorsmodel.js');

var getDoctors=function(req,res,next){
//	var url=decodeURL(req.query);
	//console.log(req.query);
//	var urr=decodeURI(req.query);
//	console.log(urr.category);
	var doct_spec=req.query.category;
	var apikey=req.query.apikey;
	var data={
		"doct_spec":doct_spec,
		"apikey":apikey
	}
	
//	console.log(data);
	doctorsmodel.getDoctorsList(data,function(err,results){
		if(err){
			res.send(err);
		}
		else{
			res.send(results);
		}
	});


}

var getDepartmentList=function(req,res){
	doctorsmodel.getDepartments(function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

module.exports={
	getDoctors:getDoctors,
	getDepartmentList:getDepartmentList
}

