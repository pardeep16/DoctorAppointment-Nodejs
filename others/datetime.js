var  date=require('date-and-time');
var moment=require('moment');

//console.log(date.parse('26 Jun 2017','YYYY MMM D'));
//var date=new Date('2017-06-28');
/*var daten=moment(date).format('DD MMM YYYY A');
console.log(daten);

console.log("***********");
console.log(moment().format('DD MMM YYYY'))*/
/*var newdate=moment(date).format('DD MMM YYYY')
console.log(newdate);*/

/*var ttime=newdate+' 10:30:00';
var dd=new Date(ttime);
var nnewtime=moment(dd).format('h:mm a');
console.log(ttime);
console.log(nnewtime.toUpperCase());*/

var dd=new Date();
console.log("today date");

var newdd=moment(dd).format('h:mm:ss a');
console.log(newdd);

/*var jwt_simple=require('jwt-simple');
var api_token=jwt_simple.encode("payload","secret");
console.log(api_token);*/

/*var token="pKG78js-0yYV-cprATxPFNgBvheJUucZ8x3cg4v89EM";
var len=0;
for(var i=0;i<token.length;i++){
	len++;
}

console.log("length :"+len);*/

