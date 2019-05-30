"use strict";

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  var roles = {
    1: 'User',
    2: 'Author',
    3: 'Staff',
    4: 'Admin'
  };
  var statuses = {
    1: ['Active', 'success'],
    2: ['Banned', 'danger'],
    3: ['Deleted', 'default']
  };
  $('#user-list').dataTable({
    ajax: '/json/pages_users_list.json',
    columnDefs: [{
      targets: [8],
      orderable: false,
      searchable: false
    }],
    createdRow: function createdRow(row, data, index) {
      // *********************************************************************
      // Account link
      $('td', row).eq(1).html('').append('<a href="javascript:void(0)">' + data[1] + '</a>'); // *********************************************************************
      // Verified

      $('td', row).eq(5).html('').append('<span class="ion ion-md-' + (data[5] ? 'checkmark text-primary' : 'close text-light') + '">'); // *********************************************************************
      // Role

      $('td', row).eq(6).html('').append(roles[data[6]]); // *********************************************************************
      // Status

      $('td', row).eq(7).html('').append('<span class="badge badge-outline-' + statuses[data[7]][1] + '">' + statuses[data[7]][0] + '</span>'); // *********************************************************************
      // Actions

      $('td', row).eq(8).addClass('text-center text-nowrap').html('').append('<button type="button" class="btn btn-default btn-xs icon-btn md-btn-flat user-tooltip" title="Edit"><i class="ion ion-md-create"></i></button>&nbsp;&nbsp;' + '<div class="btn-group">' + '<button type="button" class="btn btn-default btn-xs icon-btn md-btn-flat dropdown-toggle hide-arrow user-tooltip" title="Actions" data-toggle="dropdown"><i class="ion ion-ios-settings"></i></button>' + '<div class="dropdown-menu' + (isRtl ? '' : ' dropdown-menu-right') + '">' + '<a class="dropdown-item" href="javascript:void(0)">View profile</a>' + '<a class="dropdown-item" href="javascript:void(0)">Ban user</a>' + '<a class="dropdown-item" href="javascript:void(0)">Remove</a>' + '</div>' + '</div>');
    }
  }); // Tooltips

  $('body').tooltip({
    selector: '.user-tooltip'
  }); // Filters

  $('#user-list-latest-activity').daterangepicker({
    opens: isRtl ? 'right' : 'left',
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('#user-list-latest-activity').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('#user-list-latest-activity').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX3VzZXJzX2xpc3QuanMiXSwibmFtZXMiOlsiJCIsImlzUnRsIiwiYXR0ciIsInJvbGVzIiwic3RhdHVzZXMiLCJkYXRhVGFibGUiLCJhamF4IiwiY29sdW1uRGVmcyIsInRhcmdldHMiLCJvcmRlcmFibGUiLCJzZWFyY2hhYmxlIiwiY3JlYXRlZFJvdyIsInJvdyIsImRhdGEiLCJpbmRleCIsImVxIiwiaHRtbCIsImFwcGVuZCIsImFkZENsYXNzIiwidG9vbHRpcCIsInNlbGVjdG9yIiwiZGF0ZXJhbmdlcGlja2VyIiwib3BlbnMiLCJhdXRvVXBkYXRlSW5wdXQiLCJsb2NhbGUiLCJjYW5jZWxMYWJlbCIsIm9uIiwiZXYiLCJwaWNrZXIiLCJ2YWwiLCJzdGFydERhdGUiLCJmb3JtYXQiLCJlbmREYXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYLE1BQUlDLEtBQUssR0FBR0QsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUExQixJQUFtQ0YsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUF6RTtBQUVBLE1BQUlDLEtBQUssR0FBRztBQUNWLE9BQUcsTUFETztBQUVWLE9BQUcsUUFGTztBQUdWLE9BQUcsT0FITztBQUlWLE9BQUc7QUFKTyxHQUFaO0FBT0EsTUFBSUMsUUFBUSxHQUFHO0FBQ2IsT0FBRyxDQUFDLFFBQUQsRUFBVyxTQUFYLENBRFU7QUFFYixPQUFHLENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FGVTtBQUdiLE9BQUcsQ0FBQyxTQUFELEVBQVksU0FBWjtBQUhVLEdBQWY7QUFNQUosRUFBQUEsQ0FBQyxDQUFDLFlBQUQsQ0FBRCxDQUFnQkssU0FBaEIsQ0FBMEI7QUFDeEJDLElBQUFBLElBQUksRUFBRSw2QkFEa0I7QUFFeEJDLElBQUFBLFVBQVUsRUFBRSxDQUFFO0FBQ1pDLE1BQUFBLE9BQU8sRUFBRSxDQUFDLENB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LEdBRkQ7QUFJQS9CLEVBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDMEIsRUFBaEMsQ0FBbUMsd0JBQW5DLEVBQTZELFVBQVNDLEVBQVQsRUFBYUMsTUFBYixFQUFxQjtBQUNoRjVCLElBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTZCLEdBQVIsQ0FBWSxFQUFaO0FBQ0QsR0FGRDtBQUlELENBaEdBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBpc1J0bCA9ICQoJ2JvZHknKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcgfHwgJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJztcblxuICB2YXIgcm9sZXMgPSB7XG4gICAgMTogJ1VzZXInLFxuICAgIDI6ICdBdXRob3InLFxuICAgIDM6ICdTdGFmZicsXG4gICAgNDogJ0FkbWluJ1xuICB9O1xuXG4gIHZhciBzdGF0dXNlcyA9IHtcbiAgICAxOiBbJ0FjdGl2ZScsICdzdWNjZXNzJ10sXG4gICAgMjogWydCYW5uZWQnLCAnZGFuZ2VyJ10sXG4gICAgMzogWydEZWxldGVkJywgJ2RlZmF1bHQnXVxuICB9O1xuXG4gICQoJyN1c2VyLWxpc3QnKS5kYXRhVGFibGUoe1xuICAgIGFqYXg6ICcvanNvbi9wYWdlc191c2Vyc19saXN0Lmpzb24nLFxuICAgIGNvbHVtbkRlZnM6IFsge1xuICAgICAgdGFyZ2V0czogWzhdLFxuICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgIHNlYXJjaGFibGU6IGZhbHNlXG4gICAgfV0sXG4gICAgY3JlYXRlZFJvdzogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcblxuICAgICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAvLyBBY2NvdW50IGxpbmtcblxuICAgICAgJCgndGQnLCByb3cpLmVxKDEpLmh0bWwoJycpLmFwcGVuZChcbiAgICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4nICsgZGF0YVsxXSArICc8L2E+J1xuICAgICAgKTtcblxuICAgICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAvLyBWZXJpZmllZFxuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNSkuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJpb24gaW9uLW1kLScgKyAoZGF0YVs1XSA/ICdjaGVja21hcmsgdGV4dC1wcmltYXJ5JyA6ICdjbG9zZSB0ZXh0LWxpZ2h0JykgKyAnXCI+J1xuICAgICAgKTtcblxuICAgICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAvLyBSb2xlXG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSg2KS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgIHJvbGVzW2RhdGFbNl1dXG4gICAgICApO1xuXG4gICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgIC8vIFN0YXR1c1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNykuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1vdXRsaW5lLScgKyBzdGF0dXNlc1tkYXRhWzddXVsxXSArICdcIj4nICsgc3RhdHVzZXNbZGF0YVs3XV1bMF0gKyAnPC9zcGFuPidcbiAgICAgICk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gQWN0aW9uc1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoOCkuYWRkQ2xhc3MoJ3RleHQtY2VudGVyIHRleHQtbm93cmFwJykuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXhzIGljb24tYnRuIG1kLWJ0bi1mbGF0IHVzZXItdG9vbHRpcFwiIHRpdGxlPVwiRWRpdFwiPjxpIGNsYXNzPVwiaW9uIGlvbi1tZC1jcmVhdGVcIj48L2k+PC9idXR0b24+Jm5ic3A7Jm5ic3A7JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+JyArXG4gICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14cyBpY29uLWJ0biBtZC1idG4tZmxhdCBkcm9wZG93bi10b2dnbGUgaGlkZS1hcnJvdyB1c2VyLXRvb2x0aXBcIiB0aXRsZT1cIkFjdGlvbnNcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+PGkgY2xhc3M9XCJpb24gaW9uLWlvcy1zZXR0aW5nc1wiPjwvaT48L2J1dHRvbj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnUnICsgKGlzUnRsID8gJycgOiAnIGRyb3Bkb3duLW1lbnUtcmlnaHQnKSArICdcIj4nICtcbiAgICAgICAgICAgICc8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+VmlldyBwcm9maWxlPC9hPicgK1xuICAgICAgICAgICAgJzxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj5CYW4gdXNlcjwvYT4nICtcbiAgICAgICAgICAgICc8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+UmVtb3ZlPC9hPicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PidcbiAgICAgICk7XG5cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRvb2x0aXBzXG5cbiAgJCgnYm9keScpLnRvb2x0aXAoe1xuICAgIHNlbGVjdG9yOiAnLnVzZXItdG9vbHRpcCdcbiAgfSk7XG5cbiAgLy8gRmlsdGVyc1xuXG4gICQoJyN1c2VyLWxpc3QtbGF0ZXN0LWFjdGl2aXR5JykuZGF0ZXJhbmdlcGlja2VyKHtcbiAgICAgIG9wZW5zOiBpc1J0bCA/ICdyaWdodCcgOiAnbGVmdCcsXG4gICAgICBhdXRvVXBkYXRlSW5wdXQ6IGZhbHNlLFxuICAgICAgbG9jYWxlOiB7XG4gICAgICAgIGNhbmNlbExhYmVsOiAnQ2xlYXInXG4gICAgICB9XG4gIH0pO1xuXG4gICQoJyN1c2VyLWxpc3QtbGF0ZXN0LWFjdGl2aXR5Jykub24oJ2FwcGx5LmRhdGVyYW5nZXBpY2tlcicsIGZ1bmN0aW9uKGV2LCBwaWNrZXIpIHtcbiAgICAkKHRoaXMpLnZhbChwaWNrZXIuc3RhcnREYXRlLmZvcm1hdCgnTU0vREQvWVlZWScpICsgJyAtICcgKyBwaWNrZXIuZW5kRGF0ZS5mb3JtYXQoJ01NL0REL1lZWVknKSk7XG4gIH0pO1xuXG4gICQoJyN1c2VyLWxpc3QtbGF0ZXN0LWFjdGl2aXR5Jykub24oJ2NhbmNlbC5kYXRlcmFuZ2VwaWNrZXInLCBmdW5jdGlvbihldiwgcGlja2VyKSB7XG4gICAgJCh0aGlzKS52YWwoJycpO1xuICB9KTtcblxufSk7XG4iXSwiZmlsZSI6ImpzL3BhZ2VzX3VzZXJzX2xpc3QuZXM1LmpzIn0=
