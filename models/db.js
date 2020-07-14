var mysql=require('mysql');

var pool=mysql.createPool({
	host	: '127.0.0.1',
	user	:  'root',
    // Use own credentials pls
//	password	: 'acedata@mysql',
    password : 'pardeep16mysql@',
	database	: 'hospital_db'

});

var getConnection = function (cb) {
    //console.log(pool);
    pool.getConnection(function (err, connection) {

        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        if(err) {
            //console.log(err);
          return cb(err);
        }
        cb(null, connection);
    });
};

module.exports=getConnection;
