"use strict";

// Bootstrap Datepicker
$(function () {
  var isRtl = $('html').attr('dir') === 'rtl';
  $('#datepicker-base').datepicker({
    orientation: isRtl ? 'auto right' : 'auto left'
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
}); // Flatpickr

$(function () {
  // Date
  $('#flatpickr-date').flatpickr({
    altInput: true
  }); // Time

  $('#flatpickr-time').flatpickr({
    enableTime: true,
    noCalendar: true,
    altInput: true
  }); // Datetime

  $('#flatpickr-datetime').flatpickr({
    enableTime: true,
    altInput: true
  }); // Full

  $('#flatpickr-full').flatpickr({
    weekNumbers: true,
    enableTime: true,
    mode: 'multiple',
    minDate: 'today',
    altInput: true
  }); // Range

  $('#flatpickr-range').flatpickr({
    mode: 'range',
    altInput: true
  }); // Inline

  $('#flatpickr-inline').flatpickr({
    inline: true,
    altInput: true,
    allowInput: false
  });
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
}); // Minicolors

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  $('#minicolors-hue').minicolors({
    control: 'hue',
    position: 'bottom ' + (isRtl ? 'right' : 'left')
  });
  $('#minicolors-saturation').minicolors({
    control: 'saturation',
    position: 'bottom ' + (isRtl ? 'left' : 'right')
  });
  $('#minicolors-wheel').minicolors({
    control: 'wheel',
    position: 'top ' + (isRtl ? 'left' : 'right')
  });
  $('#minicolors-opacity').minicolors({
    control: 'wheel',
    opacity: true,
    position: 'bottom ' + (isRtl ? 'right' : 'left')
  });
  $('#minicolors-brightness').minicolors({
    control: 'brightness',
    position: 'top ' + (isRtl ? 'right' : 'left')
  });
  $('#minicolors-hidden').minicolors({
    position: 'top ' + (isRtl ? 'right' : 'left')
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Zvcm1zX3BpY2tlcnMuanMiXSwibmFtZXMiOlsiJCIsImlzUnRsIiwiYXR0ciIsImRhdGVwaWNrZXIiLCJvcmllbnRhdGlvbiIsImNhbGVuZGFyV2Vla3MiLCJ0b2RheUJ0biIsImRheXNPZldlZWtEaXNhYmxlZCIsImNsZWFyQnRuIiwidG9kYXlIaWdobGlnaHQiLCJtdWx0aWRhdGUiLCJkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQiLCJiZWZvcmVTaG93TW9udGgiLCJkYXRlIiwiZ2V0TW9udGgiLCJiZWZvcmVTaG93WWVhciIsImdldEZ1bGxZZWFyIiwiZmxhdHBpY2tyIiwiYWx0SW5wdXQiLCJlbmFibGVUaW1lIiwibm9DYWxlbmRhciIsIndlZWtOdW1iZXJzIiwibW9kZSIsIm1pbkRhdGUiLCJpbmxpbmUiLCJhbGxvd0lucHV0IiwiZGF0ZXJhbmdlcGlja2VyIiwib3BlbnMiLCJzaG93V2Vla051bWJlcnMiLCJ0aW1lUGlja2VyIiwidGltZVBpY2tlckluY3JlbWVudCIsImxvY2FsZSIsImZvcm1hdCIsInNpbmdsZURhdGVQaWNrZXIiLCJzaG93RHJvcGRvd25zIiwic3RhcnQiLCJlbmQiLCJsYWJlbCIsInllYXJzIiwibW9tZW50IiwiZGlmZiIsImFsZXJ0Iiwic3VidHJhY3QiLCJjYiIsImh0bWwiLCJzdGFydERhdGUiLCJlbmREYXRlIiwicmFuZ2VzIiwic3RhcnRPZiIsImVuZE9mIiwiYm9vdHN0cmFwTWF0ZXJpYWxEYXRlUGlja2VyIiwid2Vla1N0YXJ0IiwidGltZSIsImNsZWFyQnV0dG9uIiwic2hvcnRUaW1lIiwibm93QnV0dG9uIiwiRGF0ZSIsInRpbWVwaWNrZXIiLCJzY3JvbGxEZWZhdWx0IiwibWluVGltZSIsIm1heFRpbWUiLCJzaG93RHVyYXRpb24iLCJkaXNhYmxlVGltZVJhbmdlcyIsIm1pbmljb2xvcnMiLCJjb250cm9sIiwicG9zaXRpb24iLCJvcGFjaXR5Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLENBQUMsQ0FBQyxZ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RSxLQUFLLEdBQUcsT0FBSCxHQUFhLE1BQS9CO0FBSHdCLEdBQXBDO0FBTUFELEVBQUFBLENBQUMsQ0FBQyx3QkFBRCxDQUFELENBQTRCK0QsVUFBNUIsQ0FBdUM7QUFDckNDLElBQUFBLE9BQU8sRUFBRyxZQUQyQjtBQUVyQ0MsSUFBQUEsUUFBUSxFQUFFLFVBQVVoRSxLQUFLLEdBQUcsT0FBSCxHQUFhLE1BQTVCO0FBRjJCLEdBQXZDO0FBS0FELEVBQUFBLENBQUMsQ0FBQyxvQkFBRCxDQUFELENBQXdCK0QsVUFBeEIsQ0FBbUM7QUFDakNFLElBQUFBLFFBQVEsRUFBRSxVQUFVaEUsS0FBSyxHQUFHLE9BQUgsR0FBYSxNQUE1QjtBQUR1QixHQUFuQztBQUdELENBaENBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCb290c3RyYXAgRGF0ZXBpY2tlclxuJChmdW5jdGlvbigpIHtcbiAgdmFyIGlzUnRsID0gJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJztcblxuICAkKCcjZGF0ZXBpY2tlci1iYXNlJykuZGF0ZXBpY2tlcih7XG4gICAgb3JpZW50YXRpb246IGlzUnRsID8gJ2F1dG8gcmlnaHQnIDogJ2F1dG8gbGVmdCdcbiAgfSk7XG4gICQoJyNkYXRlcGlja2VyLWZlYXR1cmVzJykuZGF0ZXBpY2tlcih7XG4gICAgY2FsZW5kYXJXZWVrczogICAgICAgICB0cnVlLFxuICAgIHRvZGF5QnRuOiAgICAgICAgICAgICAgJ2xpbmtlZCcsXG4gICAgZGF5c09mV2Vla0Rpc2FibGVkOiAgICAnMScsXG4gICAgY2xlYXJCdG46ICAgICAgICAgICAgICB0cnVlLFxuICAgIHRvZGF5SGlnaGxpZ2h0OiAgICAgICAgdHJ1ZSxcbiAgICBtdWx0aWRhdGU6ICAgICAgICAgICAgIHRydWUsXG4gICAgZGF5c09mV2Vla0hpZ2hsaWdodGVkOiAnMSwyJyxcbiAgICBvcmllbnRhdGlvbjogaXNSdGwgPyAnYXV0byBsZWZ0JyA6ICdhdXRvIHJpZ2h0JyxcblxuICAgIGJlZm9yZVNob3dNb250aDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgaWYgKGRhdGUuZ2V0TW9udGgoKSA9PT0gOCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJlZm9yZVNob3dZZWFyOiBmdW5jdGlvbihkYXRlKXtcbiAgICAgIGlmIChkYXRlLmdldEZ1bGxZZWFyKCkgPT09IDIwMTQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gICQoJyNkYXRlcGlja2VyLXJhbmdlJykuZGF0ZXBpY2tlcih7XG4gICAgb3JpZW50YXRpb246IGlzUnRsID8gJ2F1dG8gcmlnaHQnIDogJ2F1dG8gbGVmdCdcbiAgfSk7XG4gICQoJyNkYXRlcGlja2VyLWlubGluZScpLmRhdGVwaWNrZXIoKTtcbn0pO1xuXG4vLyBGbGF0cGlja3JcbiQoZnVuY3Rpb24gKCkge1xuICAvLyBEYXRlXG4gICQoJyNmbGF0cGlja3ItZGF0ZScpLmZsYXRwaWNrcih7XG4gICAgYWx0SW5wdXQ6IHRydWVcbiAgfSk7XG5cbiAgLy8gVGltZVxuICAkKCcjZmxhdHBpY2tyLXRpbWUnKS5mbGF0cGlja3Ioe1xuICAgIGVuYWJsZVRpbWU6IHRydWUsXG4gICAgbm9DYWxlbmRhcjogdHJ1ZSxcbiAgICBhbHRJbnB1dDogdHJ1ZVxuICB9KTtcblxuICAvLyBEYXRldGltZVxuICAkKCcjZmxhdHBpY2tyLWRhdGV0aW1lJykuZmxhdHBpY2tyKHtcbiAgICBlbmFibGVUaW1lOiB0cnVlLFxuICAgIGFsdElucHV0OiB0cnVlXG4gIH0pO1xuXG4gIC8vIEZ1bGxcbiAgJCgnI2ZsYXRwaWNrci1mdWxsJykuZmxhdHBpY2tyKHtcbiAgICB3ZWVrTnVtYmVyczogdHJ1ZSxcbiAgICBlbmFibGVUaW1lOiB0cnVlLFxuICAgIG1vZGU6ICdtdWx0aXBsZScsXG4gICAgbWluRGF0ZTogJ3RvZGF5JyxcbiAgICBhbHRJbnB1dDogdHJ1ZVxuICB9KTtcblxuICAvLyBSYW5nZVxuICAkKCcjZmxhdHBpY2tyLXJhbmdlJykuZmxhdHBpY2tyKHtcbiAgICBtb2RlOiAncmFuZ2UnLFxuICAgIGFsdElucHV0OiB0cnVlXG4gIH0pO1xuXG4gIC8vIElubGluZVxuICAkKCcjZmxhdHBpY2tyLWlubGluZScpLmZsYXRwaWNrcih7XG4gICAgaW5saW5lOiB0cnVlLFxuICAgIGFsdElucHV0OiB0cnVlLFxuICAgIGFsbG93SW5wdXQ6IGZhbHNlXG4gIH0pO1xufSk7XG5cbi8vIEJvb3RzdHJhcCBEYXRlcmFuZ2VwaWNrZXJcbiQoZnVuY3Rpb24oKSB7XG4gIHZhciBpc1J0bCA9ICQoJ2JvZHknKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcgfHwgJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJztcblxuICAkKCcjZGF0ZXJhbmdlLTEnKS5kYXRlcmFuZ2VwaWNrZXIoe1xuICAgIG9wZW5zOiAoaXNSdGwgPyAnbGVmdCcgOiAncmlnaHQnKSxcbiAgICBzaG93V2Vla051bWJlcnM6IHRydWVcbiAgfSk7XG5cbiAgJCgnI2RhdGVyYW5nZS0yJykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICB0aW1lUGlja2VyOiB0cnVlLFxuICAgIHRpbWVQaWNrZXJJbmNyZW1lbnQ6IDMwLFxuICAgIGxvY2FsZToge1xuICAgICAgZm9ybWF0OiAnTU0vREQvWVlZWSBoOm1tIEEnXG4gICAgfSxcbiAgICBvcGVuczogKGlzUnRsID8gJ2xlZnQnIDogJ3JpZ2h0JylcbiAgfSk7XG5cbiAgJCgnI2RhdGVyYW5nZS0zJykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICAgIHNpbmdsZURhdGVQaWNrZXI6IHRydWUsXG4gICAgICBzaG93RHJvcGRvd25zOiB0cnVlLFxuICAgICAgb3BlbnM6IChpc1J0bCA/ICdsZWZ0JyA6ICdyaWdodCcpXG4gICAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCwgbGFiZWwpIHtcbiAgICAgIHZhciB5ZWFycyA9IG1vbWVudCgpLmRpZmYoc3RhcnQsICd5ZWFycycpO1xuXG4gICAgICBhbGVydChcIllvdSBhcmUgXCIgKyB5ZWFycyArIFwiIHllYXJzIG9sZC5cIik7XG4gICAgfVxuICApO1xuXG4gIC8vIEJ1dHRvblxuXG4gIHZhciBzdGFydCA9IG1vbWVudCgpLnN1YnRyYWN0KDI5LCAnZGF5cycpO1xuICB2YXIgZW5kID0gbW9tZW50KCk7XG5cbiAgZnVuY3Rpb24gY2Ioc3RhcnQsIGVuZCkge1xuICAgICQoJyNkYXRlcmFuZ2UtNCcpLmh0bWwoc3RhcnQuZm9ybWF0KCdNTU1NIEQsIFlZWVknKSArICcgLSAnICsgZW5kLmZvcm1hdCgnTU1NTSBELCBZWVlZJykpO1xuICB9XG5cbiAgJCgnI2RhdGVyYW5nZS00JykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICBzdGFydERhdGU6IHN0YXJ0LFxuICAgIGVuZERhdGU6IGVuZCxcbiAgICByYW5nZXM6IHtcbiAgICAgJ1RvZGF5JzogW21vbWVudCgpLCBtb21lbnQoKV0sXG4gICAgICdZZXN0ZXJkYXknOiBbbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKSwgbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKV0sXG4gICAgICdMYXN0IDcgRGF5cyc6IFttb21lbnQoKS5zdWJ0cmFjdCg2LCAnZGF5cycpLCBtb21lbnQoKV0sXG4gICAgICdMYXN0IDMwIERheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoMjksICdkYXlzJyksIG1vbWVudCgpXSxcbiAgICAgJ1RoaXMgTW9udGgnOiBbbW9tZW50KCkuc3RhcnRPZignbW9udGgnKSwgbW9tZW50KCkuZW5kT2YoJ21vbnRoJyldLFxuICAgICAnTGFzdCBNb250aCc6IFttb21lbnQoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5zdGFydE9mKCdtb250aCcpLCBtb21lbnQoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5lbmRPZignbW9udGgnKV1cbiAgIH0sXG4gICBvcGVuczogKGlzUnRsID8gJ2xlZnQnIDogJ3JpZ2h0JylcbiAgfSwgY2IpO1xuXG4gIGNiKHN0YXJ0LCBlbmQpO1xufSk7XG5cbi8vIEJvb3RzdHJhcCBNYXRlcmlhbCBEYXRlVGltZVBpY2tlclxuJChmdW5jdGlvbigpIHtcbiAgJCgnI2ItbS1kdHAtZGF0ZScpLmJvb3RzdHJhcE1hdGVyaWFsRGF0ZVBpY2tlcih7XG4gICAgd2Vla1N0YXJ0OiAwLFxuICAgIHRpbWU6IGZhbHNlLFxuICAgIGNsZWFyQnV0dG9uOiB0cnVlXG4gIH0pO1xuXG4gICQoJyNiLW0tZHRwLXRpbWUnKS5ib290c3RyYXBNYXRlcmlhbERhdGVQaWNrZXIoe1xuICAgIGRhdGU6IGZhbHNlLFxuICAgIHNob3J0VGltZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnSEg6bW0nXG4gIH0pO1xuXG4gICQoJyNiLW0tZHRwLWRhdGV0aW1lJykuYm9vdHN0cmFwTWF0ZXJpYWxEYXRlUGlja2VyKHtcbiAgICB3ZWVrU3RhcnQ6IDEsXG4gICAgZm9ybWF0IDogJ2RkZGQgREQgTU1NTSBZWVlZIC0gSEg6bW0nLFxuICAgIHNob3J0VGltZTogdHJ1ZSxcbiAgICBub3dCdXR0b24gOiB0cnVlLFxuICAgIG1pbkRhdGUgOiBuZXcgRGF0ZSgpXG4gIH0pO1xufSk7XG5cbi8vIGpRdWVyeSBUaW1lcGlja2VyXG4kKGZ1bmN0aW9uKCkge1xuICB2YXIgaXNSdGwgPSAkKCdib2R5JykuYXR0cignZGlyJykgPT09ICdydGwnIHx8ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG5cbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS0xJykudGltZXBpY2tlcih7XG4gICAgc2Nyb2xsRGVmYXVsdDogJ25vdycsXG4gICAgb3JpZW50YXRpb246IChpc1J0bCA/ICdyJyA6ICdsJylcbiAgfSk7XG5cbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS0yJykudGltZXBpY2tlcih7XG4gICAgbWluVGltZTogJzI6MDBwbScsXG4gICAgbWF4VGltZTogJzExOjMwcG0nLFxuICAgIHNob3dEdXJhdGlvbjogdHJ1ZSxcbiAgICBvcmllbnRhdGlvbjogKGlzUnRsID8gJ3InIDogJ2wnKVxuICB9KTtcblxuICAkKCcjdGltZXBpY2tlci1leGFtcGxlLTMnKS50aW1lcGlja2VyKHtcbiAgICBkaXNhYmxlVGltZVJhbmdlczogW1xuICAgICAgWycxYW0nLCAnMmFtJ10sXG4gICAgICBbJzNhbScsICc0OjAxYW0nXVxuICAgIF0sXG4gICAgb3JpZW50YXRpb246IChpc1J0bCA/ICdyJyA6ICdsJylcbiAgfSk7XG5cbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS00JykudGltZXBpY2tlcih7XG4gICAgJ3RpbWVGb3JtYXQnOiAnSDppOnMnLFxuICAgIG9yaWVudGF0aW9uOiAoaXNSdGwgPyAncicgOiAnbCcpXG4gIH0pO1xuICAkKCcjdGltZXBpY2tlci1leGFtcGxlLTUnKS50aW1lcGlja2VyKHtcbiAgICAndGltZUZvcm1hdCc6ICdoOmkgQScsXG4gICAgb3JpZW50YXRpb246IChpc1J0bCA/ICdyJyA6ICdsJylcbiAgfSk7XG5cbiAgJCgnI3RpbWVwaWNrZXItZXhhbXBsZS02JykudGltZXBpY2tlcih7XG4gICAgJ3N0ZXAnOiAxNSxcbiAgICBvcmllbnRhdGlvbjogKGlzUnRsID8gJ3InIDogJ2wnKVxuICB9KTtcbn0pO1xuXG4vLyBNaW5pY29sb3JzXG4kKGZ1bmN0aW9uKCkge1xuICB2YXIgaXNSdGwgPSAkKCdib2R5JykuYXR0cignZGlyJykgPT09ICdydGwnIHx8ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG5cbiAgJCgnI21pbmljb2xvcnMtaHVlJykubWluaWNvbG9ycyh7XG4gICAgY29udHJvbDogICdodWUnLFxuICAgIHBvc2l0aW9uOiAnYm90dG9tICcgKyAoaXNSdGwgPyAncmlnaHQnIDogJ2xlZnQnKSxcbiAgfSk7XG5cbiAgJCgnI21pbmljb2xvcnMtc2F0dXJhdGlvbicpLm1pbmljb2xvcnMoe1xuICAgIGNvbnRyb2w6ICAnc2F0dXJhdGlvbicsXG4gICAgcG9zaXRpb246ICdib3R0b20gJyArIChpc1J0bCA/ICdsZWZ0JyA6ICdyaWdodCcpLFxuICB9KTtcblxuICAkKCcjbWluaWNvbG9ycy13aGVlbCcpLm1pbmljb2xvcnMoe1xuICAgIGNvbnRyb2w6ICAnd2hlZWwnLFxuICAgIHBvc2l0aW9uOiAndG9wICcgKyAoaXNSdGwgPyAnbGVmdCcgOiAncmlnaHQnKSxcbiAgfSk7XG5cbiAgJCgnI21pbmljb2xvcnMtb3BhY2l0eScpLm1pbmljb2xvcnMoe1xuICAgIGNvbnRyb2w6ICd3aGVlbCcsXG4gICAgb3BhY2l0eTogdHJ1ZSxcbiAgICBwb3NpdGlvbjogJ2JvdHRvbSAnICsgKGlzUnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JyksXG4gIH0pO1xuXG4gICQoJyNtaW5pY29sb3JzLWJyaWdodG5lc3MnKS5taW5pY29sb3JzKHtcbiAgICBjb250cm9sOiAgJ2JyaWdodG5lc3MnLFxuICAgIHBvc2l0aW9uOiAndG9wICcgKyAoaXNSdGwgPyAncmlnaHQnIDogJ2xlZnQnKSxcbiAgfSk7XG5cbiAgJCgnI21pbmljb2xvcnMtaGlkZGVuJykubWluaWNvbG9ycyh7XG4gICAgcG9zaXRpb246ICd0b3AgJyArIChpc1J0bCA/ICdyaWdodCcgOiAnbGVmdCcpLFxuICB9KTtcbn0pO1xuIl0sImZpbGUiOiJqcy9mb3Jtc19waWNrZXJzLmVzNS5qcyJ9
