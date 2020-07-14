var mysql=require('mysql');

var pool=mysql.createPool({
	host	: process.env.DB_URL,
	user	:  process.env.DB_USER,
    // Use own credentials pls
//	password	: 'acedata@mysql',
    password : process.env.DB_SECURE_KEY,
	database	: process.env.DB_SCHEMA

});

var getConnection = function (cb) {
    //console.log(pool);
    pool.getConnection(function (err, connection) {

        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        console.log("DB URL ",process.env.DB_URL);
        if(err) {
            console.log(err);
          return cb(err);
        }
        console.log("DB connected successfully!");
        cb(null, connection);
    });
};

module.exports=getConnection;
