'use strict';

$(document).ready(function(){
  // console.log("It's ALIVE");

$('#submit').click(function (event){
 event.preventDefault();

  var name = $('#nameInput').val();
  console.log(name);

  var message = $('#inputMessage').val();
  console.log(message);

  var options = {
    contentType: 'application/json',
    type: 'POST', //change this type based on what you are doing
    url: '/messages', //would also need to specify id if patching
    data: JSON.stringify({name, message})//set up object and stringify
  };

  $.ajax(options)
    .done(() => {
      console.log('DONE');
      window.location.href = '/'; //reloads page once .done is called
    })
    .fail(($xhr) => {
      console.log($xhr);
    });

});

  $.getJSON('/messages') //this fires after page reloads -->this is the API endpoint
    .done((results) => {
      console.log(results);//array of objs

      //Loop through results from getJSON call to dynamically add to page
      for (var i = 0; i < results.length; i++) {
        var $message = $('<p>').text(results[i].message);

        //Create Edit and Delete buttons manually
        var $editButton = document.createElement('button');
        var $editMessage = document.createTextNode('Edit');
        $editButton.appendChild($editMessage);

        var $deleteButton = document.createElement('button');
        var $deleteMessage = document.createTextNode('Delete');
        $deleteButton.appendChild($deleteMessage);

        var $name = $('<h6>').text(results[i].name);
        //Append all dynamically created DOM elements to message container
        $('#messageContainer').append($message);
        $('#messageContainer').append($name);
        $('#messageContainer').append($editButton);
        $('#messageContainer').append($deleteButton);
      }
    })

    .fail(() => {
      $('#messageContainer').text('Could not get messages');
    });
}); //document ready closure
