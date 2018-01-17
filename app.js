var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
const login = require("facebook-chat-api");
var index = require('./routes/index');
var users = require('./routes/users');
const formidable = require('formidable');
var mongoose = require('mongoose');
var moment =require("moment");
//const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var system = require('system');


mongoose.connect('mongodb://tom:123@localhost/babycry');

var Schema = mongoose.Schema;

var babycryClient = new Schema({
userID: String,
deviceID: String
});

var devices = new Schema({
deviceID: String,
nextTime: String,
status:String
})



async function addFriend(userID,callback){

const { stdout, stderr } = await exec('phantomjs testB.js ' + userID);

  console.log(`stderr: ${stderr}`);
  callback(`stderr: ${stderr}`);

}


var Device = mongoose.model('Device', devices);
var BabyClient = mongoose.model('BabyClient', babycryClient);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favin in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);
//app.use(formidable());


app.get("/userID",function(req,res){
   BabyClient.findOne({deviceID:req.query.dID},function(err,doc){

        if (err)
        {
          console.log(err)
          res.send("")
        }
        if (doc){
          console.log(doc)
          res.send("success")
        }
        else
          res.send("")
    })
})

app.post("/post",function(req,res){
	//console.log("posted");
  //console.log(req);
	var deviceID = "";
	var form = new formidable.IncomingForm();

	
	form.uploadDir = __dirname + '/upload/';
    form.on ('fileBegin', function(name, file){
            //rename the incoming file to the file's name
            console.log(file.path);
            file.path = form.uploadDir + "/" + file.name;
        //res.send("upload Error")
    })
  form.parse(req,function(err,field,file){

      if (!field || !field.deviceID || ! file)
        return
      if (err)
          res.send("Error uploading")
      deviceID = field.deviceID;
      console.log(deviceID);
      BabyClient.findOne({deviceID:deviceID},function(err,doc){
        if(err)
          res.send(err)


          if (doc){
              var uID = doc.userID;
          var dataFile = file.file;
        login({email: "raspberrypi5506@gmail.com", password: "raspberry55"}, (err, api) => {
                if(err) return console.error(err);
                   var msg = {
                   body: "baby crying detected",
                   attachment: fs.createReadStream(dataFile.path)
                 }

                 api.sendMessage(msg, uID)
               fs.unlink(dataFile.path, function(err){
                 if (err)
                   console.log(err)
               })
               res.send("uploaded cry file")
            });

          }
        else
         res.send("internal error")

      })

  });
   //  form.on('field', function(name, field) {
   //      console.log('Got a field:', name);
   //  })
   //  form.on("file",function(field, file) {
   //    console.log(field);
			//     login({email: "raspberrypi5506@gmail.com", password: "raspberry55"}, (err, api) => {
			//     if(err) return console.error(err);
			//        var msg = {
			//        body: "baby crying detected",
			//        attachment: fs.createReadStream(file.path)
			//     	}

			//  		api.sendMessage(msg, "100011338365647")
			// 	  fs.unlink(file.path, function(err){
			// 			if (err)
			// 				console.log(err)
			// 		})
			// 	  res.send("uploaded cry file")
			// });
   //  })
   //  form.on ('error', function(err) {
   //      //console.log(err)
   //      res.send("Error uploading")

   //  })
})

login({email: "raspberrypi5506@gmail.com", password: "raspberry55"}, (err, api) => {
    if(err) return console.error(err);
 


 if (err)
    return 
 // api.setOptions({selfListen: true})
    api.listen((err, message) => {
        if (!message )
          return 
        userID = message.senderID;
        console.log(userID);
        console.log(message);
        BabyClient.findOne({userID:userID},function(err,doc){
          if (err) console.log(err)
            if(doc){
              console.log("found")
                  Device.findOne({deviceID:doc.deviceID},function(err,dev){
                    //time = dev.nextTime
                    
                    var  delayMin = message.body.match(/delay +(\d+)/)
                    //console.log(delayMin)
                    if (delayMin){
                    time = moment().add(delayMin[1],"minutes").format()
                    dev.nextTime = time
                    console.log(time)
                    dev.save()
                    api.sendMessage("next monitor time is :" + time, userID) 
                    }
                    else if  (/\bstop\b/.test(message.body)){
                     dev.nextTime = "stop"
                    //console.log(time)
                      dev.save()
                      api.sendMessage("device is stopped", userID) 
                    }
                   else if(/\bstart\b/.test(message.body)){
                      dev.nextTime = "start"
                      dev.save()
                      api.sendMessage("device is started", userID) 
                   }
                   else if(/\bstatus\b/.test(message.body)){
                      var status = dev.status
                      if (status == "stopped" && dev.nextTime !== null)
                         api.sendMessage("status: stopped\n next monitor time is: " + dev.nextTime, userID)
                       else
                         api.sendMessage("status: " + status,userID)
                   }
                  })
            }
        })
       
    });


});



app.get("/reset",function(req,res){
   Device.findOne({deviceID:req.query.dID},function(err,doc){

        if (err)
        {
          console.log(err)
         //res.send("")
        }
        if (doc){
          doc.nextTime =null
          doc.save()

        }

        res.send("")
      }
      );
})



app.get("/time",function(req,res){
   Device.findOne({deviceID:req.query.dID},function(err,doc){

        if (err)
        {
          console.log(err)
          res.send("")
        }
        if (doc){
        doc.status = req.query.status;
        doc.save();
         var  current = new Date();
        var isoT= current.toISOString();
        if (doc.nextTime ===null)
             res.send("")
        else{
          if (doc.nextTime == "start")
             res.send("start")
           else if  (doc.nextTime == "stop")
              res.send("stop")
          else if (Date.parse(isoT) <= Date.parse(doc.nextTime ))
             res.send("stop")
          else if(Date.parse(isoT) > Date.parse(doc.nextTime ))
             res.send("start")
           else 
            res.send("")
        }
      }
        else
          res.send("")
    })
})

app.post("/register",function(req,res){
     console.log(req.body.userID);
    BabyClient.findOne({deviceID:req.body.deviceID},function(err,doc){

        if (err)
        {
          console.log(err)
          res.send(err)
        }
        if (doc){
          res.send("device has been registered before")
        }
        else{

            Device.findOne({deviceID:req.body.deviceID},function(err,doc){
              if (err)
              {
                console.log(err)
                res.send(err)
              }
              if (!doc){
                res.send("device not exist,check device ID ")
              }
              else{
                    addFriend(req.body.userID,callback);

              }
          }) 


        }
    })

     function callback(reply){
          if (reply.indexOf("friend added successfully")!==-1){
          BabyClient({
            userID: req.body.userID,
            deviceID:req.body.deviceID
          }).save(function(err,doc){
            if (err){
              console.log(err)
              res.send(err)
            }
            else
              res.send("successfully added")
              })
        }
         else
          res.send("problem encountered during process, please check your email")

     }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (err) {
  		console.log(err)
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
