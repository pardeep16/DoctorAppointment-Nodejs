var nodemailer=require('nodemailer');

var sendmail=function(req,res,next){
	var transporter=nodemailer.createTransport({
		service : "smtp.freeolamail.net",
		host : 587,
		secure : false,
		auth:{
			/*user : 'retail.store91@gmail.com',
			pass : 'shivanshugoel91@'*/
			user : 'developer.aceapp@gmail.com',
			pass : 'developer2313016@'
		}

	});


	var text='hii welcome to trackfit'+"\n";
	var mailOption="";

	transporter.sendMail(mailOption,function(err,info){
		if(err){
			console.log(err);
			res.status(200).json({res:err,success:false});
		}
		else{
			res.status(200).json({res:info,success:true});
		}

	});

}

module.exports={
	sendmail:sendmail
}