

var testm=require('.././models/testmod');

var adddoctor=function(req,res){
	testm.addnewDoct(req,function(err,resu){
		if(err){
			res.send(err);
		}
		else{
			res.send(resu);
		}
	});
}

module.exports={
	adddoctor:adddoctor
}