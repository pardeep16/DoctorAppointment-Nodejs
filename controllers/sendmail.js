var nodemailer=require('nodemailer');


var sendMail=function(data) {
	// body...
	console.log(data);
	var name=data.name;
	var email=data.email;
	var phone=data.phone;
	var opd_token=data.opd_token;
	var payment_status=data,payment_status;
	var payment_id=data.payment_id;
	var doc_name=data.doc_name;
	var date=data.date;
	var timemail=data.timemail;
	var pay_status="";

	if(payment_status==true){
		pay_status="Accepted";
	}
	else{
		pay_status="Declined";
	}

	var mailOption={
		from : 'Support@rotaryambala',
		to : email,
		cc : "pk.raswant@gmail.com,developer.aceapp@gmail.com",
		subject : "Opd Online:-"+timemail+" "+name,
		/*html : '<html><title></title>'+msg+'<body><script type="text/javascript" src="https://code.jquery.com/jquery-3.1.0.min.js" ></script>'+
		'<form action="http://aceapp-pardeep16.rhcloud.com/"><button id="download">Download App</button></form>'+'</body></html>'*/
		/*html : '<html><title></title><script type="text/javascript" src="https://code.jquery.com/jquery-3.1.0.min.js" ></script><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">'+message+'<body>'+
		'<a href="http://aceapp-pardeep16.rhcloud.com/"><button style="background-color:;border: none;color: white;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;padding:10px;">Download App</button></a>'+'</body></html>'
*/
		html :"Hi please check your Opd Details."+'<br>'+
		"Doctor :"+doc_name+"<br>"+
		'Patient Details:<br><br>'+
		'Name :'+name+" <br>"+
		"Opd Token: "+opd_token+" <br>"+
		"Date :"+date+" <br>"+
		"Payment :"+pay_status+" <br><br>"+
		"<b>Thanks <br>Rotary Ambala<br> For any query send a mail to Support@rotaryambala.com<b>"


	};


	var transporter=nodemailer.createTransport({
		service : "gmail",
		auth:{
			
			user : 'developer.aceapp@gmail.com',
			pass : 'developer2313016@pardeep'
		}

	});


	//var text='Hi'+"\n";
	//var mailOption="";

	transporter.sendMail(mailOption,function(err,info){
		if(err){
			console.log(err);
			//res.status(200).json({res:err,success:false});
		}
		else{
			console.log(info);
			//res.status(200).json({res:info,success:true});
		}

	});
}

var sendTempMail=function(data){
	var date=new Date();

	var mailOption={
		from : 'Support@rotaryambala',
		to : data.email,
		cc : "developer.aceapp@gmail.com",
		subject : "Opd Online:-"+"response "+date.getTime(),
		/*html : '<html><title></title>'+msg+'<body><script type="text/javascript" src="https://code.jquery.com/jquery-3.1.0.min.js" ></script>'+
		'<form action="http://aceapp-pardeep16.rhcloud.com/"><button id="download">Download App</button></form>'+'</body></html>'*/
		/*html : '<html><title></title><script type="text/javascript" src="https://code.jquery.com/jquery-3.1.0.min.js" ></script><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">'+message+'<body>'+
		'<a href="http://aceapp-pardeep16.rhcloud.com/"><button style="background-color:;border: none;color: white;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;padding:10px;">Download App</button></a>'+'</body></html>'
*/
		html :"Hi "+'<br>'+
		data.msg+"<br><br>"+
		"<b>Thanks <br>Rotary Ambala<br> For any query send a mail to Support@rotaryambala.com<b>"


	};


	var transporter=nodemailer.createTransport({
		service : "gmail",
		auth:{
			
			user : 'developer.aceapp@gmail.com',
			pass : 'developer2313016@pardeep'
		}

	});


	//var text='Hi'+"\n";
	//var mailOption="";

	transporter.sendMail(mailOption,function(err,info){
		if(err){
			console.log(err);
			//res.status(200).json({res:err,success:false});
		}
		else{
			console.log(info);
			//res.status(200).json({res:info,success:true});
		}

	});
}

module.exports={
	sendMail:sendMail,
	sendTempMail:sendTempMail
}