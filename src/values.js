'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vector2 = require('vector2');
var IFTTT = require('iftttsettings');
var Vibe = require('ui/vibe');


/**
Default Value:
Location
Current Date
Current Time

Action:
Done
*/


exports.getValuesMenu = function(event, /** function */ callback) {

  // Trigger format see triggers.js
  var iftttTrigger = {title: event.title, event: event.title, value: {}, counter: 0, history:[], wakeupId: -1};

  var menu = new UI.Menu({
    sections: [
        {
          title: "Select value 1",
          items:[
            {title: 'Location'},
            {title: 'Time'},
            {title: 'OK'}
          ]
        }
      ]
    });

  menu.currentValue = 1;

  var oldItems = menu.items(0);
  menu.items(0, Settings.option(IFTTT.VALUES_KEY).concat(oldItems));

  menu.on('select', function(e){
        Vibe.vibrate('short');

    if (e.item.title != 'OK') {
    switch (e.menu.currentValue) {
      case 1:
        iftttTrigger.value.value1 = e.item.title;
        break;
      case 2:
        iftttTrigger.value.value2 = e.item.title;
        break;
      case 3:
        iftttTrigger.value.value3 = e.item.title;
        break;
    }
    }
      e.menu.currentValue ++;

      if (e.menu.currentValue > 3 || e.item.title == 'OK') {
          e.menu.hide();
        // TODO
          iftttTrigger.title = iftttTrigger.event + "[" + iftttTrigger.value.value1 + "]";
          iftttTrigger.subtitle  = valueString(iftttTrigger.value);
          var events = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
          if (!events) {
            events = [];
          }
          events.push(iftttTrigger);
          Settings.data(IFTTT.IFTTT_TRIGGERS_DATA , events);
        callback(e.menu.value);
      } else {
        e.menu.section(0, {title: 'Select Value ' + e.menu.currentValue});
//         e.menu.action('select', 'images/' + e.menu.currentValue + '.png');
      }
    });

  menu.on('show', function(e){
  });

  menu.on('hide', function(e) {
  });

  return menu;
}

function valueString(value) {
  var result = '';
  if (value) {
    if (value.value1) {
      result = value.value1;
    }
    if (value.value2) {
      result += ',' + value.value2;
    }
    if (value.value3) {
      result += ',' + value.value3;
    }
  }
  return result;
}
