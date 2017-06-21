'use strict';

$(document).ready(function(){
  // console.log("It's ALIVE");

$('#submit').click(function (event){
 // console.log($('#nameInput').val())
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
      window.location.href = '/'; //reloads page once infor is received
    })
    .fail(($xhr) => {
      console.log($xhr);
    });

});

  $.getJSON('/messages') //this fires after page reloads -->this is the API endpoint
    .done((results) => {
      console.log(results);//array of objs

      for (var i = 0; i < results.length; i++) {
        var $message = $('<p>').text(results[i].message);
        var $editButton = document.createElement('button');
        var $editMessage = document.createTextNode('Edit');
        $editButton.appendChild($editMessage);
        // document.body.appendChild($editButton);
        var $deleteButton = document.createElement('button');
        var $deleteMessage = document.createTextNode('Delete');
        $deleteButton.appendChild($deleteMessage);

        // <a id="editBook" class="waves-effect waves-light btn-large amber darken-3">
        //      <i class="material-icons left">edit</i>
        //      Edit
        //    </a>

        var $name = $('<h6>').text(results[i].name);

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
