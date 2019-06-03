"use strict";

$(function () {
  function openSidenav() {
    $('.clients-wrapper').addClass('clients-sidebox-open');
  }

  function closeSidenav() {
    $('.clients-wrapper').removeClass('clients-sidebox-open');
    $('.clients-table tr.bg-light').removeClass('bg-light');
  }

  function selectClient(row) {
    openSidenav();
    $('.clients-table tr.bg-light').removeClass('bg-light');
    $(row).addClass('bg-light');
  }

  $('body').on('click', '.clients-table tr', function () {
    // Load client data here
    // ...
    // Select client
    selectClient(this);
  });
  $('body').on('click', '.clients-sidebox-close', function (e) {
    e.preventDefault();
    closeSidenav();
  }); // Setup scrollbars

  $('.clients-scroll').each(function () {
    new PerfectScrollbar(this, {
      suppressScrollX: true,
      wheelPropagation: true
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3BhZ2VzX2NsaWVudHMuanMiXSwibmFtZXMiOlsiJCIsIm9wZW5TaWRlbmF2IiwiYWRkQ2xhc3MiLCJjbG9zZVNpZGVuYXYiLCJyZW1vdmVDbGFzcyIsInNlbGVjdENsaWVudCIsInJvdyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZWFjaCIsIlBlcmZlY3RTY3JvbGxiYXIiLCJzdXBwcmVzc1Njcm9sbFgiLCJ3aGVlbFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxDQUFDLENBQUMsWUFBVztBQUVYLFdBQVNDLFdBQVQsR0FBdUI7QUFDckJELElBQUFBLENBQUMsQ0FBQyxrQkFBRCxDQUFELENBQXNCRSxRQUF0QixDQUErQixzQkFBL0I7QUFDRDs7QUFFRCxXQUFTQyxZQUFULEdBQXdCO0FBQ3RCSCxJQUFBQSxDQUFDLENBQUMsa0JBQUQsQ0FBRCxDQUFzQkksV0FBdEIsQ0FBa0Msc0JBQWxDO0FBQ0FKLElBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDSSxXQUFoQyxDQUE0QyxVQUE1QztBQUNEOztBQUVELFdBQVNDLFlBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCO0FBQ3pCTCxJQUFBQSxXQUFXO0FBQ1hELElBQUFBLENBQUMsQ0FBQyw0QkFBRCxDQUFELENBQWdDSSxXQUFoQyxDQUE0QyxVQUE1QztBQUNBSixJQUFBQSxDQUFDLENBQUNNLEdBQUQsQ0FBRCxDQUFPSixRQUFQLENBQWdCLFVBQWhCO0FBQ0Q7O0FBRURGLEVBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVU8sRUFBVixDQUFhLE9BQWIsRUFBc0IsbUJBQXRCLEVBQTJDLFlBQVc7QUFDcEQ7QUFDQTtBQUVBO0FBQ0FGLElBQUFBLFlBQVksQ0FBQyxJQUFELENBQVo7QUFDRCxHQU5EO0FBUUFMLEVBQUFBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVU8sRUFBVixDQUFhLE9BQWIsRUFBc0Isd0JBQXRCLEVBQWdELFVBQVNDLENBQVQsRUFBWTtBQUMxREEsSUFBQUEsQ0FBQyxDQUFDQyxjQUFGO0FBQ0FOLElBQUFBLFlBQVk7QUFDYixHQUhELEVBekJXLENBOEJYOztBQUVBSCxFQUFBQSxDQUFDLENBQUMsaUJBQUQsQ0FBRCxDQUFxQlUsSUFBckIsQ0FBMEIsWUFBVztBQUNuQyxRQUFJQyxnQkFBSixDQUFxQixJQUFyQixFQUEyQjtBQUN6QkMsTUFBQUEsZUFBZSxFQUFFLElBRFE7QUFFekJDLE1BQUFBLGdCQUFnQixFQUFFO0FBRk8sS0FBM0I7QUFJRCxHQUxEO0FBT0QsQ0F2Q0EsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gb3BlblNpZGVuYXYoKSB7XG4gICAgJCgnLmNsaWVudHMtd3JhcHBlcicpLmFkZENsYXNzKCdjbGllbnRzLXNpZGVib3gtb3BlbicpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VTaWRlbmF2KCkge1xuICAgICQoJy5jbGllbnRzLXdyYXBwZXInKS5yZW1vdmVDbGFzcygnY2xpZW50cy1zaWRlYm94LW9wZW4nKTtcbiAgICAkKCcuY2xpZW50cy10YWJsZSB0ci5iZy1saWdodCcpLnJlbW92ZUNsYXNzKCdiZy1saWdodCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VsZWN0Q2xpZW50KHJvdykge1xuICAgIG9wZW5TaWRlbmF2KCk7XG4gICAgJCgnLmNsaWVudHMtdGFibGUgdHIuYmctbGlnaHQnKS5yZW1vdmVDbGFzcygnYmctbGlnaHQnKTtcbiAgICAkKHJvdykuYWRkQ2xhc3MoJ2JnLWxpZ2h0Jyk7XG4gIH1cblxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5jbGllbnRzLXRhYmxlIHRyJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gTG9hZCBjbGllbnQgZGF0YSBoZXJlXG4gICAgLy8gLi4uXG5cbiAgICAvLyBTZWxlY3QgY2xpZW50XG4gICAgc2VsZWN0Q2xpZW50KHRoaXMpO1xuICB9KTtcblxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5jbGllbnRzLXNpZGVib3gtY2xvc2UnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsb3NlU2lkZW5hdigpO1xuICB9KTtcblxuICAvLyBTZXR1cCBzY3JvbGxiYXJzXG5cbiAgJCgnLmNsaWVudHMtc2Nyb2xsJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICBuZXcgUGVyZmVjdFNjcm9sbGJhcih0aGlzLCB7XG4gICAgICBzdXBwcmVzc1Njcm9sbFg6IHRydWUsXG4gICAgICB3aGVlbFByb3BhZ2F0aW9uOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdLCJmaWxlIjoianMvcGFnZXNfY2xpZW50cy5lczUuanMifQ==