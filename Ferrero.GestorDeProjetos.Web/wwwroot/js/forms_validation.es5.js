"use strict";

$(function () {
  // Initialize Select2 select box
  $('select[name="validation-select2"]').select2({
    allowClear: true,
    placeholder: 'Select a framework...'
  }).change(function () {
    $(this).valid();
  }); // Initialize Select2 multiselect box

  $('select[name="validation-select2-multi"]').select2({
    placeholder: 'Select gear...'
  }).change(function () {
    $(this).valid();
  }); // Trigger validation on tagsinput change

  $('input[name="validation-bs-tagsinput"]').on('itemAdded itemRemoved', function () {
    $(this).valid();
  }); // Add phone validator

  $.validator.addMethod('phone_format', function (value, element) {
    return this.optional(element) || /^\(\d{3}\)[ ]\d{3}\-\d{4}$/.test(value);
  }, 'Invalid phone number.'); // Initialize validation

  $('#validation-form').validate({
    ignore: '.ignore, .select2-input',
    focusInvalid: false,
    rules: {
      'validation-email': {
        required: true,
        email: true
      },
      'validation-password': {
        required: true,
        minlength: 6,
        maxlength: 20
      },
      'validation-password-confirmation': {
        required: true,
        minlength: 6,
        equalTo: 'input[name="validation-password"]'
      },
      'validation-required': {
        required: true
      },
      'validation-url': {
        required: true,
        url: true
      },
      'validation-phone': {
        required: true,
        phone_format: true
      },
      'validation-select': {
        required: true
      },
      'validation-multiselect': {
        required: true,
        minlength: 2
      },
      'validation-select2': {
        required: true
      },
      'validation-select2-multi': {
        required: true,
        minlength: 2
      },
      'validation-bs-tagsinput': {
        required: true
      },
      'validation-text': {
        required: true
      },
      'validation-file': {
        required: true
      },
      'validation-switcher': {
        required: true
      },
      'validation-radios': {
        required: true
      },
      'validation-radios-custom': {
        required: true
      },
      'validation-checkbox': {
        required: true
      },
      'validation-checkbox-custom': {
        required: true
      },
      // Checkbox groups
      //
      'validation-checkbox-group-1': {
        require_from_group: [1, 'input[name="validation-checkbox-group-1"], input[name="validation-checkbox-group-2"]']
      },
      'validation-checkbox-group-2': {
        require_from_group: [1, 'input[name="validation-checkbox-group-1"], input[name="validation-checkbox-group-2"]']
      },
      'validation-checkbox-custom-group-1': {
        require_from_group: [1, 'input[name="validation-checkbox-custom-group-1"], input[name="validation-checkbox-custom-group-2"]']
      },
      'validation-checkbox-custom-group-2': {
        require_from_group: [1, 'input[name="validation-checkbox-custom-group-1"], input[name="validation-checkbox-custom-group-2"]']
      }
    },
    // Errors
    //
    errorPlacement: function errorPlacement(error, element) {
      var $parent = $(element).parents('.form-group'); // Do not duplicate errors

      if ($parent.find('.jquery-validation-error').length) {
        return;
      }

      $parent.append(error.addClass('jquery-validation-error small form-text invalid-feedback'));
    },
    highlight: function highlight(element) {
      var $el = $(element);
      var $parent = $el.parents('.form-group');
      $el.addClass('is-invalid'); // Select2 and Tagsinput

      if ($el.hasClass('select2-hidden-accessible') || $el.attr('data-role') === 'tagsinput') {
        $el.parent().addClass('is-invalid');
      }
    },
    unhighlight: function unhighlight(element) {
      $(element).parents('.form-group').find('.is-invalid').removeClass('is-invalid');
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2Zvcm1zX3ZhbGlkYXRpb24uanMiXSwibmFtZXMiOlsiJCIsInNlbGVjdDIiLCJhbGxvd0NsZWFyIiwicGxhY2Vob2xkZXIiLCJjaGFuZ2UiLCJ2YWxpZCIsIm9uIiwidmFsaWRhdG9yIiwiYWRkTWV0aG9kIiwidmFsdWUiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJ0ZXN0IiwidmFsaWRhdGUiLCJpZ25vcmUiLCJmb2N1c0ludmFsaWQiLCJydWxlcyIsInJlcXVpcmVkIiwiZW1haWwiLCJtaW5sZW5ndGgiLCJtYXhsZW5ndGgiLCJlcXVhbFRvIiwidXJsIiwicGhvbmVfZm9ybWF0IiwicmVxdWlyZV9mcm9tX2dyb3VwIiwiZXJyb3JQbGFjZW1lbnQiLCJlcnJvciIsIiRwYXJlbnQiLCJwYXJlbnRzIiwiZmluZCIsImxlbmd0aCIsImFwcGVuZCIsImFkZENsYXNzIiwiaGlnaGxpZ2h0IiwiJGVsIiwiaGFzQ2xhc3MiLCJhdHRyIiwicGFyZW50IiwidW5oaWdobGlnaHQiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsQ0FBQyxDQUFDLFlBQVc7QUFDWDtBQUNBQSxFQUFBQSxDQUFDLENBQUMsbUNBQUQsQ0FBRCxDQUF1Q0MsT0FBdkMsQ0FBK0M7QUFDN0NDLElBQUFBLFVBQVUsRUFBRyxJQURnQztBQUU3Q0MsSUFBQUEsV0FBVyxFQUFFO0FBRmdDLEdBQS9DLEVBR0dDLE1BSEgsQ0FHVSxZQUFXO0FBQ25CSixJQUFBQSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFLLEtBQVI7QUFDRCxHQUxELEVBRlcsQ0FTWDs7QUFDQUwsRUFBQUEsQ0FBQyxDQUFDLHlDQUFELENBQUQsQ0FBNkNDLE9BQTdDLENBQXFEO0FBQ25ERSxJQUFBQSxXQUFXLEVBQUU7QUFEc0MsR0FBckQsRUFFR0MsTUFGSCxDQUVVLFlBQVc7QUFDbkJKLElBQUFBLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUUssS0FBUjtBQUNELEdBSkQsRUFWVyxDQWdCWDs7QUFDQUwsRUFB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RCxDQWxKQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcbiAgLy8gSW5pdGlhbGl6ZSBTZWxlY3QyIHNlbGVjdCBib3hcbiAgJCgnc2VsZWN0W25hbWU9XCJ2YWxpZGF0aW9uLXNlbGVjdDJcIl0nKS5zZWxlY3QyKHtcbiAgICBhbGxvd0NsZWFyOiAgdHJ1ZSxcbiAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBhIGZyYW1ld29yay4uLicsXG4gIH0pLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMpLnZhbGlkKCk7XG4gIH0pO1xuXG4gIC8vIEluaXRpYWxpemUgU2VsZWN0MiBtdWx0aXNlbGVjdCBib3hcbiAgJCgnc2VsZWN0W25hbWU9XCJ2YWxpZGF0aW9uLXNlbGVjdDItbXVsdGlcIl0nKS5zZWxlY3QyKHtcbiAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBnZWFyLi4uJyxcbiAgfSkuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykudmFsaWQoKTtcbiAgfSk7XG5cbiAgLy8gVHJpZ2dlciB2YWxpZGF0aW9uIG9uIHRhZ3NpbnB1dCBjaGFuZ2VcbiAgJCgnaW5wdXRbbmFtZT1cInZhbGlkYXRpb24tYnMtdGFnc2lucHV0XCJdJykub24oJ2l0ZW1BZGRlZCBpdGVtUmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykudmFsaWQoKTtcbiAgfSk7XG5cbiAgLy8gQWRkIHBob25lIHZhbGlkYXRvclxuICAkLnZhbGlkYXRvci5hZGRNZXRob2QoXG4gICAgJ3Bob25lX2Zvcm1hdCcsXG4gICAgZnVuY3Rpb24odmFsdWUsIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8IC9eXFwoXFxkezN9XFwpWyBdXFxkezN9XFwtXFxkezR9JC8udGVzdCh2YWx1ZSk7XG4gICAgfSxcbiAgICAnSW52YWxpZCBwaG9uZSBudW1iZXIuJ1xuICApO1xuXG4gIC8vIEluaXRpYWxpemUgdmFsaWRhdGlvblxuICAkKCcjdmFsaWRhdGlvbi1mb3JtJykudmFsaWRhdGUoe1xuICAgIGlnbm9yZTogJy5pZ25vcmUsIC5zZWxlY3QyLWlucHV0JyxcbiAgICBmb2N1c0ludmFsaWQ6IGZhbHNlLFxuICAgIHJ1bGVzOiB7XG4gICAgICAndmFsaWRhdGlvbi1lbWFpbCc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGVtYWlsOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tcGFzc3dvcmQnOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBtaW5sZW5ndGg6IDYsXG4gICAgICAgIG1heGxlbmd0aDogMjBcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi1wYXNzd29yZC1jb25maXJtYXRpb24nOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBtaW5sZW5ndGg6IDYsXG4gICAgICAgIGVxdWFsVG86ICdpbnB1dFtuYW1lPVwidmFsaWRhdGlvbi1wYXNzd29yZFwiXSdcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi1yZXF1aXJlZCc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi11cmwnOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB1cmw6IHRydWVcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi1waG9uZSc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHBob25lX2Zvcm1hdDogdHJ1ZVxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLXNlbGVjdCc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi1tdWx0aXNlbGVjdCc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIG1pbmxlbmd0aDogMlxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLXNlbGVjdDInOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tc2VsZWN0Mi1tdWx0aSc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIG1pbmxlbmd0aDogMlxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLWJzLXRhZ3NpbnB1dCc6IHtcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgIH0sXG4gICAgICAndmFsaWRhdGlvbi10ZXh0Jzoge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLWZpbGUnOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tc3dpdGNoZXInOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tcmFkaW9zJzoge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLXJhZGlvcy1jdXN0b20nOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tY2hlY2tib3gnOiB7XG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tY2hlY2tib3gtY3VzdG9tJzoge1xuICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgfSxcblxuICAgICAgLy8gQ2hlY2tib3ggZ3JvdXBzXG4gICAgICAvL1xuXG4gICAgICAndmFsaWRhdGlvbi1jaGVja2JveC1ncm91cC0xJzoge1xuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFsxLCAnaW5wdXRbbmFtZT1cInZhbGlkYXRpb24tY2hlY2tib3gtZ3JvdXAtMVwiXSwgaW5wdXRbbmFtZT1cInZhbGlkYXRpb24tY2hlY2tib3gtZ3JvdXAtMlwiXSddXG4gICAgICB9LFxuICAgICAgJ3ZhbGlkYXRpb24tY2hlY2tib3gtZ3JvdXAtMic6IHtcbiAgICAgICAgcmVxdWlyZV9mcm9tX2dyb3VwOiBbMSwgJ2lucHV0W25hbWU9XCJ2YWxpZGF0aW9uLWNoZWNrYm94LWdyb3VwLTFcIl0sIGlucHV0W25hbWU9XCJ2YWxpZGF0aW9uLWNoZWNrYm94LWdyb3VwLTJcIl0nXVxuICAgICAgfSxcblxuICAgICAgJ3ZhbGlkYXRpb24tY2hlY2tib3gtY3VzdG9tLWdyb3VwLTEnOiB7XG4gICAgICAgIHJlcXVpcmVfZnJvbV9ncm91cDogWzEsICdpbnB1dFtuYW1lPVwidmFsaWRhdGlvbi1jaGVja2JveC1jdXN0b20tZ3JvdXAtMVwiXSwgaW5wdXRbbmFtZT1cInZhbGlkYXRpb24tY2hlY2tib3gtY3VzdG9tLWdyb3VwLTJcIl0nXVxuICAgICAgfSxcbiAgICAgICd2YWxpZGF0aW9uLWNoZWNrYm94LWN1c3RvbS1ncm91cC0yJzoge1xuICAgICAgICByZXF1aXJlX2Zyb21fZ3JvdXA6IFsxLCAnaW5wdXRbbmFtZT1cInZhbGlkYXRpb24tY2hlY2tib3gtY3VzdG9tLWdyb3VwLTFcIl0sIGlucHV0W25hbWU9XCJ2YWxpZGF0aW9uLWNoZWNrYm94LWN1c3RvbS1ncm91cC0yXCJdJ11cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRXJyb3JzXG4gICAgLy9cblxuICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiBlcnJvclBsYWNlbWVudChlcnJvciwgZWxlbWVudCkge1xuICAgICAgdmFyICRwYXJlbnQgPSAkKGVsZW1lbnQpLnBhcmVudHMoJy5mb3JtLWdyb3VwJyk7XG5cbiAgICAgIC8vIERvIG5vdCBkdXBsaWNhdGUgZXJyb3JzXG4gICAgICBpZiAoJHBhcmVudC5maW5kKCcuanF1ZXJ5LXZhbGlkYXRpb24tZXJyb3InKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAgICRwYXJlbnQuYXBwZW5kKFxuICAgICAgICBlcnJvci5hZGRDbGFzcygnanF1ZXJ5LXZhbGlkYXRpb24tZXJyb3Igc21hbGwgZm9ybS10ZXh0IGludmFsaWQtZmVlZGJhY2snKVxuICAgICAgKTtcbiAgICB9LFxuICAgIGhpZ2hsaWdodDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgdmFyICRlbCA9ICQoZWxlbWVudCk7XG4gICAgICB2YXIgJHBhcmVudCA9ICRlbC5wYXJlbnRzKCcuZm9ybS1ncm91cCcpO1xuXG4gICAgICAkZWwuYWRkQ2xhc3MoJ2lzLWludmFsaWQnKTtcblxuICAgICAgLy8gU2VsZWN0MiBhbmQgVGFnc2lucHV0XG4gICAgICBpZiAoJGVsLmhhc0NsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJykgfHwgJGVsLmF0dHIoJ2RhdGEtcm9sZScpID09PSAndGFnc2lucHV0Jykge1xuICAgICAgICAkZWwucGFyZW50KCkuYWRkQ2xhc3MoJ2lzLWludmFsaWQnKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVuaGlnaGxpZ2h0OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAkKGVsZW1lbnQpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykuZmluZCgnLmlzLWludmFsaWQnKS5yZW1vdmVDbGFzcygnaXMtaW52YWxpZCcpO1xuICAgIH1cbiAgfSk7XG5cbn0pO1xuIl0sImZpbGUiOiJqcy9mb3Jtc192YWxpZGF0aW9uLmVzNS5qcyJ9
