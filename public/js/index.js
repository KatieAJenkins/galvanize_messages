'use strict';

$(document).ready(function(){
  // console.log("She's ALIVE");
  $("#update").hide();

$('#submit').click(function (event){
 event.preventDefault();

  var name = $('#nameInput').val();
  console.log(name);

  var message = $('#messageInput').val();
  console.log(message);

  var options = {
    contentType: 'application/json',
    type: 'POST',
    url: '/messages',
    data: JSON.stringify({name, message})
  };

  $.ajax(options)
    .done(() => {
      // console.log('DONE');
      window.location.href = '/';
    })
    .fail((err) => {
      console.log(err);
    });
});

  $.getJSON('/messages') //this fires after page reloads -->this is the API endpoint
    .done((results) => {
      //Loop through results from getJSON call to dynamically add to page
      for (var i = 0; i < results.length; i++) {

        var $id = results[i].id;
        // console.log($id);

        var $name = $('<h6>').text(results[i].name);

        var $message = $('<p>').text(results[i].message);

        //Create Edit and Delete buttons manually
        var $editButton = document.createElement('button');
        var $editMessage = document.createTextNode('Edit');
        $editButton.setAttribute("class", "editButton");
        $editButton.setAttribute("id", "edit"+ $id);
        $editButton.appendChild($editMessage);

        var $deleteButton = document.createElement('button');
        var $deleteMessage = document.createTextNode('Delete');
        $deleteButton.setAttribute("class", "deleteButton");
        $deleteButton.setAttribute("id", "delete" + $id);
        $deleteButton.appendChild($deleteMessage);

        //Append all dynamically created DOM elements to message container
        $('#messageContainer').append($message);
        $('#messageContainer').append($name);
        $('#messageContainer').append($editButton);
        $('#messageContainer').append($deleteButton);
      }
////EDIT FUNCTIONALITY/////
      $('.editButton').click(function(event){
        event.preventDefault();

        //hide Submit button
        $('#submit').hide();

        //Find ID of message to edit
        var editMessage = $(this);

        var editMessageID = editMessage[0].getAttribute('id').toString().substring(4);

        var name = results[0].name;

        var message = results[0].message;

        //add the input values to form fields to edit
        $('#nameInput').val(name);
        $('#messageInput').val(message);

        // //show hidden Update button
        $("#update").show();

        //ajax call on update button click
        $("#update").on('click', function (event) {
          event.preventDefault();

          let newName = $('#nameInput').val();
          console.log('newName', newName);

          let newMessage = $('#messageInput').val();
          console.log('newMessage', newMessage);

          $.ajax({
            url: `/messages/${editMessageID}`,
            type: 'PATCH',
            contentType: "application/json",
            data: JSON.stringify({newName, newMessage}),
            success: function(result) {
              console.log('patch successful!', result);
              window.location.href = '/';
            },
            fail: function(err) {
            console.log("error");
            console.error(err);
            }
          });
        });
      });

////DELETE FUNCTIONALITY////
        $('.deleteButton').click(function(event) {
          event.preventDefault();
          // console.log("clicked");
          var deleteMessage = $(this);
          var deleteMessageID = deleteMessage[0].getAttribute('id').toString().substring(6);

          const options = {
            type: 'DELETE',
            url: `/messages/${deleteMessageID}`
          };

          $.ajax(options)
            .done(() => {
              // console.log('DELETED!');
              window.location.href = '/';
            })
            .fail((err) => {
              console.log(err);
            });
        });
    })
    .fail(() => {
      $('#messageContainer').text('Could not get messages');
    });
}); //document ready closure
