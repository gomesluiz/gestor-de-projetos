"use strict";

// Bootstrap Markdown
$(function () {
  $('#bs-markdown').markdown({
    iconlibrary: 'fa',
    footer: '<div id="md-character-footer"></div><small id="md-character-counter" class="text-muted">350 character left</small>',
    onChange: function onChange(e) {
      var contentLength = e.getContent().length;

      if (contentLength > 350) {
        $('#md-character-counter').removeClass('text-muted').addClass('text-danger').html(contentLength - 350 + ' character surplus.');
      } else {
        $('#md-character-counter').removeClass('text-danger').addClass('text-muted').html(350 - contentLength + ' character left.');
      }
    }
  }); // Update character counter

  $('#markdown').trigger('change'); // *******************************************************************
  // Fix icons

  $('.md-editor .fa-header').removeClass('fa fa-header').addClass('fas fa-heading');
  $('.md-editor .fa-picture-o').removeClass('fa fa-picture-o').addClass('far fa-image');
}); // Quill

$(function () {
  if (!window.Quill) {
    return $('#quill-editor,#quill-toolbar,#quill-bubble-editor,#quill-bubble-toolbar').remove();
  }

  var editor = new Quill('#quill-editor', {
    modules: {
      toolbar: '#quill-toolbar'
    },
    placeholder: 'Type something',
    theme: 'snow'
  }); // Get HTML content:
  //
  // var content = editor.root.innerHTML;
  //

  var bubbleEditor = new Quill('#quill-bubble-editor', {
    placeholder: 'Compose an epic...',
    modules: {
      toolbar: '#quill-bubble-toolbar'
    },
    theme: 'bubble'
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Zvcm1zX2VkaXRvcnMuanMiXSwibmFtZXMiOlsiJCIsIm1hcmtkb3duIiwiaWNvbmxpYnJhcnkiLCJmb290ZXIiLCJvbkNoYW5nZSIsImUiLCJjb250ZW50TGVuZ3RoIiwiZ2V0Q29udGVudCIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJodG1sIiwidHJpZ2dlciIsIndpbmRvdyIsIlF1aWxsIiwicmVtb3ZlIiwiZWRpdG9yIiwibW9kdWxlcyIsInRvb2xiYXIiLCJwbGFjZWhvbGRlciIsInRoZW1lIiwiYnViYmxlRWRpdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLENBQUMsQ0FBQyxZQUFXO0FBQ1hBLEVBQUFBLENBQUMsQ0FBQyxjQUFELENBQUQsQ0FBa0JDLFFBQWxCLENBQTJCO0FBQ3pCQyxJQUFBQSxXQUFXLEVBQUUsSUFEWTtBQUV6QkMsSUFBQUEsTUFBTSxFQUFFLG9IQUZpQjtBQUl6QkMsSUFBQUEsUUFBUSxFQUFFLGtCQUFTQyxDQUFULEVBQVk7QUFDcEIsVUFBSUMsYUFBYSxHQUFHRCxDQUFDLENBQUNFLFVBQUYsR0FBZUMsTUFBbkM7O0FBRUEsVUFBSUYsYUFBYSxHQUFHLEdBQXBCLEVBQXlCO0FBQ3ZCTixRQUFBQSxDQUFDLENBQUMsdUJBQUQsQ0FBRCxDQUNHUyxXQURILENBQ2UsWUFEZixFQUVHQyxRQUZILENBRVksYUFGWixFQUdHQyxJQUhILENBR1NMLGFBQWEsR0FBRyxHQUFqQixHQUF3QixxQkFIaEM7QUFJRCxPQUxELE1BS087QUFDTE4sUUFBQUEsQ0FBQyxDQUFDLHVCQUFELENBQUQsQ0FDR1MsV0FESCxDQUNlLGFBRGYsRUFFR0MsUUFGSCxDQUVZLFlBRlosRUFHR0MsSUFISCxDQUdTLE1BQU1MLGFBQVAsR0FBd0Isa0JBSGhDO0FBSUQ7QUFDRjtBQWxCd0IsR0FBM0IsRUFEVyxDQXNCWDs7QUFDQU4sRUFBQUEsQ0FBQyxDQUFDLFdBQUQsQ0FBRCxDQUFlWSxPQUFmLENBQXVCLFFBQXZCLEVBdkJXLENBMEJYO0FBQ0E7O0FBRUFaLEVBQUFBLENBQUMsQ0FBQyx1QkFBRCxDQUFELENBQTJCUyxXQUEzQixDQUF1QyxjQUF2QyxFQUF1REMsUUFBdkQsQ0FBZ0UsZ0JBQWhFO0FBQ0FWLEVBQUFBLENBQUMsQ0FBQywwQkFBRCxDQUFELENBQThCUyxXQUE5QixDQUEwQyxpQkFBMUMsRUFBNkRDLFFBQTdELENBQXNFLGNBQXRFO0FBQ0QsQ0EvQkEsQ0FBRCxDLENBaUNBOztBQUNBVixDQUFDLENBQUMsWUFBVztBQUNYLE1BQUksQ0FBQ2EsTUFBTSxDQUFDQyxLQUFaLEVBQW1CO0FBQ2pCLFdBQU9kLENBQUMsQ0FBQyx5RUFBRCxDQUFELENBQTZFZSxNQUE3RSxFQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsTUFBTSxHQUFHLElBQUlGLEtBQUosQ0FBVSxlQUFWLEVBQTJCO0FBQ3RDRyxJQUFBQSxPQUFPLEVBQUU7QUFDUEMsTUFBQUEsT0FBTyxFQUFFO0FBREYsS0FENkI7QUFJdENDLElBQUFBLFdBQVcsRUFBRSxnQkFKeUI7QUFLdENDLElBQUFBLEtBQUssRUFBRTtBQUwrQixHQUEzQixDQUFiLENBTFcsQ0FhWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFJQyxZQUFZLEdBQUcsSUFBSVAsS0FBSixDQUFVLHNCQUFWLEVBQWtDO0FBQ25ESyxJQUFBQSxXQUFXLEVBQUUsb0JBRHNDO0FBRW5ERixJQUFBQSxPQUFPLEVBQUU7QUFDUEMsTUFBQUEsT0FBTyxFQUFFO0FBREYsS0FGMEM7QUFLbkRFLElBQUFBLEtBQUssRUFBRTtBQUw0QyxHQUFsQyxDQUFuQjtBQU9ELENBekJBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCb290c3RyYXAgTWFya2Rvd25cbiQoZnVuY3Rpb24oKSB7XG4gICQoJyNicy1tYXJrZG93bicpLm1hcmtkb3duKHtcbiAgICBpY29ubGlicmFyeTogJ2ZhJyxcbiAgICBmb290ZXI6ICc8ZGl2IGlkPVwibWQtY2hhcmFjdGVyLWZvb3RlclwiPjwvZGl2PjxzbWFsbCBpZD1cIm1kLWNoYXJhY3Rlci1jb3VudGVyXCIgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+MzUwIGNoYXJhY3RlciBsZWZ0PC9zbWFsbD4nLFxuXG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gZS5nZXRDb250ZW50KCkubGVuZ3RoO1xuXG4gICAgICBpZiAoY29udGVudExlbmd0aCA+IDM1MCkge1xuICAgICAgICAkKCcjbWQtY2hhcmFjdGVyLWNvdW50ZXInKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1tdXRlZCcpXG4gICAgICAgICAgLmFkZENsYXNzKCd0ZXh0LWRhbmdlcicpXG4gICAgICAgICAgLmh0bWwoKGNvbnRlbnRMZW5ndGggLSAzNTApICsgJyBjaGFyYWN0ZXIgc3VycGx1cy4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNtZC1jaGFyYWN0ZXItY291bnRlcicpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpXG4gICAgICAgICAgLmFkZENsYXNzKCd0ZXh0LW11dGVkJylcbiAgICAgICAgICAuaHRtbCgoMzUwIC0gY29udGVudExlbmd0aCkgKyAnIGNoYXJhY3RlciBsZWZ0LicpO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFVwZGF0ZSBjaGFyYWN0ZXIgY291bnRlclxuICAkKCcjbWFya2Rvd24nKS50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gRml4IGljb25zXG5cbiAgJCgnLm1kLWVkaXRvciAuZmEtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ2ZhIGZhLWhlYWRlcicpLmFkZENsYXNzKCdmYXMgZmEtaGVhZGluZycpO1xuICAkKCcubWQtZWRpdG9yIC5mYS1waWN0dXJlLW8nKS5yZW1vdmVDbGFzcygnZmEgZmEtcGljdHVyZS1vJykuYWRkQ2xhc3MoJ2ZhciBmYS1pbWFnZScpO1xufSk7XG5cbi8vIFF1aWxsXG4kKGZ1bmN0aW9uKCkge1xuICBpZiAoIXdpbmRvdy5RdWlsbCkge1xuICAgIHJldHVybiAkKCcjcXVpbGwtZWRpdG9yLCNxdWlsbC10b29sYmFyLCNxdWlsbC1idWJibGUtZWRpdG9yLCNxdWlsbC1idWJibGUtdG9vbGJhcicpLnJlbW92ZSgpO1xuICB9XG5cbiAgdmFyIGVkaXRvciA9IG5ldyBRdWlsbCgnI3F1aWxsLWVkaXRvcicsIHtcbiAgICBtb2R1bGVzOiB7XG4gICAgICB0b29sYmFyOiAnI3F1aWxsLXRvb2xiYXInXG4gICAgfSxcbiAgICBwbGFjZWhvbGRlcjogJ1R5cGUgc29tZXRoaW5nJyxcbiAgICB0aGVtZTogJ3Nub3cnXG4gIH0pO1xuXG4gIC8vIEdldCBIVE1MIGNvbnRlbnQ6XG4gIC8vXG4gIC8vIHZhciBjb250ZW50ID0gZWRpdG9yLnJvb3QuaW5uZXJIVE1MO1xuICAvL1xuXG4gIHZhciBidWJibGVFZGl0b3IgPSBuZXcgUXVpbGwoJyNxdWlsbC1idWJibGUtZWRpdG9yJywge1xuICAgIHBsYWNlaG9sZGVyOiAnQ29tcG9zZSBhbiBlcGljLi4uJyxcbiAgICBtb2R1bGVzOiB7XG4gICAgICB0b29sYmFyOiAnI3F1aWxsLWJ1YmJsZS10b29sYmFyJ1xuICAgIH0sXG4gICAgdGhlbWU6ICdidWJibGUnXG4gIH0pO1xufSk7XG4iXSwiZmlsZSI6ImpzL2Zvcm1zX2VkaXRvcnMuZXM1LmpzIn0=
