var user, tok, baseModel, userinfo, proEdit = false, companyEdit = false;
function oninit() {
    const paramString = window.location.search;
    const params = new URLSearchParams(paramString);
    tok = params.get('tok');
    user = params.get('un');
    $.ajax({
        url: "http://127.0.0.1:5000/userInfo?userid=" + params.get('un') + "&tok=" + params.get('tok'),
        type: 'GET',
        success: function (response) {
            userinfo = response[0];
            document.getElementById("userName").innerText = response[0].firstName + " " + response[0].lastName;
            getAllCompanies();
            // getAllServices();
        },
        error: function () {

        }
    });
}
function getAllCompanies() {
    $.ajax({
        url: "http://127.0.0.1:5000/getMyCompaniesServices?userid=" + user + "&tok=" + tok,
        type: 'GET',
        success: function (response) {
            baseModel = response;
            document.getElementById("companiesCount").innerText = response.companyCount;
            document.getElementById("servicesCount").innerText = response.serviceCount;
            if (response.serviceCount !== 0) {
                document.getElementById("bannerClose").click();
            }
        },
        error: function () {

        }
    });
}
function registerService() {
    window.location = 'registerService.html?tok=' + tok + '&un=' + user;
}

function dashboardClick() {
    window.location = 'dashboard.html?tok=' + tok + '&un=' + user;

}

function profileClick() {

}

function companiesClick() {
    document.getElementById("overviewContainer").style.display = "none";
    document.getElementById("companiesPage").style.display = "block";
    document.getElementById("profileSettingsPage").style.display = "none";
    document.getElementById("servicesPage").style.display = "none";
    navValidation("companiesListItem");
    document.getElementById("level1").innerText = " / Companies /"
    document.getElementById("level2").innerText = "";
    var createCompanyButton = document.createElement("BUTTON");
    createCompanyButton.type = "button";
    createCompanyButton.classList.add('btn', 'btn-primary', 'mt-2', 'mt-xl-0');
    createCompanyButton.addEventListener('click', registerService.bind(this), true)
    createCompanyButton.innerText = "Create Company";
    document.getElementById("headerButtons").innerHTML = "";
    document.getElementById("headerButtons").appendChild(createCompanyButton);
    if (baseModel.companyCount === 0) {
        document.getElementById("proBanner").style.display = "block";
    } else {
        baseModel.companiesList.forEach(function (item) {
            document.getElementById("companiesPage").appendChild(generateCompanyCards(item));
        });
    }
}

function viewCompany(oEvent) {
    var compId = oEvent.srcElement.id.substr(1);
    document.getElementById("companiesPage").innerHTML = "";
    document.getElementById("level2").innerText = " Manage Company";
    document.getElementById("companiesPage").innerHTML = '<div class="col-12 grid-margin stretch-card">' +
        '<div class="card">' +
        '<div class="card-body">' +
        '<h4 class="card-title">Edit Company Details</h4>' +
        '<form class="forms-sample">' +
        '<div class="form-group">' +
        ' <label for="exampleInputName1">Company Name</label>' +
        '<input type="text" class="form-control" id="editCName" placeholder="Company Name" disabled>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="exampleInputName1">City</label>' +
        '<input type="text" class="form-control" id="editCCity" placeholder="City" disabled>' +
        '</div>' +
        '<input id="companyId" style="display:none;"/>' +
        '<div class="form-group">' +
        '<label for="exampleInputName1">Mobile</label>' +
        '<input type="text" class="form-control" id="editCMobile" placeholder="Mobile Number" disabled>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="exampleInputName1">Phone</label>' +
        '<input type="text" class="form-control" id="editCPhone" placeholder="Phone Number" disabled>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="exampleInputName1">First Name</label>' +
        '<input type="text" class="form-control" id="editCFname" placeholder="First Name" disabled>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="exampleInputName1">Last Name</label>' +
        '<input type="text" class="form-control" id="editCLname" placeholder="Last Name" disabled>' +
        '</div>' +
        '<button type="button" onclick="onEditCompanySubmit()" class="btn btn-primary mr-2">Submit</button>' +
        '</form>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="modal fade" id="alertPopComp" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h3>Alert!</h3>' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<h4 id="alertText"></h4>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-light" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    var selected = jQuery.grep(baseModel.companiesList, function (a) { return a.idcompany === parseInt(compId) })
    document.getElementById("companyId").value = compId;
    document.getElementById("editCLname").value = selected[0].lastName;
    document.getElementById("editCFname").value = selected[0].firstName;
    document.getElementById("editCPhone").value = selected[0].phone;
    document.getElementById("editCName").value = selected[0].name;
    document.getElementById("editCMobile").value = selected[0].mobile;
    document.getElementById("editCCity").value = selected[0].city;
    var editCompanyButton = document.createElement("BUTTON");
    editCompanyButton.type = "button";
    editCompanyButton.classList.add('btn', 'btn-primary', 'mt-2', 'mt-xl-0');
    editCompanyButton.addEventListener('click', editCompany.bind(this), true)
    editCompanyButton.innerText = "Edit Company";
    editCompanyButton.id = "editCompanyButton";
    document.getElementById("headerButtons").innerHTML = "";
    document.getElementById("headerButtons").appendChild(editCompanyButton);
}

function onEditCompanySubmit() {
    var editCompPayload = {
        "compId": document.getElementById("companyId").value,
        "compLName": document.getElementById("editCLname").value,
        "compFName": document.getElementById("editCFname").value,
        "compPhone": document.getElementById("editCPhone").value,
        "compName": document.getElementById("editCName").value,
        "compMob": document.getElementById("editCMobile").value,
        "compCity": document.getElementById("editCCity").value
    };
    $.ajax({
        url: "http://127.0.0.1:5000/updateCompany?userid=" + user + "&tok=" + tok,
        type: "POST",
        data: JSON.stringify(editCompPayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response === "success") {
                document.getElementById("alertText").style.color = "green";
                document.getElementById("alertText").innerText = "Company Details changed successfully";
                $('#alertPopComp').modal('show');
            } else {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Request Failed. Please try again later";
                $('#alertPopComp').modal('show');
            }
        },
        error: function (response) {

        }
    });
}

function editCompany() {
    if (companyEdit === false) {
        document.getElementById("editCLname").disabled = false;
        document.getElementById("editCFname").disabled = false;
        document.getElementById("editCPhone").disabled = false;
        document.getElementById("editCName").disabled = false;
        document.getElementById("editCMobile").disabled = false;
        document.getElementById("editCCity").disabled = false;
        document.getElementById("editCompanyButton").innerText = "Cancel Edit";
        companyEdit = true;
    } else if (companyEdit === true) {
        document.getElementById("editCLname").disabled = true;
        document.getElementById("editCFname").disabled = true;
        document.getElementById("editCPhone").disabled = true;
        document.getElementById("editCName").disabled = true;
        document.getElementById("editCMobile").disabled = true;
        document.getElementById("editCCity").disabled = true;
        document.getElementById("editCompanyButton").innerText = "Edit Company";
        companyEdit = false;
    }
}

function viewService(oEvent) {
    alert(parseInt(oEvent.srcElement.id.substr(1)));
    window.location.href = 'editService.html?tok=' + tok + '&un='+ user + '&serviceid='+oEvent.srcElement.id.substr(1);
    document.getElementById("servicesPage").innerHTML = "";
    document.getElementById("level2").innerText = " Manager Service";
}

function generateCompanyCards(item) {
    var parent1 = document.createElement("div");
    parent1.classList.add('col-lg-3', 'grid-margin', 'stretch-card');
    parent1.id = "a" + item.idcompany;
    parent1.style.cursor = "pointer";
    parent1.addEventListener('click', viewCompany.bind(this), true);
    var parent2 = document.createElement("div");
    parent2.classList.add('card');
    parent2.id = "b" + item.idcompany
    var parent3 = document.createElement("div");
    parent3.classList.add('card-body');
    parent3.id = "c" + item.idcompany
    var parent4 = document.createElement("div");
    parent4.id = "d" + item.idcompany
    parent4.classList.add('d-flex', 'py-3', 'border-md-right', 'flex-grow-1', 'align-items-center', 'justify-content-center', 'p-3', 'item');
    var iconElement = document.createElement("i");
    iconElement.classList.add('mdi', 'mdi-houzz', 'mr-3', 'icon-lg', 'text-danger');
    iconElement.id = "e" + item.idcompany
    var parent5 = document.createElement("div");
    parent5.id = "f" + item.idcompany
    parent5.classList.add('d-flex', 'flex-column', 'justify-content-around');
    var head4 = document.createElement("h4");
    head4.id = "g" + item.idcompany
    head4.style.fontWeight = "600";
    head4.innerHTML = item.name;
    var head5 = document.createElement("h5");
    head5.id = "h" + item.idcompany
    head5.classList.add('mr-2', 'mb-0');
    head5.innerHTML = item.city;
    parent5.appendChild(head4);
    parent5.appendChild(head5);
    parent4.appendChild(iconElement);
    parent4.appendChild(parent5);
    parent3.appendChild(parent4);
    parent2.appendChild(parent3);
    parent1.appendChild(parent2);
    return parent1;
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

function storesServicesClick() {
    document.getElementById("servicesPage").style.display = "block";
    document.getElementById("profileSettingsPage").style.display = "none";
    document.getElementById("overviewContainer").style.display = "none";
    document.getElementById("companiesPage").style.display = "none";
    navValidation("servicesListItem");
    document.getElementById("level1").innerText = " / Services & Stores /"
    document.getElementById("level2").innerText = "";
    var createCompanyButton = document.createElement("BUTTON");
    createCompanyButton.type = "button";
    createCompanyButton.classList.add('btn', 'btn-primary', 'mt-2', 'mt-xl-0');
    createCompanyButton.addEventListener('click', registerService.bind(this), true)
    createCompanyButton.innerText = "Create Service";
    document.getElementById("headerButtons").innerHTML = "";
    document.getElementById("headerButtons").appendChild(createCompanyButton);
    if (baseModel.serviceCount === 0) {
        document.getElementById("proBanner").style.display = "block";
    } else {
        baseModel.serviceList.forEach(function (item) {
            document.getElementById("servicesPage").appendChild(generateServiceCards(item));
        });
    }
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

function reviewsEnquiriesClick() {

}

function advertismentClick() {

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

function validatePass(oEvent) {
    if (oEvent.value.length < 8) {
        document.getElementById("passwordErrorText").innerText = "Passwords must atlease contain 8 characters";
    } else {
        document.getElementById("passwordErrorText").innerText = "";
    }
}

function validateConfirmPass(oEvent) {
    pass1 = document.getElementById("newPass1").value;
    if (oEvent.value === pass1) {
        document.getElementById("passwordErrorText").innerText = "";
    } else {
        document.getElementById("passwordErrorText").innerText = "Passwords don't match";
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