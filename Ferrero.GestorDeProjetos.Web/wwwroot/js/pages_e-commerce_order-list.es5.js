"use strict";

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  var statuses = {
    1: ['Shipped', 'success'],
    2: ['Pending', 'warning'],
    3: ['Sent', 'info'],
    4: ['Cancelled', 'danger']
  };
  $('#order-list').dataTable({
    ajax: '/json/pages_e-commerce_order-list.json',
    order: [[0, 'desc']],
    columnDefs: [{
      targets: [5],
      orderable: false,
      searchable: false
    }],
    createdRow: function createdRow(row, data, index) {
      // Add extra padding and set minimum width
      $('td', row).addClass('align-middle'); // *********************************************************************
      // Amount

      $('td', row).eq(2).html('').append(numeral(data[2]).format('$0,0.00')); // *********************************************************************
      // Status

      $('td', row).eq(4).html('').append('<span class="badge badge-outline-' + statuses[data[4]][1] + '">' + statuses[data[4]][0] + '</span>'); // *********************************************************************
      // Actions

      $('td', row).eq(5).addClass('text-nowrap').html('').append('<a href="javascript:void(0)" class="btn btn-default btn-xs icon-btn btn-md-flat order-tooltip" title="Show"><i class="ion ion-md-eye"></i></a>&nbsp;' + '<a href="javascript:void(0)" class="btn btn-default btn-xs icon-btn btn-md-flat order-tooltip" title="Edit"><i class="ion ion-md-create"></i></a>');
    }
  }); // Tooltips

  $('body').tooltip({
    selector: '.order-tooltip'
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX2UtY29tbWVyY2Vfb3JkZXItbGlzdC5qcyJdLCJuYW1lcyI6WyIkIiwiaXNSdGwiLCJhdHRyIiwic3RhdHVzZXMiLCJkYXRhVGFibGUiLCJhamF4Iiwib3JkZXIiLCJjb2x1bW5EZWZzIiwidGFyZ2V0cyIsIm9yZGVyYWJsZSIsInNlYXJjaGFibGUiLCJjcmVhdGVkUm93Iiwicm93IiwiZGF0YSIsImluZGV4IiwiYWRkQ2xhc3MiLCJlcSIsImh0bWwiLCJhcHBlbmQiLCJudW1lcmFsIiwiZm9ybWF0IiwidG9vbHRpcCIsInNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYLE1BQUlDLEtBQUssR0FBR0QsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUExQixJQUFtQ0YsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUF6RTtBQUVBLE1BQUlDLFFBQVEsR0FBRztBQUNiLE9BQUcsQ0FBQyxTQUFELEVBQVksU0FBWixDQURVO0FBRWIsT0FBRyxDQUFDLFNBQUQsRUFBWSxTQUFaLENBRlU7QUFHYixPQUFHLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FIVTtBQUliLE9BQUcsQ0FBQyxXQUFELEVBQWMsUUFBZDtBQUpVLEdBQWY7QUFPQUgsRUFBQUEsQ0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQkksU0FBakIsQ0FBMkI7QUFDekJDLElBQUFBLElBQUksRUFBRSx3Q0FEbUI7QUFFekJDLElBQUFBLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBRixFQUFLLE1BQUwsQ0FBRCxDQUZrQjtBQUd6QkMsSUFBQUEsVUFBVSxFQUFFLENBQUU7QUFDWkMsTUFBQUEsT0FBTyxFQUFFLENBQUMsQ0FBRCxDQURHO0FBRVpDLE1BQUFBLFNBQVMsRUFBRSxLQUZDO0FBR1pDLE1BQUFBLFVBQVUsRUFBRTtBQUhBLEtBQUYsQ0FIYTtBQVF6QkMsSUFBQUEsVUFBVSxFQUFFLG9CQUFVQyxHQUFWLEVBQWVDLElBQWYsRUFBcUJDLEtBQXJCLEVBQTRCO0FBQ3RDO0FBQ0FkLE1BQUFBLENBQUMsQ0FBQyxJQUFELEVBQU9ZLEdBQVAsQ0FBRCxDQUFhRyxRQUFiLENBQXNCLGNBQXRCLEVBRnNDLENBSXRDO0FBQ0E7O0FBRUFmLE1BQUFBLENBQUMsQ0FBQyxJQUFELEVBQU9ZLEdBQVAsQ0FBRCxDQUFhSSxFQUFiLENBQWdCLENBQWhCLEVBQW1CQyxJQUFuQixDQUF3QixFQUF4QixFQUE0QkMsTUFBNUIsQ0FDRUMsT0FBTyxDQUFDTixJQUFJLENBQUMsQ0FBRCxDQUFMLENBQVAsQ0FBaUJPLE1BQWpCLENBQXdCLFNBQXhCLENBREYsRUFQc0MsQ0FXdEM7QUFDQTs7QUFFQXBCLE1BQUFBLENBQUMsQ0FBQyxJQUFELEVBQU9ZLEdBQVAsQ0FBRCxDQUFhSSxFQUFiLENBQWdCLENBQWhCLEVBQW1CQyxJQUFuQixDQUF3QixFQUF4QixFQUE0QkMsTUFBNUIsQ0FDRSxzQ0FBc0NmLFFBQVEsQ0FBQ1UsSUFBSSxDQUFDLENBQUQsQ0FBTCxDQUFSLENBQWtCLENBQWxCLENBQXRDLEdBQTZELElBQTdELEdBQW9FVixRQUFRLENBQUNVLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBUixDQUFrQixDQUFsQixDQUFwRSxHQUEyRixTQUQ3RixFQWRzQyxDQWtCdEM7QUFDQTs7QUFFQWIsTUFBQUEsQ0FBQyxDQUFDLElBQUQsRUFBT1ksR0FBUCxDQUFELENBQWFJLEVBQWIsQ0FBZ0IsQ0FBaEIsRUFBbUJELFFBQW5CLENBQTRCLGFBQTVCLEVBQTJDRSxJQUEzQyxDQUFnRCxFQUFoRCxFQUFvREMsTUFBcEQsQ0FDRSx5SkFDQSxtSkFGRjtBQUtEO0FBbEN3QixHQUEzQixFQVhXLENBZ0RYOztBQUVBbEIsRUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVcUIsT0FBVixDQUFrQjtBQUNoQkMsSUFBQUEsUUFBUSxFQUFFO0FBRE0sR0FBbEI7QUFJRCxDQXREQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcblxuICB2YXIgaXNSdGwgPSAkKCdib2R5JykuYXR0cignZGlyJykgPT09ICdydGwnIHx8ICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG5cbiAgdmFyIHN0YXR1c2VzID0ge1xuICAgIDE6IFsnU2hpcHBlZCcsICdzdWNjZXNzJ10sXG4gICAgMjogWydQZW5kaW5nJywgJ3dhcm5pbmcnXSxcbiAgICAzOiBbJ1NlbnQnLCAnaW5mbyddLFxuICAgIDQ6IFsnQ2FuY2VsbGVkJywgJ2RhbmdlciddXG4gIH07XG5cbiAgJCgnI29yZGVyLWxpc3QnKS5kYXRhVGFibGUoe1xuICAgIGFqYXg6ICcvanNvbi9wYWdlc19lLWNvbW1lcmNlX29yZGVyLWxpc3QuanNvbicsXG4gICAgb3JkZXI6IFtbIDAsICdkZXNjJyBdXSxcbiAgICBjb2x1bW5EZWZzOiBbIHtcbiAgICAgIHRhcmdldHM6IFs1XSxcbiAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICBzZWFyY2hhYmxlOiBmYWxzZVxuICAgIH1dLFxuICAgIGNyZWF0ZWRSb3c6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGluZGV4KSB7XG4gICAgICAvLyBBZGQgZXh0cmEgcGFkZGluZyBhbmQgc2V0IG1pbmltdW0gd2lkdGhcbiAgICAgICQoJ3RkJywgcm93KS5hZGRDbGFzcygnYWxpZ24tbWlkZGxlJyk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gQW1vdW50XG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSgyKS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgIG51bWVyYWwoZGF0YVsyXSkuZm9ybWF0KCckMCwwLjAwJylcbiAgICAgICk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gU3RhdHVzXG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSg0KS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImJhZGdlIGJhZGdlLW91dGxpbmUtJyArIHN0YXR1c2VzW2RhdGFbNF1dWzFdICsgJ1wiPicgKyBzdGF0dXNlc1tkYXRhWzRdXVswXSArICc8L3NwYW4+J1xuICAgICAgKTtcblxuICAgICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAvLyBBY3Rpb25zXG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSg1KS5hZGRDbGFzcygndGV4dC1ub3dyYXAnKS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzIGljb24tYnRuIGJ0bi1tZC1mbGF0IG9yZGVyLXRvb2x0aXBcIiB0aXRsZT1cIlNob3dcIj48aSBjbGFzcz1cImlvbiBpb24tbWQtZXllXCI+PC9pPjwvYT4mbmJzcDsnICtcbiAgICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHMgaWNvbi1idG4gYnRuLW1kLWZsYXQgb3JkZXItdG9vbHRpcFwiIHRpdGxlPVwiRWRpdFwiPjxpIGNsYXNzPVwiaW9uIGlvbi1tZC1jcmVhdGVcIj48L2k+PC9hPidcbiAgICAgICk7XG5cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRvb2x0aXBzXG5cbiAgJCgnYm9keScpLnRvb2x0aXAoe1xuICAgIHNlbGVjdG9yOiAnLm9yZGVyLXRvb2x0aXAnXG4gIH0pO1xuXG59KTtcbiJdLCJmaWxlIjoianMvcGFnZXNfZS1jb21tZXJjZV9vcmRlci1saXN0LmVzNS5qcyJ9
