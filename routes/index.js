var express = require('express');
var router = express.Router();
//var passport=require('.././auth/generatetoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/adddoctor',function(req,res){
	res.render('adddoctor');
});


router.get('/updateopd',function(req,res){
	res.render('updatecount');
});

module.exports = router;
