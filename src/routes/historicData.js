var express = require('express'),
    router = express.Router(),
    mysql = require('mysql'), //mysql connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for historicData
//this will be accessible from http://127.0.0.1:3000/historicData if the default route for / is left unchanged
router.route('/')
    //GET all historicData
    .get(function(req, res, next) {
        //retrieve all historicData from Mysql
        mysql.model('HistoricData').find({}, function (err, historicData) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/historicData folder. We are also setting "historicData" to be an accessible variable in our jade view
                    html: function(){
                        res.render('historicData/index', {
                              title: 'All my historicData',
                              "historicData" : historicData
                          });
                    },
                    //JSON response will show all historicData in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }     
        });
    })
    //POST a new historicData
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var badge = req.body.badge;
        var dob = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;
        //call the create function for our database
        mysql.model('historicData').create({
            name : name,
            badge : badge,
            dob : dob,
            isloved : isloved
        }, function (err, historicData) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //historicData has been created
                  console.log('POST creating new historicData: ' + historicData);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("historicData");
                        // And forward to success page
                        res.redirect("/historicData");
                    },
                    //JSON response will show the newly created historicData
                    json: function(){
                        res.json(historicData);
                    }
                });
              }
        })
    });


/* GET New HistoricData page. */
router.get('/new', function(req, res) {
    res.render('HistoricData/new', { title: 'Add New HistoricData' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mysql.model('HistoricData').findById(id, function (err, historicData) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(historicData);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mysql.model('HistoricData').findById(req.id, function (err, historicData) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + historicData._id);
        var historicDatadob = historicData.dob.toISOString();
        historicDatadob = historicDatadob.substring(0, historicDatadob.indexOf('T'))
        res.format({
          html: function(){
              res.render('historicData/show', {
                "historicDatadob" : historicDatadob,
                "historicData" : historicData
              });
          },
          json: function(){
              res.json(historicData);
          }
  	});
      }
    });
  });

//GET the individual historicData by Mysql ID
router.get('/:id/edit', function(req, res) {
    //search for the historicData within Mysql
    mysql.model('HistoricData').findById(req.id, function (err, historicData) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the historicData
            console.log('GET Retrieving ID: ' + historicData._id);
            //format the date properly for the value to show correctly in our edit form
          var historicDatadob = historicData.dob.toISOString();
          historicDatadob = historicDatadob.substring(0, historicDatadob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('historicDatas/edit', {
                          title: 'HistoricData' + historicData._id,
                        "historicDatadob" : historicDatadob,
                          "historicData" : historicData
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(historicData);
                 }
            });
        }
    });
});

//PUT to update a historicData by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var badge = req.body.badge;
    var dob = req.body.dob;
    var company = req.body.company;
    var isloved = req.body.isloved;

   //find the document by ID
        mysql.model('HistoricData').findById(req.id, function (err, historicData) {
            //update it
            historicData.update({
                name : name,
                badge : badge,
                dob : dob,
                isloved : isloved
            }, function (err, blobID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/historicData/" + historicData._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(historicData);
                         }
                      });
               }
            })
        });
});

//DELETE a HistoricData by ID
router.delete('/:id/edit', function (req, res){
    //find historicData by ID
    mysql.model('HistoricData').findById(req.id, function (err, historicData) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mysql
            historicData.remove(function (err, historicData) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + historicData._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/historicData");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : historicData
                               });
                         }
                      });
                }
            });
        }
    });
});


module.exports = router;
