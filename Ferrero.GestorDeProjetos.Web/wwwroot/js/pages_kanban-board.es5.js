"use strict";

$(function () {
  // Drag&Drop
  dragula(Array.prototype.slice.call(document.querySelectorAll('.kanban-box'))); // RTL

  if ($('html').attr('dir') === 'rtl') {
    $('.kanban-board-actions .dropdown-menu').removeClass('dropdown-menu-right');
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX2thbmJhbi1ib2FyZC5qcyJdLCJuYW1lcyI6WyIkIiwiZHJhZ3VsYSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYXR0ciIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYO0FBRUFDLEVBQUFBLE9BQU8sQ0FDTEMsS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsYUFBMUIsQ0FBM0IsQ0FESyxDQUFQLENBSlcsQ0FRWDs7QUFFQSxNQUFJUCxDQUFDLENBQUMsTUFBRCxDQUFELENBQVVRLElBQVYsQ0FBZSxLQUFmLE1BQTBCLEtBQTlCLEVBQXFDO0FBQ25DUixJQUFBQSxDQUFDLENBQUMsc0NBQUQsQ0FBRCxDQUEwQ1MsV0FBMUMsQ0FBc0QscUJBQXREO0FBQ0Q7QUFFRixDQWRBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gIC8vIERyYWcmRHJvcFxuXG4gIGRyYWd1bGEoXG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmthbmJhbi1ib3gnKSlcbiAgKTtcblxuICAvLyBSVExcblxuICBpZiAoJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJykge1xuICAgICQoJy5rYW5iYW4tYm9hcmQtYWN0aW9ucyAuZHJvcGRvd24tbWVudScpLnJlbW92ZUNsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4gIH1cblxufSk7XG4iXSwiZmlsZSI6ImpzL3BhZ2VzX2thbmJhbi1ib2FyZC5lczUuanMifQ==