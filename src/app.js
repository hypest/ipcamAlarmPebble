/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

console.log('IP Cam Alarm is starting');

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Settings = require('settings');

var statusUri =  '/get_params.cgi';
var setAlarmUri = '/set_alarm.cgi?next_url=alarm.htm&motion_armed=1&input_armed=0&motion_sensitivity=3&iolinkage=0&upload_interval=0&schedule_enable=0&schedule_sun_0=0&schedule_sun_1=0&schedule_sun_2=0&schedule_mon_0=0&schedule_mon_1=0&schedule_mon_2=0&schedule_tue_0=0&schedule_tue_1=0&schedule_tue_2=0&schedule_wed_0=0&schedule_wed_1=0&schedule_wed_2=0&schedule_thu_0=0&schedule_thu_1=0&schedule_thu_2=0&schedule_fri_0=0&schedule_fri_1=0&schedule_fri_2=0&schedule_sat_0=0&schedule_sat_1=0&schedule_sat_2=0';

Settings.config(
  { url: "http://hypest.github.io/ipcamAlarmPebble/ipcamAlarmSettings.html" },
  function(e) {
  },
  function(e) {
    if (e.failed) {
      console.log('Cancelled settings!');
      return;
    }

    console.log('Received settings!'/* + JSON.stringify(e, null, '\t')*/); 
  }
);

var mainCard = new UI.Card({
  title: 'IP Cam Alarm',
  body: 'Press up to lock or down to unlock.'
});

if (typeof Settings.option("ipcam_url") === 'undefined') {
  mainCard.body("Please fill in settings.");
}

mainCard.show();

var waitingCard = new UI.Card({
  title: "Please Wait",
  body: "Accessing ipcam..."
});

function getAuthString() {
  return 'Basic ' + btoa(Settings.option("ipcam_username") + ':' + Settings.option("ipcam_password"));
}

function alarmMailTo(newValue) {
  waitingCard.show();

  ajax({url: Settings.option("ipcam_url") + setAlarmUri + "&mail=" + newValue, type: 'text', headers : { Authorization: getAuthString() }},
       function(js) {
         ajax({url: Settings.option("ipcam_url") + statusUri, type: 'text', headers : { Authorization: getAuthString() }},
              function(js) {
                eval(js);

                mainCard.title("Alarm is now");
                mainCard.body((alarm_mail > 0 ? "* ON *" : "-- OFF --"));

                waitingCard.hide();

                setTimeout(function() {
                  mainCard.hide();
                }, 3000);
              },
              function(error) {
                mainCard.body("An error has occured while fetching status.");
                waitingCard.hide();
                console.log('status 2 failed: ' + error);
              }
             );
       },
       function(error) {
         mainCard.body("An error has occured while toggling alarm.");
         waitingCard.hide();
         console.log('setAlarm failed: ' + error);
       }
  );
}

mainCard.on('click', 'up', function(e) {
  alarmMailTo(1);
});

mainCard.on('click', 'down', function(e) {
  alarmMailTo(0);
});
