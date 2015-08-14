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

});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
