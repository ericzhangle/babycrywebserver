var system = require('system');
var args = system.args;
var page = require('webpage').create();
args[1] ="100011338365647";

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
          page.evaluate(function() {
			    var requests = document.querySelector("#requestsCountValue");
			    requests.click();

    		});

          window.setTimeout(function(){
		          		  page.evaluate(function(args) {
		          		  var	friends = document.querySelectorAll("button[name='actions[accept]']")
		          		  var confirmString = args[1] + "_1_req_aux";
		          		  var finished= false

		          		  if (friends == []){
		          		  	console.log("empty")
		          		  	return
		          		  }
			          		  for (var i=0;i<friends.length;i++){
			          		  	if (friends[i].parentNode.parentNode.parentNode.id == confirmString)
			          		  	{
			          		  		friends[i].click();
			          		  		finished = true;
			          		  		break;
			          		  	}

			          		  }
			          		 if (finished === false)
			          		  	{
			          		  		console.log("error encountered")

			          		  		return
			          		  	}
					   
		    			  },args);

		    	window.setTimeout(function(){
			    	page.render("page1.png");
			    	phantom.exit();
			    },5000);


          },2000)


		},5000);
    }

});


