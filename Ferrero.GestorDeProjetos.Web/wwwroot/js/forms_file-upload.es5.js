"use strict";

$(document).ready(function () {
  $('.custom-file-input').change(function () {
    var path = $(this).val();

    if (path != '' && path != null) {
      var q = path.substring(path.lastIndexOf('\\') + 1);
      $('.custom-file-label').html(q);
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Zvcm1zX2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY2hhbmdlIiwicGF0aCIsInZhbCIsInEiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsImh0bWwiXSwibWFwcGluZ3MiOiI7O0FBQUFBLENBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBWTtBQUMxQkYsRUFBQUEsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0JHLE1BQXhCLENBQStCLFlBQVk7QUFDdkMsUUFBSUMsSUFBSSxHQUFHSixDQUFDLENBQUMsSUFBRCxDQUFELENBQVFLLEdBQVIsRUFBWDs7QUFDQSxRQUFJRCxJQUFJLElBQUksRUFBUixJQUFjQSxJQUFJLElBQUksSUFBMUIsRUFBZ0M7QUFDNUIsVUFBSUUsQ0FBQyxHQUFHRixJQUFJLENBQUNHLFNBQUwsQ0FBZUgsSUFBSSxDQUFDSSxXQUFMLENBQWlCLElBQWpCLElBQXlCLENBQXhDLENBQVI7QUFDQVIsTUFBQUEsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0JTLElBQXhCLENBQTZCSCxDQUE3QjtBQUNIO0FBQ0osR0FORDtBQU9ILENBUkQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmN1c3RvbS1maWxlLWlucHV0JykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhdGggPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICBpZiAocGF0aCAhPSAnJyAmJiBwYXRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBxID0gcGF0aC5zdWJzdHJpbmcocGF0aC5sYXN0SW5kZXhPZignXFxcXCcpICsgMSk7XG4gICAgICAgICAgICAkKCcuY3VzdG9tLWZpbGUtbGFiZWwnKS5odG1sKHEpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImpzL2Zvcm1zX2ZpbGUtdXBsb2FkLmVzNS5qcyJ9
