// Vanilla Text Mask
$(function() {
  // Phone
  //
  vanillaTextMask.maskInput({
    inputElement: $('#text-mask-phone')[0],
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  });

  // Number
  //
  vanillaTextMask.maskInput({
    inputElement: $('#text-mask-number')[0],
    mask: textMaskAddons.createNumberMask({
      prefix: 'R$'
    })
  });

  // Email
  //
  vanillaTextMask.maskInput({
    inputElement: $('#text-mask-email')[0],
    mask: textMaskAddons.emailMask
  });

  // Date
  //
  vanillaTextMask.maskInput({
    //inputElement: $('.text-mask-date')[0],
    inputElement: document.querySelector('.text-mask-date'),
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    pipe: textMaskAddons.createAutoCorrectedDatePipe('dd/mm/yyyy')
  });
});

// Bootstrap Maxlength
$(function() {
  $('.bootstrap-maxlength-field').each(function() {
    $(this).maxlength({
      warningClass: 'label label-success',
      limitReachedClass: 'label label-danger',
      separator: ' de ',
      preText: 'Você digitou ',
      postText: ' caracteres.',
      validate: true,
      threshold: +this.getAttribute('maxlength')
    });
  });
});