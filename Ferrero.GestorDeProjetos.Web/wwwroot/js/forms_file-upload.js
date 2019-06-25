$(document).ready(function () {
    $('.custom-file-input').change(function () {
        var path = $(this).val();
        if (path != '' && path != null) {
            var q = path.substring(path.lastIndexOf('\\') + 1);
            $('.custom-file-label').html(q);
        }
    });
});