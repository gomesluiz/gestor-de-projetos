"use strict";

$(function () {
  // Collapse sidenav by default
  window.layoutHelpers.setCollapsed(true, false); // Enable tooltips

  $('.messages-tooltip').tooltip();
  $('.messages-scroll').each(function () {
    new PerfectScrollbar(this, {
      suppressScrollX: true,
      wheelPropagation: true
    });
  });
  $('.messages-sidebox-toggler').click(function (e) {
    e.preventDefault();
    $('.messages-wrapper, .messages-card').toggleClass('messages-sidebox-open');
  }); // New message
  // {

  if (!window.Quill) {
    $('#message-editor,#message-editor-toolbar').remove();
    $('#message-editor-fallback').removeClass('d-none');
  } else {
    $('#message-editor-fallback').remove();
    new Quill('#message-editor', {
      modules: {
        toolbar: '#message-editor-toolbar'
      },
      placeholder: 'Type your message...',
      theme: 'snow'
    });
  } // }

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX21lc3NhZ2VzLmpzIl0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJsYXlvdXRIZWxwZXJzIiwic2V0Q29sbGFwc2VkIiwidG9vbHRpcCIsImVhY2giLCJQZXJmZWN0U2Nyb2xsYmFyIiwic3VwcHJlc3NTY3JvbGxYIiwid2hlZWxQcm9wYWdhdGlvbiIsImNsaWNrIiwiZSIsInByZXZlbnREZWZhdWx0IiwidG9nZ2xlQ2xhc3MiLCJRdWlsbCIsInJlbW92ZSIsInJlbW92ZUNsYXNzIiwibW9kdWxlcyIsInRvb2xiYXIiLCJwbGFjZWhvbGRlciIsInRoZW1lIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYO0FBQ0FDLEVBQUFBLE1BQU0sQ0FBQ0MsYUFBUCxDQUFxQkMsWUFBckIsQ0FBa0MsSUFBbEMsRUFBd0MsS0FBeEMsRUFIVyxDQUtYOztBQUNBSCxFQUFBQSxDQUFDLENBQUMsbUJBQUQsQ0FBRCxDQUF1QkksT0FBdkI7QUFFQUosRUFBQUEsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0JLLElBQXRCLENBQTJCLFlBQVc7QUFDcEMsUUFBSUMsZ0JBQUosQ0FBcUIsSUFBckIsRUFBMkI7QUFDekJDLE1BQUFBLGVBQWUsRUFBRSxJQURRO0FBRXpCQyxNQUFBQSxnQkFBZ0IsRUFBRTtBQUZPLEtBQTNCO0FBSUQsR0FMRDtBQU9BUixFQUFBQSxDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQlMsS0FBL0IsQ0FBcUMsVUFBU0MsQ0FBVCxFQUFZO0FBQy9DQSxJQUFBQSxDQUFDLENBQUNDLGNBQUY7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLG1DQUFELENBQUQsQ0FBdUNZLFdBQXZDLENBQW1ELHVCQUFuRDtBQUNELEdBSEQsRUFmVyxDQW9CWDtBQUNBOztBQUVFLE1BQUksQ0FBQ1gsTUFBTSxDQUFDWSxLQUFaLEVBQW1CO0FBQ2pCYixJQUFBQSxDQUFDLENBQUMseUNBQUQsQ0FBRCxDQUE2Q2MsTUFBN0M7QUFDQWQsSUFBQUEsQ0FBQyxDQUFDLDBCQUFELENBQUQsQ0FBOEJlLFdBQTlCLENBQTBDLFFBQTFDO0FBQ0QsR0FIRCxNQUdPO0FBQ0xmLElBQUFBLENBQUMsQ0FBQywwQkFBRCxDQUFELENBQThCYyxNQUE5QjtBQUNBLFFBQUlELEtBQUosQ0FBVSxpQkFBVixFQUE2QjtBQUMzQkcsTUFBQUEsT0FBTyxFQUFFO0FBQ1BDLFFBQUFBLE9BQU8sRUFBRTtBQURGLE9BRGtCO0FBSTNCQyxNQUFBQSxXQUFXLEVBQUUsc0JBSmM7QUFLM0JDLE1BQUFBLEtBQUssRUFBRTtBQUxvQixLQUE3QjtBQU9ELEdBbkNRLENBcUNYOztBQUVELENBdkNBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gIC8vIENvbGxhcHNlIHNpZGVuYXYgYnkgZGVmYXVsdFxuICB3aW5kb3cubGF5b3V0SGVscGVycy5zZXRDb2xsYXBzZWQodHJ1ZSwgZmFsc2UpO1xuXG4gIC8vIEVuYWJsZSB0b29sdGlwc1xuICAkKCcubWVzc2FnZXMtdG9vbHRpcCcpLnRvb2x0aXAoKTtcblxuICAkKCcubWVzc2FnZXMtc2Nyb2xsJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICBuZXcgUGVyZmVjdFNjcm9sbGJhcih0aGlzLCB7XG4gICAgICBzdXBwcmVzc1Njcm9sbFg6IHRydWUsXG4gICAgICB3aGVlbFByb3BhZ2F0aW9uOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJy5tZXNzYWdlcy1zaWRlYm94LXRvZ2dsZXInKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoJy5tZXNzYWdlcy13cmFwcGVyLCAubWVzc2FnZXMtY2FyZCcpLnRvZ2dsZUNsYXNzKCdtZXNzYWdlcy1zaWRlYm94LW9wZW4nKTtcbiAgfSk7XG5cbiAgLy8gTmV3IG1lc3NhZ2VcbiAgLy8ge1xuXG4gICAgaWYgKCF3aW5kb3cuUXVpbGwpIHtcbiAgICAgICQoJyNtZXNzYWdlLWVkaXRvciwjbWVzc2FnZS1lZGl0b3ItdG9vbGJhcicpLnJlbW92ZSgpO1xuICAgICAgJCgnI21lc3NhZ2UtZWRpdG9yLWZhbGxiYWNrJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjbWVzc2FnZS1lZGl0b3ItZmFsbGJhY2snKS5yZW1vdmUoKTtcbiAgICAgIG5ldyBRdWlsbCgnI21lc3NhZ2UtZWRpdG9yJywge1xuICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgdG9vbGJhcjogJyNtZXNzYWdlLWVkaXRvci10b29sYmFyJ1xuICAgICAgICB9LFxuICAgICAgICBwbGFjZWhvbGRlcjogJ1R5cGUgeW91ciBtZXNzYWdlLi4uJyxcbiAgICAgICAgdGhlbWU6ICdzbm93J1xuICAgICAgfSk7XG4gICAgfVxuXG4gIC8vIH1cblxufSk7XG4iXSwiZmlsZSI6ImpzL3BhZ2VzX21lc3NhZ2VzLmVzNS5qcyJ9