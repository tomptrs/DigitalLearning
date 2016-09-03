/*
*
* 2/6/2016 - Tom Peeters
*
*/

var express = require('express');
var router = express.Router();
var fs      = require('fs');
var fse = require('fs-extra');

var mysql      = require('mysql');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'digitaalleren'
 });




var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitaalleren'
});



//TEMP DATABASE
vragen =[
        {
            nr:"1",
            vraag:"Wat is je naam?",
            type:"open",
            beschikbaar:false,
            antwoorden:[]
        
        },
        {
            nr:"2",
            vraag:"Welk huisdier heb je?",
            type:"cloud",
            beschikbaar:false,
            antwoorden:[]
        },
        {
            nr:"3",
            vraag:"Hoe oud ben je?",
            type:"open",
            beschikbaar:false,
            antwoorden:[]
        }
    ];

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now());
    next();
});

// define the home page route
router.get('/', function (req, res) {
    res.send('lessen');
});

/// Controleer of we naar de volgende vraag mogen gaan
router.post('/GetAlleLessen', function (req, res) {

    //TODO: get lessen van MySQL db
    var userId = req.body.userId;
    
     pool.getConnection(function(err, connection) {
    
        connection.query('SELECT * from les where UserId = "' + userId + '"', function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection
        
        if (!err){
            console.log('The solution is: ', rows);
             connection.release();
            return res.json(rows); //Send Lessen
           
        }
        else
            console.log('Error while performing Query.');
            connection.release();
        });
         
         // connection.release();
     });
    
    
   /* lessen = [
            {
                id: "1",
                naam : "Les 1"
            },
            {
                id: "2",
                naam : "Les 2"
            },
            {
                id: "3",
                naam : "Les 3"
            }
    ];*/
    
  //  console.log(lessen);
  // res.json(lessen);
    
    
});

//Geef les door
router.post("/StartLes",function(req,res){
    //get LES ID
    var id = req.body.id;
    console.log(id);
   // console.log('SELECT * from vraag  where LesId = ' + id );
   
    //Get vragen van Mysql
    pool.getConnection(function(err, connection) {
    //Update Les: maak active true!
        connection.query("update les set active = true where Id = " + id , function(err,rows,fields){
             if (!err){
            
                console.log('les updated'); 
                connection.query('SELECT * from les where Id =' + id, function(err, rows, fields) {
             
                    if (!err){
           
                        connection.release();
                        return res.json({"active":"success","les":rows}); //Send active les to client           
                    }
                
                    else{
                        console.log('Error while performing Query.');
                        connection.release();
                    }
            });
        }
        else{
            console.log('Error while performing Update Query.');
             connection.release();
        }
        });
        
        // connection.release();
    });
    
    
   // res.json(vragen);
});

router.post("/GetAantalVragenVanLes",function(req,res){
            
            console.log("GET Aantal vragen van les");

            var lesId = req.body.id;

            pool.getConnection(function(err,connection){
                
                var query = "select count(*) as aantal from vraag where LesId = " + lesId;
                connection.query(query,function(err,rows,fields){
                    if(!err){
                        connection.release();
                        return res.json({"vragen":rows});
                    }
                    else{
                        connection.release();
                        return res.json({"error":"error aantal vragen per les"});
                    }
                });
           

            });
});


///Get alle vragen van een les , aangevraagd door de leraar bij het aanmaken van nieuwe vragen!
router.post("/GetVragenVanLes",function(req,res){
   
    console.log("Get vraag van current les HIER HAAL IK VRAAG OP !!");
    //TODO: vorige getoonde vraag onbeschikbaar maken!
    
    //get LES ID
    
    var lesId = req.body.id;
    console.log(lesId);
    
    //Get vragen van mysql db
     pool.getConnection(function(err, connection) {
         //SELECT * from vraag, bijvraag where LesId =' + lesId + 'and bijvraag.VraagId = Id
//SELECT * FROM vraag left outer join bijvraag on vraag.Id = bijvraag.VraagId WHERE LesId = 122
    connection.query('SELECT vraag.Id, vraag.Stelling as VraagStelling, vraag.LesId, vraag.VraagNummer, vraag.Active, vraag.TypeId, bijvraag.BijVraagId, bijvraag.VraagId, bijvraag.Stelling as BijvraagStelling FROM vraag left outer join bijvraag on vraag.Id = bijvraag.VraagId WHERE LesId =' + lesId, function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
            
             connection.release();
           // console.log('The solution is: ', rows);
            return res.json({"vragen":rows}); //Send  vraag to client
           
        }
        else
            console.log('Error while performing Query (getting alle vragen van les.');
            connection.release();
        });
         
       
     });
    
});

///Get vraag van een les (van leraar!!)
router.post("/GetVraagVanLes",function(req,res){
   
    console.log("Get vraag van current les");
    //TODO: vorige getoonde vraag onbeschikbaar maken!
    
    //get LES ID
    console.log(req.body);
    console.log("Get LES " + req.body.id);
    var lesId = req.body.id;
    //Get Vraag ID
    var vraagId = req.body.vraagId;

    
    var nummer = parseInt(req.body.vraagId);
   
    //Get vraag van mysql db
     pool.getConnection(function(err, connection) {
    
    connection.query('SELECT * from vraag where  LesId =' + lesId + ' and VraagNummer = ' + vraagId , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
            
            // connection.release();
           // console.log('The solution is: ', rows);
            console.log("GETVRAAG + TEST ROWS");
            console.log(rows);
            
            var vragen = rows;
            
        /*   if (typeof rows[0] != 'undefined'){
            
               if(rows[0].TypeId ==3){
                console.log("get bijvragen");
                    console.log("in get bijvraag" + vraagId);
                        pool.getConnection(function(err, connection) {
    
                    connection.query('SELECT * from bijvraag where  VraagId =' + rows[0].Id , function(err2, rows2, fields2) {
                                // connection.end(); // Do NOT end the connection        
                            if (!err2){
                                    console.log(rows2);
                                    connection.release();
                                    // console.log('The solution is: ', rows);
                                    return res.json({"vraag":vragen,"bijvragen":rows2}); //Send  vraag to client
                            }
                            else
                                                console.log('Error while performing Query.');
                                connection.release();
                            });
                        
         
        //  connection.release();
     }); 
           
                
                
            }
               else{
                 connection.release();
                return res.json({"vraag":rows}); //Send  vraag to client
               }
           }*/
        //    else{
                connection.release();
                return res.json({"vraag":rows}); //Send  vraag to client
        //    }
        }
        else
            console.log('Error while performing Query.');
         connection.release();
        });
         
        //  connection.release();
     });
    
});


function GetBijvragenVanVraag(vraagId){
      
    console.log("in get bijvraag" + vraagId);
    pool.getConnection(function(err, connection) {
    
    connection.query('SELECT * from bijvraag where  VraagId =' + vraagId , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
            console.log(rows);
             connection.release();
           // console.log('The solution is: ', rows);
            return rows; 
        }
        else
            console.log('Error while performing Query.');
            connection.release();
        });
         
        //  connection.release();
     }); 
}

/* Hier komt de leerling de bijvragen op halen!!!*/
router.post("/getbijvraagvanvraag",function(req,res){
    
    console.log("get bijvragen");
    var vraagId = req.body.Id;
    console.log(vraagId);
    
      pool.getConnection(function(err, connection) {
    var str = 'SELECT * from bijvraag where VraagId =' + vraagId;
       console.log(str);
        connection.query(str , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
            
           connection.release();
           // console.log('The solution is: ', rows);
            return res.json({"vraag":rows}); //Send  vraag to client
           
        }
        else{
            console.log('Error while performing Query. Get bijvragen');
            console.log(err);
            connection.release();
            }
        });
         
        
     });
    
});

///Maak vraag beschikbaar zodat vraag in UI verschijnt - docent doet dit
router.post("/MaakVraagBeschikbaar",function(req,res){
    console.log("Maak vraag beschikbaar");
  
    var id = req.body.id; //lesid
    var vraagnr = req.body.vraagId;
  
    pool.getConnection(function(err, connection) {
     
    connection.query("update vraag set Active = true where LesId = " + id + " and VraagNummer = " + vraagnr , function(err,rows,fields){
            
        if (!err){
            console.log('les updated'); 
            connection.query('SELECT * from vraag where LesId =' + id + " and VraagNummer =  " + vraagnr, function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
            if (!err){
                connection.release();            
                return res.json({"vraag":rows}); //Send active les to client
           
            }
            else{
                console.log('Error while performing select (get active vraag) Query.');
                connection.release();
            }
        });
        }
        else{
            console.log('Error while performing Update (maak vraag active) Query.');
            connection.release();
        }
        
        });
        
        
     });
    
    
});

///Maak vraag onbeschikbaar, zodat bij client een wachtscherm verschijnt of vraag inactief maken
router.post("/MaakVraagOnBeschikbaar",function(req,res){
    console.log("Maak vraag onbeschikbaar");
    
      var id = req.body.id; //lesid
    var vraagnr = req.body.vraagId;
  
    pool.getConnection(function(err, connection) {
         
     connection.query("update vraag set Active = false where LesId = " + id + " and VraagNummer = " + vraagnr , function(err,rows,fields){
             if (!err){
            console.log('les updated'); 
         connection.query('SELECT * from vraag where LesId =' + id + " and VraagNummer =  " + vraagnr, function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
           // console.log('The solution is: ', rows);
            
            connection.release();
            
            return res.json({"vraag":rows}); //Send active les to client
           
        }
        else
            console.log('Error while performing select (get active vraag) Query.');
        });
        }
        else
            console.log('Error while performing Update (maak vraag active) Query.');
        });
     });
    
});




/// Controleer of we naar de volgende vraag mogen gaan en stuur vraag door (door leerling aangeroepen!!)
router.post('/IsVraagBeschikbaar', function (req, res) {
 console.log("LEERLING");
    
    var lesId = req.body.lesId;
  // console.log(req.body);
    if(lesId != ""){
     pool.getConnection(function(err, connection) {
         
         connection.query('SELECT * from vraag where LesId =' + lesId + ' and Active = true' , function(err, rows, fields) {
     
             
            if (!err){
            
            if(rows != null){
            //console.log('The solution is: ', rows.length);
                if(rows.length>0){
                    
                    console.log("ok, een vraag gevonden");
                    console.log(rows[0]);
                    //testen of het multiple choice vraag is, indien ja gaan we bijvragen afhalen
                  
                 /*   if(rows[0].TypeId == 3){
                        
                        var vragen = rows;
                         
                        pool.getConnection(function(err2, connection2) {
    
                        connection2.query('SELECT * from bijvraag where  VraagId =' + rows[0].Id , function(err2, rows2, fields2) {
                                // connection.end(); // Do NOT end the connection        
                            if (!err2){
                                    console.log("Ik stuur ook bijvragen naar de client!!");
                                    connection2.release();                                 
                                    
                                return res.json({"vraag":vragen,"bijvragen":rows2}); //Send  vraag to client
                            }
                            else
                                console.log('Error while performing Query.');
                                connection2.release();
                                return res.json({"vraag":null});
                           
                            });
                        }); 
                      
                    } // END IF TEST TYPEID==3
                    */
                                        
                  // else// Elke andere vragen doorsturen
                   //     {
                            connection.release();
                            return res.json({"vraag":rows}); //Send  vraag to client
                     //   }
                }
                else{
                     connection.release();
                    return res.json({"vraag":null});
                }
         
            }
            else{
                console.log("geen actieve vraag..");
                connection.release();
                return res.json({"vraag":null});
            }
            
        }
             
        else{  //If ERROR
            console.log('Error while performing Query.');
            // console.log(err);
            connection.release();
            return res.json({"vraag":null});
        }
             
        }); //end first connection
     
    
    }); //end first pool
        }
    else{ //Geen les doorgestuurd
        return res.json({"error":"geen les actief!"});
        //TODO Naar leerling sturen dat er geen lesId actief is!!!
    }
    
    //Zoek vragen van code
    
});

/*router.post("/getbijvraagvanvraag",function(req,res){
    
    var Id = req.body.Id;
    console.log("get bijvraagjes");
    console.log(Id);
     pool.getConnection(function(err2, connection2) {
    
                        connection2.query('SELECT * from bijvraag where  VraagId =' + Id , function(err2, rows2, fields2) {
                                // connection.end(); // Do NOT end the connection        
                            if (!err2){
                                    console.log("Ik stuur ook bijvragen naar de client!!");
                                    connection2.release();                                 
                                    
                                return res.json({"bijvragen":rows2}); //Send  vraag to client
                            }
                            else
                                console.log('Error while performing Query.');
                                connection2.release();
                                return res.json({"vraag":null});
                           
                            });
                        }); 
});*/

///Get beschikbare vraag van de les (altijd laatst beschikbare vraag) 
router.post('/GetVraagVanLesBeschikbaar', function (req, res) {
    console.log("Hier haal ik de vraag op..");
    console.log(req.body.lesId);
    console.log(req.body.vraagId);
    var vraag = null;
    for(var i=0; i< vragen.length; i++){
        if(vragen[i].beschikbaar)
            vraag = vragen[i];
    }
    res.send(vraag);
});

router.post('/SaveAntwoord', function (req, res) {
   
    //TODO Save antwoord in database
    console.log("Save Antwoord..");
    var lesId = req.body.lesId;
    var vraagId = req.body.vraagId;
    var antwoord = req.body.antwoord;
    console.log(lesId + " " + vraagId + " " + antwoord);
    console.log(antwoord);
      pool.getConnection(function(err, connection) {
        
         console.log("save antwoord")
        var sql = "INSERT INTO antwoord(Antw, VraagId, LesId) VALUES ('"+ antwoord+"','"+ vraagId +"','"+ lesId +"')";
         connection.query(sql , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        connection.release();
        });
      });
    
  /*  console.log("save antwoord");   
    var vraagId = req.body.vraagId;
    var antwoord = req.body.antwoord;
    
    for(var i=0; i< vragen.length; i++){
        if(vragen[i].nr == vraagId){
            //save antwoord
            console.log("save antwoord :" + antwoord + " in les :" + req.body.lesId + "in vraag: " + req.body.vraagId);
            vragen[i].antwoorden.push(antwoord);
            console.log(vragen[i].antwoorden[0]);//toon gewoon het eerste antwoord
        }
    }*/
    res.send("Ok");
});

router.post('/SaveTekeningBijVraag', function (req, res) {
/*
"lesId":lesId,"vraagId":vraagId, "afb":vraagObj
*/
    console.log("saving Tekening bij vraag..");
    
    var lesId = req.body.lesId;
    var vraagId = req.body.vraagId;
    var afb = req.body.afb;
    console.log(lesId + " " + vraagId + " " + afb);
    
      pool.getConnection(function(err, connection) {
        
         console.log("save antwoord")
        var sql = "INSERT INTO antwoord(afbeelding, VraagId, LesId) VALUES ('"+ afb+"','"+ vraagId +"','"+ lesId +"')";
         connection.query(sql , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        connection.release();
        });
      });
    
});

//BewaarTekeningBijVraag

router.post('/BewaarTekeningBijVraag', function (req, res) {
/*
"lesId":lesId,"vraagId":vraagId, "afb":vraagObj
*/
    console.log("saving Tekening bij vraag..");
    
    var lesId = req.body.lesId;
    var vraagId = req.body.vraagId;
    var afb = req.body.afb;
    console.log(lesId + " " + vraagId + " " + afb);
    
    //Save image as in Directory + save image in database!
      pool.getConnection(function(err, connection) {
        
         console.log("save antwoord")
        var sql = "INSERT INTO antwoord(afbeelding, VraagId, LesId) VALUES ('"+ afb+"','"+ vraagId +"','"+ lesId +"')";
         connection.query(sql , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        connection.release();
        });
      });
    
});

 //Add Tekening Antwoord
  router.post('/addDrawing', function(req, res, next) {
           
         console.log("saving Tekening bij vraag A NEW WAY!!..");
    
        var lesId = req.body.lesId;
        var vraagId = req.body.vraagId;
        var afb = req.body.afb;
       // console.log(lesId + " " + vraagId + " " + afb);
    
            //random getal om afbeelding in op te slaan..
            
            //Stuur les door en maak een directory voor de afbeelding
            var dir = './Client/public/pics/'+lesId;

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
      
      console.log(dir);
           
            var base64Data = req.body.afb.replace(/^data:image\/png;base64,/, "");
      console.log("SAVING IMAGE!!");
     // console.log(base64Data);
      
        var r = Math.round(Math.random()*10000);
         console.log(r);

            fs.writeFile(dir+"/"+r + ".png", base64Data, 'base64', function(err) {
                console.log("in AddDrawing functino");
                console.log(err);
                });
      
                
      var imgSaved = './public/pics/'+lesId+ '/'+ r + ".png";
      console.log(imgSaved);
       pool.getConnection(function(err, connection) {
        
         console.log("save antwoord a NEW WAY")
        var sql = "INSERT INTO antwoord(afbeelding, VraagId, LesId) VALUES ('"+ imgSaved+"','"+ vraagId +"','"+ lesId +"')";
         connection.query(sql , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        connection.release();
        });
      });
      return res.json({"krak":"boem"});
    });

router.post("/getDrawings",function(req,res,next){
    
     var lesId = req.body.lesId;
     var vraagId = req.body.vraagId;
    
       pool.getConnection(function(err, connection) {
    
    connection.query('SELECT * from antwoord where LesId =' + lesId + ' and VraagId = ' + vraagId , function(err, rows, fields) {
       // connection.end(); // Do NOT end the connection        
        if (!err){
            
             connection.release();
           // console.log('The solution is: ', rows);
            return res.json({"vraag":rows}); //Send  vraag to client
           
        }
        else
            console.log('Error while performing Query.');
         connection.release();
        });
         
        //  connection.release();
     });
    
    
});


router.post("/GetAntwoorden",function(req,res){
   
    
    //todo get from database 
    var lesId = req.body.lesId;
    var vraagnr = req.body.vraagnr;
    console.log(lesId + " " + vraagnr);
     pool.getConnection(function(err, connection) {
         
     connection.query("select * from antwoord where LesId = " + lesId + " and VraagId = " + vraagnr , function(err,rows,fields){
             if (!err){
                 console.log(rows);
                 connection.release();
                return res.json({"antwoorden":rows});
             }
         else
            connection.release();
            console.log('Error while performing Update (maak vraag active) Query.');
            });
     });
    
    
    
  /*  console.log("Get Antwoorden");
    var lesId = req.body.lesId;
    var vraagId = req.body.vraagId;
    console.log("Get antwoorden van lesId :" + lesId +" + vraagId" + vraagId);
    var antwoorden = [];
    for(var i = 0; i<vragen.length; i++){
        if(vragen[i].nr == vraagId)
            {
                console.log(vragen[i].antwoorden.length);
                //TODO performanter maken: nu ga je telkens alle antwoorden terug doorsturen!!
                for(var j=0;j<vragen[i].antwoorden.length;j++){
                    antwoorden.push(vragen[i].antwoorden[j]);
                }
            }
    }
    console.log(antwoorden);
    res.json(antwoorden);*/
});

router.post("/addLes",function(req,res){
   
    
    //todo get from database 
    
    var naam = req.body.lesNaam;
    var code = req.body.code;
    var userid = req.body.userId;
    
    
    var md5 = require('md5');
      var hash = md5(req.body.lesNaam);
      var hashK = hash.substr( 0, 8 );

      
    
   console.log(naam + " " + code + " " + userid);
   pool.getConnection(function(err, connection) {
        
        var sql = "INSERT INTO les(Code, Naam, UserId,active) VALUES ('"+ hashK+"','"+ naam +"',"+ userid + ",false)";
      
     connection.query(sql, function(err,rows,fields){
             
         if (!err){
                 console.log("Les toegevoegd");
                 
                 //Haal de toegevoegde les terug af, want ik heb de lesId nodig op de client
                 
                 var sql2 = "select * from les where Code = '"+ hashK+"' and Naam = '" + naam + "'";
                 console.log(sql2);
                  connection.query(sql2, function(error,rows2,fields2){
                   
                      if (!error){
                         connection.release();
                        return res.json({"les":rows2});
                    }
                      else{
                           connection.release();
                      }
                 
                  });
                //return res.json({"les":"ok"});
             }
            else{
            connection.release();
            console.log('Error while performing Insert (add les) Query.');
            console.log(err);
            return res.json({"les":"nok"});
            }
});
     });
});

/*
router.post("addMultiVraag",function(req,res){
     var lesId = req.body.lesId;
        var obj = req.body.vraag;
   
    
    
      pool.getConnection(function(err, connection) {
          
           //TODO: Ik moet de VraagID bewaren!
        if(obj.multi != null){
                     for(var i=0;i<obj.multi.length;i++){
                     var sql2 = "insert into bijvraag(VraagId,Stelling) VALUES('"+obj.VraagNummer+"','"+obj.multi[i].Stelling+"')";
                     connection.query(sql2,function(err,rows,fields){
                         if(!err){
                             console.log("insert multi ok");
                         }
                     });
                    }
                   }// end if mulit != null
          
          
          connection.release();
          return res.json({"vraag":"insert bijvraag ok"});
          
      });
    
});
*/

//addVraag
router.post("/addVraag",function(req,res){
    
    console.log("AAADDDD VRRRAAAG");
        var lesId = req.body.lesId;
        var obj = req.body.vraag;
        var vraagErIn = false;
   
   
    /*
    obj.Stelling
    obj.TypeId
    obj.VraagNummer
    */
  
    console.log(obj.Stelling);

      console.log(obj);
    
        console.log(lesId + " " + obj );
        pool.getConnection(function(err, connection) {
        
       
            //We gaan eerst kijken of de vraag er al in zit..
            console.log(lesId + "  " + obj.VraagNummer)
            var sqlCheck = "select * from vraag where LesId = " + lesId + " and VraagNummer = " + obj.VraagNummer;
            console.log(sqlCheck);
            connection.query(sqlCheck, function(err,rows,fields){
                       
                
                
                //HIER IS IETS MISS!!!!!
                             console.log(rows);
                
                                if(rows.length > 0){
                                    //De vraag bestaat al!
                                    console.log(sqlCheck);
                                    //Todo get vraagId
                                    //check multi
                                    //add bijvragen!
                                    console.log("Vraag bestaat al");
                                    if(obj.TypeId == 3){//Is een multiple choice vraag
                                        console.log("Is multiple choice");
                                        console.log(obj.multi);
                                        console.log(rows[0]);
                                        var vraagId = rows[0].Id;
                                        if(obj.multi.length>0){
                                            for(var i=0;i<obj.multi.length;i++){
                                                var sqlMulti = "insert into bijvraag(VraagId,Stelling)                  values('"+vraagId+"','"+obj.multi[i].Stelling+"')";  
                                                
                                                connection.query(sqlMulti,function(err,rows,fields){
                                                    
                                                });
                                            }

                                            }
                                            
                                        }
                                    }
                                                
                                else{ //Vraag bestaat nog niet!!
                                    //Vraag de nieuwe vraag toe
                                     var sql = "INSERT INTO vraag(Stelling, TypeId, LesId,VraagNummer,Active) VALUES ('"+ obj.Stelling+"','"+ obj.TypeId +"','"+ lesId +"','"+ obj.VraagNummer + "',false)";
      
        connection.query(sql, function(err,rows,fields){
            
             if (!err){
                 console.log("insert ok: nu testen wat we terugkrijgen");
                
                 if(obj.TypeId == 3){
                     //Ook bijvragen toevoegen! als je nieuwe multiple choice vraag aanmaakt
                     
                      var nieuwVraagId = rows.insertId; //dit is het id van de vraag dat we terugkrijgen
                     
                      if(obj.multi.length>0){
                                            for(var i=0;i<obj.multi.length;i++){
                                                var sqlMulti = "insert into bijvraag(VraagId,Stelling)                  values('"+nieuwVraagId+"','"+obj.multi[i].Stelling+"')";  
                                                
                                                connection.query(sqlMulti,function(err,rows,fields){
                                                    
                                                });
                                            }
                     
                
                     
                     
                 }
                  connection.release();
                 //return res.json({"vraag":"insert ok"});
             }
             }
             else{
                 console.log("insert not ok");
                 console.log(err);
                 connection.release();
                // return res.json({"vraag":"insert nok"});
                      }
             });
                                    
                                    
                                }
                             });
            
            
       
          
       
       
   });
    return res.json({"krak":"boem"});
});

//addVraag
router.post("/updateVraag",function(req,res){
    
    
        var lesId = req.body.lesId;
        var obj = req.body.vraag;
   
    /*
    obj.Stelling
    obj.TypeId
    obj.VraagNummer
    */
    console.log(obj.Stelling);
    console.log(lesId + " " + obj );
        pool.getConnection(function(err, connection) {
            
            /*
            UPDATE `vraag` SET `Id`=[value-1],`Stelling`=[value-2],`TypeId`=[value-3],`LesId`=[value-4],`VraagNummer`=[value-5],`Active`=[value-6] WHERE 1
            */
        console.log(obj.Stelling);
        var sql = "update vraag set Stelling=' " + obj.Stelling + "', TypeId='" + obj.TypeId + "' where lesId=" + lesId + " and VraagNummer = " + obj.VraagNummer;
      
        connection.query(sql, function(err,rows,fields){
            
             if (!err){
                 console.log("update ok");
                  connection.release();
                 return res.json({"vraag":"update ok"});
             }
             else{
                 console.log("update not ok");
                 console.log(err);
                 connection.release();
                 return res.json({"vraag":"update nok"});
                      }
     });
       
       
   });
    
});


router.post("/removeLes",function(req,res){
     var lesId = req.body.lesId;
    
     pool.getConnection(function(err, connection) {
        
        var sql = "delete from vraag where LesId = " + lesId;
        connection.query(sql, function(err,rows,fields){
            
             if (!err){
                 console.log("delete vragen ok");
                  connection.release();
                 
                  pool.getConnection(function(err, connection) {
        
        var sql = "delete from les where Id = " + lesId;
        connection.query(sql, function(err,rows,fields){
            
             if (!err){
                 console.log("delete les ok");
                  connection.release();
                 return res.json({"deleteLes":"ok"});
             }
             else{
                 console.log("delete les not ok");
                 console.log(err);
                 connection.release();
                 return res.json({"deleteLes":"nok"});
                      }
            });
        });
                
             }
             else{
                 console.log("delete vragen not ok");
                 console.log(err);
                 connection.release();
                 return res.json({"deleteLes":"nok"});
                      }
            });
        });
    
           
    
});

//Stop les, delete alle antwoorden!
router.post("/StopLes",function(req,res){
    
      var lesId = req.body.lesId;
    
            pool.getConnection(function(err, connection) {
        
        var sql = "delete from antwoord where LesId = " + lesId;
        connection.query(sql, function(err,rows,fields){
            
             if (!err){
                 console.log("delete ok");
                  connection.release();
                 return res.json({"delete":"ok"});
             }
             else{
                 console.log("delete not ok");
                 console.log(err);
                 connection.release();
                 return res.json({"delete":"nok"});
                      }
     });
                
                /*
                Controleer of er een directory met afbeeldingen is, zoja verwijderen!                
                */
                
                
                
                 var dir = './Client/public/pics/'+lesId;
            fse.remove(dir, function (err) {
                if (err) return console.error(err)
 
                    console.log('success removing '+ dir +' !');
                });
       
       
   });

});
module.exports = router;