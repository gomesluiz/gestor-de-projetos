"use strict";

$(function () {
  var statuses = {
    1: ['Published', 'success'],
    2: ['Draft', 'info'],
    3: ['Deleted', 'default']
  };
  $('#article-list').dataTable({
    ajax: '/json/projetos_index.json',
    columnDefs: [{
      targets: [6],
      orderable: false,
      searchable: false
    }],
    createdRow: function createdRow(row, data, index) {
      // *********************************************************************
      // Article link
      $('td', row).eq(1).html('').append('<a href="javascript:void(0)">' + data[1] + '</a>'); // *********************************************************************
      // Status

      $('td', row).eq(5).html('').append('<span class="badge badge-outline-' + statuses[data[5]][1] + '">' + statuses[data[5]][0] + '</span>'); // *********************************************************************
      // Actions

      $('td', row).eq(6).addClass('text-center text-nowrap').html('').append('<button type="button" class="btn btn-default btn-xs icon-btn md-btn-flat article-tooltip" title="Edit"><i class="ion ion-md-create"></i></button>&nbsp;&nbsp;' + '<button type="button" class="btn btn-default btn-xs icon-btn md-btn-flat article-tooltip" title="Remove"><i class="ion ion-md-close"></i></button>');
    }
  }); // Tooltips

  $('body').tooltip({
    selector: '.article-tooltip'
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3Byb2pldG9zX2luZGV4LmpzIl0sIm5hbWVzIjpbIiQiLCJzdGF0dXNlcyIsImRhdGFUYWJsZSIsImFqYXgiLCJjb2x1bW5EZWZzIiwidGFyZ2V0cyIsIm9yZGVyYWJsZSIsInNlYXJjaGFibGUiLCJjcmVhdGVkUm93Iiwicm93IiwiZGF0YSIsImluZGV4IiwiZXEiLCJodG1sIiwiYXBwZW5kIiwiYWRkQ2xhc3MiLCJ0b29sdGlwIiwic2VsZWN0b3IiXSwibWFwcGluZ3MiOiI7O0FBQUFBLENBQUMsQ0FBQyxZQUFXO0FBRVgsTUFBSUMsUUFBUSxHQUFHO0FBQ2IsT0FBRyxDQUFDLFdBQUQsRUFBYyxTQUFkLENBRFU7QUFFYixPQUFHLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FGVTtBQUdiLE9BQUcsQ0FBQyxTQUFELEVBQVksU0FBWjtBQUhVLEdBQWY7QUFNQUQsRUFBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQkUsU0FBbkIsQ0FBNkI7QUFDM0JDLElBQUFBLElBQUksRUFBRSwyQkFEcUI7QUFFM0JDLElBQUFBLFVBQVUsRUFBRSxDQUFFO0FBQ1pDLE1BQUFBLE9BQU8sRUFBRSxDQUFDLENBQUQsQ0FERztBQUVaQyxNQUFBQSxTQUFTLEVBQUUsS0FGQztBQUdaQyxNQUFBQSxVQUFVLEVBQUU7QUFIQSxLQUFGLENBRmU7QUFPM0JDLElBQUFBLFVBQVUsRUFBRSxvQkFBVUMsR0FBVixFQUFlQyxJQUFmLEVBQXFCQyxLQUFyQixFQUE0QjtBQUV0QztBQUNBO0FBRUFYLE1BQUFBLENBQUMsQ0FBQyxJQUFELEVBQU9TLEdBQVAsQ0FBRCxDQUFhRyxFQUFiLENBQWdCLENBQWhCLEVBQW1CQyxJQUFuQixDQUF3QixFQUF4QixFQUE0QkMsTUFBNUIsQ0FDRSxrQ0FBa0NKLElBQUksQ0FBQyxDQUFELENBQXRDLEdBQTRDLE1BRDlDLEVBTHNDLENBU3RDO0FBQ0E7O0FBRUFWLE1BQUFBLENBQUMsQ0FBQyxJQUFELEVBQU9TLEdBQVAsQ0FBRCxDQUFhRyxFQUFiLENBQWdCLENBQWhCLEVBQW1CQyxJQUFuQixDQUF3QixFQUF4QixFQUE0QkMsTUFBNUIsQ0FDRSxzQ0FBc0NiLFFBQVEsQ0FBQ1MsSUFBSSxDQUFDLENBQUQsQ0FBTCxDQUFSLENBQWtCLENBQWxCLENBQXRDLEdBQTZELElBQTdELEdBQW9FVCxRQUFRLENBQUNTLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBUixDQUFrQixDQUFsQixDQUFwRSxHQUEyRixTQUQ3RixFQVpzQyxDQWdCdEM7QUFDQTs7QUFFQVYsTUFBQUEsQ0FBQyxDQUFDLElBQUQsRUFBT1MsR0FBUCxDQUFELENBQWFHLEVBQWIsQ0FBZ0IsQ0FBaEIsRUFBbUJHLFFBQW5CLENBQTRCLHlCQUE1QixFQUF1REYsSUFBdkQsQ0FBNEQsRUFBNUQsRUFBZ0VDLE1BQWhFLENBQ0Usa0tBQ0Esb0pBRkY7QUFLRDtBQS9CMEIsR0FBN0IsRUFSVyxDQTBDWDs7QUFFQWQsRUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVZ0IsT0FBVixDQUFrQjtBQUNoQkMsSUFBQUEsUUFBUSxFQUFFO0FBRE0sR0FBbEI7QUFJRCxDQWhEQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcblxuICB2YXIgc3RhdHVzZXMgPSB7XG4gICAgMTogWydQdWJsaXNoZWQnLCAnc3VjY2VzcyddLFxuICAgIDI6IFsnRHJhZnQnLCAnaW5mbyddLFxuICAgIDM6IFsnRGVsZXRlZCcsICdkZWZhdWx0J11cbiAgfTtcblxuICAkKCcjYXJ0aWNsZS1saXN0JykuZGF0YVRhYmxlKHtcbiAgICBhamF4OiAnL2pzb24vcHJvamV0b3NfaW5kZXguanNvbicsXG4gICAgY29sdW1uRGVmczogWyB7XG4gICAgICB0YXJnZXRzOiBbNl0sXG4gICAgICBvcmRlcmFibGU6IGZhbHNlLFxuICAgICAgc2VhcmNoYWJsZTogZmFsc2VcbiAgICB9XSxcbiAgICBjcmVhdGVkUm93OiBmdW5jdGlvbiAocm93LCBkYXRhLCBpbmRleCkge1xuXG4gICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgIC8vIEFydGljbGUgbGlua1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoMSkuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPicgKyBkYXRhWzFdICsgJzwvYT4nXG4gICAgICApO1xuXG4gICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgIC8vIFN0YXR1c1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNSkuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1vdXRsaW5lLScgKyBzdGF0dXNlc1tkYXRhWzVdXVsxXSArICdcIj4nICsgc3RhdHVzZXNbZGF0YVs1XV1bMF0gKyAnPC9zcGFuPidcbiAgICAgICk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gQWN0aW9uc1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNikuYWRkQ2xhc3MoJ3RleHQtY2VudGVyIHRleHQtbm93cmFwJykuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzIGljb24tYnRuIG1kLWJ0bi1mbGF0IGFydGljbGUtdG9vbHRpcFwiIHRpdGxlPVwiRWRpdFwiPjxpIGNsYXNzPVwiaW9uIGlvbi1tZC1jcmVhdGVcIj48L2k+PC9idXR0b24+Jm5ic3A7Jm5ic3A7JyArXG4gICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHMgaWNvbi1idG4gbWQtYnRuLWZsYXQgYXJ0aWNsZS10b29sdGlwXCIgdGl0bGU9XCJSZW1vdmVcIj48aSBjbGFzcz1cImlvbiBpb24tbWQtY2xvc2VcIj48L2k+PC9idXR0b24+J1xuICAgICAgKTtcblxuICAgIH1cbiAgfSk7XG5cbiAgLy8gVG9vbHRpcHNcblxuICAkKCdib2R5JykudG9vbHRpcCh7XG4gICAgc2VsZWN0b3I6ICcuYXJ0aWNsZS10b29sdGlwJ1xuICB9KTtcblxufSk7XG4iXSwiZmlsZSI6ImpzL3Byb2pldG9zX2luZGV4LmVzNS5qcyJ9
