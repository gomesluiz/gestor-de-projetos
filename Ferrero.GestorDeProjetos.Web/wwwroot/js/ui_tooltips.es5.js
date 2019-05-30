"use strict";

$(function () {
  // Tooltips
  if ($('html').attr('dir') === 'rtl') {
    $('.tooltip-demo [data-placement=right]').attr('data-placement', 'left').addClass('rtled');
    $('.tooltip-demo [data-placement=left]:not(.rtled)').attr('data-placement', 'right').addClass('rtled');
  }

  $('[data-toggle="tooltip"]').tooltip(); // Popovers

  if ($('html').attr('dir') === 'rtl') {
    $('.popover-demo [data-placement=right]').attr('data-placement', 'left').addClass('rtled');
    $('.popover-demo [data-placement=left]:not(.rtled)').attr('data-placement', 'right').addClass('rtled');
  }

  $('[data-toggle="popover"]').popover();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3VpX3Rvb2x0aXBzLmpzIl0sIm5hbWVzIjpbIiQiLCJhdHRyIiwiYWRkQ2xhc3MiLCJ0b29sdGlwIiwicG9wb3ZlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVc7QUFDWDtBQUVBLE1BQUlBLENBQUMsQ0FBQyxNQUFELENBQUQsQ0FBVUMsSUFBVixDQUFlLEtBQWYsTUFBMEIsS0FBOUIsRUFBcUM7QUFDbkNELElBQUFBLENBQUMsQ0FBQyxzQ0FBRCxDQUFELENBQTBDQyxJQUExQyxDQUErQyxnQkFBL0MsRUFBaUUsTUFBakUsRUFBeUVDLFFBQXpFLENBQWtGLE9BQWxGO0FBQ0FGLElBQUFBLENBQUMsQ0FBQyxpREFBRCxDQUFELENBQXFEQyxJQUFyRCxDQUEwRCxnQkFBMUQsRUFBNEUsT0FBNUUsRUFBcUZDLFFBQXJGLENBQThGLE9BQTlGO0FBQ0Q7O0FBQ0RGLEVBQUFBLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCRyxPQUE3QixHQVBXLENBU1g7O0FBRUEsTUFBSUgsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUFVQyxJQUFWLENBQWUsS0FBZixNQUEwQixLQUE5QixFQUFxQztBQUNuQ0QsSUFBQUEsQ0FBQyxDQUFDLHNDQUFELENBQUQsQ0FBMENDLElBQTFDLENBQStDLGdCQUEvQyxFQUFpRSxNQUFqRSxFQUF5RUMsUUFBekUsQ0FBa0YsT0FBbEY7QUFDQUYsSUFBQUEsQ0FBQyxDQUFDLGlEQUFELENBQUQsQ0FBcURDLElBQXJELENBQTBELGdCQUExRCxFQUE0RSxPQUE1RSxFQUFxRkMsUUFBckYsQ0FBOEYsT0FBOUY7QUFDRDs7QUFDREYsRUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJJLE9BQTdCO0FBRUQsQ0FqQkEsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG4gIC8vIFRvb2x0aXBzXG5cbiAgaWYgKCQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCcpIHtcbiAgICAkKCcudG9vbHRpcC1kZW1vIFtkYXRhLXBsYWNlbWVudD1yaWdodF0nKS5hdHRyKCdkYXRhLXBsYWNlbWVudCcsICdsZWZ0JykuYWRkQ2xhc3MoJ3J0bGVkJyk7XG4gICAgJCgnLnRvb2x0aXAtZGVtbyBbZGF0YS1wbGFjZW1lbnQ9bGVmdF06bm90KC5ydGxlZCknKS5hdHRyKCdkYXRhLXBsYWNlbWVudCcsICdyaWdodCcpLmFkZENsYXNzKCdydGxlZCcpO1xuICB9XG4gICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKCk7XG5cbiAgLy8gUG9wb3ZlcnNcblxuICBpZiAoJCgnaHRtbCcpLmF0dHIoJ2RpcicpID09PSAncnRsJykge1xuICAgICQoJy5wb3BvdmVyLWRlbW8gW2RhdGEtcGxhY2VtZW50PXJpZ2h0XScpLmF0dHIoJ2RhdGEtcGxhY2VtZW50JywgJ2xlZnQnKS5hZGRDbGFzcygncnRsZWQnKTtcbiAgICAkKCcucG9wb3Zlci1kZW1vIFtkYXRhLXBsYWNlbWVudD1sZWZ0XTpub3QoLnJ0bGVkKScpLmF0dHIoJ2RhdGEtcGxhY2VtZW50JywgJ3JpZ2h0JykuYWRkQ2xhc3MoJ3J0bGVkJyk7XG4gIH1cbiAgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcblxufSk7XG4iXSwiZmlsZSI6ImpzL3VpX3Rvb2x0aXBzLmVzNS5qcyJ9
