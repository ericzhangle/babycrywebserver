const fs = require('fs');
const login = require("facebook-chat-api");
 
// Create simple echo bot 
login({email: "raspberrypi5506@gmail.com", password: "raspberry55"}, (err, api) => {
    if(err) return console.error(err);
     //   var msg = {
     //   body: "Hey!",
     //   attachment: fs.createReadStream("baby3.wav")
    	// }
 			api.sendMessage("msg", "100011338365647")
});