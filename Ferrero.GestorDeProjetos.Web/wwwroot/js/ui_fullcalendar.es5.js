"use strict";

$(function () {
  var today = new Date();
  var y = today.getFullYear();
  var m = today.getMonth();
  var d = today.getDate();
  var eventList = [{
    title: 'All Day Event',
    start: new Date(y, m, d - 12)
  }, {
    title: 'Long Event',
    start: new Date(y, m, d - 8),
    end: new Date(y, m, d - 5),
    className: 'fc-event-warning'
  }, {
    id: 999,
    title: 'Repeating Event',
    start: new Date(y, m, d - 6, 16, 0)
  }, {
    id: 999,
    title: 'Repeating Event',
    start: new Date(y, m, d + 1, 16, 0),
    className: 'fc-event-success'
  }, {
    title: 'Conference',
    start: new Date(y, m, d - 4),
    end: new Date(y, m, d - 2)
  }, {
    title: 'Meeting',
    start: new Date(y, m, d - 3, 10, 30),
    end: new Date(y, m, d - 3, 12, 30),
    className: 'fc-event-danger'
  }, {
    title: 'Lunch',
    start: new Date(y, m, d - 3, 12, 0),
    className: 'fc-event-info'
  }, {
    title: 'Meeting',
    start: new Date(y, m, d - 3, 14, 30),
    className: 'fc-event-dark'
  }, {
    title: 'Happy Hour',
    start: new Date(y, m, d - 3, 17, 30)
  }, {
    title: 'Dinner',
    start: new Date(y, m, d - 3, 20, 0)
  }, {
    title: 'Birthday Party',
    start: new Date(y, m, d - 2, 7, 0)
  }, {
    title: 'Background event',
    start: new Date(y, m, d + 5),
    end: new Date(y, m, d + 7),
    rendering: 'background'
  }, {
    title: 'Click for Google',
    url: 'http://google.com/',
    start: new Date(y, m, d + 13)
  }]; // Default view
  // color classes: [ fc-event-success | fc-event-info | fc-event-warning | fc-event-danger | fc-event-dark ]

  var defaultCalendar = new Calendar($('#fullcalendar-default-view')[0], {
    plugins: [calendarPlugins.bootstrap, calendarPlugins.dayGrid, calendarPlugins.timeGrid, calendarPlugins.interaction],
    dir: $('html').attr('dir') || 'ltr',
    // Bootstrap styling
    themeSystem: 'bootstrap',
    bootstrapFontAwesome: {
      close: ' ion ion-md-close',
      prev: ' ion ion-ios-arrow-back scaleX--1-rtl',
      next: ' ion ion-ios-arrow-forward scaleX--1-rtl',
      prevYear: ' ion ion-ios-arrow-dropleft-circle scaleX--1-rtl',
      nextYear: ' ion ion-ios-arrow-dropright-circle scaleX--1-rtl'
    },
    header: {
      left: 'title',
      center: 'dayGridMonth,timeGridWeek,timeGridDay',
      right: 'prev,next today'
    },
    defaultDate: today,
    navLinks: true,
    // can click day/week names to navigate views
    selectable: true,
    weekNumbers: true,
    // Show week numbers
    nowIndicator: true,
    // Show "now" indicator
    firstDay: 1,
    // Set "Monday" as start of a week
    businessHours: {
      dow: [1, 2, 3, 4, 5],
      // Monday - Friday
      start: '9:00',
      end: '18:00'
    },
    editable: true,
    eventLimit: true,
    // allow "more" link when too many events
    events: eventList,
    views: {
      dayGrid: {
        eventLimit: 5
      }
    },
    select: function select(selectionData) {
      $('#fullcalendar-default-view-modal').on('shown.bs.modal', function () {
        $(this).find('input[type="text"]').trigger('focus');
      }).on('hidden.bs.modal', function () {
        $(this).off('shown.bs.modal hidden.bs.modal submit').find('input[type="text"], select').val('');
        defaultCalendar.unselect();
      }).on('submit', function (e) {
        e.preventDefault();
        var title = $(this).find('input[type="text"]').val();
        var className = $(this).find('select').val() || null;

        if (title) {
          var eventData = {
            title: title,
            start: selectionData.startStr,
            end: selectionData.endStr,
            className: className
          };
          defaultCalendar.addEvent(eventData);
        }

        $(this).modal('hide');
      }).modal('show');
    },
    eventClick: function eventClick(calEvent) {
      alert('Event: ' + calEvent.event.title);
    }
  });
  defaultCalendar.render(); // List view
  // color classes: [ fc-event-success | fc-event-info | fc-event-warning | fc-event-danger | fc-event-dark ]

  var listCalendar = new Calendar($('#fullcalendar-list-view')[0], {
    plugins: [calendarPlugins.bootstrap, calendarPlugins.list],
    dir: $('html').attr('dir') || 'ltr',
    // Bootstrap styling
    themeSystem: 'bootstrap',
    bootstrapFontAwesome: {
      close: ' ion ion-md-close',
      prev: ' ion ion-ios-arrow-back scaleX--1-rtl',
      next: ' ion ion-ios-arrow-forward scaleX--1-rtl',
      prevYear: ' ion ion-ios-arrow-dropleft-circle scaleX--1-rtl',
      nextYear: ' ion ion-ios-arrow-dropright-circle scaleX--1-rtl'
    },
    header: {
      left: 'title',
      center: 'listDay,listWeek,listMonth',
      right: 'prev,next today'
    },
    // customize the button names,
    views: {
      listDay: {
        buttonText: 'list day'
      },
      listWeek: {
        buttonText: 'list week'
      },
      listMonth: {
        buttonText: 'month'
      }
    },
    defaultView: 'listMonth',
    firstDay: 1,
    // Set "Monday" as start of a week
    navLinks: true,
    // can click day/week names to navigate views
    events: eventList
  });
  listCalendar.render(); // List view
  // color classes: [ fc-event-success | fc-event-info | fc-event-warning | fc-event-danger | fc-event-dark ]

  var timelineCalendar = new Calendar($('#fullcalendar-timeline-view')[0], {
    plugins: [calendarPlugins.bootstrap, calendarPlugins.interaction, calendarPlugins.timeline],
    dir: $('html').attr('dir') || 'ltr',
    // Bootstrap styling
    themeSystem: 'bootstrap',
    bootstrapFontAwesome: {
      close: ' ion ion-md-close',
      prev: ' ion ion-ios-arrow-back scaleX--1-rtl',
      next: ' ion ion-ios-arrow-forward scaleX--1-rtl',
      prevYear: ' ion ion-ios-arrow-dropleft-circle scaleX--1-rtl',
      nextYear: ' ion ion-ios-arrow-dropright-circle scaleX--1-rtl'
    },
    header: {
      left: 'title',
      center: 'timelineYear,timelineMonth,timelineWeek,timelineDay',
      right: 'prev,next today'
    },
    defaultView: 'timelineMonth',
    firstDay: 1,
    // Set "Monday" as start of a week
    navLinks: true,
    // can click day/week names to navigate views
    editable: true,
    events: eventList
  });
  timelineCalendar.render();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3VpX2Z1bGxjYWxlbmRhci5qcyJdLCJuYW1lcyI6WyIkIiwidG9kYXkiLCJEYXRlIiwieSIsImdldEZ1bGxZZWFyIiwibSIsImdldE1vbnRoIiwiZCIsImdldERhdGUiLCJldmVudExpc3QiLCJ0aXRsZSIsInN0YXJ0IiwiZW5kIiwiY2xhc3NOYW1lIiwiaWQiLCJyZW5kZXJpbmciLCJ1cmwiLCJkZWZhdWx0Q2FsZW5kYXIiLCJDYWxlbmRhciIsInBsdWdpbnMiLCJjYWxlbmRhclBsdWdpbnMiLCJib290c3RyYXAiLCJkYXlHcmlkIiwidGltZUdyaWQiLCJpbnRlcmFjdGlvbiIsImRpciIsImF0dHIiLCJ0aGVtZVN5c3RlbSIsImJvb3RzdHJhcEZvbnRBd2Vzb21lIiwiY2xvc2UiLCJwcmV2IiwibmV4dCIsInByZXZZZWFyIiwibmV4dFllYXIiLCJoZWFkZXIiLCJsZWZ0IiwiY2VudGVyIiwicmlnaHQiLCJkZWZhdWx0RGF0ZSIsIm5hdkxpbmtzIiwic2VsZWN0YWJsZSIsIndlZWtOdW1iZXJzIiwibm93SW5kaWNhdG9yIiwiZmlyc3REYXkiLCJidXNpbmVzc0hvdXJzIiwiZG93IiwiZWRpdGFibGUiLCJldmVudExpbWl0IiwiZXZlbnRzIiwidmlld3MiLCJzZWxlY3QiLCJzZWxlY3Rpb25EYXRhIiwib24iLCJmaW5kIiwidHJpZ2dlciIsIm9mZiIsInZhbCIsInVuc2VsZWN0IiwiZSIsInByZXZlbnREZWZhdWx0IiwiZXZlbnREYXRhIiwic3RhcnRTdHIiLCJlbmRTdHIiLCJhZGRFdmVudCIsIm1vZGFsIiwiZXZlbnRDbGljayIsImNhbEV2ZW50IiwiYWxlcnQiLCJldmVudCIsInJlbmRlciIsImxpc3RDYWxlbmRhciIsImxpc3QiLCJsaXN0RGF5IiwiYnV0dG9uVGV4dCIsImxpc3RXZWVrIiwibGlzdE1vbnRoIiwiZGVmYXVsdFZpZXciLCJ0aW1lbGluZUNhbGVuZGFyIiwidGltZWxpbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLENBQUMsQ0FBQyxZ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USxFQUFFLGtEQUpVO0FBS3BCQyxNQUFBQSxRQUFRLEVBQUU7QUFMVSxLQVZpRDtBQWtCdkVDLElBQUFBLE1BQU0sRUFBRTtBQUNOQyxNQUFBQSxJQUFJLEVBQUUsT0FEQTtBQUVOQyxNQUFBQSxNQUFNLEVBQUUscURBRkY7QUFHTkMsTUFBQUEsS0FBSyxFQUFFO0FBSEQsS0FsQitEO0FBd0J2RXVDLElBQUFBLFdBQVcsRUFBRSxlQXhCMEQ7QUF5QnZFakMsSUFBQUEsUUFBUSxFQUFFLENBekI2RDtBQXlCMUQ7QUFDYkosSUFBQUEsUUFBUSxFQUFFLElBMUI2RDtBQTBCdkQ7QUFDaEJPLElBQUFBLFFBQVEsRUFBRSxJQTNCNkQ7QUE0QnZFRSxJQUFBQSxNQUFNLEVBQUV2QztBQTVCK0QsR0FBbEQsQ0FBdkI7QUErQkFvRSxFQUFBQSxnQkFBZ0IsQ0FBQ1IsTUFBakI7QUFDRCxDQTlPQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbiAoKSB7XG4gIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIHZhciB5ID0gdG9kYXkuZ2V0RnVsbFllYXIoKTtcbiAgdmFyIG0gPSB0b2RheS5nZXRNb250aCgpO1xuICB2YXIgZCA9IHRvZGF5LmdldERhdGUoKTtcblxuICB2YXIgZXZlbnRMaXN0ID0gW3tcbiAgICB0aXRsZTogJ0FsbCBEYXkgRXZlbnQnLFxuICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gMTIpXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ0xvbmcgRXZlbnQnLFxuICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gOCksXG4gICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkIC0gNSksXG4gICAgY2xhc3NOYW1lOiAnZmMtZXZlbnQtd2FybmluZydcbiAgfSxcbiAge1xuICAgIGlkOiA5OTksXG4gICAgdGl0bGU6ICdSZXBlYXRpbmcgRXZlbnQnLFxuICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gNiwgMTYsIDApXG4gIH0sXG4gIHtcbiAgICBpZDogOTk5LFxuICAgIHRpdGxlOiAnUmVwZWF0aW5nIEV2ZW50JyxcbiAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDE2LCAwKSxcbiAgICBjbGFzc05hbWU6ICdmYy1ldmVudC1zdWNjZXNzJyxcbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnQ29uZmVyZW5jZScsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSA0KSxcbiAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIGQgLSAyKSxcbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnTWVldGluZycsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSAzLCAxMCwgMzApLFxuICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDEyLCAzMCksXG4gICAgY2xhc3NOYW1lOiAnZmMtZXZlbnQtZGFuZ2VyJ1xuICB9LFxuICB7XG4gICAgdGl0bGU6ICdMdW5jaCcsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgIC0gMywgMTIsIDApLFxuICAgIGNsYXNzTmFtZTogJ2ZjLWV2ZW50LWluZm8nXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ01lZXRpbmcnLFxuICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gMywgMTQsIDMwKSxcbiAgICBjbGFzc05hbWU6ICdmYy1ldmVudC1kYXJrJ1xuICB9LFxuICB7XG4gICAgdGl0bGU6ICdIYXBweSBIb3VyJyxcbiAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDE3LCAzMClcbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnRGlubmVyJyxcbiAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDMsIDIwLCAwKVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdCaXJ0aGRheSBQYXJ0eScsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSAyLCA3LCAwKVxuICB9LFxuICB7XG4gICAgdGl0bGU6ICdCYWNrZ3JvdW5kIGV2ZW50JyxcbiAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDUpLFxuICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCArIDcpLFxuICAgIHJlbmRlcmluZzogJ2JhY2tncm91bmQnXG4gIH0sXG4gIHtcbiAgICB0aXRsZTogJ0NsaWNrIGZvciBHb29nbGUnLFxuICAgIHVybDogJ2h0dHA6Ly9nb29nbGUuY29tLycsXG4gICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxMylcbiAgfV07XG5cbiAgLy8gRGVmYXVsdCB2aWV3XG4gIC8vIGNvbG9yIGNsYXNzZXM6IFsgZmMtZXZlbnQtc3VjY2VzcyB8IGZjLWV2ZW50LWluZm8gfCBmYy1ldmVudC13YXJuaW5nIHwgZmMtZXZlbnQtZGFuZ2VyIHwgZmMtZXZlbnQtZGFyayBdXG4gIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSBuZXcgQ2FsZW5kYXIoJCgnI2Z1bGxjYWxlbmRhci1kZWZhdWx0LXZpZXcnKVswXSwge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy5ib290c3RyYXAsXG4gICAgICBjYWxlbmRhclBsdWdpbnMuZGF5R3JpZCxcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy50aW1lR3JpZCxcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy5pbnRlcmFjdGlvblxuICAgIF0sXG4gICAgZGlyOiAkKCdodG1sJykuYXR0cignZGlyJykgfHwgJ2x0cicsXG5cbiAgICAvLyBCb290c3RyYXAgc3R5bGluZ1xuICAgIHRoZW1lU3lzdGVtOiAnYm9vdHN0cmFwJyxcbiAgICBib290c3RyYXBGb250QXdlc29tZToge1xuICAgICAgY2xvc2U6ICcgaW9uIGlvbi1tZC1jbG9zZScsXG4gICAgICBwcmV2OiAnIGlvbiBpb24taW9zLWFycm93LWJhY2sgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0OiAnIGlvbiBpb24taW9zLWFycm93LWZvcndhcmQgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBwcmV2WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wbGVmdC1jaXJjbGUgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlIHNjYWxlWC0tMS1ydGwnXG4gICAgfSxcblxuICAgIGhlYWRlcjoge1xuICAgICAgbGVmdDogJ3RpdGxlJyxcbiAgICAgIGNlbnRlcjogJ2RheUdyaWRNb250aCx0aW1lR3JpZFdlZWssdGltZUdyaWREYXknLFxuICAgICAgcmlnaHQ6ICdwcmV2LG5leHQgdG9kYXknXG4gICAgfSxcblxuICAgIGRlZmF1bHREYXRlOiB0b2RheSxcbiAgICBuYXZMaW5rczogdHJ1ZSwgLy8gY2FuIGNsaWNrIGRheS93ZWVrIG5hbWVzIHRvIG5hdmlnYXRlIHZpZXdzXG4gICAgc2VsZWN0YWJsZTogdHJ1ZSxcbiAgICB3ZWVrTnVtYmVyczogdHJ1ZSwgLy8gU2hvdyB3ZWVrIG51bWJlcnNcbiAgICBub3dJbmRpY2F0b3I6IHRydWUsIC8vIFNob3cgXCJub3dcIiBpbmRpY2F0b3JcbiAgICBmaXJzdERheTogMSwgLy8gU2V0IFwiTW9uZGF5XCIgYXMgc3RhcnQgb2YgYSB3ZWVrXG4gICAgYnVzaW5lc3NIb3Vyczoge1xuICAgICAgZG93OiBbMSwgMiwgMywgNCwgNV0sIC8vIE1vbmRheSAtIEZyaWRheVxuICAgICAgc3RhcnQ6ICc5OjAwJyxcbiAgICAgIGVuZDogJzE4OjAwJyxcbiAgICB9LFxuICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgIGV2ZW50TGltaXQ6IHRydWUsIC8vIGFsbG93IFwibW9yZVwiIGxpbmsgd2hlbiB0b28gbWFueSBldmVudHNcbiAgICBldmVudHM6IGV2ZW50TGlzdCxcblxuICAgIHZpZXdzOiB7XG4gICAgICBkYXlHcmlkOiB7XG4gICAgICAgIGV2ZW50TGltaXQ6IDVcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2VsZWN0OiBmdW5jdGlvbiAoc2VsZWN0aW9uRGF0YSkge1xuICAgICAgJCgnI2Z1bGxjYWxlbmRhci1kZWZhdWx0LXZpZXctbW9kYWwnKVxuICAgICAgICAub24oJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLm9mZignc2hvd24uYnMubW9kYWwgaGlkZGVuLmJzLm1vZGFsIHN1Ym1pdCcpXG4gICAgICAgICAgICAuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0sIHNlbGVjdCcpLnZhbCgnJyk7XG4gICAgICAgICAgZGVmYXVsdENhbGVuZGFyLnVuc2VsZWN0KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykudmFsKCk7XG4gICAgICAgICAgdmFyIGNsYXNzTmFtZSA9ICQodGhpcykuZmluZCgnc2VsZWN0JykudmFsKCkgfHwgbnVsbDtcblxuICAgICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgICBzdGFydDogc2VsZWN0aW9uRGF0YS5zdGFydFN0cixcbiAgICAgICAgICAgICAgZW5kOiBzZWxlY3Rpb25EYXRhLmVuZFN0cixcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHRDYWxlbmRhci5hZGRFdmVudChldmVudERhdGEpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQodGhpcykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm1vZGFsKCdzaG93Jyk7XG4gICAgfSxcblxuICAgIGV2ZW50Q2xpY2s6IGZ1bmN0aW9uKGNhbEV2ZW50KSB7XG4gICAgICBhbGVydCgnRXZlbnQ6ICcgKyBjYWxFdmVudC5ldmVudC50aXRsZSk7XG4gICAgfVxuICB9KTtcblxuICBkZWZhdWx0Q2FsZW5kYXIucmVuZGVyKCk7XG5cbiAgLy8gTGlzdCB2aWV3XG4gIC8vIGNvbG9yIGNsYXNzZXM6IFsgZmMtZXZlbnQtc3VjY2VzcyB8IGZjLWV2ZW50LWluZm8gfCBmYy1ldmVudC13YXJuaW5nIHwgZmMtZXZlbnQtZGFuZ2VyIHwgZmMtZXZlbnQtZGFyayBdXG4gIHZhciBsaXN0Q2FsZW5kYXIgPSBuZXcgQ2FsZW5kYXIoJCgnI2Z1bGxjYWxlbmRhci1saXN0LXZpZXcnKVswXSwge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy5ib290c3RyYXAsXG4gICAgICBjYWxlbmRhclBsdWdpbnMubGlzdFxuICAgIF0sXG4gICAgZGlyOiAkKCdodG1sJykuYXR0cignZGlyJykgfHwgJ2x0cicsXG5cbiAgICAvLyBCb290c3RyYXAgc3R5bGluZ1xuICAgIHRoZW1lU3lzdGVtOiAnYm9vdHN0cmFwJyxcbiAgICBib290c3RyYXBGb250QXdlc29tZToge1xuICAgICAgY2xvc2U6ICcgaW9uIGlvbi1tZC1jbG9zZScsXG4gICAgICBwcmV2OiAnIGlvbiBpb24taW9zLWFycm93LWJhY2sgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0OiAnIGlvbiBpb24taW9zLWFycm93LWZvcndhcmQgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBwcmV2WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wbGVmdC1jaXJjbGUgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlIHNjYWxlWC0tMS1ydGwnXG4gICAgfSxcblxuICAgIGhlYWRlcjoge1xuICAgICAgbGVmdDogJ3RpdGxlJyxcbiAgICAgIGNlbnRlcjogJ2xpc3REYXksbGlzdFdlZWssbGlzdE1vbnRoJyxcbiAgICAgIHJpZ2h0OiAncHJldixuZXh0IHRvZGF5J1xuICAgIH0sXG5cbiAgICAvLyBjdXN0b21pemUgdGhlIGJ1dHRvbiBuYW1lcyxcbiAgICB2aWV3czoge1xuICAgICAgbGlzdERheToge1xuICAgICAgICBidXR0b25UZXh0OiAnbGlzdCBkYXknXG4gICAgICB9LFxuICAgICAgbGlzdFdlZWs6IHtcbiAgICAgICAgYnV0dG9uVGV4dDogJ2xpc3Qgd2VlaydcbiAgICAgIH0sXG4gICAgICBsaXN0TW9udGg6IHtcbiAgICAgICAgYnV0dG9uVGV4dDogJ21vbnRoJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWZhdWx0VmlldzogJ2xpc3RNb250aCcsXG4gICAgZmlyc3REYXk6IDEsIC8vIFNldCBcIk1vbmRheVwiIGFzIHN0YXJ0IG9mIGEgd2Vla1xuICAgIG5hdkxpbmtzOiB0cnVlLCAvLyBjYW4gY2xpY2sgZGF5L3dlZWsgbmFtZXMgdG8gbmF2aWdhdGUgdmlld3NcbiAgICBldmVudHM6IGV2ZW50TGlzdFxuICB9KTtcblxuICBsaXN0Q2FsZW5kYXIucmVuZGVyKCk7XG5cbiAgLy8gTGlzdCB2aWV3XG4gIC8vIGNvbG9yIGNsYXNzZXM6IFsgZmMtZXZlbnQtc3VjY2VzcyB8IGZjLWV2ZW50LWluZm8gfCBmYy1ldmVudC13YXJuaW5nIHwgZmMtZXZlbnQtZGFuZ2VyIHwgZmMtZXZlbnQtZGFyayBdXG4gIHZhciB0aW1lbGluZUNhbGVuZGFyID0gbmV3IENhbGVuZGFyKCQoJyNmdWxsY2FsZW5kYXItdGltZWxpbmUtdmlldycpWzBdLCB7XG4gICAgcGx1Z2luczogW1xuICAgICAgY2FsZW5kYXJQbHVnaW5zLmJvb3RzdHJhcCxcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy5pbnRlcmFjdGlvbixcbiAgICAgIGNhbGVuZGFyUGx1Z2lucy50aW1lbGluZVxuICAgIF0sXG4gICAgZGlyOiAkKCdodG1sJykuYXR0cignZGlyJykgfHwgJ2x0cicsXG5cbiAgICAvLyBCb290c3RyYXAgc3R5bGluZ1xuICAgIHRoZW1lU3lzdGVtOiAnYm9vdHN0cmFwJyxcbiAgICBib290c3RyYXBGb250QXdlc29tZToge1xuICAgICAgY2xvc2U6ICcgaW9uIGlvbi1tZC1jbG9zZScsXG4gICAgICBwcmV2OiAnIGlvbiBpb24taW9zLWFycm93LWJhY2sgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0OiAnIGlvbiBpb24taW9zLWFycm93LWZvcndhcmQgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBwcmV2WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wbGVmdC1jaXJjbGUgc2NhbGVYLS0xLXJ0bCcsXG4gICAgICBuZXh0WWVhcjogJyBpb24gaW9uLWlvcy1hcnJvdy1kcm9wcmlnaHQtY2lyY2xlIHNjYWxlWC0tMS1ydGwnXG4gICAgfSxcblxuICAgIGhlYWRlcjoge1xuICAgICAgbGVmdDogJ3RpdGxlJyxcbiAgICAgIGNlbnRlcjogJ3RpbWVsaW5lWWVhcix0aW1lbGluZU1vbnRoLHRpbWVsaW5lV2Vlayx0aW1lbGluZURheScsXG4gICAgICByaWdodDogJ3ByZXYsbmV4dCB0b2RheSdcbiAgICB9LFxuXG4gICAgZGVmYXVsdFZpZXc6ICd0aW1lbGluZU1vbnRoJyxcbiAgICBmaXJzdERheTogMSwgLy8gU2V0IFwiTW9uZGF5XCIgYXMgc3RhcnQgb2YgYSB3ZWVrXG4gICAgbmF2TGlua3M6IHRydWUsIC8vIGNhbiBjbGljayBkYXkvd2VlayBuYW1lcyB0byBuYXZpZ2F0ZSB2aWV3c1xuICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgIGV2ZW50czogZXZlbnRMaXN0XG4gIH0pO1xuXG4gIHRpbWVsaW5lQ2FsZW5kYXIucmVuZGVyKCk7XG59KTtcbiJdLCJmaWxlIjoianMvdWlfZnVsbGNhbGVuZGFyLmVzNS5qcyJ9
