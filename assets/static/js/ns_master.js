ns_master = {};
//Cấu trúc ns_master.toastr('Truyền vào text thông báo','Kiểu thông báo(Lỗi : error; Thành công: success)')
ns_master.toastr = function (msg, type) {
    if (type === 'error') {
        toastr.error(msg, "Thông báo");
    } else if (type === 'success') {
        toastr.success(msg, "Notification");
    } else {
        toastr.error(msg, "Notification");
    }
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}

// Thay đổi thông tin
ns_master.changeInfo = function () {

    $.post('/', {
        'ajax': 'user/user',
        'action': 'user_info',
    }, function (json) {
        console.log(json);
        $('#modal-change-info input').val("");
        if (json.error) {
            $('#id-student').html(json.username);

        }


    }, 'json');


    $('#modal-change-info').modal('show');


};

ns_master.uploadAvatar = function () {
//    $.fancybox.showActivity();
    var button = $('#btn-do-upload-avatar');
//    var parent = $(ele).parents('.tab-pane');
    new AjaxUpload(button, {
        action: '/',
        name: 'userfile',
        data: {
            ajax: 'user/upload',
            action: 'upload',
            width: 2000,
            height: 2000,
            t_width: 200,
            t_height: 200
        },
        onSubmit: function (file, ext) {
            this.disable();
        },
        onComplete: function (file, response) {
            try {
                response = $.parseJSON(response);
                button.fadeIn(500);
//                $.fancybox.hideActivity();
                if (response.error) {
                    alert(response.string);
                } else {
                    console.log(response);
//                    $('#btn-do-upload-pro-edit a').attr('style', 'display:none');
//                    $('#image-edit').val(response.sha);
                    $('#btn-do-upload-avatar').attr('src', response.display_image); // Link ảnh
                    $('img.user-image').attr('src', response.display_image);
                    $('img.img-circle').attr('src', response.display_image);
                }
            } catch (e) {
                ns_master.toastr('Có lỗi xảy ra, vui lòng thử lại!');
            } finally {
                this.enable();
            }
        }
    });
}



ns_master.submitUpdateInfo = function () {
    element = $('#modal-change-info');
    if ($('input[name="ol-password"]', element).val() == "") {
        $('input[name="ol-password"]', element).focus();
        ns_master.toastr('Vui lòng nhập mật khẩu cũ trước khi thay đổi')
        return;
    }
    if ($('input[name="new_password"]', element).val() == "") {
        $('input[name="new_password"]', element).focus();
        ns_master.toastr('Vui lòng nhập mật khẩu mới trước khi thay đổi')
        return;
    }

    $.post('/', {
        'ajax': 'user/user',
        'action': 'changeInfo',
        'ol-password': $('input[name="ol-password"]', element).val(),
        'new_password': $('input[name="new_password"]', element).val(),
    }, function (data) {
        if (data.error) {
            ns_master.toastr(data.msg, 'error');
        } else {
            $('#modal-change-info').modal('toggle');
            ns_master.toastr(data.msg, 'success');
        }
    }, 'json');
}

