/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

console.log('IP Cam Alarm is starting');

var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

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
  mainCard.body("Please fill in settings using the Pebble app.");
}

mainCard.show();

var waitingCard = new UI.Card({
  title: "Please Wait",
  body: "Accessing ipcam..."
});

function getAuthString() {
  return 'Basic ' + btoa(Settings.option("ipcam_username") + ':' + Settings.option("ipcam_password"));
}

function getStatus(callback) {
  var statusUri =  '/get_params.cgi';

  ajax({
      url: Settings.option("ipcam_url") + statusUri,
      type: 'text',
      headers : { Authorization: getAuthString() }
    },
    callback,
    function(error) {
      mainCard.body("An error has occured while fetching status.");
      waitingCard.hide();
      console.log('status 2 failed: ' + error);
      return "";
    }
  );
}

function getSetAlarmUri(callback) {
  getStatus(function(vars) {
    eval(vars);
    var uri = '/set_alarm.cgi?next_url=alarm.htm' +
        '&motion_armed=' + alarm_motion_armed +
        '&input_armed=' + alarm_input_armed +
        '&motion_sensitivity=' + alarm_motion_sensitivity +
        '&iolinkage=' + alarm_iolinkage +
        '&upload_interval=' + alarm_upload_interval +
        '&schedule_enable=' + alarm_schedule_enable +
        '&schedule_sun_0=' + alarm_schedule_sun_0 +
        '&schedule_sun_1=' + alarm_schedule_sun_1 +
        '&schedule_sun_2=' + alarm_schedule_sun_2 +
        '&schedule_mon_0=' + alarm_schedule_mon_0 +
        '&schedule_mon_1=' + alarm_schedule_mon_1 +
        '&schedule_mon_2=' + alarm_schedule_mon_2 +
        '&schedule_tue_0=' + alarm_schedule_tue_0 +
        '&schedule_tue_1=' + alarm_schedule_tue_1 +
        '&schedule_tue_2=' + alarm_schedule_tue_2 +
        '&schedule_wed_0=' + alarm_schedule_wed_0 +
        '&schedule_wed_1=' + alarm_schedule_wed_1 +
        '&schedule_wed_2=' + alarm_schedule_wed_2 +
        '&schedule_thu_0=' + alarm_schedule_thu_0 +
        '&schedule_thu_1=' + alarm_schedule_thu_1 + 
        '&schedule_thu_2=' + alarm_schedule_thu_2 +
        '&schedule_fri_0=' + alarm_schedule_fri_0 +
        '&schedule_fri_1=' + alarm_schedule_fri_1 +
        '&schedule_fri_2=' + alarm_schedule_fri_2 +
        '&schedule_sat_0=' + alarm_schedule_sat_0 +
        '&schedule_sat_1=' + alarm_schedule_sat_1 +
        '&schedule_sat_2=' + alarm_schedule_sat_2;
    callback(uri);
  });
}

function verifyStatus() {
  getStatus(function(vars) {
    eval(vars);
  
    mainCard.title("Alarm is now");
    mainCard.body((alarm_mail > 0 ? "* ON *" : "-- OFF --"));
  
    waitingCard.hide();
  
    setTimeout(function() {
      mainCard.hide();
    }, 3000);
  });
}

function alarmMailTo(newValue) {
  waitingCard.show();

  getSetAlarmUri(function(setAlarmUri) {
    ajax({
        url: Settings.option("ipcam_url") + setAlarmUri + "&mail=" + newValue,
        type: 'text',
        headers : { Authorization: getAuthString() }
      },
      verifyStatus,
      function(error) {
        mainCard.body("An error has occured while toggling alarm.");
        waitingCard.hide();
        console.log('setAlarm failed: ' + error);
      }
    );
  });
}

mainCard.on('click', 'up', function(e) {
  alarmMailTo(1);
});

mainCard.on('click', 'down', function(e) {
  alarmMailTo(0);
});
