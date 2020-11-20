var user, tok, role, baseModel, userinfo, proEdit = false, companyEdit = false;
function oninit() {
    const paramString = window.location.search;
    const params = new URLSearchParams(paramString);
    tok = params.get('tok');
    user = params.get('un');
    role = params.get('role');
    $.ajax({
        url: "http://127.0.0.1:5000/userInfo?userid=" + params.get('un') + "&tok=" + params.get('tok'),
        type: 'GET',
        success: function (response) {
            userinfo = response[0];
            document.getElementById("userName").innerText = response[0].firstName + " " + response[0].lastName;
            getAllServices();
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Logon Services failed. Server Error!";
            $('#alertPop').modal('show');
        }
    });
}

function getAllServices() {
    $.ajax({
        url: "http://127.0.0.1:5000/getCompaniesForApproval?userid=" + user + "&tok=" + tok + "&role=" + role,
        type: "GET",
        success: function (response) {
            if (response === "false") {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "You are not an approver";
                $('#alertPop').modal('show');
            } else {
                services = response;
                document.getElementById("servicesCount").innerText = services.length;
                // $.fn.generateServicesCard(services);
            }
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Get Services failed. Server Error!";
            $('#alertPop').modal('show');
        }
    });
}

function profileSettingsClick() {
    document.getElementById("servicesPage").style.display = "none";
    document.getElementById("overviewContainer").style.display = "none";
    document.getElementById("companiesPage").style.display = "none";
    document.getElementById("profileSettingsPage").style.display = "block";
    navValidation("profileListItem");
    document.getElementById("level1").innerText = " / Profile /"
    document.getElementById("level2").innerText = " Settings /";
    var createCompanyButton = document.createElement("BUTTON");
    createCompanyButton.type = "button";
    createCompanyButton.classList.add('btn', 'btn-primary', 'mt-2', 'mt-xl-0');
    createCompanyButton.addEventListener('click', editProfile.bind(this), true)
    createCompanyButton.innerText = "Edit Profile";
    createCompanyButton.id = "editProButton";
    document.getElementById("headerButtons").innerHTML = "";
    document.getElementById("headerButtons").appendChild(createCompanyButton);
    document.getElementById("editphone").value = userinfo.phone;
    document.getElementById("editlname").value = userinfo.lastName;
    document.getElementById("editfname").value = userinfo.firstName;
    document.getElementById("editemail").value = userinfo.email;
}

function navValidation(itemId) {
    if (document.getElementById("adListItem").classList.contains("active")) {
        document.getElementById("adListItem").classList.remove("active");
    } else if (document.getElementById("dashboardListItem").classList.contains("active")) {
        document.getElementById("dashboardListItem").classList.remove("active");
    } else if (document.getElementById("profileListItem").classList.contains("active")) {
        document.getElementById("profileListItem").classList.remove("active");
    } else if (document.getElementById("companiesListItem").classList.contains("active")) {
        document.getElementById("companiesPage").innerHTML = "";
        document.getElementById("companiesListItem").classList.remove("active");
    } else if (document.getElementById("servicesListItem").classList.contains("active")) {
        document.getElementById("servicesPage").innerHTML = "";
        document.getElementById("servicesListItem").classList.remove("active");
    } else if (document.getElementById("reviewsListItem").classList.contains("active")) {
        document.getElementById("reviewsListItem").classList.remove("active");
    }
    document.getElementById(itemId).classList.add("active");
}

function editProfile() {
    if (proEdit === false) {
        document.getElementById("editphone").disabled = false;
        document.getElementById("editlname").disabled = false;
        document.getElementById("editfname").disabled = false;
        document.getElementById("editProButton").innerText = "Cancel Edit";
        proEdit = true;
    } else if (proEdit === true) {
        document.getElementById("editphone").disabled = true;
        document.getElementById("editlname").disabled = true;
        document.getElementById("editfname").disabled = true;
        document.getElementById("editProButton").innerText = "Edit Profile";
        proEdit = false;
    }
}

function onChangePassword() {
    if ((document.getElementById("newPass1").value === document.getElementById("newPass2").value) && document.getElementById("curPass").value.length > 7) {
        $.ajax({
            url: 'http://127.0.0.1:5000/changePass?userid=' + user + '&tok=' + tok,
            type: 'POST',
            data: JSON.stringify({
                'curPass': document.getElementById("curPass").value,
                'newPass': document.getElementById("newPass1").value
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response === "success") {
                    document.getElementById("passwordErrorText").style.color = "green";
                    document.getElementById("passwordErrorText").innerText = "Passwords changed successfully";
                    $('#changePass').modal('hide');
                    document.getElementById("alertText").style.color = "green";
                    document.getElementById("alertText").innerText = "Passwords changed successfully";
                    $('#alertPop').modal('show');
                } else if (response === "invalid") {
                    document.getElementById("passwordErrorText").innerText = "Current Password was incorrect";
                }
            },
            error: function () {
                $('#changePass').modal('hide');
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Request Failed. Please try again later";
                $('#alertPop').modal('show');
            }
        });
    } else {
        if (document.getElementById("newPass1").value !== document.getElementById("newPass2").value) {
            document.getElementById("passwordErrorText").innerText = "Passwords don't match";
        } else if (document.getElementById("curPass").value.length < 8) {
            document.getElementById("passwordErrorText").innerText = "Invalid current password";
        }
        return;
    }
}

function dashboardClick() {
    window.location = 'dashboardAdmin.html?tok=' + tok + '&un=' + user + "&role=" + role;
}

function editProfile() {
    if (proEdit === false) {
        document.getElementById("editphone").disabled = false;
        document.getElementById("editlname").disabled = false;
        document.getElementById("editfname").disabled = false;
        document.getElementById("editProButton").innerText = "Cancel Edit";
        proEdit = true;
    } else if (proEdit === true) {
        document.getElementById("editphone").disabled = true;
        document.getElementById("editlname").disabled = true;
        document.getElementById("editfname").disabled = true;
        document.getElementById("editProButton").innerText = "Edit Profile";
        proEdit = false;
    }
}

function onEditProfileSubmit() {
    var phone = document.getElementById("editphone").value;
    var fname = document.getElementById("editfname").value;
    var lname = document.getElementById("editlname").value;
    if (userinfo.phone !== phone) {
        alert("You can't change it now!");
    } else if ((userinfo.firstName !== fname) || (userinfo.lastName !== lname)) {
        payload = { "fname": fname, "lname": lname, "phone": userinfo.phone };
        $.ajax({
            url: 'http://127.0.0.1:5000/editUserInfo?userid=' + user + '&tok=' + tok,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response === "success") {
                    alert("Updated Successfully");
                    dashboardClick();
                }
            },
            error: function () {
                alert("Please try again later");
            }
        });
    } else {
        alert("No changes were made!");
    }
}

function storesServicesClick() {
    document.getElementById("servicesPage").style.display = "block";
    document.getElementById("profileSettingsPage").style.display = "none";
    document.getElementById("overviewContainer").style.display = "none";
    document.getElementById("companiesPage").style.display = "none";
    navValidation("servicesListItem");
    document.getElementById("level1").innerText = " / Services & Stores /"
    document.getElementById("level2").innerText = "";
    // var createCompanyButton = document.createElement("BUTTON");
    // createCompanyButton.type = "button";
    // createCompanyButton.classList.add('btn', 'btn-primary', 'mt-2', 'mt-xl-0');
    // // createCompanyButton.addEventListener('click', registerService.bind(this), true)
    // createCompanyButton.innerText = "Create Service";
    document.getElementById("headerButtons").innerHTML = "";
    // document.getElementById("headerButtons").appendChild(createCompanyButton);
    if (services.length === 0) {
        document.getElementById("proBanner").style.display = "block";
    } else {
        services.forEach(function (item) {
            document.getElementById("servicesPage").appendChild(generateServiceCards(item));
        });
    }
}

function generateServiceCards(item) {
    var parent1 = document.createElement("div");
    parent1.classList.add('col-lg-3', 'grid-margin', 'stretch-card');
    parent1.id = "a" + item.idservices;
    parent1.style.cursor = "pointer";
    parent1.addEventListener('click', viewService.bind(this), true);
    var parent2 = document.createElement("div");
    parent2.classList.add('card');
    parent2.id = "b" + item.idservices
    var parent3 = document.createElement("div");
    parent3.classList.add('card-body');
    parent3.id = "c" + item.idservices
    var parent4 = document.createElement("div");
    parent4.id = "d" + item.idservices
    parent4.classList.add('d-flex', 'py-3', 'border-md-right', 'flex-grow-1', 'align-items-center', 'justify-content-center', 'p-3', 'item');
    var iconElement = document.createElement("i");
    iconElement.classList.add('mdi', 'mdi-houzz', 'mr-3', 'icon-lg', 'text-danger');
    iconElement.id = "e" + item.idservices
    var parent5 = document.createElement("div");
    parent5.id = "f" + item.idservices
    parent5.classList.add('d-flex', 'flex-column', 'justify-content-around');
    var head4 = document.createElement("h4");
    head4.id = "g" + item.idservices
    head4.style.fontWeight = "600";
    head4.innerHTML = item.name;
    var head5 = document.createElement("h5");
    head5.id = "h" + item.idservices
    head5.classList.add('mr-2', 'mb-0');
    head5.innerHTML = (item.area !== "") ? item.area : item.pincode;
    parent5.appendChild(head4);
    parent5.appendChild(head5);
    parent4.appendChild(iconElement);
    parent4.appendChild(parent5);
    parent3.appendChild(parent4);
    parent2.appendChild(parent3);
    parent1.appendChild(parent2);
    return parent1;
}

function viewService(oEvent) {

    if (parseInt(oEvent.srcElement.id.substr(1))) {
        window.location = 'registerServiceReview.html?tok=' + tok + '&un=' + user + "&role=" + role + "&service=" + parseInt(oEvent.srcElement.id.substr(1));
    } else {
        document.getElementById("alertText").style.color = "red";
        document.getElementById("alertText").innerText = "Invalid navigation request";
        $('#alertPop').modal('show');
    }
    
}