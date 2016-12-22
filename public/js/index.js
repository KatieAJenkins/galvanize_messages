'use strict';

$(document).ready(function(){
  console.log("It's ALIVE");

  $.getJSON("/messages")
    .done((results) => {
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var $message = $('<p>').text(results[i].message);
        var $name = $('<h6>').text(results[i].name);
        $('#messageContainer').append($message);
        $('#messageContainer').append($name);
      }

    })
    .fail(() => {
      $('#messageContainer').text('Could not get messages');
    })
});
