$('.regField').on('keyup', function (e) {
    var element = this.id;
    switch (element) {
        case "adufname":
            break;
        case "adulname":
            break;
        case "aduemail":
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (regex.test(this.value)) {
                $('#errorText').css("color", "green");
                $('#errorText').text("");
            } else {
                $('#errorText').css("color", "red");
                $('#errorText').text("Invalid email");
            }
            break;
        case "aduphone":
            if (!parseInt(this.value)) {
                $('#errorText').css("color", "red");
                $('#errorText').text("Invalid mobile number");
            } else {
                $('#errorText').css("color", "green");
                $('#errorText').text("");
            }
            break;
        case "adupass1":
            if (this.value.length < 8) {
                $('#errorText').css("color", "red");
                $('#errorText').text("Password length is atleast 8 characters");
            } else {
                $('#errorText').css("color", "green");
                $('#errorText').text("");
            }
            break;
        case "adupass2":
            if (document.getElementById("adupass1").value === this.value) {
                $('#errorText').css("color", "green");
                $('#errorText').text("");
            } else {
                $('#errorText').css("color", "red");
                $('#errorText').text("Passwords don't match");
            }
            break;
    }
});

$('#adusignup').on('click', function (e) {
    var payload = {};
    if ($.fn.validateInputs()) {
        payload['userid'] = $('#aduemail').val();
        payload['fname'] = $('#adufname').val();
        payload['lname'] = $('#adulname').val();
        payload['password'] = $('#adupass1').val();
        payload['phone'] = $('#aduphone').val();
        payload['initial'] = "false";
        payload['role'] = $('#adurole option:selected').val();
        payload['key'] = $('#adukey').val();
        $.ajax({
            url: 'http://127.0.0.1:5000/newAdminUser',
            type: "POST",
            contentType: 'application/json, charset=utf-8',
            data: JSON.stringify(payload),
            success: function (response) {
                if (response === "User added successfully") {
                    document.getElementById("alertText").style.color = "green";
                    document.getElementById("alertText").innerText = "User added successfully";
                    $('#alertPop').modal('show');
                } else if (response === "Incorrect Key") {
                    document.getElementById("alertText").style.color = "red";
                    document.getElementById("alertText").innerText = "Please enter the correct key";
                    $('#alertPop').modal('show');
                }
            },
            error: function () {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Server error! Try again later";
                $('#alertPop').modal('show');
            }
        });
    } else {
        document.getElementById("alertText").style.color = "red";
        document.getElementById("alertText").innerText = "Please check the field entries and try again";
        $('#alertPop').modal('show');
    }
});

$.fn.validateInputs = function () {
    var validation = true;
    if ($('#adufname').val() === "") {
        $('#adufname').css("border-color", "red");
        validation = false;
    } else {
        $('#adufname').css("border-color", "#686868");
    }

    if ($('#adulname').val() === "") {
        $('#adulname').css("border-color", "red");
        validation = false;
    } else {
        $('#adulname').css("border-color", "#686868");
    }

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ($('#aduemail').val() === "" || !regex.test($('#aduemail').val())) {
        $('#aduemail').css("border-color", "red");
        validation = false;
    } else {
        $('#aduemail').css("border-color", "#686868");
    }

    if (!parseInt($('#aduphone').val()) || ($('#aduphone').val().length < 10)) {
        $('#aduphone').css("border-color", "red");
        validation = false;
    } else {
        $('#aduphone').css("border-color", "#686868");
    }

    if ($('#adupass1').val() !== $('#adupass2').val() || $('#adupass1').val().length < 8) {
        $('#adupass1').css("border-color", "red");
        $('#adupass2').css("border-color", "red");
        validation = false;
    } else {
        $('#adupass2').css("border-color", "#686868");
        $('#adupass1').css("border-color", "#686868");
    }

    if ($('#adukey').val() === "") {
        $('#adukey').css("border-color", "red");
        validation = false;
    } else {
        $('#adufname').css("border-color", "#686868");
    }

    return validation;

}

$('#adulogin').on('click', function (oEvent) {
    var payload = {};
    payload['userid'] = $('#aduid').val();
    payload['password'] = $('#adupass').val();
    if ($('aduid').val() === "" || $('adupass').val() === "") {
        document.getElementById("alertText").style.color = "red";
        document.getElementById("alertText").innerText = "Invalid username or password";
        $('#alertPop').modal('show');
    } else {
        $.ajax({
            url: 'http://127.0.0.1:5000/authenticate',
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response["role"] === "AD") {
                    window.location = 'dashboardAdmin.html?tok=' + response["key"] + '&un=' + $('#aduid').val() + '&role=' + response["role"];
                } else if (response["role"] === "DE") {
                    window.location = 'registerServiceAdmin.html?tok=' + response["key"] + '&un=' + $('#aduid').val() + '&role=' + response["role"];
                } else if (response["role"] === "AP") {
                    window.location = 'dashboardAdmin.html?tok=' + response["key"] + '&un=' + $('#aduid').val() + '&role=' + response["role"];
                } else if (response["role"] === "user") {
                    window.location = 'dashboard.html?tok=' + response["key"] + '&un=' + $('#aduid').val();
                }
            },
            error: function () {
                var response = JSON.parse(this.responseText);
                if (response === "InvalidUser") {
                    document.getElementById("alertText").style.color = "red";
                    document.getElementById("alertText").innerText = "Invalid username";
                    $('#alertPop').modal('show');
                } else if (response === "AuthenticationFailed") {
                    document.getElementById("alertText").style.color = "red";
                    document.getElementById("alertText").innerText = "Invalid username or password";
                    $('#alertPop').modal('show');
                } else if (response === "False") {
                    document.getElementById("alertText").style.color = "red";
                    document.getElementById("alertText").innerText = "Server Error!";
                    $('#alertPop').modal('show');
                }
            }
        });
    }
});