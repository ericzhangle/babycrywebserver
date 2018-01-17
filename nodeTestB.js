const { exec } = require('child_process');

var test = "ericzhangle@gmail.com"

exec('phantomjs testB.js ' + test, (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});