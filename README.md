# babycrywebserver
The web server to server baby cry detector based on the service of facebook
## Introduction
This web server is developed to support the functions of the baby cry detector in the IOT project.
The baby cry detector can detect baby cry and send alert notification to the receiver, and the receiver in turn can send command, for e.g. to stop, start the detector remotely.
These above mentioned functions can be achieved through this web server.

## The functions of this web server:

1. **Accept the user register request from the main page**  
Because the notification and commands are sent through the service of facebook messenger, so the web server keeps a virtual facebook account `raspberry pi` active as the detector to receive command and send alerts. But in order for it to work, the facebook account of the user must be known, so user has to register with his facebook userID and the device ID of the detector on the main page, the the web server is responsible to deal with this act and use `phantom`(a headless web browser) to simulate actions to add the user as friend.

2. **Accept the initial checking of userID from baby detector**  
When the baby detector start, it will send `get`request to the server to check weather any user has registered for this device, the web server will check the database and give proper feedback, if no user has registered for the device, the detector won't start

3. **Accept the posted alert from baby detector and forward it to the user**  
   When the baby detector detects baby cry, it will record sound for 10 seconds, then send the `wav` file to the user for double confirm, this wav file is accepted by this web server then forward to the user through a message using messenger.

4. **Listening for any command from user to control the detector**  
   User can send command like `start`, `stop`,`delay 30`,`status`, to make the detector start, stop, delay detecting for 30 min, and query the current status. the web server listens to this command and make the detector execute accordingly.

## How to use
1. Inside the folder, install all required packages by typing:
	npm install

2. You have to install and start the mongodb and create a database for (e.g. "babycry") and change the line 21 of file app.js
mongoose.connect('mongodb://tom:123@localhost/babycry');
to your mongo db url

3. Inside your database, you have to insert at least one device as a test device using:
db.devices.insertOne(
   { 	
   "deviceID" : 12345678,
	"nextTime":"",
	"status":""
	}
)

4. Get your userID of your facebook, and search for "raspberry.pi.777", you add the result as friend.
5. Inside the folder, type:
   npm start
6. Open following url in your web browser:
   localhost:3000
7. You shall now see the main page, input your userID and the device ID you created in the database. then click submit.

8. Wait for a few seconds (depending on the network), you shall see an "successfully added" notification on the web. Now the detector facebook account has accepted the friend request.

9. Now you can open your facebook messenger and send command to the detector.
10. To use other functions, you have to start baby detector program.



