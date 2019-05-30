"use strict";

$(function () {
  // Bind normal buttons
  Ladda.bind('.button-demo button', {
    timeout: 2000
  }); // Bind progress buttons and simulate loading progress

  Ladda.bind('.progress-demo button', {
    callback: function callback(instance) {
      var progress = 0;
      var interval = setInterval(function () {
        progress = Math.min(progress + Math.random() * 0.1, 1);
        instance.setProgress(progress);

        if (progress === 1) {
          instance.stop();
          clearInterval(interval);
        }
      }, 200);
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21pc2NfbGFkZGEuanMiXSwibmFtZXMiOlsiJCIsIkxhZGRhIiwiYmluZCIsInRpbWVvdXQiLCJjYWxsYmFjayIsImluc3RhbmNlIiwicHJvZ3Jlc3MiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiTWF0aCIsIm1pbiIsInJhbmRvbSIsInNldFByb2dyZXNzIiwic3RvcCIsImNsZWFySW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7O0FBQUFBLENBQUMsQ0FBQyxZQUFXO0FBQ1g7QUFDQUMsRUFBQUEsS0FBSyxDQUFDQyxJQUFOLENBQVkscUJBQVosRUFBbUM7QUFBRUMsSUFBQUEsT0FBTyxFQUFFO0FBQVgsR0FBbkMsRUFGVyxDQUlYOztBQUNBRixFQUFBQSxLQUFLLENBQUNDLElBQU4sQ0FBWSx1QkFBWixFQUFxQztBQUNuQ0UsSUFBQUEsUUFBUSxFQUFFLGtCQUFVQyxRQUFWLEVBQXFCO0FBQzdCLFVBQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsVUFBSUMsUUFBUSxHQUFHQyxXQUFXLENBQUUsWUFBVztBQUNyQ0YsUUFBQUEsUUFBUSxHQUFHRyxJQUFJLENBQUNDLEdBQUwsQ0FBVUosUUFBUSxHQUFHRyxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsR0FBckMsRUFBMEMsQ0FBMUMsQ0FBWDtBQUNBTixRQUFBQSxRQUFRLENBQUNPLFdBQVQsQ0FBc0JOLFFBQXRCOztBQUVBLFlBQUlBLFFBQVEsS0FBSyxDQUFqQixFQUFxQjtBQUNuQkQsVUFBQUEsUUFBUSxDQUFDUSxJQUFUO0FBQ0FDLFVBQUFBLGFBQWEsQ0FBRVAsUUFBRixDQUFiO0FBQ0Q7QUFDRixPQVJ5QixFQVF2QixHQVJ1QixDQUExQjtBQVNEO0FBWmtDLEdBQXJDO0FBY0QsQ0FuQkEsQ0FBRCIsInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XG4gIC8vIEJpbmQgbm9ybWFsIGJ1dHRvbnNcbiAgTGFkZGEuYmluZCggJy5idXR0b24tZGVtbyBidXR0b24nLCB7IHRpbWVvdXQ6IDIwMDAgfSApO1xuXG4gIC8vIEJpbmQgcHJvZ3Jlc3MgYnV0dG9ucyBhbmQgc2ltdWxhdGUgbG9hZGluZyBwcm9ncmVzc1xuICBMYWRkYS5iaW5kKCAnLnByb2dyZXNzLWRlbW8gYnV0dG9uJywge1xuICAgIGNhbGxiYWNrOiBmdW5jdGlvbiggaW5zdGFuY2UgKSB7XG4gICAgICB2YXIgcHJvZ3Jlc3MgPSAwO1xuICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkge1xuICAgICAgICBwcm9ncmVzcyA9IE1hdGgubWluKCBwcm9ncmVzcyArIE1hdGgucmFuZG9tKCkgKiAwLjEsIDEgKTtcbiAgICAgICAgaW5zdGFuY2Uuc2V0UHJvZ3Jlc3MoIHByb2dyZXNzICk7XG5cbiAgICAgICAgaWYoIHByb2dyZXNzID09PSAxICkge1xuICAgICAgICAgIGluc3RhbmNlLnN0b3AoKTtcbiAgICAgICAgICBjbGVhckludGVydmFsKCBpbnRlcnZhbCApO1xuICAgICAgICB9XG4gICAgICB9LCAyMDAgKTtcbiAgICB9XG4gIH0gKTtcbn0pO1xuIl0sImZpbGUiOiJqcy9taXNjX2xhZGRhLmVzNS5qcyJ9
