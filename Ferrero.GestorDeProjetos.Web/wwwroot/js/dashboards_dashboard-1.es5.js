"use strict";

$(function () {
  var chart1 = new Chart(document.getElementById('statistics-chart-1').getContext("2d"), {
    type: 'line',
    data: {
      labels: ['2016-10', '2016-11', '2016-12', '2017-01', '2017-02', '2017-03', '2017-04', '2017-05'],
      datasets: [{
        label: 'Visits',
        data: [93, 25, 95, 59, 46, 68, 4, 41],
        borderWidth: 1,
        backgroundColor: 'rgba(28,180,255,.05)',
        borderColor: 'rgba(28,180,255,1)'
      }, {
        label: 'Returns',
        data: [83, 1, 43, 28, 56, 82, 80, 66],
        borderWidth: 1,
        borderDash: [5, 5],
        backgroundColor: 'rgba(136, 151, 170, 0.1)',
        borderColor: '#8897aa'
      }]
    },
    options: {
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#aaa'
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: '#aaa',
            stepSize: 20
          }
        }]
      },
      responsive: false,
      maintainAspectRatio: false
    }
  });
  var chart2 = new Chart(document.getElementById('statistics-chart-2').getContext("2d"), {
    type: 'line',
    data: {
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61, 38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18],
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#009688',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointRadius: 1,
        lineTension: 0
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      responsive: false,
      maintainAspectRatio: false
    }
  });
  var chart3 = new Chart(document.getElementById('statistics-chart-3').getContext("2d"), {
    type: 'bar',
    data: {
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61, 38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18],
        borderWidth: 0,
        backgroundColor: '#673AB7'
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      responsive: false,
      maintainAspectRatio: false
    }
  });
  var chart4 = new Chart(document.getElementById('statistics-chart-4').getContext("2d"), {
    type: 'line',
    data: {
      datasets: [{
        data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61, 38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47],
        borderWidth: 1,
        backgroundColor: 'rgba(206, 221, 54, 0.2)',
        borderColor: '#cedd36',
        pointBackgroundColor: 'rgba(0,0,0,0)',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointRadius: 1
      }],
      labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      responsive: false,
      maintainAspectRatio: false
    }
  });
  var chart5 = new Chart(document.getElementById('statistics-chart-5').getContext("2d"), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [85, 15],
        backgroundColor: ['#fff', 'rgba(255,255,255,0.3)'],
        hoverBackgroundColor: ['#fff', 'rgba(255,255,255,0.3)'],
        borderWidth: 0
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      cutoutPercentage: 94,
      responsive: false,
      maintainAspectRatio: false
    }
  });
  var chart6 = new Chart(document.getElementById('statistics-chart-6').getContext("2d"), {
    type: 'pie',
    data: {
      labels: ['Desktops', 'Smartphones', 'Tablets'],
      datasets: [{
        data: [1225, 654, 211],
        backgroundColor: ['rgba(99,125,138,0.5)', 'rgba(28,151,244,0.5)', 'rgba(2,188,119,0.5)'],
        borderColor: ['#647c8a', '#2196f3', '#02bc77'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12
        }
      },
      responsive: false,
      maintainAspectRatio: false
    }
  });
  new PerfectScrollbar(document.getElementById('tasks-inner'));
  new PerfectScrollbar(document.getElementById('team-todo-inner'));

  if ($('html').attr('dir') === 'rtl') {
    $('#sales-dropdown-menu').removeClass('dropdown-menu-right');
  } // Resizing charts


  function resizeCharts() {
    chart1.resize();
    chart2.resize();
    chart3.resize();
    chart4.resize();
    chart5.resize();
    chart6.resize();
  } // Initial resize


  resizeCharts(); // For performance reasons resize charts on delayed resize event

  window.layoutHelpers.on('resize.dashboard-1', resizeCharts);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Rhc2hib2FyZHNfZGFzaGJvYXJkLTEuanMiXSwibmFtZXMiOlsiJCIsImNoYXJ0MSIsIkNoYXJ0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImdldENvbnRleHQiLCJ0eXBlIiwiZGF0YSIsImxhYmVscyIsImRhdGFzZXRzIiwibGFiZWwiLCJib3JkZXJXaWR0aCIsImJhY2tncm91bmRDb2xvciIsImJvcmRlckNvbG9yIiwiYm9yZGVyRGFzaCIsIm9wdGlvbnMiLCJzY2FsZXMiLCJ4QXhlcyIsImdyaWRMaW5lcyIsImRpc3BsYXkiLCJ0aWNrcyIsImZvbnRDb2xvciIsInlBeGVzIiwic3RlcFNpemUiLCJyZXNwb25zaXZlIiwibWFpbnRhaW5Bc3BlY3RSYXRpbyIsImNoYXJ0MiIsInBvaW50Qm9yZGVyQ29sb3IiLCJwb2ludFJhZGl1cyIsImxpbmVUZW5zaW9uIiwibGVnZW5kIiwiY2hhcnQzIiwiY2hhcnQ0IiwicG9pbnRCYWNrZ3JvdW5kQ29sb3IiLCJjaGFydDUiLCJob3ZlckJhY2tncm91bmRDb2xvciIsInRvb2x0aXBzIiwiZW5hYmxlZCIsImN1dG91dFBlcmNlbnRhZ2UiLCJjaGFydDYiLCJwb3NpdGlvbiIsImJveFdpZHRoIiwiUGVyZmVjdFNjcm9sbGJhciIsImF0dHIiLCJyZW1vdmVDbGFzcyIsInJlc2l6ZUNoYXJ0cyIsInJlc2l6ZSIsIndpbmRvdyIsImxheW91dEhlbHBlcnMiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVc7QUFDWCxNQUFJQyxNQUFNLEdBQUcsSUFBSUMsS0FBSixDQUFVQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0Isb0JBQXhCLEVBQThDQyxVQUE5QyxDQUF5RCxJQUF6RCxDQUFWLEVBQTBFO0FBQ3JGQyxJQUFBQSxJQUFJLEVBQUUsTUFEK0U7QUFFckZDLElBQUFBLElBQUksRUFBRTtBQUNKQyxNQUFBQSxNQUFNLEVBQUUsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixF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LElBQUFBLE1BQU0sQ0FBQ08sTUFBUDtBQUNELEdBak9VLENBbU9YOzs7QUFDQUQsRUFBQUEsWUFBWSxHQXBPRCxDQXNPWDs7QUFDQUUsRUFBQUEsTUFBTSxDQUFDQyxhQUFQLENBQXFCQyxFQUFyQixDQUF3QixvQkFBeEIsRUFBOENKLFlBQTlDO0FBQ0QsQ0F4T0EsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG4gIHZhciBjaGFydDEgPSBuZXcgQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpc3RpY3MtY2hhcnQtMScpLmdldENvbnRleHQoXCIyZFwiKSwge1xuICAgIHR5cGU6ICdsaW5lJyxcbiAgICBkYXRhOiB7XG4gICAgICBsYWJlbHM6IFsnMjAxNi0xMCcsICcyMDE2LTExJywgJzIwMTYtMTInLCAnMjAxNy0wMScsICcyMDE3LTAyJywgJzIwMTctMDMnLCAnMjAxNy0wNCcsICcyMDE3LTA1J10sXG4gICAgICBkYXRhc2V0czogW3tcbiAgICAgICAgbGFiZWw6ICdWaXNpdHMnLFxuICAgICAgICBkYXRhOiBbOTMsIDI1LCA5NSwgNTksIDQ2LCA2OCwgNCwgNDFdLFxuICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyOCwxODAsMjU1LC4wNSknLFxuICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMjgsMTgwLDI1NSwxKSdcbiAgICAgIH0sIHtcbiAgICAgICAgbGFiZWw6ICdSZXR1cm5zJyxcbiAgICAgICAgZGF0YTogWzgzLCAxLCA0MywgMjgsIDU2LCA4MiwgODAsIDY2XSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgICAgIGJvcmRlckRhc2g6IFs1LCA1XSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgxMzYsIDE1MSwgMTcwLCAwLjEpJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjODg5N2FhJ1xuICAgICAgfV0sXG4gICAgfSxcbiAgICBvcHRpb25zOiB7XG4gICAgICBzY2FsZXM6IHtcbiAgICAgICAgeEF4ZXM6IFt7XG4gICAgICAgICAgZ3JpZExpbmVzOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGlja3M6IHtcbiAgICAgICAgICAgIGZvbnRDb2xvcjogJyNhYWEnXG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgZ3JpZExpbmVzOiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGlja3M6IHtcbiAgICAgICAgICAgIGZvbnRDb2xvcjogJyNhYWEnLFxuICAgICAgICAgICAgc3RlcFNpemU6IDIwXG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfSxcblxuICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGNoYXJ0MiA9IG5ldyBDaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlzdGljcy1jaGFydC0yJykuZ2V0Q29udGV4dChcIjJkXCIpLCB7XG4gICAgdHlwZTogJ2xpbmUnLFxuICAgIGRhdGE6IHtcbiAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICBkYXRhOiBbMjQsIDkyLCA3NywgOTAsIDkxLCA3OCwgMjgsIDQ5LCAyMywgODEsIDE1LCA5NywgOTQsIDE2LCA5OSwgNjEsXG4gICAgICAgICAgMzgsIDM0LCA0OCwgMywgNSwgMjEsIDI3LCA0LCAzMywgNDAsIDQ2LCA0NywgNDgsIDE4XG4gICAgICAgIF0sXG4gICAgICAgIGJvcmRlcldpZHRoOiAxLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDApJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICcjMDA5Njg4JyxcbiAgICAgICAgcG9pbnRCb3JkZXJDb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuICAgICAgICBwb2ludFJhZGl1czogMSxcbiAgICAgICAgbGluZVRlbnNpb246IDBcbiAgICAgIH1dLFxuICAgICAgbGFiZWxzOiBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ11cbiAgICB9LFxuXG4gICAgb3B0aW9uczoge1xuICAgICAgc2NhbGVzOiB7XG4gICAgICAgIHhBeGVzOiBbe1xuICAgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuICAgICAgICB9XSxcbiAgICAgICAgeUF4ZXM6IFt7XG4gICAgICAgICAgZGlzcGxheTogZmFsc2VcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICBsZWdlbmQ6IHtcbiAgICAgICAgZGlzcGxheTogZmFsc2VcbiAgICAgIH0sXG4gICAgICByZXNwb25zaXZlOiBmYWxzZSxcbiAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlXG4gICAgfVxuICB9KTtcblxuICB2YXIgY2hhcnQzID0gbmV3IENoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0aXN0aWNzLWNoYXJ0LTMnKS5nZXRDb250ZXh0KFwiMmRcIiksIHtcbiAgICB0eXBlOiAnYmFyJyxcbiAgICBkYXRhOiB7XG4gICAgICBkYXRhc2V0czogW3tcbiAgICAgICAgZGF0YTogWzI0LCA5MiwgNzcsIDkwLCA5MSwgNzgsIDI4LCA0OSwgMjMsIDgxLCAxNSwgOTcsIDk0LCAxNiwgOTksIDYxLFxuICAgICAgICAgIDM4LCAzNCwgNDgsIDMsIDUsIDIxLCAyNywgNCwgMzMsIDQwLCA0NiwgNDcsIDQ4LCAxOFxuICAgICAgICBdLFxuICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzY3M0FCNycsXG4gICAgICB9XSxcbiAgICAgIGxhYmVsczogWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddXG4gICAgfSxcblxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB4QXhlczogW3tcbiAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgfV0sXG4gICAgICAgIHlBeGVzOiBbe1xuICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZVxuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGNoYXJ0NCA9IG5ldyBDaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGlzdGljcy1jaGFydC00JykuZ2V0Q29udGV4dChcIjJkXCIpLCB7XG4gICAgdHlwZTogJ2xpbmUnLFxuICAgIGRhdGE6IHtcbiAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICBkYXRhOiBbMjQsIDkyLCA3NywgOTAsIDkxLCA3OCwgMjgsIDQ5LCAyMywgODEsIDE1LCA5NywgOTQsIDE2LCA5OSwgNjEsXG4gICAgICAgICAgMzgsIDM0LCA0OCwgMywgNSwgMjEsIDI3LCA0LCAzMywgNDAsIDQ2LCA0N1xuICAgICAgICBdLFxuICAgICAgICBib3JkZXJXaWR0aDogMSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgyMDYsIDIyMSwgNTQsIDAuMiknLFxuICAgICAgICBib3JkZXJDb2xvcjogJyNjZWRkMzYnLFxuICAgICAgICBwb2ludEJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMCknLFxuICAgICAgICBwb2ludEJvcmRlckNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIHBvaW50UmFkaXVzOiAxLFxuXG4gICAgICB9XSxcbiAgICAgIGxhYmVsczogWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXVxuICAgIH0sXG5cbiAgICBvcHRpb25zOiB7XG4gICAgICBzY2FsZXM6IHtcbiAgICAgICAgeEF4ZXM6IFt7XG4gICAgICAgICAgZGlzcGxheTogZmFsc2UsXG4gICAgICAgIH1dLFxuICAgICAgICB5QXhlczogW3tcbiAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGxlZ2VuZDoge1xuICAgICAgICBkaXNwbGF5OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2VcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBjaGFydDUgPSBuZXcgQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpc3RpY3MtY2hhcnQtNScpLmdldENvbnRleHQoXCIyZFwiKSwge1xuICAgIHR5cGU6ICdkb3VnaG51dCcsXG4gICAgZGF0YToge1xuICAgICAgZGF0YXNldHM6IFt7XG4gICAgICAgIGRhdGE6IFs4NSwgMTVdLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFsnI2ZmZicsICdyZ2JhKDI1NSwyNTUsMjU1LDAuMyknXSxcbiAgICAgICAgaG92ZXJCYWNrZ3JvdW5kQ29sb3I6IFsnI2ZmZicsICdyZ2JhKDI1NSwyNTUsMjU1LDAuMyknXSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDBcbiAgICAgIH1dXG4gICAgfSxcblxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB4QXhlczogW3tcbiAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgfV0sXG4gICAgICAgIHlBeGVzOiBbe1xuICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICB9LFxuICAgICAgdG9vbHRpcHM6IHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBjdXRvdXRQZXJjZW50YWdlOiA5NCxcbiAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2VcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBjaGFydDYgPSBuZXcgQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRpc3RpY3MtY2hhcnQtNicpLmdldENvbnRleHQoXCIyZFwiKSwge1xuICAgIHR5cGU6ICdwaWUnLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsczogWydEZXNrdG9wcycsICdTbWFydHBob25lcycsICdUYWJsZXRzJ10sXG4gICAgICBkYXRhc2V0czogW3tcbiAgICAgICAgZGF0YTogWzEyMjUsIDY1NCwgMjExXSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbJ3JnYmEoOTksMTI1LDEzOCwwLjUpJywgJ3JnYmEoMjgsMTUxLDI0NCwwLjUpJywgJ3JnYmEoMiwxODgsMTE5LDAuNSknXSxcbiAgICAgICAgYm9yZGVyQ29sb3I6IFsnIzY0N2M4YScsICcjMjE5NmYzJywgJyMwMmJjNzcnXSxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDFcbiAgICAgIH1dXG4gICAgfSxcblxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB4QXhlczogW3tcbiAgICAgICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgICAgfV0sXG4gICAgICAgIHlBeGVzOiBbe1xuICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgbGVnZW5kOiB7XG4gICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICBib3hXaWR0aDogMTJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2VcbiAgICB9XG4gIH0pO1xuXG4gIG5ldyBQZXJmZWN0U2Nyb2xsYmFyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrcy1pbm5lcicpKTtcbiAgbmV3IFBlcmZlY3RTY3JvbGxiYXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYW0tdG9kby1pbm5lcicpKTtcblxuICBpZiAoJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJykge1xuICAgICQoJyNzYWxlcy1kcm9wZG93bi1tZW51JykucmVtb3ZlQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbiAgfVxuXG4gIC8vIFJlc2l6aW5nIGNoYXJ0c1xuXG4gIGZ1bmN0aW9uIHJlc2l6ZUNoYXJ0cygpIHtcbiAgICBjaGFydDEucmVzaXplKCk7XG4gICAgY2hhcnQyLnJlc2l6ZSgpO1xuICAgIGNoYXJ0My5yZXNpemUoKTtcbiAgICBjaGFydDQucmVzaXplKCk7XG4gICAgY2hhcnQ1LnJlc2l6ZSgpO1xuICAgIGNoYXJ0Ni5yZXNpemUoKTtcbiAgfVxuXG4gIC8vIEluaXRpYWwgcmVzaXplXG4gIHJlc2l6ZUNoYXJ0cygpO1xuXG4gIC8vIEZvciBwZXJmb3JtYW5jZSByZWFzb25zIHJlc2l6ZSBjaGFydHMgb24gZGVsYXllZCByZXNpemUgZXZlbnRcbiAgd2luZG93LmxheW91dEhlbHBlcnMub24oJ3Jlc2l6ZS5kYXNoYm9hcmQtMScsIHJlc2l6ZUNoYXJ0cyk7XG59KTtcbiJdLCJmaWxlIjoianMvZGFzaGJvYXJkc19kYXNoYm9hcmQtMS5lczUuanMifQ==
