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
    define(["jquery"], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function ($) {
  $.extend($.fn, {
    // https://jqueryvalidation.org/validate/
    validate: function validate(options) {
      // If nothing is selected, return nothing; can't chain anyway
      if (!this.length) {
        if (options && options.debug && window.console) {
          console.warn("Nothing selected, can't validate, returning nothing.");
        }

        return;
      } // Check if a validator for this form was already created


      var validator = $.data(this[0], "validator");

      if (validator) {
        return validator;
      } // Add novalidate tag if HTML5.


      this.attr("novalidate", "novalidate");
      validator = new $.validator(options, this[0]);
      $.data(this[0], "validator", validator);

      if (validator.settings.onsubmit) {
        this.on("click.validate", ":submit", function (event) {
          // Track the used submit button to properly handle scripted
          // submits later.
          validator.submitButton = event.currentTarget; // Allow suppressing validation by adding a cancel class to the submit button

          if ($(this).hasClass("cancel")) {
            validator.cancelSubmit = true;
          } // Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button


          if ($(this).attr("formnovalidate") !== undefined) {
            validator.cancelSubmit = true;
          }
        }); // Validate the form on submit

        this.on("submit.validate", function (event) {
          if (validator.settings.debug) {
            // Prevent form submit to be able to see console output
            event.preventDefault();
          }

          function handle() {
            var hidden, result; // Insert a hidden input as a replacement for the missing submit button
            // The hidden input is inserted in two cases:
            //   - A user defined a `submitHandler`
            //   - There was a pending request due to `remote` method and `stopRequest()`
            //     was called to submit the form in case it's valid

            if (validator.submitButton && (validator.settings.submitHandler || validator.formSubmitted)) {
              hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm);
            }

            if (validator.settings.submitHandler) {
              result = validator.settings.submitHandler.call(validator, validator.currentForm, event);

              if (hidden) {
                // And clean up afterwards; thanks to no-block-scope, hidden can be referenced
                hidden.remove();
              }

              if (result !== undefined) {
                return result;
              }

              return false;
            }

            return true;
          } // Prevent submit for invalid forms or custom submit handlers


          if (validator.cancelSubmit) {
            validator.cancelSubmit = false;
            return handle();
          }

          if (validator.form()) {
            if (validator.pendingRequest) {
              validator.formSubmitted = true;
              return false;
            }

            return handle();
          } else {
            validator.focusInvalid();
            return false;
          }
        });
      }

      return validator;
    },
    // https://jqueryvalidation.org/valid/
    valid: function valid() {
      var valid, validator, errorList;

      if ($(this[0]).is("form")) {
        valid = this.validate().form();
      } else {
        errorList = [];
        valid = true;
        validator = $(this[0].form).validate();
        this.each(function () {
          valid = validator.element(this) && valid;

          if (!valid) {
            errorList = errorList.concat(validator.errorList);
          }
        });
        validator.errorList = errorList;
      }

      return valid;
    },
    // https://jqueryvalidation.org/rules/
    rules: function rules(command, argument) {
      var element = this[0],
          settings,
          staticRules,
          existingRules,
          data,
          param,
          filtered; // If nothing is selected, return empty object; can't chain anyway

      if (element == null) {
        return;
      }

      if (!element.form && element.hasAttribute("contenteditable")) {
        element.form = this.closest("form")[0];
        element.name = this.attr("name");
      }

      if (element.form == null) {
        return;
      }

      if (command) {
        settings = $.data(element.form, "validator").settings;
        staticRules = settings.rules;
        existingRules = $.validator.staticRules(element);

        switch (command) {
          case "add":
            $.extend(existingRules, $.validator.normalizeRule(argument)); // Remove messages from rules, but allow them to be set separately

            delete existingRules.messages;
            staticRules[element.name] = existingRules;

            if (argument.messages) {
              settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
            }

            break;

          case "remove":
            if (!argument) {
              delete staticRules[element.name];
              return existingRules;
            }

            filtered = {};
            $.each(argument.split(/\s/), function (index, method) {
              filtered[method] = existingRules[method];
              delete existingRules[method];
            });
            return filtered;
        }
      }

      data = $.validator.normalizeRules($.extend({}, $.validator.classRules(element), $.validator.attributeRules(element), $.validator.dataRules(element), $.validator.staticRules(element)), element); // Make sure required is at front

      if (data.required) {
        param = data.required;
        delete data.required;
        data = $.extend({
          required: param
        }, data);
      } // Make sure remote is at back


      if (data.remote) {
        param = data.remote;
        delete data.remote;
        data = $.extend(data, {
          remote: param
        });
      }

      return data;
    }
  }); // Custom selectors

  $.extend($.expr.pseudos || $.expr[":"], {
    // '|| $.expr[ ":" ]' here enables backwards compatibility to jQuery 1.7. Can be removed when dropping jQ 1.7.x support
    // https://jqueryvalidation.org/blank-selector/
    blank: function blank(a) {
      return !$.trim("" + $(a).val());
    },
    // https://jqueryvalidation.org/filled-selector/
    filled: function filled(a) {
      var val = $(a).val();
      return val !== null && !!$.trim("" + val);
    },
    // https://jqueryvalidation.org/unchecked-selector/
    unchecked: function unchecked(a) {
      return !$(a).prop("checked");
    }
  }); // Constructor for validator

  $.validator = function (options, form) {
    this.settings = $.extend(true, {}, $.validator.defaults, options);
    this.currentForm = form;
    this.init();
  }; // https://jqueryvalidation.org/jQuery.validator.format/


  $.validator.format = function (source, params) {
    if (arguments.length === 1) {
      return function () {
        var args = $.makeArray(arguments);
        args.unshift(source);
        return $.validator.format.apply(this, args);
      };
    }

    if (params === undefined) {
      return source;
    }

    if (arguments.length > 2 && params.constructor !== Array) {
      params = $.makeArray(arguments).slice(1);
    }

    if (params.constructor !== Array) {
      params = [params];
    }

    $.each(params, function (i, n) {
      source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
        return n;
      });
    });
    return source;
  };

  $.extend($.validator, {
    defaults: {
      messages: {},
      groups: {},
      rules: {},
      errorClass: "error",
      pendingClass: "pending",
      validClass: "valid",
      errorElement: "label",
      focusCleanup: false,
      focusInvalid: true,
      errorContainer: $([]),
      errorLabelContainer: $([]),
      onsubmit: true,
      ignore: ":hidden",
      ignoreTitle: false,
      onfocusin: function onfocusin(element) {
        this.lastActive = element; // Hide error label and remove error class on focus if enabled

        if (this.settings.focusCleanup) {
          if (this.settings.unhighlight) {
            this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
          }

          this.hideThese(this.errorsFor(element));
        }
      },
      onfocusout: function onfocusout(element) {
        if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
          this.element(element);
        }
      },
      onkeyup: function onkeyup(element, event) {
        // Avoid revalidate the field when pressing one of the following keys
        // Shift       => 16
        // Ctrl        => 17
        // Alt         => 18
        // Caps lock   => 20
        // End         => 35
        // Home        => 36
        // Left arrow  => 37
        // Up arrow    => 38
        // Right arrow => 39
        // Down arrow  => 40
        // Insert      => 45
        // Num lock    => 144
        // AltGr key   => 225
        var excludedKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];

        if (event.which === 9 && this.elementValue(element) === "" || $.inArray(event.keyCode, excludedKeys) !== -1) {
          return;
        } else if (element.name in this.submitted || element.name in this.invalid) {
          this.element(element);
        }
      },
      onclick: function onclick(element) {
        // Click on selects, radiobuttons and checkboxes
        if (element.name in this.submitted) {
          this.element(element); // Or option elements, check parent select in that case
        } else if (element.parentNode.name in this.submitted) {
          this.element(element.parentNode);
        }
      },
      highlight: function highlight(element, errorClass, validClass) {
        if (element.type === "radio") {
          this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
          $(element).addClass(errorClass).removeClass(validClass);
        }
      },
      unhighlight: function unhighlight(element, errorClass, validClass) {
        if (element.type === "radio") {
          this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
          $(element).removeClass(errorClass).addClass(validClass);
        }
      }
    },
    // https://jqueryvalidation.org/jQuery.validator.setDefaults/
    setDefaults: function setDefaults(settings) {
      $.extend($.validator.defaults, settings);
    },
    messages: {
      required: "This field is required.",
      remote: "Please fix this field.",
      email: "Please enter a valid email address.",
      url: "Please enter a valid URL.",
      date: "Please enter a valid date.",
      dateISO: "Please enter a valid date (ISO).",
      number: "Please enter a valid number.",
      digits: "Please enter only digits.",
      equalTo: "Please enter the same value again.",
      maxlength: $.validator.format("Please enter no more than {0} characters."),
      minlength: $.validator.format("Please enter at least {0} characters."),
      rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
      range: $.validator.format("Please enter a value between {0} and {1}."),
      max: $.validator.format("Please enter a value less than or equal to {0}."),
      min: $.validator.format("Please enter a value greater than or equal to {0}."),
      step: $.validator.format("Please enter a multiple of {0}.")
    },
    autoCreateRanges: false,
    prototype: {
      init: function init() {
        this.labelContainer = $(this.settings.errorLabelContainer);
        this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
        this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
        this.submitted = {};
        this.valueCache = {};
        this.pendingRequest = 0;
        this.pending = {};
        this.invalid = {};
        this.reset();
        var groups = this.groups = {},
            rules;
        $.each(this.settings.groups, function (key, value) {
          if (typeof value === "string") {
            value = value.split(/\s/);
          }

          $.each(value, function (index, name) {
            groups[name] = key;
          });
        });
        rules = this.settings.rules;
        $.each(rules, function (key, value) {
          rules[key] = $.validator.normalizeRule(value);
        });

        function delegate(event) {
          // Set form expando on contenteditable
          if (!this.form && this.hasAttribute("contenteditable")) {
            this.form = $(this).closest("form")[0];
            this.name = $(this).attr("name");
          }

          var validator = $.data(this.form, "validator"),
              eventType = "on" + event.type.replace(/^validate/, ""),
              settings = validator.settings;

          if (settings[eventType] && !$(this).is(settings.ignore)) {
            settings[eventType].call(validator, this, event);
          }
        }

        $(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " + "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " + "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " + "[type='radio'], [type='checkbox'], [contenteditable], [type='button']", delegate) // Support: Chrome, oldIE
        // "select" is provided as event.target when clicking a option
        .on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);

        if (this.settings.invalidHandler) {
          $(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
        }
      },
      // https://jqueryvalidation.org/Validator.form/
      form: function form() {
        this.checkForm();
        $.extend(this.submitted, this.errorMap);
        this.invalid = $.extend({}, this.errorMap);

        if (!this.valid()) {
          $(this.currentForm).triggerHandler("invalid-form", [this]);
        }

        this.showErrors();
        return this.valid();
      },
      checkForm: function checkForm() {
        this.prepareForm();

        for (var i = 0, elements = this.currentElements = this.elements(); elements[i]; i++) {
          this.check(elements[i]);
        }

        return this.valid();
      },
      // https://jqueryvalidation.org/Validator.element/
      element: function element(_element) {
        var cleanElement = this.clean(_element),
            checkElement = this.validationTargetFor(cleanElement),
            v = this,
            result = true,
            rs,
            group;

        if (checkElement === undefined) {
          delete this.invalid[cleanElement.name];
        } else {
          this.prepareElement(checkElement);
          this.currentElements = $(checkElement); // If this element is grouped, then validate all group elements already
          // containing a value

          group = this.groups[checkElement.name];

          if (group) {
            $.each(this.groups, function (name, testgroup) {
              if (testgroup === group && name !== checkElement.name) {
                cleanElement = v.validationTargetFor(v.clean(v.findByName(name)));

                if (cleanElement && cleanElement.name in v.invalid) {
                  v.currentElements.push(cleanElement);
                  result = v.check(cleanElement) && result;
                }
              }
            });
          }

          rs = this.check(checkElement) !== false;
          result = result && rs;

          if (rs) {
            this.invalid[checkElement.name] = false;
          } else {
            this.invalid[checkElement.name] = true;
          }

          if (!this.numberOfInvalids()) {
            // Hide error containers on last error
            this.toHide = this.toHide.add(this.containers);
          }

          this.showErrors(); // Add aria-invalid status for screen readers

          $(_element).attr("aria-invalid", !rs);
        }

        return result;
      },
      // https://jqueryvalidation.org/Validator.showErrors/
      showErrors: function showErrors(errors) {
        if (errors) {
          var validator = this; // Add items to error list and map

          $.extend(this.errorMap, errors);
          this.errorList = $.map(this.errorMap, function (message, name) {
            return {
              message: message,
              element: validator.findByName(name)[0]
            };
          }); // Remove items from success list

          this.successList = $.grep(this.successList, function (element) {
            return !(element.name in errors);
          });
        }

        if (this.settings.showErrors) {
          this.settings.showErrors.call(this, this.errorMap, this.errorList);
        } else {
          this.defaultShowErrors();
        }
      },
      // https://jqueryvalidation.org/Validator.resetForm/
      resetForm: function resetForm() {
        if ($.fn.resetForm) {
          $(this.currentForm).resetForm();
        }

        this.invalid = {};
        this.submitted = {};
        this.prepareForm();
        this.hideErrors();
        var elements = this.elements().removeData("previousValue").removeAttr("aria-invalid");
        this.resetElements(elements);
      },
      resetElements: function resetElements(elements) {
        var i;

        if (this.settings.unhighlight) {
          for (i = 0; elements[i]; i++) {
            this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, "");
            this.findByName(elements[i].name).removeClass(this.settings.validClass);
          }
        } else {
          elements.removeClass(this.settings.errorClass).removeClass(this.settings.validClass);
        }
      },
      numberOfInvalids: function numberOfInvalids() {
        return this.objectLength(this.invalid);
      },
      objectLength: function objectLength(obj) {
        /* jshint unused: false */
        var count = 0,
            i;

        for (i in obj) {
          // This check allows counting elements with empty error
          // message as invalid elements
          if (obj[i] !== undefined && obj[i] !== null && obj[i] !== false) {
            count++;
          }
        }

        return count;
      },
      hideErrors: function hideErrors() {
        this.hideThese(this.toHide);
      },
      hideThese: function hideThese(errors) {
        errors.not(this.containers).text("");
        this.addWrapper(errors).hide();
      },
      valid: function valid() {
        return this.size() === 0;
      },
      size: function size() {
        return this.errorList.length;
      },
      focusInvalid: function focusInvalid() {
        if (this.settings.focusInvalid) {
          try {
            $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus() // Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
            .trigger("focusin");
          } catch (e) {// Ignore IE throwing errors when focusing hidden elements
          }
        }
      },
      findLastActive: function findLastActive() {
        var lastActive = this.lastActive;
        return lastActive && $.grep(this.errorList, function (n) {
          return n.element.name === lastActive.name;
        }).length === 1 && lastActive;
      },
      elements: function elements() {
        var validator = this,
            rulesCache = {}; // Select all valid inputs inside the form (no submit or reset buttons)

        return $(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
          var name = this.name || $(this).attr("name"); // For contenteditable

          if (!name && validator.settings.debug && window.console) {
            console.error("%o has no name assigned", this);
          } // Set form expando on contenteditable


          if (this.hasAttribute("contenteditable")) {
            this.form = $(this).closest("form")[0];
            this.name = name;
          } // Select only the first element for each name, and only those with rules specified


          if (name in rulesCache || !validator.objectLength($(this).rules())) {
            return false;
          }

          rulesCache[name] = true;
          return true;
        });
      },
      clean: function clean(selector) {
        return $(selector)[0];
      },
      errors: function errors() {
        var errorClass = this.settings.errorClass.split(" ").join(".");
        return $(this.settings.errorElement + "." + errorClass, this.errorContext);
      },
      resetInternals: function resetInternals() {
        this.successList = [];
        this.errorList = [];
        this.errorMap = {};
        this.toShow = $([]);
        this.toHide = $([]);
      },
      reset: function reset() {
        this.resetInternals();
        this.currentElements = $([]);
      },
      prepareForm: function prepareForm() {
        this.reset();
        this.toHide = this.errors().add(this.containers);
      },
      prepareElement: function prepareElement(element) {
        this.reset();
        this.toHide = this.errorsFor(element);
      },
      elementValue: function elementValue(element) {
        var $element = $(element),
            type = element.type,
            val,
            idx;

        if (type === "radio" || type === "checkbox") {
          return this.findByName(element.name).filter(":checked").val();
        } else if (type === "number" && typeof element.validity !== "undefined") {
          return element.validity.badInput ? "NaN" : $element.val();
        }

        if (element.hasAttribute("contenteditable")) {
          val = $element.text();
        } else {
          val = $element.val();
        }

        if (type === "file") {
          // Modern browser (chrome & safari)
          if (val.substr(0, 12) === "C:\\fakepath\\") {
            return val.substr(12);
          } // Legacy browsers
          // Unix-based path


          idx = val.lastIndexOf("/");

          if (idx >= 0) {
            return val.substr(idx + 1);
          } // Windows-based path


          idx = val.lastIndexOf("\\");

          if (idx >= 0) {
            return val.substr(idx + 1);
          } // Just the file name


          return val;
        }

        if (typeof val === "string") {
          return val.replace(/\r/g, "");
        }

        return val;
      },
      check: function check(element) {
        element = this.validationTargetFor(this.clean(element));
        var rules = $(element).rules(),
            rulesCount = $.map(rules, function (n, i) {
          return i;
        }).length,
            dependencyMismatch = false,
            val = this.elementValue(element),
            result,
            method,
            rule,
            normalizer; // Prioritize the local normalizer defined for this element over the global one
        // if the former exists, otherwise user the global one in case it exists.

        if (typeof rules.normalizer === "function") {
          normalizer = rules.normalizer;
        } else if (typeof this.settings.normalizer === "function") {
          normalizer = this.settings.normalizer;
        } // If normalizer is defined, then call it to retreive the changed value instead
        // of using the real one.
        // Note that `this` in the normalizer is `element`.


        if (normalizer) {
          val = normalizer.call(element, val);

          if (typeof val !== "string") {
            throw new TypeError("The normalizer should return a string value.");
          } // Delete the normalizer from rules to avoid treating it as a pre-defined method.


          delete rules.normalizer;
        }

        for (method in rules) {
          rule = {
            method: method,
            parameters: rules[method]
          };

          try {
            result = $.validator.methods[method].call(this, val, element, rule.parameters); // If a method indicates that the field is optional and therefore valid,
            // don't mark it as valid when there are no other rules

            if (result === "dependency-mismatch" && rulesCount === 1) {
              dependencyMismatch = true;
              continue;
            }

            dependencyMismatch = false;

            if (result === "pending") {
              this.toHide = this.toHide.not(this.errorsFor(element));
              return;
            }

            if (!result) {
              this.formatAndAdd(element, rule);
              return false;
            }
          } catch (e) {
            if (this.settings.debug && window.console) {
              console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
            }

            if (e instanceof TypeError) {
              e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
            }

            throw e;
          }
        }

        if (dependencyMismatch) {
          return;
        }

        if (this.objectLength(rules)) {
          this.successList.push(element);
        }

        return true;
      },
      // Return the custom message for the given element and validation method
      // specified in the element's HTML5 data attribute
      // return the generic message if present and no method specific message is present
      customDataMessage: function customDataMessage(element, method) {
        return $(element).data("msg" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase()) || $(element).data("msg");
      },
      // Return the custom message for the given element name and validation method
      customMessage: function customMessage(name, method) {
        var m = this.settings.messages[name];
        return m && (m.constructor === String ? m : m[method]);
      },
      // Return the first defined argument, allowing empty strings
      findDefined: function findDefined() {
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] !== undefined) {
            return arguments[i];
          }
        }

        return undefined;
      },
      // The second parameter 'rule' used to be a string, and extended to an object literal
      // of the following form:
      // rule = {
      //     method: "method name",
      //     parameters: "the given method parameters"
      // }
      //
      // The old behavior still supported, kept to maintain backward compatibility with
      // old code, and will be removed in the next major release.
      defaultMessage: function defaultMessage(element, rule) {
        if (typeof rule === "string") {
          rule = {
            method: rule
          };
        }

        var message = this.findDefined(this.customMessage(element.name, rule.method), this.customDataMessage(element, rule.method), // 'title' is never undefined, so handle empty string as undefined
        !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[rule.method], "<strong>Warning: No message defined for " + element.name + "</strong>"),
            theregex = /\$?\{(\d+)\}/g;

        if (typeof message === "function") {
          message = message.call(this, rule.parameters, element);
        } else if (theregex.test(message)) {
          message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
        }

        return message;
      },
      formatAndAdd: function formatAndAdd(element, rule) {
        var message = this.defaultMessage(element, rule);
        this.errorList.push({
          message: message,
          element: element,
          method: rule.method
        });
        this.errorMap[element.name] = message;
        this.submitted[element.name] = message;
      },
      addWrapper: function addWrapper(toToggle) {
        if (this.settings.wrapper) {
          toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
        }

        return toToggle;
      },
      defaultShowErrors: function defaultShowErrors() {
        var i, elements, error;

        for (i = 0; this.errorList[i]; i++) {
          error = this.errorList[i];

          if (this.settings.highlight) {
            this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
          }

          this.showLabel(error.element, error.message);
        }

        if (this.errorList.length) {
          this.toShow = this.toShow.add(this.containers);
        }

        if (this.settings.success) {
          for (i = 0; this.successList[i]; i++) {
            this.showLabel(this.successList[i]);
          }
        }

        if (this.settings.unhighlight) {
          for (i = 0, elements = this.validElements(); elements[i]; i++) {
            this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
          }
        }

        this.toHide = this.toHide.not(this.toShow);
        this.hideErrors();
        this.addWrapper(this.toShow).show();
      },
      validElements: function validElements() {
        return this.currentElements.not(this.invalidElements());
      },
      invalidElements: function invalidElements() {
        return $(this.errorList).map(function () {
          return this.element;
        });
      },
      showLabel: function showLabel(element, message) {
        var place,
            group,
            errorID,
            v,
            error = this.errorsFor(element),
            elementID = this.idOrName(element),
            describedBy = $(element).attr("aria-describedby");

        if (error.length) {
          // Refresh error/success class
          error.removeClass(this.settings.validClass).addClass(this.settings.errorClass); // Replace message on existing label

          error.html(message);
        } else {
          // Create error element
          error = $("<" + this.settings.errorElement + ">").attr("id", elementID + "-error").addClass(this.settings.errorClass).html(message || ""); // Maintain reference to the element to be placed into the DOM

          place = error;

          if (this.settings.wrapper) {
            // Make sure the element is visible, even in IE
            // actually showing the wrapped element is handled elsewhere
            place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
          }

          if (this.labelContainer.length) {
            this.labelContainer.append(place);
          } else if (this.settings.errorPlacement) {
            this.settings.errorPlacement.call(this, place, $(element));
          } else {
            place.insertAfter(element);
          } // Link error back to the element


          if (error.is("label")) {
            // If the error is a label, then associate using 'for'
            error.attr("for", elementID); // If the element is not a child of an associated label, then it's necessary
            // to explicitly apply aria-describedby
          } else if (error.parents("label[for='" + this.escapeCssMeta(elementID) + "']").length === 0) {
            errorID = error.attr("id"); // Respect existing non-error aria-describedby

            if (!describedBy) {
              describedBy = errorID;
            } else if (!describedBy.match(new RegExp("\\b" + this.escapeCssMeta(errorID) + "\\b"))) {
              // Add to end of list if not already present
              describedBy += " " + errorID;
            }

            $(element).attr("aria-describedby", describedBy); // If this element is grouped, then assign to all elements in the same group

            group = this.groups[element.name];

            if (group) {
              v = this;
              $.each(v.groups, function (name, testgroup) {
                if (testgroup === group) {
                  $("[name='" + v.escapeCssMeta(name) + "']", v.currentForm).attr("aria-describedby", error.attr("id"));
                }
              });
            }
          }
        }

        if (!message && this.settings.success) {
          error.text("");

          if (typeof this.settings.success === "string") {
            error.addClass(this.settings.success);
          } else {
            this.settings.success(error, element);
          }
        }

        this.toShow = this.toShow.add(error);
      },
      errorsFor: function errorsFor(element) {
        var name = this.escapeCssMeta(this.idOrName(element)),
            describer = $(element).attr("aria-describedby"),
            selector = "label[for='" + name + "'], label[for='" + name + "'] *"; // 'aria-describedby' should directly reference the error element

        if (describer) {
          selector = selector + ", #" + this.escapeCssMeta(describer).replace(/\s+/g, ", #");
        }

        return this.errors().filter(selector);
      },
      // See https://api.jquery.com/category/selectors/, for CSS
      // meta-characters that should be escaped in order to be used with JQuery
      // as a literal part of a name/id or any selector.
      escapeCssMeta: function escapeCssMeta(string) {
        return string.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
      },
      idOrName: function idOrName(element) {
        return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
      },
      validationTargetFor: function validationTargetFor(element) {
        // If radio/checkbox, validate first element in group instead
        if (this.checkable(element)) {
          element = this.findByName(element.name);
        } // Always apply ignore filter


        return $(element).not(this.settings.ignore)[0];
      },
      checkable: function checkable(element) {
        return /radio|checkbox/i.test(element.type);
      },
      findByName: function findByName(name) {
        return $(this.currentForm).find("[name='" + this.escapeCssMeta(name) + "']");
      },
      getLength: function getLength(value, element) {
        switch (element.nodeName.toLowerCase()) {
          case "select":
            return $("option:selected", element).length;

          case "input":
            if (this.checkable(element)) {
              return this.findByName(element.name).filter(":checked").length;
            }

        }

        return value.length;
      },
      depend: function depend(param, element) {
        return this.dependTypes[_typeof(param)] ? this.dependTypes[_typeof(param)](param, element) : true;
      },
      dependTypes: {
        "boolean": function boolean(param) {
          return param;
        },
        "string": function string(param, element) {
          return !!$(param, element.form).length;
        },
        "function": function _function(param, element) {
          return param(element);
        }
      },
      optional: function optional(element) {
        var val = this.elementValue(element);
        return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
      },
      startRequest: function startRequest(element) {
        if (!this.pending[element.name]) {
          this.pendingRequest++;
          $(element).addClass(this.settings.pendingClass);
          this.pending[element.name] = true;
        }
      },
      stopRequest: function stopRequest(element, valid) {
        this.pendingRequest--; // Sometimes synchronization fails, make sure pendingRequest is never < 0

        if (this.pendingRequest < 0) {
          this.pendingRequest = 0;
        }

        delete this.pending[element.name];
        $(element).removeClass(this.settings.pendingClass);

        if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
          $(this.currentForm).submit(); // Remove the hidden input that was used as a replacement for the
          // missing submit button. The hidden input is added by `handle()`
          // to ensure that the value of the used submit button is passed on
          // for scripted submits triggered by this method

          if (this.submitButton) {
            $("input:hidden[name='" + this.submitButton.name + "']", this.currentForm).remove();
          }

          this.formSubmitted = false;
        } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
          $(this.currentForm).triggerHandler("invalid-form", [this]);
          this.formSubmitted = false;
        }
      },
      previousValue: function previousValue(element, method) {
        method = typeof method === "string" && method || "remote";
        return $.data(element, "previousValue") || $.data(element, "previousValue", {
          old: null,
          valid: true,
          message: this.defaultMessage(element, {
            method: method
          })
        });
      },
      // Cleans up all forms and elements, removes validator-specific events
      destroy: function destroy() {
        this.resetForm();
        $(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur");
      }
    },
    classRuleSettings: {
      required: {
        required: true
      },
      email: {
        email: true
      },
      url: {
        url: true
      },
      date: {
        date: true
      },
      dateISO: {
        dateISO: true
      },
      number: {
        number: true
      },
      digits: {
        digits: true
      },
      creditcard: {
        creditcard: true
      }
    },
    addClassRules: function addClassRules(className, rules) {
      if (className.constructor === String) {
        this.classRuleSettings[className] = rules;
      } else {
        $.extend(this.classRuleSettings, className);
      }
    },
    classRules: function classRules(element) {
      var rules = {},
          classes = $(element).attr("class");

      if (classes) {
        $.each(classes.split(" "), function () {
          if (this in $.validator.classRuleSettings) {
            $.extend(rules, $.validator.classRuleSettings[this]);
          }
        });
      }

      return rules;
    },
    normalizeAttributeRule: function normalizeAttributeRule(rules, type, method, value) {
      // Convert the value to a number for number inputs, and for text for backwards compability
      // allows type="date" and others to be compared as strings
      if (/min|max|step/.test(method) && (type === null || /number|range|text/.test(type))) {
        value = Number(value); // Support Opera Mini, which returns NaN for undefined minlength

        if (isNaN(value)) {
          value = undefined;
        }
      }

      if (value || value === 0) {
        rules[method] = value;
      } else if (type === method && type !== "range") {
        // Exception: the jquery validate 'range' method
        // does not test for the html5 'range' type
        rules[method] = true;
      }
    },
    attributeRules: function attributeRules(element) {
      var rules = {},
          $element = $(element),
          type = element.getAttribute("type"),
          method,
          value;

      for (method in $.validator.methods) {
        // Support for <input required> in both html5 and older browsers
        if (method === "required") {
          value = element.getAttribute(method); // Some browsers return an empty string for the required attribute
          // and non-HTML5 browsers might have required="" markup

          if (value === "") {
            value = true;
          } // Force non-HTML5 browsers to return bool


          value = !!value;
        } else {
          value = $element.attr(method);
        }

        this.normalizeAttributeRule(rules, type, method, value);
      } // 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs


      if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
        delete rules.maxlength;
      }

      return rules;
    },
    dataRules: function dataRules(element) {
      var rules = {},
          $element = $(element),
          type = element.getAttribute("type"),
          method,
          value;

      for (method in $.validator.methods) {
        value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase());
        this.normalizeAttributeRule(rules, type, method, value);
      }

      return rules;
    },
    staticRules: function staticRules(element) {
      var rules = {},
          validator = $.data(element.form, "validator");

      if (validator.settings.rules) {
        rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
      }

      return rules;
    },
    normalizeRules: function normalizeRules(rules, element) {
      // Handle dependency check
      $.each(rules, function (prop, val) {
        // Ignore rule when param is explicitly false, eg. required:false
        if (val === false) {
          delete rules[prop];
          return;
        }

        if (val.param || val.depends) {
          var keepRule = true;

          switch (_typeof(val.depends)) {
            case "string":
              keepRule = !!$(val.depends, element.form).length;
              break;

            case "function":
              keepRule = val.depends.call(element, element);
              break;
          }

          if (keepRule) {
            rules[prop] = val.param !== undefined ? val.param : true;
          } else {
            $.data(element.form, "validator").resetElements($(element));
            delete rules[prop];
          }
        }
      }); // Evaluate parameters

      $.each(rules, function (rule, parameter) {
        rules[rule] = $.isFunction(parameter) && rule !== "normalizer" ? parameter(element) : parameter;
      }); // Clean number parameters

      $.each(["minlength", "maxlength"], function () {
        if (rules[this]) {
          rules[this] = Number(rules[this]);
        }
      });
      $.each(["rangelength", "range"], function () {
        var parts;

        if (rules[this]) {
          if ($.isArray(rules[this])) {
            rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
          } else if (typeof rules[this] === "string") {
            parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/);
            rules[this] = [Number(parts[0]), Number(parts[1])];
          }
        }
      });

      if ($.validator.autoCreateRanges) {
        // Auto-create ranges
        if (rules.min != null && rules.max != null) {
          rules.range = [rules.min, rules.max];
          delete rules.min;
          delete rules.max;
        }

        if (rules.minlength != null && rules.maxlength != null) {
          rules.rangelength = [rules.minlength, rules.maxlength];
          delete rules.minlength;
          delete rules.maxlength;
        }
      }

      return rules;
    },
    // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
    normalizeRule: function normalizeRule(data) {
      if (typeof data === "string") {
        var transformed = {};
        $.each(data.split(/\s/), function () {
          transformed[this] = true;
        });
        data = transformed;
      }

      return data;
    },
    // https://jqueryvalidation.org/jQuery.validator.addMethod/
    addMethod: function addMethod(name, method, message) {
      $.validator.methods[name] = method;
      $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];

      if (method.length < 3) {
        $.validator.addClassRules(name, $.validator.normalizeRule(name));
      }
    },
    // https://jqueryvalidation.org/jQuery.validator.methods/
    methods: {
      // https://jqueryvalidation.org/required-method/
      required: function required(value, element, param) {
        // Check if dependency is met
        if (!this.depend(param, element)) {
          return "dependency-mismatch";
        }

        if (element.nodeName.toLowerCase() === "select") {
          // Could be an array for select-multiple or a string, both are fine this way
          var val = $(element).val();
          return val && val.length > 0;
        }

        if (this.checkable(element)) {
          return this.getLength(value, element) > 0;
        }

        return value.length > 0;
      },
      // https://jqueryvalidation.org/email-method/
      email: function email(value, element) {
        // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
        // Retrieved 2014-01-14
        // If you have a problem with this implementation, report a bug against the above spec
        // Or use custom methods to implement your own email validation
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
      },
      // https://jqueryvalidation.org/url-method/
      url: function url(value, element) {
        // Copyright (c) 2010-2013 Diego Perini, MIT licensed
        // https://gist.github.com/dperini/729294
        // see also https://mathiasbynens.be/demo/url-regex
        // modified to allow protocol-relative URLs
        return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
      },
      // https://jqueryvalidation.org/date-method/
      date: function date(value, element) {
        return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
      },
      // https://jqueryvalidation.org/dateISO-method/
      dateISO: function dateISO(value, element) {
        return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
      },
      // https://jqueryvalidation.org/number-method/
      number: function number(value, element) {
        return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
      },
      // https://jqueryvalidation.org/digits-method/
      digits: function digits(value, element) {
        return this.optional(element) || /^\d+$/.test(value);
      },
      // https://jqueryvalidation.org/minlength-method/
      minlength: function minlength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length >= param;
      },
      // https://jqueryvalidation.org/maxlength-method/
      maxlength: function maxlength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length <= param;
      },
      // https://jqueryvalidation.org/rangelength-method/
      rangelength: function rangelength(value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length >= param[0] && length <= param[1];
      },
      // https://jqueryvalidation.org/min-method/
      min: function min(value, element, param) {
        return this.optional(element) || value >= param;
      },
      // https://jqueryvalidation.org/max-method/
      max: function max(value, element, param) {
        return this.optional(element) || value <= param;
      },
      // https://jqueryvalidation.org/range-method/
      range: function range(value, element, param) {
        return this.optional(element) || value >= param[0] && value <= param[1];
      },
      // https://jqueryvalidation.org/step-method/
      step: function step(value, element, param) {
        var type = $(element).attr("type"),
            errorMessage = "Step attribute on input type " + type + " is not supported.",
            supportedTypes = ["text", "number", "range"],
            re = new RegExp("\\b" + type + "\\b"),
            notSupported = type && !re.test(supportedTypes.join()),
            decimalPlaces = function decimalPlaces(num) {
          var match = ("" + num).match(/(?:\.(\d+))?$/);

          if (!match) {
            return 0;
          } // Number of digits right of decimal point.


          return match[1] ? match[1].length : 0;
        },
            toInt = function toInt(num) {
          return Math.round(num * Math.pow(10, decimals));
        },
            valid = true,
            decimals; // Works only for text, number and range input types
        // TODO find a way to support input types date, datetime, datetime-local, month, time and week


        if (notSupported) {
          throw new Error(errorMessage);
        }

        decimals = decimalPlaces(param); // Value can't have too many decimals

        if (decimalPlaces(value) > decimals || toInt(value) % toInt(param) !== 0) {
          valid = false;
        }

        return this.optional(element) || valid;
      },
      // https://jqueryvalidation.org/equalTo-method/
      equalTo: function equalTo(value, element, param) {
        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $(param);

        if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
          target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
            $(element).valid();
          });
        }

        return value === target.val();
      },
      // https://jqueryvalidation.org/remote-method/
      remote: function remote(value, element, param, method) {
        if (this.optional(element)) {
          return "dependency-mismatch";
        }

        method = typeof method === "string" && method || "remote";
        var previous = this.previousValue(element, method),
            validator,
            data,
            optionDataString;

        if (!this.settings.messages[element.name]) {
          this.settings.messages[element.name] = {};
        }

        previous.originalMessage = previous.originalMessage || this.settings.messages[element.name][method];
        this.settings.messages[element.name][method] = previous.message;
        param = typeof param === "string" && {
          url: param
        } || param;
        optionDataString = $.param($.extend({
          data: value
        }, param.data));

        if (previous.old === optionDataString) {
          return previous.valid;
        }

        previous.old = optionDataString;
        validator = this;
        this.startRequest(element);
        data = {};
        data[element.name] = value;
        $.ajax($.extend(true, {
          mode: "abort",
          port: "validate" + element.name,
          dataType: "json",
          data: data,
          context: validator.currentForm,
          success: function success(response) {
            var valid = response === true || response === "true",
                errors,
                message,
                submitted;
            validator.settings.messages[element.name][method] = previous.originalMessage;

            if (valid) {
              submitted = validator.formSubmitted;
              validator.resetInternals();
              validator.toHide = validator.errorsFor(element);
              validator.formSubmitted = submitted;
              validator.successList.push(element);
              validator.invalid[element.name] = false;
              validator.showErrors();
            } else {
              errors = {};
              message = response || validator.defaultMessage(element, {
                method: method,
                parameters: value
              });
              errors[element.name] = previous.message = message;
              validator.invalid[element.name] = true;
              validator.showErrors(errors);
            }

            previous.valid = valid;
            validator.stopRequest(element, valid);
          }
        }, param));
        return "pending";
      }
    }
  }); // Ajax mode: abort
  // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
  // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

  var pendingRequests = {},
      ajax; // Use a prefilter if available (1.5+)

  if ($.ajaxPrefilter) {
    $.ajaxPrefilter(function (settings, _, xhr) {
      var port = settings.port;

      if (settings.mode === "abort") {
        if (pendingRequests[port]) {
          pendingRequests[port].abort();
        }

        pendingRequests[port] = xhr;
      }
    });
  } else {
    // Proxy ajax
    ajax = $.ajax;

    $.ajax = function (settings) {
      var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
          port = ("port" in settings ? settings : $.ajaxSettings).port;

      if (mode === "abort") {
        if (pendingRequests[port]) {
          pendingRequests[port].abort();
        }

        pendingRequests[port] = ajax.apply(this, arguments);
        return pendingRequests[port];
      }

      return ajax.apply(this, arguments);
    };
  }

  return $;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9qcXVlcnktdmFsaWRhdGlvbi9kaXN0L2pxdWVyeS52YWxpZGF0ZS5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwibW9kdWxlIiwiZXhwb3J0cyIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwiZXh0ZW5kIiwiZm4iLCJ2YWxpZGF0ZSIsIm9wdGlvbnMiLCJsZW5ndGgiLCJkZWJ1ZyIsIndpbmRvdyIsImNvbnNvbGUiLCJ3YXJuIiwidmFsaWRhdG9yIiwiZGF0YSIsImF0dHIiLCJzZXR0aW5ncyIsIm9uc3VibWl0Iiwib24iLCJldmVudCIsInN1Ym1pdEJ1dHRvbiIsImN1cnJlbnRUYXJnZXQiLCJoYXNDbGFzcyIsImNhbmNlbFN1Ym1pdCIsInVuZGVmaW5lZCIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlIiwiaGlkZGVuIiwicmVzdWx0Iiwic3VibWl0SGFuZGxlciIsImZvcm1TdWJtaXR0ZWQiLCJuYW1lIiwidmFsIiwiYXBwZW5kVG8iLCJjdXJyZW50Rm9ybSIsImNhbGwiLCJyZW1vdmUiLCJmb3JtIiwicGVuZGluZ1JlcXVlc3QiLCJmb2N1c0ludmFsaWQiLCJ2YWxpZCIsImVycm9yTGlzdCIsImlzIiwiZWFjaCIsImVsZW1lbnQiLCJjb25jYXQiLCJydWxlcyIsImNvbW1hbmQiLCJhcmd1bWVudCIsInN0YXRpY1J1bGVzIiwiZXhpc3RpbmdSdWxlcyIsInBhcmFtIiwiZmlsdGVyZWQiLCJoYXNBdHRyaWJ1dGUiLCJjbG9zZXN0Iiwibm9ybWFsaXplUnVsZSIsIm1lc3NhZ2VzIiwic3BsaXQiLCJpbmRleCIsIm1ldGhvZCIsIm5vcm1hbGl6ZVJ1bGVzIiwiY2xhc3NSdWxlcyIsImF0dHJpYnV0ZVJ1bGVzIiwiZGF0YVJ1bGVzIiwicmVxdWlyZWQiLCJyZW1vdGUiLCJleHByIiwicHNldWRvcyIsImJsYW5rIiwiYSIsInRyaW0iLCJmaWxsZWQiLCJ1bmNoZWNrZWQiLCJwcm9wIiwiZGVmYXVsdHMiLCJpbml0IiwiZm9ybWF0Iiwic291cmNlIiwicGFyYW1zIiwiYXJndW1lbnRzIiwiYXJncyIsIm1ha2VBcnJheSIsInVuc2hpZnQiLCJhcHBseSIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJzbGljZSIsImkiLCJuIiwicmVwbGFjZSIsIlJlZ0V4cCIsImdyb3VwcyIsImVycm9yQ2xhc3MiLCJwZW5kaW5nQ2xhc3MiLCJ2YWxpZENsYXNzIiwiZXJyb3JFbGVtZW50IiwiZm9jdXNDbGVhbnVwIiwiZXJyb3JDb250YWluZXIiLCJlcnJvckxhYmVsQ29udGFpbmVyIiwiaWdub3JlIiwiaWdub3JlVGl0bGUiLCJvbmZvY3VzaW4iLCJsYXN0QWN0aXZlIiwidW5oaWdobGlnaHQiLCJoaWRlVGhlc2UiLCJlcnJvcnNGb3IiLCJvbmZvY3Vzb3V0IiwiY2hlY2thYmxlIiwic3VibWl0dGVkIiwib3B0aW9uYWwiLCJvbmtleXVwIiwiZXhjbHVkZWRLZXlzIiwid2hpY2giLCJlbGVtZW50VmFsdWUiLCJpbkFycmF5Iiwia2V5Q29kZSIsImludmFsaWQiLCJvbmNsaWNrIiwicGFyZW50Tm9kZSIsImhpZ2hsaWdodCIsInR5cGUiLCJmaW5kQnlOYW1lIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInNldERlZmF1bHRzIiwiZW1haWwiLCJ1cmwiLCJkYXRlIiwiZGF0ZUlTTyIsIm51bWJlciIsImRpZ2l0cyIsImVxdWFsVG8iLCJtYXhsZW5ndGgiLCJtaW5sZW5ndGgiLCJyYW5nZWxlbmd0aCIsInJhbmdlIiwibWF4IiwibWluIiwic3RlcCIsImF1dG9DcmVhdGVSYW5nZXMiLCJwcm90b3R5cGUiLCJsYWJlbENvbnRhaW5lciIsImVycm9yQ29udGV4dCIsImNvbnRhaW5lcnMiLCJhZGQiLCJ2YWx1ZUNhY2hlIiwicGVuZGluZyIsInJlc2V0Iiwia2V5IiwidmFsdWUiLCJkZWxlZ2F0ZSIsImV2ZW50VHlwZSIsImludmFsaWRIYW5kbGVyIiwiY2hlY2tGb3JtIiwiZXJyb3JNYXAiLCJ0cmlnZ2VySGFuZGxlciIsInNob3dFcnJvcnMiLCJwcmVwYXJlRm9ybSIsImVsZW1lbnRzIiwiY3VycmVudEVsZW1lbnRzIiwiY2hlY2siLCJjbGVhbkVsZW1lbnQiLCJjbGVhbiIsImNoZWNrRWxlbWVudCIsInZhbGlkYXRpb25UYXJnZXRGb3IiLCJ2IiwicnMiLCJncm91cCIsInByZXBhcmVFbGVtZW50IiwidGVzdGdyb3VwIiwicHVzaCIsIm51bWJlck9mSW52YWxpZHMiLCJ0b0hpZGUiLCJlcnJvcnMiLCJtYXAiLCJtZXNzYWdlIiwic3VjY2Vzc0xpc3QiLCJncmVwIiwiZGVmYXVsdFNob3dFcnJvcnMiLCJyZXNldEZvcm0iLCJoaWRlRXJyb3JzIiwicmVtb3ZlRGF0YSIsInJlbW92ZUF0dHIiLCJyZXNldEVsZW1lbnRzIiwib2JqZWN0TGVuZ3RoIiwib2JqIiwiY291bnQiLCJub3QiLCJ0ZXh0IiwiYWRkV3JhcHBlciIsImhpZGUiLCJzaXplIiwiZmluZExhc3RBY3RpdmUiLCJmaWx0ZXIiLCJmb2N1cyIsInRyaWdnZXIiLCJlIiwicnVsZXNDYWNoZSIsImZpbmQiLCJlcnJvciIsInNlbGVjdG9yIiwiam9pbiIsInJlc2V0SW50ZXJuYWxzIiwidG9TaG93IiwiJGVsZW1lbnQiLCJpZHgiLCJ2YWxpZGl0eSIsImJhZElucHV0Iiwic3Vic3RyIiwibGFzdEluZGV4T2YiLCJydWxlc0NvdW50IiwiZGVwZW5kZW5jeU1pc21hdGNoIiwicnVsZSIsIm5vcm1hbGl6ZXIiLCJUeXBlRXJyb3IiLCJwYXJhbWV0ZXJzIiwibWV0aG9kcyIsImZvcm1hdEFuZEFkZCIsImxvZyIsImlkIiwiY3VzdG9tRGF0YU1lc3NhZ2UiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0cmluZyIsInRvTG93ZXJDYXNlIiwiY3VzdG9tTWVzc2FnZSIsIm0iLCJTdHJpbmciLCJmaW5kRGVmaW5lZCIsImRlZmF1bHRNZXNzYWdlIiwidGl0bGUiLCJ0aGVyZWdleCIsInRlc3QiLCJ0b1RvZ2dsZSIsIndyYXBwZXIiLCJwYXJlbnQiLCJzaG93TGFiZWwiLCJzdWNjZXNzIiwidmFsaWRFbGVtZW50cyIsInNob3ciLCJpbnZhbGlkRWxlbWVudHMiLCJwbGFjZSIsImVycm9ySUQiLCJlbGVtZW50SUQiLCJpZE9yTmFtZSIsImRlc2NyaWJlZEJ5IiwiaHRtbCIsIndyYXAiLCJhcHBlbmQiLCJlcnJvclBsYWNlbWVudCIsImluc2VydEFmdGVyIiwicGFyZW50cyIsImVzY2FwZUNzc01ldGEiLCJtYXRjaCIsImRlc2NyaWJlciIsInN0cmluZyIsImdldExlbmd0aCIsIm5vZGVOYW1lIiwiZGVwZW5kIiwiZGVwZW5kVHlwZXMiLCJzdGFydFJlcXVlc3QiLCJzdG9wUmVxdWVzdCIsInN1Ym1pdCIsInByZXZpb3VzVmFsdWUiLCJvbGQiLCJkZXN0cm95Iiwib2ZmIiwiY2xhc3NSdWxlU2V0dGluZ3MiLCJjcmVkaXRjYXJkIiwiYWRkQ2xhc3NSdWxlcyIsImNsYXNzTmFtZSIsImNsYXNzZXMiLCJub3JtYWxpemVBdHRyaWJ1dGVSdWxlIiwiTnVtYmVyIiwiaXNOYU4iLCJnZXRBdHRyaWJ1dGUiLCJkZXBlbmRzIiwia2VlcFJ1bGUiLCJwYXJhbWV0ZXIiLCJpc0Z1bmN0aW9uIiwicGFydHMiLCJpc0FycmF5IiwidHJhbnNmb3JtZWQiLCJhZGRNZXRob2QiLCJEYXRlIiwidG9TdHJpbmciLCJlcnJvck1lc3NhZ2UiLCJzdXBwb3J0ZWRUeXBlcyIsInJlIiwibm90U3VwcG9ydGVkIiwiZGVjaW1hbFBsYWNlcyIsIm51bSIsInRvSW50IiwiTWF0aCIsInJvdW5kIiwicG93IiwiZGVjaW1hbHMiLCJFcnJvciIsInRhcmdldCIsInByZXZpb3VzIiwib3B0aW9uRGF0YVN0cmluZyIsIm9yaWdpbmFsTWVzc2FnZSIsImFqYXgiLCJtb2RlIiwicG9ydCIsImRhdGFUeXBlIiwiY29udGV4dCIsInJlc3BvbnNlIiwicGVuZGluZ1JlcXVlc3RzIiwiYWpheFByZWZpbHRlciIsIl8iLCJ4aHIiLCJhYm9ydCIsImFqYXhTZXR0aW5ncyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7OztBQVFDLFdBQVVBLE9BQVYs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QTFCO0FBQ0E7QUFDRCxLQVJEO0FBU0EsR0FWRCxNQVVPO0FBRU47QUFDQVQsSUFBQUEsSUFBSSxHQUFHM1MsQ0FBQyxDQUFDMlMsSUFBVDs7QUFDQTNTLElBQUFBLENBQUMsQ0FBQzJTLElBQUYsR0FBUyxVQUFVOVIsUUFBVixFQUFxQjtBQUM3QixVQUFJK1IsSUFBSSxHQUFHLENBQUUsVUFBVS9SLFFBQVYsR0FBcUJBLFFBQXJCLEdBQWdDYixDQUFDLENBQUNzVCxZQUFwQyxFQUFtRFYsSUFBOUQ7QUFBQSxVQUNDQyxJQUFJLEdBQUcsQ0FBRSxVQUFVaFMsUUFBVixHQUFxQkEsUUFBckIsR0FBZ0NiLENBQUMsQ0FBQ3NULFlBQXBDLEVBQW1EVCxJQUQzRDs7QUFFQSxVQUFLRCxJQUFJLEtBQUssT0FBZCxFQUF3QjtBQUN2QixZQUFLSyxlQUFlLENBQUVKLElBQUYsQ0FBcEIsRUFBK0I7QUFDOUJJLFVBQUFBLGVBQWUsQ0FBRUosSUFBRixDQUFmLENBQXdCUSxLQUF4QjtBQUNBOztBQUNESixRQUFBQSxlQUFlLENBQUVKLElBQUYsQ0FBZixHQUEwQkYsSUFBSSxDQUFDM04sS0FBTCxDQUFZLElBQVosRUFBa0JKLFNBQWxCLENBQTFCO0FBQ0EsZUFBT3FPLGVBQWUsQ0FBRUosSUFBRixDQUF0QjtBQUNBOztBQUNELGFBQU9GLElBQUksQ0FBQzNOLEtBQUwsQ0FBWSxJQUFaLEVBQWtCSixTQUFsQixDQUFQO0FBQ0EsS0FYRDtBQVlBOztBQUNELFNBQU81RSxDQUFQO0FBQ0MsQ0F4akRBLENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGpRdWVyeSBWYWxpZGF0aW9uIFBsdWdpbiB2MS4xNy4wXG4gKlxuICogaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgSsO2cm4gWmFlZmZlcmVyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuKGZ1bmN0aW9uKCBmYWN0b3J5ICkge1xuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRcdGRlZmluZSggW1wianF1ZXJ5XCJdLCBmYWN0b3J5ICk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSggcmVxdWlyZSggXCJqcXVlcnlcIiApICk7XG5cdH0gZWxzZSB7XG5cdFx0ZmFjdG9yeSggalF1ZXJ5ICk7XG5cdH1cbn0oZnVuY3Rpb24oICQgKSB7XG5cbiQuZXh0ZW5kKCAkLmZuLCB7XG5cblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy92YWxpZGF0ZS9cblx0dmFsaWRhdGU6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG5cdFx0Ly8gSWYgbm90aGluZyBpcyBzZWxlY3RlZCwgcmV0dXJuIG5vdGhpbmc7IGNhbid0IGNoYWluIGFueXdheVxuXHRcdGlmICggIXRoaXMubGVuZ3RoICkge1xuXHRcdFx0aWYgKCBvcHRpb25zICYmIG9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybiggXCJOb3RoaW5nIHNlbGVjdGVkLCBjYW4ndCB2YWxpZGF0ZSwgcmV0dXJuaW5nIG5vdGhpbmcuXCIgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiBhIHZhbGlkYXRvciBmb3IgdGhpcyBmb3JtIHdhcyBhbHJlYWR5IGNyZWF0ZWRcblx0XHR2YXIgdmFsaWRhdG9yID0gJC5kYXRhKCB0aGlzWyAwIF0sIFwidmFsaWRhdG9yXCIgKTtcblx0XHRpZiAoIHZhbGlkYXRvciApIHtcblx0XHRcdHJldHVybiB2YWxpZGF0b3I7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIG5vdmFsaWRhdGUgdGFnIGlmIEhUTUw1LlxuXHRcdHRoaXMuYXR0ciggXCJub3ZhbGlkYXRlXCIsIFwibm92YWxpZGF0ZVwiICk7XG5cblx0XHR2YWxpZGF0b3IgPSBuZXcgJC52YWxpZGF0b3IoIG9wdGlvbnMsIHRoaXNbIDAgXSApO1xuXHRcdCQuZGF0YSggdGhpc1sgMCBdLCBcInZhbGlkYXRvclwiLCB2YWxpZGF0b3IgKTtcblxuXHRcdGlmICggdmFsaWRhdG9yLnNldHRpbmdzLm9uc3VibWl0ICkge1xuXG5cdFx0XHR0aGlzLm9uKCBcImNsaWNrLnZhbGlkYXRlXCIsIFwiOnN1Ym1pdFwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRcdFx0Ly8gVHJhY2sgdGhlIHVzZWQgc3VibWl0IGJ1dHRvbiB0byBwcm9wZXJseSBoYW5kbGUgc2NyaXB0ZWRcblx0XHRcdFx0Ly8gc3VibWl0cyBsYXRlci5cblx0XHRcdFx0dmFsaWRhdG9yLnN1Ym1pdEJ1dHRvbiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cblx0XHRcdFx0Ly8gQWxsb3cgc3VwcHJlc3NpbmcgdmFsaWRhdGlvbiBieSBhZGRpbmcgYSBjYW5jZWwgY2xhc3MgdG8gdGhlIHN1Ym1pdCBidXR0b25cblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoIFwiY2FuY2VsXCIgKSApIHtcblx0XHRcdFx0XHR2YWxpZGF0b3IuY2FuY2VsU3VibWl0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFsbG93IHN1cHByZXNzaW5nIHZhbGlkYXRpb24gYnkgYWRkaW5nIHRoZSBodG1sNSBmb3Jtbm92YWxpZGF0ZSBhdHRyaWJ1dGUgdG8gdGhlIHN1Ym1pdCBidXR0b25cblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuYXR0ciggXCJmb3Jtbm92YWxpZGF0ZVwiICkgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHR2YWxpZGF0b3IuY2FuY2VsU3VibWl0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBWYWxpZGF0ZSB0aGUgZm9ybSBvbiBzdWJtaXRcblx0XHRcdHRoaXMub24oIFwic3VibWl0LnZhbGlkYXRlXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0aWYgKCB2YWxpZGF0b3Iuc2V0dGluZ3MuZGVidWcgKSB7XG5cblx0XHRcdFx0XHQvLyBQcmV2ZW50IGZvcm0gc3VibWl0IHRvIGJlIGFibGUgdG8gc2VlIGNvbnNvbGUgb3V0cHV0XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmdW5jdGlvbiBoYW5kbGUoKSB7XG5cdFx0XHRcdFx0dmFyIGhpZGRlbiwgcmVzdWx0O1xuXG5cdFx0XHRcdFx0Ly8gSW5zZXJ0IGEgaGlkZGVuIGlucHV0IGFzIGEgcmVwbGFjZW1lbnQgZm9yIHRoZSBtaXNzaW5nIHN1Ym1pdCBidXR0b25cblx0XHRcdFx0XHQvLyBUaGUgaGlkZGVuIGlucHV0IGlzIGluc2VydGVkIGluIHR3byBjYXNlczpcblx0XHRcdFx0XHQvLyAgIC0gQSB1c2VyIGRlZmluZWQgYSBgc3VibWl0SGFuZGxlcmBcblx0XHRcdFx0XHQvLyAgIC0gVGhlcmUgd2FzIGEgcGVuZGluZyByZXF1ZXN0IGR1ZSB0byBgcmVtb3RlYCBtZXRob2QgYW5kIGBzdG9wUmVxdWVzdCgpYFxuXHRcdFx0XHRcdC8vICAgICB3YXMgY2FsbGVkIHRvIHN1Ym1pdCB0aGUgZm9ybSBpbiBjYXNlIGl0J3MgdmFsaWRcblx0XHRcdFx0XHRpZiAoIHZhbGlkYXRvci5zdWJtaXRCdXR0b24gJiYgKCB2YWxpZGF0b3Iuc2V0dGluZ3Muc3VibWl0SGFuZGxlciB8fCB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZCApICkge1xuXHRcdFx0XHRcdFx0aGlkZGVuID0gJCggXCI8aW5wdXQgdHlwZT0naGlkZGVuJy8+XCIgKVxuXHRcdFx0XHRcdFx0XHQuYXR0ciggXCJuYW1lXCIsIHZhbGlkYXRvci5zdWJtaXRCdXR0b24ubmFtZSApXG5cdFx0XHRcdFx0XHRcdC52YWwoICQoIHZhbGlkYXRvci5zdWJtaXRCdXR0b24gKS52YWwoKSApXG5cdFx0XHRcdFx0XHRcdC5hcHBlbmRUbyggdmFsaWRhdG9yLmN1cnJlbnRGb3JtICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCB2YWxpZGF0b3Iuc2V0dGluZ3Muc3VibWl0SGFuZGxlciApIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHZhbGlkYXRvci5zZXR0aW5ncy5zdWJtaXRIYW5kbGVyLmNhbGwoIHZhbGlkYXRvciwgdmFsaWRhdG9yLmN1cnJlbnRGb3JtLCBldmVudCApO1xuXHRcdFx0XHRcdFx0aWYgKCBoaWRkZW4gKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQW5kIGNsZWFuIHVwIGFmdGVyd2FyZHM7IHRoYW5rcyB0byBuby1ibG9jay1zY29wZSwgaGlkZGVuIGNhbiBiZSByZWZlcmVuY2VkXG5cdFx0XHRcdFx0XHRcdGhpZGRlbi5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggcmVzdWx0ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUHJldmVudCBzdWJtaXQgZm9yIGludmFsaWQgZm9ybXMgb3IgY3VzdG9tIHN1Ym1pdCBoYW5kbGVyc1xuXHRcdFx0XHRpZiAoIHZhbGlkYXRvci5jYW5jZWxTdWJtaXQgKSB7XG5cdFx0XHRcdFx0dmFsaWRhdG9yLmNhbmNlbFN1Ym1pdCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJldHVybiBoYW5kbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIHZhbGlkYXRvci5mb3JtKCkgKSB7XG5cdFx0XHRcdFx0aWYgKCB2YWxpZGF0b3IucGVuZGluZ1JlcXVlc3QgKSB7XG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBoYW5kbGUoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWxpZGF0b3IuZm9jdXNJbnZhbGlkKCk7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbGlkYXRvcjtcblx0fSxcblxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3ZhbGlkL1xuXHR2YWxpZDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZhbGlkLCB2YWxpZGF0b3IsIGVycm9yTGlzdDtcblxuXHRcdGlmICggJCggdGhpc1sgMCBdICkuaXMoIFwiZm9ybVwiICkgKSB7XG5cdFx0XHR2YWxpZCA9IHRoaXMudmFsaWRhdGUoKS5mb3JtKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVycm9yTGlzdCA9IFtdO1xuXHRcdFx0dmFsaWQgPSB0cnVlO1xuXHRcdFx0dmFsaWRhdG9yID0gJCggdGhpc1sgMCBdLmZvcm0gKS52YWxpZGF0ZSgpO1xuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFsaWQgPSB2YWxpZGF0b3IuZWxlbWVudCggdGhpcyApICYmIHZhbGlkO1xuXHRcdFx0XHRpZiAoICF2YWxpZCApIHtcblx0XHRcdFx0XHRlcnJvckxpc3QgPSBlcnJvckxpc3QuY29uY2F0KCB2YWxpZGF0b3IuZXJyb3JMaXN0ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHRcdHZhbGlkYXRvci5lcnJvckxpc3QgPSBlcnJvckxpc3Q7XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZDtcblx0fSxcblxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3J1bGVzL1xuXHRydWxlczogZnVuY3Rpb24oIGNvbW1hbmQsIGFyZ3VtZW50ICkge1xuXHRcdHZhciBlbGVtZW50ID0gdGhpc1sgMCBdLFxuXHRcdFx0c2V0dGluZ3MsIHN0YXRpY1J1bGVzLCBleGlzdGluZ1J1bGVzLCBkYXRhLCBwYXJhbSwgZmlsdGVyZWQ7XG5cblx0XHQvLyBJZiBub3RoaW5nIGlzIHNlbGVjdGVkLCByZXR1cm4gZW1wdHkgb2JqZWN0OyBjYW4ndCBjaGFpbiBhbnl3YXlcblx0XHRpZiAoIGVsZW1lbnQgPT0gbnVsbCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoICFlbGVtZW50LmZvcm0gJiYgZWxlbWVudC5oYXNBdHRyaWJ1dGUoIFwiY29udGVudGVkaXRhYmxlXCIgKSApIHtcblx0XHRcdGVsZW1lbnQuZm9ybSA9IHRoaXMuY2xvc2VzdCggXCJmb3JtXCIgKVsgMCBdO1xuXHRcdFx0ZWxlbWVudC5uYW1lID0gdGhpcy5hdHRyKCBcIm5hbWVcIiApO1xuXHRcdH1cblxuXHRcdGlmICggZWxlbWVudC5mb3JtID09IG51bGwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBjb21tYW5kICkge1xuXHRcdFx0c2V0dGluZ3MgPSAkLmRhdGEoIGVsZW1lbnQuZm9ybSwgXCJ2YWxpZGF0b3JcIiApLnNldHRpbmdzO1xuXHRcdFx0c3RhdGljUnVsZXMgPSBzZXR0aW5ncy5ydWxlcztcblx0XHRcdGV4aXN0aW5nUnVsZXMgPSAkLnZhbGlkYXRvci5zdGF0aWNSdWxlcyggZWxlbWVudCApO1xuXHRcdFx0c3dpdGNoICggY29tbWFuZCApIHtcblx0XHRcdGNhc2UgXCJhZGRcIjpcblx0XHRcdFx0JC5leHRlbmQoIGV4aXN0aW5nUnVsZXMsICQudmFsaWRhdG9yLm5vcm1hbGl6ZVJ1bGUoIGFyZ3VtZW50ICkgKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgbWVzc2FnZXMgZnJvbSBydWxlcywgYnV0IGFsbG93IHRoZW0gdG8gYmUgc2V0IHNlcGFyYXRlbHlcblx0XHRcdFx0ZGVsZXRlIGV4aXN0aW5nUnVsZXMubWVzc2FnZXM7XG5cdFx0XHRcdHN0YXRpY1J1bGVzWyBlbGVtZW50Lm5hbWUgXSA9IGV4aXN0aW5nUnVsZXM7XG5cdFx0XHRcdGlmICggYXJndW1lbnQubWVzc2FnZXMgKSB7XG5cdFx0XHRcdFx0c2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdID0gJC5leHRlbmQoIHNldHRpbmdzLm1lc3NhZ2VzWyBlbGVtZW50Lm5hbWUgXSwgYXJndW1lbnQubWVzc2FnZXMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJyZW1vdmVcIjpcblx0XHRcdFx0aWYgKCAhYXJndW1lbnQgKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHN0YXRpY1J1bGVzWyBlbGVtZW50Lm5hbWUgXTtcblx0XHRcdFx0XHRyZXR1cm4gZXhpc3RpbmdSdWxlcztcblx0XHRcdFx0fVxuXHRcdFx0XHRmaWx0ZXJlZCA9IHt9O1xuXHRcdFx0XHQkLmVhY2goIGFyZ3VtZW50LnNwbGl0KCAvXFxzLyApLCBmdW5jdGlvbiggaW5kZXgsIG1ldGhvZCApIHtcblx0XHRcdFx0XHRmaWx0ZXJlZFsgbWV0aG9kIF0gPSBleGlzdGluZ1J1bGVzWyBtZXRob2QgXTtcblx0XHRcdFx0XHRkZWxldGUgZXhpc3RpbmdSdWxlc1sgbWV0aG9kIF07XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0cmV0dXJuIGZpbHRlcmVkO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRhdGEgPSAkLnZhbGlkYXRvci5ub3JtYWxpemVSdWxlcyhcblx0XHQkLmV4dGVuZChcblx0XHRcdHt9LFxuXHRcdFx0JC52YWxpZGF0b3IuY2xhc3NSdWxlcyggZWxlbWVudCApLFxuXHRcdFx0JC52YWxpZGF0b3IuYXR0cmlidXRlUnVsZXMoIGVsZW1lbnQgKSxcblx0XHRcdCQudmFsaWRhdG9yLmRhdGFSdWxlcyggZWxlbWVudCApLFxuXHRcdFx0JC52YWxpZGF0b3Iuc3RhdGljUnVsZXMoIGVsZW1lbnQgKVxuXHRcdCksIGVsZW1lbnQgKTtcblxuXHRcdC8vIE1ha2Ugc3VyZSByZXF1aXJlZCBpcyBhdCBmcm9udFxuXHRcdGlmICggZGF0YS5yZXF1aXJlZCApIHtcblx0XHRcdHBhcmFtID0gZGF0YS5yZXF1aXJlZDtcblx0XHRcdGRlbGV0ZSBkYXRhLnJlcXVpcmVkO1xuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKCB7IHJlcXVpcmVkOiBwYXJhbSB9LCBkYXRhICk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIHJlbW90ZSBpcyBhdCBiYWNrXG5cdFx0aWYgKCBkYXRhLnJlbW90ZSApIHtcblx0XHRcdHBhcmFtID0gZGF0YS5yZW1vdGU7XG5cdFx0XHRkZWxldGUgZGF0YS5yZW1vdGU7XG5cdFx0XHRkYXRhID0gJC5leHRlbmQoIGRhdGEsIHsgcmVtb3RlOiBwYXJhbSB9ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cbn0gKTtcblxuLy8gQ3VzdG9tIHNlbGVjdG9yc1xuJC5leHRlbmQoICQuZXhwci5wc2V1ZG9zIHx8ICQuZXhwclsgXCI6XCIgXSwge1x0XHQvLyAnfHwgJC5leHByWyBcIjpcIiBdJyBoZXJlIGVuYWJsZXMgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgdG8galF1ZXJ5IDEuNy4gQ2FuIGJlIHJlbW92ZWQgd2hlbiBkcm9wcGluZyBqUSAxLjcueCBzdXBwb3J0XG5cblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9ibGFuay1zZWxlY3Rvci9cblx0Ymxhbms6IGZ1bmN0aW9uKCBhICkge1xuXHRcdHJldHVybiAhJC50cmltKCBcIlwiICsgJCggYSApLnZhbCgpICk7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9maWxsZWQtc2VsZWN0b3IvXG5cdGZpbGxlZDogZnVuY3Rpb24oIGEgKSB7XG5cdFx0dmFyIHZhbCA9ICQoIGEgKS52YWwoKTtcblx0XHRyZXR1cm4gdmFsICE9PSBudWxsICYmICEhJC50cmltKCBcIlwiICsgdmFsICk7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy91bmNoZWNrZWQtc2VsZWN0b3IvXG5cdHVuY2hlY2tlZDogZnVuY3Rpb24oIGEgKSB7XG5cdFx0cmV0dXJuICEkKCBhICkucHJvcCggXCJjaGVja2VkXCIgKTtcblx0fVxufSApO1xuXG4vLyBDb25zdHJ1Y3RvciBmb3IgdmFsaWRhdG9yXG4kLnZhbGlkYXRvciA9IGZ1bmN0aW9uKCBvcHRpb25zLCBmb3JtICkge1xuXHR0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoIHRydWUsIHt9LCAkLnZhbGlkYXRvci5kZWZhdWx0cywgb3B0aW9ucyApO1xuXHR0aGlzLmN1cnJlbnRGb3JtID0gZm9ybTtcblx0dGhpcy5pbml0KCk7XG59O1xuXG4vLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2pRdWVyeS52YWxpZGF0b3IuZm9ybWF0L1xuJC52YWxpZGF0b3IuZm9ybWF0ID0gZnVuY3Rpb24oIHNvdXJjZSwgcGFyYW1zICkge1xuXHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFyZ3MgPSAkLm1ha2VBcnJheSggYXJndW1lbnRzICk7XG5cdFx0XHRhcmdzLnVuc2hpZnQoIHNvdXJjZSApO1xuXHRcdFx0cmV0dXJuICQudmFsaWRhdG9yLmZvcm1hdC5hcHBseSggdGhpcywgYXJncyApO1xuXHRcdH07XG5cdH1cblx0aWYgKCBwYXJhbXMgPT09IHVuZGVmaW5lZCApIHtcblx0XHRyZXR1cm4gc291cmNlO1xuXHR9XG5cdGlmICggYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgcGFyYW1zLmNvbnN0cnVjdG9yICE9PSBBcnJheSAgKSB7XG5cdFx0cGFyYW1zID0gJC5tYWtlQXJyYXkoIGFyZ3VtZW50cyApLnNsaWNlKCAxICk7XG5cdH1cblx0aWYgKCBwYXJhbXMuY29uc3RydWN0b3IgIT09IEFycmF5ICkge1xuXHRcdHBhcmFtcyA9IFsgcGFyYW1zIF07XG5cdH1cblx0JC5lYWNoKCBwYXJhbXMsIGZ1bmN0aW9uKCBpLCBuICkge1xuXHRcdHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKCBuZXcgUmVnRXhwKCBcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIiApLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBuO1xuXHRcdH0gKTtcblx0fSApO1xuXHRyZXR1cm4gc291cmNlO1xufTtcblxuJC5leHRlbmQoICQudmFsaWRhdG9yLCB7XG5cblx0ZGVmYXVsdHM6IHtcblx0XHRtZXNzYWdlczoge30sXG5cdFx0Z3JvdXBzOiB7fSxcblx0XHRydWxlczoge30sXG5cdFx0ZXJyb3JDbGFzczogXCJlcnJvclwiLFxuXHRcdHBlbmRpbmdDbGFzczogXCJwZW5kaW5nXCIsXG5cdFx0dmFsaWRDbGFzczogXCJ2YWxpZFwiLFxuXHRcdGVycm9yRWxlbWVudDogXCJsYWJlbFwiLFxuXHRcdGZvY3VzQ2xlYW51cDogZmFsc2UsXG5cdFx0Zm9jdXNJbnZhbGlkOiB0cnVlLFxuXHRcdGVycm9yQ29udGFpbmVyOiAkKCBbXSApLFxuXHRcdGVycm9yTGFiZWxDb250YWluZXI6ICQoIFtdICksXG5cdFx0b25zdWJtaXQ6IHRydWUsXG5cdFx0aWdub3JlOiBcIjpoaWRkZW5cIixcblx0XHRpZ25vcmVUaXRsZTogZmFsc2UsXG5cdFx0b25mb2N1c2luOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdHRoaXMubGFzdEFjdGl2ZSA9IGVsZW1lbnQ7XG5cblx0XHRcdC8vIEhpZGUgZXJyb3IgbGFiZWwgYW5kIHJlbW92ZSBlcnJvciBjbGFzcyBvbiBmb2N1cyBpZiBlbmFibGVkXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MuZm9jdXNDbGVhbnVwICkge1xuXHRcdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MudW5oaWdobGlnaHQgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy51bmhpZ2hsaWdodC5jYWxsKCB0aGlzLCBlbGVtZW50LCB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3MsIHRoaXMuc2V0dGluZ3MudmFsaWRDbGFzcyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuaGlkZVRoZXNlKCB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbmZvY3Vzb3V0OiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdGlmICggIXRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgJiYgKCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgfHwgIXRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSApICkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQoIGVsZW1lbnQgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9ua2V5dXA6IGZ1bmN0aW9uKCBlbGVtZW50LCBldmVudCApIHtcblxuXHRcdFx0Ly8gQXZvaWQgcmV2YWxpZGF0ZSB0aGUgZmllbGQgd2hlbiBwcmVzc2luZyBvbmUgb2YgdGhlIGZvbGxvd2luZyBrZXlzXG5cdFx0XHQvLyBTaGlmdCAgICAgICA9PiAxNlxuXHRcdFx0Ly8gQ3RybCAgICAgICAgPT4gMTdcblx0XHRcdC8vIEFsdCAgICAgICAgID0+IDE4XG5cdFx0XHQvLyBDYXBzIGxvY2sgICA9PiAyMFxuXHRcdFx0Ly8gRW5kICAgICAgICAgPT4gMzVcblx0XHRcdC8vIEhvbWUgICAgICAgID0+IDM2XG5cdFx0XHQvLyBMZWZ0IGFycm93ICA9PiAzN1xuXHRcdFx0Ly8gVXAgYXJyb3cgICAgPT4gMzhcblx0XHRcdC8vIFJpZ2h0IGFycm93ID0+IDM5XG5cdFx0XHQvLyBEb3duIGFycm93ICA9PiA0MFxuXHRcdFx0Ly8gSW5zZXJ0ICAgICAgPT4gNDVcblx0XHRcdC8vIE51bSBsb2NrICAgID0+IDE0NFxuXHRcdFx0Ly8gQWx0R3Iga2V5ICAgPT4gMjI1XG5cdFx0XHR2YXIgZXhjbHVkZWRLZXlzID0gW1xuXHRcdFx0XHQxNiwgMTcsIDE4LCAyMCwgMzUsIDM2LCAzNyxcblx0XHRcdFx0MzgsIDM5LCA0MCwgNDUsIDE0NCwgMjI1XG5cdFx0XHRdO1xuXG5cdFx0XHRpZiAoIGV2ZW50LndoaWNoID09PSA5ICYmIHRoaXMuZWxlbWVudFZhbHVlKCBlbGVtZW50ICkgPT09IFwiXCIgfHwgJC5pbkFycmF5KCBldmVudC5rZXlDb2RlLCBleGNsdWRlZEtleXMgKSAhPT0gLTEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSBpZiAoIGVsZW1lbnQubmFtZSBpbiB0aGlzLnN1Ym1pdHRlZCB8fCBlbGVtZW50Lm5hbWUgaW4gdGhpcy5pbnZhbGlkICkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQoIGVsZW1lbnQgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uY2xpY2s6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXG5cdFx0XHQvLyBDbGljayBvbiBzZWxlY3RzLCByYWRpb2J1dHRvbnMgYW5kIGNoZWNrYm94ZXNcblx0XHRcdGlmICggZWxlbWVudC5uYW1lIGluIHRoaXMuc3VibWl0dGVkICkge1xuXHRcdFx0XHR0aGlzLmVsZW1lbnQoIGVsZW1lbnQgKTtcblxuXHRcdFx0Ly8gT3Igb3B0aW9uIGVsZW1lbnRzLCBjaGVjayBwYXJlbnQgc2VsZWN0IGluIHRoYXQgY2FzZVxuXHRcdFx0fSBlbHNlIGlmICggZWxlbWVudC5wYXJlbnROb2RlLm5hbWUgaW4gdGhpcy5zdWJtaXR0ZWQgKSB7XG5cdFx0XHRcdHRoaXMuZWxlbWVudCggZWxlbWVudC5wYXJlbnROb2RlICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoaWdobGlnaHQ6IGZ1bmN0aW9uKCBlbGVtZW50LCBlcnJvckNsYXNzLCB2YWxpZENsYXNzICkge1xuXHRcdFx0aWYgKCBlbGVtZW50LnR5cGUgPT09IFwicmFkaW9cIiApIHtcblx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5hZGRDbGFzcyggZXJyb3JDbGFzcyApLnJlbW92ZUNsYXNzKCB2YWxpZENsYXNzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCBlbGVtZW50ICkuYWRkQ2xhc3MoIGVycm9yQ2xhc3MgKS5yZW1vdmVDbGFzcyggdmFsaWRDbGFzcyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dW5oaWdobGlnaHQ6IGZ1bmN0aW9uKCBlbGVtZW50LCBlcnJvckNsYXNzLCB2YWxpZENsYXNzICkge1xuXHRcdFx0aWYgKCBlbGVtZW50LnR5cGUgPT09IFwicmFkaW9cIiApIHtcblx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5yZW1vdmVDbGFzcyggZXJyb3JDbGFzcyApLmFkZENsYXNzKCB2YWxpZENsYXNzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCBlbGVtZW50ICkucmVtb3ZlQ2xhc3MoIGVycm9yQ2xhc3MgKS5hZGRDbGFzcyggdmFsaWRDbGFzcyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2pRdWVyeS52YWxpZGF0b3Iuc2V0RGVmYXVsdHMvXG5cdHNldERlZmF1bHRzOiBmdW5jdGlvbiggc2V0dGluZ3MgKSB7XG5cdFx0JC5leHRlbmQoICQudmFsaWRhdG9yLmRlZmF1bHRzLCBzZXR0aW5ncyApO1xuXHR9LFxuXG5cdG1lc3NhZ2VzOiB7XG5cdFx0cmVxdWlyZWQ6IFwiVGhpcyBmaWVsZCBpcyByZXF1aXJlZC5cIixcblx0XHRyZW1vdGU6IFwiUGxlYXNlIGZpeCB0aGlzIGZpZWxkLlwiLFxuXHRcdGVtYWlsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MuXCIsXG5cdFx0dXJsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIFVSTC5cIixcblx0XHRkYXRlOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGUuXCIsXG5cdFx0ZGF0ZUlTTzogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBkYXRlIChJU08pLlwiLFxuXHRcdG51bWJlcjogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBudW1iZXIuXCIsXG5cdFx0ZGlnaXRzOiBcIlBsZWFzZSBlbnRlciBvbmx5IGRpZ2l0cy5cIixcblx0XHRlcXVhbFRvOiBcIlBsZWFzZSBlbnRlciB0aGUgc2FtZSB2YWx1ZSBhZ2Fpbi5cIixcblx0XHRtYXhsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgbm8gbW9yZSB0aGFuIHswfSBjaGFyYWN0ZXJzLlwiICksXG5cdFx0bWlubGVuZ3RoOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGF0IGxlYXN0IHswfSBjaGFyYWN0ZXJzLlwiICksXG5cdFx0cmFuZ2VsZW5ndGg6ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBiZXR3ZWVuIHswfSBhbmQgezF9IGNoYXJhY3RlcnMgbG9uZy5cIiApLFxuXHRcdHJhbmdlOiAkLnZhbGlkYXRvci5mb3JtYXQoIFwiUGxlYXNlIGVudGVyIGEgdmFsdWUgYmV0d2VlbiB7MH0gYW5kIHsxfS5cIiApLFxuXHRcdG1heDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIHZhbHVlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB7MH0uXCIgKSxcblx0XHRtaW46ICQudmFsaWRhdG9yLmZvcm1hdCggXCJQbGVhc2UgZW50ZXIgYSB2YWx1ZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gezB9LlwiICksXG5cdFx0c3RlcDogJC52YWxpZGF0b3IuZm9ybWF0KCBcIlBsZWFzZSBlbnRlciBhIG11bHRpcGxlIG9mIHswfS5cIiApXG5cdH0sXG5cblx0YXV0b0NyZWF0ZVJhbmdlczogZmFsc2UsXG5cblx0cHJvdG90eXBlOiB7XG5cblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMubGFiZWxDb250YWluZXIgPSAkKCB0aGlzLnNldHRpbmdzLmVycm9yTGFiZWxDb250YWluZXIgKTtcblx0XHRcdHRoaXMuZXJyb3JDb250ZXh0ID0gdGhpcy5sYWJlbENvbnRhaW5lci5sZW5ndGggJiYgdGhpcy5sYWJlbENvbnRhaW5lciB8fCAkKCB0aGlzLmN1cnJlbnRGb3JtICk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lcnMgPSAkKCB0aGlzLnNldHRpbmdzLmVycm9yQ29udGFpbmVyICkuYWRkKCB0aGlzLnNldHRpbmdzLmVycm9yTGFiZWxDb250YWluZXIgKTtcblx0XHRcdHRoaXMuc3VibWl0dGVkID0ge307XG5cdFx0XHR0aGlzLnZhbHVlQ2FjaGUgPSB7fTtcblx0XHRcdHRoaXMucGVuZGluZ1JlcXVlc3QgPSAwO1xuXHRcdFx0dGhpcy5wZW5kaW5nID0ge307XG5cdFx0XHR0aGlzLmludmFsaWQgPSB7fTtcblx0XHRcdHRoaXMucmVzZXQoKTtcblxuXHRcdFx0dmFyIGdyb3VwcyA9ICggdGhpcy5ncm91cHMgPSB7fSApLFxuXHRcdFx0XHRydWxlcztcblx0XHRcdCQuZWFjaCggdGhpcy5zZXR0aW5ncy5ncm91cHMsIGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdFx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnNwbGl0KCAvXFxzLyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQuZWFjaCggdmFsdWUsIGZ1bmN0aW9uKCBpbmRleCwgbmFtZSApIHtcblx0XHRcdFx0XHRncm91cHNbIG5hbWUgXSA9IGtleTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdFx0cnVsZXMgPSB0aGlzLnNldHRpbmdzLnJ1bGVzO1xuXHRcdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cdFx0XHRcdHJ1bGVzWyBrZXkgXSA9ICQudmFsaWRhdG9yLm5vcm1hbGl6ZVJ1bGUoIHZhbHVlICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGRlbGVnYXRlKCBldmVudCApIHtcblxuXHRcdFx0XHQvLyBTZXQgZm9ybSBleHBhbmRvIG9uIGNvbnRlbnRlZGl0YWJsZVxuXHRcdFx0XHRpZiAoICF0aGlzLmZvcm0gJiYgdGhpcy5oYXNBdHRyaWJ1dGUoIFwiY29udGVudGVkaXRhYmxlXCIgKSApIHtcblx0XHRcdFx0XHR0aGlzLmZvcm0gPSAkKCB0aGlzICkuY2xvc2VzdCggXCJmb3JtXCIgKVsgMCBdO1xuXHRcdFx0XHRcdHRoaXMubmFtZSA9ICQoIHRoaXMgKS5hdHRyKCBcIm5hbWVcIiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHZhbGlkYXRvciA9ICQuZGF0YSggdGhpcy5mb3JtLCBcInZhbGlkYXRvclwiICksXG5cdFx0XHRcdFx0ZXZlbnRUeXBlID0gXCJvblwiICsgZXZlbnQudHlwZS5yZXBsYWNlKCAvXnZhbGlkYXRlLywgXCJcIiApLFxuXHRcdFx0XHRcdHNldHRpbmdzID0gdmFsaWRhdG9yLnNldHRpbmdzO1xuXHRcdFx0XHRpZiAoIHNldHRpbmdzWyBldmVudFR5cGUgXSAmJiAhJCggdGhpcyApLmlzKCBzZXR0aW5ncy5pZ25vcmUgKSApIHtcblx0XHRcdFx0XHRzZXR0aW5nc1sgZXZlbnRUeXBlIF0uY2FsbCggdmFsaWRhdG9yLCB0aGlzLCBldmVudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKVxuXHRcdFx0XHQub24oIFwiZm9jdXNpbi52YWxpZGF0ZSBmb2N1c291dC52YWxpZGF0ZSBrZXl1cC52YWxpZGF0ZVwiLFxuXHRcdFx0XHRcdFwiOnRleHQsIFt0eXBlPSdwYXNzd29yZCddLCBbdHlwZT0nZmlsZSddLCBzZWxlY3QsIHRleHRhcmVhLCBbdHlwZT0nbnVtYmVyJ10sIFt0eXBlPSdzZWFyY2gnXSwgXCIgK1xuXHRcdFx0XHRcdFwiW3R5cGU9J3RlbCddLCBbdHlwZT0ndXJsJ10sIFt0eXBlPSdlbWFpbCddLCBbdHlwZT0nZGF0ZXRpbWUnXSwgW3R5cGU9J2RhdGUnXSwgW3R5cGU9J21vbnRoJ10sIFwiICtcblx0XHRcdFx0XHRcIlt0eXBlPSd3ZWVrJ10sIFt0eXBlPSd0aW1lJ10sIFt0eXBlPSdkYXRldGltZS1sb2NhbCddLCBbdHlwZT0ncmFuZ2UnXSwgW3R5cGU9J2NvbG9yJ10sIFwiICtcblx0XHRcdFx0XHRcIlt0eXBlPSdyYWRpbyddLCBbdHlwZT0nY2hlY2tib3gnXSwgW2NvbnRlbnRlZGl0YWJsZV0sIFt0eXBlPSdidXR0b24nXVwiLCBkZWxlZ2F0ZSApXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lLCBvbGRJRVxuXHRcdFx0XHQvLyBcInNlbGVjdFwiIGlzIHByb3ZpZGVkIGFzIGV2ZW50LnRhcmdldCB3aGVuIGNsaWNraW5nIGEgb3B0aW9uXG5cdFx0XHRcdC5vbiggXCJjbGljay52YWxpZGF0ZVwiLCBcInNlbGVjdCwgb3B0aW9uLCBbdHlwZT0ncmFkaW8nXSwgW3R5cGU9J2NoZWNrYm94J11cIiwgZGVsZWdhdGUgKTtcblxuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmludmFsaWRIYW5kbGVyICkge1xuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkub24oIFwiaW52YWxpZC1mb3JtLnZhbGlkYXRlXCIsIHRoaXMuc2V0dGluZ3MuaW52YWxpZEhhbmRsZXIgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9WYWxpZGF0b3IuZm9ybS9cblx0XHRmb3JtOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuY2hlY2tGb3JtKCk7XG5cdFx0XHQkLmV4dGVuZCggdGhpcy5zdWJtaXR0ZWQsIHRoaXMuZXJyb3JNYXAgKTtcblx0XHRcdHRoaXMuaW52YWxpZCA9ICQuZXh0ZW5kKCB7fSwgdGhpcy5lcnJvck1hcCApO1xuXHRcdFx0aWYgKCAhdGhpcy52YWxpZCgpICkge1xuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkudHJpZ2dlckhhbmRsZXIoIFwiaW52YWxpZC1mb3JtXCIsIFsgdGhpcyBdICk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNob3dFcnJvcnMoKTtcblx0XHRcdHJldHVybiB0aGlzLnZhbGlkKCk7XG5cdFx0fSxcblxuXHRcdGNoZWNrRm9ybTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnByZXBhcmVGb3JtKCk7XG5cdFx0XHRmb3IgKCB2YXIgaSA9IDAsIGVsZW1lbnRzID0gKCB0aGlzLmN1cnJlbnRFbGVtZW50cyA9IHRoaXMuZWxlbWVudHMoKSApOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XG5cdFx0XHRcdHRoaXMuY2hlY2soIGVsZW1lbnRzWyBpIF0gKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnZhbGlkKCk7XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvVmFsaWRhdG9yLmVsZW1lbnQvXG5cdFx0ZWxlbWVudDogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgY2xlYW5FbGVtZW50ID0gdGhpcy5jbGVhbiggZWxlbWVudCApLFxuXHRcdFx0XHRjaGVja0VsZW1lbnQgPSB0aGlzLnZhbGlkYXRpb25UYXJnZXRGb3IoIGNsZWFuRWxlbWVudCApLFxuXHRcdFx0XHR2ID0gdGhpcyxcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZSxcblx0XHRcdFx0cnMsIGdyb3VwO1xuXG5cdFx0XHRpZiAoIGNoZWNrRWxlbWVudCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5pbnZhbGlkWyBjbGVhbkVsZW1lbnQubmFtZSBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wcmVwYXJlRWxlbWVudCggY2hlY2tFbGVtZW50ICk7XG5cdFx0XHRcdHRoaXMuY3VycmVudEVsZW1lbnRzID0gJCggY2hlY2tFbGVtZW50ICk7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBlbGVtZW50IGlzIGdyb3VwZWQsIHRoZW4gdmFsaWRhdGUgYWxsIGdyb3VwIGVsZW1lbnRzIGFscmVhZHlcblx0XHRcdFx0Ly8gY29udGFpbmluZyBhIHZhbHVlXG5cdFx0XHRcdGdyb3VwID0gdGhpcy5ncm91cHNbIGNoZWNrRWxlbWVudC5uYW1lIF07XG5cdFx0XHRcdGlmICggZ3JvdXAgKSB7XG5cdFx0XHRcdFx0JC5lYWNoKCB0aGlzLmdyb3VwcywgZnVuY3Rpb24oIG5hbWUsIHRlc3Rncm91cCApIHtcblx0XHRcdFx0XHRcdGlmICggdGVzdGdyb3VwID09PSBncm91cCAmJiBuYW1lICE9PSBjaGVja0VsZW1lbnQubmFtZSApIHtcblx0XHRcdFx0XHRcdFx0Y2xlYW5FbGVtZW50ID0gdi52YWxpZGF0aW9uVGFyZ2V0Rm9yKCB2LmNsZWFuKCB2LmZpbmRCeU5hbWUoIG5hbWUgKSApICk7XG5cdFx0XHRcdFx0XHRcdGlmICggY2xlYW5FbGVtZW50ICYmIGNsZWFuRWxlbWVudC5uYW1lIGluIHYuaW52YWxpZCApIHtcblx0XHRcdFx0XHRcdFx0XHR2LmN1cnJlbnRFbGVtZW50cy5wdXNoKCBjbGVhbkVsZW1lbnQgKTtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgPSB2LmNoZWNrKCBjbGVhbkVsZW1lbnQgKSAmJiByZXN1bHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRycyA9IHRoaXMuY2hlY2soIGNoZWNrRWxlbWVudCApICE9PSBmYWxzZTtcblx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0ICYmIHJzO1xuXHRcdFx0XHRpZiAoIHJzICkge1xuXHRcdFx0XHRcdHRoaXMuaW52YWxpZFsgY2hlY2tFbGVtZW50Lm5hbWUgXSA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuaW52YWxpZFsgY2hlY2tFbGVtZW50Lm5hbWUgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICF0aGlzLm51bWJlck9mSW52YWxpZHMoKSApIHtcblxuXHRcdFx0XHRcdC8vIEhpZGUgZXJyb3IgY29udGFpbmVycyBvbiBsYXN0IGVycm9yXG5cdFx0XHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLnRvSGlkZS5hZGQoIHRoaXMuY29udGFpbmVycyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2hvd0Vycm9ycygpO1xuXG5cdFx0XHRcdC8vIEFkZCBhcmlhLWludmFsaWQgc3RhdHVzIGZvciBzY3JlZW4gcmVhZGVyc1xuXHRcdFx0XHQkKCBlbGVtZW50ICkuYXR0ciggXCJhcmlhLWludmFsaWRcIiwgIXJzICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvVmFsaWRhdG9yLnNob3dFcnJvcnMvXG5cdFx0c2hvd0Vycm9yczogZnVuY3Rpb24oIGVycm9ycyApIHtcblx0XHRcdGlmICggZXJyb3JzICkge1xuXHRcdFx0XHR2YXIgdmFsaWRhdG9yID0gdGhpcztcblxuXHRcdFx0XHQvLyBBZGQgaXRlbXMgdG8gZXJyb3IgbGlzdCBhbmQgbWFwXG5cdFx0XHRcdCQuZXh0ZW5kKCB0aGlzLmVycm9yTWFwLCBlcnJvcnMgKTtcblx0XHRcdFx0dGhpcy5lcnJvckxpc3QgPSAkLm1hcCggdGhpcy5lcnJvck1hcCwgZnVuY3Rpb24oIG1lc3NhZ2UsIG5hbWUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRlbGVtZW50OiB2YWxpZGF0b3IuZmluZEJ5TmFtZSggbmFtZSApWyAwIF1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIGl0ZW1zIGZyb20gc3VjY2VzcyBsaXN0XG5cdFx0XHRcdHRoaXMuc3VjY2Vzc0xpc3QgPSAkLmdyZXAoIHRoaXMuc3VjY2Vzc0xpc3QsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0XHRcdHJldHVybiAhKCBlbGVtZW50Lm5hbWUgaW4gZXJyb3JzICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5zaG93RXJyb3JzICkge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLnNob3dFcnJvcnMuY2FsbCggdGhpcywgdGhpcy5lcnJvck1hcCwgdGhpcy5lcnJvckxpc3QgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGVmYXVsdFNob3dFcnJvcnMoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9WYWxpZGF0b3IucmVzZXRGb3JtL1xuXHRcdHJlc2V0Rm9ybTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICQuZm4ucmVzZXRGb3JtICkge1xuXHRcdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtICkucmVzZXRGb3JtKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmludmFsaWQgPSB7fTtcblx0XHRcdHRoaXMuc3VibWl0dGVkID0ge307XG5cdFx0XHR0aGlzLnByZXBhcmVGb3JtKCk7XG5cdFx0XHR0aGlzLmhpZGVFcnJvcnMoKTtcblx0XHRcdHZhciBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHMoKVxuXHRcdFx0XHQucmVtb3ZlRGF0YSggXCJwcmV2aW91c1ZhbHVlXCIgKVxuXHRcdFx0XHQucmVtb3ZlQXR0ciggXCJhcmlhLWludmFsaWRcIiApO1xuXG5cdFx0XHR0aGlzLnJlc2V0RWxlbWVudHMoIGVsZW1lbnRzICk7XG5cdFx0fSxcblxuXHRcdHJlc2V0RWxlbWVudHM6IGZ1bmN0aW9uKCBlbGVtZW50cyApIHtcblx0XHRcdHZhciBpO1xuXG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MudW5oaWdobGlnaHQgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy51bmhpZ2hsaWdodC5jYWxsKCB0aGlzLCBlbGVtZW50c1sgaSBdLFxuXHRcdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzLCBcIlwiICk7XG5cdFx0XHRcdFx0dGhpcy5maW5kQnlOYW1lKCBlbGVtZW50c1sgaSBdLm5hbWUgKS5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnRzXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3MgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdG51bWJlck9mSW52YWxpZHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0TGVuZ3RoKCB0aGlzLmludmFsaWQgKTtcblx0XHR9LFxuXG5cdFx0b2JqZWN0TGVuZ3RoOiBmdW5jdGlvbiggb2JqICkge1xuXHRcdFx0LyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cblx0XHRcdHZhciBjb3VudCA9IDAsXG5cdFx0XHRcdGk7XG5cdFx0XHRmb3IgKCBpIGluIG9iaiApIHtcblxuXHRcdFx0XHQvLyBUaGlzIGNoZWNrIGFsbG93cyBjb3VudGluZyBlbGVtZW50cyB3aXRoIGVtcHR5IGVycm9yXG5cdFx0XHRcdC8vIG1lc3NhZ2UgYXMgaW52YWxpZCBlbGVtZW50c1xuXHRcdFx0XHRpZiAoIG9ialsgaSBdICE9PSB1bmRlZmluZWQgJiYgb2JqWyBpIF0gIT09IG51bGwgJiYgb2JqWyBpIF0gIT09IGZhbHNlICkge1xuXHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9LFxuXG5cdFx0aGlkZUVycm9yczogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmhpZGVUaGVzZSggdGhpcy50b0hpZGUgKTtcblx0XHR9LFxuXG5cdFx0aGlkZVRoZXNlOiBmdW5jdGlvbiggZXJyb3JzICkge1xuXHRcdFx0ZXJyb3JzLm5vdCggdGhpcy5jb250YWluZXJzICkudGV4dCggXCJcIiApO1xuXHRcdFx0dGhpcy5hZGRXcmFwcGVyKCBlcnJvcnMgKS5oaWRlKCk7XG5cdFx0fSxcblxuXHRcdHZhbGlkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLnNpemUoKSA9PT0gMDtcblx0XHR9LFxuXG5cdFx0c2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lcnJvckxpc3QubGVuZ3RoO1xuXHRcdH0sXG5cblx0XHRmb2N1c0ludmFsaWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmZvY3VzSW52YWxpZCApIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQkKCB0aGlzLmZpbmRMYXN0QWN0aXZlKCkgfHwgdGhpcy5lcnJvckxpc3QubGVuZ3RoICYmIHRoaXMuZXJyb3JMaXN0WyAwIF0uZWxlbWVudCB8fCBbXSApXG5cdFx0XHRcdFx0LmZpbHRlciggXCI6dmlzaWJsZVwiIClcblx0XHRcdFx0XHQuZm9jdXMoKVxuXG5cdFx0XHRcdFx0Ly8gTWFudWFsbHkgdHJpZ2dlciBmb2N1c2luIGV2ZW50OyB3aXRob3V0IGl0LCBmb2N1c2luIGhhbmRsZXIgaXNuJ3QgY2FsbGVkLCBmaW5kTGFzdEFjdGl2ZSB3b24ndCBoYXZlIGFueXRoaW5nIHRvIGZpbmRcblx0XHRcdFx0XHQudHJpZ2dlciggXCJmb2N1c2luXCIgKTtcblx0XHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cblx0XHRcdFx0XHQvLyBJZ25vcmUgSUUgdGhyb3dpbmcgZXJyb3JzIHdoZW4gZm9jdXNpbmcgaGlkZGVuIGVsZW1lbnRzXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0ZmluZExhc3RBY3RpdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3RBY3RpdmUgPSB0aGlzLmxhc3RBY3RpdmU7XG5cdFx0XHRyZXR1cm4gbGFzdEFjdGl2ZSAmJiAkLmdyZXAoIHRoaXMuZXJyb3JMaXN0LCBmdW5jdGlvbiggbiApIHtcblx0XHRcdFx0cmV0dXJuIG4uZWxlbWVudC5uYW1lID09PSBsYXN0QWN0aXZlLm5hbWU7XG5cdFx0XHR9ICkubGVuZ3RoID09PSAxICYmIGxhc3RBY3RpdmU7XG5cdFx0fSxcblxuXHRcdGVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB2YWxpZGF0b3IgPSB0aGlzLFxuXHRcdFx0XHRydWxlc0NhY2hlID0ge307XG5cblx0XHRcdC8vIFNlbGVjdCBhbGwgdmFsaWQgaW5wdXRzIGluc2lkZSB0aGUgZm9ybSAobm8gc3VibWl0IG9yIHJlc2V0IGJ1dHRvbnMpXG5cdFx0XHRyZXR1cm4gJCggdGhpcy5jdXJyZW50Rm9ybSApXG5cdFx0XHQuZmluZCggXCJpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSwgW2NvbnRlbnRlZGl0YWJsZV1cIiApXG5cdFx0XHQubm90KCBcIjpzdWJtaXQsIDpyZXNldCwgOmltYWdlLCA6ZGlzYWJsZWRcIiApXG5cdFx0XHQubm90KCB0aGlzLnNldHRpbmdzLmlnbm9yZSApXG5cdFx0XHQuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIG5hbWUgPSB0aGlzLm5hbWUgfHwgJCggdGhpcyApLmF0dHIoIFwibmFtZVwiICk7IC8vIEZvciBjb250ZW50ZWRpdGFibGVcblx0XHRcdFx0aWYgKCAhbmFtZSAmJiB2YWxpZGF0b3Iuc2V0dGluZ3MuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciggXCIlbyBoYXMgbm8gbmFtZSBhc3NpZ25lZFwiLCB0aGlzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTZXQgZm9ybSBleHBhbmRvIG9uIGNvbnRlbnRlZGl0YWJsZVxuXHRcdFx0XHRpZiAoIHRoaXMuaGFzQXR0cmlidXRlKCBcImNvbnRlbnRlZGl0YWJsZVwiICkgKSB7XG5cdFx0XHRcdFx0dGhpcy5mb3JtID0gJCggdGhpcyApLmNsb3Nlc3QoIFwiZm9ybVwiIClbIDAgXTtcblx0XHRcdFx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU2VsZWN0IG9ubHkgdGhlIGZpcnN0IGVsZW1lbnQgZm9yIGVhY2ggbmFtZSwgYW5kIG9ubHkgdGhvc2Ugd2l0aCBydWxlcyBzcGVjaWZpZWRcblx0XHRcdFx0aWYgKCBuYW1lIGluIHJ1bGVzQ2FjaGUgfHwgIXZhbGlkYXRvci5vYmplY3RMZW5ndGgoICQoIHRoaXMgKS5ydWxlcygpICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cnVsZXNDYWNoZVsgbmFtZSBdID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdGNsZWFuOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gJCggc2VsZWN0b3IgKVsgMCBdO1xuXHRcdH0sXG5cblx0XHRlcnJvcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGVycm9yQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3Muc3BsaXQoIFwiIFwiICkuam9pbiggXCIuXCIgKTtcblx0XHRcdHJldHVybiAkKCB0aGlzLnNldHRpbmdzLmVycm9yRWxlbWVudCArIFwiLlwiICsgZXJyb3JDbGFzcywgdGhpcy5lcnJvckNvbnRleHQgKTtcblx0XHR9LFxuXG5cdFx0cmVzZXRJbnRlcm5hbHM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zdWNjZXNzTGlzdCA9IFtdO1xuXHRcdFx0dGhpcy5lcnJvckxpc3QgPSBbXTtcblx0XHRcdHRoaXMuZXJyb3JNYXAgPSB7fTtcblx0XHRcdHRoaXMudG9TaG93ID0gJCggW10gKTtcblx0XHRcdHRoaXMudG9IaWRlID0gJCggW10gKTtcblx0XHR9LFxuXG5cdFx0cmVzZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5yZXNldEludGVybmFscygpO1xuXHRcdFx0dGhpcy5jdXJyZW50RWxlbWVudHMgPSAkKCBbXSApO1xuXHRcdH0sXG5cblx0XHRwcmVwYXJlRm9ybTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHR0aGlzLnRvSGlkZSA9IHRoaXMuZXJyb3JzKCkuYWRkKCB0aGlzLmNvbnRhaW5lcnMgKTtcblx0XHR9LFxuXG5cdFx0cHJlcGFyZUVsZW1lbnQ6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0dGhpcy5yZXNldCgpO1xuXHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApO1xuXHRcdH0sXG5cblx0XHRlbGVtZW50VmFsdWU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0dmFyICRlbGVtZW50ID0gJCggZWxlbWVudCApLFxuXHRcdFx0XHR0eXBlID0gZWxlbWVudC50eXBlLFxuXHRcdFx0XHR2YWwsIGlkeDtcblxuXHRcdFx0aWYgKCB0eXBlID09PSBcInJhZGlvXCIgfHwgdHlwZSA9PT0gXCJjaGVja2JveFwiICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKS5maWx0ZXIoIFwiOmNoZWNrZWRcIiApLnZhbCgpO1xuXHRcdFx0fSBlbHNlIGlmICggdHlwZSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgZWxlbWVudC52YWxpZGl0eSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsaWRpdHkuYmFkSW5wdXQgPyBcIk5hTlwiIDogJGVsZW1lbnQudmFsKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZWxlbWVudC5oYXNBdHRyaWJ1dGUoIFwiY29udGVudGVkaXRhYmxlXCIgKSApIHtcblx0XHRcdFx0dmFsID0gJGVsZW1lbnQudGV4dCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsID0gJGVsZW1lbnQudmFsKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZSA9PT0gXCJmaWxlXCIgKSB7XG5cblx0XHRcdFx0Ly8gTW9kZXJuIGJyb3dzZXIgKGNocm9tZSAmIHNhZmFyaSlcblx0XHRcdFx0aWYgKCB2YWwuc3Vic3RyKCAwLCAxMiApID09PSBcIkM6XFxcXGZha2VwYXRoXFxcXFwiICkge1xuXHRcdFx0XHRcdHJldHVybiB2YWwuc3Vic3RyKCAxMiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTGVnYWN5IGJyb3dzZXJzXG5cdFx0XHRcdC8vIFVuaXgtYmFzZWQgcGF0aFxuXHRcdFx0XHRpZHggPSB2YWwubGFzdEluZGV4T2YoIFwiL1wiICk7XG5cdFx0XHRcdGlmICggaWR4ID49IDAgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZhbC5zdWJzdHIoIGlkeCArIDEgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFdpbmRvd3MtYmFzZWQgcGF0aFxuXHRcdFx0XHRpZHggPSB2YWwubGFzdEluZGV4T2YoIFwiXFxcXFwiICk7XG5cdFx0XHRcdGlmICggaWR4ID49IDAgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHZhbC5zdWJzdHIoIGlkeCArIDEgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEp1c3QgdGhlIGZpbGUgbmFtZVxuXHRcdFx0XHRyZXR1cm4gdmFsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdHJldHVybiB2YWwucmVwbGFjZSggL1xcci9nLCBcIlwiICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH0sXG5cblx0XHRjaGVjazogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50ID0gdGhpcy52YWxpZGF0aW9uVGFyZ2V0Rm9yKCB0aGlzLmNsZWFuKCBlbGVtZW50ICkgKTtcblxuXHRcdFx0dmFyIHJ1bGVzID0gJCggZWxlbWVudCApLnJ1bGVzKCksXG5cdFx0XHRcdHJ1bGVzQ291bnQgPSAkLm1hcCggcnVsZXMsIGZ1bmN0aW9uKCBuLCBpICkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9ICkubGVuZ3RoLFxuXHRcdFx0XHRkZXBlbmRlbmN5TWlzbWF0Y2ggPSBmYWxzZSxcblx0XHRcdFx0dmFsID0gdGhpcy5lbGVtZW50VmFsdWUoIGVsZW1lbnQgKSxcblx0XHRcdFx0cmVzdWx0LCBtZXRob2QsIHJ1bGUsIG5vcm1hbGl6ZXI7XG5cblx0XHRcdC8vIFByaW9yaXRpemUgdGhlIGxvY2FsIG5vcm1hbGl6ZXIgZGVmaW5lZCBmb3IgdGhpcyBlbGVtZW50IG92ZXIgdGhlIGdsb2JhbCBvbmVcblx0XHRcdC8vIGlmIHRoZSBmb3JtZXIgZXhpc3RzLCBvdGhlcndpc2UgdXNlciB0aGUgZ2xvYmFsIG9uZSBpbiBjYXNlIGl0IGV4aXN0cy5cblx0XHRcdGlmICggdHlwZW9mIHJ1bGVzLm5vcm1hbGl6ZXIgPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdFx0bm9ybWFsaXplciA9IHJ1bGVzLm5vcm1hbGl6ZXI7XG5cdFx0XHR9IGVsc2UgaWYgKFx0dHlwZW9mIHRoaXMuc2V0dGluZ3Mubm9ybWFsaXplciA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0XHRub3JtYWxpemVyID0gdGhpcy5zZXR0aW5ncy5ub3JtYWxpemVyO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBub3JtYWxpemVyIGlzIGRlZmluZWQsIHRoZW4gY2FsbCBpdCB0byByZXRyZWl2ZSB0aGUgY2hhbmdlZCB2YWx1ZSBpbnN0ZWFkXG5cdFx0XHQvLyBvZiB1c2luZyB0aGUgcmVhbCBvbmUuXG5cdFx0XHQvLyBOb3RlIHRoYXQgYHRoaXNgIGluIHRoZSBub3JtYWxpemVyIGlzIGBlbGVtZW50YC5cblx0XHRcdGlmICggbm9ybWFsaXplciApIHtcblx0XHRcdFx0dmFsID0gbm9ybWFsaXplci5jYWxsKCBlbGVtZW50LCB2YWwgKTtcblxuXHRcdFx0XHRpZiAoIHR5cGVvZiB2YWwgIT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvciggXCJUaGUgbm9ybWFsaXplciBzaG91bGQgcmV0dXJuIGEgc3RyaW5nIHZhbHVlLlwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEZWxldGUgdGhlIG5vcm1hbGl6ZXIgZnJvbSBydWxlcyB0byBhdm9pZCB0cmVhdGluZyBpdCBhcyBhIHByZS1kZWZpbmVkIG1ldGhvZC5cblx0XHRcdFx0ZGVsZXRlIHJ1bGVzLm5vcm1hbGl6ZXI7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIG1ldGhvZCBpbiBydWxlcyApIHtcblx0XHRcdFx0cnVsZSA9IHsgbWV0aG9kOiBtZXRob2QsIHBhcmFtZXRlcnM6IHJ1bGVzWyBtZXRob2QgXSB9O1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJlc3VsdCA9ICQudmFsaWRhdG9yLm1ldGhvZHNbIG1ldGhvZCBdLmNhbGwoIHRoaXMsIHZhbCwgZWxlbWVudCwgcnVsZS5wYXJhbWV0ZXJzICk7XG5cblx0XHRcdFx0XHQvLyBJZiBhIG1ldGhvZCBpbmRpY2F0ZXMgdGhhdCB0aGUgZmllbGQgaXMgb3B0aW9uYWwgYW5kIHRoZXJlZm9yZSB2YWxpZCxcblx0XHRcdFx0XHQvLyBkb24ndCBtYXJrIGl0IGFzIHZhbGlkIHdoZW4gdGhlcmUgYXJlIG5vIG90aGVyIHJ1bGVzXG5cdFx0XHRcdFx0aWYgKCByZXN1bHQgPT09IFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiICYmIHJ1bGVzQ291bnQgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHRkZXBlbmRlbmN5TWlzbWF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRlcGVuZGVuY3lNaXNtYXRjaCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCByZXN1bHQgPT09IFwicGVuZGluZ1wiICkge1xuXHRcdFx0XHRcdFx0dGhpcy50b0hpZGUgPSB0aGlzLnRvSGlkZS5ub3QoIHRoaXMuZXJyb3JzRm9yKCBlbGVtZW50ICkgKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICFyZXN1bHQgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmZvcm1hdEFuZEFkZCggZWxlbWVudCwgcnVsZSApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coIFwiRXhjZXB0aW9uIG9jY3VycmVkIHdoZW4gY2hlY2tpbmcgZWxlbWVudCBcIiArIGVsZW1lbnQuaWQgKyBcIiwgY2hlY2sgdGhlICdcIiArIHJ1bGUubWV0aG9kICsgXCInIG1ldGhvZC5cIiwgZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IgKSB7XG5cdFx0XHRcdFx0XHRlLm1lc3NhZ2UgKz0gXCIuICBFeGNlcHRpb24gb2NjdXJyZWQgd2hlbiBjaGVja2luZyBlbGVtZW50IFwiICsgZWxlbWVudC5pZCArIFwiLCBjaGVjayB0aGUgJ1wiICsgcnVsZS5tZXRob2QgKyBcIicgbWV0aG9kLlwiO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRocm93IGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICggZGVwZW5kZW5jeU1pc21hdGNoICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHRoaXMub2JqZWN0TGVuZ3RoKCBydWxlcyApICkge1xuXHRcdFx0XHR0aGlzLnN1Y2Nlc3NMaXN0LnB1c2goIGVsZW1lbnQgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm4gdGhlIGN1c3RvbSBtZXNzYWdlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudCBhbmQgdmFsaWRhdGlvbiBtZXRob2Rcblx0XHQvLyBzcGVjaWZpZWQgaW4gdGhlIGVsZW1lbnQncyBIVE1MNSBkYXRhIGF0dHJpYnV0ZVxuXHRcdC8vIHJldHVybiB0aGUgZ2VuZXJpYyBtZXNzYWdlIGlmIHByZXNlbnQgYW5kIG5vIG1ldGhvZCBzcGVjaWZpYyBtZXNzYWdlIGlzIHByZXNlbnRcblx0XHRjdXN0b21EYXRhTWVzc2FnZTogZnVuY3Rpb24oIGVsZW1lbnQsIG1ldGhvZCApIHtcblx0XHRcdHJldHVybiAkKCBlbGVtZW50ICkuZGF0YSggXCJtc2dcIiArIG1ldGhvZC5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICtcblx0XHRcdFx0bWV0aG9kLnN1YnN0cmluZyggMSApLnRvTG93ZXJDYXNlKCkgKSB8fCAkKCBlbGVtZW50ICkuZGF0YSggXCJtc2dcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm4gdGhlIGN1c3RvbSBtZXNzYWdlIGZvciB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGFuZCB2YWxpZGF0aW9uIG1ldGhvZFxuXHRcdGN1c3RvbU1lc3NhZ2U6IGZ1bmN0aW9uKCBuYW1lLCBtZXRob2QgKSB7XG5cdFx0XHR2YXIgbSA9IHRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIG5hbWUgXTtcblx0XHRcdHJldHVybiBtICYmICggbS5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nID8gbSA6IG1bIG1ldGhvZCBdICk7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybiB0aGUgZmlyc3QgZGVmaW5lZCBhcmd1bWVudCwgYWxsb3dpbmcgZW1wdHkgc3RyaW5nc1xuXHRcdGZpbmREZWZpbmVkOiBmdW5jdGlvbigpIHtcblx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBhcmd1bWVudHNbIGkgXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdHJldHVybiBhcmd1bWVudHNbIGkgXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9LFxuXG5cdFx0Ly8gVGhlIHNlY29uZCBwYXJhbWV0ZXIgJ3J1bGUnIHVzZWQgdG8gYmUgYSBzdHJpbmcsIGFuZCBleHRlbmRlZCB0byBhbiBvYmplY3QgbGl0ZXJhbFxuXHRcdC8vIG9mIHRoZSBmb2xsb3dpbmcgZm9ybTpcblx0XHQvLyBydWxlID0ge1xuXHRcdC8vICAgICBtZXRob2Q6IFwibWV0aG9kIG5hbWVcIixcblx0XHQvLyAgICAgcGFyYW1ldGVyczogXCJ0aGUgZ2l2ZW4gbWV0aG9kIHBhcmFtZXRlcnNcIlxuXHRcdC8vIH1cblx0XHQvL1xuXHRcdC8vIFRoZSBvbGQgYmVoYXZpb3Igc3RpbGwgc3VwcG9ydGVkLCBrZXB0IHRvIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aFxuXHRcdC8vIG9sZCBjb2RlLCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UuXG5cdFx0ZGVmYXVsdE1lc3NhZ2U6IGZ1bmN0aW9uKCBlbGVtZW50LCBydWxlICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgcnVsZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0cnVsZSA9IHsgbWV0aG9kOiBydWxlIH07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBtZXNzYWdlID0gdGhpcy5maW5kRGVmaW5lZChcblx0XHRcdFx0XHR0aGlzLmN1c3RvbU1lc3NhZ2UoIGVsZW1lbnQubmFtZSwgcnVsZS5tZXRob2QgKSxcblx0XHRcdFx0XHR0aGlzLmN1c3RvbURhdGFNZXNzYWdlKCBlbGVtZW50LCBydWxlLm1ldGhvZCApLFxuXG5cdFx0XHRcdFx0Ly8gJ3RpdGxlJyBpcyBuZXZlciB1bmRlZmluZWQsIHNvIGhhbmRsZSBlbXB0eSBzdHJpbmcgYXMgdW5kZWZpbmVkXG5cdFx0XHRcdFx0IXRoaXMuc2V0dGluZ3MuaWdub3JlVGl0bGUgJiYgZWxlbWVudC50aXRsZSB8fCB1bmRlZmluZWQsXG5cdFx0XHRcdFx0JC52YWxpZGF0b3IubWVzc2FnZXNbIHJ1bGUubWV0aG9kIF0sXG5cdFx0XHRcdFx0XCI8c3Ryb25nPldhcm5pbmc6IE5vIG1lc3NhZ2UgZGVmaW5lZCBmb3IgXCIgKyBlbGVtZW50Lm5hbWUgKyBcIjwvc3Ryb25nPlwiXG5cdFx0XHRcdCksXG5cdFx0XHRcdHRoZXJlZ2V4ID0gL1xcJD9cXHsoXFxkKylcXH0vZztcblx0XHRcdGlmICggdHlwZW9mIG1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIiApIHtcblx0XHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2UuY2FsbCggdGhpcywgcnVsZS5wYXJhbWV0ZXJzLCBlbGVtZW50ICk7XG5cdFx0XHR9IGVsc2UgaWYgKCB0aGVyZWdleC50ZXN0KCBtZXNzYWdlICkgKSB7XG5cdFx0XHRcdG1lc3NhZ2UgPSAkLnZhbGlkYXRvci5mb3JtYXQoIG1lc3NhZ2UucmVwbGFjZSggdGhlcmVnZXgsIFwieyQxfVwiICksIHJ1bGUucGFyYW1ldGVycyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHR9LFxuXG5cdFx0Zm9ybWF0QW5kQWRkOiBmdW5jdGlvbiggZWxlbWVudCwgcnVsZSApIHtcblx0XHRcdHZhciBtZXNzYWdlID0gdGhpcy5kZWZhdWx0TWVzc2FnZSggZWxlbWVudCwgcnVsZSApO1xuXG5cdFx0XHR0aGlzLmVycm9yTGlzdC5wdXNoKCB7XG5cdFx0XHRcdG1lc3NhZ2U6IG1lc3NhZ2UsXG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXG5cdFx0XHRcdG1ldGhvZDogcnVsZS5tZXRob2Rcblx0XHRcdH0gKTtcblxuXHRcdFx0dGhpcy5lcnJvck1hcFsgZWxlbWVudC5uYW1lIF0gPSBtZXNzYWdlO1xuXHRcdFx0dGhpcy5zdWJtaXR0ZWRbIGVsZW1lbnQubmFtZSBdID0gbWVzc2FnZTtcblx0XHR9LFxuXG5cdFx0YWRkV3JhcHBlcjogZnVuY3Rpb24oIHRvVG9nZ2xlICkge1xuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLndyYXBwZXIgKSB7XG5cdFx0XHRcdHRvVG9nZ2xlID0gdG9Ub2dnbGUuYWRkKCB0b1RvZ2dsZS5wYXJlbnQoIHRoaXMuc2V0dGluZ3Mud3JhcHBlciApICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG9Ub2dnbGU7XG5cdFx0fSxcblxuXHRcdGRlZmF1bHRTaG93RXJyb3JzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpLCBlbGVtZW50cywgZXJyb3I7XG5cdFx0XHRmb3IgKCBpID0gMDsgdGhpcy5lcnJvckxpc3RbIGkgXTsgaSsrICkge1xuXHRcdFx0XHRlcnJvciA9IHRoaXMuZXJyb3JMaXN0WyBpIF07XG5cdFx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5oaWdobGlnaHQgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5oaWdobGlnaHQuY2FsbCggdGhpcywgZXJyb3IuZWxlbWVudCwgdGhpcy5zZXR0aW5ncy5lcnJvckNsYXNzLCB0aGlzLnNldHRpbmdzLnZhbGlkQ2xhc3MgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNob3dMYWJlbCggZXJyb3IuZWxlbWVudCwgZXJyb3IubWVzc2FnZSApO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB0aGlzLmVycm9yTGlzdC5sZW5ndGggKSB7XG5cdFx0XHRcdHRoaXMudG9TaG93ID0gdGhpcy50b1Nob3cuYWRkKCB0aGlzLmNvbnRhaW5lcnMgKTtcblx0XHRcdH1cblx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy5zdWNjZXNzICkge1xuXHRcdFx0XHRmb3IgKCBpID0gMDsgdGhpcy5zdWNjZXNzTGlzdFsgaSBdOyBpKysgKSB7XG5cdFx0XHRcdFx0dGhpcy5zaG93TGFiZWwoIHRoaXMuc3VjY2Vzc0xpc3RbIGkgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHRoaXMuc2V0dGluZ3MudW5oaWdobGlnaHQgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSAwLCBlbGVtZW50cyA9IHRoaXMudmFsaWRFbGVtZW50cygpOyBlbGVtZW50c1sgaSBdOyBpKysgKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy51bmhpZ2hsaWdodC5jYWxsKCB0aGlzLCBlbGVtZW50c1sgaSBdLCB0aGlzLnNldHRpbmdzLmVycm9yQ2xhc3MsIHRoaXMuc2V0dGluZ3MudmFsaWRDbGFzcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnRvSGlkZSA9IHRoaXMudG9IaWRlLm5vdCggdGhpcy50b1Nob3cgKTtcblx0XHRcdHRoaXMuaGlkZUVycm9ycygpO1xuXHRcdFx0dGhpcy5hZGRXcmFwcGVyKCB0aGlzLnRvU2hvdyApLnNob3coKTtcblx0XHR9LFxuXG5cdFx0dmFsaWRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jdXJyZW50RWxlbWVudHMubm90KCB0aGlzLmludmFsaWRFbGVtZW50cygpICk7XG5cdFx0fSxcblxuXHRcdGludmFsaWRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gJCggdGhpcy5lcnJvckxpc3QgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50O1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRzaG93TGFiZWw6IGZ1bmN0aW9uKCBlbGVtZW50LCBtZXNzYWdlICkge1xuXHRcdFx0dmFyIHBsYWNlLCBncm91cCwgZXJyb3JJRCwgdixcblx0XHRcdFx0ZXJyb3IgPSB0aGlzLmVycm9yc0ZvciggZWxlbWVudCApLFxuXHRcdFx0XHRlbGVtZW50SUQgPSB0aGlzLmlkT3JOYW1lKCBlbGVtZW50ICksXG5cdFx0XHRcdGRlc2NyaWJlZEJ5ID0gJCggZWxlbWVudCApLmF0dHIoIFwiYXJpYS1kZXNjcmliZWRieVwiICk7XG5cblx0XHRcdGlmICggZXJyb3IubGVuZ3RoICkge1xuXG5cdFx0XHRcdC8vIFJlZnJlc2ggZXJyb3Ivc3VjY2VzcyBjbGFzc1xuXHRcdFx0XHRlcnJvci5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy52YWxpZENsYXNzICkuYWRkQ2xhc3MoIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcyApO1xuXG5cdFx0XHRcdC8vIFJlcGxhY2UgbWVzc2FnZSBvbiBleGlzdGluZyBsYWJlbFxuXHRcdFx0XHRlcnJvci5odG1sKCBtZXNzYWdlICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIENyZWF0ZSBlcnJvciBlbGVtZW50XG5cdFx0XHRcdGVycm9yID0gJCggXCI8XCIgKyB0aGlzLnNldHRpbmdzLmVycm9yRWxlbWVudCArIFwiPlwiIClcblx0XHRcdFx0XHQuYXR0ciggXCJpZFwiLCBlbGVtZW50SUQgKyBcIi1lcnJvclwiIClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIHRoaXMuc2V0dGluZ3MuZXJyb3JDbGFzcyApXG5cdFx0XHRcdFx0Lmh0bWwoIG1lc3NhZ2UgfHwgXCJcIiApO1xuXG5cdFx0XHRcdC8vIE1haW50YWluIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0byBiZSBwbGFjZWQgaW50byB0aGUgRE9NXG5cdFx0XHRcdHBsYWNlID0gZXJyb3I7XG5cdFx0XHRcdGlmICggdGhpcy5zZXR0aW5ncy53cmFwcGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoZSBlbGVtZW50IGlzIHZpc2libGUsIGV2ZW4gaW4gSUVcblx0XHRcdFx0XHQvLyBhY3R1YWxseSBzaG93aW5nIHRoZSB3cmFwcGVkIGVsZW1lbnQgaXMgaGFuZGxlZCBlbHNld2hlcmVcblx0XHRcdFx0XHRwbGFjZSA9IGVycm9yLmhpZGUoKS5zaG93KCkud3JhcCggXCI8XCIgKyB0aGlzLnNldHRpbmdzLndyYXBwZXIgKyBcIi8+XCIgKS5wYXJlbnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIHRoaXMubGFiZWxDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdHRoaXMubGFiZWxDb250YWluZXIuYXBwZW5kKCBwbGFjZSApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCB0aGlzLnNldHRpbmdzLmVycm9yUGxhY2VtZW50ICkge1xuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MuZXJyb3JQbGFjZW1lbnQuY2FsbCggdGhpcywgcGxhY2UsICQoIGVsZW1lbnQgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBsYWNlLmluc2VydEFmdGVyKCBlbGVtZW50ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBMaW5rIGVycm9yIGJhY2sgdG8gdGhlIGVsZW1lbnRcblx0XHRcdFx0aWYgKCBlcnJvci5pcyggXCJsYWJlbFwiICkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiB0aGUgZXJyb3IgaXMgYSBsYWJlbCwgdGhlbiBhc3NvY2lhdGUgdXNpbmcgJ2Zvcidcblx0XHRcdFx0XHRlcnJvci5hdHRyKCBcImZvclwiLCBlbGVtZW50SUQgKTtcblxuXHRcdFx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBhIGNoaWxkIG9mIGFuIGFzc29jaWF0ZWQgbGFiZWwsIHRoZW4gaXQncyBuZWNlc3Nhcnlcblx0XHRcdFx0XHQvLyB0byBleHBsaWNpdGx5IGFwcGx5IGFyaWEtZGVzY3JpYmVkYnlcblx0XHRcdFx0fSBlbHNlIGlmICggZXJyb3IucGFyZW50cyggXCJsYWJlbFtmb3I9J1wiICsgdGhpcy5lc2NhcGVDc3NNZXRhKCBlbGVtZW50SUQgKSArIFwiJ11cIiApLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRlcnJvcklEID0gZXJyb3IuYXR0ciggXCJpZFwiICk7XG5cblx0XHRcdFx0XHQvLyBSZXNwZWN0IGV4aXN0aW5nIG5vbi1lcnJvciBhcmlhLWRlc2NyaWJlZGJ5XG5cdFx0XHRcdFx0aWYgKCAhZGVzY3JpYmVkQnkgKSB7XG5cdFx0XHRcdFx0XHRkZXNjcmliZWRCeSA9IGVycm9ySUQ7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggIWRlc2NyaWJlZEJ5Lm1hdGNoKCBuZXcgUmVnRXhwKCBcIlxcXFxiXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIGVycm9ySUQgKSArIFwiXFxcXGJcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIEFkZCB0byBlbmQgb2YgbGlzdCBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG5cdFx0XHRcdFx0XHRkZXNjcmliZWRCeSArPSBcIiBcIiArIGVycm9ySUQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQoIGVsZW1lbnQgKS5hdHRyKCBcImFyaWEtZGVzY3JpYmVkYnlcIiwgZGVzY3JpYmVkQnkgKTtcblxuXHRcdFx0XHRcdC8vIElmIHRoaXMgZWxlbWVudCBpcyBncm91cGVkLCB0aGVuIGFzc2lnbiB0byBhbGwgZWxlbWVudHMgaW4gdGhlIHNhbWUgZ3JvdXBcblx0XHRcdFx0XHRncm91cCA9IHRoaXMuZ3JvdXBzWyBlbGVtZW50Lm5hbWUgXTtcblx0XHRcdFx0XHRpZiAoIGdyb3VwICkge1xuXHRcdFx0XHRcdFx0diA9IHRoaXM7XG5cdFx0XHRcdFx0XHQkLmVhY2goIHYuZ3JvdXBzLCBmdW5jdGlvbiggbmFtZSwgdGVzdGdyb3VwICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHRlc3Rncm91cCA9PT0gZ3JvdXAgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggXCJbbmFtZT0nXCIgKyB2LmVzY2FwZUNzc01ldGEoIG5hbWUgKSArIFwiJ11cIiwgdi5jdXJyZW50Rm9ybSApXG5cdFx0XHRcdFx0XHRcdFx0XHQuYXR0ciggXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIGVycm9yLmF0dHIoIFwiaWRcIiApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICggIW1lc3NhZ2UgJiYgdGhpcy5zZXR0aW5ncy5zdWNjZXNzICkge1xuXHRcdFx0XHRlcnJvci50ZXh0KCBcIlwiICk7XG5cdFx0XHRcdGlmICggdHlwZW9mIHRoaXMuc2V0dGluZ3Muc3VjY2VzcyA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRlcnJvci5hZGRDbGFzcyggdGhpcy5zZXR0aW5ncy5zdWNjZXNzICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncy5zdWNjZXNzKCBlcnJvciwgZWxlbWVudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnRvU2hvdyA9IHRoaXMudG9TaG93LmFkZCggZXJyb3IgKTtcblx0XHR9LFxuXG5cdFx0ZXJyb3JzRm9yOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdHZhciBuYW1lID0gdGhpcy5lc2NhcGVDc3NNZXRhKCB0aGlzLmlkT3JOYW1lKCBlbGVtZW50ICkgKSxcblx0XHRcdFx0ZGVzY3JpYmVyID0gJCggZWxlbWVudCApLmF0dHIoIFwiYXJpYS1kZXNjcmliZWRieVwiICksXG5cdFx0XHRcdHNlbGVjdG9yID0gXCJsYWJlbFtmb3I9J1wiICsgbmFtZSArIFwiJ10sIGxhYmVsW2Zvcj0nXCIgKyBuYW1lICsgXCInXSAqXCI7XG5cblx0XHRcdC8vICdhcmlhLWRlc2NyaWJlZGJ5JyBzaG91bGQgZGlyZWN0bHkgcmVmZXJlbmNlIHRoZSBlcnJvciBlbGVtZW50XG5cdFx0XHRpZiAoIGRlc2NyaWJlciApIHtcblx0XHRcdFx0c2VsZWN0b3IgPSBzZWxlY3RvciArIFwiLCAjXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIGRlc2NyaWJlciApXG5cdFx0XHRcdFx0LnJlcGxhY2UoIC9cXHMrL2csIFwiLCAjXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHRcdFx0LmVycm9ycygpXG5cdFx0XHRcdC5maWx0ZXIoIHNlbGVjdG9yICk7XG5cdFx0fSxcblxuXHRcdC8vIFNlZSBodHRwczovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L3NlbGVjdG9ycy8sIGZvciBDU1Ncblx0XHQvLyBtZXRhLWNoYXJhY3RlcnMgdGhhdCBzaG91bGQgYmUgZXNjYXBlZCBpbiBvcmRlciB0byBiZSB1c2VkIHdpdGggSlF1ZXJ5XG5cdFx0Ly8gYXMgYSBsaXRlcmFsIHBhcnQgb2YgYSBuYW1lL2lkIG9yIGFueSBzZWxlY3Rvci5cblx0XHRlc2NhcGVDc3NNZXRhOiBmdW5jdGlvbiggc3RyaW5nICkge1xuXHRcdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKCAvKFtcXFxcIVwiIyQlJicoKSorLC4vOjs8PT4/QFxcW1xcXV5ge3x9fl0pL2csIFwiXFxcXCQxXCIgKTtcblx0XHR9LFxuXG5cdFx0aWRPck5hbWU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ3JvdXBzWyBlbGVtZW50Lm5hbWUgXSB8fCAoIHRoaXMuY2hlY2thYmxlKCBlbGVtZW50ICkgPyBlbGVtZW50Lm5hbWUgOiBlbGVtZW50LmlkIHx8IGVsZW1lbnQubmFtZSApO1xuXHRcdH0sXG5cblx0XHR2YWxpZGF0aW9uVGFyZ2V0Rm9yOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblxuXHRcdFx0Ly8gSWYgcmFkaW8vY2hlY2tib3gsIHZhbGlkYXRlIGZpcnN0IGVsZW1lbnQgaW4gZ3JvdXAgaW5zdGVhZFxuXHRcdFx0aWYgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApICkge1xuXHRcdFx0XHRlbGVtZW50ID0gdGhpcy5maW5kQnlOYW1lKCBlbGVtZW50Lm5hbWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWx3YXlzIGFwcGx5IGlnbm9yZSBmaWx0ZXJcblx0XHRcdHJldHVybiAkKCBlbGVtZW50ICkubm90KCB0aGlzLnNldHRpbmdzLmlnbm9yZSApWyAwIF07XG5cdFx0fSxcblxuXHRcdGNoZWNrYWJsZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gKCAvcmFkaW98Y2hlY2tib3gvaSApLnRlc3QoIGVsZW1lbnQudHlwZSApO1xuXHRcdH0sXG5cblx0XHRmaW5kQnlOYW1lOiBmdW5jdGlvbiggbmFtZSApIHtcblx0XHRcdHJldHVybiAkKCB0aGlzLmN1cnJlbnRGb3JtICkuZmluZCggXCJbbmFtZT0nXCIgKyB0aGlzLmVzY2FwZUNzc01ldGEoIG5hbWUgKSArIFwiJ11cIiApO1xuXHRcdH0sXG5cblx0XHRnZXRMZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCApIHtcblx0XHRcdHN3aXRjaCAoIGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdGNhc2UgXCJzZWxlY3RcIjpcblx0XHRcdFx0cmV0dXJuICQoIFwib3B0aW9uOnNlbGVjdGVkXCIsIGVsZW1lbnQgKS5sZW5ndGg7XG5cdFx0XHRjYXNlIFwiaW5wdXRcIjpcblx0XHRcdFx0aWYgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApICkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZpbmRCeU5hbWUoIGVsZW1lbnQubmFtZSApLmZpbHRlciggXCI6Y2hlY2tlZFwiICkubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoO1xuXHRcdH0sXG5cblx0XHRkZXBlbmQ6IGZ1bmN0aW9uKCBwYXJhbSwgZWxlbWVudCApIHtcblx0XHRcdHJldHVybiB0aGlzLmRlcGVuZFR5cGVzWyB0eXBlb2YgcGFyYW0gXSA/IHRoaXMuZGVwZW5kVHlwZXNbIHR5cGVvZiBwYXJhbSBdKCBwYXJhbSwgZWxlbWVudCApIDogdHJ1ZTtcblx0XHR9LFxuXG5cdFx0ZGVwZW5kVHlwZXM6IHtcblx0XHRcdFwiYm9vbGVhblwiOiBmdW5jdGlvbiggcGFyYW0gKSB7XG5cdFx0XHRcdHJldHVybiBwYXJhbTtcblx0XHRcdH0sXG5cdFx0XHRcInN0cmluZ1wiOiBmdW5jdGlvbiggcGFyYW0sIGVsZW1lbnQgKSB7XG5cdFx0XHRcdHJldHVybiAhISQoIHBhcmFtLCBlbGVtZW50LmZvcm0gKS5sZW5ndGg7XG5cdFx0XHR9LFxuXHRcdFx0XCJmdW5jdGlvblwiOiBmdW5jdGlvbiggcGFyYW0sIGVsZW1lbnQgKSB7XG5cdFx0XHRcdHJldHVybiBwYXJhbSggZWxlbWVudCApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRvcHRpb25hbDogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgdmFsID0gdGhpcy5lbGVtZW50VmFsdWUoIGVsZW1lbnQgKTtcblx0XHRcdHJldHVybiAhJC52YWxpZGF0b3IubWV0aG9kcy5yZXF1aXJlZC5jYWxsKCB0aGlzLCB2YWwsIGVsZW1lbnQgKSAmJiBcImRlcGVuZGVuY3ktbWlzbWF0Y2hcIjtcblx0XHR9LFxuXG5cdFx0c3RhcnRSZXF1ZXN0OiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdGlmICggIXRoaXMucGVuZGluZ1sgZWxlbWVudC5uYW1lIF0gKSB7XG5cdFx0XHRcdHRoaXMucGVuZGluZ1JlcXVlc3QrKztcblx0XHRcdFx0JCggZWxlbWVudCApLmFkZENsYXNzKCB0aGlzLnNldHRpbmdzLnBlbmRpbmdDbGFzcyApO1xuXHRcdFx0XHR0aGlzLnBlbmRpbmdbIGVsZW1lbnQubmFtZSBdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c3RvcFJlcXVlc3Q6IGZ1bmN0aW9uKCBlbGVtZW50LCB2YWxpZCApIHtcblx0XHRcdHRoaXMucGVuZGluZ1JlcXVlc3QtLTtcblxuXHRcdFx0Ly8gU29tZXRpbWVzIHN5bmNocm9uaXphdGlvbiBmYWlscywgbWFrZSBzdXJlIHBlbmRpbmdSZXF1ZXN0IGlzIG5ldmVyIDwgMFxuXHRcdFx0aWYgKCB0aGlzLnBlbmRpbmdSZXF1ZXN0IDwgMCApIHtcblx0XHRcdFx0dGhpcy5wZW5kaW5nUmVxdWVzdCA9IDA7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgdGhpcy5wZW5kaW5nWyBlbGVtZW50Lm5hbWUgXTtcblx0XHRcdCQoIGVsZW1lbnQgKS5yZW1vdmVDbGFzcyggdGhpcy5zZXR0aW5ncy5wZW5kaW5nQ2xhc3MgKTtcblx0XHRcdGlmICggdmFsaWQgJiYgdGhpcy5wZW5kaW5nUmVxdWVzdCA9PT0gMCAmJiB0aGlzLmZvcm1TdWJtaXR0ZWQgJiYgdGhpcy5mb3JtKCkgKSB7XG5cdFx0XHRcdCQoIHRoaXMuY3VycmVudEZvcm0gKS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIGhpZGRlbiBpbnB1dCB0aGF0IHdhcyB1c2VkIGFzIGEgcmVwbGFjZW1lbnQgZm9yIHRoZVxuXHRcdFx0XHQvLyBtaXNzaW5nIHN1Ym1pdCBidXR0b24uIFRoZSBoaWRkZW4gaW5wdXQgaXMgYWRkZWQgYnkgYGhhbmRsZSgpYFxuXHRcdFx0XHQvLyB0byBlbnN1cmUgdGhhdCB0aGUgdmFsdWUgb2YgdGhlIHVzZWQgc3VibWl0IGJ1dHRvbiBpcyBwYXNzZWQgb25cblx0XHRcdFx0Ly8gZm9yIHNjcmlwdGVkIHN1Ym1pdHMgdHJpZ2dlcmVkIGJ5IHRoaXMgbWV0aG9kXG5cdFx0XHRcdGlmICggdGhpcy5zdWJtaXRCdXR0b24gKSB7XG5cdFx0XHRcdFx0JCggXCJpbnB1dDpoaWRkZW5bbmFtZT0nXCIgKyB0aGlzLnN1Ym1pdEJ1dHRvbi5uYW1lICsgXCInXVwiLCB0aGlzLmN1cnJlbnRGb3JtICkucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSBpZiAoICF2YWxpZCAmJiB0aGlzLnBlbmRpbmdSZXF1ZXN0ID09PSAwICYmIHRoaXMuZm9ybVN1Ym1pdHRlZCApIHtcblx0XHRcdFx0JCggdGhpcy5jdXJyZW50Rm9ybSApLnRyaWdnZXJIYW5kbGVyKCBcImludmFsaWQtZm9ybVwiLCBbIHRoaXMgXSApO1xuXHRcdFx0XHR0aGlzLmZvcm1TdWJtaXR0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0cHJldmlvdXNWYWx1ZTogZnVuY3Rpb24oIGVsZW1lbnQsIG1ldGhvZCApIHtcblx0XHRcdG1ldGhvZCA9IHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIgJiYgbWV0aG9kIHx8IFwicmVtb3RlXCI7XG5cblx0XHRcdHJldHVybiAkLmRhdGEoIGVsZW1lbnQsIFwicHJldmlvdXNWYWx1ZVwiICkgfHwgJC5kYXRhKCBlbGVtZW50LCBcInByZXZpb3VzVmFsdWVcIiwge1xuXHRcdFx0XHRvbGQ6IG51bGwsXG5cdFx0XHRcdHZhbGlkOiB0cnVlLFxuXHRcdFx0XHRtZXNzYWdlOiB0aGlzLmRlZmF1bHRNZXNzYWdlKCBlbGVtZW50LCB7IG1ldGhvZDogbWV0aG9kIH0gKVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHQvLyBDbGVhbnMgdXAgYWxsIGZvcm1zIGFuZCBlbGVtZW50cywgcmVtb3ZlcyB2YWxpZGF0b3Itc3BlY2lmaWMgZXZlbnRzXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnJlc2V0Rm9ybSgpO1xuXG5cdFx0XHQkKCB0aGlzLmN1cnJlbnRGb3JtIClcblx0XHRcdFx0Lm9mZiggXCIudmFsaWRhdGVcIiApXG5cdFx0XHRcdC5yZW1vdmVEYXRhKCBcInZhbGlkYXRvclwiIClcblx0XHRcdFx0LmZpbmQoIFwiLnZhbGlkYXRlLWVxdWFsVG8tYmx1clwiIClcblx0XHRcdFx0XHQub2ZmKCBcIi52YWxpZGF0ZS1lcXVhbFRvXCIgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggXCJ2YWxpZGF0ZS1lcXVhbFRvLWJsdXJcIiApO1xuXHRcdH1cblxuXHR9LFxuXG5cdGNsYXNzUnVsZVNldHRpbmdzOiB7XG5cdFx0cmVxdWlyZWQ6IHsgcmVxdWlyZWQ6IHRydWUgfSxcblx0XHRlbWFpbDogeyBlbWFpbDogdHJ1ZSB9LFxuXHRcdHVybDogeyB1cmw6IHRydWUgfSxcblx0XHRkYXRlOiB7IGRhdGU6IHRydWUgfSxcblx0XHRkYXRlSVNPOiB7IGRhdGVJU086IHRydWUgfSxcblx0XHRudW1iZXI6IHsgbnVtYmVyOiB0cnVlIH0sXG5cdFx0ZGlnaXRzOiB7IGRpZ2l0czogdHJ1ZSB9LFxuXHRcdGNyZWRpdGNhcmQ6IHsgY3JlZGl0Y2FyZDogdHJ1ZSB9XG5cdH0sXG5cblx0YWRkQ2xhc3NSdWxlczogZnVuY3Rpb24oIGNsYXNzTmFtZSwgcnVsZXMgKSB7XG5cdFx0aWYgKCBjbGFzc05hbWUuY29uc3RydWN0b3IgPT09IFN0cmluZyApIHtcblx0XHRcdHRoaXMuY2xhc3NSdWxlU2V0dGluZ3NbIGNsYXNzTmFtZSBdID0gcnVsZXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQuZXh0ZW5kKCB0aGlzLmNsYXNzUnVsZVNldHRpbmdzLCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH0sXG5cblx0Y2xhc3NSdWxlczogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0dmFyIHJ1bGVzID0ge30sXG5cdFx0XHRjbGFzc2VzID0gJCggZWxlbWVudCApLmF0dHIoIFwiY2xhc3NcIiApO1xuXG5cdFx0aWYgKCBjbGFzc2VzICkge1xuXHRcdFx0JC5lYWNoKCBjbGFzc2VzLnNwbGl0KCBcIiBcIiApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCB0aGlzIGluICQudmFsaWRhdG9yLmNsYXNzUnVsZVNldHRpbmdzICkge1xuXHRcdFx0XHRcdCQuZXh0ZW5kKCBydWxlcywgJC52YWxpZGF0b3IuY2xhc3NSdWxlU2V0dGluZ3NbIHRoaXMgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdHJldHVybiBydWxlcztcblx0fSxcblxuXHRub3JtYWxpemVBdHRyaWJ1dGVSdWxlOiBmdW5jdGlvbiggcnVsZXMsIHR5cGUsIG1ldGhvZCwgdmFsdWUgKSB7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSB2YWx1ZSB0byBhIG51bWJlciBmb3IgbnVtYmVyIGlucHV0cywgYW5kIGZvciB0ZXh0IGZvciBiYWNrd2FyZHMgY29tcGFiaWxpdHlcblx0XHQvLyBhbGxvd3MgdHlwZT1cImRhdGVcIiBhbmQgb3RoZXJzIHRvIGJlIGNvbXBhcmVkIGFzIHN0cmluZ3Ncblx0XHRpZiAoIC9taW58bWF4fHN0ZXAvLnRlc3QoIG1ldGhvZCApICYmICggdHlwZSA9PT0gbnVsbCB8fCAvbnVtYmVyfHJhbmdlfHRleHQvLnRlc3QoIHR5cGUgKSApICkge1xuXHRcdFx0dmFsdWUgPSBOdW1iZXIoIHZhbHVlICk7XG5cblx0XHRcdC8vIFN1cHBvcnQgT3BlcmEgTWluaSwgd2hpY2ggcmV0dXJucyBOYU4gZm9yIHVuZGVmaW5lZCBtaW5sZW5ndGhcblx0XHRcdGlmICggaXNOYU4oIHZhbHVlICkgKSB7XG5cdFx0XHRcdHZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggdmFsdWUgfHwgdmFsdWUgPT09IDAgKSB7XG5cdFx0XHRydWxlc1sgbWV0aG9kIF0gPSB2YWx1ZTtcblx0XHR9IGVsc2UgaWYgKCB0eXBlID09PSBtZXRob2QgJiYgdHlwZSAhPT0gXCJyYW5nZVwiICkge1xuXG5cdFx0XHQvLyBFeGNlcHRpb246IHRoZSBqcXVlcnkgdmFsaWRhdGUgJ3JhbmdlJyBtZXRob2Rcblx0XHRcdC8vIGRvZXMgbm90IHRlc3QgZm9yIHRoZSBodG1sNSAncmFuZ2UnIHR5cGVcblx0XHRcdHJ1bGVzWyBtZXRob2QgXSA9IHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdGF0dHJpYnV0ZVJ1bGVzOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHR2YXIgcnVsZXMgPSB7fSxcblx0XHRcdCRlbGVtZW50ID0gJCggZWxlbWVudCApLFxuXHRcdFx0dHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApLFxuXHRcdFx0bWV0aG9kLCB2YWx1ZTtcblxuXHRcdGZvciAoIG1ldGhvZCBpbiAkLnZhbGlkYXRvci5tZXRob2RzICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0IGZvciA8aW5wdXQgcmVxdWlyZWQ+IGluIGJvdGggaHRtbDUgYW5kIG9sZGVyIGJyb3dzZXJzXG5cdFx0XHRpZiAoIG1ldGhvZCA9PT0gXCJyZXF1aXJlZFwiICkge1xuXHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBtZXRob2QgKTtcblxuXHRcdFx0XHQvLyBTb21lIGJyb3dzZXJzIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgZm9yIHRoZSByZXF1aXJlZCBhdHRyaWJ1dGVcblx0XHRcdFx0Ly8gYW5kIG5vbi1IVE1MNSBicm93c2VycyBtaWdodCBoYXZlIHJlcXVpcmVkPVwiXCIgbWFya3VwXG5cdFx0XHRcdGlmICggdmFsdWUgPT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRm9yY2Ugbm9uLUhUTUw1IGJyb3dzZXJzIHRvIHJldHVybiBib29sXG5cdFx0XHRcdHZhbHVlID0gISF2YWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhbHVlID0gJGVsZW1lbnQuYXR0ciggbWV0aG9kICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubm9ybWFsaXplQXR0cmlidXRlUnVsZSggcnVsZXMsIHR5cGUsIG1ldGhvZCwgdmFsdWUgKTtcblx0XHR9XG5cblx0XHQvLyAnbWF4bGVuZ3RoJyBtYXkgYmUgcmV0dXJuZWQgYXMgLTEsIDIxNDc0ODM2NDcgKCBJRSApIGFuZCA1MjQyODggKCBzYWZhcmkgKSBmb3IgdGV4dCBpbnB1dHNcblx0XHRpZiAoIHJ1bGVzLm1heGxlbmd0aCAmJiAvLTF8MjE0NzQ4MzY0N3w1MjQyODgvLnRlc3QoIHJ1bGVzLm1heGxlbmd0aCApICkge1xuXHRcdFx0ZGVsZXRlIHJ1bGVzLm1heGxlbmd0aDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcnVsZXM7XG5cdH0sXG5cblx0ZGF0YVJ1bGVzOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHR2YXIgcnVsZXMgPSB7fSxcblx0XHRcdCRlbGVtZW50ID0gJCggZWxlbWVudCApLFxuXHRcdFx0dHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApLFxuXHRcdFx0bWV0aG9kLCB2YWx1ZTtcblxuXHRcdGZvciAoIG1ldGhvZCBpbiAkLnZhbGlkYXRvci5tZXRob2RzICkge1xuXHRcdFx0dmFsdWUgPSAkZWxlbWVudC5kYXRhKCBcInJ1bGVcIiArIG1ldGhvZC5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgbWV0aG9kLnN1YnN0cmluZyggMSApLnRvTG93ZXJDYXNlKCkgKTtcblx0XHRcdHRoaXMubm9ybWFsaXplQXR0cmlidXRlUnVsZSggcnVsZXMsIHR5cGUsIG1ldGhvZCwgdmFsdWUgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJ1bGVzO1xuXHR9LFxuXG5cdHN0YXRpY1J1bGVzOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHR2YXIgcnVsZXMgPSB7fSxcblx0XHRcdHZhbGlkYXRvciA9ICQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICk7XG5cblx0XHRpZiAoIHZhbGlkYXRvci5zZXR0aW5ncy5ydWxlcyApIHtcblx0XHRcdHJ1bGVzID0gJC52YWxpZGF0b3Iubm9ybWFsaXplUnVsZSggdmFsaWRhdG9yLnNldHRpbmdzLnJ1bGVzWyBlbGVtZW50Lm5hbWUgXSApIHx8IHt9O1xuXHRcdH1cblx0XHRyZXR1cm4gcnVsZXM7XG5cdH0sXG5cblx0bm9ybWFsaXplUnVsZXM6IGZ1bmN0aW9uKCBydWxlcywgZWxlbWVudCApIHtcblxuXHRcdC8vIEhhbmRsZSBkZXBlbmRlbmN5IGNoZWNrXG5cdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIHByb3AsIHZhbCApIHtcblxuXHRcdFx0Ly8gSWdub3JlIHJ1bGUgd2hlbiBwYXJhbSBpcyBleHBsaWNpdGx5IGZhbHNlLCBlZy4gcmVxdWlyZWQ6ZmFsc2Vcblx0XHRcdGlmICggdmFsID09PSBmYWxzZSApIHtcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzWyBwcm9wIF07XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICggdmFsLnBhcmFtIHx8IHZhbC5kZXBlbmRzICkge1xuXHRcdFx0XHR2YXIga2VlcFJ1bGUgPSB0cnVlO1xuXHRcdFx0XHRzd2l0Y2ggKCB0eXBlb2YgdmFsLmRlcGVuZHMgKSB7XG5cdFx0XHRcdGNhc2UgXCJzdHJpbmdcIjpcblx0XHRcdFx0XHRrZWVwUnVsZSA9ICEhJCggdmFsLmRlcGVuZHMsIGVsZW1lbnQuZm9ybSApLmxlbmd0aDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImZ1bmN0aW9uXCI6XG5cdFx0XHRcdFx0a2VlcFJ1bGUgPSB2YWwuZGVwZW5kcy5jYWxsKCBlbGVtZW50LCBlbGVtZW50ICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBrZWVwUnVsZSApIHtcblx0XHRcdFx0XHRydWxlc1sgcHJvcCBdID0gdmFsLnBhcmFtICE9PSB1bmRlZmluZWQgPyB2YWwucGFyYW0gOiB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQuZGF0YSggZWxlbWVudC5mb3JtLCBcInZhbGlkYXRvclwiICkucmVzZXRFbGVtZW50cyggJCggZWxlbWVudCApICk7XG5cdFx0XHRcdFx0ZGVsZXRlIHJ1bGVzWyBwcm9wIF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFdmFsdWF0ZSBwYXJhbWV0ZXJzXG5cdFx0JC5lYWNoKCBydWxlcywgZnVuY3Rpb24oIHJ1bGUsIHBhcmFtZXRlciApIHtcblx0XHRcdHJ1bGVzWyBydWxlIF0gPSAkLmlzRnVuY3Rpb24oIHBhcmFtZXRlciApICYmIHJ1bGUgIT09IFwibm9ybWFsaXplclwiID8gcGFyYW1ldGVyKCBlbGVtZW50ICkgOiBwYXJhbWV0ZXI7XG5cdFx0fSApO1xuXG5cdFx0Ly8gQ2xlYW4gbnVtYmVyIHBhcmFtZXRlcnNcblx0XHQkLmVhY2goIFsgXCJtaW5sZW5ndGhcIiwgXCJtYXhsZW5ndGhcIiBdLCBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggcnVsZXNbIHRoaXMgXSApIHtcblx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IE51bWJlciggcnVsZXNbIHRoaXMgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0XHQkLmVhY2goIFsgXCJyYW5nZWxlbmd0aFwiLCBcInJhbmdlXCIgXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcGFydHM7XG5cdFx0XHRpZiAoIHJ1bGVzWyB0aGlzIF0gKSB7XG5cdFx0XHRcdGlmICggJC5pc0FycmF5KCBydWxlc1sgdGhpcyBdICkgKSB7XG5cdFx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IFsgTnVtYmVyKCBydWxlc1sgdGhpcyBdWyAwIF0gKSwgTnVtYmVyKCBydWxlc1sgdGhpcyBdWyAxIF0gKSBdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcnVsZXNbIHRoaXMgXSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0XHRwYXJ0cyA9IHJ1bGVzWyB0aGlzIF0ucmVwbGFjZSggL1tcXFtcXF1dL2csIFwiXCIgKS5zcGxpdCggL1tcXHMsXSsvICk7XG5cdFx0XHRcdFx0cnVsZXNbIHRoaXMgXSA9IFsgTnVtYmVyKCBwYXJ0c1sgMCBdICksIE51bWJlciggcGFydHNbIDEgXSApIF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRpZiAoICQudmFsaWRhdG9yLmF1dG9DcmVhdGVSYW5nZXMgKSB7XG5cblx0XHRcdC8vIEF1dG8tY3JlYXRlIHJhbmdlc1xuXHRcdFx0aWYgKCBydWxlcy5taW4gIT0gbnVsbCAmJiBydWxlcy5tYXggIT0gbnVsbCApIHtcblx0XHRcdFx0cnVsZXMucmFuZ2UgPSBbIHJ1bGVzLm1pbiwgcnVsZXMubWF4IF07XG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5taW47XG5cdFx0XHRcdGRlbGV0ZSBydWxlcy5tYXg7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHJ1bGVzLm1pbmxlbmd0aCAhPSBudWxsICYmIHJ1bGVzLm1heGxlbmd0aCAhPSBudWxsICkge1xuXHRcdFx0XHRydWxlcy5yYW5nZWxlbmd0aCA9IFsgcnVsZXMubWlubGVuZ3RoLCBydWxlcy5tYXhsZW5ndGggXTtcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzLm1pbmxlbmd0aDtcblx0XHRcdFx0ZGVsZXRlIHJ1bGVzLm1heGxlbmd0aDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcnVsZXM7XG5cdH0sXG5cblx0Ly8gQ29udmVydHMgYSBzaW1wbGUgc3RyaW5nIHRvIGEge3N0cmluZzogdHJ1ZX0gcnVsZSwgZS5nLiwgXCJyZXF1aXJlZFwiIHRvIHtyZXF1aXJlZDp0cnVlfVxuXHRub3JtYWxpemVSdWxlOiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRpZiAoIHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0dmFyIHRyYW5zZm9ybWVkID0ge307XG5cdFx0XHQkLmVhY2goIGRhdGEuc3BsaXQoIC9cXHMvICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0cmFuc2Zvcm1lZFsgdGhpcyBdID0gdHJ1ZTtcblx0XHRcdH0gKTtcblx0XHRcdGRhdGEgPSB0cmFuc2Zvcm1lZDtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cblx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9qUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZC9cblx0YWRkTWV0aG9kOiBmdW5jdGlvbiggbmFtZSwgbWV0aG9kLCBtZXNzYWdlICkge1xuXHRcdCQudmFsaWRhdG9yLm1ldGhvZHNbIG5hbWUgXSA9IG1ldGhvZDtcblx0XHQkLnZhbGlkYXRvci5tZXNzYWdlc1sgbmFtZSBdID0gbWVzc2FnZSAhPT0gdW5kZWZpbmVkID8gbWVzc2FnZSA6ICQudmFsaWRhdG9yLm1lc3NhZ2VzWyBuYW1lIF07XG5cdFx0aWYgKCBtZXRob2QubGVuZ3RoIDwgMyApIHtcblx0XHRcdCQudmFsaWRhdG9yLmFkZENsYXNzUnVsZXMoIG5hbWUsICQudmFsaWRhdG9yLm5vcm1hbGl6ZVJ1bGUoIG5hbWUgKSApO1xuXHRcdH1cblx0fSxcblxuXHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2pRdWVyeS52YWxpZGF0b3IubWV0aG9kcy9cblx0bWV0aG9kczoge1xuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9yZXF1aXJlZC1tZXRob2QvXG5cdFx0cmVxdWlyZWQ6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG5cblx0XHRcdC8vIENoZWNrIGlmIGRlcGVuZGVuY3kgaXMgbWV0XG5cdFx0XHRpZiAoICF0aGlzLmRlcGVuZCggcGFyYW0sIGVsZW1lbnQgKSApIHtcblx0XHRcdFx0cmV0dXJuIFwiZGVwZW5kZW5jeS1taXNtYXRjaFwiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgKSB7XG5cblx0XHRcdFx0Ly8gQ291bGQgYmUgYW4gYXJyYXkgZm9yIHNlbGVjdC1tdWx0aXBsZSBvciBhIHN0cmluZywgYm90aCBhcmUgZmluZSB0aGlzIHdheVxuXHRcdFx0XHR2YXIgdmFsID0gJCggZWxlbWVudCApLnZhbCgpO1xuXHRcdFx0XHRyZXR1cm4gdmFsICYmIHZhbC5sZW5ndGggPiAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB0aGlzLmNoZWNrYWJsZSggZWxlbWVudCApICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICkgPiAwO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlLmxlbmd0aCA+IDA7XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvZW1haWwtbWV0aG9kL1xuXHRcdGVtYWlsOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cblx0XHRcdC8vIEZyb20gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuXHRcdFx0Ly8gUmV0cmlldmVkIDIwMTQtMDEtMTRcblx0XHRcdC8vIElmIHlvdSBoYXZlIGEgcHJvYmxlbSB3aXRoIHRoaXMgaW1wbGVtZW50YXRpb24sIHJlcG9ydCBhIGJ1ZyBhZ2FpbnN0IHRoZSBhYm92ZSBzcGVjXG5cdFx0XHQvLyBPciB1c2UgY3VzdG9tIG1ldGhvZHMgdG8gaW1wbGVtZW50IHlvdXIgb3duIGVtYWlsIHZhbGlkYXRpb25cblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC8udGVzdCggdmFsdWUgKTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy91cmwtbWV0aG9kL1xuXHRcdHVybDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXG5cdFx0XHQvLyBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMyBEaWVnbyBQZXJpbmksIE1JVCBsaWNlbnNlZFxuXHRcdFx0Ly8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZHBlcmluaS83MjkyOTRcblx0XHRcdC8vIHNlZSBhbHNvIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuXHRcdFx0Ly8gbW9kaWZpZWQgdG8gYWxsb3cgcHJvdG9jb2wtcmVsYXRpdmUgVVJMc1xuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXig/Oig/Oig/Omh0dHBzP3xmdHApOik/XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hKD86MTB8MTI3KSg/OlxcLlxcZHsxLDN9KXszfSkoPyEoPzoxNjlcXC4yNTR8MTkyXFwuMTY4KSg/OlxcLlxcZHsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlxcZHwzWzAtMV0pKD86XFwuXFxkezEsM30pezJ9KSg/OlsxLTldXFxkP3wxXFxkXFxkfDJbMDFdXFxkfDIyWzAtM10pKD86XFwuKD86MT9cXGR7MSwyfXwyWzAtNF1cXGR8MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNF0pKXwoPzooPzpbYS16XFx1MDBhMS1cXHVmZmZmMC05XS0qKSpbYS16XFx1MDBhMS1cXHVmZmZmMC05XSspKD86XFwuKD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSooPzpcXC4oPzpbYS16XFx1MDBhMS1cXHVmZmZmXXsyLH0pKS4/KSg/OjpcXGR7Miw1fSk/KD86Wy8/I11cXFMqKT8kL2kudGVzdCggdmFsdWUgKTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kYXRlLW1ldGhvZC9cblx0XHRkYXRlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8ICEvSW52YWxpZHxOYU4vLnRlc3QoIG5ldyBEYXRlKCB2YWx1ZSApLnRvU3RyaW5nKCkgKTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9kYXRlSVNPLW1ldGhvZC9cblx0XHRkYXRlSVNPOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkezR9W1xcL1xcLV0oMD9bMS05XXwxWzAxMl0pW1xcL1xcLV0oMD9bMS05XXxbMTJdWzAtOV18M1swMV0pJC8udGVzdCggdmFsdWUgKTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9udW1iZXItbWV0aG9kL1xuXHRcdG51bWJlcjogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50ICkge1xuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAvXig/Oi0/XFxkK3wtP1xcZHsxLDN9KD86LFxcZHszfSkrKT8oPzpcXC5cXGQrKT8kLy50ZXN0KCB2YWx1ZSApO1xuXHRcdH0sXG5cblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL2RpZ2l0cy1tZXRob2QvXG5cdFx0ZGlnaXRzOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IC9eXFxkKyQvLnRlc3QoIHZhbHVlICk7XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvbWlubGVuZ3RoLW1ldGhvZC9cblx0XHRtaW5sZW5ndGg6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG5cdFx0XHR2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogdGhpcy5nZXRMZW5ndGgoIHZhbHVlLCBlbGVtZW50ICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5vcHRpb25hbCggZWxlbWVudCApIHx8IGxlbmd0aCA+PSBwYXJhbTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9tYXhsZW5ndGgtbWV0aG9kL1xuXHRcdG1heGxlbmd0aDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0XHRcdHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgbGVuZ3RoIDw9IHBhcmFtO1xuXHRcdH0sXG5cblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3JhbmdlbGVuZ3RoLW1ldGhvZC9cblx0XHRyYW5nZWxlbmd0aDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0XHRcdHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiB0aGlzLmdldExlbmd0aCggdmFsdWUsIGVsZW1lbnQgKTtcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgKCBsZW5ndGggPj0gcGFyYW1bIDAgXSAmJiBsZW5ndGggPD0gcGFyYW1bIDEgXSApO1xuXHRcdH0sXG5cblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL21pbi1tZXRob2QvXG5cdFx0bWluOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCB2YWx1ZSA+PSBwYXJhbTtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9tYXgtbWV0aG9kL1xuXHRcdG1heDogZnVuY3Rpb24oIHZhbHVlLCBlbGVtZW50LCBwYXJhbSApIHtcblx0XHRcdHJldHVybiB0aGlzLm9wdGlvbmFsKCBlbGVtZW50ICkgfHwgdmFsdWUgPD0gcGFyYW07XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmFuZ2UtbWV0aG9kL1xuXHRcdHJhbmdlOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCAoIHZhbHVlID49IHBhcmFtWyAwIF0gJiYgdmFsdWUgPD0gcGFyYW1bIDEgXSApO1xuXHRcdH0sXG5cblx0XHQvLyBodHRwczovL2pxdWVyeXZhbGlkYXRpb24ub3JnL3N0ZXAtbWV0aG9kL1xuXHRcdHN0ZXA6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0gKSB7XG5cdFx0XHR2YXIgdHlwZSA9ICQoIGVsZW1lbnQgKS5hdHRyKCBcInR5cGVcIiApLFxuXHRcdFx0XHRlcnJvck1lc3NhZ2UgPSBcIlN0ZXAgYXR0cmlidXRlIG9uIGlucHV0IHR5cGUgXCIgKyB0eXBlICsgXCIgaXMgbm90IHN1cHBvcnRlZC5cIixcblx0XHRcdFx0c3VwcG9ydGVkVHlwZXMgPSBbIFwidGV4dFwiLCBcIm51bWJlclwiLCBcInJhbmdlXCIgXSxcblx0XHRcdFx0cmUgPSBuZXcgUmVnRXhwKCBcIlxcXFxiXCIgKyB0eXBlICsgXCJcXFxcYlwiICksXG5cdFx0XHRcdG5vdFN1cHBvcnRlZCA9IHR5cGUgJiYgIXJlLnRlc3QoIHN1cHBvcnRlZFR5cGVzLmpvaW4oKSApLFxuXHRcdFx0XHRkZWNpbWFsUGxhY2VzID0gZnVuY3Rpb24oIG51bSApIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSAoIFwiXCIgKyBudW0gKS5tYXRjaCggLyg/OlxcLihcXGQrKSk/JC8gKTtcblx0XHRcdFx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE51bWJlciBvZiBkaWdpdHMgcmlnaHQgb2YgZGVjaW1hbCBwb2ludC5cblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hbIDEgXSA/IG1hdGNoWyAxIF0ubGVuZ3RoIDogMDtcblx0XHRcdFx0fSxcblx0XHRcdFx0dG9JbnQgPSBmdW5jdGlvbiggbnVtICkge1xuXHRcdFx0XHRcdHJldHVybiBNYXRoLnJvdW5kKCBudW0gKiBNYXRoLnBvdyggMTAsIGRlY2ltYWxzICkgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dmFsaWQgPSB0cnVlLFxuXHRcdFx0XHRkZWNpbWFscztcblxuXHRcdFx0Ly8gV29ya3Mgb25seSBmb3IgdGV4dCwgbnVtYmVyIGFuZCByYW5nZSBpbnB1dCB0eXBlc1xuXHRcdFx0Ly8gVE9ETyBmaW5kIGEgd2F5IHRvIHN1cHBvcnQgaW5wdXQgdHlwZXMgZGF0ZSwgZGF0ZXRpbWUsIGRhdGV0aW1lLWxvY2FsLCBtb250aCwgdGltZSBhbmQgd2Vla1xuXHRcdFx0aWYgKCBub3RTdXBwb3J0ZWQgKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggZXJyb3JNZXNzYWdlICk7XG5cdFx0XHR9XG5cblx0XHRcdGRlY2ltYWxzID0gZGVjaW1hbFBsYWNlcyggcGFyYW0gKTtcblxuXHRcdFx0Ly8gVmFsdWUgY2FuJ3QgaGF2ZSB0b28gbWFueSBkZWNpbWFsc1xuXHRcdFx0aWYgKCBkZWNpbWFsUGxhY2VzKCB2YWx1ZSApID4gZGVjaW1hbHMgfHwgdG9JbnQoIHZhbHVlICkgJSB0b0ludCggcGFyYW0gKSAhPT0gMCApIHtcblx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMub3B0aW9uYWwoIGVsZW1lbnQgKSB8fCB2YWxpZDtcblx0XHR9LFxuXG5cdFx0Ly8gaHR0cHM6Ly9qcXVlcnl2YWxpZGF0aW9uLm9yZy9lcXVhbFRvLW1ldGhvZC9cblx0XHRlcXVhbFRvOiBmdW5jdGlvbiggdmFsdWUsIGVsZW1lbnQsIHBhcmFtICkge1xuXG5cdFx0XHQvLyBCaW5kIHRvIHRoZSBibHVyIGV2ZW50IG9mIHRoZSB0YXJnZXQgaW4gb3JkZXIgdG8gcmV2YWxpZGF0ZSB3aGVuZXZlciB0aGUgdGFyZ2V0IGZpZWxkIGlzIHVwZGF0ZWRcblx0XHRcdHZhciB0YXJnZXQgPSAkKCBwYXJhbSApO1xuXHRcdFx0aWYgKCB0aGlzLnNldHRpbmdzLm9uZm9jdXNvdXQgJiYgdGFyZ2V0Lm5vdCggXCIudmFsaWRhdGUtZXF1YWxUby1ibHVyXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHRhcmdldC5hZGRDbGFzcyggXCJ2YWxpZGF0ZS1lcXVhbFRvLWJsdXJcIiApLm9uKCBcImJsdXIudmFsaWRhdGUtZXF1YWxUb1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCBlbGVtZW50ICkudmFsaWQoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB0YXJnZXQudmFsKCk7XG5cdFx0fSxcblxuXHRcdC8vIGh0dHBzOi8vanF1ZXJ5dmFsaWRhdGlvbi5vcmcvcmVtb3RlLW1ldGhvZC9cblx0XHRyZW1vdGU6IGZ1bmN0aW9uKCB2YWx1ZSwgZWxlbWVudCwgcGFyYW0sIG1ldGhvZCApIHtcblx0XHRcdGlmICggdGhpcy5vcHRpb25hbCggZWxlbWVudCApICkge1xuXHRcdFx0XHRyZXR1cm4gXCJkZXBlbmRlbmN5LW1pc21hdGNoXCI7XG5cdFx0XHR9XG5cblx0XHRcdG1ldGhvZCA9IHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIgJiYgbWV0aG9kIHx8IFwicmVtb3RlXCI7XG5cblx0XHRcdHZhciBwcmV2aW91cyA9IHRoaXMucHJldmlvdXNWYWx1ZSggZWxlbWVudCwgbWV0aG9kICksXG5cdFx0XHRcdHZhbGlkYXRvciwgZGF0YSwgb3B0aW9uRGF0YVN0cmluZztcblxuXHRcdFx0aWYgKCAhdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF0gKSB7XG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MubWVzc2FnZXNbIGVsZW1lbnQubmFtZSBdID0ge307XG5cdFx0XHR9XG5cdFx0XHRwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgPSBwcmV2aW91cy5vcmlnaW5hbE1lc3NhZ2UgfHwgdGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdO1xuXHRcdFx0dGhpcy5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdID0gcHJldmlvdXMubWVzc2FnZTtcblxuXHRcdFx0cGFyYW0gPSB0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIgJiYgeyB1cmw6IHBhcmFtIH0gfHwgcGFyYW07XG5cdFx0XHRvcHRpb25EYXRhU3RyaW5nID0gJC5wYXJhbSggJC5leHRlbmQoIHsgZGF0YTogdmFsdWUgfSwgcGFyYW0uZGF0YSApICk7XG5cdFx0XHRpZiAoIHByZXZpb3VzLm9sZCA9PT0gb3B0aW9uRGF0YVN0cmluZyApIHtcblx0XHRcdFx0cmV0dXJuIHByZXZpb3VzLnZhbGlkO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmV2aW91cy5vbGQgPSBvcHRpb25EYXRhU3RyaW5nO1xuXHRcdFx0dmFsaWRhdG9yID0gdGhpcztcblx0XHRcdHRoaXMuc3RhcnRSZXF1ZXN0KCBlbGVtZW50ICk7XG5cdFx0XHRkYXRhID0ge307XG5cdFx0XHRkYXRhWyBlbGVtZW50Lm5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0JC5hamF4KCAkLmV4dGVuZCggdHJ1ZSwge1xuXHRcdFx0XHRtb2RlOiBcImFib3J0XCIsXG5cdFx0XHRcdHBvcnQ6IFwidmFsaWRhdGVcIiArIGVsZW1lbnQubmFtZSxcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHRjb250ZXh0OiB2YWxpZGF0b3IuY3VycmVudEZvcm0sXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHR2YXIgdmFsaWQgPSByZXNwb25zZSA9PT0gdHJ1ZSB8fCByZXNwb25zZSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHRcdFx0XHRlcnJvcnMsIG1lc3NhZ2UsIHN1Ym1pdHRlZDtcblxuXHRcdFx0XHRcdHZhbGlkYXRvci5zZXR0aW5ncy5tZXNzYWdlc1sgZWxlbWVudC5uYW1lIF1bIG1ldGhvZCBdID0gcHJldmlvdXMub3JpZ2luYWxNZXNzYWdlO1xuXHRcdFx0XHRcdGlmICggdmFsaWQgKSB7XG5cdFx0XHRcdFx0XHRzdWJtaXR0ZWQgPSB2YWxpZGF0b3IuZm9ybVN1Ym1pdHRlZDtcblx0XHRcdFx0XHRcdHZhbGlkYXRvci5yZXNldEludGVybmFscygpO1xuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnRvSGlkZSA9IHZhbGlkYXRvci5lcnJvcnNGb3IoIGVsZW1lbnQgKTtcblx0XHRcdFx0XHRcdHZhbGlkYXRvci5mb3JtU3VibWl0dGVkID0gc3VibWl0dGVkO1xuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnN1Y2Nlc3NMaXN0LnB1c2goIGVsZW1lbnQgKTtcblx0XHRcdFx0XHRcdHZhbGlkYXRvci5pbnZhbGlkWyBlbGVtZW50Lm5hbWUgXSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnNob3dFcnJvcnMoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZXJyb3JzID0ge307XG5cdFx0XHRcdFx0XHRtZXNzYWdlID0gcmVzcG9uc2UgfHwgdmFsaWRhdG9yLmRlZmF1bHRNZXNzYWdlKCBlbGVtZW50LCB7IG1ldGhvZDogbWV0aG9kLCBwYXJhbWV0ZXJzOiB2YWx1ZSB9ICk7XG5cdFx0XHRcdFx0XHRlcnJvcnNbIGVsZW1lbnQubmFtZSBdID0gcHJldmlvdXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0XHRcdFx0XHR2YWxpZGF0b3IuaW52YWxpZFsgZWxlbWVudC5uYW1lIF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0dmFsaWRhdG9yLnNob3dFcnJvcnMoIGVycm9ycyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwcmV2aW91cy52YWxpZCA9IHZhbGlkO1xuXHRcdFx0XHRcdHZhbGlkYXRvci5zdG9wUmVxdWVzdCggZWxlbWVudCwgdmFsaWQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgcGFyYW0gKSApO1xuXHRcdFx0cmV0dXJuIFwicGVuZGluZ1wiO1xuXHRcdH1cblx0fVxuXG59ICk7XG5cbi8vIEFqYXggbW9kZTogYWJvcnRcbi8vIHVzYWdlOiAkLmFqYXgoeyBtb2RlOiBcImFib3J0XCJbLCBwb3J0OiBcInVuaXF1ZXBvcnRcIl19KTtcbi8vIGlmIG1vZGU6XCJhYm9ydFwiIGlzIHVzZWQsIHRoZSBwcmV2aW91cyByZXF1ZXN0IG9uIHRoYXQgcG9ydCAocG9ydCBjYW4gYmUgdW5kZWZpbmVkKSBpcyBhYm9ydGVkIHZpYSBYTUxIdHRwUmVxdWVzdC5hYm9ydCgpXG5cbnZhciBwZW5kaW5nUmVxdWVzdHMgPSB7fSxcblx0YWpheDtcblxuLy8gVXNlIGEgcHJlZmlsdGVyIGlmIGF2YWlsYWJsZSAoMS41KylcbmlmICggJC5hamF4UHJlZmlsdGVyICkge1xuXHQkLmFqYXhQcmVmaWx0ZXIoIGZ1bmN0aW9uKCBzZXR0aW5ncywgXywgeGhyICkge1xuXHRcdHZhciBwb3J0ID0gc2V0dGluZ3MucG9ydDtcblx0XHRpZiAoIHNldHRpbmdzLm1vZGUgPT09IFwiYWJvcnRcIiApIHtcblx0XHRcdGlmICggcGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0gKSB7XG5cdFx0XHRcdHBlbmRpbmdSZXF1ZXN0c1sgcG9ydCBdLmFib3J0KCk7XG5cdFx0XHR9XG5cdFx0XHRwZW5kaW5nUmVxdWVzdHNbIHBvcnQgXSA9IHhocjtcblx0XHR9XG5cdH0gKTtcbn0gZWxzZSB7XG5cblx0Ly8gUHJveHkgYWpheFxuXHRhamF4ID0gJC5hamF4O1xuXHQkLmFqYXggPSBmdW5jdGlvbiggc2V0dGluZ3MgKSB7XG5cdFx0dmFyIG1vZGUgPSAoIFwibW9kZVwiIGluIHNldHRpbmdzID8gc2V0dGluZ3MgOiAkLmFqYXhTZXR0aW5ncyApLm1vZGUsXG5cdFx0XHRwb3J0ID0gKCBcInBvcnRcIiBpbiBzZXR0aW5ncyA/IHNldHRpbmdzIDogJC5hamF4U2V0dGluZ3MgKS5wb3J0O1xuXHRcdGlmICggbW9kZSA9PT0gXCJhYm9ydFwiICkge1xuXHRcdFx0aWYgKCBwZW5kaW5nUmVxdWVzdHNbIHBvcnQgXSApIHtcblx0XHRcdFx0cGVuZGluZ1JlcXVlc3RzWyBwb3J0IF0uYWJvcnQoKTtcblx0XHRcdH1cblx0XHRcdHBlbmRpbmdSZXF1ZXN0c1sgcG9ydCBdID0gYWpheC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHRyZXR1cm4gcGVuZGluZ1JlcXVlc3RzWyBwb3J0IF07XG5cdFx0fVxuXHRcdHJldHVybiBhamF4LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0fTtcbn1cbnJldHVybiAkO1xufSkpOyJdLCJmaWxlIjoibGliL2pxdWVyeS12YWxpZGF0aW9uL2Rpc3QvanF1ZXJ5LnZhbGlkYXRlLmVzNS5qcyJ9
