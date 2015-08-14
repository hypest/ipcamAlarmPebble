/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var config = require('config');

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var ajax = require('ajax');
  
  // Show splash
  var splashCard = new UI.Card({
    title: "Please Wait",
    body: "Downloading..."
  });
  splashCard.show();

  var auth = 'Basic ' + btoa(config.credentials.user + ':' + config.credentials.pass);
  var statusUrl = config.ipcam.url + '/get_params.cgi';
  var setAlarmUrl = config.ipcam.url + '/set_alarm.cgi?next_url=alarm.htm&motion_armed=1&input_armed=0&motion_sensitivity=3&iolinkage=0&upload_interval=0&schedule_enable=0&schedule_sun_0=0&schedule_sun_1=0&schedule_sun_2=0&schedule_mon_0=0&schedule_mon_1=0&schedule_mon_2=0&schedule_tue_0=0&schedule_tue_1=0&schedule_tue_2=0&schedule_wed_0=0&schedule_wed_1=0&schedule_wed_2=0&schedule_thu_0=0&schedule_thu_1=0&schedule_thu_2=0&schedule_fri_0=0&schedule_fri_1=0&schedule_fri_2=0&schedule_sat_0=0&schedule_sat_1=0&schedule_sat_2=0';

  ajax({url: statusUrl, type: 'text', headers : { Authorization: auth }},
    function(js) {
      console.log('status call 1 returned.');
      console.log(js);

      eval(js);

      var newValue = (alarm_mail === 0 ? "1" : "0");

      ajax({url: setAlarmUrl + "&mail=" + newValue, type: 'text', headers : { Authorization: auth }},
        function(js) {
          console.log('setAlarm call returned.');
          console.log(js);
    
          ajax({url: statusUrl, type: 'text', headers : { Authorization: auth }},
            function(js) {
              console.log('status call 2 returned.');
              console.log(js);
        
              eval(js);
        
              var resultsCard = new UI.Card({
                title: 'Alarm is now',
                body: (alarm_mail > 0 ? "* ON *" : "-- OFF --")
              });

              // Show results, remove splash card
              resultsCard.show();
              splashCard.hide();
            },
            function(error) {
              splashCard.hide();
              console.log('status 2 failed: ' + error);
            }
          );
        },
        function(error) {
          splashCard.hide();
          console.log('setAlarm failed: ' + error);
        }
      );
    },
    function(error) {
      splashCard.hide();
      console.log('status 1 failed: ' + error);
    }
  );
/*
  ajax({url: statusUrl, type: 'text', headers : { Authorization: auth }},
    function(js) {
      console.log('Ajax call returned.');
      // Data is supplied here
      eval(js);
      
      // Use data to show a weather forecast Card
      var resultsCard = new UI.Card({
        title: 'datum',
        body: mail_svr
      });
    
      // Show results, remove splash card
      resultsCard.show();
      splashCard.hide();
    },
    function(error) {
      console.log('Ajax failed: ' + error);
    }
  );
*/
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
