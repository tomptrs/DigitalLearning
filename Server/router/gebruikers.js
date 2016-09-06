var express = require('express');
var router = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : '',
   password : '',
   database : ''
 });
 
 

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : '',
  password : '',
  database : ''
});



//Users Database:

gebruikers =[
        {
            nr:"1",
            email:"tom",
            type:"leraar",
            paswoord:"tom"
        
        },
        {
             nr:"2",
            email:"mieke",
            type:"leraar",
            paswoord:"mieke"
        }
    ];

// middleware specific to this router
router.use(function timeLog(req, res, next) {
   // console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function (req, res) {
    res.send('gebruikers');
});
// define the about route
router.get('/about', function (req, res) {
    res.send('About gebruikers');
});

router.post('/post', function (req, res) {
    console.log("post gebruiker");
    console.log(req.body.gebruikersnaam);
    console.log(req.body.paswoord);
    
    /*
    Check gebruikersnaam & paswoord in database
    */
    res.send(true);
});


router.post("/signup",function(req,res,next){
    
    var voornaam = req.body.voornaam;
    var achternaam = req.body.achternaam;
    var email = req.body.email;
    var pwd = req.body.paswoord;
    
    /*
    
 Volledige teksten	
Id
Email
Paswoord
Voornaam
Achternaam



    */
     pool.getConnection(function(err, connection) {
         
         var sql = "insert into users(Email,Paswoord,Voornaam,Achternaam) values('"+email + "','"+pwd+"','"+voornaam+"','"+achternaam+"')";
         
         console.log(sql);
         connection.query(sql,function(err,rows,fields){
             
             if (!err){
            console.log('insert ok');
            
             connection.release();
            
        }
        else
            console.log('Error while performing new user.');
             console.log(err);
             
         });
         
         
         
     });
    
});


router.post('/InlogLeerling', function(req, res, next) {

    var code = req.body.code;
     console.log(req.body);
    pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)

    connection.query('SELECT * from les where Code = "' + code + '"', function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection
        
        if (!err){
            console.log('The solution is: ', rows);
            if(rows.length == 0){
                    // TODO: redirect to Login  
                 connection.release();
                return res.json({ "les":"foutieve les!!" });
            }
             connection.release();
             return res.json({ "les":rows });
        }
        else
            console.log('Error while performing Query.');
        });
        
        
      //  connection.release();
        
        });
    
});


 router.post('/InlogLeraar', function(req, res, next) {
            if (!req.body.email || !req.body.password) { //TODO: check at client side!
                return res.json({ error: 'Email and Password required' });
            }
     
     /*
     TODO: CHECK IN MYSQL DB
     */
        var email = req.body.email;
        var pwd = req.body.password;
       // var q = 'SELECT * from users where Email = "' + email + '" and Paswoord = "' + pwd +'"';
        //console.log(q);
       console.log(pool);
    
     pool.getConnection(function(err, connection) {
       
     console.log(connection);
     connection.query('SELECT * from users where Email = "' + email + '" and Paswoord = "' + pwd +'"', function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection
        
        if (!err){
            console.log('The solution is: ', rows);
            if(rows.length == 0){
                    // TODO: redirect to Login            
                 connection.release();
                return res.json({ redirect: '/login' });
            }
            else{
             connection.release();
             return res.json({ redirect: '/lesdashboard', data:rows });
            }
        }
        else
            console.log('Error while performing Query.');
        });
         
        // connection.release();
     
      });
     
          /*  passport.authenticate('local-login', function(err, leerkracht, info) {
                if (err) {
                    return res.json(err);
                }
                if (leerkracht.error) {
                    return res.json({ error: leerkracht.error });
                }
                req.logIn(leerkracht, function(err) {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json({ redirect: '/BeheerLessen' });
                });
            })(req, res);*/
            
     
        //return res.json({ redirect: '/BeheerLessen' });
          });

module.exports = router;
