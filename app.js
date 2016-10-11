var express = require('express');
var app = express();




/*
    SensorTag IR Temperature sensor example
    This example uses Sandeep Mistry's sensortag library for node.js to
    read data from a TI sensorTag.
    The sensortag library functions are all asynchronous and there is a
    sequence that must be followed to connect and enable sensors.
      Step 1: Connect
        1) discover the tag
        2) connect to and set up the tag
      Step 2: Activate sensors
        3) turn on the sensor you want to use (in this case, IR temp)
        4) turn on notifications for the sensor
      Step 3: Register listeners
        5) listen for changes from the sensortag
      Step 4 (optional): Configure sensor update interval
*/
var SensorTag = require('sensortag');

console.log("Hello");

var log = function(text) {
  if(text) {
    console.log(text);
  }
}

//============================================================================ Step 1: Connect to sensortag device.
//------------------------------------------------------------------------------
// It's address is printed on the inside of the red sleeve
// (replace the one below).
var ADDRESS = "b0:b4:48:c9:a1:83";
var connected = new Promise((resolve, reject) => SensorTag.discoverByAddress(ADDRESS, (tag) => resolve(tag)))
  .then((tag) => new Promise((resolve, reject) => tag.connectAndSetup(() => resolve(tag))));

//==============================================================================
// Step 2: Enable the sensors you need.
//------------------------------------------------------------------------------
// For a list of available sensors, and other functions,
// see https://github.com/sandeepmistry/node-sensortag.
// For each sensor enable it and activate notifications.
// Remember that the tag object must be returned to be able to call then on the
// sensor and register listeners.

var sensor = connected.then(function(tag){
  log("connected");
  tag.enableAccelerometer(log);
  tag.notifyAccelerometer(log);

  return tag;
});

var count_x = 0;
var count_y = 0;
var count_z = 0;

sensor.then(function(tag) {
 tag.on("accelerometerChange", function(x,y,z){
	x = Math.round(x);
	y = Math.round(y);
	z = Math.round(z);


	if(x > 1){
		count_x += 1;
		log("x +");
	}
	if(y > 1){
                count_y += 1;
		log("y +" );
        }
	if(z > 1){
                count_z += 1;
		log("z +");
        }
	if(count_x>2 && count_y>2 && count_z>2){
    log("UNLOCKED");
    }
  });
});


app.get('/', function (req, res) {
  var site = "<button></button>"
  res.send(site);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
