var upmTP401 = require('jsupm_gas');//var time = require('sleep');
var request = require("request");
var mraa = require('mraa'); //require mraa

var B = 3975;

console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var gateway = 0;
var isDry = false;
//setup sensor on Analog pin #0 (A0)
var airSensor = new upmTP401.TP401(0 + gateway);
var soilMoisture = new mraa.Aio(1 + gateway); //setup access analog input Analog pin #0 (A0)
var methanePin = new mraa.Aio(2 + gateway); //setup access analog input Analog pin #0 (A0)
var light = new mraa.Aio(3 + gateway); //setup access analog input Analog pin #0 (A0)


/*
var redlight = new mraa.Gpio(2);
redlight.dir(mraa.DIR_OUT);
*/
//give a qualitative meaning to the value from the sensor
function airQuality(value)
{
    if(value < 50) return "Fresh Air";
    if(value < 200) return "Normal Indoor Air";
    if(value < 400) return "Low Pollution";
    if(value < 600) return "High Pollution - Action Recommended";
    return "Very High Pollution - Take Action Immediately";
}

function loop()
{
    //read values (consecutive reads might vary slightly)
    var value = airSensor.getSample();
    var ppm = airSensor.getPPM();
    
    //console.log("raw: " + value + " ppm: " + (" " + ppm.toFixed(2)).substring(-5, 5) + "   " + airQuality(value));
    
    var moistureValue = soilMoisture.read(); //read the value of the analog pin
    var methaneValue = methanePin.read();
    var lightvalue = light.read(); //read the value of the analog pin
    
    //write the sensor values to the console
    console.log("raw: " + value + " ppm: " + (" " + ppm.toFixed(2)).substring(-5, 5) + "   " + airQuality(value));
    console.log("moistureValue: " + moistureValue);
    console.log("methane: " + methaneValue);
    console.log("lightvalue: " + lightvalue);

    request
      .get('https://fast-coast-93939.herokuapp.com/update?aq=' + value + "&soil=" + moistureValue + "&methane=" + methaneValue + "&light=" + lightvalue)
      .on('error', function(err) {
        console.log(err)
      });
    
    //wait 5 s then call function again
    setTimeout(loop, 5000);
}

//warm up sensor
console.log("Sensor is warming up for 10 second");
var i = 1;

//print a message every passing minute
var waiting = setInterval(function() {
        i++;
        console.log("few seconds has passed.");
        if(i == 3) clearInterval(waiting);
    }, 10);

//start loop in 3 minutes
setTimeout(function(){
    console.log("Sensor is ready!");
    loop();
    }, 10);

function StartsWith(s1, s2) {
  return (s1.length >= s2.length && s1.substr(0, s2.length) == s2);
}

