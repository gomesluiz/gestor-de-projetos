"use strict";

$(function () {
  $('.ticket-assignee').tooltip();
  $('#ticket-tags').tagsinput({
    tagClass: 'badge badge-primary'
  });
  $('#ticket-upload-dropzone').dropzone({
    parallelUploads: 2,
    maxFilesize: 50000,
    filesizeBase: 1000,
    addRemoveLinks: true
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX3RpY2tldHNfZWRpdC5qcyJdLCJuYW1lcyI6WyIkIiwidG9vbHRpcCIsInRhZ3NpbnB1dCIsInRhZ0NsYXNzIiwiZHJvcHpvbmUiLCJwYXJhbGxlbFVwbG9hZHMiLCJtYXhGaWxlc2l6ZSIsImZpbGVzaXplQmFzZSIsImFkZFJlbW92ZUxpbmtzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYQSxFQUFBQSxDQUFDLENBQUMsa0JBQUQsQ0FBRCxDQUFzQkMsT0FBdEI7QUFFQUQsRUFBQUEsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxDQUFrQkUsU0FBbEIsQ0FBNEI7QUFBRUMsSUFBQUEsUUFBUSxFQUFFO0FBQVosR0FBNUI7QUFFQUgsRUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJJLFFBQTdCLENBQXNDO0FBQ3BDQyxJQUFBQSxlQUFlLEVBQUUsQ0FEbUI7QUFFcENDLElBQUFBLFdBQVcsRUFBTSxLQUZtQjtBQUdwQ0MsSUFBQUEsWUFBWSxFQUFLLElBSG1CO0FBSXBDQyxJQUFBQSxjQUFjLEVBQUc7QUFKbUIsR0FBdEM7QUFPRCxDQWJBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gICQoJy50aWNrZXQtYXNzaWduZWUnKS50b29sdGlwKCk7XG5cbiAgJCgnI3RpY2tldC10YWdzJykudGFnc2lucHV0KHsgdGFnQ2xhc3M6ICdiYWRnZSBiYWRnZS1wcmltYXJ5JyB9KTtcblxuICAkKCcjdGlja2V0LXVwbG9hZC1kcm9wem9uZScpLmRyb3B6b25lKHtcbiAgICBwYXJhbGxlbFVwbG9hZHM6IDIsXG4gICAgbWF4RmlsZXNpemU6ICAgICA1MDAwMCxcbiAgICBmaWxlc2l6ZUJhc2U6ICAgIDEwMDAsXG4gICAgYWRkUmVtb3ZlTGlua3M6ICB0cnVlXG4gIH0pO1xuXG59KTtcbiJdLCJmaWxlIjoianMvcGFnZXNfdGlja2V0c19lZGl0LmVzNS5qcyJ9