"use strict";

// Bootstrap Datepicker
$(function () {
  var isRtl = $('html').attr('dir') === 'rtl';
  $('.datepicker-base').datepicker({
    orientation: isRtl ? 'auto right' : 'auto left',
    format: 'dd/mm/yyyy',
    language: 'pt-BR'
  });
  $('#datepicker-features').datepicker({
    calendarWeeks: true,
    todayBtn: 'linked',
    daysOfWeekDisabled: '1',
    clearBtn: true,
    todayHighlight: true,
    multidate: true,
    daysOfWeekHighlighted: '1,2',
    orientation: isRtl ? 'auto left' : 'auto right',
    format: 'dd/mm/yyyy',
    language: 'pt-BR',
    beforeShowMonth: function beforeShowMonth(date) {
      if (date.getMonth() === 8) {
        return false;
      }
    },
    beforeShowYear: function beforeShowYear(date) {
      if (date.getFullYear() === 2014) {
        return false;
      }
    }
  });
  $('#datepicker-range').datepicker({
    orientation: isRtl ? 'auto right' : 'auto left'
  });
  $('#datepicker-inline').datepicker();
}); // Bootstrap Daterangepicker

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  $('#daterange-1').daterangepicker({
    opens: isRtl ? 'left' : 'right',
    showWeekNumbers: true
  });
  $('#daterange-2').daterangepicker({
    timePicker: true,
    timePickerIncrement: 30,
    locale: {
      format: 'MM/DD/YYYY h:mm A'
    },
    opens: isRtl ? 'left' : 'right'
  });
  $('#daterange-3').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    opens: isRtl ? 'left' : 'right'
  }, function (start, end, label) {
    var years = moment().diff(start, 'years');
    alert("You are " + years + " years old.");
  }); // Button

  var start = moment().subtract(29, 'days');
  var end = moment();

  function cb(start, end) {
    $('#daterange-4').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  }

  $('#daterange-4').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: isRtl ? 'left' : 'right'
  }, cb);
  cb(start, end);
}); // Bootstrap Material DateTimePicker

$(function () {
  $('#b-m-dtp-date').bootstrapMaterialDatePicker({
    weekStart: 0,
    time: false,
    clearButton: true
  });
  $('#b-m-dtp-time').bootstrapMaterialDatePicker({
    date: false,
    shortTime: false,
    format: 'HH:mm'
  });
  $('#b-m-dtp-datetime').bootstrapMaterialDatePicker({
    weekStart: 1,
    format: 'dddd DD MMMM YYYY - HH:mm',
    shortTime: true,
    nowButton: true,
    minDate: new Date()
  });
}); // jQuery Timepicker

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  $('#timepicker-example-1').timepicker({
    scrollDefault: 'now',
    orientation: isRtl ? 'r' : 'l'
  });
  $('#timepicker-example-2').timepicker({
    minTime: '2:00pm',
    maxTime: '11:30pm',
    showDuration: true,
    orientation: isRtl ? 'r' : 'l'
  });
  $('#timepicker-example-3').timepicker({
    disableTimeRanges: [['1am', '2am'], ['3am', '4:01am']],
    orientation: isRtl ? 'r' : 'l'
  });
  $('#timepicker-example-4').timepicker({
    'timeFormat': 'H:i:s',
    orientation: isRtl ? 'r' : 'l'
  });
  $('#timepicker-example-5').timepicker({
    'timeFormat': 'h:i A',
    orientation: isRtl ? 'r' : 'l'
  });
  $('#timepicker-example-6').timepicker({
    'step': 15,
    orientation: isRtl ? 'r' : 'l'
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Zvcm1zX3BpY2tlcnMuanMiXSwibmFtZXMiOlsiJCIsImlzUnRsIiwiYXR0ciIsImRhdGVwaWNrZXIiLCJvcmllbnRhdGlvbiIsImZvcm1hdCIsImxhbmd1YWdlIiwiY2FsZW5kYXJXZWVrcyIsInRvZGF5QnRuIiwiZGF5c09mV2Vla0Rpc2FibGVkIiwiY2xlYXJCdG4iLCJ0b2RheUhpZ2hsaWdodCIsIm11bHRpZGF0ZSIsImRheXNPZldlZWtIaWdobGlnaHRlZCIsImJlZm9yZVNob3dNb250aCIsImRhdGUiLCJnZXRNb250aCIsImJlZm9yZVNob3dZZWFyIiwiZ2V0RnVsbFllYXIiLCJkYXRlcmFuZ2VwaWNrZXIiLCJvcGVucyIsInNob3dXZWVrTnVtYmVycyIsInRpbWVQaWNrZXIiLCJ0aW1lUGlja2VySW5jcmVtZW50IiwibG9jYWxlIiwic2luZ2xlRGF0ZVBpY2tlciIsInNob3dEcm9wZG93bnMiLCJzdGFydCIsImVuZCIsImxhYmVsIiwieWVhcnMiLCJtb21lbnQiLCJkaWZmIiwiYWxlcnQiLCJzdWJ0cmFjdCIsImNiIiwiaHRtbCIsInN0YXJ0RGF0ZSIsImVuZERhdGUiLCJyYW5nZXMiLCJzdGFydE9mIiwiZW5kT2YiLCJib290c3RyYXBNYXRlcmlhbERhdGVQaWNrZXIiLCJ3ZWVrU3RhcnQiLCJ0aW1lIiwiY2xlYXJCdXR0b24iLCJzaG9ydFRpbWUiLCJub3dCdXR0b24iLCJtaW5EYXRlIiwiRGF0ZSIsInRpbWVwaWNrZXIiLCJzY3JvbGxEZWZhdWx0IiwibWluVGltZSIsIm1heFRpbWUiLCJzaG93RHVyYXRpb24iLCJkaXNhYmxlVGltZVJhbmdlcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxDQUFDLENBQUMsWUFBVztBQUNYLE1BQUlDLEtBQUssR0FBR0QsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUF0QztBQUVBRixFQUFBQSxDQUFDLENBQUMsa0JBQUQsQ0FBRCxDQUFzQkcsVUFBdEIs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RCxVQUEzQixDQUFzQztBQUNwQyxZQUFRLEVBRDRCO0FBRXBDOUMsSUFBQUEsV0FBVyxFQUFHSCxLQUFLLEdBQUcsR0FBSCxHQUFTO0FBRlEsR0FBdEM7QUFJRCxDQXBDQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQm9vdHN0cmFwIERhdGVwaWNrZXJcbiQoZnVuY3Rpb24oKSB7XG4gIHZhciBpc1J0bCA9ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG5cbiAgJCgnLmRhdGVwaWNrZXItYmFzZScpLmRhdGVwaWNrZXIoe1xuICAgIG9yaWVudGF0aW9uOiBpc1J0bCA/ICdhdXRvIHJpZ2h0JyA6ICdhdXRvIGxlZnQnLFxuICAgIGZvcm1hdDogJ2RkL21tL3l5eXknLCAgICAgICAgICAgICAgICBcbiAgICBsYW5ndWFnZTogJ3B0LUJSJ1xuICB9KTtcbiAgJCgnI2RhdGVwaWNrZXItZmVhdHVyZXMnKS5kYXRlcGlja2VyKHtcbiAgICBjYWxlbmRhcldlZWtzOiAgICAgICAgIHRydWUsXG4gICAgdG9kYXlCdG46ICAgICAgICAgICAgICAnbGlua2VkJyxcbiAgICBkYXlzT2ZXZWVrRGlzYWJsZWQ6ICAgICcxJyxcbiAgICBjbGVhckJ0bjogICAgICAgICAgICAgIHRydWUsXG4gICAgdG9kYXlIaWdobGlnaHQ6ICAgICAgICB0cnVlLFxuICAgIG11bHRpZGF0ZTogICAgICAgICAgICAgdHJ1ZSxcbiAgICBkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6ICcxLDInLFxuICAgIG9yaWVudGF0aW9uOiBpc1J0bCA/ICdhdXRvIGxlZnQnIDogJ2F1dG8gcmlnaHQnLFxuICAgIGZvcm1hdDogJ2RkL21tL3l5eXknLCAgICAgICAgICAgICAgICBcbiAgICBsYW5ndWFnZTogJ3B0LUJSJyxcblxuICAgIGJlZm9yZVNob3dNb250aDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgaWYgKGRhdGUuZ2V0TW9udGgoKSA9PT0gOCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJlZm9yZVNob3dZZWFyOiBmdW5jdGlvbihkYXRlKXtcbiAgICAgIGlmIChkYXRlLmdldEZ1bGxZZWFyKCkgPT09IDIwMTQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gICQoJyNkYXRlcGlja2VyLXJhbmdlJykuZGF0ZXBpY2tlcih7XG4gICAgb3JpZW50YXRpb246IGlzUnRsID8gJ2F1dG8gcmlnaHQnIDogJ2F1dG8gbGVmdCdcbiAgfSk7XG4gICQoJyNkYXRlcGlja2VyLWlubGluZScpLmRhdGVwaWNrZXIoKTtcbn0pO1xuXG4vLyBCb290c3RyYXAgRGF0ZXJhbmdlcGlja2VyXG4kKGZ1bmN0aW9uKCkge1xuICB2YXIgaXNSdGwgPSAkKCdib2R5JykuYXR0cignZGlyJykgPT09ICdydGwnIHx8ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG5cbiAgJCgnI2RhdGVyYW5nZS0xJykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICBvcGVuczogKGlzUnRsID8gJ2xlZnQnIDogJ3JpZ2h0JyksXG4gICAgc2hvd1dlZWtOdW1iZXJzOiB0cnVlXG4gIH0pO1xuXG4gICQoJyNkYXRlcmFuZ2UtMicpLmRhdGVyYW5nZXBpY2tlcih7XG4gICAgdGltZVBpY2tlcjogdHJ1ZSxcbiAgICB0aW1lUGlja2VySW5jcmVtZW50OiAzMCxcbiAgICBsb2NhbGU6IHtcbiAgICAgIGZvcm1hdDogJ01NL0REL1lZWVkgaDptbSBBJ1xuICAgIH0sXG4gICAgb3BlbnM6IChpc1J0bCA/ICdsZWZ0JyA6ICdyaWdodCcpXG4gIH0pO1xuXG4gICQoJyNkYXRlcmFuZ2UtMycpLmRhdGVyYW5nZXBpY2tlcih7XG4gICAgICBzaW5nbGVEYXRlUGlja2VyOiB0cnVlLFxuICAgICAgc2hvd0Ryb3Bkb3duczogdHJ1ZSxcbiAgICAgIG9wZW5zOiAoaXNSdGwgPyAnbGVmdCcgOiAncmlnaHQnKVxuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGxhYmVsKSB7XG4gICAgICB2YXIgeWVhcnMgPSBtb21lbnQoKS5kaWZmKHN0YXJ0LCAneWVhcnMnKTtcblxuICAgICAgYWxlcnQoXCJZb3UgYXJlIFwiICsgeWVhcnMgKyBcIiB5ZWFycyBvbGQuXCIpO1xuICAgIH1cbiAgKTtcblxuICAvLyBCdXR0b25cblxuICB2YXIgc3RhcnQgPSBtb21lbnQoKS5zdWJ0cmFjdCgyOSwgJ2RheXMnKTtcbiAgdmFyIGVuZCA9IG1vbWVudCgpO1xuXG4gIGZ1bmN0aW9uIGNiKHN0YXJ0LCBlbmQpIHtcbiAgICAkKCcjZGF0ZXJhbmdlLTQnKS5odG1sKHN0YXJ0LmZvcm1hdCgnTU1NTSBELCBZWVlZJykgKyAnIC0gJyArIGVuZC5mb3JtYXQoJ01NTU0gRCwgWVlZWScpKTtcbiAgfVxuXG4gICQoJyNkYXRlcmFuZ2UtNCcpLmRhdGVyYW5nZXBpY2tlcih7XG4gICAgc3RhcnREYXRlOiBzdGFydCxcbiAgICBlbmREYXRlOiBlbmQsXG4gICAgcmFuZ2VzOiB7XG4gICAgICdUb2RheSc6IFttb21lbnQoKSwgbW9tZW50KCldLFxuICAgICAnWWVzdGVyZGF5JzogW21vbWVudCgpLnN1YnRyYWN0KDEsICdkYXlzJyksIG1vbWVudCgpLnN1YnRyYWN0KDEsICdkYXlzJyldLFxuICAgICAnTGFzdCA3IERheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoNiwgJ2RheXMnKSwgbW9tZW50KCldLFxuICAgICAnTGFzdCAzMCBEYXlzJzogW21vbWVudCgpLnN1YnRyYWN0KDI5LCAnZGF5cycpLCBtb21lbnQoKV0sXG4gICAgICdUaGlzIE1vbnRoJzogW21vbWVudCgpLnN0YXJ0T2YoJ21vbnRoJyksIG1vbWVudCgpLmVuZE9mKCdtb250aCcpXSxcbiAgICAgJ0xhc3QgTW9udGgnOiBbbW9tZW50KCkuc3VidHJhY3QoMSwgJ21vbnRoJykuc3RhcnRPZignbW9udGgnKSwgbW9tZW50KCkuc3VidHJhY3QoMSwgJ21vbnRoJykuZW5kT2YoJ21vbnRoJyldXG4gICB9LFxuICAgb3BlbnM6IChpc1J0bCA/ICdsZWZ0JyA6ICdyaWdodCcpXG4gIH0sIGNiKTtcblxuICBjYihzdGFydCwgZW5kKTtcbn0pO1xuXG4vLyBCb290c3RyYXAgTWF0ZXJpYWwgRGF0ZVRpbWVQaWNrZXJcbiQoZnVuY3Rpb24oKSB7XG4gICQoJyNiLW0tZHRwLWRhdGUnKS5ib290c3RyYXBNYXRlcmlhbERhdGVQaWNrZXIoe1xuICAgIHdlZWtTdGFydDogMCxcbiAgICB0aW1lOiBmYWxzZSxcbiAgICBjbGVhckJ1dHRvbjogdHJ1ZVxuICB9KTtcblxuICAkKCcjYi1tLWR0cC10aW1lJykuYm9vdHN0cmFwTWF0ZXJpYWxEYXRlUGlja2VyKHtcbiAgICBkYXRlOiBmYWxzZSxcbiAgICBzaG9ydFRpbWU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ0hIOm1tJ1xuICB9KTtcblxuICAkKCcjYi1tLWR0cC1kYXRldGltZScpLmJvb3RzdHJhcE1hdGVyaWFsRGF0ZVBpY2tlcih7XG4gICAgd2Vla1N0YXJ0OiAxLFxuICAgIGZvcm1hdCA6ICdkZGRkIEREIE1NTU0gWVlZWSAtIEhIOm1tJyxcbiAgICBzaG9ydFRpbWU6IHRydWUsXG4gICAgbm93QnV0dG9uIDogdHJ1ZSxcbiAgICBtaW5EYXRlIDogbmV3IERhdGUoKVxuICB9KTtcbn0pO1xuXG4vLyBqUXVlcnkgVGltZXBpY2tlclxuJChmdW5jdGlvbigpIHtcbiAgdmFyIGlzUnRsID0gJCgnYm9keScpLmF0dHIoJ2RpcicpID09PSAncnRsJyB8fCAkKCdodG1sJykuYXR0cignZGlyJykgPT09ICdydGwnO1xuXG4gICQoJyN0aW1lcGlja2VyLWV4YW1wbGUtMScpLnRpbWVwaWNrZXIoe1xuICAgIHNjcm9sbERlZmF1bHQ6ICdub3cnLFxuICAgIG9yaWVudGF0aW9uOiAoaXNSdGwgPyAncicgOiAnbCcpXG4gIH0pO1xuXG4gICQoJyN0aW1lcGlja2VyLWV4YW1wbGUtMicpLnRpbWVwaWNrZXIoe1xuICAgIG1pblRpbWU6ICcyOjAwcG0nLFxuICAgIG1heFRpbWU6ICcxMTozMHBtJyxcbiAgICBzaG93RHVyYXRpb246IHRydWUsXG4gICAgb3JpZW50YXRpb246IChpc1J0bCA/ICdyJyA6ICdsJylcbiAgfSk7XG5cbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS0zJykudGltZXBpY2tlcih7XG4gICAgZGlzYWJsZVRpbWVSYW5nZXM6IFtcbiAgICAgIFsnMWFtJywgJzJhbSddLFxuICAgICAgWyczYW0nLCAnNDowMWFtJ11cbiAgICBdLFxuICAgIG9yaWVudGF0aW9uOiAoaXNSdGwgPyAncicgOiAnbCcpXG4gIH0pO1xuXG4gICQoJyN0aW1lcGlja2VyLWV4YW1wbGUtNCcpLnRpbWVwaWNrZXIoe1xuICAgICd0aW1lRm9ybWF0JzogJ0g6aTpzJyxcbiAgICBvcmllbnRhdGlvbjogKGlzUnRsID8gJ3InIDogJ2wnKVxuICB9KTtcbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS01JykudGltZXBpY2tlcih7XG4gICAgJ3RpbWVGb3JtYXQnOiAnaDppIEEnLFxuICAgIG9yaWVudGF0aW9uOiAoaXNSdGwgPyAncicgOiAnbCcpXG4gIH0pO1xuXG4gICQoJyN0aW1lcGlja2VyLWV4YW1wbGUtNicpLnRpbWVwaWNrZXIoe1xuICAgICdzdGVwJzogMTUsXG4gICAgb3JpZW50YXRpb246IChpc1J0bCA/ICdyJyA6ICdsJylcbiAgfSk7XG59KTsiXSwiZmlsZSI6ImpzL2Zvcm1zX3BpY2tlcnMuZXM1LmpzIn0=
