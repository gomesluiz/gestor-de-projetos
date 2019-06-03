"use strict";

$(function () {
  $('[data-toggle="cropper-example-tooltip"]').tooltip({
    container: 'body'
  });
  var URL = window.URL || window.webkitURL;
  var $image = $('#cropper-example-image');
  var $download = $('#cropper-example-download');
  var options = {
    aspectRatio: 16 / 9,
    preview: '.cropper-example-preview',
    crop: function crop(e) {
      $('#cropper-example-dataX').val(Math.round(e.detail.x));
      $('#cropper-example-dataY').val(Math.round(e.detail.y));
      $('#cropper-example-dataHeight').val(Math.round(e.detail.height));
      $('#cropper-example-dataWidth').val(Math.round(e.detail.width));
      $('#cropper-example-dataRotate').val(e.detail.rotate);
      $('#cropper-example-dataScaleX').val(e.detail.scaleX);
      $('#cropper-example-dataScaleY').val(e.detail.scaleY);
    }
  };
  var originalImageURL = $image.attr('src');
  var uploadedImageURL; // Cropper

  $image.cropper(options); // IE10 fix

  if (typeof document.documentMode === 'number' && document.documentMode < 11) {
    options = $.extend({}, options, {
      zoomOnWheel: false
    });
    setTimeout(function () {
      $image.cropper('destroy').cropper(options);
    }, 1000);
  } // Buttons


  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  } // Download


  if (typeof $download[0].download === 'undefined') {
    $download.addClass('disabled');
  } // Methods


  $('.cropper-example-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if ($image.data('cropper') && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (data.method === 'rotate') {
        $image.cropper('clear');
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      if (data.method === 'rotate') {
        $image.cropper('crop');
      }

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#cropper-example-getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!$download.hasClass('disabled')) {
              $download.attr('href', result.toDataURL('image/jpeg'));
            }
          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }
    }
  }); // Import image

  var $inputImage = $('#cropper-example-inputImage');

  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          uploadedImageURL = URL.createObjectURL(file);
          $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
          $inputImage.val('');
        } else {
          window.alert('Please choose an image file.');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3VpX2Nyb3BwZXIuanMiXSwibmFtZXMiOlsiJCIsInRvb2x0aXAiLCJjb250YWluZXIiLCJVUkwiLCJ3aW5kb3ciLCJ3ZWJraXRVUkwiLCIkaW1hZ2UiLCIkZG93bmxvYWQiLCJvcHRpb25zIiwiYXNwZWN0UmF0aW8iLCJwcmV2aWV3IiwiY3JvcCIsImUiLCJ2YWwiLCJNYXRoIiwicm91bmQiLCJkZXRhaWwiLCJ4IiwieSIsImhlaWdodCIsIndpZHRoIiwicm90YXRlIiwic2NhbGVYIiwic2NhbGVZIiwib3JpZ2luYWxJbWFnZVVSTCIsImF0dHIiLCJ1cGxvYWRlZEltYWdlVVJMIiwiY3JvcHBlciIsImRvY3VtZW50IiwiZG9jdW1lbnRNb2RlIiwiZXh0ZW5kIiwiem9vbU9uV2hlZWwiLCJzZXRUaW1lb3V0IiwiaXNGdW5jdGlvbiIsImNyZWF0ZUVsZW1lbnQiLCJnZXRDb250ZXh0IiwicHJvcCIsInN0eWxlIiwidHJhbnNpdGlvbiIsImRvd25sb2FkIiwiYWRkQ2xhc3MiLCJvbiIsIiR0aGlzIiwiZGF0YSIsInJlc3VsdCIsImhhc0NsYXNzIiwibWV0aG9kIiwib3B0aW9uIiwic2Vjb25kT3B0aW9uIiwibW9kYWwiLCJmaW5kIiwiaHRtbCIsInRvRGF0YVVSTCIsInJldm9rZU9iamVjdFVSTCIsIiRpbnB1dEltYWdlIiwiY2hhbmdlIiwiZmlsZXMiLCJmaWxlIiwibGVuZ3RoIiwidGVzdCIsInR5cGUiLCJjcmVhdGVPYmplY3RVUkwiLCJhbGVydCIsInBhcmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVk7QUFDWkEsRUFBQUEsQ0FBQyxDQUFDLHlDQUFELENBQUQsQ0FBNkNDLE9BQTdDLENBQXFEO0FBQUVDLElBQUFBLFNBQVMsRUFBRTtBQUFiLEdBQXJEO0FBRUEsTUFBSUMsR0FBRyxHQUFHQyxNQUFNLENBQUNELEdBQVAsSUFBY0MsTUFBTSxDQUFDQyxTQUEvQjtBQUNBLE1BQUlDLE1BQU0sR0FBR04sQ0FBQyxDQUFDLHdCQUFELENBQWQ7QUFDQSxNQUFJTyxTQUFTLEdBQUdQLENBQUMsQ0FBQywyQkFBRCxDQUFqQjtBQUNBLE1BQUlRLE9BQU8sR0FBRztBQUNaQyxJQUFBQSxXQUFXLEVBQUUsS0FBSyxDQUROO0FBRVpDLElBQUFBLE9BQU8sRUFBRSwwQkFGRztBQUdaQyxJQUFBQSxJQUFJLEVBQUUsY0FBVUMsQ0FBVixFQUFhO0FBQ2pCWixNQUFBQSxDQUFDLENBQUMsd0JBQUQsQ0FBRCxDQUE0QmEsR0FBNUIsQ0FBZ0NDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxDQUFDLENBQUNJLE1BQUYsQ0FBU0MsQ0FBcEIsQ0FBaEM7QUFDQWpCLE1BQUFBLENBQUMsQ0FBQyx3QkFBRCxDQUFELENBQTRCYSxHQUE1QixDQUFnQ0MsSUFBSSxDQUFDQyxLQUFMLENBQVdILENBQUMsQ0FBQ0ksTUFBRixDQUFTRSxDQUFwQixDQUFoQztBQUNBbEIsTUFBQUEsQ0FBQyxDQUFDLDZCQUFELENBQUQsQ0FBaUNhLEdBQWpDLENBQXFDQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsQ0FBQyxDQUFDSSxNQUFGLENBQVNHLE1BQXBCLENBQXJDO0FBQ0FuQixNQUFBQSxDQUFDLENBQUMsNEJBQUQsQ0FBRCxDQUFnQ2EsR0FBaEMsQ0FBb0NDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxDQUFDLENBQUNJLE1BQUYsQ0FBU0ksS0FBcEIsQ0FBcEM7QUFDQXBCLE1BQUFBLENBQUMsQ0FBQyw2QkFBRCxDQUFELENBQWlDYSxHQUFqQyxDQUFxQ0QsQ0FBQyxDQUFDSSxNQUFGLENBQVNLLE1BQTlDO0FBQ0FyQixNQUFBQSxDQUFDLENBQUMsNkJBQUQsQ0FBRCxDQUFpQ2EsR0FBakMsQ0FBcUNELENBQUMsQ0FBQ0ksTUFBRixDQUFTTSxNQUE5QztBQUNBdEIsTUFBQUEsQ0FBQyxDQUFDLDZCQUFELENBQUQsQ0FBaUNhLEdBQWpDLENBQXFDRCxDQUFDLENBQUNJLE1BQUYsQ0FBU08sTUFBOUM7QUFDRDtBQVhXLEdBQWQ7QUFjQSxNQUFJQyxnQkFBZ0IsR0FBR2xCLE1BQU0sQ0FBQ21CLElBQVAsQ0FBWSxLQUFaLENBQXZCO0FBQ0EsTUFBSUMsZ0JBQUosQ0FyQlksQ0F1Qlo7O0FBQ0FwQixFQUFBQSxNQUFNLENBQUNxQixPQUFQLENBQWVuQixPQUFmLEVBeEJZLENBMEJaOztBQUNBLE1BQUksT0FBT29CLFFBQVEsQ0FBQ0MsWUFBaEIsS0FBaUMsUUFBakMsSUFBNkNELFFBQVEsQ0FBQ0MsWUFBVCxHQUF3QixFQUF6RSxFQUE2RTtBQUMzRXJCLElBQUFBLE9BQU8sR0FBR1IsQ0FBQyxDQUFDOEIsTUFBRixDQUFTLEVBQVQsRUFBYXRCLE9BQWIsRUFBc0I7QUFBQ3VCLE1BQUFBLFdBQVcsRUFBRTtBQUFkLEtBQXRCLENBQVY7QUFDQUMsSUFBQUEsVUFBVSxDQUFDLFlBQVc7QUFDcEIxQixNQUFBQSxNQUFNLENBQUNxQixPQUFQLENBQWUsU0FBZixFQUEwQkEsT0FBMUIsQ0FBa0NuQixPQUFsQztBQUNELEtBRlMsRUFFUCxJQUZPLENBQVY7QUFHRCxHQWhDVyxDQWtDWjs7O0FBQ0EsTUFBSSxDQUFDUixDQUFDLENBQUNpQyxVQUFGLENBQWFMLFFBQVEsQ0FBQ00sYUFBVCxDQUF1QixRQUF2QixFQUFpQ0MsVUFBOUMsQ0FBTCxFQUFnRTtBQUM5RG5DLElBQUFBLENBQUMsQ0FBQyx3Q0FBRCxDQUFELENBQTRDb0MsSUFBNUMsQ0FBaUQsVUFBakQsRUFBNkQsSUFBN0Q7QUFDRDs7QUFDRCxNQUFJLE9BQU9SLFFBQVEsQ0FBQ00sYUFBVCxDQUF1QixTQUF2QixFQUFrQ0csS0FBbEMsQ0FBd0NDLFVBQS9DLEtBQThELFdBQWxFLEVBQStFO0FBQzdFdEMsSUFBQUEsQ0FBQyxDQUFDLDhCQUFELENBQUQsQ0FBa0NvQyxJQUFsQyxDQUF1QyxVQUF2QyxFQUFtRCxJQUFuRDtBQUNBcEMsSUFBQUEsQ0FBQyxDQUFDLDZCQUFELENBQUQsQ0FBaUNvQyxJQUFqQyxDQUFzQyxVQUF0QyxFQUFrRCxJQUFsRDtBQUNELEdBekNXLENBNENaOzs7QUFDQSxNQUFJLE9BQU83QixTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFnQyxRQUFwQixLQUFpQyxXQUFyQyxFQUFrRDtBQUNoRGhDLElBQUFBLFNBQVMsQ0FBQ2lDLFFBQVYsQ0FBbUIsVUFBbkI7QUFDRCxHQS9DVyxDQWlEWjs7O0FBQ0F4QyxFQUFBQSxDQUFDLENBQUMsMEJBQUQsQ0FBRCxDQUE4QnlDLEVBQTlCLENBQWlDLE9BQWpDLEVBQTBDLGVBQTFDLEVBQTJELFlBQVk7QUFDckUsUUFBSUMsS0FBSyxHQUFHMUMsQ0FBQyxDQUFDLElBQUQsQ0FBYjtBQUNBLFFBQUkyQyxJQUFJLEdBQUdELEtBQUssQ0FBQ0MsSUFBTixFQUFYO0FBQ0EsUUFBSUMsTUFBSjs7QUFFQSxRQUFJRixLQUFLLENBQUNOLElBQU4sQ0FBVyxVQUFYLEtBQTBCTSxLQUFLLENBQUNHLFFBQU4sQ0FBZSxVQUFmLENBQTlCLEVBQTBEO0FBQ3hEO0FBQ0Q7O0FBRUQsUUFBSXZDLE1BQU0sQ0FBQ3FDLElBQVAsQ0FBWSxTQUFaLEtBQTBCQSxJQUFJLENBQUNHLE1BQW5DLEVBQTJDO0FBQ3pDSCxNQUFBQSxJQUFJLEdBQUczQyxDQUFDLENBQUM4QixNQUFGLENBQVMsRUFBVCxFQUFhYSxJQUFiLENBQVAsQ0FEeUMsQ0FDZDs7QUFFM0IsVUFBSUEsSUFBSSxDQUFDRyxNQUFMLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCeEMsUUFBQUEsTUFBTSxDQUFDcUIsT0FBUCxDQUFlLE9BQWY7QUFDRDs7QUFFRGlCLE1BQUFBLE1BQU0sR0FBR3RDLE1BQU0sQ0FBQ3FCLE9BQVAsQ0FBZWdCLElBQUksQ0FBQ0csTUFBcEIsRUFBNEJILElBQUksQ0FBQ0ksTUFBakMsRUFBeUNKLElBQUksQ0FBQ0ssWUFBOUMsQ0FBVDs7QUFFQSxVQUFJTCxJQUFJLENBQUNHLE1BQUwsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUJ4QyxRQUFBQSxNQUFNLENBQUNxQixPQUFQLENBQWUsTUFBZjtBQUNEOztBQUVELGNBQVFnQixJQUFJLENBQUNHLE1BQWI7QUFDRSxhQUFLLFFBQUw7QUFDQSxhQUFLLFFBQUw7QUFDRTlDLFVBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUTJDLElBQVIsQ0FBYSxRQUFiLEVBQXVCLENBQUNBLElBQUksQ0FBQ0ksTUFBN0I7QUFDQTs7QUFFRixhQUFLLGtCQUFMO0FBQ0UsY0FBSUgsTUFBSixFQUFZO0FBRVY7QUFDQTVDLFlBQUFBLENBQUMsQ0FBQyx3Q0FBRCxDQUFELENBQTRDaUQsS0FBNUMsR0FBb0RDLElBQXBELENBQXlELGFBQXpELEVBQXdFQyxJQUF4RSxDQUE2RVAsTUFBN0U7O0FBRUEsZ0JBQUksQ0FBQ3JDLFNBQVMsQ0FBQ3NDLFFBQVYsQ0FBbUIsVUFBbkIsQ0FBTCxFQUFxQztBQUNuQ3RDLGNBQUFBLFNBQVMsQ0FBQ2tCLElBQVYsQ0FBZSxNQUFmLEVBQXVCbUIsTUFBTSxDQUFDUSxTQUFQLENBQWlCLFlBQWpCLENBQXZCO0FBQ0Q7QUFDRjs7QUFFRDs7QUFFRixhQUFLLFNBQUw7QUFDRSxjQUFJMUIsZ0JBQUosRUFBc0I7QUFDcEJ2QixZQUFBQSxHQUFHLENBQUNrRCxlQUFKLENBQW9CM0IsZ0JBQXBCO0FBQ0FBLFlBQUFBLGdCQUFnQixHQUFHLEVBQW5CO0FBQ0FwQixZQUFBQSxNQUFNLENBQUNtQixJQUFQLENBQVksS0FBWixFQUFtQkQsZ0JBQW5CO0FBQ0Q7O0FBRUQ7QUExQko7QUE0QkQ7QUFDRixHQW5ERCxFQWxEWSxDQXVHWjs7QUFDQSxNQUFJOEIsV0FBVyxHQUFHdEQsQ0FBQyxDQUFDLDZCQUFELENBQW5COztBQUVBLE1BQUlHLEdBQUosRUFBUztBQUNQbUQsSUFBQUEsV0FBVyxDQUFDQyxNQUFaLENBQW1CLFlBQVk7QUFDN0IsVUFBSUMsS0FBSyxHQUFHLEtBQUtBLEtBQWpCO0FBQ0EsVUFBSUMsSUFBSjs7QUFFQSxVQUFJLENBQUNuRCxNQUFNLENBQUNxQyxJQUFQLENBQVksU0FBWixDQUFMLEVBQTZCO0FBQzNCO0FBQ0Q7O0FBRUQsVUFBSWEsS0FBSyxJQUFJQSxLQUFLLENBQUNFLE1BQW5CLEVBQTJCO0FBQ3pCRCxRQUFBQSxJQUFJLEdBQUdELEtBQUssQ0FBQyxDQUFELENBQVo7O0FBRUEsWUFBSSxlQUFlRyxJQUFmLENBQW9CRixJQUFJLENBQUNHLElBQXpCLENBQUosRUFBb0M7QUFDbEMsY0FBSWxDLGdCQUFKLEVBQXNCO0FBQ3BCdkIsWUFBQUEsR0FBRyxDQUFDa0QsZUFBSixDQUFvQjNCLGdCQUFwQjtBQUNEOztBQUVEQSxVQUFBQSxnQkFBZ0IsR0FBR3ZCLEdBQUcsQ0FBQzBELGVBQUosQ0FBb0JKLElBQXBCLENBQW5CO0FBQ0FuRCxVQUFBQSxNQUFNLENBQUNxQixPQUFQLENBQWUsU0FBZixFQUEwQkYsSUFBMUIsQ0FBK0IsS0FBL0IsRUFBc0NDLGdCQUF0QyxFQUF3REMsT0FBeEQsQ0FBZ0VuQixPQUFoRTtBQUNBOEMsVUFBQUEsV0FBVyxDQUFDekMsR0FBWixDQUFnQixFQUFoQjtBQUNELFNBUkQsTUFRTztBQUNMVCxVQUFBQSxNQUFNLENBQUMwRCxLQUFQLENBQWEsOEJBQWI7QUFDRDtBQUNGO0FBQ0YsS0F2QkQ7QUF3QkQsR0F6QkQsTUF5Qk87QUFDTFIsSUFBQUEsV0FBVyxDQUFDbEIsSUFBWixDQUFpQixVQUFqQixFQUE2QixJQUE3QixFQUFtQzJCLE1BQW5DLEdBQTRDdkIsUUFBNUMsQ0FBcUQsVUFBckQ7QUFDRDtBQUNGLENBdElBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uICgpIHtcbiAgJCgnW2RhdGEtdG9nZ2xlPVwiY3JvcHBlci1leGFtcGxlLXRvb2x0aXBcIl0nKS50b29sdGlwKHsgY29udGFpbmVyOiAnYm9keScgfSk7XG5cbiAgdmFyIFVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcbiAgdmFyICRpbWFnZSA9ICQoJyNjcm9wcGVyLWV4YW1wbGUtaW1hZ2UnKTtcbiAgdmFyICRkb3dubG9hZCA9ICQoJyNjcm9wcGVyLWV4YW1wbGUtZG93bmxvYWQnKTtcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgYXNwZWN0UmF0aW86IDE2IC8gOSxcbiAgICBwcmV2aWV3OiAnLmNyb3BwZXItZXhhbXBsZS1wcmV2aWV3JyxcbiAgICBjcm9wOiBmdW5jdGlvbiAoZSkge1xuICAgICAgJCgnI2Nyb3BwZXItZXhhbXBsZS1kYXRhWCcpLnZhbChNYXRoLnJvdW5kKGUuZGV0YWlsLngpKTtcbiAgICAgICQoJyNjcm9wcGVyLWV4YW1wbGUtZGF0YVknKS52YWwoTWF0aC5yb3VuZChlLmRldGFpbC55KSk7XG4gICAgICAkKCcjY3JvcHBlci1leGFtcGxlLWRhdGFIZWlnaHQnKS52YWwoTWF0aC5yb3VuZChlLmRldGFpbC5oZWlnaHQpKTtcbiAgICAgICQoJyNjcm9wcGVyLWV4YW1wbGUtZGF0YVdpZHRoJykudmFsKE1hdGgucm91bmQoZS5kZXRhaWwud2lkdGgpKTtcbiAgICAgICQoJyNjcm9wcGVyLWV4YW1wbGUtZGF0YVJvdGF0ZScpLnZhbChlLmRldGFpbC5yb3RhdGUpO1xuICAgICAgJCgnI2Nyb3BwZXItZXhhbXBsZS1kYXRhU2NhbGVYJykudmFsKGUuZGV0YWlsLnNjYWxlWCk7XG4gICAgICAkKCcjY3JvcHBlci1leGFtcGxlLWRhdGFTY2FsZVknKS52YWwoZS5kZXRhaWwuc2NhbGVZKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG9yaWdpbmFsSW1hZ2VVUkwgPSAkaW1hZ2UuYXR0cignc3JjJyk7XG4gIHZhciB1cGxvYWRlZEltYWdlVVJMO1xuXG4gIC8vIENyb3BwZXJcbiAgJGltYWdlLmNyb3BwZXIob3B0aW9ucyk7XG5cbiAgLy8gSUUxMCBmaXhcbiAgaWYgKHR5cGVvZiBkb2N1bWVudC5kb2N1bWVudE1vZGUgPT09ICdudW1iZXInICYmIGRvY3VtZW50LmRvY3VtZW50TW9kZSA8IDExKSB7XG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zLCB7em9vbU9uV2hlZWw6IGZhbHNlfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICRpbWFnZS5jcm9wcGVyKCdkZXN0cm95JykuY3JvcHBlcihvcHRpb25zKTtcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIC8vIEJ1dHRvbnNcbiAgaWYgKCEkLmlzRnVuY3Rpb24oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCkpIHtcbiAgICAkKCdidXR0b25bZGF0YS1tZXRob2Q9XCJnZXRDcm9wcGVkQ2FudmFzXCJdJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgfVxuICBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Nyb3BwZXInKS5zdHlsZS50cmFuc2l0aW9uID09PSAndW5kZWZpbmVkJykge1xuICAgICQoJ2J1dHRvbltkYXRhLW1ldGhvZD1cInJvdGF0ZVwiXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgJCgnYnV0dG9uW2RhdGEtbWV0aG9kPVwic2NhbGVcIl0nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICB9XG5cblxuICAvLyBEb3dubG9hZFxuICBpZiAodHlwZW9mICRkb3dubG9hZFswXS5kb3dubG9hZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAkZG93bmxvYWQuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICAvLyBNZXRob2RzXG4gICQoJy5jcm9wcGVyLWV4YW1wbGUtYnV0dG9ucycpLm9uKCdjbGljaycsICdbZGF0YS1tZXRob2RdJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCk7XG4gICAgdmFyIHJlc3VsdDtcblxuICAgIGlmICgkdGhpcy5wcm9wKCdkaXNhYmxlZCcpIHx8ICR0aGlzLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCRpbWFnZS5kYXRhKCdjcm9wcGVyJykgJiYgZGF0YS5tZXRob2QpIHtcbiAgICAgIGRhdGEgPSAkLmV4dGVuZCh7fSwgZGF0YSk7IC8vIENsb25lIGEgbmV3IG9uZVxuXG4gICAgICBpZiAoZGF0YS5tZXRob2QgPT09ICdyb3RhdGUnKSB7XG4gICAgICAgICRpbWFnZS5jcm9wcGVyKCdjbGVhcicpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHQgPSAkaW1hZ2UuY3JvcHBlcihkYXRhLm1ldGhvZCwgZGF0YS5vcHRpb24sIGRhdGEuc2Vjb25kT3B0aW9uKTtcblxuICAgICAgaWYgKGRhdGEubWV0aG9kID09PSAncm90YXRlJykge1xuICAgICAgICAkaW1hZ2UuY3JvcHBlcignY3JvcCcpO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGRhdGEubWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ3NjYWxlWCc6XG4gICAgICAgIGNhc2UgJ3NjYWxlWSc6XG4gICAgICAgICAgJCh0aGlzKS5kYXRhKCdvcHRpb24nLCAtZGF0YS5vcHRpb24pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2dldENyb3BwZWRDYW52YXMnOlxuICAgICAgICAgIGlmIChyZXN1bHQpIHtcblxuICAgICAgICAgICAgLy8gQm9vdHN0cmFwJ3MgTW9kYWxcbiAgICAgICAgICAgICQoJyNjcm9wcGVyLWV4YW1wbGUtZ2V0Q3JvcHBlZENhbnZhc01vZGFsJykubW9kYWwoKS5maW5kKCcubW9kYWwtYm9keScpLmh0bWwocmVzdWx0KTtcblxuICAgICAgICAgICAgaWYgKCEkZG93bmxvYWQuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgJGRvd25sb2FkLmF0dHIoJ2hyZWYnLCByZXN1bHQudG9EYXRhVVJMKCdpbWFnZS9qcGVnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2Rlc3Ryb3knOlxuICAgICAgICAgIGlmICh1cGxvYWRlZEltYWdlVVJMKSB7XG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVwbG9hZGVkSW1hZ2VVUkwpO1xuICAgICAgICAgICAgdXBsb2FkZWRJbWFnZVVSTCA9ICcnO1xuICAgICAgICAgICAgJGltYWdlLmF0dHIoJ3NyYycsIG9yaWdpbmFsSW1hZ2VVUkwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gSW1wb3J0IGltYWdlXG4gIHZhciAkaW5wdXRJbWFnZSA9ICQoJyNjcm9wcGVyLWV4YW1wbGUtaW5wdXRJbWFnZScpO1xuXG4gIGlmIChVUkwpIHtcbiAgICAkaW5wdXRJbWFnZS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZpbGVzID0gdGhpcy5maWxlcztcbiAgICAgIHZhciBmaWxlO1xuXG4gICAgICBpZiAoISRpbWFnZS5kYXRhKCdjcm9wcGVyJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICBpZiAoL15pbWFnZVxcL1xcdyskLy50ZXN0KGZpbGUudHlwZSkpIHtcbiAgICAgICAgICBpZiAodXBsb2FkZWRJbWFnZVVSTCkge1xuICAgICAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cGxvYWRlZEltYWdlVVJMKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB1cGxvYWRlZEltYWdlVVJMID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcbiAgICAgICAgICAkaW1hZ2UuY3JvcHBlcignZGVzdHJveScpLmF0dHIoJ3NyYycsIHVwbG9hZGVkSW1hZ2VVUkwpLmNyb3BwZXIob3B0aW9ucyk7XG4gICAgICAgICAgJGlucHV0SW1hZ2UudmFsKCcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cuYWxlcnQoJ1BsZWFzZSBjaG9vc2UgYW4gaW1hZ2UgZmlsZS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICRpbnB1dEltYWdlLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJqcy91aV9jcm9wcGVyLmVzNS5qcyJ9