$(function() {
    var isRtl = $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl';
  
    var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substringRegex;
  
        // an array that will be populated with substring matches
        matches = [];
  
        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');
  
        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            matches.push(str);
          }
        });
  
        cb(matches);
      };
    };

    var fornecedores = $.ajax({
            type: 'GET',
            url: '/Fornecedores/GetFornecedores',
            async: false,
            contentType: "application/json",
            dataType: "json"
        })
        .done(function(response) {
            //var data = $.parseJSON(response);
            var data = JSON.parse('{"nome":"HP", "nome":"Oracle"}');
            var result = []
            for(var i = 0; i < data.length; i++){
                result.push(data[i]["nome"]);
            }
            return result;
        });
    

    if (isRtl) {
      $('#NomeDoFornecedor').attr('dir', 'rtl');
    }
  
    $('#NomeDoFornecedor').typeahead({
      hint: !isRtl,
      highlight: true,
      minLength: 1
    },
    {
      name: 'fornecedores',
      //source: substringMatcher(fornecedores)
      source: '/Fornecedores/GetFornecedores'
    });
  });