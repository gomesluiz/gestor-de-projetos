"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * jQuery Validation Plugin v1.17.0
 *
 * https://jqueryvalidation.org/
 *
 * Copyright (c) 2017 Jörn Zaefferer
 * Released under the MIT license
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "./jquery.validate"], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function ($) {
  (function () {
    function stripHtml(value) {
      // Remove html tags and space chars
      return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ") // Remove punctuation
      .replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
    }

    $.validator.addMethod("maxWords", function (value, element, params) {
      return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
    }, $.validator.format("Please enter {0} words or less."));
    $.validator.addMethod("minWords", function (value, element, params) {
      return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
    }, $.validator.format("Please enter at least {0} words."));
    $.validator.addMethod("rangeWords", function (value, element, params) {
      var valueStripped = stripHtml(value),
          regex = /\b\w+\b/g;
      return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
    }, $.validator.format("Please enter between {0} and {1} words."));
  })(); // Accept a value from a file input based on a required mimetype


  $.validator.addMethod("accept", function (value, element, param) {
    // Split mime on commas in case we have multiple types we can accept
    var typeParam = typeof param === "string" ? param.replace(/\s/g, "") : "image/*",
        optionalValue = this.optional(element),
        i,
        file,
        regex; // Element is optional

    if (optionalValue) {
      return optionalValue;
    }

    if ($(element).attr("type") === "file") {
      // Escape string to be used in the regex
      // see: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
      // Escape also "/*" as "/.*" as a wildcard
      typeParam = typeParam.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&").replace(/,/g, "|").replace(/\/\*/g, "/.*"); // Check if the element has a FileList before checking each file

      if (element.files && element.files.length) {
        regex = new RegExp(".?(" + typeParam + ")$", "i");

        for (i = 0; i < element.files.length; i++) {
          file = element.files[i]; // Grab the mimetype from the loaded file, verify it matches

          if (!file.type.match(regex)) {
            return false;
          }
        }
      }
    } // Either return true because we've validated each file, or because the
    // browser does not support element.files and the FileList feature


    return true;
  }, $.validator.format("Please enter a value with a valid mimetype."));
  $.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
  }, "Letters, numbers, and underscores only please");
  /*
   * Dutch bank account numbers (not 'giro' numbers) have 9 digits
   * and pass the '11 check'.
   * We accept the notation with spaces, as that is common.
   * acceptable: 123456789 or 12 34 56 789
   */

  $.validator.addMethod("bankaccountNL", function (value, element) {
    if (this.optional(element)) {
      return true;
    }

    if (!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(value)) {
      return false;
    } // Now '11 check'


    var account = value.replace(/ /g, ""),
        // Remove spaces
    sum = 0,
        len = account.length,
        pos,
        factor,
        digit;

    for (pos = 0; pos < len; pos++) {
      factor = len - pos;
      digit = account.substring(pos, pos + 1);
      sum = sum + factor * digit;
    }

    return sum % 11 === 0;
  }, "Please specify a valid bank account number");
  $.validator.addMethod("bankorgiroaccountNL", function (value, element) {
    return this.optional(element) || $.validator.methods.bankaccountNL.call(this, value, element) || $.validator.methods.giroaccountNL.call(this, value, element);
  }, "Please specify a valid bank or giro account number");
  /**
   * BIC is the business identifier code (ISO 9362). This BIC check is not a guarantee for authenticity.
   *
   * BIC pattern: BBBBCCLLbbb (8 or 11 characters long; bbb is optional)
   *
   * Validation is case-insensitive. Please make sure to normalize input yourself.
   *
   * BIC definition in detail:
   * - First 4 characters - bank code (only letters)
   * - Next 2 characters - ISO 3166-1 alpha-2 country code (only letters)
   * - Next 2 characters - location code (letters and digits)
   *   a. shall not start with '0' or '1'
   *   b. second character must be a letter ('O' is not allowed) or digit ('0' for test (therefore not allowed), '1' denoting passive participant, '2' typically reverse-billing)
   * - Last 3 characters - branch code, optional (shall not start with 'X' except in case of 'XXX' for primary office) (letters and digits)
   */

  $.validator.addMethod("bic", function (value, element) {
    return this.optional(element) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(value.toUpperCase());
  }, "Please specify a valid BIC code");
  /*
   * Código de identificación fiscal ( CIF ) is the tax identification code for Spanish legal entities
   * Further rules can be found in Spanish on http://es.wikipedia.org/wiki/C%C3%B3digo_de_identificaci%C3%B3n_fiscal
   *
   * Spanish CIF structure:
   *
   * [ T ][ P ][ P ][ N ][ N ][ N ][ N ][ N ][ C ]
   *
   * Where:
   *
   * T: 1 character. Kind of Organization Letter: [ABCDEFGHJKLMNPQRSUVW]
   * P: 2 characters. Province.
   * N: 5 characters. Secuencial Number within the province.
   * C: 1 character. Control Digit: [0-9A-J].
   *
   * [ T ]: Kind of Organizations. Possible values:
   *
   *   A. Corporations
   *   B. LLCs
   *   C. General partnerships
   *   D. Companies limited partnerships
   *   E. Communities of goods
   *   F. Cooperative Societies
   *   G. Associations
   *   H. Communities of homeowners in horizontal property regime
   *   J. Civil Societies
   *   K. Old format
   *   L. Old format
   *   M. Old format
   *   N. Nonresident entities
   *   P. Local authorities
   *   Q. Autonomous bodies, state or not, and the like, and congregations and religious institutions
   *   R. Congregations and religious institutions (since 2008 ORDER EHA/451/2008)
   *   S. Organs of State Administration and regions
   *   V. Agrarian Transformation
   *   W. Permanent establishments of non-resident in Spain
   *
   * [ C ]: Control Digit. It can be a number or a letter depending on T value:
   * [ T ]  -->  [ C ]
   * ------    ----------
   *   A         Number
   *   B         Number
   *   E         Number
   *   H         Number
   *   K         Letter
   *   P         Letter
   *   Q         Letter
   *   S         Letter
   *
   */

  $.validator.addMethod("cifES", function (value, element) {
    "use strict";

    if (this.optional(element)) {
      return true;
    }

    var cifRegEx = new RegExp(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/gi);
    var letter = value.substring(0, 1),
        // [ T ]
    number = value.substring(1, 8),
        // [ P ][ P ][ N ][ N ][ N ][ N ][ N ]
    control = value.substring(8, 9),
        // [ C ]
    all_sum = 0,
        even_sum = 0,
        odd_sum = 0,
        i,
        n,
        control_digit,
        control_letter;

    function isOdd(n) {
      return n % 2 === 0;
    } // Quick format test


    if (value.length !== 9 || !cifRegEx.test(value)) {
      return false;
    }

    for (i = 0; i < number.length; i++) {
      n = parseInt(number[i], 10); // Odd positions

      if (isOdd(i)) {
        // Odd positions are multiplied first.
        n *= 2; // If the multiplication is bigger than 10 we need to adjust

        odd_sum += n < 10 ? n : n - 9; // Even positions
        // Just sum them
      } else {
        even_sum += n;
      }
    }

    all_sum = even_sum + odd_sum;
    control_digit = (10 - all_sum.toString().substr(-1)).toString();
    control_digit = parseInt(control_digit, 10) > 9 ? "0" : control_digit;
    control_letter = "JABCDEFGHI".substr(control_digit, 1).toString(); // Control must be a digit

    if (letter.match(/[ABEH]/)) {
      return control === control_digit; // Control must be a letter
    } else if (letter.match(/[KPQS]/)) {
      return control === control_letter;
    } // Can be either


    return control === control_digit || control === control_letter;
  }, "Please specify a valid CIF number.");
  /*
   * Brazillian CPF number (Cadastrado de Pessoas Físicas) is the equivalent of a Brazilian tax registration number.
   * CPF numbers have 11 digits in total: 9 numbers followed by 2 check numbers that are being used for validation.
   */

  $.validator.addMethod("cpfBR", function (value) {
    // Removing special characters from value
    value = value.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g, ""); // Checking value to have 11 digits only

    if (value.length !== 11) {
      return false;
    }

    var sum = 0,
        firstCN,
        secondCN,
        checkResult,
        i;
    firstCN = parseInt(value.substring(9, 10), 10);
    secondCN = parseInt(value.substring(10, 11), 10);

    checkResult = function checkResult(sum, cn) {
      var result = sum * 10 % 11;

      if (result === 10 || result === 11) {
        result = 0;
      }

      return result === cn;
    }; // Checking for dump data


    if (value === "" || value === "00000000000" || value === "11111111111" || value === "22222222222" || value === "33333333333" || value === "44444444444" || value === "55555555555" || value === "66666666666" || value === "77777777777" || value === "88888888888" || value === "99999999999") {
      return false;
    } // Step 1 - using first Check Number:


    for (i = 1; i <= 9; i++) {
      sum = sum + parseInt(value.substring(i - 1, i), 10) * (11 - i);
    } // If first Check Number (CN) is valid, move to Step 2 - using second Check Number:


    if (checkResult(sum, firstCN)) {
      sum = 0;

      for (i = 1; i <= 10; i++) {
        sum = sum + parseInt(value.substring(i - 1, i), 10) * (12 - i);
      }

      return checkResult(sum, secondCN);
    }

    return false;
  }, "Please specify a valid CPF number"); // https://jqueryvalidation.org/creditcard-method/
  // based on https://en.wikipedia.org/wiki/Luhn_algorithm

  $.validator.addMethod("creditcard", function (value, element) {
    if (this.optional(element)) {
      return "dependency-mismatch";
    } // Accept only spaces, digits and dashes


    if (/[^0-9 \-]+/.test(value)) {
      return false;
    }

    var nCheck = 0,
        nDigit = 0,
        bEven = false,
        n,
        cDigit;
    value = value.replace(/\D/g, ""); // Basing min and max length on
    // https://developer.ean.com/general_info/Valid_Credit_Card_Types

    if (value.length < 13 || value.length > 19) {
      return false;
    }

    for (n = value.length - 1; n >= 0; n--) {
      cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) {
          nDigit -= 9;
        }
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return nCheck % 10 === 0;
  }, "Please enter a valid credit card number.");
  /* NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
   * Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
   * Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
   */

  $.validator.addMethod("creditcardtypes", function (value, element, param) {
    if (/[^0-9\-]+/.test(value)) {
      return false;
    }

    value = value.replace(/\D/g, "");
    var validTypes = 0x0000;

    if (param.mastercard) {
      validTypes |= 0x0001;
    }

    if (param.visa) {
      validTypes |= 0x0002;
    }

    if (param.amex) {
      validTypes |= 0x0004;
    }

    if (param.dinersclub) {
      validTypes |= 0x0008;
    }

    if (param.enroute) {
      validTypes |= 0x0010;
    }

    if (param.discover) {
      validTypes |= 0x0020;
    }

    if (param.jcb) {
      validTypes |= 0x0040;
    }

    if (param.unknown) {
      validTypes |= 0x0080;
    }

    if (param.all) {
      validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;
    }

    if (validTypes & 0x0001 && /^(5[12345])/.test(value)) {
      // Mastercard
      return value.length === 16;
    }

    if (validTypes & 0x0002 && /^(4)/.test(value)) {
      // Visa
      return value.length === 16;
    }

    if (validTypes & 0x0004 && /^(3[47])/.test(value)) {
      // Amex
      return value.length === 15;
    }

    if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value)) {
      // Dinersclub
      return value.length === 14;
    }

    if (validTypes & 0x0010 && /^(2(014|149))/.test(value)) {
      // Enroute
      return value.length === 15;
    }

    if (validTypes & 0x0020 && /^(6011)/.test(value)) {
      // Discover
      return value.length === 16;
    }

    if (validTypes & 0x0040 && /^(3)/.test(value)) {
      // Jcb
      return value.length === 16;
    }

    if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) {
      // Jcb
      return value.length === 15;
    }

    if (validTypes & 0x0080) {
      // Unknown
      return true;
    }

    return false;
  }, "Please enter a valid credit card number.");
  /**
   * Validates currencies with any given symbols by @jameslouiz
   * Symbols can be optional or required. Symbols required by default
   *
   * Usage examples:
   *  currency: ["£", false] - Use false for soft currency validation
   *  currency: ["$", false]
   *  currency: ["RM", false] - also works with text based symbols such as "RM" - Malaysia Ringgit etc
   *
   *  <input class="currencyInput" name="currencyInput">
   *
   * Soft symbol checking
   *  currencyInput: {
   *     currency: ["$", false]
   *  }
   *
   * Strict symbol checking (default)
   *  currencyInput: {
   *     currency: "$"
   *     //OR
   *     currency: ["$", true]
   *  }
   *
   * Multiple Symbols
   *  currencyInput: {
   *     currency: "$,£,¢"
   *  }
   */

  $.validator.addMethod("currency", function (value, element, param) {
    var isParamString = typeof param === "string",
        symbol = isParamString ? param : param[0],
        soft = isParamString ? true : param[1],
        regex;
    symbol = symbol.replace(/,/g, "");
    symbol = soft ? symbol + "]" : symbol + "]?";
    regex = "^[" + symbol + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$";
    regex = new RegExp(regex);
    return this.optional(element) || regex.test(value);
  }, "Please specify a valid currency");
  $.validator.addMethod("dateFA", function (value, element) {
    return this.optional(element) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(value);
  }, $.validator.messages.date);
  /**
   * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
   *
   * @example $.validator.methods.date("01/01/1900")
   * @result true
   *
   * @example $.validator.methods.date("01/13/1990")
   * @result false
   *
   * @example $.validator.methods.date("01.01.1900")
   * @result false
   *
   * @example <input name="pippo" class="{dateITA:true}" />
   * @desc Declares an optional input element whose value must be a valid date.
   *
   * @name $.validator.methods.dateITA
   * @type Boolean
   * @cat Plugins/Validate/Methods
   */

  $.validator.addMethod("dateITA", function (value, element) {
    var check = false,
        re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        adata,
        gg,
        mm,
        aaaa,
        xdata;

    if (re.test(value)) {
      adata = value.split("/");
      gg = parseInt(adata[0], 10);
      mm = parseInt(adata[1], 10);
      aaaa = parseInt(adata[2], 10);
      xdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));

      if (xdata.getUTCFullYear() === aaaa && xdata.getUTCMonth() === mm - 1 && xdata.getUTCDate() === gg) {
        check = true;
      } else {
        check = false;
      }
    } else {
      check = false;
    }

    return this.optional(element) || check;
  }, $.validator.messages.date);
  $.validator.addMethod("dateNL", function (value, element) {
    return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
  }, $.validator.messages.date); // Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept

  $.validator.addMethod("extension", function (value, element, param) {
    param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
    return this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
  }, $.validator.format("Please enter a value with a valid extension."));
  /**
   * Dutch giro account numbers (not bank numbers) have max 7 digits
   */

  $.validator.addMethod("giroaccountNL", function (value, element) {
    return this.optional(element) || /^[0-9]{1,7}$/.test(value);
  }, "Please specify a valid giro account number");
  /**
   * IBAN is the international bank account number.
   * It has a country - specific format, that is checked here too
   *
   * Validation is case-insensitive. Please make sure to normalize input yourself.
   */

  $.validator.addMethod("iban", function (value, element) {
    // Some quick simple tests to prevent needless work
    if (this.optional(element)) {
      return true;
    } // Remove spaces and to upper case


    var iban = value.replace(/ /g, "").toUpperCase(),
        ibancheckdigits = "",
        leadingZeroes = true,
        cRest = "",
        cOperator = "",
        countrycode,
        ibancheck,
        charAt,
        cChar,
        bbanpattern,
        bbancountrypatterns,
        ibanregexp,
        i,
        p; // Check for IBAN code length.
    // It contains:
    // country code ISO 3166-1 - two letters,
    // two check digits,
    // Basic Bank Account Number (BBAN) - up to 30 chars

    var minimalIBANlength = 5;

    if (iban.length < minimalIBANlength) {
      return false;
    } // Check the country code and find the country specific format


    countrycode = iban.substring(0, 2);
    bbancountrypatterns = {
      "AL": "\\d{8}[\\dA-Z]{16}",
      "AD": "\\d{8}[\\dA-Z]{12}",
      "AT": "\\d{16}",
      "AZ": "[\\dA-Z]{4}\\d{20}",
      "BE": "\\d{12}",
      "BH": "[A-Z]{4}[\\dA-Z]{14}",
      "BA": "\\d{16}",
      "BR": "\\d{23}[A-Z][\\dA-Z]",
      "BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
      "CR": "\\d{17}",
      "HR": "\\d{17}",
      "CY": "\\d{8}[\\dA-Z]{16}",
      "CZ": "\\d{20}",
      "DK": "\\d{14}",
      "DO": "[A-Z]{4}\\d{20}",
      "EE": "\\d{16}",
      "FO": "\\d{14}",
      "FI": "\\d{14}",
      "FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
      "GE": "[\\dA-Z]{2}\\d{16}",
      "DE": "\\d{18}",
      "GI": "[A-Z]{4}[\\dA-Z]{15}",
      "GR": "\\d{7}[\\dA-Z]{16}",
      "GL": "\\d{14}",
      "GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
      "HU": "\\d{24}",
      "IS": "\\d{22}",
      "IE": "[\\dA-Z]{4}\\d{14}",
      "IL": "\\d{19}",
      "IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
      "KZ": "\\d{3}[\\dA-Z]{13}",
      "KW": "[A-Z]{4}[\\dA-Z]{22}",
      "LV": "[A-Z]{4}[\\dA-Z]{13}",
      "LB": "\\d{4}[\\dA-Z]{20}",
      "LI": "\\d{5}[\\dA-Z]{12}",
      "LT": "\\d{16}",
      "LU": "\\d{3}[\\dA-Z]{13}",
      "MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
      "MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
      "MR": "\\d{23}",
      "MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
      "MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
      "MD": "[\\dA-Z]{2}\\d{18}",
      "ME": "\\d{18}",
      "NL": "[A-Z]{4}\\d{10}",
      "NO": "\\d{11}",
      "PK": "[\\dA-Z]{4}\\d{16}",
      "PS": "[\\dA-Z]{4}\\d{21}",
      "PL": "\\d{24}",
      "PT": "\\d{21}",
      "RO": "[A-Z]{4}[\\dA-Z]{16}",
      "SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
      "SA": "\\d{2}[\\dA-Z]{18}",
      "RS": "\\d{18}",
      "SK": "\\d{20}",
      "SI": "\\d{15}",
      "ES": "\\d{20}",
      "SE": "\\d{20}",
      "CH": "\\d{5}[\\dA-Z]{12}",
      "TN": "\\d{20}",
      "TR": "\\d{5}[\\dA-Z]{17}",
      "AE": "\\d{3}\\d{16}",
      "GB": "[A-Z]{4}\\d{14}",
      "VG": "[\\dA-Z]{4}\\d{16}"
    };
    bbanpattern = bbancountrypatterns[countrycode]; // As new countries will start using IBAN in the
    // future, we only check if the countrycode is known.
    // This prevents false negatives, while almost all
    // false positives introduced by this, will be caught
    // by the checksum validation below anyway.
    // Strict checking should return FALSE for unknown
    // countries.

    if (typeof bbanpattern !== "undefined") {
      ibanregexp = new RegExp("^[A-Z]{2}\\d{2}" + bbanpattern + "$", "");

      if (!ibanregexp.test(iban)) {
        return false; // Invalid country specific format
      }
    } // Now check the checksum, first convert to digits


    ibancheck = iban.substring(4, iban.length) + iban.substring(0, 4);

    for (i = 0; i < ibancheck.length; i++) {
      charAt = ibancheck.charAt(i);

      if (charAt !== "0") {
        leadingZeroes = false;
      }

      if (!leadingZeroes) {
        ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);
      }
    } // Calculate the result of: ibancheckdigits % 97


    for (p = 0; p < ibancheckdigits.length; p++) {
      cChar = ibancheckdigits.charAt(p);
      cOperator = "" + cRest + "" + cChar;
      cRest = cOperator % 97;
    }

    return cRest === 1;
  }, "Please specify a valid IBAN");
  $.validator.addMethod("integer", function (value, element) {
    return this.optional(element) || /^-?\d+$/.test(value);
  }, "A positive or negative non-decimal number please");
  $.validator.addMethod("ipv4", function (value, element) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
  }, "Please enter a valid IP v4 address.");
  $.validator.addMethod("ipv6", function (value, element) {
    return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
  }, "Please enter a valid IP v6 address.");
  $.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
  }, "Letters only please");
  $.validator.addMethod("letterswithbasicpunc", function (value, element) {
    return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
  }, "Letters or punctuation only please");
  $.validator.addMethod("mobileNL", function (value, element) {
    return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
  }, "Please specify a valid mobile number");
  /* For UK phone functions, do the following server side processing:
   * Compare original input with this RegEx pattern:
   * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
   * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
   * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
   * A number of very detailed GB telephone number RegEx patterns can also be found at:
   * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
   */

  $.validator.addMethod("mobileUK", function (phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
    return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
  }, "Please specify a valid mobile number");
  $.validator.addMethod("netmask", function (value, element) {
    return this.optional(element) || /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)/i.test(value);
  }, "Please enter a valid netmask.");
  /*
   * The NIE (Número de Identificación de Extranjero) is a Spanish tax identification number assigned by the Spanish
   * authorities to any foreigner.
   *
   * The NIE is the equivalent of a Spaniards Número de Identificación Fiscal (NIF) which serves as a fiscal
   * identification number. The CIF number (Certificado de Identificación Fiscal) is equivalent to the NIF, but applies to
   * companies rather than individuals. The NIE consists of an 'X' or 'Y' followed by 7 or 8 digits then another letter.
   */

  $.validator.addMethod("nieES", function (value, element) {
    "use strict";

    if (this.optional(element)) {
      return true;
    }

    var nieRegEx = new RegExp(/^[MXYZ]{1}[0-9]{7,8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/gi);
    var validChars = "TRWAGMYFPDXBNJZSQVHLCKET",
        letter = value.substr(value.length - 1).toUpperCase(),
        number;
    value = value.toString().toUpperCase(); // Quick format test

    if (value.length > 10 || value.length < 9 || !nieRegEx.test(value)) {
      return false;
    } // X means same number
    // Y means number + 10000000
    // Z means number + 20000000


    value = value.replace(/^[X]/, "0").replace(/^[Y]/, "1").replace(/^[Z]/, "2");
    number = value.length === 9 ? value.substr(0, 8) : value.substr(0, 9);
    return validChars.charAt(parseInt(number, 10) % 23) === letter;
  }, "Please specify a valid NIE number.");
  /*
   * The Número de Identificación Fiscal ( NIF ) is the way tax identification used in Spain for individuals
   */

  $.validator.addMethod("nifES", function (value, element) {
    "use strict";

    if (this.optional(element)) {
      return true;
    }

    value = value.toUpperCase(); // Basic format test

    if (!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")) {
      return false;
    } // Test NIF


    if (/^[0-9]{8}[A-Z]{1}$/.test(value)) {
      return "TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 0) % 23) === value.charAt(8);
    } // Test specials NIF (starts with K, L or M)


    if (/^[KLM]{1}/.test(value)) {
      return value[8] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 1) % 23);
    }

    return false;
  }, "Please specify a valid NIF number.");
  /*
   * Numer identyfikacji podatkowej ( NIP ) is the way tax identification used in Poland for companies
   */

  $.validator.addMethod("nipPL", function (value) {
    "use strict";

    value = value.replace(/[^0-9]/g, "");

    if (value.length !== 10) {
      return false;
    }

    var arrSteps = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    var intSum = 0;

    for (var i = 0; i < 9; i++) {
      intSum += arrSteps[i] * value[i];
    }

    var int2 = intSum % 11;
    var intControlNr = int2 === 10 ? 0 : int2;
    return intControlNr === parseInt(value[9], 10);
  }, "Please specify a valid NIP number.");
  $.validator.addMethod("notEqualTo", function (value, element, param) {
    return this.optional(element) || !$.validator.methods.equalTo.call(this, value, element, param);
  }, "Please enter a different value, values must not be the same.");
  $.validator.addMethod("nowhitespace", function (value, element) {
    return this.optional(element) || /^\S+$/i.test(value);
  }, "No white space please");
  /**
  * Return true if the field value matches the given format RegExp
  *
  * @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
  * @result true
  *
  * @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
  * @result false
  *
  * @name $.validator.methods.pattern
  * @type Boolean
  * @cat Plugins/Validate/Methods
  */

  $.validator.addMethod("pattern", function (value, element, param) {
    if (this.optional(element)) {
      return true;
    }

    if (typeof param === "string") {
      param = new RegExp("^(?:" + param + ")$");
    }

    return param.test(value);
  }, "Invalid format.");
  /**
   * Dutch phone numbers have 10 digits (or 11 and start with +31).
   */

  $.validator.addMethod("phoneNL", function (value, element) {
    return this.optional(element) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(value);
  }, "Please specify a valid phone number.");
  /* For UK phone functions, do the following server side processing:
   * Compare original input with this RegEx pattern:
   * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
   * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
   * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
   * A number of very detailed GB telephone number RegEx patterns can also be found at:
   * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
   */
  // Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers

  $.validator.addMethod("phonesUK", function (phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
    return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/);
  }, "Please specify a valid uk phone number");
  /* For UK phone functions, do the following server side processing:
   * Compare original input with this RegEx pattern:
   * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
   * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
   * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
   * A number of very detailed GB telephone number RegEx patterns can also be found at:
   * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
   */

  $.validator.addMethod("phoneUK", function (phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
    return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
  }, "Please specify a valid phone number");
  /**
   * Matches US phone number format
   *
   * where the area code may not start with 1 and the prefix may not start with 1
   * allows '-' or ' ' as a separator and allows parens around area code
   * some people may want to put a '1' in front of their number
   *
   * 1(212)-999-2345 or
   * 212 999 2344 or
   * 212-999-0983
   *
   * but not
   * 111-123-5434
   * and not
   * 212 123 4567
   */

  $.validator.addMethod("phoneUS", function (phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
  }, "Please specify a valid phone number");
  /*
  * Valida CEPs do brasileiros:
  *
  * Formatos aceitos:
  * 99999-999
  * 99.999-999
  * 99999999
  */

  $.validator.addMethod("postalcodeBR", function (cep_value, element) {
    return this.optional(element) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(cep_value);
  }, "Informe um CEP válido.");
  /**
   * Matches a valid Canadian Postal Code
   *
   * @example jQuery.validator.methods.postalCodeCA( "H0H 0H0", element )
   * @result true
   *
   * @example jQuery.validator.methods.postalCodeCA( "H0H0H0", element )
   * @result false
   *
   * @name jQuery.validator.methods.postalCodeCA
   * @type Boolean
   * @cat Plugins/Validate/Methods
   */

  $.validator.addMethod("postalCodeCA", function (value, element) {
    return this.optional(element) || /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] *\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(value);
  }, "Please specify a valid postal code");
  /* Matches Italian postcode (CAP) */

  $.validator.addMethod("postalcodeIT", function (value, element) {
    return this.optional(element) || /^\d{5}$/.test(value);
  }, "Please specify a valid postal code");
  $.validator.addMethod("postalcodeNL", function (value, element) {
    return this.optional(element) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value);
  }, "Please specify a valid postal code"); // Matches UK postcode. Does not match to UK Channel Islands that have their own postcodes (non standard UK)

  $.validator.addMethod("postcodeUK", function (value, element) {
    return this.optional(element) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(value);
  }, "Please specify a valid UK postcode");
  /*
   * Lets you say "at least X inputs that match selector Y must be filled."
   *
   * The end result is that neither of these inputs:
   *
   *	<input class="productinfo" name="partnumber">
   *	<input class="productinfo" name="description">
   *
   *	...will validate unless at least one of them is filled.
   *
   * partnumber:	{require_from_group: [1,".productinfo"]},
   * description: {require_from_group: [1,".productinfo"]}
   *
   * options[0]: number of fields that must be filled in the group
   * options[1]: CSS selector that defines the group of conditionally required fields
   */

  $.validator.addMethod("require_from_group", function (value, element, options) {
    var $fields = $(options[1], element.form),
        $fieldsFirst = $fields.eq(0),
        validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this),
        isValid = $fields.filter(function () {
      return validator.elementValue(this);
    }).length >= options[0]; // Store the cloned validator for future validation

    $fieldsFirst.data("valid_req_grp", validator); // If element isn't being validated, run each require_from_group field's validation rules

    if (!$(element).data("being_validated")) {
      $fields.data("being_validated", true);
      $fields.each(function () {
        validator.element(this);
      });
      $fields.data("being_validated", false);
    }

    return isValid;
  }, $.validator.format("Please fill at least {0} of these fields."));
  /*
   * Lets you say "either at least X inputs that match selector Y must be filled,
   * OR they must all be skipped (left blank)."
   *
   * The end result, is that none of these inputs:
   *
   *	<input class="productinfo" name="partnumber">
   *	<input class="productinfo" name="description">
   *	<input class="productinfo" name="color">
   *
   *	...will validate unless either at least two of them are filled,
   *	OR none of them are.
   *
   * partnumber:	{skip_or_fill_minimum: [2,".productinfo"]},
   * description: {skip_or_fill_minimum: [2,".productinfo"]},
   * color:		{skip_or_fill_minimum: [2,".productinfo"]}
   *
   * options[0]: number of fields that must be filled in the group
   * options[1]: CSS selector that defines the group of conditionally required fields
   *
   */

  $.validator.addMethod("skip_or_fill_minimum", function (value, element, options) {
    var $fields = $(options[1], element.form),
        $fieldsFirst = $fields.eq(0),
        validator = $fieldsFirst.data("valid_skip") ? $fieldsFirst.data("valid_skip") : $.extend({}, this),
        numberFilled = $fields.filter(function () {
      return validator.elementValue(this);
    }).length,
        isValid = numberFilled === 0 || numberFilled >= options[0]; // Store the cloned validator for future validation

    $fieldsFirst.data("valid_skip", validator); // If element isn't being validated, run each skip_or_fill_minimum field's validation rules

    if (!$(element).data("being_validated")) {
      $fields.data("being_validated", true);
      $fields.each(function () {
        validator.element(this);
      });
      $fields.data("being_validated", false);
    }

    return isValid;
  }, $.validator.format("Please either skip these fields or fill at least {0} of them."));
  /* Validates US States and/or Territories by @jdforsythe
   * Can be case insensitive or require capitalization - default is case insensitive
   * Can include US Territories or not - default does not
   * Can include US Military postal abbreviations (AA, AE, AP) - default does not
   *
   * Note: "States" always includes DC (District of Colombia)
   *
   * Usage examples:
   *
   *  This is the default - case insensitive, no territories, no military zones
   *  stateInput: {
   *     caseSensitive: false,
   *     includeTerritories: false,
   *     includeMilitary: false
   *  }
   *
   *  Only allow capital letters, no territories, no military zones
   *  stateInput: {
   *     caseSensitive: false
   *  }
   *
   *  Case insensitive, include territories but not military zones
   *  stateInput: {
   *     includeTerritories: true
   *  }
   *
   *  Only allow capital letters, include territories and military zones
   *  stateInput: {
   *     caseSensitive: true,
   *     includeTerritories: true,
   *     includeMilitary: true
   *  }
   *
   */

  $.validator.addMethod("stateUS", function (value, element, options) {
    var isDefault = typeof options === "undefined",
        caseSensitive = isDefault || typeof options.caseSensitive === "undefined" ? false : options.caseSensitive,
        includeTerritories = isDefault || typeof options.includeTerritories === "undefined" ? false : options.includeTerritories,
        includeMilitary = isDefault || typeof options.includeMilitary === "undefined" ? false : options.includeMilitary,
        regex;

    if (!includeTerritories && !includeMilitary) {
      regex = "^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
    } else if (includeTerritories && includeMilitary) {
      regex = "^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
    } else if (includeTerritories) {
      regex = "^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$";
    } else {
      regex = "^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$";
    }

    regex = caseSensitive ? new RegExp(regex) : new RegExp(regex, "i");
    return this.optional(element) || regex.test(value);
  }, "Please specify a valid state"); // TODO check if value starts with <, otherwise don't try stripping anything

  $.validator.addMethod("strippedminlength", function (value, element, param) {
    return $(value).text().length >= param;
  }, $.validator.format("Please enter at least {0} characters"));
  $.validator.addMethod("time", function (value, element) {
    return this.optional(element) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(value);
  }, "Please enter a valid time, between 00:00 and 23:59");
  $.validator.addMethod("time12h", function (value, element) {
    return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
  }, "Please enter a valid time in 12-hour am/pm format"); // Same as url, but TLD is optional

  $.validator.addMethod("url2", function (value, element) {
    return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
  }, $.validator.messages.url);
  /**
   * Return true, if the value is a valid vehicle identification number (VIN).
   *
   * Works with all kind of text inputs.
   *
   * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
   * @desc Declares a required input element whose value must be a valid vehicle identification number.
   *
   * @name $.validator.methods.vinUS
   * @type Boolean
   * @cat Plugins/Validate/Methods
   */

  $.validator.addMethod("vinUS", function (v) {
    if (v.length !== 17) {
      return false;
    }

    var LL = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        VL = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9],
        FL = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2],
        rs = 0,
        i,
        n,
        d,
        f,
        cd,
        cdv;

    for (i = 0; i < 17; i++) {
      f = FL[i];
      d = v.slice(i, i + 1);

      if (i === 8) {
        cdv = d;
      }

      if (!isNaN(d)) {
        d *= f;
      } else {
        for (n = 0; n < LL.length; n++) {
          if (d.toUpperCase() === LL[n]) {
            d = VL[n];
            d *= f;

            if (isNaN(cdv) && n === 8) {
              cdv = LL[n];
            }

            break;
          }
        }
      }

      rs += d;
    }

    cd = rs % 11;

    if (cd === 10) {
      cd = "X";
    }

    if (cd === cdv) {
      return true;
    }

    return false;
  }, "The specified vehicle identification number (VIN) is invalid.");
  $.validator.addMethod("zipcodeUS", function (value, element) {
    return this.optional(element) || /^\d{5}(-\d{4})?$/.test(value);
  }, "The specified US ZIP Code is invalid");
  $.validator.addMethod("ziprange", function (value, element) {
    return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
  }, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx");
  return $;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9qcXVlcnktdmFsaWRhdGlvbi9kaXN0L2FkZGl0aW9uYWwtbWV0aG9kcy5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwic3RyaXBIdG1sIiwidmFsdWUiLCJyZXBsYWNlIiwidmFsaWRhdG9yIiwiYWRkTWV0aG9kIiwiZWxlbWVudCIsInBhcmFtcyIsIm9wdGlvbmFsIiwibWF0Y2giLCJsZW5ndGgiLCJmb3JtYXQiLCJ2YWx1ZVN0cmlwcGVkIiwicmVnZXgiLCJwYXJhbSIsInR5cGVQYXJhbSIsIm9wdGlvbmFsVmFsdWUiLCJpIiwiZmlsZSIsImF0dHIiLCJmaWxlcyIsIlJlZ0V4cCIsInR5cGUiLCJ0ZXN0IiwiYWNjb3VudCIsInN1bSIsImxlbiIsInBvcyIsImZhY3RvciIsImRpZ2l0Iiwic3Vic3RyaW5nIiwibWV0aG9kcyIsImJhbmthY2NvdW50TkwiLCJjYWxsIiwiZ2lyb2FjY291bnROTCIsInRvVXBwZXJDYXNlIiwiY2lmUmVnRXgiLCJsZXR0ZXIiLCJudW1iZXIiLCJjb250cm9sIiwiYWxsX3N1bSIsImV2ZW5fc3VtIiwib2RkX3N1bSIsIm4iLCJjb250cm9sX2RpZ2l0IiwiY29udHJvbF9sZXR0ZXIiLCJpc09kZCIsInBhcnNlSW50IiwidG9TdHJpbmciLCJzdWJzdHIiLCJmaXJzdENOIiwic2Vjb25kQ04iLCJjaGVja1Jlc3VsdCIsImNuIiwicmVzdWx0IiwibkNoZWNrIiwibkRpZ2l0IiwiYkV2ZW4iLCJjRGlnaXQiLCJjaGFyQXQiLCJ2YWxpZFR5cGVzIiwibWFzdGVyY2FyZCIsInZpc2EiLCJhbWV4IiwiZGluZXJzY2x1YiIsImVucm91dGUiLCJkaXNjb3ZlciIsImpjYiIsInVua25vd24iLCJhbGwiLCJpc1BhcmFtU3RyaW5nIiwic3ltYm9sIiwic29mdCIsIm1lc3NhZ2VzIiwiZGF0ZSIsImNoZWNrIiwicmUiLCJhZGF0YSIsImdnIiwibW0iLCJhYWFhIiwieGRhdGEiLCJzcGxpdCIsIkRhdGUiLCJVVEMiLCJnZXRVVENGdWxsWWVhciIsImdldFVUQ01vbnRoIiwiZ2V0VVRDRGF0ZSIsImliYW4iLCJpYmFuY2hlY2tkaWdpdHMiLCJsZWFkaW5nWmVyb2VzIiwiY1Jlc3QiLCJjT3BlcmF0b3IiLCJjb3VudHJ5Y29kZSIsImliYW5jaGVjayIsImNDaGFyIiwiYmJhbnBhdHRlcm4iLCJiYmFuY291bnRyeXBhdHRlcm5zIiwiaWJhbnJlZ2V4cCIsInAiLCJtaW5pbWFsSUJBTmxlbmd0aCIsImluZGV4T2YiLCJwaG9uZV9udW1iZXIiLCJuaWVSZWdFeCIsInZhbGlkQ2hhcnMiLCJhcnJTdGVwcyIsImludFN1bSIsImludDIiLCJpbnRDb250cm9sTnIiLCJlcXVhbFRvIiwiY2VwX3ZhbHVlIiwib3B0aW9ucyIsIiRmaWVsZHMiLCJmb3JtIiwiJGZpZWxkc0ZpcnN0IiwiZXEiLCJkYXRhIiwiZXh0ZW5kIiwiaXNWYWxpZCIsImZpbHRlciIsImVsZW1lbnRWYWx1ZSIsImVhY2giLCJudW1iZXJGaWxsZWQiLCJpc0RlZmF1bHQiLCJjYXNlU2Vuc2l0aXZlIiwiaW5jbHVkZVRlcnJpdG9yaWVzIiwiaW5jbHVkZU1pbGl0YXJ5IiwidGV4dCIsInVybCIsInYiLCJMTCIsIlZMIiwiRkwiLCJycyIsImQiLCJmIiwiY2QiLCJjZHYiLCJzbGljZSIsImlzTmFOIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7O0FBUUMsV0FBVUEsT0FBVixFQUFvQjtBQUNwQixNQUFLLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE1BQU0sQ0FBQ0MsR0FBNUMsRUFBa0Q7QUFDakRELElBQUFBLE1BQU0sQ0FBRSxDQUFDLFFBQUQsRUFBVyxtQkFBWCxDQUFGLEVBQW1DRCxPQUFuQyxDQUFOO0FBQ0EsR0FGRCxNQUVPLElBQUksUUFBT0csTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QkEsTUFBTSxDQUFDQyxPQUF6QyxFQUFrRDtBQUN4REQs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LCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSBWYWxpZGF0aW9uIFBsdWdpbiB2MS4xNy4wXG4gKlxuICogaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgSsO2cm4gWmFlZmZlcmVyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICkge1xuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRcdGRlZmluZSggW1wianF1ZXJ5XCIsIFwiLi9qcXVlcnkudmFsaWRhdGVcIl0sIGZhY3RvcnkgKTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCByZXF1aXJlKCBcImpxdWVyeVwiICkgKTtcblx0fSBlbHNlIHtcblx0XHRmYWN0b3J5KCBqUXVlcnkgKTtcblx0fVxufShmdW5jdGlvbiggJCApIHtcblxuKCBmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBzdHJpcEh0bWwoIHZhbHVlICkge1xuXG5cdFx0Ly8gUmVtb3ZlIGh0bWwgdGFncyBhbmQgc3BhY2UgY2hhcnNcblx0XHRyZXR1cm4gdmFsdWUucmVwbGFjZSggLzwuW148Pl0qPz4vZywgXCIgXCIgKS5yZXBsYWNlKCAvJm5ic3A7fCYjMTYwOy9naSwgXCIgXCIgKVxuXG5cdFx0Ly8gUmVtb3ZlIHB1bmN0dWF0aW9uXG5cdFx0LnJlcGxhY2UoIC9bLigpLDs6IT8lIyQnXFxcIl8rPVxcL1xcLeKAnOKAneKAmV0qL2csIFwiXCIgKTtcblx0fVxuXG5cdCQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJtYXhXb3Jkc1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtcyApIHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHN0cmlwSHRtbCggdmFsdWUgKS5tYXRjaCggL1xcYlxcdytcXGIvZyApLmxlbmd0aCA8PSBwYXJhbXM7XG5cdH0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgezB9IHdvcmRzIG9yIGxlc3MuXCIgKSApO1xuXG5cdCQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJtaW5Xb3Jkc1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtcyApIHtcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHN0cmlwSHRtbCggdmFsdWUgKS5tYXRjaCggL1xcYlxcdytcXGIvZyApLmxlbmd0aCA+PSBwYXJhbXM7XG5cdH0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IHdvcmRzLlwiICkgKTtcblxuXHQkLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicmFuZ2VXb3Jkc1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtcyApIHtcblx0XHR2YXIgdmFsdWVTdHJpcHBlZCA9IHN0cmlwSHRtbCggdmFsdWUgKSxcblx0XHRcdHJlZ2V4ID0gL1xcYlxcdytcXGIvZztcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHZhbHVlU3RyaXBwZWQubWF0Y2goIHJlZ2V4ICkubGVuZ3RoID49IHBhcmFtc1sgMCBdICYmIHZhbHVlU3RyaXBwZWQubWF0Y2goIHJlZ2V4ICkubGVuZ3RoIDw9IHBhcmFtc1sgMSBdO1xuXHR9LCAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGJldHdlZW4gezB9IGFuZCB7MX0gd29yZHMuXCIgKSApO1xuXG59KCkgKTtcblxuLy8gQWNjZXB0IGEgdmFsdWUgZnJvbSBhIGZpbGUgaW5wdXQgYmFzZWQgb24gYSByZXF1aXJlZCBtaW1ldHlwZVxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImFjY2VwdFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXG5cdC8vIFNwbGl0IG1pbWUgb24gY29tbWFzIGluIGNhc2Ugd2UgaGF2ZSBtdWx0aXBsZSB0eXBlcyB3ZSBjYW4gYWNjZXB0XG5cdHZhciB0eXBlUGFyYW0gPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgPyBwYXJhbS5yZXBsYWNlKCAvXFxzL2csIFwiXCIgKSA6IFwiaW1hZ2UvKlwiLFxuXHRcdG9wdGlvbmFsVmFsdWUgPSB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICksXG5cdFx0aSwgZmlsZSwgcmVnZXg7XG5cblx0Ly8gRWxlbWVudCBpcyBvcHRpb25hbFxuXHRpZiAoIG9wdGlvbmFsVmFsdWUgKSB7XG5cdFx0cmV0dXJuIG9wdGlvbmFsVmFsdWU7XG5cdH1cblxuXHRpZiAoICQoIGVsZW1lbnQgKS5hdHRyKCBcInR5cGVcIiApID09PSBcImZpbGVcIiApIHtcblxuXHRcdC8vIEVzY2FwZSBzdHJpbmcgdG8gYmUgdXNlZCBpbiB0aGUgcmVnZXhcblx0XHQvLyBzZWU6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NDYxNzAvZXNjYXBlLXN0cmluZy1mb3ItdXNlLWluLWphdmFzY3JpcHQtcmVnZXhcblx0XHQvLyBFc2NhcGUgYWxzbyBcIi8qXCIgYXMgXCIvLipcIiBhcyBhIHdpbGRjYXJkXG5cdFx0dHlwZVBhcmFtID0gdHlwZVBhcmFtXG5cdFx0XHRcdC5yZXBsYWNlKCAvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csIFwiXFxcXCQmXCIgKVxuXHRcdFx0XHQucmVwbGFjZSggLywvZywgXCJ8XCIgKVxuXHRcdFx0XHQucmVwbGFjZSggL1xcL1xcKi9nLCBcIi8uKlwiICk7XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgZWxlbWVudCBoYXMgYSBGaWxlTGlzdCBiZWZvcmUgY2hlY2tpbmcgZWFjaCBmaWxlXG5cdFx0aWYgKCBlbGVtZW50LmZpbGVzICYmIGVsZW1lbnQuZmlsZXMubGVuZ3RoICkge1xuXHRcdFx0cmVnZXggPSBuZXcgUmVnRXhwKCBcIi4/KFwiICsgdHlwZVBhcmFtICsgXCIpJFwiLCBcImlcIiApO1xuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBlbGVtZW50LmZpbGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRmaWxlID0gZWxlbWVudC5maWxlc1sgaSBdO1xuXG5cdFx0XHRcdC8vIEdyYWIgdGhlIG1pbWV0eXBlIGZyb20gdGhlIGxvYWRlZCBmaWxlLCB2ZXJpZnkgaXQgbWF0Y2hlc1xuXHRcdFx0XHRpZiAoICFmaWxlLnR5cGUubWF0Y2goIHJlZ2V4ICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gRWl0aGVyIHJldHVybiB0cnVlIGJlY2F1c2Ugd2UndmUgdmFsaWRhdGVkIGVhY2ggZmlsZSwgb3IgYmVjYXVzZSB0aGVcblx0Ly8gYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGVsZW1lbnQuZmlsZXMgYW5kIHRoZSBGaWxlTGlzdCBmZWF0dXJlXG5cdHJldHVybiB0cnVlO1xufSwgJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIHdpdGggYSB2YWxpZCBtaW1ldHlwZS5cIiApICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJhbHBoYW51bWVyaWNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFx3KyQvaS50ZXN0KCB2YWx1ZSApO1xufSwgXCJMZXR0ZXJzLCBudW1iZXJzLCBhbmQgdW5kZXJzY29yZXMgb25seSBwbGVhc2VcIiApO1xuXG4vKlxuICogRHV0Y2ggYmFuayBhY2NvdW50IG51bWJlcnMgKG5vdCAnZ2lybycgbnVtYmVycykgaGF2ZSA5IGRpZ2l0c1xuICogYW5kIHBhc3MgdGhlICcxMSBjaGVjaycuXG4gKiBXZSBhY2NlcHQgdGhlIG5vdGF0aW9uIHdpdGggc3BhY2VzLCBhcyB0aGF0IGlzIGNvbW1vbi5cbiAqIGFjY2VwdGFibGU6IDEyMzQ1Njc4OSBvciAxMiAzNCA1NiA3ODlcbiAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImJhbmthY2NvdW50TkxcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZiAoICEoIC9eWzAtOV17OX18KFswLTldezJ9ICl7M31bMC05XXszfSQvLnRlc3QoIHZhbHVlICkgKSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBOb3cgJzExIGNoZWNrJ1xuXHR2YXIgYWNjb3VudCA9IHZhbHVlLnJlcGxhY2UoIC8gL2csIFwiXCIgKSwgLy8gUmVtb3ZlIHNwYWNlc1xuXHRcdHN1bSA9IDAsXG5cdFx0bGVuID0gYWNjb3VudC5sZW5ndGgsXG5cdFx0cG9zLCBmYWN0b3IsIGRpZ2l0O1xuXHRmb3IgKCBwb3MgPSAwOyBwb3MgPCBsZW47IHBvcysrICkge1xuXHRcdGZhY3RvciA9IGxlbiAtIHBvcztcblx0XHRkaWdpdCA9IGFjY291bnQuc3Vic3RyaW5nKCBwb3MsIHBvcyArIDEgKTtcblx0XHRzdW0gPSBzdW0gKyBmYWN0b3IgKiBkaWdpdDtcblx0fVxuXHRyZXR1cm4gc3VtICUgMTEgPT09IDA7XG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgYmFuayBhY2NvdW50IG51bWJlclwiICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJiYW5rb3JnaXJvYWNjb3VudE5MXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fFxuXHRcdFx0KCAkLnZhbGlkYXRvci5tZXRob2RzLmJhbmthY2NvdW50TkwuY2FsbCggdGhpcywgdmFsdWUsIGVsZW1lbnQgKSApIHx8XG5cdFx0XHQoICQudmFsaWRhdG9yLm1ldGhvZHMuZ2lyb2FjY291bnROTC5jYWxsKCB0aGlzLCB2YWx1ZSwgZWxlbWVudCApICk7XG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgYmFuayBvciBnaXJvIGFjY291bnQgbnVtYmVyXCIgKTtcblxuLyoqXG4gKiBCSUMgaXMgdGhlIGJ1c2luZXNzIGlkZW50aWZpZXIgY29kZSAoSVNPIDkzNjIpLiBUaGlzIEJJQyBjaGVjayBpcyBub3QgYSBndWFyYW50ZWUgZm9yIGF1dGhlbnRpY2l0eS5cbiAqXG4gKiBCSUMgcGF0dGVybjogQkJCQkNDTExiYmIgKDggb3IgMTEgY2hhcmFjdGVycyBsb25nOyBiYmIgaXMgb3B0aW9uYWwpXG4gKlxuICogVmFsaWRhdGlvbiBpcyBjYXNlLWluc2Vuc2l0aXZlLiBQbGVhc2UgbWFrZSBzdXJlIHRvIG5vcm1hbGl6ZSBpbnB1dCB5b3Vyc2VsZi5cbiAqXG4gKiBCSUMgZGVmaW5pdGlvbiBpbiBkZXRhaWw6XG4gKiAtIEZpcnN0IDQgY2hhcmFjdGVycyAtIGJhbmsgY29kZSAob25seSBsZXR0ZXJzKVxuICogLSBOZXh0IDIgY2hhcmFjdGVycyAtIElTTyAzMTY2LTEgYWxwaGEtMiBjb3VudHJ5IGNvZGUgKG9ubHkgbGV0dGVycylcbiAqIC0gTmV4dCAyIGNoYXJhY3RlcnMgLSBsb2NhdGlvbiBjb2RlIChsZXR0ZXJzIGFuZCBkaWdpdHMpXG4gKiAgIGEuIHNoYWxsIG5vdCBzdGFydCB3aXRoICcwJyBvciAnMSdcbiAqICAgYi4gc2Vjb25kIGNoYXJhY3RlciBtdXN0IGJlIGEgbGV0dGVyICgnTycgaXMgbm90IGFsbG93ZWQpIG9yIGRpZ2l0ICgnMCcgZm9yIHRlc3QgKHRoZXJlZm9yZSBub3QgYWxsb3dlZCksICcxJyBkZW5vdGluZyBwYXNzaXZlIHBhcnRpY2lwYW50LCAnMicgdHlwaWNhbGx5IHJldmVyc2UtYmlsbGluZylcbiAqIC0gTGFzdCAzIGNoYXJhY3RlcnMgLSBicmFuY2ggY29kZSwgb3B0aW9uYWwgKHNoYWxsIG5vdCBzdGFydCB3aXRoICdYJyBleGNlcHQgaW4gY2FzZSBvZiAnWFhYJyBmb3IgcHJpbWFyeSBvZmZpY2UpIChsZXR0ZXJzIGFuZCBkaWdpdHMpXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJiaWNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oW0EtWl17Nn1bQS1aMi05XVtBLU5QLVoxLTldKShYezN9fFtBLVdZLVowLTldW0EtWjAtOV17Mn0pPyQvLnRlc3QoIHZhbHVlLnRvVXBwZXJDYXNlKCkgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBCSUMgY29kZVwiICk7XG5cbi8qXG4gKiBDw7NkaWdvIGRlIGlkZW50aWZpY2FjacOzbiBmaXNjYWwgKCBDSUYgKSBpcyB0aGUgdGF4IGlkZW50aWZpY2F0aW9uIGNvZGUgZm9yIFNwYW5pc2ggbGVnYWwgZW50aXRpZXNcbiAqIEZ1cnRoZXIgcnVsZXMgY2FuIGJlIGZvdW5kIGluIFNwYW5pc2ggb24gaHR0cDovL2VzLndpa2lwZWRpYS5vcmcvd2lraS9DJUMzJUIzZGlnb19kZV9pZGVudGlmaWNhY2klQzMlQjNuX2Zpc2NhbFxuICpcbiAqIFNwYW5pc2ggQ0lGIHN0cnVjdHVyZTpcbiAqXG4gKiBbIFQgXVsgUCBdWyBQIF1bIE4gXVsgTiBdWyBOIF1bIE4gXVsgTiBdWyBDIF1cbiAqXG4gKiBXaGVyZTpcbiAqXG4gKiBUOiAxIGNoYXJhY3Rlci4gS2luZCBvZiBPcmdhbml6YXRpb24gTGV0dGVyOiBbQUJDREVGR0hKS0xNTlBRUlNVVlddXG4gKiBQOiAyIGNoYXJhY3RlcnMuIFByb3ZpbmNlLlxuICogTjogNSBjaGFyYWN0ZXJzLiBTZWN1ZW5jaWFsIE51bWJlciB3aXRoaW4gdGhlIHByb3ZpbmNlLlxuICogQzogMSBjaGFyYWN0ZXIuIENvbnRyb2wgRGlnaXQ6IFswLTlBLUpdLlxuICpcbiAqIFsgVCBdOiBLaW5kIG9mIE9yZ2FuaXphdGlvbnMuIFBvc3NpYmxlIHZhbHVlczpcbiAqXG4gKiAgIEEuIENvcnBvcmF0aW9uc1xuICogICBCLiBMTENzXG4gKiAgIEMuIEdlbmVyYWwgcGFydG5lcnNoaXBzXG4gKiAgIEQuIENvbXBhbmllcyBsaW1pdGVkIHBhcnRuZXJzaGlwc1xuICogICBFLiBDb21tdW5pdGllcyBvZiBnb29kc1xuICogICBGLiBDb29wZXJhdGl2ZSBTb2NpZXRpZXNcbiAqICAgRy4gQXNzb2NpYXRpb25zXG4gKiAgIEguIENvbW11bml0aWVzIG9mIGhvbWVvd25lcnMgaW4gaG9yaXpvbnRhbCBwcm9wZXJ0eSByZWdpbWVcbiAqICAgSi4gQ2l2aWwgU29jaWV0aWVzXG4gKiAgIEsuIE9sZCBmb3JtYXRcbiAqICAgTC4gT2xkIGZvcm1hdFxuICogICBNLiBPbGQgZm9ybWF0XG4gKiAgIE4uIE5vbnJlc2lkZW50IGVudGl0aWVzXG4gKiAgIFAuIExvY2FsIGF1dGhvcml0aWVzXG4gKiAgIFEuIEF1dG9ub21vdXMgYm9kaWVzLCBzdGF0ZSBvciBub3QsIGFuZCB0aGUgbGlrZSwgYW5kIGNvbmdyZWdhdGlvbnMgYW5kIHJlbGlnaW91cyBpbnN0aXR1dGlvbnNcbiAqICAgUi4gQ29uZ3JlZ2F0aW9ucyBhbmQgcmVsaWdpb3VzIGluc3RpdHV0aW9ucyAoc2luY2UgMjAwOCBPUkRFUiBFSEEvNDUxLzIwMDgpXG4gKiAgIFMuIE9yZ2FucyBvZiBTdGF0ZSBBZG1pbmlzdHJhdGlvbiBhbmQgcmVnaW9uc1xuICogICBWLiBBZ3JhcmlhbiBUcmFuc2Zvcm1hdGlvblxuICogICBXLiBQZXJtYW5lbnQgZXN0YWJsaXNobWVudHMgb2Ygbm9uLXJlc2lkZW50IGluIFNwYWluXG4gKlxuICogWyBDIF06IENvbnRyb2wgRGlnaXQuIEl0IGNhbiBiZSBhIG51bWJlciBvciBhIGxldHRlciBkZXBlbmRpbmcgb24gVCB2YWx1ZTpcbiAqIFsgVCBdICAtLT4gIFsgQyBdXG4gKiAtLS0tLS0gICAgLS0tLS0tLS0tLVxuICogICBBICAgICAgICAgTnVtYmVyXG4gKiAgIEIgICAgICAgICBOdW1iZXJcbiAqICAgRSAgICAgICAgIE51bWJlclxuICogICBIICAgICAgICAgTnVtYmVyXG4gKiAgIEsgICAgICAgICBMZXR0ZXJcbiAqICAgUCAgICAgICAgIExldHRlclxuICogICBRICAgICAgICAgTGV0dGVyXG4gKiAgIFMgICAgICAgICBMZXR0ZXJcbiAqXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJjaWZFU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dmFyIGNpZlJlZ0V4ID0gbmV3IFJlZ0V4cCggL14oW0FCQ0RFRkdISktMTU5QUVJTVVZXXSkoXFxkezd9KShbMC05QS1KXSkkL2dpICk7XG5cdHZhciBsZXR0ZXIgID0gdmFsdWUuc3Vic3RyaW5nKCAwLCAxICksIC8vIFsgVCBdXG5cdFx0bnVtYmVyICA9IHZhbHVlLnN1YnN0cmluZyggMSwgOCApLCAvLyBbIFAgXVsgUCBdWyBOIF1bIE4gXVsgTiBdWyBOIF1bIE4gXVxuXHRcdGNvbnRyb2wgPSB2YWx1ZS5zdWJzdHJpbmcoIDgsIDkgKSwgLy8gWyBDIF1cblx0XHRhbGxfc3VtID0gMCxcblx0XHRldmVuX3N1bSA9IDAsXG5cdFx0b2RkX3N1bSA9IDAsXG5cdFx0aSwgbixcblx0XHRjb250cm9sX2RpZ2l0LFxuXHRcdGNvbnRyb2xfbGV0dGVyO1xuXG5cdGZ1bmN0aW9uIGlzT2RkKCBuICkge1xuXHRcdHJldHVybiBuICUgMiA9PT0gMDtcblx0fVxuXG5cdC8vIFF1aWNrIGZvcm1hdCB0ZXN0XG5cdGlmICggdmFsdWUubGVuZ3RoICE9PSA5IHx8ICFjaWZSZWdFeC50ZXN0KCB2YWx1ZSApICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZvciAoIGkgPSAwOyBpIDwgbnVtYmVyLmxlbmd0aDsgaSsrICkge1xuXHRcdG4gPSBwYXJzZUludCggbnVtYmVyWyBpIF0sIDEwICk7XG5cblx0XHQvLyBPZGQgcG9zaXRpb25zXG5cdFx0aWYgKCBpc09kZCggaSApICkge1xuXG5cdFx0XHQvLyBPZGQgcG9zaXRpb25zIGFyZSBtdWx0aXBsaWVkIGZpcnN0LlxuXHRcdFx0biAqPSAyO1xuXG5cdFx0XHQvLyBJZiB0aGUgbXVsdGlwbGljYXRpb24gaXMgYmlnZ2VyIHRoYW4gMTAgd2UgbmVlZCB0byBhZGp1c3Rcblx0XHRcdG9kZF9zdW0gKz0gbiA8IDEwID8gbiA6IG4gLSA5O1xuXG5cdFx0Ly8gRXZlbiBwb3NpdGlvbnNcblx0XHQvLyBKdXN0IHN1bSB0aGVtXG5cdFx0fSBlbHNlIHtcblx0XHRcdGV2ZW5fc3VtICs9IG47XG5cdFx0fVxuXHR9XG5cblx0YWxsX3N1bSA9IGV2ZW5fc3VtICsgb2RkX3N1bTtcblx0Y29udHJvbF9kaWdpdCA9ICggMTAgLSAoIGFsbF9zdW0gKS50b1N0cmluZygpLnN1YnN0ciggLTEgKSApLnRvU3RyaW5nKCk7XG5cdGNvbnRyb2xfZGlnaXQgPSBwYXJzZUludCggY29udHJvbF9kaWdpdCwgMTAgKSA+IDkgPyBcIjBcIiA6IGNvbnRyb2xfZGlnaXQ7XG5cdGNvbnRyb2xfbGV0dGVyID0gXCJKQUJDREVGR0hJXCIuc3Vic3RyKCBjb250cm9sX2RpZ2l0LCAxICkudG9TdHJpbmcoKTtcblxuXHQvLyBDb250cm9sIG11c3QgYmUgYSBkaWdpdFxuXHRpZiAoIGxldHRlci5tYXRjaCggL1tBQkVIXS8gKSApIHtcblx0XHRyZXR1cm4gY29udHJvbCA9PT0gY29udHJvbF9kaWdpdDtcblxuXHQvLyBDb250cm9sIG11c3QgYmUgYSBsZXR0ZXJcblx0fSBlbHNlIGlmICggbGV0dGVyLm1hdGNoKCAvW0tQUVNdLyApICkge1xuXHRcdHJldHVybiBjb250cm9sID09PSBjb250cm9sX2xldHRlcjtcblx0fVxuXG5cdC8vIENhbiBiZSBlaXRoZXJcblx0cmV0dXJuIGNvbnRyb2wgPT09IGNvbnRyb2xfZGlnaXQgfHwgY29udHJvbCA9PT0gY29udHJvbF9sZXR0ZXI7XG5cbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBDSUYgbnVtYmVyLlwiICk7XG5cbi8qXG4gKiBCcmF6aWxsaWFuIENQRiBudW1iZXIgKENhZGFzdHJhZG8gZGUgUGVzc29hcyBGw61zaWNhcykgaXMgdGhlIGVxdWl2YWxlbnQgb2YgYSBCcmF6aWxpYW4gdGF4IHJlZ2lzdHJhdGlvbiBudW1iZXIuXG4gKiBDUEYgbnVtYmVycyBoYXZlIDExIGRpZ2l0cyBpbiB0b3RhbDogOSBudW1iZXJzIGZvbGxvd2VkIGJ5IDIgY2hlY2sgbnVtYmVycyB0aGF0IGFyZSBiZWluZyB1c2VkIGZvciB2YWxpZGF0aW9uLlxuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiY3BmQlJcIiwgZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdC8vIFJlbW92aW5nIHNwZWNpYWwgY2hhcmFjdGVycyBmcm9tIHZhbHVlXG5cdHZhbHVlID0gdmFsdWUucmVwbGFjZSggLyhbfiFAIyQlXiYqKClfKz1ge31cXFtcXF1cXC18XFxcXDo7Jzw+LC5cXC8/IF0pKy9nLCBcIlwiICk7XG5cblx0Ly8gQ2hlY2tpbmcgdmFsdWUgdG8gaGF2ZSAxMSBkaWdpdHMgb25seVxuXHRpZiAoIHZhbHVlLmxlbmd0aCAhPT0gMTEgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIHN1bSA9IDAsXG5cdFx0Zmlyc3RDTiwgc2Vjb25kQ04sIGNoZWNrUmVzdWx0LCBpO1xuXG5cdGZpcnN0Q04gPSBwYXJzZUludCggdmFsdWUuc3Vic3RyaW5nKCA5LCAxMCApLCAxMCApO1xuXHRzZWNvbmRDTiA9IHBhcnNlSW50KCB2YWx1ZS5zdWJzdHJpbmcoIDEwLCAxMSApLCAxMCApO1xuXG5cdGNoZWNrUmVzdWx0ID0gZnVuY3Rpb24oIHN1bSwgY24gKSB7XG5cdFx0dmFyIHJlc3VsdCA9ICggc3VtICogMTAgKSAlIDExO1xuXHRcdGlmICggKCByZXN1bHQgPT09IDEwICkgfHwgKCByZXN1bHQgPT09IDExICkgKSB7XG5cdFx0XHRyZXN1bHQgPSAwO1xuXHRcdH1cblx0XHRyZXR1cm4gKCByZXN1bHQgPT09IGNuICk7XG5cdH07XG5cblx0Ly8gQ2hlY2tpbmcgZm9yIGR1bXAgZGF0YVxuXHRpZiAoIHZhbHVlID09PSBcIlwiIHx8XG5cdFx0dmFsdWUgPT09IFwiMDAwMDAwMDAwMDBcIiB8fFxuXHRcdHZhbHVlID09PSBcIjExMTExMTExMTExXCIgfHxcblx0XHR2YWx1ZSA9PT0gXCIyMjIyMjIyMjIyMlwiIHx8XG5cdFx0dmFsdWUgPT09IFwiMzMzMzMzMzMzMzNcIiB8fFxuXHRcdHZhbHVlID09PSBcIjQ0NDQ0NDQ0NDQ0XCIgfHxcblx0XHR2YWx1ZSA9PT0gXCI1NTU1NTU1NTU1NVwiIHx8XG5cdFx0dmFsdWUgPT09IFwiNjY2NjY2NjY2NjZcIiB8fFxuXHRcdHZhbHVlID09PSBcIjc3Nzc3Nzc3Nzc3XCIgfHxcblx0XHR2YWx1ZSA9PT0gXCI4ODg4ODg4ODg4OFwiIHx8XG5cdFx0dmFsdWUgPT09IFwiOTk5OTk5OTk5OTlcIlxuXHQpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBTdGVwIDEgLSB1c2luZyBmaXJzdCBDaGVjayBOdW1iZXI6XG5cdGZvciAoIGkgPSAxOyBpIDw9IDk7IGkrKyApIHtcblx0XHRzdW0gPSBzdW0gKyBwYXJzZUludCggdmFsdWUuc3Vic3RyaW5nKCBpIC0gMSwgaSApLCAxMCApICogKCAxMSAtIGkgKTtcblx0fVxuXG5cdC8vIElmIGZpcnN0IENoZWNrIE51bWJlciAoQ04pIGlzIHZhbGlkLCBtb3ZlIHRvIFN0ZXAgMiAtIHVzaW5nIHNlY29uZCBDaGVjayBOdW1iZXI6XG5cdGlmICggY2hlY2tSZXN1bHQoIHN1bSwgZmlyc3RDTiApICkge1xuXHRcdHN1bSA9IDA7XG5cdFx0Zm9yICggaSA9IDE7IGkgPD0gMTA7IGkrKyApIHtcblx0XHRcdHN1bSA9IHN1bSArIHBhcnNlSW50KCB2YWx1ZS5zdWJzdHJpbmcoIGkgLSAxLCBpICksIDEwICkgKiAoIDEyIC0gaSApO1xuXHRcdH1cblx0XHRyZXR1cm4gY2hlY2tSZXN1bHQoIHN1bSwgc2Vjb25kQ04gKTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG5cbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBDUEYgbnVtYmVyXCIgKTtcblxuLy8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9jcmVkaXRjYXJkLW1ldGhvZC9cbi8vIGJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0x1aG5fYWxnb3JpdGhtXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiY3JlZGl0Y2FyZFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuXHRcdHJldHVybiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcblx0fVxuXG5cdC8vIEFjY2VwdCBvbmx5IHNwYWNlcywgZGlnaXRzIGFuZCBkYXNoZXNcblx0aWYgKCAvW14wLTkgXFwtXSsvLnRlc3QoIHZhbHVlICkgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0dmFyIG5DaGVjayA9IDAsXG5cdFx0bkRpZ2l0ID0gMCxcblx0XHRiRXZlbiA9IGZhbHNlLFxuXHRcdG4sIGNEaWdpdDtcblxuXHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoIC9cXEQvZywgXCJcIiApO1xuXG5cdC8vIEJhc2luZyBtaW4gYW5kIG1heCBsZW5ndGggb25cblx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIuZWFuLmNvbS9nZW5lcmFsX2luZm8vVmFsaWRfQ3JlZGl0X0NhcmRfVHlwZXNcblx0aWYgKCB2YWx1ZS5sZW5ndGggPCAxMyB8fCB2YWx1ZS5sZW5ndGggPiAxOSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmb3IgKCBuID0gdmFsdWUubGVuZ3RoIC0gMTsgbiA+PSAwOyBuLS0gKSB7XG5cdFx0Y0RpZ2l0ID0gdmFsdWUuY2hhckF0KCBuICk7XG5cdFx0bkRpZ2l0ID0gcGFyc2VJbnQoIGNEaWdpdCwgMTAgKTtcblx0XHRpZiAoIGJFdmVuICkge1xuXHRcdFx0aWYgKCAoIG5EaWdpdCAqPSAyICkgPiA5ICkge1xuXHRcdFx0XHRuRGlnaXQgLT0gOTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRuQ2hlY2sgKz0gbkRpZ2l0O1xuXHRcdGJFdmVuID0gIWJFdmVuO1xuXHR9XG5cblx0cmV0dXJuICggbkNoZWNrICUgMTAgKSA9PT0gMDtcbn0sIFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgY3JlZGl0IGNhcmQgbnVtYmVyLlwiICk7XG5cbi8qIE5PVElDRTogTW9kaWZpZWQgdmVyc2lvbiBvZiBDYXN0bGUuQ29tcG9uZW50cy5WYWxpZGF0b3IuQ3JlZGl0Q2FyZFZhbGlkYXRvclxuICogUmVkaXN0cmlidXRlZCB1bmRlciB0aGUgdGhlIEFwYWNoZSBMaWNlbnNlIDIuMCBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqIFZhbGlkIFR5cGVzOiBtYXN0ZXJjYXJkLCB2aXNhLCBhbWV4LCBkaW5lcnNjbHViLCBlbnJvdXRlLCBkaXNjb3ZlciwgamNiLCB1bmtub3duLCBhbGwgKG92ZXJyaWRlcyBhbGwgb3RoZXIgc2V0dGluZ3MpXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJjcmVkaXRjYXJkdHlwZXNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0aWYgKCAvW14wLTlcXC1dKy8udGVzdCggdmFsdWUgKSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoIC9cXEQvZywgXCJcIiApO1xuXG5cdHZhciB2YWxpZFR5cGVzID0gMHgwMDAwO1xuXG5cdGlmICggcGFyYW0ubWFzdGVyY2FyZCApIHtcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDAwMTtcblx0fVxuXHRpZiAoIHBhcmFtLnZpc2EgKSB7XG5cdFx0dmFsaWRUeXBlcyB8PSAweDAwMDI7XG5cdH1cblx0aWYgKCBwYXJhbS5hbWV4ICkge1xuXHRcdHZhbGlkVHlwZXMgfD0gMHgwMDA0O1xuXHR9XG5cdGlmICggcGFyYW0uZGluZXJzY2x1YiApIHtcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDAwODtcblx0fVxuXHRpZiAoIHBhcmFtLmVucm91dGUgKSB7XG5cdFx0dmFsaWRUeXBlcyB8PSAweDAwMTA7XG5cdH1cblx0aWYgKCBwYXJhbS5kaXNjb3ZlciApIHtcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDAyMDtcblx0fVxuXHRpZiAoIHBhcmFtLmpjYiApIHtcblx0XHR2YWxpZFR5cGVzIHw9IDB4MDA0MDtcblx0fVxuXHRpZiAoIHBhcmFtLnVua25vd24gKSB7XG5cdFx0dmFsaWRUeXBlcyB8PSAweDAwODA7XG5cdH1cblx0aWYgKCBwYXJhbS5hbGwgKSB7XG5cdFx0dmFsaWRUeXBlcyA9IDB4MDAwMSB8IDB4MDAwMiB8IDB4MDAwNCB8IDB4MDAwOCB8IDB4MDAxMCB8IDB4MDAyMCB8IDB4MDA0MCB8IDB4MDA4MDtcblx0fVxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMDEgJiYgL14oNVsxMjM0NV0pLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBNYXN0ZXJjYXJkXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMTY7XG5cdH1cblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDAyICYmIC9eKDQpLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBWaXNhXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMTY7XG5cdH1cblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDA0ICYmIC9eKDNbNDddKS8udGVzdCggdmFsdWUgKSApIHsgLy8gQW1leFxuXHRcdHJldHVybiB2YWx1ZS5sZW5ndGggPT09IDE1O1xuXHR9XG5cdGlmICggdmFsaWRUeXBlcyAmIDB4MDAwOCAmJiAvXigzKDBbMDEyMzQ1XXxbNjhdKSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIERpbmVyc2NsdWJcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNDtcblx0fVxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMTAgJiYgL14oMigwMTR8MTQ5KSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIEVucm91dGVcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNTtcblx0fVxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwMjAgJiYgL14oNjAxMSkvLnRlc3QoIHZhbHVlICkgKSB7IC8vIERpc2NvdmVyXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMTY7XG5cdH1cblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDQwICYmIC9eKDMpLy50ZXN0KCB2YWx1ZSApICkgeyAvLyBKY2Jcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoID09PSAxNjtcblx0fVxuXHRpZiAoIHZhbGlkVHlwZXMgJiAweDAwNDAgJiYgL14oMjEzMXwxODAwKS8udGVzdCggdmFsdWUgKSApIHsgLy8gSmNiXG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMTU7XG5cdH1cblx0aWYgKCB2YWxpZFR5cGVzICYgMHgwMDgwICkgeyAvLyBVbmtub3duXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufSwgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBjcmVkaXQgY2FyZCBudW1iZXIuXCIgKTtcblxuLyoqXG4gKiBWYWxpZGF0ZXMgY3VycmVuY2llcyB3aXRoIGFueSBnaXZlbiBzeW1ib2xzIGJ5IEBqYW1lc2xvdWl6XG4gKiBTeW1ib2xzIGNhbiBiZSBvcHRpb25hbCBvciByZXF1aXJlZC4gU3ltYm9scyByZXF1aXJlZCBieSBkZWZhdWx0XG4gKlxuICogVXNhZ2UgZXhhbXBsZXM6XG4gKiAgY3VycmVuY3k6IFtcIsKjXCIsIGZhbHNlXSAtIFVzZSBmYWxzZSBmb3Igc29mdCBjdXJyZW5jeSB2YWxpZGF0aW9uXG4gKiAgY3VycmVuY3k6IFtcIiRcIiwgZmFsc2VdXG4gKiAgY3VycmVuY3k6IFtcIlJNXCIsIGZhbHNlXSAtIGFsc28gd29ya3Mgd2l0aCB0ZXh0IGJhc2VkIHN5bWJvbHMgc3VjaCBhcyBcIlJNXCIgLSBNYWxheXNpYSBSaW5nZ2l0IGV0Y1xuICpcbiAqICA8aW5wdXQgY2xhc3M9XCJjdXJyZW5jeUlucHV0XCIgbmFtZT1cImN1cnJlbmN5SW5wdXRcIj5cbiAqXG4gKiBTb2Z0IHN5bWJvbCBjaGVja2luZ1xuICogIGN1cnJlbmN5SW5wdXQ6IHtcbiAqICAgICBjdXJyZW5jeTogW1wiJFwiLCBmYWxzZV1cbiAqICB9XG4gKlxuICogU3RyaWN0IHN5bWJvbCBjaGVja2luZyAoZGVmYXVsdClcbiAqICBjdXJyZW5jeUlucHV0OiB7XG4gKiAgICAgY3VycmVuY3k6IFwiJFwiXG4gKiAgICAgLy9PUlxuICogICAgIGN1cnJlbmN5OiBbXCIkXCIsIHRydWVdXG4gKiAgfVxuICpcbiAqIE11bHRpcGxlIFN5bWJvbHNcbiAqICBjdXJyZW5jeUlucHV0OiB7XG4gKiAgICAgY3VycmVuY3k6IFwiJCzCoyzColwiXG4gKiAgfVxuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiY3VycmVuY3lcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcbiAgICB2YXIgaXNQYXJhbVN0cmluZyA9IHR5cGVvZiBwYXJhbSA9PT0gXCJzdHJpbmdcIixcbiAgICAgICAgc3ltYm9sID0gaXNQYXJhbVN0cmluZyA/IHBhcmFtIDogcGFyYW1bIDAgXSxcbiAgICAgICAgc29mdCA9IGlzUGFyYW1TdHJpbmcgPyB0cnVlIDogcGFyYW1bIDEgXSxcbiAgICAgICAgcmVnZXg7XG5cbiAgICBzeW1ib2wgPSBzeW1ib2wucmVwbGFjZSggLywvZywgXCJcIiApO1xuICAgIHN5bWJvbCA9IHNvZnQgPyBzeW1ib2wgKyBcIl1cIiA6IHN5bWJvbCArIFwiXT9cIjtcbiAgICByZWdleCA9IFwiXltcIiArIHN5bWJvbCArIFwiKFsxLTldezF9WzAtOV17MCwyfShcXFxcLFswLTldezN9KSooXFxcXC5bMC05XXswLDJ9KT98WzEtOV17MX1bMC05XXswLH0oXFxcXC5bMC05XXswLDJ9KT98MChcXFxcLlswLTldezAsMn0pP3woXFxcXC5bMC05XXsxLDJ9KT8pJFwiO1xuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCggcmVnZXggKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IHJlZ2V4LnRlc3QoIHZhbHVlICk7XG5cbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBjdXJyZW5jeVwiICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJkYXRlRkFcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eWzEtNF1cXGR7M31cXC8oKDA/WzEtNl1cXC8oKDNbMC0xXSl8KFsxLTJdWzAtOV0pfCgwP1sxLTldKSkpfCgoMVswLTJdfCgwP1s3LTldKSlcXC8oMzB8KFsxLTJdWzAtOV0pfCgwP1sxLTldKSkpKSQvLnRlc3QoIHZhbHVlICk7XG59LCAkLnZhbGlkYXRvci5tZXNzYWdlcy5kYXRlICk7XG5cbi8qKlxuICogUmV0dXJuIHRydWUsIGlmIHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGRhdGUsIGFsc28gbWFraW5nIHRoaXMgZm9ybWFsIGNoZWNrIGRkL21tL3l5eXkuXG4gKlxuICogQGV4YW1wbGUgJC52YWxpZGF0b3IubWV0aG9kcy5kYXRlKFwiMDEvMDEvMTkwMFwiKVxuICogQHJlc3VsdCB0cnVlXG4gKlxuICogQGV4YW1wbGUgJC52YWxpZGF0b3IubWV0aG9kcy5kYXRlKFwiMDEvMTMvMTk5MFwiKVxuICogQHJlc3VsdCBmYWxzZVxuICpcbiAqIEBleGFtcGxlICQudmFsaWRhdG9yLm1ldGhvZHMuZGF0ZShcIjAxLjAxLjE5MDBcIilcbiAqIEByZXN1bHQgZmFsc2VcbiAqXG4gKiBAZXhhbXBsZSA8aW5wdXQgbmFtZT1cInBpcHBvXCIgY2xhc3M9XCJ7ZGF0ZUlUQTp0cnVlfVwiIC8+XG4gKiBAZGVzYyBEZWNsYXJlcyBhbiBvcHRpb25hbCBpbnB1dCBlbGVtZW50IHdob3NlIHZhbHVlIG11c3QgYmUgYSB2YWxpZCBkYXRlLlxuICpcbiAqIEBuYW1lICQudmFsaWRhdG9yLm1ldGhvZHMuZGF0ZUlUQVxuICogQHR5cGUgQm9vbGVhblxuICogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcbiAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImRhdGVJVEFcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHR2YXIgY2hlY2sgPSBmYWxzZSxcblx0XHRyZSA9IC9eXFxkezEsMn1cXC9cXGR7MSwyfVxcL1xcZHs0fSQvLFxuXHRcdGFkYXRhLCBnZywgbW0sIGFhYWEsIHhkYXRhO1xuXHRpZiAoIHJlLnRlc3QoIHZhbHVlICkgKSB7XG5cdFx0YWRhdGEgPSB2YWx1ZS5zcGxpdCggXCIvXCIgKTtcblx0XHRnZyA9IHBhcnNlSW50KCBhZGF0YVsgMCBdLCAxMCApO1xuXHRcdG1tID0gcGFyc2VJbnQoIGFkYXRhWyAxIF0sIDEwICk7XG5cdFx0YWFhYSA9IHBhcnNlSW50KCBhZGF0YVsgMiBdLCAxMCApO1xuXHRcdHhkYXRhID0gbmV3IERhdGUoIERhdGUuVVRDKCBhYWFhLCBtbSAtIDEsIGdnLCAxMiwgMCwgMCwgMCApICk7XG5cdFx0aWYgKCAoIHhkYXRhLmdldFVUQ0Z1bGxZZWFyKCkgPT09IGFhYWEgKSAmJiAoIHhkYXRhLmdldFVUQ01vbnRoKCkgPT09IG1tIC0gMSApICYmICggeGRhdGEuZ2V0VVRDRGF0ZSgpID09PSBnZyApICkge1xuXHRcdFx0Y2hlY2sgPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaGVjayA9IGZhbHNlO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjaGVjayA9IGZhbHNlO1xuXHR9XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgY2hlY2s7XG59LCAkLnZhbGlkYXRvci5tZXNzYWdlcy5kYXRlICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJkYXRlTkxcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKDA/WzEtOV18WzEyXVxcZHwzWzAxXSlbXFwuXFwvXFwtXSgwP1sxLTldfDFbMDEyXSlbXFwuXFwvXFwtXShbMTJdXFxkKT8oXFxkXFxkKSQvLnRlc3QoIHZhbHVlICk7XG59LCAkLnZhbGlkYXRvci5tZXNzYWdlcy5kYXRlICk7XG5cbi8vIE9sZGVyIFwiYWNjZXB0XCIgZmlsZSBleHRlbnNpb24gbWV0aG9kLiBPbGQgZG9jczogaHR0cDovL2RvY3MuanF1ZXJ5LmNvbS9QbHVnaW5zL1ZhbGlkYXRpb24vTWV0aG9kcy9hY2NlcHRcbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJleHRlbnNpb25cIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0cGFyYW0gPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgPyBwYXJhbS5yZXBsYWNlKCAvLC9nLCBcInxcIiApIDogXCJwbmd8anBlP2d8Z2lmXCI7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUubWF0Y2goIG5ldyBSZWdFeHAoIFwiXFxcXC4oXCIgKyBwYXJhbSArIFwiKSRcIiwgXCJpXCIgKSApO1xufSwgJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIHdpdGggYSB2YWxpZCBleHRlbnNpb24uXCIgKSApO1xuXG4vKipcbiAqIER1dGNoIGdpcm8gYWNjb3VudCBudW1iZXJzIChub3QgYmFuayBudW1iZXJzKSBoYXZlIG1heCA3IGRpZ2l0c1xuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiZ2lyb2FjY291bnROTFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bMC05XXsxLDd9JC8udGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBnaXJvIGFjY291bnQgbnVtYmVyXCIgKTtcblxuLyoqXG4gKiBJQkFOIGlzIHRoZSBpbnRlcm5hdGlvbmFsIGJhbmsgYWNjb3VudCBudW1iZXIuXG4gKiBJdCBoYXMgYSBjb3VudHJ5IC0gc3BlY2lmaWMgZm9ybWF0LCB0aGF0IGlzIGNoZWNrZWQgaGVyZSB0b29cbiAqXG4gKiBWYWxpZGF0aW9uIGlzIGNhc2UtaW5zZW5zaXRpdmUuIFBsZWFzZSBtYWtlIHN1cmUgdG8gbm9ybWFsaXplIGlucHV0IHlvdXJzZWxmLlxuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwiaWJhblwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cblx0Ly8gU29tZSBxdWljayBzaW1wbGUgdGVzdHMgdG8gcHJldmVudCBuZWVkbGVzcyB3b3JrXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIHNwYWNlcyBhbmQgdG8gdXBwZXIgY2FzZVxuXHR2YXIgaWJhbiA9IHZhbHVlLnJlcGxhY2UoIC8gL2csIFwiXCIgKS50b1VwcGVyQ2FzZSgpLFxuXHRcdGliYW5jaGVja2RpZ2l0cyA9IFwiXCIsXG5cdFx0bGVhZGluZ1plcm9lcyA9IHRydWUsXG5cdFx0Y1Jlc3QgPSBcIlwiLFxuXHRcdGNPcGVyYXRvciA9IFwiXCIsXG5cdFx0Y291bnRyeWNvZGUsIGliYW5jaGVjaywgY2hhckF0LCBjQ2hhciwgYmJhbnBhdHRlcm4sIGJiYW5jb3VudHJ5cGF0dGVybnMsIGliYW5yZWdleHAsIGksIHA7XG5cblx0Ly8gQ2hlY2sgZm9yIElCQU4gY29kZSBsZW5ndGguXG5cdC8vIEl0IGNvbnRhaW5zOlxuXHQvLyBjb3VudHJ5IGNvZGUgSVNPIDMxNjYtMSAtIHR3byBsZXR0ZXJzLFxuXHQvLyB0d28gY2hlY2sgZGlnaXRzLFxuXHQvLyBCYXNpYyBCYW5rIEFjY291bnQgTnVtYmVyIChCQkFOKSAtIHVwIHRvIDMwIGNoYXJzXG5cdHZhciBtaW5pbWFsSUJBTmxlbmd0aCA9IDU7XG5cdGlmICggaWJhbi5sZW5ndGggPCBtaW5pbWFsSUJBTmxlbmd0aCApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBDaGVjayB0aGUgY291bnRyeSBjb2RlIGFuZCBmaW5kIHRoZSBjb3VudHJ5IHNwZWNpZmljIGZvcm1hdFxuXHRjb3VudHJ5Y29kZSA9IGliYW4uc3Vic3RyaW5nKCAwLCAyICk7XG5cdGJiYW5jb3VudHJ5cGF0dGVybnMgPSB7XG5cdFx0XCJBTFwiOiBcIlxcXFxkezh9W1xcXFxkQS1aXXsxNn1cIixcblx0XHRcIkFEXCI6IFwiXFxcXGR7OH1bXFxcXGRBLVpdezEyfVwiLFxuXHRcdFwiQVRcIjogXCJcXFxcZHsxNn1cIixcblx0XHRcIkFaXCI6IFwiW1xcXFxkQS1aXXs0fVxcXFxkezIwfVwiLFxuXHRcdFwiQkVcIjogXCJcXFxcZHsxMn1cIixcblx0XHRcIkJIXCI6IFwiW0EtWl17NH1bXFxcXGRBLVpdezE0fVwiLFxuXHRcdFwiQkFcIjogXCJcXFxcZHsxNn1cIixcblx0XHRcIkJSXCI6IFwiXFxcXGR7MjN9W0EtWl1bXFxcXGRBLVpdXCIsXG5cdFx0XCJCR1wiOiBcIltBLVpdezR9XFxcXGR7Nn1bXFxcXGRBLVpdezh9XCIsXG5cdFx0XCJDUlwiOiBcIlxcXFxkezE3fVwiLFxuXHRcdFwiSFJcIjogXCJcXFxcZHsxN31cIixcblx0XHRcIkNZXCI6IFwiXFxcXGR7OH1bXFxcXGRBLVpdezE2fVwiLFxuXHRcdFwiQ1pcIjogXCJcXFxcZHsyMH1cIixcblx0XHRcIkRLXCI6IFwiXFxcXGR7MTR9XCIsXG5cdFx0XCJET1wiOiBcIltBLVpdezR9XFxcXGR7MjB9XCIsXG5cdFx0XCJFRVwiOiBcIlxcXFxkezE2fVwiLFxuXHRcdFwiRk9cIjogXCJcXFxcZHsxNH1cIixcblx0XHRcIkZJXCI6IFwiXFxcXGR7MTR9XCIsXG5cdFx0XCJGUlwiOiBcIlxcXFxkezEwfVtcXFxcZEEtWl17MTF9XFxcXGR7Mn1cIixcblx0XHRcIkdFXCI6IFwiW1xcXFxkQS1aXXsyfVxcXFxkezE2fVwiLFxuXHRcdFwiREVcIjogXCJcXFxcZHsxOH1cIixcblx0XHRcIkdJXCI6IFwiW0EtWl17NH1bXFxcXGRBLVpdezE1fVwiLFxuXHRcdFwiR1JcIjogXCJcXFxcZHs3fVtcXFxcZEEtWl17MTZ9XCIsXG5cdFx0XCJHTFwiOiBcIlxcXFxkezE0fVwiLFxuXHRcdFwiR1RcIjogXCJbXFxcXGRBLVpdezR9W1xcXFxkQS1aXXsyMH1cIixcblx0XHRcIkhVXCI6IFwiXFxcXGR7MjR9XCIsXG5cdFx0XCJJU1wiOiBcIlxcXFxkezIyfVwiLFxuXHRcdFwiSUVcIjogXCJbXFxcXGRBLVpdezR9XFxcXGR7MTR9XCIsXG5cdFx0XCJJTFwiOiBcIlxcXFxkezE5fVwiLFxuXHRcdFwiSVRcIjogXCJbQS1aXVxcXFxkezEwfVtcXFxcZEEtWl17MTJ9XCIsXG5cdFx0XCJLWlwiOiBcIlxcXFxkezN9W1xcXFxkQS1aXXsxM31cIixcblx0XHRcIktXXCI6IFwiW0EtWl17NH1bXFxcXGRBLVpdezIyfVwiLFxuXHRcdFwiTFZcIjogXCJbQS1aXXs0fVtcXFxcZEEtWl17MTN9XCIsXG5cdFx0XCJMQlwiOiBcIlxcXFxkezR9W1xcXFxkQS1aXXsyMH1cIixcblx0XHRcIkxJXCI6IFwiXFxcXGR7NX1bXFxcXGRBLVpdezEyfVwiLFxuXHRcdFwiTFRcIjogXCJcXFxcZHsxNn1cIixcblx0XHRcIkxVXCI6IFwiXFxcXGR7M31bXFxcXGRBLVpdezEzfVwiLFxuXHRcdFwiTUtcIjogXCJcXFxcZHszfVtcXFxcZEEtWl17MTB9XFxcXGR7Mn1cIixcblx0XHRcIk1UXCI6IFwiW0EtWl17NH1cXFxcZHs1fVtcXFxcZEEtWl17MTh9XCIsXG5cdFx0XCJNUlwiOiBcIlxcXFxkezIzfVwiLFxuXHRcdFwiTVVcIjogXCJbQS1aXXs0fVxcXFxkezE5fVtBLVpdezN9XCIsXG5cdFx0XCJNQ1wiOiBcIlxcXFxkezEwfVtcXFxcZEEtWl17MTF9XFxcXGR7Mn1cIixcblx0XHRcIk1EXCI6IFwiW1xcXFxkQS1aXXsyfVxcXFxkezE4fVwiLFxuXHRcdFwiTUVcIjogXCJcXFxcZHsxOH1cIixcblx0XHRcIk5MXCI6IFwiW0EtWl17NH1cXFxcZHsxMH1cIixcblx0XHRcIk5PXCI6IFwiXFxcXGR7MTF9XCIsXG5cdFx0XCJQS1wiOiBcIltcXFxcZEEtWl17NH1cXFxcZHsxNn1cIixcblx0XHRcIlBTXCI6IFwiW1xcXFxkQS1aXXs0fVxcXFxkezIxfVwiLFxuXHRcdFwiUExcIjogXCJcXFxcZHsyNH1cIixcblx0XHRcIlBUXCI6IFwiXFxcXGR7MjF9XCIsXG5cdFx0XCJST1wiOiBcIltBLVpdezR9W1xcXFxkQS1aXXsxNn1cIixcblx0XHRcIlNNXCI6IFwiW0EtWl1cXFxcZHsxMH1bXFxcXGRBLVpdezEyfVwiLFxuXHRcdFwiU0FcIjogXCJcXFxcZHsyfVtcXFxcZEEtWl17MTh9XCIsXG5cdFx0XCJSU1wiOiBcIlxcXFxkezE4fVwiLFxuXHRcdFwiU0tcIjogXCJcXFxcZHsyMH1cIixcblx0XHRcIlNJXCI6IFwiXFxcXGR7MTV9XCIsXG5cdFx0XCJFU1wiOiBcIlxcXFxkezIwfVwiLFxuXHRcdFwiU0VcIjogXCJcXFxcZHsyMH1cIixcblx0XHRcIkNIXCI6IFwiXFxcXGR7NX1bXFxcXGRBLVpdezEyfVwiLFxuXHRcdFwiVE5cIjogXCJcXFxcZHsyMH1cIixcblx0XHRcIlRSXCI6IFwiXFxcXGR7NX1bXFxcXGRBLVpdezE3fVwiLFxuXHRcdFwiQUVcIjogXCJcXFxcZHszfVxcXFxkezE2fVwiLFxuXHRcdFwiR0JcIjogXCJbQS1aXXs0fVxcXFxkezE0fVwiLFxuXHRcdFwiVkdcIjogXCJbXFxcXGRBLVpdezR9XFxcXGR7MTZ9XCJcblx0fTtcblxuXHRiYmFucGF0dGVybiA9IGJiYW5jb3VudHJ5cGF0dGVybnNbIGNvdW50cnljb2RlIF07XG5cblx0Ly8gQXMgbmV3IGNvdW50cmllcyB3aWxsIHN0YXJ0IHVzaW5nIElCQU4gaW4gdGhlXG5cdC8vIGZ1dHVyZSwgd2Ugb25seSBjaGVjayBpZiB0aGUgY291bnRyeWNvZGUgaXMga25vd24uXG5cdC8vIFRoaXMgcHJldmVudHMgZmFsc2UgbmVnYXRpdmVzLCB3aGlsZSBhbG1vc3QgYWxsXG5cdC8vIGZhbHNlIHBvc2l0aXZlcyBpbnRyb2R1Y2VkIGJ5IHRoaXMsIHdpbGwgYmUgY2F1Z2h0XG5cdC8vIGJ5IHRoZSBjaGVja3N1bSB2YWxpZGF0aW9uIGJlbG93IGFueXdheS5cblx0Ly8gU3RyaWN0IGNoZWNraW5nIHNob3VsZCByZXR1cm4gRkFMU0UgZm9yIHVua25vd25cblx0Ly8gY291bnRyaWVzLlxuXHRpZiAoIHR5cGVvZiBiYmFucGF0dGVybiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRpYmFucmVnZXhwID0gbmV3IFJlZ0V4cCggXCJeW0EtWl17Mn1cXFxcZHsyfVwiICsgYmJhbnBhdHRlcm4gKyBcIiRcIiwgXCJcIiApO1xuXHRcdGlmICggISggaWJhbnJlZ2V4cC50ZXN0KCBpYmFuICkgKSApIHtcblx0XHRcdHJldHVybiBmYWxzZTsgLy8gSW52YWxpZCBjb3VudHJ5IHNwZWNpZmljIGZvcm1hdFxuXHRcdH1cblx0fVxuXG5cdC8vIE5vdyBjaGVjayB0aGUgY2hlY2tzdW0sIGZpcnN0IGNvbnZlcnQgdG8gZGlnaXRzXG5cdGliYW5jaGVjayA9IGliYW4uc3Vic3RyaW5nKCA0LCBpYmFuLmxlbmd0aCApICsgaWJhbi5zdWJzdHJpbmcoIDAsIDQgKTtcblx0Zm9yICggaSA9IDA7IGkgPCBpYmFuY2hlY2subGVuZ3RoOyBpKysgKSB7XG5cdFx0Y2hhckF0ID0gaWJhbmNoZWNrLmNoYXJBdCggaSApO1xuXHRcdGlmICggY2hhckF0ICE9PSBcIjBcIiApIHtcblx0XHRcdGxlYWRpbmdaZXJvZXMgPSBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKCAhbGVhZGluZ1plcm9lcyApIHtcblx0XHRcdGliYW5jaGVja2RpZ2l0cyArPSBcIjAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiLmluZGV4T2YoIGNoYXJBdCApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENhbGN1bGF0ZSB0aGUgcmVzdWx0IG9mOiBpYmFuY2hlY2tkaWdpdHMgJSA5N1xuXHRmb3IgKCBwID0gMDsgcCA8IGliYW5jaGVja2RpZ2l0cy5sZW5ndGg7IHArKyApIHtcblx0XHRjQ2hhciA9IGliYW5jaGVja2RpZ2l0cy5jaGFyQXQoIHAgKTtcblx0XHRjT3BlcmF0b3IgPSBcIlwiICsgY1Jlc3QgKyBcIlwiICsgY0NoYXI7XG5cdFx0Y1Jlc3QgPSBjT3BlcmF0b3IgJSA5Nztcblx0fVxuXHRyZXR1cm4gY1Jlc3QgPT09IDE7XG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgSUJBTlwiICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJpbnRlZ2VyXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXi0/XFxkKyQvLnRlc3QoIHZhbHVlICk7XG59LCBcIkEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgbm9uLWRlY2ltYWwgbnVtYmVyIHBsZWFzZVwiICk7XG5cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJpcHY0XCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKDI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPylcXC4oMjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KVxcLigyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pJC9pLnRlc3QoIHZhbHVlICk7XG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIElQIHY0IGFkZHJlc3MuXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcImlwdjZcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKCgoWzAtOUEtRmEtZl17MSw0fTopezd9WzAtOUEtRmEtZl17MSw0fSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Nn06WzAtOUEtRmEtZl17MSw0fSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NX06KFswLTlBLUZhLWZdezEsNH06KT9bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXs0fTooWzAtOUEtRmEtZl17MSw0fTopezAsMn1bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXszfTooWzAtOUEtRmEtZl17MSw0fTopezAsM31bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXsyfTooWzAtOUEtRmEtZl17MSw0fTopezAsNH1bMC05QS1GYS1mXXsxLDR9KXwoKFswLTlBLUZhLWZdezEsNH06KXs2fSgoXFxiKCgyNVswLTVdKXwoMVxcZHsyfSl8KDJbMC00XVxcZCl8KFxcZHsxLDJ9KSlcXGIpXFwuKXszfShcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYikpfCgoWzAtOUEtRmEtZl17MSw0fTopezAsNX06KChcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYilcXC4pezN9KFxcYigoMjVbMC01XSl8KDFcXGR7Mn0pfCgyWzAtNF1cXGQpfChcXGR7MSwyfSkpXFxiKSl8KDo6KFswLTlBLUZhLWZdezEsNH06KXswLDV9KChcXGIoKDI1WzAtNV0pfCgxXFxkezJ9KXwoMlswLTRdXFxkKXwoXFxkezEsMn0pKVxcYilcXC4pezN9KFxcYigoMjVbMC01XSl8KDFcXGR7Mn0pfCgyWzAtNF1cXGQpfChcXGR7MSwyfSkpXFxiKSl8KFswLTlBLUZhLWZdezEsNH06OihbMC05QS1GYS1mXXsxLDR9Oil7MCw1fVswLTlBLUZhLWZdezEsNH0pfCg6OihbMC05QS1GYS1mXXsxLDR9Oil7MCw2fVswLTlBLUZhLWZdezEsNH0pfCgoWzAtOUEtRmEtZl17MSw0fTopezEsN306KSkkL2kudGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgSVAgdjYgYWRkcmVzcy5cIiApO1xuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibGV0dGVyc29ubHlcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eW2Etel0rJC9pLnRlc3QoIHZhbHVlICk7XG59LCBcIkxldHRlcnMgb25seSBwbGVhc2VcIiApO1xuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibGV0dGVyc3dpdGhiYXNpY3B1bmNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eW2EtelxcLS4sKCknXCJcXHNdKyQvaS50ZXN0KCB2YWx1ZSApO1xufSwgXCJMZXR0ZXJzIG9yIHB1bmN0dWF0aW9uIG9ubHkgcGxlYXNlXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm1vYmlsZU5MXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigoXFwrfDAwKFxcc3xcXHM/XFwtXFxzPyk/KTMxKFxcc3xcXHM/XFwtXFxzPyk/KFxcKDBcXClbXFwtXFxzXT8pP3wwKTYoKFxcc3xcXHM/XFwtXFxzPyk/WzAtOV0pezh9JC8udGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBtb2JpbGUgbnVtYmVyXCIgKTtcblxuLyogRm9yIFVLIHBob25lIGZ1bmN0aW9ucywgZG8gdGhlIGZvbGxvd2luZyBzZXJ2ZXIgc2lkZSBwcm9jZXNzaW5nOlxuICogQ29tcGFyZSBvcmlnaW5hbCBpbnB1dCB3aXRoIHRoaXMgUmVnRXggcGF0dGVybjpcbiAqIF5cXCg/KD86KD86MDBcXCk/W1xcc1xcLV0/XFwoP3xcXCspKDQ0KVxcKT9bXFxzXFwtXT9cXCg/KD86MFxcKT9bXFxzXFwtXT9cXCg/KT98MCkoWzEtOV1cXGR7MSw0fVxcKT9bXFxzXFxkXFwtXSspJFxuICogRXh0cmFjdCAkMSBhbmQgc2V0ICRwcmVmaXggdG8gJys0NDxzcGFjZT4nIGlmICQxIGlzICc0NCcsIG90aGVyd2lzZSBzZXQgJHByZWZpeCB0byAnMCdcbiAqIEV4dHJhY3QgJDIgYW5kIHJlbW92ZSBoeXBoZW5zLCBzcGFjZXMgYW5kIHBhcmVudGhlc2VzLiBQaG9uZSBudW1iZXIgaXMgY29tYmluZWQgJHByZWZpeCBhbmQgJDIuXG4gKiBBIG51bWJlciBvZiB2ZXJ5IGRldGFpbGVkIEdCIHRlbGVwaG9uZSBudW1iZXIgUmVnRXggcGF0dGVybnMgY2FuIGFsc28gYmUgZm91bmQgYXQ6XG4gKiBodHRwOi8vd3d3LmFhLWFzdGVyaXNrLm9yZy51ay9pbmRleC5waHAvUmVndWxhcl9FeHByZXNzaW9uc19mb3JfVmFsaWRhdGluZ19hbmRfRm9ybWF0dGluZ19HQl9UZWxlcGhvbmVfTnVtYmVyc1xuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibW9iaWxlVUtcIiwgZnVuY3Rpb24oIHBob25lX251bWJlciwgZWxlbWVudCApIHtcblx0cGhvbmVfbnVtYmVyID0gcGhvbmVfbnVtYmVyLnJlcGxhY2UoIC9cXCh8XFwpfFxccyt8LS9nLCBcIlwiICk7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcblx0XHRwaG9uZV9udW1iZXIubWF0Y2goIC9eKD86KD86KD86MDBcXHM/fFxcKyk0NFxccz98MCk3KD86WzEzNDU3ODldXFxkezJ9fDYyNClcXHM/XFxkezN9XFxzP1xcZHszfSkkLyApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIG1vYmlsZSBudW1iZXJcIiApO1xuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibmV0bWFza1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXigyNTR8MjUyfDI0OHwyNDB8MjI0fDE5MnwxMjgpXFwuMFxcLjBcXC4wfDI1NVxcLigyNTR8MjUyfDI0OHwyNDB8MjI0fDE5MnwxMjh8MClcXC4wXFwuMHwyNTVcXC4yNTVcXC4oMjU0fDI1MnwyNDh8MjQwfDIyNHwxOTJ8MTI4fDApXFwuMHwyNTVcXC4yNTVcXC4yNTVcXC4oMjU0fDI1MnwyNDh8MjQwfDIyNHwxOTJ8MTI4fDApL2kudGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgbmV0bWFzay5cIiApO1xuXG4vKlxuICogVGhlIE5JRSAoTsO6bWVybyBkZSBJZGVudGlmaWNhY2nDs24gZGUgRXh0cmFuamVybykgaXMgYSBTcGFuaXNoIHRheCBpZGVudGlmaWNhdGlvbiBudW1iZXIgYXNzaWduZWQgYnkgdGhlIFNwYW5pc2hcbiAqIGF1dGhvcml0aWVzIHRvIGFueSBmb3JlaWduZXIuXG4gKlxuICogVGhlIE5JRSBpcyB0aGUgZXF1aXZhbGVudCBvZiBhIFNwYW5pYXJkcyBOw7ptZXJvIGRlIElkZW50aWZpY2FjacOzbiBGaXNjYWwgKE5JRikgd2hpY2ggc2VydmVzIGFzIGEgZmlzY2FsXG4gKiBpZGVudGlmaWNhdGlvbiBudW1iZXIuIFRoZSBDSUYgbnVtYmVyIChDZXJ0aWZpY2FkbyBkZSBJZGVudGlmaWNhY2nDs24gRmlzY2FsKSBpcyBlcXVpdmFsZW50IHRvIHRoZSBOSUYsIGJ1dCBhcHBsaWVzIHRvXG4gKiBjb21wYW5pZXMgcmF0aGVyIHRoYW4gaW5kaXZpZHVhbHMuIFRoZSBOSUUgY29uc2lzdHMgb2YgYW4gJ1gnIG9yICdZJyBmb2xsb3dlZCBieSA3IG9yIDggZGlnaXRzIHRoZW4gYW5vdGhlciBsZXR0ZXIuXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJuaWVFU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dmFyIG5pZVJlZ0V4ID0gbmV3IFJlZ0V4cCggL15bTVhZWl17MX1bMC05XXs3LDh9W1RSV0FHTVlGUERYQk5KWlNRVkhMQ0tFVF17MX0kL2dpICk7XG5cdHZhciB2YWxpZENoYXJzID0gXCJUUldBR01ZRlBEWEJOSlpTUVZITENLRVRcIixcblx0XHRsZXR0ZXIgPSB2YWx1ZS5zdWJzdHIoIHZhbHVlLmxlbmd0aCAtIDEgKS50b1VwcGVyQ2FzZSgpLFxuXHRcdG51bWJlcjtcblxuXHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcblxuXHQvLyBRdWljayBmb3JtYXQgdGVzdFxuXHRpZiAoIHZhbHVlLmxlbmd0aCA+IDEwIHx8IHZhbHVlLmxlbmd0aCA8IDkgfHwgIW5pZVJlZ0V4LnRlc3QoIHZhbHVlICkgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gWCBtZWFucyBzYW1lIG51bWJlclxuXHQvLyBZIG1lYW5zIG51bWJlciArIDEwMDAwMDAwXG5cdC8vIFogbWVhbnMgbnVtYmVyICsgMjAwMDAwMDBcblx0dmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCAvXltYXS8sIFwiMFwiIClcblx0XHQucmVwbGFjZSggL15bWV0vLCBcIjFcIiApXG5cdFx0LnJlcGxhY2UoIC9eW1pdLywgXCIyXCIgKTtcblxuXHRudW1iZXIgPSB2YWx1ZS5sZW5ndGggPT09IDkgPyB2YWx1ZS5zdWJzdHIoIDAsIDggKSA6IHZhbHVlLnN1YnN0ciggMCwgOSApO1xuXG5cdHJldHVybiB2YWxpZENoYXJzLmNoYXJBdCggcGFyc2VJbnQoIG51bWJlciwgMTAgKSAlIDIzICkgPT09IGxldHRlcjtcblxufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIE5JRSBudW1iZXIuXCIgKTtcblxuLypcbiAqIFRoZSBOw7ptZXJvIGRlIElkZW50aWZpY2FjacOzbiBGaXNjYWwgKCBOSUYgKSBpcyB0aGUgd2F5IHRheCBpZGVudGlmaWNhdGlvbiB1c2VkIGluIFNwYWluIGZvciBpbmRpdmlkdWFsc1xuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibmlmRVNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHZhbHVlID0gdmFsdWUudG9VcHBlckNhc2UoKTtcblxuXHQvLyBCYXNpYyBmb3JtYXQgdGVzdFxuXHRpZiAoICF2YWx1ZS5tYXRjaCggXCIoKF5bQS1aXXsxfVswLTldezd9W0EtWjAtOV17MX0kfF5bVF17MX1bQS1aMC05XXs4fSQpfF5bMC05XXs4fVtBLVpdezF9JClcIiApICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIFRlc3QgTklGXG5cdGlmICggL15bMC05XXs4fVtBLVpdezF9JC8udGVzdCggdmFsdWUgKSApIHtcblx0XHRyZXR1cm4gKCBcIlRSV0FHTVlGUERYQk5KWlNRVkhMQ0tFXCIuY2hhckF0KCB2YWx1ZS5zdWJzdHJpbmcoIDgsIDAgKSAlIDIzICkgPT09IHZhbHVlLmNoYXJBdCggOCApICk7XG5cdH1cblxuXHQvLyBUZXN0IHNwZWNpYWxzIE5JRiAoc3RhcnRzIHdpdGggSywgTCBvciBNKVxuXHRpZiAoIC9eW0tMTV17MX0vLnRlc3QoIHZhbHVlICkgKSB7XG5cdFx0cmV0dXJuICggdmFsdWVbIDggXSA9PT0gXCJUUldBR01ZRlBEWEJOSlpTUVZITENLRVwiLmNoYXJBdCggdmFsdWUuc3Vic3RyaW5nKCA4LCAxICkgJSAyMyApICk7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG5cbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBOSUYgbnVtYmVyLlwiICk7XG5cbi8qXG4gKiBOdW1lciBpZGVudHlmaWthY2ppIHBvZGF0a293ZWogKCBOSVAgKSBpcyB0aGUgd2F5IHRheCBpZGVudGlmaWNhdGlvbiB1c2VkIGluIFBvbGFuZCBmb3IgY29tcGFuaWVzXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJuaXBQTFwiLCBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhbHVlID0gdmFsdWUucmVwbGFjZSggL1teMC05XS9nLCBcIlwiICk7XG5cblx0aWYgKCB2YWx1ZS5sZW5ndGggIT09IDEwICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBhcnJTdGVwcyA9IFsgNiwgNSwgNywgMiwgMywgNCwgNSwgNiwgNyBdO1xuXHR2YXIgaW50U3VtID0gMDtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgOTsgaSsrICkge1xuXHRcdGludFN1bSArPSBhcnJTdGVwc1sgaSBdICogdmFsdWVbIGkgXTtcblx0fVxuXHR2YXIgaW50MiA9IGludFN1bSAlIDExO1xuXHR2YXIgaW50Q29udHJvbE5yID0gKCBpbnQyID09PSAxMCApID8gMCA6IGludDI7XG5cblx0cmV0dXJuICggaW50Q29udHJvbE5yID09PSBwYXJzZUludCggdmFsdWVbIDkgXSwgMTAgKSApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIE5JUCBudW1iZXIuXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcIm5vdEVxdWFsVG9cIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAhJC52YWxpZGF0b3IubWV0aG9kcy5lcXVhbFRvLmNhbGwoIHRoaXMsIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApO1xufSwgXCJQbGVhc2UgZW50ZXIgYSBkaWZmZXJlbnQgdmFsdWUsIHZhbHVlcyBtdXN0IG5vdCBiZSB0aGUgc2FtZS5cIiApO1xuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwibm93aGl0ZXNwYWNlXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlxcUyskL2kudGVzdCggdmFsdWUgKTtcbn0sIFwiTm8gd2hpdGUgc3BhY2UgcGxlYXNlXCIgKTtcblxuLyoqXG4qIFJldHVybiB0cnVlIGlmIHRoZSBmaWVsZCB2YWx1ZSBtYXRjaGVzIHRoZSBnaXZlbiBmb3JtYXQgUmVnRXhwXG4qXG4qIEBleGFtcGxlICQudmFsaWRhdG9yLm1ldGhvZHMucGF0dGVybihcIkFSMTAwNFwiLGVsZW1lbnQsL15BUlxcZHs0fSQvKVxuKiBAcmVzdWx0IHRydWVcbipcbiogQGV4YW1wbGUgJC52YWxpZGF0b3IubWV0aG9kcy5wYXR0ZXJuKFwiQlIxMDA0XCIsZWxlbWVudCwvXkFSXFxkezR9JC8pXG4qIEByZXN1bHQgZmFsc2VcbipcbiogQG5hbWUgJC52YWxpZGF0b3IubWV0aG9kcy5wYXR0ZXJuXG4qIEB0eXBlIEJvb2xlYW5cbiogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcbiovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicGF0dGVyblwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXHRpZiAoIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZiAoIHR5cGVvZiBwYXJhbSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRwYXJhbSA9IG5ldyBSZWdFeHAoIFwiXig/OlwiICsgcGFyYW0gKyBcIikkXCIgKTtcblx0fVxuXHRyZXR1cm4gcGFyYW0udGVzdCggdmFsdWUgKTtcbn0sIFwiSW52YWxpZCBmb3JtYXQuXCIgKTtcblxuLyoqXG4gKiBEdXRjaCBwaG9uZSBudW1iZXJzIGhhdmUgMTAgZGlnaXRzIChvciAxMSBhbmQgc3RhcnQgd2l0aCArMzEpLlxuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicGhvbmVOTFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oKFxcK3wwMChcXHN8XFxzP1xcLVxccz8pPykzMShcXHN8XFxzP1xcLVxccz8pPyhcXCgwXFwpW1xcLVxcc10/KT98MClbMS05XSgoXFxzfFxccz9cXC1cXHM/KT9bMC05XSl7OH0kLy50ZXN0KCB2YWx1ZSApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBob25lIG51bWJlci5cIiApO1xuXG4vKiBGb3IgVUsgcGhvbmUgZnVuY3Rpb25zLCBkbyB0aGUgZm9sbG93aW5nIHNlcnZlciBzaWRlIHByb2Nlc3Npbmc6XG4gKiBDb21wYXJlIG9yaWdpbmFsIGlucHV0IHdpdGggdGhpcyBSZWdFeCBwYXR0ZXJuOlxuICogXlxcKD8oPzooPzowMFxcKT9bXFxzXFwtXT9cXCg/fFxcKykoNDQpXFwpP1tcXHNcXC1dP1xcKD8oPzowXFwpP1tcXHNcXC1dP1xcKD8pP3wwKShbMS05XVxcZHsxLDR9XFwpP1tcXHNcXGRcXC1dKykkXG4gKiBFeHRyYWN0ICQxIGFuZCBzZXQgJHByZWZpeCB0byAnKzQ0PHNwYWNlPicgaWYgJDEgaXMgJzQ0Jywgb3RoZXJ3aXNlIHNldCAkcHJlZml4IHRvICcwJ1xuICogRXh0cmFjdCAkMiBhbmQgcmVtb3ZlIGh5cGhlbnMsIHNwYWNlcyBhbmQgcGFyZW50aGVzZXMuIFBob25lIG51bWJlciBpcyBjb21iaW5lZCAkcHJlZml4IGFuZCAkMi5cbiAqIEEgbnVtYmVyIG9mIHZlcnkgZGV0YWlsZWQgR0IgdGVsZXBob25lIG51bWJlciBSZWdFeCBwYXR0ZXJucyBjYW4gYWxzbyBiZSBmb3VuZCBhdDpcbiAqIGh0dHA6Ly93d3cuYWEtYXN0ZXJpc2sub3JnLnVrL2luZGV4LnBocC9SZWd1bGFyX0V4cHJlc3Npb25zX2Zvcl9WYWxpZGF0aW5nX2FuZF9Gb3JtYXR0aW5nX0dCX1RlbGVwaG9uZV9OdW1iZXJzXG4gKi9cblxuLy8gTWF0Y2hlcyBVSyBsYW5kbGluZSArIG1vYmlsZSwgYWNjZXB0aW5nIG9ubHkgMDEtMyBmb3IgbGFuZGxpbmUgb3IgMDcgZm9yIG1vYmlsZSB0byBleGNsdWRlIG1hbnkgcHJlbWl1bSBudW1iZXJzXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicGhvbmVzVUtcIiwgZnVuY3Rpb24oIHBob25lX251bWJlciwgZWxlbWVudCApIHtcblx0cGhvbmVfbnVtYmVyID0gcGhvbmVfbnVtYmVyLnJlcGxhY2UoIC9cXCh8XFwpfFxccyt8LS9nLCBcIlwiICk7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcblx0XHRwaG9uZV9udW1iZXIubWF0Y2goIC9eKD86KD86KD86MDBcXHM/fFxcKyk0NFxccz98MCkoPzoxXFxkezgsOX18WzIzXVxcZHs5fXw3KD86WzEzNDU3ODldXFxkezh9fDYyNFxcZHs2fSkpKSQvICk7XG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgdWsgcGhvbmUgbnVtYmVyXCIgKTtcblxuLyogRm9yIFVLIHBob25lIGZ1bmN0aW9ucywgZG8gdGhlIGZvbGxvd2luZyBzZXJ2ZXIgc2lkZSBwcm9jZXNzaW5nOlxuICogQ29tcGFyZSBvcmlnaW5hbCBpbnB1dCB3aXRoIHRoaXMgUmVnRXggcGF0dGVybjpcbiAqIF5cXCg/KD86KD86MDBcXCk/W1xcc1xcLV0/XFwoP3xcXCspKDQ0KVxcKT9bXFxzXFwtXT9cXCg/KD86MFxcKT9bXFxzXFwtXT9cXCg/KT98MCkoWzEtOV1cXGR7MSw0fVxcKT9bXFxzXFxkXFwtXSspJFxuICogRXh0cmFjdCAkMSBhbmQgc2V0ICRwcmVmaXggdG8gJys0NDxzcGFjZT4nIGlmICQxIGlzICc0NCcsIG90aGVyd2lzZSBzZXQgJHByZWZpeCB0byAnMCdcbiAqIEV4dHJhY3QgJDIgYW5kIHJlbW92ZSBoeXBoZW5zLCBzcGFjZXMgYW5kIHBhcmVudGhlc2VzLiBQaG9uZSBudW1iZXIgaXMgY29tYmluZWQgJHByZWZpeCBhbmQgJDIuXG4gKiBBIG51bWJlciBvZiB2ZXJ5IGRldGFpbGVkIEdCIHRlbGVwaG9uZSBudW1iZXIgUmVnRXggcGF0dGVybnMgY2FuIGFsc28gYmUgZm91bmQgYXQ6XG4gKiBodHRwOi8vd3d3LmFhLWFzdGVyaXNrLm9yZy51ay9pbmRleC5waHAvUmVndWxhcl9FeHByZXNzaW9uc19mb3JfVmFsaWRhdGluZ19hbmRfRm9ybWF0dGluZ19HQl9UZWxlcGhvbmVfTnVtYmVyc1xuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwicGhvbmVVS1wiLCBmdW5jdGlvbiggcGhvbmVfbnVtYmVyLCBlbGVtZW50ICkge1xuXHRwaG9uZV9udW1iZXIgPSBwaG9uZV9udW1iZXIucmVwbGFjZSggL1xcKHxcXCl8XFxzK3wtL2csIFwiXCIgKTtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCBwaG9uZV9udW1iZXIubGVuZ3RoID4gOSAmJlxuXHRcdHBob25lX251bWJlci5tYXRjaCggL14oPzooPzooPzowMFxccz98XFwrKTQ0XFxzPyl8KD86XFwoPzApKSg/OlxcZHsyfVxcKT9cXHM/XFxkezR9XFxzP1xcZHs0fXxcXGR7M31cXCk/XFxzP1xcZHszfVxccz9cXGR7Myw0fXxcXGR7NH1cXCk/XFxzPyg/OlxcZHs1fXxcXGR7M31cXHM/XFxkezN9KXxcXGR7NX1cXCk/XFxzP1xcZHs0LDV9KSQvICk7XG59LCBcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcGhvbmUgbnVtYmVyXCIgKTtcblxuLyoqXG4gKiBNYXRjaGVzIFVTIHBob25lIG51bWJlciBmb3JtYXRcbiAqXG4gKiB3aGVyZSB0aGUgYXJlYSBjb2RlIG1heSBub3Qgc3RhcnQgd2l0aCAxIGFuZCB0aGUgcHJlZml4IG1heSBub3Qgc3RhcnQgd2l0aCAxXG4gKiBhbGxvd3MgJy0nIG9yICcgJyBhcyBhIHNlcGFyYXRvciBhbmQgYWxsb3dzIHBhcmVucyBhcm91bmQgYXJlYSBjb2RlXG4gKiBzb21lIHBlb3BsZSBtYXkgd2FudCB0byBwdXQgYSAnMScgaW4gZnJvbnQgb2YgdGhlaXIgbnVtYmVyXG4gKlxuICogMSgyMTIpLTk5OS0yMzQ1IG9yXG4gKiAyMTIgOTk5IDIzNDQgb3JcbiAqIDIxMi05OTktMDk4M1xuICpcbiAqIGJ1dCBub3RcbiAqIDExMS0xMjMtNTQzNFxuICogYW5kIG5vdFxuICogMjEyIDEyMyA0NTY3XG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwaG9uZVVTXCIsIGZ1bmN0aW9uKCBwaG9uZV9udW1iZXIsIGVsZW1lbnQgKSB7XG5cdHBob25lX251bWJlciA9IHBob25lX251bWJlci5yZXBsYWNlKCAvXFxzKy9nLCBcIlwiICk7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgcGhvbmVfbnVtYmVyLmxlbmd0aCA+IDkgJiZcblx0XHRwaG9uZV9udW1iZXIubWF0Y2goIC9eKFxcKz8xLT8pPyhcXChbMi05XShbMDItOV1cXGR8MVswMi05XSlcXCl8WzItOV0oWzAyLTldXFxkfDFbMDItOV0pKS0/WzItOV0oWzAyLTldXFxkfDFbMDItOV0pLT9cXGR7NH0kLyApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBob25lIG51bWJlclwiICk7XG5cbi8qXG4qIFZhbGlkYSBDRVBzIGRvIGJyYXNpbGVpcm9zOlxuKlxuKiBGb3JtYXRvcyBhY2VpdG9zOlxuKiA5OTk5OS05OTlcbiogOTkuOTk5LTk5OVxuKiA5OTk5OTk5OVxuKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJwb3N0YWxjb2RlQlJcIiwgZnVuY3Rpb24oIGNlcF92YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXlxcZHsyfS5cXGR7M30tXFxkezN9PyR8XlxcZHs1fS0/XFxkezN9PyQvLnRlc3QoIGNlcF92YWx1ZSApO1xufSwgXCJJbmZvcm1lIHVtIENFUCB2w6FsaWRvLlwiICk7XG5cbi8qKlxuICogTWF0Y2hlcyBhIHZhbGlkIENhbmFkaWFuIFBvc3RhbCBDb2RlXG4gKlxuICogQGV4YW1wbGUgalF1ZXJ5LnZhbGlkYXRvci5tZXRob2RzLnBvc3RhbENvZGVDQSggXCJIMEggMEgwXCIsIGVsZW1lbnQgKVxuICogQHJlc3VsdCB0cnVlXG4gKlxuICogQGV4YW1wbGUgalF1ZXJ5LnZhbGlkYXRvci5tZXRob2RzLnBvc3RhbENvZGVDQSggXCJIMEgwSDBcIiwgZWxlbWVudCApXG4gKiBAcmVzdWx0IGZhbHNlXG4gKlxuICogQG5hbWUgalF1ZXJ5LnZhbGlkYXRvci5tZXRob2RzLnBvc3RhbENvZGVDQVxuICogQHR5cGUgQm9vbGVhblxuICogQGNhdCBQbHVnaW5zL1ZhbGlkYXRlL01ldGhvZHNcbiAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBvc3RhbENvZGVDQVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bQUJDRUdISktMTU5QUlNUVlhZXVxcZFtBQkNFR0hKS0xNTlBSU1RWV1hZWl0gKlxcZFtBQkNFR0hKS0xNTlBSU1RWV1hZWl1cXGQkL2kudGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZVwiICk7XG5cbi8qIE1hdGNoZXMgSXRhbGlhbiBwb3N0Y29kZSAoQ0FQKSAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBvc3RhbGNvZGVJVFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NX0kLy50ZXN0KCB2YWx1ZSApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBvc3RhbGNvZGVOTFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bMS05XVswLTldezN9XFxzP1thLXpBLVpdezJ9JC8udGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZVwiICk7XG5cbi8vIE1hdGNoZXMgVUsgcG9zdGNvZGUuIERvZXMgbm90IG1hdGNoIHRvIFVLIENoYW5uZWwgSXNsYW5kcyB0aGF0IGhhdmUgdGhlaXIgb3duIHBvc3Rjb2RlcyAobm9uIHN0YW5kYXJkIFVLKVxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInBvc3Rjb2RlVUtcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKCgoW0EtUFItVVdZWl1bMC05XSl8KFtBLVBSLVVXWVpdWzAtOV1bMC05XSl8KFtBLVBSLVVXWVpdW0EtSEstWV1bMC05XSl8KFtBLVBSLVVXWVpdW0EtSEstWV1bMC05XVswLTldKXwoW0EtUFItVVdZWl1bMC05XVtBLUhKS1NUVVddKXwoW0EtUFItVVdZWl1bQS1ISy1ZXVswLTldW0FCRUhNTlBSVldYWV0pKVxccz8oWzAtOV1bQUJELUhKTE5QLVVXLVpdezJ9KXwoR0lSKVxccz8oMEFBKSkkL2kudGVzdCggdmFsdWUgKTtcbn0sIFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBVSyBwb3N0Y29kZVwiICk7XG5cbi8qXG4gKiBMZXRzIHlvdSBzYXkgXCJhdCBsZWFzdCBYIGlucHV0cyB0aGF0IG1hdGNoIHNlbGVjdG9yIFkgbXVzdCBiZSBmaWxsZWQuXCJcbiAqXG4gKiBUaGUgZW5kIHJlc3VsdCBpcyB0aGF0IG5laXRoZXIgb2YgdGhlc2UgaW5wdXRzOlxuICpcbiAqXHQ8aW5wdXQgY2xhc3M9XCJwcm9kdWN0aW5mb1wiIG5hbWU9XCJwYXJ0bnVtYmVyXCI+XG4gKlx0PGlucHV0IGNsYXNzPVwicHJvZHVjdGluZm9cIiBuYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAqXG4gKlx0Li4ud2lsbCB2YWxpZGF0ZSB1bmxlc3MgYXQgbGVhc3Qgb25lIG9mIHRoZW0gaXMgZmlsbGVkLlxuICpcbiAqIHBhcnRudW1iZXI6XHR7cmVxdWlyZV9mcm9tX2dyb3VwOiBbMSxcIi5wcm9kdWN0aW5mb1wiXX0sXG4gKiBkZXNjcmlwdGlvbjoge3JlcXVpcmVfZnJvbV9ncm91cDogWzEsXCIucHJvZHVjdGluZm9cIl19XG4gKlxuICogb3B0aW9uc1swXTogbnVtYmVyIG9mIGZpZWxkcyB0aGF0IG11c3QgYmUgZmlsbGVkIGluIHRoZSBncm91cFxuICogb3B0aW9uc1sxXTogQ1NTIHNlbGVjdG9yIHRoYXQgZGVmaW5lcyB0aGUgZ3JvdXAgb2YgY29uZGl0aW9uYWxseSByZXF1aXJlZCBmaWVsZHNcbiAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInJlcXVpcmVfZnJvbV9ncm91cFwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIG9wdGlvbnMgKSB7XG5cdHZhciAkZmllbGRzID0gJCggb3B0aW9uc1sgMSBdLCBlbGVtZW50LmZvcm0gKSxcblx0XHQkZmllbGRzRmlyc3QgPSAkZmllbGRzLmVxKCAwICksXG5cdFx0dmFsaWRhdG9yID0gJGZpZWxkc0ZpcnN0LmRhdGEoIFwidmFsaWRfcmVxX2dycFwiICkgPyAkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9yZXFfZ3JwXCIgKSA6ICQuZXh0ZW5kKCB7fSwgdGhpcyApLFxuXHRcdGlzVmFsaWQgPSAkZmllbGRzLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdmFsaWRhdG9yLmVsZW1lbnRWYWx1ZSggdGhpcyApO1xuXHRcdH0gKS5sZW5ndGggPj0gb3B0aW9uc1sgMCBdO1xuXG5cdC8vIFN0b3JlIHRoZSBjbG9uZWQgdmFsaWRhdG9yIGZvciBmdXR1cmUgdmFsaWRhdGlvblxuXHQkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9yZXFfZ3JwXCIsIHZhbGlkYXRvciApO1xuXG5cdC8vIElmIGVsZW1lbnQgaXNuJ3QgYmVpbmcgdmFsaWRhdGVkLCBydW4gZWFjaCByZXF1aXJlX2Zyb21fZ3JvdXAgZmllbGQncyB2YWxpZGF0aW9uIHJ1bGVzXG5cdGlmICggISQoIGVsZW1lbnQgKS5kYXRhKCBcImJlaW5nX3ZhbGlkYXRlZFwiICkgKSB7XG5cdFx0JGZpZWxkcy5kYXRhKCBcImJlaW5nX3ZhbGlkYXRlZFwiLCB0cnVlICk7XG5cdFx0JGZpZWxkcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhbGlkYXRvci5lbGVtZW50KCB0aGlzICk7XG5cdFx0fSApO1xuXHRcdCRmaWVsZHMuZGF0YSggXCJiZWluZ192YWxpZGF0ZWRcIiwgZmFsc2UgKTtcblx0fVxuXHRyZXR1cm4gaXNWYWxpZDtcbn0sICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZmlsbCBhdCBsZWFzdCB7MH0gb2YgdGhlc2UgZmllbGRzLlwiICkgKTtcblxuLypcbiAqIExldHMgeW91IHNheSBcImVpdGhlciBhdCBsZWFzdCBYIGlucHV0cyB0aGF0IG1hdGNoIHNlbGVjdG9yIFkgbXVzdCBiZSBmaWxsZWQsXG4gKiBPUiB0aGV5IG11c3QgYWxsIGJlIHNraXBwZWQgKGxlZnQgYmxhbmspLlwiXG4gKlxuICogVGhlIGVuZCByZXN1bHQsIGlzIHRoYXQgbm9uZSBvZiB0aGVzZSBpbnB1dHM6XG4gKlxuICpcdDxpbnB1dCBjbGFzcz1cInByb2R1Y3RpbmZvXCIgbmFtZT1cInBhcnRudW1iZXJcIj5cbiAqXHQ8aW5wdXQgY2xhc3M9XCJwcm9kdWN0aW5mb1wiIG5hbWU9XCJkZXNjcmlwdGlvblwiPlxuICpcdDxpbnB1dCBjbGFzcz1cInByb2R1Y3RpbmZvXCIgbmFtZT1cImNvbG9yXCI+XG4gKlxuICpcdC4uLndpbGwgdmFsaWRhdGUgdW5sZXNzIGVpdGhlciBhdCBsZWFzdCB0d28gb2YgdGhlbSBhcmUgZmlsbGVkLFxuICpcdE9SIG5vbmUgb2YgdGhlbSBhcmUuXG4gKlxuICogcGFydG51bWJlcjpcdHtza2lwX29yX2ZpbGxfbWluaW11bTogWzIsXCIucHJvZHVjdGluZm9cIl19LFxuICogZGVzY3JpcHRpb246IHtza2lwX29yX2ZpbGxfbWluaW11bTogWzIsXCIucHJvZHVjdGluZm9cIl19LFxuICogY29sb3I6XHRcdHtza2lwX29yX2ZpbGxfbWluaW11bTogWzIsXCIucHJvZHVjdGluZm9cIl19XG4gKlxuICogb3B0aW9uc1swXTogbnVtYmVyIG9mIGZpZWxkcyB0aGF0IG11c3QgYmUgZmlsbGVkIGluIHRoZSBncm91cFxuICogb3B0aW9uc1sxXTogQ1NTIHNlbGVjdG9yIHRoYXQgZGVmaW5lcyB0aGUgZ3JvdXAgb2YgY29uZGl0aW9uYWxseSByZXF1aXJlZCBmaWVsZHNcbiAqXG4gKi9cbiQudmFsaWRhdG9yLmFkZE1ldGhvZCggXCJza2lwX29yX2ZpbGxfbWluaW11bVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIG9wdGlvbnMgKSB7XG5cdHZhciAkZmllbGRzID0gJCggb3B0aW9uc1sgMSBdLCBlbGVtZW50LmZvcm0gKSxcblx0XHQkZmllbGRzRmlyc3QgPSAkZmllbGRzLmVxKCAwICksXG5cdFx0dmFsaWRhdG9yID0gJGZpZWxkc0ZpcnN0LmRhdGEoIFwidmFsaWRfc2tpcFwiICkgPyAkZmllbGRzRmlyc3QuZGF0YSggXCJ2YWxpZF9za2lwXCIgKSA6ICQuZXh0ZW5kKCB7fSwgdGhpcyApLFxuXHRcdG51bWJlckZpbGxlZCA9ICRmaWVsZHMuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB2YWxpZGF0b3IuZWxlbWVudFZhbHVlKCB0aGlzICk7XG5cdFx0fSApLmxlbmd0aCxcblx0XHRpc1ZhbGlkID0gbnVtYmVyRmlsbGVkID09PSAwIHx8IG51bWJlckZpbGxlZCA+PSBvcHRpb25zWyAwIF07XG5cblx0Ly8gU3RvcmUgdGhlIGNsb25lZCB2YWxpZGF0b3IgZm9yIGZ1dHVyZSB2YWxpZGF0aW9uXG5cdCRmaWVsZHNGaXJzdC5kYXRhKCBcInZhbGlkX3NraXBcIiwgdmFsaWRhdG9yICk7XG5cblx0Ly8gSWYgZWxlbWVudCBpc24ndCBiZWluZyB2YWxpZGF0ZWQsIHJ1biBlYWNoIHNraXBfb3JfZmlsbF9taW5pbXVtIGZpZWxkJ3MgdmFsaWRhdGlvbiBydWxlc1xuXHRpZiAoICEkKCBlbGVtZW50ICkuZGF0YSggXCJiZWluZ192YWxpZGF0ZWRcIiApICkge1xuXHRcdCRmaWVsZHMuZGF0YSggXCJiZWluZ192YWxpZGF0ZWRcIiwgdHJ1ZSApO1xuXHRcdCRmaWVsZHMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YWxpZGF0b3IuZWxlbWVudCggdGhpcyApO1xuXHRcdH0gKTtcblx0XHQkZmllbGRzLmRhdGEoIFwiYmVpbmdfdmFsaWRhdGVkXCIsIGZhbHNlICk7XG5cdH1cblx0cmV0dXJuIGlzVmFsaWQ7XG59LCAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVpdGhlciBza2lwIHRoZXNlIGZpZWxkcyBvciBmaWxsIGF0IGxlYXN0IHswfSBvZiB0aGVtLlwiICkgKTtcblxuLyogVmFsaWRhdGVzIFVTIFN0YXRlcyBhbmQvb3IgVGVycml0b3JpZXMgYnkgQGpkZm9yc3l0aGVcbiAqIENhbiBiZSBjYXNlIGluc2Vuc2l0aXZlIG9yIHJlcXVpcmUgY2FwaXRhbGl6YXRpb24gLSBkZWZhdWx0IGlzIGNhc2UgaW5zZW5zaXRpdmVcbiAqIENhbiBpbmNsdWRlIFVTIFRlcnJpdG9yaWVzIG9yIG5vdCAtIGRlZmF1bHQgZG9lcyBub3RcbiAqIENhbiBpbmNsdWRlIFVTIE1pbGl0YXJ5IHBvc3RhbCBhYmJyZXZpYXRpb25zIChBQSwgQUUsIEFQKSAtIGRlZmF1bHQgZG9lcyBub3RcbiAqXG4gKiBOb3RlOiBcIlN0YXRlc1wiIGFsd2F5cyBpbmNsdWRlcyBEQyAoRGlzdHJpY3Qgb2YgQ29sb21iaWEpXG4gKlxuICogVXNhZ2UgZXhhbXBsZXM6XG4gKlxuICogIFRoaXMgaXMgdGhlIGRlZmF1bHQgLSBjYXNlIGluc2Vuc2l0aXZlLCBubyB0ZXJyaXRvcmllcywgbm8gbWlsaXRhcnkgem9uZXNcbiAqICBzdGF0ZUlucHV0OiB7XG4gKiAgICAgY2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gKiAgICAgaW5jbHVkZVRlcnJpdG9yaWVzOiBmYWxzZSxcbiAqICAgICBpbmNsdWRlTWlsaXRhcnk6IGZhbHNlXG4gKiAgfVxuICpcbiAqICBPbmx5IGFsbG93IGNhcGl0YWwgbGV0dGVycywgbm8gdGVycml0b3JpZXMsIG5vIG1pbGl0YXJ5IHpvbmVzXG4gKiAgc3RhdGVJbnB1dDoge1xuICogICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlXG4gKiAgfVxuICpcbiAqICBDYXNlIGluc2Vuc2l0aXZlLCBpbmNsdWRlIHRlcnJpdG9yaWVzIGJ1dCBub3QgbWlsaXRhcnkgem9uZXNcbiAqICBzdGF0ZUlucHV0OiB7XG4gKiAgICAgaW5jbHVkZVRlcnJpdG9yaWVzOiB0cnVlXG4gKiAgfVxuICpcbiAqICBPbmx5IGFsbG93IGNhcGl0YWwgbGV0dGVycywgaW5jbHVkZSB0ZXJyaXRvcmllcyBhbmQgbWlsaXRhcnkgem9uZXNcbiAqICBzdGF0ZUlucHV0OiB7XG4gKiAgICAgY2FzZVNlbnNpdGl2ZTogdHJ1ZSxcbiAqICAgICBpbmNsdWRlVGVycml0b3JpZXM6IHRydWUsXG4gKiAgICAgaW5jbHVkZU1pbGl0YXJ5OiB0cnVlXG4gKiAgfVxuICpcbiAqL1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInN0YXRlVVNcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBvcHRpb25zICkge1xuXHR2YXIgaXNEZWZhdWx0ID0gdHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIsXG5cdFx0Y2FzZVNlbnNpdGl2ZSA9ICggaXNEZWZhdWx0IHx8IHR5cGVvZiBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPT09IFwidW5kZWZpbmVkXCIgKSA/IGZhbHNlIDogb3B0aW9ucy5jYXNlU2Vuc2l0aXZlLFxuXHRcdGluY2x1ZGVUZXJyaXRvcmllcyA9ICggaXNEZWZhdWx0IHx8IHR5cGVvZiBvcHRpb25zLmluY2x1ZGVUZXJyaXRvcmllcyA9PT0gXCJ1bmRlZmluZWRcIiApID8gZmFsc2UgOiBvcHRpb25zLmluY2x1ZGVUZXJyaXRvcmllcyxcblx0XHRpbmNsdWRlTWlsaXRhcnkgPSAoIGlzRGVmYXVsdCB8fCB0eXBlb2Ygb3B0aW9ucy5pbmNsdWRlTWlsaXRhcnkgPT09IFwidW5kZWZpbmVkXCIgKSA/IGZhbHNlIDogb3B0aW9ucy5pbmNsdWRlTWlsaXRhcnksXG5cdFx0cmVnZXg7XG5cblx0aWYgKCAhaW5jbHVkZVRlcnJpdG9yaWVzICYmICFpbmNsdWRlTWlsaXRhcnkgKSB7XG5cdFx0cmVnZXggPSBcIl4oQVtLTFJaXXxDW0FPVF18RFtDRV18Rkx8R0F8SEl8SVtBRExOXXxLW1NZXXxMQXxNW0FERUlOT1NUXXxOW0NERUhKTVZZXXxPW0hLUl18UEF8Ukl8U1tDRF18VFtOWF18VVR8VltBVF18V1tBSVZZXSkkXCI7XG5cdH0gZWxzZSBpZiAoIGluY2x1ZGVUZXJyaXRvcmllcyAmJiBpbmNsdWRlTWlsaXRhcnkgKSB7XG5cdFx0cmVnZXggPSBcIl4oQVtBRUtMUFJTWl18Q1tBT1RdfERbQ0VdfEZMfEdbQVVdfEhJfElbQURMTl18S1tTWV18TEF8TVtBREVJTk9QU1RdfE5bQ0RFSEpNVlldfE9bSEtSXXxQW0FSXXxSSXxTW0NEXXxUW05YXXxVVHxWW0FJVF18V1tBSVZZXSkkXCI7XG5cdH0gZWxzZSBpZiAoIGluY2x1ZGVUZXJyaXRvcmllcyApIHtcblx0XHRyZWdleCA9IFwiXihBW0tMUlNaXXxDW0FPVF18RFtDRV18Rkx8R1tBVV18SEl8SVtBRExOXXxLW1NZXXxMQXxNW0FERUlOT1BTVF18TltDREVISk1WWV18T1tIS1JdfFBbQVJdfFJJfFNbQ0RdfFRbTlhdfFVUfFZbQUlUXXxXW0FJVlldKSRcIjtcblx0fSBlbHNlIHtcblx0XHRyZWdleCA9IFwiXihBW0FFS0xQUlpdfENbQU9UXXxEW0NFXXxGTHxHQXxISXxJW0FETE5dfEtbU1ldfExBfE1bQURFSU5PU1RdfE5bQ0RFSEpNVlldfE9bSEtSXXxQQXxSSXxTW0NEXXxUW05YXXxVVHxWW0FUXXxXW0FJVlldKSRcIjtcblx0fVxuXG5cdHJlZ2V4ID0gY2FzZVNlbnNpdGl2ZSA/IG5ldyBSZWdFeHAoIHJlZ2V4ICkgOiBuZXcgUmVnRXhwKCByZWdleCwgXCJpXCIgKTtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCByZWdleC50ZXN0KCB2YWx1ZSApO1xufSwgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHN0YXRlXCIgKTtcblxuLy8gVE9ETyBjaGVjayBpZiB2YWx1ZSBzdGFydHMgd2l0aCA8LCBvdGhlcndpc2UgZG9uJ3QgdHJ5IHN0cmlwcGluZyBhbnl0aGluZ1xuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInN0cmlwcGVkbWlubGVuZ3RoXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG5cdHJldHVybiAkKCB2YWx1ZSApLnRleHQoKS5sZW5ndGggPj0gcGFyYW07XG59LCAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGF0IGxlYXN0IHswfSBjaGFyYWN0ZXJzXCIgKSApO1xuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwidGltZVwiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL14oWzAxXVxcZHwyWzAtM118WzAtOV0pKDpbMC01XVxcZCl7MSwyfSQvLnRlc3QoIHZhbHVlICk7XG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIHRpbWUsIGJldHdlZW4gMDA6MDAgYW5kIDIzOjU5XCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInRpbWUxMmhcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKCgwP1sxLTldfDFbMDEyXSkoOlswLTVdXFxkKXsxLDJ9KFxcID9bQVBdTSkpJC9pLnRlc3QoIHZhbHVlICk7XG59LCBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIHRpbWUgaW4gMTItaG91ciBhbS9wbSBmb3JtYXRcIiApO1xuXG4vLyBTYW1lIGFzIHVybCwgYnV0IFRMRCBpcyBvcHRpb25hbFxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInVybDJcIiwgZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eKGh0dHBzP3xmdHApOlxcL1xcLygoKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6KSpAKT8oKChcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSlcXC4oXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pXFwuKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKVxcLihcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSkpfCgoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4pKigoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLj8pKDpcXGQqKT8pKFxcLygoKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCkrKFxcLygoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKSopKik/KT8oXFw/KCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKXxbXFx1RTAwMC1cXHVGOEZGXXxcXC98XFw/KSopPygjKCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKXxcXC98XFw/KSopPyQvaS50ZXN0KCB2YWx1ZSApO1xufSwgJC52YWxpZGF0b3IubWVzc2FnZXMudXJsICk7XG5cbi8qKlxuICogUmV0dXJuIHRydWUsIGlmIHRoZSB2YWx1ZSBpcyBhIHZhbGlkIHZlaGljbGUgaWRlbnRpZmljYXRpb24gbnVtYmVyIChWSU4pLlxuICpcbiAqIFdvcmtzIHdpdGggYWxsIGtpbmQgb2YgdGV4dCBpbnB1dHMuXG4gKlxuICogQGV4YW1wbGUgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc2l6ZT1cIjIwXCIgbmFtZT1cIlZlaGljbGVJRFwiIGNsYXNzPVwie3JlcXVpcmVkOnRydWUsdmluVVM6dHJ1ZX1cIiAvPlxuICogQGRlc2MgRGVjbGFyZXMgYSByZXF1aXJlZCBpbnB1dCBlbGVtZW50IHdob3NlIHZhbHVlIG11c3QgYmUgYSB2YWxpZCB2ZWhpY2xlIGlkZW50aWZpY2F0aW9uIG51bWJlci5cbiAqXG4gKiBAbmFtZSAkLnZhbGlkYXRvci5tZXRob2RzLnZpblVTXG4gKiBAdHlwZSBCb29sZWFuXG4gKiBAY2F0IFBsdWdpbnMvVmFsaWRhdGUvTWV0aG9kc1xuICovXG4kLnZhbGlkYXRvci5hZGRNZXRob2QoIFwidmluVVNcIiwgZnVuY3Rpb24oIHYgKSB7XG5cdGlmICggdi5sZW5ndGggIT09IDE3ICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBMTCA9IFsgXCJBXCIsIFwiQlwiLCBcIkNcIiwgXCJEXCIsIFwiRVwiLCBcIkZcIiwgXCJHXCIsIFwiSFwiLCBcIkpcIiwgXCJLXCIsIFwiTFwiLCBcIk1cIiwgXCJOXCIsIFwiUFwiLCBcIlJcIiwgXCJTXCIsIFwiVFwiLCBcIlVcIiwgXCJWXCIsIFwiV1wiLCBcIlhcIiwgXCJZXCIsIFwiWlwiIF0sXG5cdFx0VkwgPSBbIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDEsIDIsIDMsIDQsIDUsIDcsIDksIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDkgXSxcblx0XHRGTCA9IFsgOCwgNywgNiwgNSwgNCwgMywgMiwgMTAsIDAsIDksIDgsIDcsIDYsIDUsIDQsIDMsIDIgXSxcblx0XHRycyA9IDAsXG5cdFx0aSwgbiwgZCwgZiwgY2QsIGNkdjtcblxuXHRmb3IgKCBpID0gMDsgaSA8IDE3OyBpKysgKSB7XG5cdFx0ZiA9IEZMWyBpIF07XG5cdFx0ZCA9IHYuc2xpY2UoIGksIGkgKyAxICk7XG5cdFx0aWYgKCBpID09PSA4ICkge1xuXHRcdFx0Y2R2ID0gZDtcblx0XHR9XG5cdFx0aWYgKCAhaXNOYU4oIGQgKSApIHtcblx0XHRcdGQgKj0gZjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICggbiA9IDA7IG4gPCBMTC5sZW5ndGg7IG4rKyApIHtcblx0XHRcdFx0aWYgKCBkLnRvVXBwZXJDYXNlKCkgPT09IExMWyBuIF0gKSB7XG5cdFx0XHRcdFx0ZCA9IFZMWyBuIF07XG5cdFx0XHRcdFx0ZCAqPSBmO1xuXHRcdFx0XHRcdGlmICggaXNOYU4oIGNkdiApICYmIG4gPT09IDggKSB7XG5cdFx0XHRcdFx0XHRjZHYgPSBMTFsgbiBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRycyArPSBkO1xuXHR9XG5cdGNkID0gcnMgJSAxMTtcblx0aWYgKCBjZCA9PT0gMTAgKSB7XG5cdFx0Y2QgPSBcIlhcIjtcblx0fVxuXHRpZiAoIGNkID09PSBjZHYgKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufSwgXCJUaGUgc3BlY2lmaWVkIHZlaGljbGUgaWRlbnRpZmljYXRpb24gbnVtYmVyIChWSU4pIGlzIGludmFsaWQuXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInppcGNvZGVVU1wiLCBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15cXGR7NX0oLVxcZHs0fSk/JC8udGVzdCggdmFsdWUgKTtcbn0sIFwiVGhlIHNwZWNpZmllZCBVUyBaSVAgQ29kZSBpcyBpbnZhbGlkXCIgKTtcblxuJC52YWxpZGF0b3IuYWRkTWV0aG9kKCBcInppcHJhbmdlXCIsIGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXjkwWzItNV1cXGRcXHsyXFx9LVxcZHs0fSQvLnRlc3QoIHZhbHVlICk7XG59LCBcIllvdXIgWklQLWNvZGUgbXVzdCBiZSBpbiB0aGUgcmFuZ2UgOTAyeHgteHh4eCB0byA5MDV4eC14eHh4XCIgKTtcbnJldHVybiAkO1xufSkpOyJdLCJmaWxlIjoibGliL2pxdWVyeS12YWxpZGF0aW9uL2Rpc3QvYWRkaXRpb25hbC1tZXRob2RzLmVzNS5qcyJ9
