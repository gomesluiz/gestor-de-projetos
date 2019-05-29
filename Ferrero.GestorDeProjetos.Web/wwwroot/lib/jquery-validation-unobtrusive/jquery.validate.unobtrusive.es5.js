"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Unobtrusive validation support library for jQuery and jQuery Validate
// Copyright (C) Microsoft Corporation. All rights reserved.
// @version v3.2.9

/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */

/*global document: false, jQuery: false */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define("jquery.validate.unobtrusive", ['jquery.validation'], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports     
    module.exports = factory(require('jquery-validation'));
  } else {
    // Browser global
    jQuery.validator.unobtrusive = factory(jQuery);
  }
})(function ($) {
  var $jQval = $.validator,
      adapters,
      data_validation = "unobtrusiveValidation";

  function setValidationValues(options, ruleName, value) {
    options.rules[ruleName] = value;

    if (options.message) {
      options.messages[ruleName] = options.message;
    }
  }

  function splitAndTrim(value) {
    return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
  }

  function escapeAttributeValue(value) {
    // As mentioned on http://api.jquery.com/category/selectors/
    return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
  }

  function getModelPrefix(fieldName) {
    return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
  }

  function appendModelPrefix(value, prefix) {
    if (value.indexOf("*.") === 0) {
      value = value.replace("*.", prefix);
    }

    return value;
  }

  function onError(error, inputElement) {
    // 'this' is the form element
    var container = $(this).find("[data-valmsg-for='" + escapeAttributeValue(inputElement[0].name) + "']"),
        replaceAttrValue = container.attr("data-valmsg-replace"),
        replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;
    container.removeClass("field-validation-valid").addClass("field-validation-error");
    error.data("unobtrusiveContainer", container);

    if (replace) {
      container.empty();
      error.removeClass("input-validation-error").appendTo(container);
    } else {
      error.hide();
    }
  }

  function onErrors(event, validator) {
    // 'this' is the form element
    var container = $(this).find("[data-valmsg-summary=true]"),
        list = container.find("ul");

    if (list && list.length && validator.errorList.length) {
      list.empty();
      container.addClass("validation-summary-errors").removeClass("validation-summary-valid");
      $.each(validator.errorList, function () {
        $("<li />").html(this.message).appendTo(list);
      });
    }
  }

  function onSuccess(error) {
    // 'this' is the form element
    var container = error.data("unobtrusiveContainer");

    if (container) {
      var replaceAttrValue = container.attr("data-valmsg-replace"),
          replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) : null;
      container.addClass("field-validation-valid").removeClass("field-validation-error");
      error.removeData("unobtrusiveContainer");

      if (replace) {
        container.empty();
      }
    }
  }

  function onReset(event) {
    // 'this' is the form element
    var $form = $(this),
        key = '__jquery_unobtrusive_validation_form_reset';

    if ($form.data(key)) {
      return;
    } // Set a flag that indicates we're currently resetting the form.


    $form.data(key, true);

    try {
      $form.data("validator").resetForm();
    } finally {
      $form.removeData(key);
    }

    $form.find(".validation-summary-errors").addClass("validation-summary-valid").removeClass("validation-summary-errors");
    $form.find(".field-validation-error").addClass("field-validation-valid").removeClass("field-validation-error").removeData("unobtrusiveContainer").find(">*") // If we were using valmsg-replace, get the underlying error
    .removeData("unobtrusiveContainer");
  }

  function validationInfo(form) {
    var $form = $(form),
        result = $form.data(data_validation),
        onResetProxy = $.proxy(onReset, form),
        defaultOptions = $jQval.unobtrusive.options || {},
        execInContext = function execInContext(name, args) {
      var func = defaultOptions[name];
      func && $.isFunction(func) && func.apply(form, args);
    };

    if (!result) {
      result = {
        options: {
          // options structure passed to jQuery Validate's validate() method
          errorClass: defaultOptions.errorClass || "input-validation-error",
          errorElement: defaultOptions.errorElement || "span",
          errorPlacement: function errorPlacement() {
            onError.apply(form, arguments);
            execInContext("errorPlacement", arguments);
          },
          invalidHandler: function invalidHandler() {
            onErrors.apply(form, arguments);
            execInContext("invalidHandler", arguments);
          },
          messages: {},
          rules: {},
          success: function success() {
            onSuccess.apply(form, arguments);
            execInContext("success", arguments);
          }
        },
        attachValidation: function attachValidation() {
          $form.off("reset." + data_validation, onResetProxy).on("reset." + data_validation, onResetProxy).validate(this.options);
        },
        validate: function validate() {
          // a validation function that is called by unobtrusive Ajax
          $form.validate();
          return $form.valid();
        }
      };
      $form.data(data_validation, result);
    }

    return result;
  }

  $jQval.unobtrusive = {
    adapters: [],
    parseElement: function parseElement(element, skipAttach) {
      /// <summary>
      /// Parses a single HTML element for unobtrusive validation attributes.
      /// </summary>
      /// <param name="element" domElement="true">The HTML element to be parsed.</param>
      /// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
      /// validation to the form. If parsing just this single element, you should specify true.
      /// If parsing several elements, you should specify false, and manually attach the validation
      /// to the form when you are finished. The default is false.</param>
      var $element = $(element),
          form = $element.parents("form")[0],
          valInfo,
          rules,
          messages;

      if (!form) {
        // Cannot do client-side validation without a form
        return;
      }

      valInfo = validationInfo(form);
      valInfo.options.rules[element.name] = rules = {};
      valInfo.options.messages[element.name] = messages = {};
      $.each(this.adapters, function () {
        var prefix = "data-val-" + this.name,
            message = $element.attr(prefix),
            paramValues = {};

        if (message !== undefined) {
          // Compare against undefined, because an empty message is legal (and falsy)
          prefix += "-";
          $.each(this.params, function () {
            paramValues[this] = $element.attr(prefix + this);
          });
          this.adapt({
            element: element,
            form: form,
            message: message,
            params: paramValues,
            rules: rules,
            messages: messages
          });
        }
      });
      $.extend(rules, {
        "__dummy__": true
      });

      if (!skipAttach) {
        valInfo.attachValidation();
      }
    },
    parse: function parse(selector) {
      /// <summary>
      /// Parses all the HTML elements in the specified selector. It looks for input elements decorated
      /// with the [data-val=true] attribute value and enables validation according to the data-val-*
      /// attribute values.
      /// </summary>
      /// <param name="selector" type="String">Any valid jQuery selector.</param>
      // $forms includes all forms in selector's DOM hierarchy (parent, children and self) that have at least one
      // element with data-val=true
      var $selector = $(selector),
          $forms = $selector.parents().addBack().filter("form").add($selector.find("form")).has("[data-val=true]");
      $selector.find("[data-val=true]").each(function () {
        $jQval.unobtrusive.parseElement(this, true);
      });
      $forms.each(function () {
        var info = validationInfo(this);

        if (info) {
          info.attachValidation();
        }
      });
    }
  };
  adapters = $jQval.unobtrusive.adapters;

  adapters.add = function (adapterName, params, fn) {
    /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation.</summary>
    /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
    /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
    /// <param name="params" type="Array" optional="true">[Optional] An array of parameter names (strings) that will
    /// be extracted from the data-val-nnnn-mmmm HTML attributes (where nnnn is the adapter name, and
    /// mmmm is the parameter name).</param>
    /// <param name="fn" type="Function">The function to call, which adapts the values from the HTML
    /// attributes into jQuery Validate rules and/or messages.</param>
    /// <returns type="jQuery.validator.unobtrusive.adapters" />
    if (!fn) {
      // Called with no params, just a function
      fn = params;
      params = [];
    }

    this.push({
      name: adapterName,
      params: params,
      adapt: fn
    });
    return this;
  };

  adapters.addBool = function (adapterName, ruleName) {
    /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
    /// the jQuery Validate validation rule has no parameter values.</summary>
    /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
    /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
    /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
    /// of adapterName will be used instead.</param>
    /// <returns type="jQuery.validator.unobtrusive.adapters" />
    return this.add(adapterName, function (options) {
      setValidationValues(options, ruleName || adapterName, true);
    });
  };

  adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
    /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
    /// the jQuery Validate validation has three potential rules (one for min-only, one for max-only, and
    /// one for min-and-max). The HTML parameters are expected to be named -min and -max.</summary>
    /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
    /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
    /// <param name="minRuleName" type="String">The name of the jQuery Validate rule to be used when you only
    /// have a minimum value.</param>
    /// <param name="maxRuleName" type="String">The name of the jQuery Validate rule to be used when you only
    /// have a maximum value.</param>
    /// <param name="minMaxRuleName" type="String">The name of the jQuery Validate rule to be used when you
    /// have both a minimum and maximum value.</param>
    /// <param name="minAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
    /// contains the minimum value. The default is "min".</param>
    /// <param name="maxAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
    /// contains the maximum value. The default is "max".</param>
    /// <returns type="jQuery.validator.unobtrusive.adapters" />
    return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
      var min = options.params.min,
          max = options.params.max;

      if (min && max) {
        setValidationValues(options, minMaxRuleName, [min, max]);
      } else if (min) {
        setValidationValues(options, minRuleName, min);
      } else if (max) {
        setValidationValues(options, maxRuleName, max);
      }
    });
  };

  adapters.addSingleVal = function (adapterName, attribute, ruleName) {
    /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
    /// the jQuery Validate validation rule has a single value.</summary>
    /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
    /// in the data-val-nnnn HTML attribute(where nnnn is the adapter name).</param>
    /// <param name="attribute" type="String">[Optional] The name of the HTML attribute that contains the value.
    /// The default is "val".</param>
    /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
    /// of adapterName will be used instead.</param>
    /// <returns type="jQuery.validator.unobtrusive.adapters" />
    return this.add(adapterName, [attribute || "val"], function (options) {
      setValidationValues(options, ruleName || adapterName, options.params[attribute]);
    });
  };

  $jQval.addMethod("__dummy__", function (value, element, params) {
    return true;
  });
  $jQval.addMethod("regex", function (value, element, params) {
    var match;

    if (this.optional(element)) {
      return true;
    }

    match = new RegExp(params).exec(value);
    return match && match.index === 0 && match[0].length === value.length;
  });
  $jQval.addMethod("nonalphamin", function (value, element, nonalphamin) {
    var match;

    if (nonalphamin) {
      match = value.match(/\W/g);
      match = match && match.length >= nonalphamin;
    }

    return match;
  });

  if ($jQval.methods.extension) {
    adapters.addSingleVal("accept", "mimtype");
    adapters.addSingleVal("extension", "extension");
  } else {
    // for backward compatibility, when the 'extension' validation method does not exist, such as with versions
    // of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
    // validating the extension, and ignore mime-type validations as they are not supported.
    adapters.addSingleVal("extension", "extension", "accept");
  }

  adapters.addSingleVal("regex", "pattern");
  adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
  adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
  adapters.addMinMax("minlength", "minlength").addMinMax("maxlength", "minlength", "maxlength");
  adapters.add("equalto", ["other"], function (options) {
    var prefix = getModelPrefix(options.element.name),
        other = options.params.other,
        fullOtherName = appendModelPrefix(other, prefix),
        element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];
    setValidationValues(options, "equalTo", element);
  });
  adapters.add("required", function (options) {
    // jQuery Validate equates "required" with "mandatory" for checkbox elements
    if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
      setValidationValues(options, "required", true);
    }
  });
  adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
    var value = {
      url: options.params.url,
      type: options.params.type || "GET",
      data: {}
    },
        prefix = getModelPrefix(options.element.name);
    $.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
      var paramName = appendModelPrefix(fieldName, prefix);

      value.data[paramName] = function () {
        var field = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']"); // For checkboxes and radio buttons, only pick up values from checked fields.

        if (field.is(":checkbox")) {
          return field.filter(":checked").val() || field.filter(":hidden").val() || '';
        } else if (field.is(":radio")) {
          return field.filter(":checked").val() || '';
        }

        return field.val();
      };
    });
    setValidationValues(options, "remote", value);
  });
  adapters.add("password", ["min", "nonalphamin", "regex"], function (options) {
    if (options.params.min) {
      setValidationValues(options, "minlength", options.params.min);
    }

    if (options.params.nonalphamin) {
      setValidationValues(options, "nonalphamin", options.params.nonalphamin);
    }

    if (options.params.regex) {
      setValidationValues(options, "regex", options.params.regex);
    }
  });
  adapters.add("fileextensions", ["extensions"], function (options) {
    setValidationValues(options, "extension", options.params.extensions);
  });
  $(function () {
    $jQval.unobtrusive.parse(document);
  });
  return $jQval.unobtrusive;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9qcXVlcnktdmFsaWRhdGlvbi11bm9idHJ1c2l2ZS9qcXVlcnkudmFsaWRhdGUudW5vYnRydXNpdmUuanMiXSwibmFtZXMiOlsiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwialF1ZXJ5IiwidmFsaWRhdG9yIiwidW5vYnRydXNpdmUiLCIkIiwiJGpRdmFsIiwiYWRhcHRlcnMiLCJkYXRhX3ZhbGlkYXRpb24iLCJzZXRWYWxpZGF0aW9uVmFsdWVzIiwib3B0aW9ucyIsInJ1bGVOYW1lIiwidmFsdWUiLCJydWxlcyIsIm1lc3NhZ2UiLCJtZXNzYWdlcyIsInNwbGl0QW5kVHJpbSIsInJlcGxhY2UiLCJzcGxpdCIsImVzY2FwZUF0dHJpYnV0ZVZhbHVlIiwiZ2V0TW9kZWxQcmVmaXgiLCJmaWVsZE5hbWUiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImFwcGVuZE1vZGVsUHJlZml4IiwicHJlZml4IiwiaW5kZXhPZiIsIm9uRXJyb3IiLCJlcnJvciIsImlucHV0RWxlbWVudCIsImNvbnRhaW5lciIsImZpbmQiLCJuYW1lIiwicmVwbGFjZUF0dHJWYWx1ZSIsImF0dHIiLCJwYXJzZUpTT04iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiZGF0YSIsImVtcHR5IiwiYXBwZW5kVG8iLCJoaWRlIiwib25FcnJvcnMiLCJldmVudCIsImxpc3QiLCJsZW5ndGgiLCJlcnJvckxpc3QiLCJlYWNoIiwiaHRtbCIsIm9uU3VjY2VzcyIsInJlbW92ZURhdGEiLCJvblJlc2V0IiwiJGZvcm0iLCJrZXkiLCJyZXNldEZvcm0iLCJ2YWxpZGF0aW9uSW5mbyIsImZvcm0iLCJyZXN1bHQiLCJvblJlc2V0UHJveHkiLCJwcm94eSIsImRlZmF1bHRPcHRpb25zIiwiZXhlY0luQ29udGV4dCIsImFyZ3MiLCJmdW5jIiwiaXNGdW5jdGlvbiIsImFwcGx5IiwiZXJyb3JDbGFzcyIsImVycm9yRWxlbWVudCIsImVycm9yUGxhY2VtZW50IiwiYXJndW1lbnRzIiwiaW52YWxpZEhhbmRsZXIiLCJzdWNjZXNzIiwiYXR0YWNoVmFsaWRhdGlvbiIsIm9mZiIsIm9uIiwidmFsaWRhdGUiLCJ2YWxpZCIsInBhcnNlRWxlbWVudCIsImVsZW1lbnQiLCJza2lwQXR0YWNoIiwiJGVsZW1lbnQiLCJwYXJlbnRzIiwidmFsSW5mbyIsInBhcmFtVmFsdWVzIiwidW5kZWZpbmVkIiwicGFyYW1zIiwiYWRhcHQiLCJleHRlbmQiLCJwYXJzZSIsInNlbGVjdG9yIiwiJHNlbGVjdG9yIiwiJGZvcm1zIiwiYWRkQmFjayIsImZpbHRlciIsImFkZCIsImhhcyIsImluZm8iLCJhZGFwdGVyTmFtZSIsImZuIiwicHVzaCIsImFkZEJvb2wiLCJhZGRNaW5NYXgiLCJtaW5SdWxlTmFtZSIsIm1heFJ1bGVOYW1lIiwibWluTWF4UnVsZU5hbWUiLCJtaW5BdHRyaWJ1dGUiLCJtYXhBdHRyaWJ1dGUiLCJtaW4iLCJtYXgiLCJhZGRTaW5nbGVWYWwiLCJhdHRyaWJ1dGUiLCJhZGRNZXRob2QiLCJtYXRjaCIsIm9wdGlvbmFsIiwiUmVnRXhwIiwiZXhlYyIsImluZGV4Iiwibm9uYWxwaGFtaW4iLCJtZXRob2RzIiwiZXh0ZW5zaW9uIiwib3RoZXIiLCJmdWxsT3RoZXJOYW1lIiwidGFnTmFtZSIsInRvVXBwZXJDYXNlIiwidHlwZSIsInVybCIsImFkZGl0aW9uYWxmaWVsZHMiLCJpIiwicGFyYW1OYW1lIiwiZmllbGQiLCJpcyIsInZhbCIsInJlZ2V4IiwiZXh0ZW5zaW9ucyIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBOztBQUVBOztBQUNBO0FBRUMsV0FBVUEsT0FBVixFQUFtQjtBQUNoQixNQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE1BQU0sQ0FBQ0MsR0FBM0MsRUFBZ0Q7QUFDNUM7QUFDQUQsSUFBQUEsTUFBTSxDQUFDLDZCQUFELEVBQWdDLENBQUMsbUJBQUQsQ0FBaEMsRUFBdURELE9BQXZELENBQU47QUFD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RUFBMEI7QUFDdEIzSCxNQUFBQSxtQkFBbUIsQ0FBQ0MsT0FBRCxFQUFVLE9BQVYsRUFBbUJBLE9BQU8sQ0FBQzJFLE1BQVIsQ0FBZStDLEtBQWxDLENBQW5CO0FBQ0g7QUFDSixHQVZEO0FBV0E3SCxFQUFBQSxRQUFRLENBQUN1RixHQUFULENBQWEsZ0JBQWIsRUFBK0IsQ0FBQyxZQUFELENBQS9CLEVBQStDLFVBQVVwRixPQUFWLEVBQW1CO0FBQzlERCxJQUFBQSxtQkFBbUIsQ0FBQ0MsT0FBRCxFQUFVLFdBQVYsRUFBdUJBLE9BQU8sQ0FBQzJFLE1BQVIsQ0FBZWdELFVBQXRDLENBQW5CO0FBQ0gsR0FGRDtBQUlBaEksRUFBQUEsQ0FBQyxDQUFDLFlBQVk7QUFDVkMsSUFBQUEsTUFBTSxDQUFDRixXQUFQLENBQW1Cb0YsS0FBbkIsQ0FBeUI4QyxRQUF6QjtBQUNILEdBRkEsQ0FBRDtBQUlBLFNBQU9oSSxNQUFNLENBQUNGLFdBQWQ7QUFDSCxDQXZhQSxDQUFEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVW5vYnRydXNpdmUgdmFsaWRhdGlvbiBzdXBwb3J0IGxpYnJhcnkgZm9yIGpRdWVyeSBhbmQgalF1ZXJ5IFZhbGlkYXRlXG4vLyBDb3B5cmlnaHQgKEMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIEB2ZXJzaW9uIHYzLjIuOVxuXG4vKmpzbGludCB3aGl0ZTogdHJ1ZSwgYnJvd3NlcjogdHJ1ZSwgb25ldmFyOiB0cnVlLCB1bmRlZjogdHJ1ZSwgbm9tZW46IHRydWUsIGVxZXFlcTogdHJ1ZSwgcGx1c3BsdXM6IHRydWUsIGJpdHdpc2U6IHRydWUsIHJlZ2V4cDogdHJ1ZSwgbmV3Y2FwOiB0cnVlLCBpbW1lZDogdHJ1ZSwgc3RyaWN0OiBmYWxzZSAqL1xuLypnbG9iYWwgZG9jdW1lbnQ6IGZhbHNlLCBqUXVlcnk6IGZhbHNlICovXG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoXCJqcXVlcnkudmFsaWRhdGUudW5vYnRydXNpdmVcIiwgWydqcXVlcnkudmFsaWRhdGlvbiddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIC8vIENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyAgICAgXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnktdmFsaWRhdGlvbicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbFxuICAgICAgICBqUXVlcnkudmFsaWRhdG9yLnVub2J0cnVzaXZlID0gZmFjdG9yeShqUXVlcnkpO1xuICAgIH1cbn0oZnVuY3Rpb24gKCQpIHtcbiAgICB2YXIgJGpRdmFsID0gJC52YWxpZGF0b3IsXG4gICAgICAgIGFkYXB0ZXJzLFxuICAgICAgICBkYXRhX3ZhbGlkYXRpb24gPSBcInVub2J0cnVzaXZlVmFsaWRhdGlvblwiO1xuXG4gICAgZnVuY3Rpb24gc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBydWxlTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgb3B0aW9ucy5ydWxlc1tydWxlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgICAgICAgICAgb3B0aW9ucy5tZXNzYWdlc1tydWxlTmFtZV0gPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcGxpdEFuZFRyaW0odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpLnNwbGl0KC9cXHMqLFxccyovZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXNjYXBlQXR0cmlidXRlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgLy8gQXMgbWVudGlvbmVkIG9uIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9jYXRlZ29yeS9zZWxlY3RvcnMvXG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oWyFcIiMkJSYnKCkqKywuLzo7PD0+P0BcXFtcXFxcXFxdXmB7fH1+XSkvZywgXCJcXFxcJDFcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TW9kZWxQcmVmaXgoZmllbGROYW1lKSB7XG4gICAgICAgIHJldHVybiBmaWVsZE5hbWUuc3Vic3RyKDAsIGZpZWxkTmFtZS5sYXN0SW5kZXhPZihcIi5cIikgKyAxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRNb2RlbFByZWZpeCh2YWx1ZSwgcHJlZml4KSB7XG4gICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKFwiKi5cIikgPT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiouXCIsIHByZWZpeCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IsIGlucHV0RWxlbWVudCkgeyAgLy8gJ3RoaXMnIGlzIHRoZSBmb3JtIGVsZW1lbnRcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQodGhpcykuZmluZChcIltkYXRhLXZhbG1zZy1mb3I9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUoaW5wdXRFbGVtZW50WzBdLm5hbWUpICsgXCInXVwiKSxcbiAgICAgICAgICAgIHJlcGxhY2VBdHRyVmFsdWUgPSBjb250YWluZXIuYXR0cihcImRhdGEtdmFsbXNnLXJlcGxhY2VcIiksXG4gICAgICAgICAgICByZXBsYWNlID0gcmVwbGFjZUF0dHJWYWx1ZSA/ICQucGFyc2VKU09OKHJlcGxhY2VBdHRyVmFsdWUpICE9PSBmYWxzZSA6IG51bGw7XG5cbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKFwiZmllbGQtdmFsaWRhdGlvbi12YWxpZFwiKS5hZGRDbGFzcyhcImZpZWxkLXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIGVycm9yLmRhdGEoXCJ1bm9idHJ1c2l2ZUNvbnRhaW5lclwiLCBjb250YWluZXIpO1xuXG4gICAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgICAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgICAgIGVycm9yLnJlbW92ZUNsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcnMoZXZlbnQsIHZhbGlkYXRvcikgeyAgLy8gJ3RoaXMnIGlzIHRoZSBmb3JtIGVsZW1lbnRcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQodGhpcykuZmluZChcIltkYXRhLXZhbG1zZy1zdW1tYXJ5PXRydWVdXCIpLFxuICAgICAgICAgICAgbGlzdCA9IGNvbnRhaW5lci5maW5kKFwidWxcIik7XG5cbiAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGggJiYgdmFsaWRhdG9yLmVycm9yTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxpc3QuZW1wdHkoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIikucmVtb3ZlQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktdmFsaWRcIik7XG5cbiAgICAgICAgICAgICQuZWFjaCh2YWxpZGF0b3IuZXJyb3JMaXN0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJChcIjxsaSAvPlwiKS5odG1sKHRoaXMubWVzc2FnZSkuYXBwZW5kVG8obGlzdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uU3VjY2VzcyhlcnJvcikgeyAgLy8gJ3RoaXMnIGlzIHRoZSBmb3JtIGVsZW1lbnRcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGVycm9yLmRhdGEoXCJ1bm9idHJ1c2l2ZUNvbnRhaW5lclwiKTtcblxuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICB2YXIgcmVwbGFjZUF0dHJWYWx1ZSA9IGNvbnRhaW5lci5hdHRyKFwiZGF0YS12YWxtc2ctcmVwbGFjZVwiKSxcbiAgICAgICAgICAgICAgICByZXBsYWNlID0gcmVwbGFjZUF0dHJWYWx1ZSA/ICQucGFyc2VKU09OKHJlcGxhY2VBdHRyVmFsdWUpIDogbnVsbDtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKFwiZmllbGQtdmFsaWRhdGlvbi12YWxpZFwiKS5yZW1vdmVDbGFzcyhcImZpZWxkLXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICBlcnJvci5yZW1vdmVEYXRhKFwidW5vYnRydXNpdmVDb250YWluZXJcIik7XG5cbiAgICAgICAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblJlc2V0KGV2ZW50KSB7ICAvLyAndGhpcycgaXMgdGhlIGZvcm0gZWxlbWVudFxuICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAga2V5ID0gJ19fanF1ZXJ5X3Vub2J0cnVzaXZlX3ZhbGlkYXRpb25fZm9ybV9yZXNldCc7XG4gICAgICAgIGlmICgkZm9ybS5kYXRhKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdlJ3JlIGN1cnJlbnRseSByZXNldHRpbmcgdGhlIGZvcm0uXG4gICAgICAgICRmb3JtLmRhdGEoa2V5LCB0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICRmb3JtLmRhdGEoXCJ2YWxpZGF0b3JcIikucmVzZXRGb3JtKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAkZm9ybS5yZW1vdmVEYXRhKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAkZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIilcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS12YWxpZFwiKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LWVycm9yc1wiKTtcbiAgICAgICAgJGZvcm0uZmluZChcIi5maWVsZC12YWxpZGF0aW9uLWVycm9yXCIpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJmaWVsZC12YWxpZGF0aW9uLXZhbGlkXCIpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJmaWVsZC12YWxpZGF0aW9uLWVycm9yXCIpXG4gICAgICAgICAgICAucmVtb3ZlRGF0YShcInVub2J0cnVzaXZlQ29udGFpbmVyXCIpXG4gICAgICAgICAgICAuZmluZChcIj4qXCIpICAvLyBJZiB3ZSB3ZXJlIHVzaW5nIHZhbG1zZy1yZXBsYWNlLCBnZXQgdGhlIHVuZGVybHlpbmcgZXJyb3JcbiAgICAgICAgICAgICAgICAucmVtb3ZlRGF0YShcInVub2J0cnVzaXZlQ29udGFpbmVyXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRpb25JbmZvKGZvcm0pIHtcbiAgICAgICAgdmFyICRmb3JtID0gJChmb3JtKSxcbiAgICAgICAgICAgIHJlc3VsdCA9ICRmb3JtLmRhdGEoZGF0YV92YWxpZGF0aW9uKSxcbiAgICAgICAgICAgIG9uUmVzZXRQcm94eSA9ICQucHJveHkob25SZXNldCwgZm9ybSksXG4gICAgICAgICAgICBkZWZhdWx0T3B0aW9ucyA9ICRqUXZhbC51bm9idHJ1c2l2ZS5vcHRpb25zIHx8IHt9LFxuICAgICAgICAgICAgZXhlY0luQ29udGV4dCA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmMgPSBkZWZhdWx0T3B0aW9uc1tuYW1lXTtcbiAgICAgICAgICAgICAgICBmdW5jICYmICQuaXNGdW5jdGlvbihmdW5jKSAmJiBmdW5jLmFwcGx5KGZvcm0sIGFyZ3MpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHsgIC8vIG9wdGlvbnMgc3RydWN0dXJlIHBhc3NlZCB0byBqUXVlcnkgVmFsaWRhdGUncyB2YWxpZGF0ZSgpIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICBlcnJvckNsYXNzOiBkZWZhdWx0T3B0aW9ucy5lcnJvckNsYXNzIHx8IFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICBlcnJvckVsZW1lbnQ6IGRlZmF1bHRPcHRpb25zLmVycm9yRWxlbWVudCB8fCBcInNwYW5cIixcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IuYXBwbHkoZm9ybSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWNJbkNvbnRleHQoXCJlcnJvclBsYWNlbWVudFwiLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkSGFuZGxlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcnMuYXBwbHkoZm9ybSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWNJbkNvbnRleHQoXCJpbnZhbGlkSGFuZGxlclwiLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlczoge30sXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25TdWNjZXNzLmFwcGx5KGZvcm0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjSW5Db250ZXh0KFwic3VjY2Vzc1wiLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhdHRhY2hWYWxpZGF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAub2ZmKFwicmVzZXQuXCIgKyBkYXRhX3ZhbGlkYXRpb24sIG9uUmVzZXRQcm94eSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcInJlc2V0LlwiICsgZGF0YV92YWxpZGF0aW9uLCBvblJlc2V0UHJveHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsaWRhdGUodGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7ICAvLyBhIHZhbGlkYXRpb24gZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdW5vYnRydXNpdmUgQWpheFxuICAgICAgICAgICAgICAgICAgICAkZm9ybS52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZvcm0udmFsaWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGZvcm0uZGF0YShkYXRhX3ZhbGlkYXRpb24sIHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgICRqUXZhbC51bm9idHJ1c2l2ZSA9IHtcbiAgICAgICAgYWRhcHRlcnM6IFtdLFxuXG4gICAgICAgIHBhcnNlRWxlbWVudDogZnVuY3Rpb24gKGVsZW1lbnQsIHNraXBBdHRhY2gpIHtcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgICAgIC8vLyBQYXJzZXMgYSBzaW5nbGUgSFRNTCBlbGVtZW50IGZvciB1bm9idHJ1c2l2ZSB2YWxpZGF0aW9uIGF0dHJpYnV0ZXMuXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxuICAgICAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiZWxlbWVudFwiIGRvbUVsZW1lbnQ9XCJ0cnVlXCI+VGhlIEhUTUwgZWxlbWVudCB0byBiZSBwYXJzZWQuPC9wYXJhbT5cbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInNraXBBdHRhY2hcIiB0eXBlPVwiQm9vbGVhblwiPltPcHRpb25hbF0gdHJ1ZSB0byBza2lwIGF0dGFjaGluZyB0aGVcbiAgICAgICAgICAgIC8vLyB2YWxpZGF0aW9uIHRvIHRoZSBmb3JtLiBJZiBwYXJzaW5nIGp1c3QgdGhpcyBzaW5nbGUgZWxlbWVudCwgeW91IHNob3VsZCBzcGVjaWZ5IHRydWUuXG4gICAgICAgICAgICAvLy8gSWYgcGFyc2luZyBzZXZlcmFsIGVsZW1lbnRzLCB5b3Ugc2hvdWxkIHNwZWNpZnkgZmFsc2UsIGFuZCBtYW51YWxseSBhdHRhY2ggdGhlIHZhbGlkYXRpb25cbiAgICAgICAgICAgIC8vLyB0byB0aGUgZm9ybSB3aGVuIHlvdSBhcmUgZmluaXNoZWQuIFRoZSBkZWZhdWx0IGlzIGZhbHNlLjwvcGFyYW0+XG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGZvcm0gPSAkZWxlbWVudC5wYXJlbnRzKFwiZm9ybVwiKVswXSxcbiAgICAgICAgICAgICAgICB2YWxJbmZvLCBydWxlcywgbWVzc2FnZXM7XG5cbiAgICAgICAgICAgIGlmICghZm9ybSkgeyAgLy8gQ2Fubm90IGRvIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gd2l0aG91dCBhIGZvcm1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbEluZm8gPSB2YWxpZGF0aW9uSW5mbyhmb3JtKTtcbiAgICAgICAgICAgIHZhbEluZm8ub3B0aW9ucy5ydWxlc1tlbGVtZW50Lm5hbWVdID0gcnVsZXMgPSB7fTtcbiAgICAgICAgICAgIHZhbEluZm8ub3B0aW9ucy5tZXNzYWdlc1tlbGVtZW50Lm5hbWVdID0gbWVzc2FnZXMgPSB7fTtcblxuICAgICAgICAgICAgJC5lYWNoKHRoaXMuYWRhcHRlcnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZml4ID0gXCJkYXRhLXZhbC1cIiArIHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9ICRlbGVtZW50LmF0dHIocHJlZml4KSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1WYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQpIHsgIC8vIENvbXBhcmUgYWdhaW5zdCB1bmRlZmluZWQsIGJlY2F1c2UgYW4gZW1wdHkgbWVzc2FnZSBpcyBsZWdhbCAoYW5kIGZhbHN5KVxuICAgICAgICAgICAgICAgICAgICBwcmVmaXggKz0gXCItXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHRoaXMucGFyYW1zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbVZhbHVlc1t0aGlzXSA9ICRlbGVtZW50LmF0dHIocHJlZml4ICsgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm06IGZvcm0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbVZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBydWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5leHRlbmQocnVsZXMsIHsgXCJfX2R1bW15X19cIjogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKCFza2lwQXR0YWNoKSB7XG4gICAgICAgICAgICAgICAgdmFsSW5mby5hdHRhY2hWYWxpZGF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxuICAgICAgICAgICAgLy8vIFBhcnNlcyBhbGwgdGhlIEhUTUwgZWxlbWVudHMgaW4gdGhlIHNwZWNpZmllZCBzZWxlY3Rvci4gSXQgbG9va3MgZm9yIGlucHV0IGVsZW1lbnRzIGRlY29yYXRlZFxuICAgICAgICAgICAgLy8vIHdpdGggdGhlIFtkYXRhLXZhbD10cnVlXSBhdHRyaWJ1dGUgdmFsdWUgYW5kIGVuYWJsZXMgdmFsaWRhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIGRhdGEtdmFsLSpcbiAgICAgICAgICAgIC8vLyBhdHRyaWJ1dGUgdmFsdWVzLlxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cbiAgICAgICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cInNlbGVjdG9yXCIgdHlwZT1cIlN0cmluZ1wiPkFueSB2YWxpZCBqUXVlcnkgc2VsZWN0b3IuPC9wYXJhbT5cblxuICAgICAgICAgICAgLy8gJGZvcm1zIGluY2x1ZGVzIGFsbCBmb3JtcyBpbiBzZWxlY3RvcidzIERPTSBoaWVyYXJjaHkgKHBhcmVudCwgY2hpbGRyZW4gYW5kIHNlbGYpIHRoYXQgaGF2ZSBhdCBsZWFzdCBvbmVcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2l0aCBkYXRhLXZhbD10cnVlXG4gICAgICAgICAgICB2YXIgJHNlbGVjdG9yID0gJChzZWxlY3RvciksXG4gICAgICAgICAgICAgICAgJGZvcm1zID0gJHNlbGVjdG9yLnBhcmVudHMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRCYWNrKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKFwiZm9ybVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGQoJHNlbGVjdG9yLmZpbmQoXCJmb3JtXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5oYXMoXCJbZGF0YS12YWw9dHJ1ZV1cIik7XG5cbiAgICAgICAgICAgICRzZWxlY3Rvci5maW5kKFwiW2RhdGEtdmFsPXRydWVdXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRqUXZhbC51bm9idHJ1c2l2ZS5wYXJzZUVsZW1lbnQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGZvcm1zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbmZvID0gdmFsaWRhdGlvbkluZm8odGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mby5hdHRhY2hWYWxpZGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYWRhcHRlcnMgPSAkalF2YWwudW5vYnRydXNpdmUuYWRhcHRlcnM7XG5cbiAgICBhZGFwdGVycy5hZGQgPSBmdW5jdGlvbiAoYWRhcHRlck5hbWUsIHBhcmFtcywgZm4pIHtcbiAgICAgICAgLy8vIDxzdW1tYXJ5PkFkZHMgYSBuZXcgYWRhcHRlciB0byBjb252ZXJ0IHVub2J0cnVzaXZlIEhUTUwgaW50byBhIGpRdWVyeSBWYWxpZGF0ZSB2YWxpZGF0aW9uLjwvc3VtbWFyeT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYWRhcHRlck5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGFkYXB0ZXIgdG8gYmUgYWRkZWQuIFRoaXMgbWF0Y2hlcyB0aGUgbmFtZSB1c2VkXG4gICAgICAgIC8vLyBpbiB0aGUgZGF0YS12YWwtbm5ubiBIVE1MIGF0dHJpYnV0ZSAod2hlcmUgbm5ubiBpcyB0aGUgYWRhcHRlciBuYW1lKS48L3BhcmFtPlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJwYXJhbXNcIiB0eXBlPVwiQXJyYXlcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIEFuIGFycmF5IG9mIHBhcmFtZXRlciBuYW1lcyAoc3RyaW5ncykgdGhhdCB3aWxsXG4gICAgICAgIC8vLyBiZSBleHRyYWN0ZWQgZnJvbSB0aGUgZGF0YS12YWwtbm5ubi1tbW1tIEhUTUwgYXR0cmlidXRlcyAod2hlcmUgbm5ubiBpcyB0aGUgYWRhcHRlciBuYW1lLCBhbmRcbiAgICAgICAgLy8vIG1tbW0gaXMgdGhlIHBhcmFtZXRlciBuYW1lKS48L3BhcmFtPlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJmblwiIHR5cGU9XCJGdW5jdGlvblwiPlRoZSBmdW5jdGlvbiB0byBjYWxsLCB3aGljaCBhZGFwdHMgdGhlIHZhbHVlcyBmcm9tIHRoZSBIVE1MXG4gICAgICAgIC8vLyBhdHRyaWJ1dGVzIGludG8galF1ZXJ5IFZhbGlkYXRlIHJ1bGVzIGFuZC9vciBtZXNzYWdlcy48L3BhcmFtPlxuICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeS52YWxpZGF0b3IudW5vYnRydXNpdmUuYWRhcHRlcnNcIiAvPlxuICAgICAgICBpZiAoIWZuKSB7ICAvLyBDYWxsZWQgd2l0aCBubyBwYXJhbXMsIGp1c3QgYSBmdW5jdGlvblxuICAgICAgICAgICAgZm4gPSBwYXJhbXM7XG4gICAgICAgICAgICBwYXJhbXMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2goeyBuYW1lOiBhZGFwdGVyTmFtZSwgcGFyYW1zOiBwYXJhbXMsIGFkYXB0OiBmbiB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIGFkYXB0ZXJzLmFkZEJvb2wgPSBmdW5jdGlvbiAoYWRhcHRlck5hbWUsIHJ1bGVOYW1lKSB7XG4gICAgICAgIC8vLyA8c3VtbWFyeT5BZGRzIGEgbmV3IGFkYXB0ZXIgdG8gY29udmVydCB1bm9idHJ1c2l2ZSBIVE1MIGludG8gYSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbiwgd2hlcmVcbiAgICAgICAgLy8vIHRoZSBqUXVlcnkgVmFsaWRhdGUgdmFsaWRhdGlvbiBydWxlIGhhcyBubyBwYXJhbWV0ZXIgdmFsdWVzLjwvc3VtbWFyeT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYWRhcHRlck5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGFkYXB0ZXIgdG8gYmUgYWRkZWQuIFRoaXMgbWF0Y2hlcyB0aGUgbmFtZSB1c2VkXG4gICAgICAgIC8vLyBpbiB0aGUgZGF0YS12YWwtbm5ubiBIVE1MIGF0dHJpYnV0ZSAod2hlcmUgbm5ubiBpcyB0aGUgYWRhcHRlciBuYW1lKS48L3BhcmFtPlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJydWxlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBqUXVlcnkgVmFsaWRhdGUgcnVsZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgdmFsdWVcbiAgICAgICAgLy8vIG9mIGFkYXB0ZXJOYW1lIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLjwvcGFyYW0+XG4gICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwialF1ZXJ5LnZhbGlkYXRvci51bm9idHJ1c2l2ZS5hZGFwdGVyc1wiIC8+XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhZGFwdGVyTmFtZSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgcnVsZU5hbWUgfHwgYWRhcHRlck5hbWUsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYWRhcHRlcnMuYWRkTWluTWF4ID0gZnVuY3Rpb24gKGFkYXB0ZXJOYW1lLCBtaW5SdWxlTmFtZSwgbWF4UnVsZU5hbWUsIG1pbk1heFJ1bGVOYW1lLCBtaW5BdHRyaWJ1dGUsIG1heEF0dHJpYnV0ZSkge1xuICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIG5ldyBhZGFwdGVyIHRvIGNvbnZlcnQgdW5vYnRydXNpdmUgSFRNTCBpbnRvIGEgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24sIHdoZXJlXG4gICAgICAgIC8vLyB0aGUgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24gaGFzIHRocmVlIHBvdGVudGlhbCBydWxlcyAob25lIGZvciBtaW4tb25seSwgb25lIGZvciBtYXgtb25seSwgYW5kXG4gICAgICAgIC8vLyBvbmUgZm9yIG1pbi1hbmQtbWF4KS4gVGhlIEhUTUwgcGFyYW1ldGVycyBhcmUgZXhwZWN0ZWQgdG8gYmUgbmFtZWQgLW1pbiBhbmQgLW1heC48L3N1bW1hcnk+XG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImFkYXB0ZXJOYW1lXCIgdHlwZT1cIlN0cmluZ1wiPlRoZSBuYW1lIG9mIHRoZSBhZGFwdGVyIHRvIGJlIGFkZGVkLiBUaGlzIG1hdGNoZXMgdGhlIG5hbWUgdXNlZFxuICAgICAgICAvLy8gaW4gdGhlIGRhdGEtdmFsLW5ubm4gSFRNTCBhdHRyaWJ1dGUgKHdoZXJlIG5ubm4gaXMgdGhlIGFkYXB0ZXIgbmFtZSkuPC9wYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWluUnVsZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGpRdWVyeSBWYWxpZGF0ZSBydWxlIHRvIGJlIHVzZWQgd2hlbiB5b3Ugb25seVxuICAgICAgICAvLy8gaGF2ZSBhIG1pbmltdW0gdmFsdWUuPC9wYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWF4UnVsZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGpRdWVyeSBWYWxpZGF0ZSBydWxlIHRvIGJlIHVzZWQgd2hlbiB5b3Ugb25seVxuICAgICAgICAvLy8gaGF2ZSBhIG1heGltdW0gdmFsdWUuPC9wYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWluTWF4UnVsZU5hbWVcIiB0eXBlPVwiU3RyaW5nXCI+VGhlIG5hbWUgb2YgdGhlIGpRdWVyeSBWYWxpZGF0ZSBydWxlIHRvIGJlIHVzZWQgd2hlbiB5b3VcbiAgICAgICAgLy8vIGhhdmUgYm90aCBhIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWUuPC9wYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwibWluQXR0cmlidXRlXCIgdHlwZT1cIlN0cmluZ1wiIG9wdGlvbmFsPVwidHJ1ZVwiPltPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIEhUTUwgYXR0cmlidXRlIHRoYXRcbiAgICAgICAgLy8vIGNvbnRhaW5zIHRoZSBtaW5pbXVtIHZhbHVlLiBUaGUgZGVmYXVsdCBpcyBcIm1pblwiLjwvcGFyYW0+XG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cIm1heEF0dHJpYnV0ZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGF0dHJpYnV0ZSB0aGF0XG4gICAgICAgIC8vLyBjb250YWlucyB0aGUgbWF4aW11bSB2YWx1ZS4gVGhlIGRlZmF1bHQgaXMgXCJtYXhcIi48L3BhcmFtPlxuICAgICAgICAvLy8gPHJldHVybnMgdHlwZT1cImpRdWVyeS52YWxpZGF0b3IudW5vYnRydXNpdmUuYWRhcHRlcnNcIiAvPlxuICAgICAgICByZXR1cm4gdGhpcy5hZGQoYWRhcHRlck5hbWUsIFttaW5BdHRyaWJ1dGUgfHwgXCJtaW5cIiwgbWF4QXR0cmlidXRlIHx8IFwibWF4XCJdLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIG1pbiA9IG9wdGlvbnMucGFyYW1zLm1pbixcbiAgICAgICAgICAgICAgICBtYXggPSBvcHRpb25zLnBhcmFtcy5tYXg7XG5cbiAgICAgICAgICAgIGlmIChtaW4gJiYgbWF4KSB7XG4gICAgICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBtaW5NYXhSdWxlTmFtZSwgW21pbiwgbWF4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtaW4pIHtcbiAgICAgICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIG1pblJ1bGVOYW1lLCBtaW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWF4KSB7XG4gICAgICAgICAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBtYXhSdWxlTmFtZSwgbWF4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFkYXB0ZXJzLmFkZFNpbmdsZVZhbCA9IGZ1bmN0aW9uIChhZGFwdGVyTmFtZSwgYXR0cmlidXRlLCBydWxlTmFtZSkge1xuICAgICAgICAvLy8gPHN1bW1hcnk+QWRkcyBhIG5ldyBhZGFwdGVyIHRvIGNvbnZlcnQgdW5vYnRydXNpdmUgSFRNTCBpbnRvIGEgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24sIHdoZXJlXG4gICAgICAgIC8vLyB0aGUgalF1ZXJ5IFZhbGlkYXRlIHZhbGlkYXRpb24gcnVsZSBoYXMgYSBzaW5nbGUgdmFsdWUuPC9zdW1tYXJ5PlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJhZGFwdGVyTmFtZVwiIHR5cGU9XCJTdHJpbmdcIj5UaGUgbmFtZSBvZiB0aGUgYWRhcHRlciB0byBiZSBhZGRlZC4gVGhpcyBtYXRjaGVzIHRoZSBuYW1lIHVzZWRcbiAgICAgICAgLy8vIGluIHRoZSBkYXRhLXZhbC1ubm5uIEhUTUwgYXR0cmlidXRlKHdoZXJlIG5ubm4gaXMgdGhlIGFkYXB0ZXIgbmFtZSkuPC9wYXJhbT5cbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiYXR0cmlidXRlXCIgdHlwZT1cIlN0cmluZ1wiPltPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIEhUTUwgYXR0cmlidXRlIHRoYXQgY29udGFpbnMgdGhlIHZhbHVlLlxuICAgICAgICAvLy8gVGhlIGRlZmF1bHQgaXMgXCJ2YWxcIi48L3BhcmFtPlxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJydWxlTmFtZVwiIHR5cGU9XCJTdHJpbmdcIiBvcHRpb25hbD1cInRydWVcIj5bT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBqUXVlcnkgVmFsaWRhdGUgcnVsZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgdmFsdWVcbiAgICAgICAgLy8vIG9mIGFkYXB0ZXJOYW1lIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLjwvcGFyYW0+XG4gICAgICAgIC8vLyA8cmV0dXJucyB0eXBlPVwialF1ZXJ5LnZhbGlkYXRvci51bm9idHJ1c2l2ZS5hZGFwdGVyc1wiIC8+XG4gICAgICAgIHJldHVybiB0aGlzLmFkZChhZGFwdGVyTmFtZSwgW2F0dHJpYnV0ZSB8fCBcInZhbFwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgcnVsZU5hbWUgfHwgYWRhcHRlck5hbWUsIG9wdGlvbnMucGFyYW1zW2F0dHJpYnV0ZV0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJGpRdmFsLmFkZE1ldGhvZChcIl9fZHVtbXlfX1wiLCBmdW5jdGlvbiAodmFsdWUsIGVsZW1lbnQsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgICRqUXZhbC5hZGRNZXRob2QoXCJyZWdleFwiLCBmdW5jdGlvbiAodmFsdWUsIGVsZW1lbnQsIHBhcmFtcykge1xuICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbmFsKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdGNoID0gbmV3IFJlZ0V4cChwYXJhbXMpLmV4ZWModmFsdWUpO1xuICAgICAgICByZXR1cm4gKG1hdGNoICYmIChtYXRjaC5pbmRleCA9PT0gMCkgJiYgKG1hdGNoWzBdLmxlbmd0aCA9PT0gdmFsdWUubGVuZ3RoKSk7XG4gICAgfSk7XG5cbiAgICAkalF2YWwuYWRkTWV0aG9kKFwibm9uYWxwaGFtaW5cIiwgZnVuY3Rpb24gKHZhbHVlLCBlbGVtZW50LCBub25hbHBoYW1pbikge1xuICAgICAgICB2YXIgbWF0Y2g7XG4gICAgICAgIGlmIChub25hbHBoYW1pbikge1xuICAgICAgICAgICAgbWF0Y2ggPSB2YWx1ZS5tYXRjaCgvXFxXL2cpO1xuICAgICAgICAgICAgbWF0Y2ggPSBtYXRjaCAmJiBtYXRjaC5sZW5ndGggPj0gbm9uYWxwaGFtaW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCRqUXZhbC5tZXRob2RzLmV4dGVuc2lvbikge1xuICAgICAgICBhZGFwdGVycy5hZGRTaW5nbGVWYWwoXCJhY2NlcHRcIiwgXCJtaW10eXBlXCIpO1xuICAgICAgICBhZGFwdGVycy5hZGRTaW5nbGVWYWwoXCJleHRlbnNpb25cIiwgXCJleHRlbnNpb25cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHdoZW4gdGhlICdleHRlbnNpb24nIHZhbGlkYXRpb24gbWV0aG9kIGRvZXMgbm90IGV4aXN0LCBzdWNoIGFzIHdpdGggdmVyc2lvbnNcbiAgICAgICAgLy8gb2YgSlF1ZXJ5IFZhbGlkYXRpb24gcGx1Z2luIHByaW9yIHRvIDEuMTAsIHdlIHNob3VsZCB1c2UgdGhlICdhY2NlcHQnIG1ldGhvZCBmb3JcbiAgICAgICAgLy8gdmFsaWRhdGluZyB0aGUgZXh0ZW5zaW9uLCBhbmQgaWdub3JlIG1pbWUtdHlwZSB2YWxpZGF0aW9ucyBhcyB0aGV5IGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgICAgICBhZGFwdGVycy5hZGRTaW5nbGVWYWwoXCJleHRlbnNpb25cIiwgXCJleHRlbnNpb25cIiwgXCJhY2NlcHRcIik7XG4gICAgfVxuXG4gICAgYWRhcHRlcnMuYWRkU2luZ2xlVmFsKFwicmVnZXhcIiwgXCJwYXR0ZXJuXCIpO1xuICAgIGFkYXB0ZXJzLmFkZEJvb2woXCJjcmVkaXRjYXJkXCIpLmFkZEJvb2woXCJkYXRlXCIpLmFkZEJvb2woXCJkaWdpdHNcIikuYWRkQm9vbChcImVtYWlsXCIpLmFkZEJvb2woXCJudW1iZXJcIikuYWRkQm9vbChcInVybFwiKTtcbiAgICBhZGFwdGVycy5hZGRNaW5NYXgoXCJsZW5ndGhcIiwgXCJtaW5sZW5ndGhcIiwgXCJtYXhsZW5ndGhcIiwgXCJyYW5nZWxlbmd0aFwiKS5hZGRNaW5NYXgoXCJyYW5nZVwiLCBcIm1pblwiLCBcIm1heFwiLCBcInJhbmdlXCIpO1xuICAgIGFkYXB0ZXJzLmFkZE1pbk1heChcIm1pbmxlbmd0aFwiLCBcIm1pbmxlbmd0aFwiKS5hZGRNaW5NYXgoXCJtYXhsZW5ndGhcIiwgXCJtaW5sZW5ndGhcIiwgXCJtYXhsZW5ndGhcIik7XG4gICAgYWRhcHRlcnMuYWRkKFwiZXF1YWx0b1wiLCBbXCJvdGhlclwiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9IGdldE1vZGVsUHJlZml4KG9wdGlvbnMuZWxlbWVudC5uYW1lKSxcbiAgICAgICAgICAgIG90aGVyID0gb3B0aW9ucy5wYXJhbXMub3RoZXIsXG4gICAgICAgICAgICBmdWxsT3RoZXJOYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgob3RoZXIsIHByZWZpeCksXG4gICAgICAgICAgICBlbGVtZW50ID0gJChvcHRpb25zLmZvcm0pLmZpbmQoXCI6aW5wdXRcIikuZmlsdGVyKFwiW25hbWU9J1wiICsgZXNjYXBlQXR0cmlidXRlVmFsdWUoZnVsbE90aGVyTmFtZSkgKyBcIiddXCIpWzBdO1xuXG4gICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgXCJlcXVhbFRvXCIsIGVsZW1lbnQpO1xuICAgIH0pO1xuICAgIGFkYXB0ZXJzLmFkZChcInJlcXVpcmVkXCIsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIC8vIGpRdWVyeSBWYWxpZGF0ZSBlcXVhdGVzIFwicmVxdWlyZWRcIiB3aXRoIFwibWFuZGF0b3J5XCIgZm9yIGNoZWNrYm94IGVsZW1lbnRzXG4gICAgICAgIGlmIChvcHRpb25zLmVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpICE9PSBcIklOUFVUXCIgfHwgb3B0aW9ucy5lbGVtZW50LnR5cGUudG9VcHBlckNhc2UoKSAhPT0gXCJDSEVDS0JPWFwiKSB7XG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwicmVxdWlyZWRcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBhZGFwdGVycy5hZGQoXCJyZW1vdGVcIiwgW1widXJsXCIsIFwidHlwZVwiLCBcImFkZGl0aW9uYWxmaWVsZHNcIl0sIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHtcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy5wYXJhbXMudXJsLFxuICAgICAgICAgICAgdHlwZTogb3B0aW9ucy5wYXJhbXMudHlwZSB8fCBcIkdFVFwiLFxuICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgfSxcbiAgICAgICAgICAgIHByZWZpeCA9IGdldE1vZGVsUHJlZml4KG9wdGlvbnMuZWxlbWVudC5uYW1lKTtcblxuICAgICAgICAkLmVhY2goc3BsaXRBbmRUcmltKG9wdGlvbnMucGFyYW1zLmFkZGl0aW9uYWxmaWVsZHMgfHwgb3B0aW9ucy5lbGVtZW50Lm5hbWUpLCBmdW5jdGlvbiAoaSwgZmllbGROYW1lKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1OYW1lID0gYXBwZW5kTW9kZWxQcmVmaXgoZmllbGROYW1lLCBwcmVmaXgpO1xuICAgICAgICAgICAgdmFsdWUuZGF0YVtwYXJhbU5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9ICQob3B0aW9ucy5mb3JtKS5maW5kKFwiOmlucHV0XCIpLmZpbHRlcihcIltuYW1lPSdcIiArIGVzY2FwZUF0dHJpYnV0ZVZhbHVlKHBhcmFtTmFtZSkgKyBcIiddXCIpO1xuICAgICAgICAgICAgICAgIC8vIEZvciBjaGVja2JveGVzIGFuZCByYWRpbyBidXR0b25zLCBvbmx5IHBpY2sgdXAgdmFsdWVzIGZyb20gY2hlY2tlZCBmaWVsZHMuXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLmlzKFwiOmNoZWNrYm94XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC5maWx0ZXIoXCI6Y2hlY2tlZFwiKS52YWwoKSB8fCBmaWVsZC5maWx0ZXIoXCI6aGlkZGVuXCIpLnZhbCgpIHx8ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChmaWVsZC5pcyhcIjpyYWRpb1wiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmllbGQuZmlsdGVyKFwiOmNoZWNrZWRcIikudmFsKCkgfHwgJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC52YWwoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgXCJyZW1vdGVcIiwgdmFsdWUpO1xuICAgIH0pO1xuICAgIGFkYXB0ZXJzLmFkZChcInBhc3N3b3JkXCIsIFtcIm1pblwiLCBcIm5vbmFscGhhbWluXCIsIFwicmVnZXhcIl0sIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnBhcmFtcy5taW4pIHtcbiAgICAgICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgXCJtaW5sZW5ndGhcIiwgb3B0aW9ucy5wYXJhbXMubWluKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5wYXJhbXMubm9uYWxwaGFtaW4pIHtcbiAgICAgICAgICAgIHNldFZhbGlkYXRpb25WYWx1ZXMob3B0aW9ucywgXCJub25hbHBoYW1pblwiLCBvcHRpb25zLnBhcmFtcy5ub25hbHBoYW1pbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucGFyYW1zLnJlZ2V4KSB7XG4gICAgICAgICAgICBzZXRWYWxpZGF0aW9uVmFsdWVzKG9wdGlvbnMsIFwicmVnZXhcIiwgb3B0aW9ucy5wYXJhbXMucmVnZXgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgYWRhcHRlcnMuYWRkKFwiZmlsZWV4dGVuc2lvbnNcIiwgW1wiZXh0ZW5zaW9uc1wiXSwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgc2V0VmFsaWRhdGlvblZhbHVlcyhvcHRpb25zLCBcImV4dGVuc2lvblwiLCBvcHRpb25zLnBhcmFtcy5leHRlbnNpb25zKTtcbiAgICB9KTtcblxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkalF2YWwudW5vYnRydXNpdmUucGFyc2UoZG9jdW1lbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRqUXZhbC51bm9idHJ1c2l2ZTtcbn0pKTsiXSwiZmlsZSI6ImxpYi9qcXVlcnktdmFsaWRhdGlvbi11bm9idHJ1c2l2ZS9qcXVlcnkudmFsaWRhdGUudW5vYnRydXNpdmUuZXM1LmpzIn0=
