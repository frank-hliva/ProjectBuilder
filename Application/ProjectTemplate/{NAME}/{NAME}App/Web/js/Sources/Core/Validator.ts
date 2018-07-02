/*import lang from './LangManager'
import $ from 'jquery'

export function notEmpty(value) {
    return value !== "" && value !== null && value !== undefined;
}

export function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validatorOptions = {
    selector: "input[type='text'], input[type='password'], input[type='number'], input[type='email'], textarea",
    ignoreHidden: true,
    validations: {
        required: {
            test: (field) => notEmpty(field.val()),
            msg: (field) => lang.value.V_REQUIRED
        },
        minLength: {
            test: (field) => field.val().length >= field.data('minlength'),
            msg: (field) => lang.value.V_MIN_LENGTH.replace(new RegExp('{n}', 'g'), field.data('minlength'))
        },
        maxLength: {
            test: (field) => field.val().length <= field.data('maxlength'),
            msg: (field) => lang.value.V_MAX_LENGTH.replace(new RegExp('{n}', 'g'), field.data('maxlength'))
        },
        email: {
            test: (field) => isValidEmail(field.val()),
            msg: (field) => lang.value.V_EMAIL_ADDRESS_IN_INVALID_FORMAT
        },
        match: {
            test: (field) => field.val() === $(field.data('match')).val(),
            msg: (field) => lang.value.V_DOES_NOT_MATCH
        },
        pattern: {
            test: (field) => new RegExp(field.attr('pattern')).test(field.val()),
            msg: (field) => lang.value.V_VALUE_HAS_INVALID_FORMAT
        },
        loginExists: {
            msg: (field) => lang.value.V_ANOTHER_USER_ALREADY_EXISTS_IN_THE_SYSTEM_WITH_THE_SAME_LOGIN_NAME
        },
        requiredFile: {
            test: (field) => field.val() !== "" && field.val() !== null && field.val() !== undefined,
            msg: (field) => lang.value.V_PLEASE_UPLOAD_IMAGE_FILE
        },
    }
}

function removeErrors(form) {
    form.find('.has-feedback').each(function (this: any) {
        let feedback = $(this);
        feedback.removeClass("has-error has-danger");
        feedback.find(".help-block.with-errors").html('');
    });
}

export function showError(name, field, validations) {
    let feedback = field.closest('.has-feedback');
    if (feedback[0]) {
        feedback.addClass("has-error has-danger");
        feedback.find(".help-block.with-errors").html(`<div>${field.data(`${name}-error`) || validations[name].msg(field, feedback)}</div>`);
    }
    const event = field.attr('type') === 'file' ? 'change' : 'input';
    const onChange = function (e) {
        removeErrors(field.closest('form'));
        $(field).off(event, onChange);
    }
    field.focus();
    $(field).on(event, onChange);
}

export function validate(form, options) {
    removeErrors(form);
    options = options ? { ...validatorOptions, ...options } : { ...validatorOptions };
    let isValid = true;
    form.find(options.selector).each(function (this: any) {
        const field = $(this);
        if (!field.data('ignore') && (!options.ignoreHidden || field.is(":visible"))) {
            if (field[0].hasAttribute('required')) {
                if (!options.validations.required.test(field)) {
                    showError(field.attr('type') === "file" ? 'requiredFile' : 'required', field, options.validations);
                    isValid = false;
                    return false;
                }
            }
            if (field.data('match')) {
                if (!options.validations.match.test(field)) {
                    showError('match', field, options.validations);
                    isValid = false;
                    return false;
                }
            }
            if (notEmpty(field.val())) {
                if (field.attr('type') === "email") {
                    if (!options.validations.email.test(field)) {
                        showError('email', field, options.validations);
                        isValid = false;
                        return false;
                    }
                }
                if (field.data('minlength')) {
                    if (!options.validations.minLength.test(field)) {
                        showError('minLength', field, options.validations);
                        isValid = false;
                        return false;
                    }
                }
                if (field.data('maxlength')) {
                    if (!options.validations.maxLength.test(field)) {
                        showError('maxLength', field, options.validations);
                        isValid = false;
                        return false;
                    }
                }
                if (field[0].hasAttribute('pattern')) {
                    if (!options.validations.pattern.test(field)) {
                        showError('pattern', field, options.validations);
                        isValid = false;
                        return false;
                    }
                }
            }
        }
    });
    return isValid;
}*/