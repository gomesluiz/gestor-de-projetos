"use strict";

$(function () {
  var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  var statuses = {
    1: ['Published', 'success'],
    2: ['Out of stock', 'danger'],
    3: ['Pending', 'info']
  };
  $('#product-list').dataTable({
    ajax: '/json/pages_e-commerce_product-list.json',
    "columns": [{
      "data": "1"
    }, {
      "data": "2"
    }, {
      "data": "3"
    }, {
      "data": "4"
    }, {
      "data": "5"
    }, {
      "data": "6"
    }, {
      "data": "7"
    }, {
      "data": "8"
    }],
    order: [[1, 'desc']],
    columnDefs: [{
      targets: [7],
      orderable: false,
      searchable: false
    }],
    createdRow: function createdRow(row, data, index) {
      // Add extra padding and set minimum width
      $('td', row).addClass('py-2 align-middle').eq(0).css('min-width', '300px'); // *********************************************************************
      // Product name

      $('td', row).eq(0).html('').append('<div class="media align-items-center">' + '<img class="ui-w-40 d-block" src="/img/uikit/' + data[0] + '" alt="">' + '<a href="javascript:void(0)" class="media-body d-block text-body ml-3">' + data[1] + '</a>' + '</div>'); // *********************************************************************
      // Price

      $('td', row).eq(3).html('').append(numeral(data[4]).format('$0,0.00')); // *********************************************************************
      // Views

      $('td', row).eq(5).html('').append(numeral(data[6]).format('0,0')); // *********************************************************************
      // Status

      $('td', row).eq(6).html('').append('<span class="badge badge-outline-' + statuses[data[7]][1] + '">' + statuses[data[7]][0] + '</span>'); // *********************************************************************
      // Actions

      $('td', row).eq(7).addClass('text-nowrap').html('').append('<a href="javascript:void(0)" class="btn btn-default btn-xs icon-btn md-btn-flat product-tooltip" title="Show"><i class="ion ion-md-eye"></i></a>&nbsp;' + '<a href="javascript:void(0)" class="btn btn-default btn-xs icon-btn md-btn-flat product-tooltip" title="Edit"><i class="ion ion-md-create"></i></a>');
    }
  }); // Filters

  noUiSlider.create(document.getElementById('product-sales-slider'), {
    start: [10, 834],
    step: 10,
    connect: true,
    tooltips: true,
    direction: isRtl ? 'rtl' : 'ltr',
    range: {
      'min': [10],
      'max': [834]
    },
    format: {
      to: function to(value) {
        return Math.round(value);
      },
      from: function from(value) {
        return value;
      }
    }
  }).on('update', function (values) {
    document.getElementById('product-sales-slider-value').innerHTML = values.join(' - ');
  });
  noUiSlider.create(document.getElementById('product-price-slider'), {
    start: [10, 2000],
    step: 50,
    connect: true,
    tooltips: true,
    direction: isRtl ? 'rtl' : 'ltr',
    range: {
      'min': [10],
      'max': [2000]
    },
    format: {
      to: function to(value) {
        return numeral(value).format('$0,0');
      },
      from: function from(value) {
        return value.replace(/[\$\,]/g, '');
      }
    }
  }).on('update', function (values) {
    document.getElementById('product-price-slider-value').innerHTML = values.join(' - ');
  }); // Tooltips

  $('body').tooltip({
    selector: '.product-tooltip'
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX2UtY29tbWVyY2VfcHJvZHVjdC1saXN0LmpzIl0sIm5hbWVzIjpbIiQiLCJpc1J0bCIsImF0dHIiLCJzdGF0dXNlcyIsImRhdGFUYWJsZSIsImFqYXgiLCJvcmRlciIsImNvbHVtbkRlZnMiLCJ0YXJnZXRzIiwib3JkZXJhYmxlIiwic2VhcmNoYWJsZSIsImNyZWF0ZWRSb3ciLCJyb3ciLCJkYXRhIiwiaW5kZXgiLCJhZGRDbGFzcyIsImVxIiwiY3NzIiwiaHRtbCIsImFwcGVuZCIsIm51bWVyYWwiLCJmb3JtYXQiLCJub1VpU2xpZGVyIiwiY3JlYXRlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0YXJ0Iiwic3RlcCIsImNvbm5lY3QiLCJ0b29sdGlwcyIsImRpcmVjdGlvbiIsInJhbmdlIiwidG8iLCJ2YWx1ZSIsIk1hdGgiLCJyb3VuZCIsImZyb20iLCJvbiIsInZhbHVlcyIsImlubmVySFRNTCIsImpvaW4iLCJyZXBsYWNlIiwidG9vbHRpcCIsInNlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYLE1BQUlDLEtBQUssR0FBR0QsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUExQixJQUFtQ0YsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVRSxJQUFWLENBQWUsS0FBZixNQUEwQixLQUF6RTtBQUVBLE1BQUlDLFFBQVEsR0FBRztBQUNiLE9BQUcsQ0FBQyxXQUFELEVBQWMsU0FBZCxDQURVO0FBRWIsT0FBRyxDQUFDLGNBQUQsRUFBaUIsUUFBakIsQ0FGVTtBQUdiLE9BQUcsQ0FBQyxTQUFELEVBQVksTUFBWjtBQUhVLEdBQWY7QUFNQUgsRUFBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQkksU0FBbkIsQ0FBNkI7QUFDM0JDLElBQUFBLElBQUksRUFBRSwwQ0FEcUI7QUFFM0IsZUFBVyxDQUNUO0FBQUUsY0FBUTtBQUFWLEtBRFMsRUFFVDtB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RDtBQVV2RFYsSUFBQUEsTUFBTSxFQUFFO0FBQ1BXLE1BQUFBLEVBQUUsRUFBRSxZQUFVQyxLQUFWLEVBQWlCO0FBQ2xCLGVBQU9iLE9BQU8sQ0FBQ2EsS0FBRCxDQUFQLENBQWVaLE1BQWYsQ0FBc0IsTUFBdEIsQ0FBUDtBQUNGLE9BSE07QUFJUGUsTUFBQUEsSUFBSSxFQUFFLGNBQVVILEtBQVYsRUFBaUI7QUFDcEIsZUFBT0EsS0FBSyxDQUFDUSxPQUFOLENBQWMsU0FBZCxFQUF5QixFQUF6QixDQUFQO0FBQ0Y7QUFOTTtBQVYrQyxHQUQzRCxFQW9CR0osRUFwQkgsQ0FvQk0sUUFwQk4sRUFvQmdCLFVBQVNDLE1BQVQsRUFBaUI7QUFDN0JkLElBQUFBLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3Qiw0QkFBeEIsRUFBc0RjLFNBQXRELEdBQWtFRCxNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFaLENBQWxFO0FBQ0QsR0F0QkgsRUFwR1csQ0E0SFg7O0FBRUF4QyxFQUFBQSxDQUFDLENBQUMsTUFBRCxDQUFELENBQVUwQyxPQUFWLENBQWtCO0FBQ2hCQyxJQUFBQSxRQUFRLEVBQUU7QUFETSxHQUFsQjtBQUlELENBbElBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBpc1J0bCA9ICQoJ2JvZHknKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcgfHwgJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJztcblxuICB2YXIgc3RhdHVzZXMgPSB7XG4gICAgMTogWydQdWJsaXNoZWQnLCAnc3VjY2VzcyddLFxuICAgIDI6IFsnT3V0IG9mIHN0b2NrJywgJ2RhbmdlciddLFxuICAgIDM6IFsnUGVuZGluZycsICdpbmZvJ11cbiAgfTtcblxuICAkKCcjcHJvZHVjdC1saXN0JykuZGF0YVRhYmxlKHtcbiAgICBhamF4OiAnL2pzb24vcGFnZXNfZS1jb21tZXJjZV9wcm9kdWN0LWxpc3QuanNvbicsXG4gICAgXCJjb2x1bW5zXCI6IFtcbiAgICAgIHsgXCJkYXRhXCI6IFwiMVwiIH0sXG4gICAgICB7IFwiZGF0YVwiOiBcIjJcIiB9LFxuICAgICAgeyBcImRhdGFcIjogXCIzXCIgfSxcbiAgICAgIHsgXCJkYXRhXCI6IFwiNFwiIH0sXG4gICAgICB7IFwiZGF0YVwiOiBcIjVcIiB9LFxuICAgICAgeyBcImRhdGFcIjogXCI2XCIgfSxcbiAgICAgIHsgXCJkYXRhXCI6IFwiN1wiIH0sXG4gICAgICB7IFwiZGF0YVwiOiBcIjhcIiB9XG4gICAgXSxcbiAgICBvcmRlcjogW1sgMSwgJ2Rlc2MnIF1dLFxuICAgIGNvbHVtbkRlZnM6IFsge1xuICAgICAgdGFyZ2V0czogWzddLFxuICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgIHNlYXJjaGFibGU6IGZhbHNlXG4gICAgfV0sXG4gICAgY3JlYXRlZFJvdzogZnVuY3Rpb24gKHJvdywgZGF0YSwgaW5kZXgpIHtcbiAgICAgIC8vIEFkZCBleHRyYSBwYWRkaW5nIGFuZCBzZXQgbWluaW11bSB3aWR0aFxuICAgICAgJCgndGQnLCByb3cpLmFkZENsYXNzKCdweS0yIGFsaWduLW1pZGRsZScpLmVxKDApLmNzcygnbWluLXdpZHRoJywgJzMwMHB4Jyk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gUHJvZHVjdCBuYW1lXG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSgwKS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgICc8ZGl2IGNsYXNzPVwibWVkaWEgYWxpZ24taXRlbXMtY2VudGVyXCI+JyArXG4gICAgICAgICAgJzxpbWcgY2xhc3M9XCJ1aS13LTQwIGQtYmxvY2tcIiBzcmM9XCIvaW1nL3Vpa2l0LycgKyBkYXRhWzBdICsgJ1wiIGFsdD1cIlwiPicgK1xuICAgICAgICAgICc8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgY2xhc3M9XCJtZWRpYS1ib2R5IGQtYmxvY2sgdGV4dC1ib2R5IG1sLTNcIj4nICsgZGF0YVsxXSArICc8L2E+JyArXG4gICAgICAgICc8L2Rpdj4nXG4gICAgICApO1xuXG4gICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgIC8vIFByaWNlXG5cbiAgICAgICQoJ3RkJywgcm93KS5lcSgzKS5odG1sKCcnKS5hcHBlbmQoXG4gICAgICAgIG51bWVyYWwoZGF0YVs0XSkuZm9ybWF0KCckMCwwLjAwJylcbiAgICAgICk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gVmlld3NcblxuICAgICAgJCgndGQnLCByb3cpLmVxKDUpLmh0bWwoJycpLmFwcGVuZChcbiAgICAgICAgbnVtZXJhbChkYXRhWzZdKS5mb3JtYXQoJzAsMCcpXG4gICAgICApO1xuXG4gICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgIC8vIFN0YXR1c1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNikuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1vdXRsaW5lLScgKyBzdGF0dXNlc1tkYXRhWzddXVsxXSArICdcIj4nICsgc3RhdHVzZXNbZGF0YVs3XV1bMF0gKyAnPC9zcGFuPidcbiAgICAgICk7XG5cbiAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgLy8gQWN0aW9uc1xuXG4gICAgICAkKCd0ZCcsIHJvdykuZXEoNykuYWRkQ2xhc3MoJ3RleHQtbm93cmFwJykuaHRtbCgnJykuYXBwZW5kKFxuICAgICAgICAnPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi14cyBpY29uLWJ0biBtZC1idG4tZmxhdCBwcm9kdWN0LXRvb2x0aXBcIiB0aXRsZT1cIlNob3dcIj48aSBjbGFzcz1cImlvbiBpb24tbWQtZXllXCI+PC9pPjwvYT4mbmJzcDsnICtcbiAgICAgICAgJzxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4teHMgaWNvbi1idG4gbWQtYnRuLWZsYXQgcHJvZHVjdC10b29sdGlwXCIgdGl0bGU9XCJFZGl0XCI+PGkgY2xhc3M9XCJpb24gaW9uLW1kLWNyZWF0ZVwiPjwvaT48L2E+J1xuICAgICAgKTtcblxuICAgIH1cbiAgfSk7XG5cbiAgLy8gRmlsdGVyc1xuXG4gIG5vVWlTbGlkZXJcbiAgICAuY3JlYXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9kdWN0LXNhbGVzLXNsaWRlcicpLCB7XG4gICAgICBzdGFydDogWyAxMCwgODM0IF0sXG4gICAgICBzdGVwOiAxMCxcbiAgICAgIGNvbm5lY3Q6IHRydWUsXG4gICAgICB0b29sdGlwczogdHJ1ZSxcbiAgICAgIGRpcmVjdGlvbjogaXNSdGwgPyAncnRsJyA6ICdsdHInLFxuICAgICAgcmFuZ2U6IHtcbiAgICAgICAgJ21pbic6IFsgIDEwIF0sXG4gICAgICAgICdtYXgnOiBbIDgzNCBdXG4gICAgICB9LFxuICAgICAgZm9ybWF0OiB7XG4gICAgXHQgIHRvOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBcdFx0ICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gICAgXHQgIH0sXG4gICAgXHQgIGZyb206IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIFx0XHQgIHJldHVybiB2YWx1ZTtcbiAgICBcdCAgfVxuICAgIFx0fVxuICAgIH0pXG4gICAgLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9kdWN0LXNhbGVzLXNsaWRlci12YWx1ZScpLmlubmVySFRNTCA9IHZhbHVlcy5qb2luKCcgLSAnKVxuICAgIH0pO1xuXG4gIG5vVWlTbGlkZXJcbiAgICAuY3JlYXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9kdWN0LXByaWNlLXNsaWRlcicpLCB7XG4gICAgICBzdGFydDogWyAxMCwgMjAwMCBdLFxuICAgICAgc3RlcDogNTAsXG4gICAgICBjb25uZWN0OiB0cnVlLFxuICAgICAgdG9vbHRpcHM6IHRydWUsXG4gICAgICBkaXJlY3Rpb246IGlzUnRsID8gJ3J0bCcgOiAnbHRyJyxcbiAgICAgIHJhbmdlOiB7XG4gICAgICAgICdtaW4nOiBbIDEwIF0sXG4gICAgICAgICdtYXgnOiBbIDIwMDAgXVxuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgIFx0ICB0bzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bWVyYWwodmFsdWUpLmZvcm1hdCgnJDAsMCcpO1xuICAgIFx0ICB9LFxuICAgIFx0ICBmcm9tOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvW1xcJFxcLF0vZywgJycpO1xuICAgIFx0ICB9XG4gICAgXHR9XG4gICAgfSlcbiAgICAub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3QtcHJpY2Utc2xpZGVyLXZhbHVlJykuaW5uZXJIVE1MID0gdmFsdWVzLmpvaW4oJyAtICcpXG4gICAgfSk7XG5cbiAgLy8gVG9vbHRpcHNcblxuICAkKCdib2R5JykudG9vbHRpcCh7XG4gICAgc2VsZWN0b3I6ICcucHJvZHVjdC10b29sdGlwJ1xuICB9KTtcblxufSk7XG4iXSwiZmlsZSI6ImpzL3BhZ2VzX2UtY29tbWVyY2VfcHJvZHVjdC1saXN0LmVzNS5qcyJ9
