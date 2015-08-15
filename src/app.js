/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

console.log('lockAlarm is starting');

var UI = require('ui');
var Vector2 = require('vector2');
var config = require('config');
var ajax = require('ajax');

var statusUrl = config.ipcam.url + '/get_params.cgi';
var setAlarmUrl = config.ipcam.url + '/set_alarm.cgi?next_url=alarm.htm&motion_armed=1&input_armed=0&motion_sensitivity=3&iolinkage=0&upload_interval=0&schedule_enable=0&schedule_sun_0=0&schedule_sun_1=0&schedule_sun_2=0&schedule_mon_0=0&schedule_mon_1=0&schedule_mon_2=0&schedule_tue_0=0&schedule_tue_1=0&schedule_tue_2=0&schedule_wed_0=0&schedule_wed_1=0&schedule_wed_2=0&schedule_thu_0=0&schedule_thu_1=0&schedule_thu_2=0&schedule_fri_0=0&schedule_fri_1=0&schedule_fri_2=0&schedule_sat_0=0&schedule_sat_1=0&schedule_sat_2=0';

var main = new UI.Card({
  title: 'lockAlarm',
  body: 'Press up to lock or down to unlock.'
});

main.show();

var waitingCard = new UI.Card({
  title: "Please Wait",
  body: "Accessing ipcam..."
});

var auth = 'Basic ' + btoa(config.credentials.user + ':' + config.credentials.pass);

function alarmMailTo(newValue) {
  waitingCard.show();

  ajax({url: setAlarmUrl + "&mail=" + newValue, type: 'text', headers : { Authorization: auth }},
       function(js) {
         ajax({url: statusUrl, type: 'text', headers : { Authorization: auth }},
              function(js) {
                eval(js);

                var resultsCard = new UI.Card({
                  title: 'Alarm is now',
                  body: (alarm_mail > 0 ? "* ON *" : "-- OFF --")
                });

                // Show results, remove the waiting card
                resultsCard.show();
                waitingCard.hide();
              },
              function(error) {
                waitingCard.hide();
                console.log('status 2 failed: ' + error);
              }
             );
       },
       function(error) {
         waitingCard.hide();
         console.log('setAlarm failed: ' + error);
       }
  );
}

main.on('click', 'up', function(e) {
  alarmMailTo(1);
});

main.on('click', 'down', function(e) {
  alarmMailTo(0);
});
