jQuery(document).ready(function ($) {
    // Check the GDPR enabled.
    if ($('#wpsms-gdpr-confirmation').length) {
        if ($('#wpsms-gdpr-confirmation').attr('checked')) {
            $("#wpsms-submit").removeAttr('disabled');
        } else {
            $("#wpsms-submit").attr('disabled', 'disabled');
        }
        $("#wpsms-gdpr-confirmation").click(function () {
            if (this.checked) {
                $("#wpsms-submit").removeAttr('disabled');
            } else {
                $("#wpsms-submit").attr('disabled', 'disabled');
            }
        });
    }

    $("#wpsms-subscribe #wpsms-submit").click(function () {
        $(this).attr('disabled', 'disabled');
        $("#wpsms-result").hide();
        $(".wpsms-subscribe__overlay").css('display', 'flex');

        var verify = $("#newsletter-form-verify").val();

        subscriber = Array();
        subscriber['name'] = $("#wpsms-name").val();
        subscriber['mobile'] = $("#wpsms-mobile").val();
        subscriber['group_id'] = $("#wpsms-groups").val();
        subscriber['type'] = $('input[name=subscribe_type]:checked').val();

        $("#wpsms-subscribe").ajaxStart(function () {
            $("#wpsms-submit").attr('disabled', 'disabled');
            $("#wpsms-submit").text(wpsms_ajax_object.loading_text);
        });

        $("#wpsms-subscribe").ajaxComplete(function () {
            $("#wpsms-submit").removeAttr('disabled');
            $("#wpsms-submit").text(wpsms_ajax_object.subscribe_text);
        });
        if (subscriber['type'] === 'subscribe') {
            var method = 'POST';
        } else {
            var method = 'DELETE';
        }
        var data_obj = Object.assign({}, subscriber);
        var ajax = $.ajax({
            type: method,
            url: wpsms_ajax_object.ajaxurl,
            data: data_obj
        });
        ajax.fail(function (data) {
            var response = $.parseJSON(data.responseText);
            var message = null;

            $("#wpsms-submit").removeAttr('disabled');
            $(".wpsms-subscribe__overlay").css('display', 'none');
            if (typeof (response.error) != "undefined" && response.error !== null) {
                message = response.error.message;
            } else {
                message = wpsms_ajax_object.unknown_error;
            }

            $("#wpsms-result").fadeIn();
            $("#wpsms-result").html('<span class="wpsms-subscribe__message wpsms-subscribe__message--error">' + message + '</div>');
        });
        ajax.done(function (data) {
            var response = data;
            var message = response.message;

            $("#wpsms-submit").removeAttr('disabled');
            $(".wpsms-subscribe__overlay").css('display', 'none');
            $("#wpsms-result").fadeIn();
            $("#wpsms-step-1").hide();
            $("#wpsms-result").html('<span class="wpsms-subscribe__message wpsms-subscribe__message--success">' + message + '</div>');
            if (subscriber['type'] === 'subscribe' && verify === '1') {
                $("#wpsms-step-2").show();
            }
        });
    });

    $("#wpsms-subscribe #activation").on('click', function () {
        $("#wpsms-result").hide();
        subscriber['activation'] = $("#wpsms-ativation-code").val();
        $(this).attr('disabled', 'disabled');
        $(".wpsms-subscribe__overlay").css('display', 'flex');

        $("#wpsms-subscribe").ajaxStart(function () {
            $("#activation").attr('disabled', 'disabled');
            $("#activation").text(wpsms_ajax_object.loading_text);
        });

        $("#wpsms-subscribe").ajaxComplete(function () {
            $("#activation").removeAttr('disabled');
            $("#activation").text(wpsms_ajax_object.activation_text);
        });

        var data_obj = Object.assign({}, subscriber);
        var ajax = $.ajax({
            type: 'PUT',
            url: wpsms_ajax_object.ajaxurl,
            data: data_obj
        });
        ajax.fail(function (data) {
            var response = $.parseJSON(data.responseText);
            var message = null;

            $("#activation").removeAttr('disabled');
            $(".wpsms-subscribe__overlay").css('display', 'none');
            if (typeof (response.error) != "undefined" && response.error !== null) {
                message = response.error.message;
            } else {
                message = wpsms_ajax_object.unknown_error;
            }

            $("#wpsms-result").fadeIn();
            $("#wpsms-result").html('<span class="wpsms-subscribe__message wpsms-subscribe__message--error">' + message + '</div>');
        });
        ajax.done(function (data) {
            var response = data;
            var message = response.message;

            $("#activation").removeAttr('disabled');
            $(".wpsms-subscribe__overlay").css('display', 'flex');
            $("#wpsms-result").fadeIn();
            $("#wpsms-step-2").hide();
            $("#wpsms-result").html('<span class="wpsms-subscribe__message wpsms-subscribe__message--success">' + message + '</div>');
        });
    });
});
