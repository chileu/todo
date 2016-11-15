$(function() {

  // The taskHtml method takes in a Javascript representation
  // of the task and produces an HTML representation using
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done? "completed" : "";
    var liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
    '<div class="view"><input class="toggle" type="checkbox"' +
    " data-id='" + task.id + "'" +
    checkedStatus +
    '><label>' +
    task.title +
    '</label><button class="destroy"' +
    " data-id='" + task.id + "'" +
    '></button><div></li>';

    return liElement;
  }

  // toggleTask takes in an HTML representation of
  // an event that fires from an HTML representation of
  // the toggle checkbox and performs an API request to toggle
  // the value of the 'done' field
  function toggleTask(e) {
    var itemId = $(e.target).data("id");

    var doneValue = Boolean($(e.target).is(':checked'));

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);          // takes the JS representation of the task and converts to HTML then stores in variable liHtml
      var $li = $("#listItem-" + data.id);  // build a jQuery selector to extract the HTML element from the page for the list item we need to update
      $li.replaceWith(liHtml);              // replace HTML of item with new HTML we've built
      $('.toggle').change(toggleTask);      // re-register the click handler to toggle the items
      $('.destroy').click(destroyTask);     // re-register the click handler to delete items      
    });
  }

  function destroyTask(e) {
    var itemId = $(e.target).data("id");

    $.ajax({
      url: "/tasks/" + itemId,
      type: 'DELETE',
      success: function(data) {
        var li = $("#listItem-" + itemId);
        li.remove();
        }
      });
  }

  $.get("/tasks").success( function( data ) {
    var htmlString = "";

    $.each(data, function(index, task) {

      htmlString += taskHtml(task);
    });
    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);

    $('.toggle').click(toggleTask);
    $('.destroy').click(destroyTask);

  });

  $('#new-form').submit(function(event) {
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
     $.post("/tasks", payload).success(function(data) {
       var htmlString = taskHtml(data);
       var ulTodos = $('.todo-list');
       ulTodos.append(htmlString);
       $('.new-todo').val('');
       $('.toggle').click(toggleTask);
       $('.destroy').click(destroyTask);
     });
  });

});
