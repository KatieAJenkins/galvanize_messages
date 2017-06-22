'use strict';

$(document).ready(function(){
  // console.log("It's ALIVE");
  $("#update").hide();

$('#submit').click(function (event){
 event.preventDefault();

  var name = $('#nameInput').val();
  console.log(name);

  var message = $('#messageInput').val();
  console.log(message);

  var options = {
    contentType: 'application/json',
    type: 'POST', //change this type based on what you are doing
    url: '/messages', //would also need to specify id if patching
    data: JSON.stringify({name, message})//set up object and stringify
  };

  $.ajax(options)
    .done(() => {
      // console.log('DONE');
      window.location.href = '/'; //reloads page once .done is called
    })
    .fail((err) => {
      console.log(err);
    });
});

  $.getJSON('/messages') //this fires after page reloads -->this is the API endpoint
    .done((results) => {
      console.log(results);//array of objs

      //Loop through results from getJSON call to dynamically add to page
      for (var i = 0; i < results.length; i++) {

        var $id = results[i].id;
        // console.log($id);

        var $name = results[i].name;

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

        var $name = $('<h6>').text(results[i].name);

        //Append all dynamically created DOM elements to message container
        $('#messageContainer').append($message);
        $('#messageContainer').append($name);
        $('#messageContainer').append($editButton);
        $('#messageContainer').append($deleteButton);

////EDIT FUNCTIONALITY/////
        $('.editButton').click(function(event){
          // console.log("clicked");
          event.preventDefault();
          // console.log(event);

          //Find ID of message to edit
          var editMessage = $(this);
          // console.log(editMessage);
          var editMessageId = editMessage[0].getAttribute('id').toString().substring(4);
          // console.log(editMessageId);

          var name = results[0].name;
          // console.log(name);

          var message = results[0].message;
          // console.log(message);

          $('#nameInput').val(name);

          $('#messageInput').val(message);

          //hide Submit button
          $('#submit').hide();

          //show hidden Update button
          $("#update").show().on('click', function () {

          let patchName = $('#nameInput').val();
          console.log(patchName);

          let patchMessage = $('#messageInput').val();
          console.log(patchMessage);

          //on click send patch request
            const options = {
              dataType: 'json',
              type: 'PATCH',
              url: `/messages/${editMessageId}`,
              data: JSON.stringify({patchName, patchMessage})
            };
            console.log(options);

            $.ajax(options)
              .done(() => {
                console.log('UPDATED!');
                // window.location.href = '/'; //reloads page once .done is called to remove text from page
              })
              .fail((err) => {
                console.log(err);
              });
            });
          });

////DELETE FUNCTIONALITY////
        $('.deleteButton').click(function(event) {
          event.preventDefault();
          // console.log("clicked");
          var deleteMessage = $(this);
          var deleteMessageID = deleteMessage[0].getAttribute('id').toString().substring(6);
          console.log(deleteMessageID);

          const options = {
            dataType: 'json',
            type: 'DELETE',
            url: `/messages/${deleteMessageID}`
          };

          $.ajax(options)
            .done(() => {
              // console.log('DELETED!');
              window.location.href = '/'; //reloads page once .done is called to remove text from page
            })
            .fail(($xhr) => {
              console.log($xhr);
            });
        });
    }
  })
  .fail(() => {
      $('#messageContainer').text('Could not get messages');
  });
}); //document ready closure
