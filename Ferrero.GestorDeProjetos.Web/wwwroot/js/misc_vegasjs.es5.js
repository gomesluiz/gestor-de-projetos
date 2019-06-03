"use strict";

$(function () {
  $('#vegas-example').vegas({
    slides: [{
      src: "/img/bg/1.jpg"
    }, {
      src: "/img/bg/2.jpg"
    }, {
      src: "/img/bg/3.jpg"
    }, {
      src: "/img/bg/4.jpg"
    }, {
      src: "/img/bg/5.jpg"
    }],
    transition: ['fade', 'zoomOut', 'zoomIn', 'blur'],
    animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
  }); // Progess color

  $('#vegas-example .vegas-timer-progress').css('background', 'rgba(0,0,0,.2)'); // Overlays

  $('#vegas-dark-overlay-example, #vegas-light-overlay-example').vegas({
    overlay: true,
    timer: false,
    shuffle: true,
    slides: [{
      src: "/img/bg/1.jpg"
    }, {
      src: "/img/bg/2.jpg"
    }, {
      src: "/img/bg/3.jpg"
    }, {
      src: "/img/bg/4.jpg"
    }, {
      src: "/img/bg/5.jpg"
    }],
    transition: ['fade', 'blur']
  }); // Fixed bg

  $('#vegas-fixed-bg-example').vegas({
    overlay: false,
    timer: false,
    shuffle: true,
    slides: [{
      src: "/img/bg/1.jpg"
    }, {
      src: "/img/bg/2.jpg"
    }, {
      src: "/img/bg/3.jpg"
    }, {
      src: "/img/bg/4.jpg"
    }, {
      src: "/img/bg/5.jpg"
    }],
    transition: ['fade', 'blur']
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21pc2NfdmVnYXNqcy5qcyJdLCJuYW1lcyI6WyIkIiwidmVnYXMiLCJzbGlkZXMiLCJzcmMiLCJ0cmFuc2l0aW9uIiwiYW5pbWF0aW9uIiwiY3NzIiwib3ZlcmxheSIsInRpbWVyIiwic2h1ZmZsZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVc7QUFDWEEsRUFBQUEsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0JDLEtBQXBCLENBQTBCO0FBQ3hCQyxJQUFBQSxNQUFNLEVBQUUsQ0FDTjtBQUFFQyxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQURNLEVBRU47QUFBRUEsTUFBQUEsR0FBRyxFQUFFO0FBQVAsS0FGTSxFQUdOO0FBQUVBLE1BQUFBLEdBQUcsRUFBRTtBQUFQLEtBSE0sRUFJTjtBQUFFQSxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQUpNLEVBS047QUFBRUEsTUFBQUEsR0FBRyxFQUFFO0FBQVAsS0FMTSxDQURnQjtBQVF4QkMsSUFBQUEsVUFBVSxFQUFFLENBQUUsTUFBRixFQUFVLFNBQVYsRUFBcUIsUUFBckIsRUFBK0IsTUFBL0IsQ0FSWTtBQVN4QkMsSUFBQUEsU0FBUyxFQUFFLENBQUUsWUFBRixFQUFnQixjQUFoQixFQUFnQyxjQUFoQyxFQUFnRCxlQUFoRDtBQVRhLEdBQTFCLEVBRFcsQ0FhWDs7QUFDQUwsRUFBQUEsQ0FBQyxDQUFDLHNDQUFELENBQUQsQ0FBMENNLEdBQTFDLENBQThDLFlBQTlDLEVBQTRELGdCQUE1RCxFQWRXLENBZ0JYOztBQUNBTixFQUFBQSxDQUFDLENBQUMsMkRBQUQsQ0FBRCxDQUErREMsS0FBL0QsQ0FBcUU7QUFDbkVNLElBQUFBLE9BQU8sRUFBRSxJQUQwRDtBQUVuRUMsSUFBQUEsS0FBSyxFQUFFLEtBRjREO0FBR25FQyxJQUFBQSxPQUFPLEVBQUUsSUFIMEQ7QUFJbkVQLElBQUFBLE1BQU0sRUFBRSxDQUNOO0FBQUVDLE1BQUFBLEdBQUcsRUFBRTtBQUFQLEtBRE0sRUFFTjtBQUFFQSxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQUZNLEVBR047QUFBRUEsTUFBQUEsR0FBRyxFQUFFO0FBQVAsS0FITSxFQUlOO0FBQUVBLE1BQUFBLEdBQUcsRUFBRTtBQUFQLEtBSk0sRUFLTjtBQUFFQSxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQUxNLENBSjJEO0FBV25FQyxJQUFBQSxVQUFVLEVBQUUsQ0FBRSxNQUFGLEVBQVUsTUFBVjtBQVh1RCxHQUFyRSxFQWpCVyxDQStCWDs7QUFDQUosRUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJDLEtBQTdCLENBQW1DO0FBQ2pDTSxJQUFBQSxPQUFPLEVBQUUsS0FEd0I7QUFFakNDLElBQUFBLEtBQUssRUFBRSxLQUYwQjtBQUdqQ0MsSUFBQUEsT0FBTyxFQUFFLElBSHdCO0FBSWpDUCxJQUFBQSxNQUFNLEVBQUUsQ0FDTjtBQUFFQyxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQURNLEVBRU47QUFBRUEsTUFBQUEsR0FBRyxFQUFFO0FBQVAsS0FGTSxFQUdOO0FBQUVBLE1BQUFBLEdBQUcsRUFBRTtBQUFQLEtBSE0sRUFJTjtBQUFFQSxNQUFBQSxHQUFHLEVBQUU7QUFBUCxLQUpNLEVBS047QUFBRUEsTUFBQUEsR0FBRyxFQUFFO0FBQVAsS0FMTSxDQUp5QjtBQVdqQ0MsSUFBQUEsVUFBVSxFQUFFLENBQUUsTUFBRixFQUFVLE1BQVY7QUFYcUIsR0FBbkM7QUFhRCxDQTdDQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcbiAgJCgnI3ZlZ2FzLWV4YW1wbGUnKS52ZWdhcyh7XG4gICAgc2xpZGVzOiBbXG4gICAgICB7IHNyYzogXCIvaW1nL2JnLzEuanBnXCIgfSxcbiAgICAgIHsgc3JjOiBcIi9pbWcvYmcvMi5qcGdcIiB9LFxuICAgICAgeyBzcmM6IFwiL2ltZy9iZy8zLmpwZ1wiIH0sXG4gICAgICB7IHNyYzogXCIvaW1nL2JnLzQuanBnXCIgfSxcbiAgICAgIHsgc3JjOiBcIi9pbWcvYmcvNS5qcGdcIiB9XG4gICAgXSxcbiAgICB0cmFuc2l0aW9uOiBbICdmYWRlJywgJ3pvb21PdXQnLCAnem9vbUluJywgJ2JsdXInIF0sXG4gICAgYW5pbWF0aW9uOiBbICdrZW5idXJuc1VwJywgJ2tlbmJ1cm5zRG93bicsICdrZW5idXJuc0xlZnQnLCAna2VuYnVybnNSaWdodCcgXVxuICB9KTtcblxuICAvLyBQcm9nZXNzIGNvbG9yXG4gICQoJyN2ZWdhcy1leGFtcGxlIC52ZWdhcy10aW1lci1wcm9ncmVzcycpLmNzcygnYmFja2dyb3VuZCcsICdyZ2JhKDAsMCwwLC4yKScpO1xuXG4gIC8vIE92ZXJsYXlzXG4gICQoJyN2ZWdhcy1kYXJrLW92ZXJsYXktZXhhbXBsZSwgI3ZlZ2FzLWxpZ2h0LW92ZXJsYXktZXhhbXBsZScpLnZlZ2FzKHtcbiAgICBvdmVybGF5OiB0cnVlLFxuICAgIHRpbWVyOiBmYWxzZSxcbiAgICBzaHVmZmxlOiB0cnVlLFxuICAgIHNsaWRlczogW1xuICAgICAgeyBzcmM6IFwiL2ltZy9iZy8xLmpwZ1wiIH0sXG4gICAgICB7IHNyYzogXCIvaW1nL2JnLzIuanBnXCIgfSxcbiAgICAgIHsgc3JjOiBcIi9pbWcvYmcvMy5qcGdcIiB9LFxuICAgICAgeyBzcmM6IFwiL2ltZy9iZy80LmpwZ1wiIH0sXG4gICAgICB7IHNyYzogXCIvaW1nL2JnLzUuanBnXCIgfVxuICAgIF0sXG4gICAgdHJhbnNpdGlvbjogWyAnZmFkZScsICdibHVyJyBdLFxuICB9KTtcblxuICAvLyBGaXhlZCBiZ1xuICAkKCcjdmVnYXMtZml4ZWQtYmctZXhhbXBsZScpLnZlZ2FzKHtcbiAgICBvdmVybGF5OiBmYWxzZSxcbiAgICB0aW1lcjogZmFsc2UsXG4gICAgc2h1ZmZsZTogdHJ1ZSxcbiAgICBzbGlkZXM6IFtcbiAgICAgIHsgc3JjOiBcIi9pbWcvYmcvMS5qcGdcIiB9LFxuICAgICAgeyBzcmM6IFwiL2ltZy9iZy8yLmpwZ1wiIH0sXG4gICAgICB7IHNyYzogXCIvaW1nL2JnLzMuanBnXCIgfSxcbiAgICAgIHsgc3JjOiBcIi9pbWcvYmcvNC5qcGdcIiB9LFxuICAgICAgeyBzcmM6IFwiL2ltZy9iZy81LmpwZ1wiIH1cbiAgICBdLFxuICAgIHRyYW5zaXRpb246IFsgJ2ZhZGUnLCAnYmx1cicgXSxcbiAgfSk7XG59KTtcbiJdLCJmaWxlIjoianMvbWlzY192ZWdhc2pzLmVzNS5qcyJ9