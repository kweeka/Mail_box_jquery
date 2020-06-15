var email_page = 1;
var out_email_page = 1;

$("#header_sign_up").click(function () {
    $(".my_content").css("display", "none");
    $("#registration_content").css("display", "block");
});
$("#authorization_sign_up").click(function () {
    $(".my_content").css("display", "none");
    $("#registration_content").css("display", "block");
});
$("#registration_sign_in").click(function () {
    $(".my_content").css("display", "none");
    $("#authorization_content").css("display", "block");
});
$("#header_sign_in").click(function () {
    $(".my_content").css("display", "none");
    $("#authorization_content").css("display", "block");
});
$("#tel_icon").click(function () {
    $(".my_content").css("display", "none");
    $("#my_contact").css("display", "block");
});

$(".menu_mail li").click(function () {
    $(".menu_mail li").removeClass("active");
    $(this).addClass("active");
});

$("#write_mail").click(function () {
    $(".my_content").css("display", "none");
    $("#write_new_mail").css("display", "block");
});

$("#ask_mail").click(function () {
    $(".my_content").css("display", "none");
    $("#write_new_mail").css("display", "block");
    console.log($(this).parent().parent().children(".topic_email")[0].innerText);
    $("#for_write_mail").val($(this).parent().parent().children("#open_email")[0].value);
    $("#topic_new_mail").val("RE: " + $(this).parent().parent().children(".topic_email")[0].innerText);
    $("#text_new_mail").val( "\n\n--\n"+ $(this).parent().parent().children(".body_email")[0].innerText);
});

$("#client_mail").click(function () {
    $(".my_content").css("display", "none");
    $("#mail_content").css("display", "block");
    $("#mail_inbox").trigger("click");
});

function request_mail(email_type, mail_del, table_del) {
    mail_del = mail_del ? 1 : 0;
    if (table_del){
        var mail_table = document.querySelectorAll("#email_list > tbody > tr");
        for (var i =0; i < mail_table.length; i++){
            mail_table[i].remove();
        }
        $(".body_email").remove();
        $(".topic_email").remove();
    }
    $(".list_contact").remove();
    var auth_token = localStorage.getItem("auth_token");
    $.ajax({
        type: "GET",
        url: "http://mail-backend.agafonov.me/api/v1/mail/" + email_type + "?page=" + email_page + "&deleted=" + mail_del,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + auth_token);
        },
        success: function (email_list) {
            email_page++;
            console.log(email_list);
            for (var i=0; i<email_list.response.items.length; i++){
                append(email_list.response.items[i]);
            }
            $(".name_contact").each(function(indx, element){
                //console.log($(element).text()); //jq
                //console.log(element.innerText);//js обратиться к содержимому
                $(".my_list_contact").append("<li class=\"list_contact\">"+element.innerText+"</li>");
            });
            $("#email_list tr .open_email").click(function () {
                var email_id = this.parentNode.querySelector(".only_id_email").value;
                open_mail(email_id);
            });
            $(".flag_checkbox").unbind("click");
            $(".flag_checkbox").click(function () {
                if ($(this).prev(".action_email_checkbox").prop("checked")){
                    $(this).prev(".action_email_checkbox").prop("checked", false);
                } else {
                    $(this).prev(".action_email_checkbox").prop("checked", true);
                }
            });
            if (email_list.response.items.length === 0){
                email_page--;
            }
        },
        error: function (error_data, error) {
            console.log(error_data);
            console.log(error);
        }
    })
}

$("#mail_inbox").click(function () {
    $("#name_heading_mail").text("Входящие");
    email_page = 1;
    request_mail("inbox", false, true);
});

$("#mail_outbox").click(function () {
    $("#name_heading_mail").text("Отправленные");
    email_page = 1;
    request_mail("outbox", false, true);
});

$("#mail_deleted_inbox").click(function () {
    $("#name_heading_mail").text("Удаленные входящие");
    email_page = 1;
    request_mail("inbox", true, true);
});

function append(email) {
    var date_email;
    if (email.date.slice(0, 10) === current_date){
        date_email =  email.date.slice(11);
    } else {
        date_email = email.date.slice(0, 10);
    }
    $( "#email_list" ).append( "<tr id=\"id_email_" + email.id +"\" class=\"row_email\">" +
        "<td class=\"action_email\"><input type=\"checkbox\" name=\"action_email\" value=\"action_email\" class=\"action_email_checkbox\"/>" +
        "<span class=\"flag_checkbox\"><span class=\"flag_checkbox_icon\"></span></span>" +
        "<input type=\"hidden\" name=\"only_id_email\" class=\"only_id_email\" value=\""+ email.id +"\">" +
        "</td>" +
        "<td class=\"photo_contact\"><span class=\"contact_email_circle\">"+ email.sender[0] +"</span></td>"+
        "<td class=\"name_contact open_email\">"+ email.sender + (email.read ? "" : "</b>") + "</td>"+
        "<td class=\"give_email\ open_email\"><div class=\"give_email\"><span class=\"subject_email\">"+ (email.read ? "" : "<b>") +
        email.subject +(email.read ? "" : "</b>") + "</span><span class=\"text_email\">"+ email.text +"</span></div></td>"+
        "<td class=\"time_email\">"+ date_email +"</td>"+
        "</tr>");
}

var current_date = moment().format("YYYY-MM-DD");

function open_mail(email_id) {
    $(".my_content").css("display", "none");
    $("#opened_email").css("display", "block");
    $(".open_mail_send").remove();
    console.log(email_id);
    var auth_token = localStorage.getItem("auth_token");
    $.ajax ({
        type: "GET",
        url: "https://dev1.agafonov.me/api/v1/mail/" + email_id,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + auth_token);
        },
        success: function (email) {
            console.log(email);
            $("#opened_email").append("<p class='topic_email'>" + email.response.subject + "</p>" + "<p class='body_email'>" +
                email.response.text + "</p>" +"<input type=\"hidden\" name=\"open_id\" id=\"open_id\" class=\"open_mail_send\" value=\""+ email.response.id +"\">" +
                "<input type=\"hidden\" name=\"open_email\" id=\"open_email\" class=\"open_mail_send\" value=\""+ email.response.sender +"\">");
        }
    });
}

$(".additional_mail").click(function () {
    var email_section = $(".select_email_list.active")[0].id;
    var email_section_url;
    var deleted_mail_add = false;
    switch (email_section){
        case "mail_deleted_inbox":
            deleted_mail_add = true;
            email_section_url = "inbox";
            break;
        case "mail_inbox":
            email_section_url = "inbox";
            break;
        case "mail_outbox":
            email_section_url = "outbox";
            break;
        default:
            show_error("Invalid button", 'error');
    }
    request_mail(email_section_url, deleted_mail_add, false);

    /*$.ajax({
        type: "GET",
        url: "https://dev1.agafonov.me/api/v1/mail/" + email_section_url + "?page=" + email_page,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + auth_token);
        },
        success: function (email_list) {
            email_page++;
            console.log(email_list);
            for (var i=0; i<email_list.response.items.length; i++){
                //$(".name_contact").html(email_list.response.items[i].sender);
                append(email_list.response.items[i]);
            }
            $(".name_contact").each(function(indx, element){
                //console.log($(element).text()); //jq
                //console.log(element.innerText);//js обратиться к содержимому
                $(".my_list_contact").append("<li class=\"list_contact\">"+element.innerText+"</li>");
            });
            $("#email_list tr .open_email").click(function () {
                var email_id = this.parentNode.querySelector(".only_id_email").value;
                open_mail(email_id);
            });
            $(".flag_checkbox").unbind("click");
            $(".flag_checkbox").click(function () {
                if ($(this).prev(".action_email_checkbox").prop("checked")){
                    $(this).prev(".action_email_checkbox").prop("checked", false);
                } else {
                    $(this).prev(".action_email_checkbox").prop("checked", true);
                }
            });
        },
        error: function (error_data, error) {
            console.log(error_data);
            console.log(error);
        }
    })
    */
});

$("#logo").click(function () {
    console.log("Init");
    $(".my_content").css("display", "none");
    $("#main_content").css("display", "block");
    var auth_token = localStorage.getItem("auth_token");
    if (auth_token){
        $.ajax({
            type: "GET",
            url: "http://mail-backend.agafonov.me/api/v1/user",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer " + auth_token);
            },
            success: function (user_data) {
                console.log(user_data);
                $("#user_id_info").html(user_data.response.id);
                $("#user_name_info").html(user_data.response.name);
                $("#user_email_info").html(user_data.response.email);
                $("#user_email_header").html(user_data.response.email);
                $("#user_email_header_circle").html(user_data.response.email[0]);
                $("#unauthorized_header").css("display", "none");
                $("#authorized_header").css("display", "block");
                $("#main_content").click();
            },
            error: function (error_data, error) {
                console.log(error_data);
                console.log(error);
                if (!error_data.hasOwnProperty('responseJSON')){
                    show_error("Ошибка соединения", "error");
                    return;
                }
                switch (error_data.responseJSON.response_type){
                    case "ErrorAuthResponse":
                        $("#header_sign_in").click();
                        localStorage.removeItem("auth_token");
                        break;
                    default:
                        alert ("Ошибка связи");
                        $("#logo").click();
                }
            }
        });
    } else {
        $("#header_sign_in").click();
        $("#unauthorized_header").css("display", "block");
        $("#authorized_header").css("display", "none");
    }
});

$(document).ready(function () {
    console.log("I");
    $("#logo").click();
});

$("#registration_sign_up").click(function () {
    var data = {
        email: $("#e_mail").val(),
        password: $("#passwords").val(),
        name: $("#name").val()
    };
    if (!correct_email(data.email)){
        error_input("email", "Введен некорректный e-mail");
        return;
    }
    if (data.password.length < 6 || data.password.length > 40){
        error_input("password", "Количество символов должно быть 6-40");
        return;
    }
    var filled = true;
    for(var prop in data){
        if (data[prop] ===  ""){
            filled = false;
            error_input(prop, "Обязательное поле");
        }
    }
    if (!filled){
        return;
    }
    $.ajax({
        type: "POST",
        url: "http://mail-backend.agafonov.me/api/v1/user/register",
        data: data,
        success: function (response) {
            console.log(response);
            localStorage.setItem("auth_token", response.response.token);
            $("#logo").click();
        },
        error:function (error_data, error){
            console.log(error_data);
            console.log(error);
            if (!error_data.hasOwnProperty('responseJSON')){
                alert("Ошибка соединения");
                return;
            }
            switch (error_data.responseJSON.response_type) {
                case "ClientErrorResponse":
                    error_input(error_data.responseJSON.response.field, error_data.responseJSON.response.message);
                    break;
                default:
                    alert("Ошибка соединения");
            }
        }
    });
});
$("#logout").click(function () {
    var auth_token = localStorage.getItem("auth_token");
    if (auth_token) {
        $.ajax({
            type: "GET",
            url: "http://mail-backend.agafonov.me/api/v1/auth/logout",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + auth_token);
            },
            success: function (response) {
                console.log(response);
                localStorage.removeItem("auth_token");
                $("#logo").click();
            }
        })
    } else {
        $("#logo").click();
    }
});

$("#send_mail").click(function () {
    var auth_token = localStorage.getItem("auth_token");
    var data = {
        email: $("#for_write_mail").val(),
        subject: $("#topic_new_mail").val(),
        text: $("#text_new_mail").val()
    };
    $.ajax({
        type: "POST",
        url: "http://mail-backend.agafonov.me/api/v1/mail/send",
        data: data,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + auth_token);
        },
        success: function (mail) {
            console.log(mail);
            $("#client_mail").click();
        },
        error: function (error_data,error) {
            console.log(error_data);
            console.log(error);
            if (!error_data.hasOwnProperty('responseJSON')){
                alert("Ошибка соединения");
                return;
            }
            switch (error_data.responseJSON.response_type){
                case "ClientErrorResponse":
                    $("#write_error_" + error_data.responseJSON.response.field).html(error_data.responseJSON.response.message);
                    //$(".form_field_" + error_data.responseJSON.response.field).css("border-color", "#ffb2b5");
                    break;
                default:
                    alert("Ошибка соединения");
            }
        }
    })
});

$(".registration_table").keyup(function () {
    $(this).css("background-color", "#ffFFFF");
    $(this).next(".validation_error").html("");
});

$(".form_send_mail").keyup(function () {
    $(this).css("background-color", "#ffFFFF");
    $(this).next(".validation_error").html("");
});

function get_selected_email_ids() {
    var selected_email_ids = [];
    $("#email_list tr").each(function() {
        //data.extras.push($(this).val());
        if (this.childNodes[0].childNodes[0].checked) {
            var email_id = +$(this).find(".only_id_email")[0].value;
            selected_email_ids.push(email_id);
        }
    });
    return selected_email_ids;
}

$("#delete_mail").click(function () {
    var email_ids = get_selected_email_ids();
    var auth_token = localStorage.getItem("auth_token");
    console.log(email_ids);
    $.ajax({
        type: "DELETE",
        url: "http://mail-backend.agafonov.me/api/v1/mail/delete_mails",
        data: JSON.stringify({
            ids: email_ids
        }),
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Bearer " + auth_token);
        },
        success: function (response) {
            console.log(response);
            for (var i=0; i<email_ids.length; i++){
                $("#id_email_" + email_ids[i]).remove();
            }
        }
    });
});


$("#login_submit").click(function (){
    var token_type = $("#remember_me").is(':checked');
    if (token_type){
        token_type = "PERMANENT";
    } else {
        token_type = "TEMPORARY";
    }
    var data = {
        email: $("#exit_e_mail").val(),
        password: $("#exit_passwords").val(),
        token_type: token_type
    };
    if (!correct_email(data.email)){
        error_input("email", "Введен некорректный e-mail");
        return;
    };
    var filled = true;
    for(var prop in data){
        if (data[prop] ===  ""){
            filled = false;
            error_input(prop, "Обязательное поле");
        }
    }
    if (!filled){
        return;
    }
    $.ajax({
        type: "POST",
        url: "http://mail-backend.agafonov.me/api/v1/auth/login",
        data: data,
        beforeSend: function() {
        },
        success: function (response) {
            console.log(response);
            localStorage.setItem("auth_token", response.response.token);
            $("#logo").click();
        },
        error:function (error_data, error) {
            console.log(error_data);
            console.log(error);
            if (!error_data.hasOwnProperty("responseJSON")){
                alert("Ошибка соединения");
                return;
            }
            switch (error_data.responseJSON.response_type) {
                case "ClientErrorResponse":
                    error_input(error_data.responseJSON.response.field, error_data.responseJSON.response.message);
                    //$("#autorization_error_" + error_data.responseJSON.response.field).html(error_data.responseJSON.response.message);
                    //$(".form_field_" + error_data.responseJSON.response.field).css("border-color", "#ffb2b5");
                    break;
                default:
                    alert("Ошибка соединения");
            }
        }

    });

});

function correct_email(email) {
    return /^\w+@\w*\.\w+$/g.test(email);
}

function error_input(field, error_text) {
    var form_field = $(".form_field_" + field);
    form_field.addClass("validation_error");
    form_field.next(".form_field_error").html(error_text);
}

function clear_input_error(e) {
    $(e).removeClass("validation_error");
    $(e).next(".form_field_error").html("");
}

$(".highlight_all_mail_flag_checkbox").click(function () {
    if ($(this).prev(".highlight_all_mail").prop("checked")){
        $(this).prev(".highlight_all_mail").prop("checked", false);
        $("[name=action_email]").prop("checked", false);
    } else {
        $(this).prev(".highlight_all_mail").prop("checked", true);
        $("[name=action_email]").prop("checked", true);
    }
});

show_error.error_id = 0;

function show_error(error, level) {
    level = level || "info";
    var error_id = ++show_error.error_id;
    $(".error_container").prepend("<div id=\"error_id_" + error_id +"\" class=\"error_item " + level + "_item_style\"><p>" +
        error +"</p><span onclick=\"close_error_item(this)\">+</span></div>");
    setTimeout(function () {
        $("#error_id_" + error_id).remove();
    }, 100000);
}

function close_error_item(e) {
    $(e.parentNode).remove();
}