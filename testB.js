var system = require('system');
var args = system.args;
var page = require('webpage').create();
//args[1] ="100011338365647";

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};


page.open("http://www.facebook.com/login.php", function(status) {

  if (status === "success") {
    page.evaluate(function() {
        document.getElementById("email").value = "raspberrypi5506@gmail.com";
        document.getElementById("pass").value = "raspberry55";
        document.getElementById("loginbutton").click();
    });
    window.setTimeout(function() {
       page.render("page.png");
       page.open("https://m.facebook.com/friends/center/requests", function(status) {

		  	  window.setTimeout(function(){

		  	  	page.render("page2.png");
		  	  	//console.log(page.url)
		  	  	page.evaluate(function(args) {
		  	  			var buttons = document.querySelectorAll('button[value="Confirm"]');
		  	  			console.log("length",buttons.length)
		  	  			var finished  = false;
		  	  			if (buttons.length === 0)
		  	  			{
		  	  				console.log("no button found");
		  	  				return
		  	  			}
		  	  			for(var i=0;i<buttons.length;i++){

		  	  				var confirmString = "spam_question_mfl_m_find_friends_" + args[1];
		  	  				//console.log (confirmString);
		  	  				//console.log (buttons[i].parentNode.parentNode.parentNode.id);
		  	  				if (buttons[i].parentNode.parentNode.parentNode.id == confirmString)
		  	  				{
		  	  					finished =true;

		  	  					console.log("friend added successfully");  // need this log to confirm added successful
		   	  					buttons[i].click();

		  	  					break;
		  	  				}

		  	  			}
		  	  			if (finished  === false)
		  	  				console.log("no confirm found")
		  	  				
		  	  		},args);

			    window.setTimeout(function(){
			    	page.render("page1.png");
			    	phantom.exit();
			    },5000);
			},10000);  
		    });
		},5000);
    }

});


