var user, tok, baseModel;
const paramString = window.location.search;
const params = new URLSearchParams(paramString);

var serviceid, serviceInfo;
var companyid;
function oninit() {

    tok = params.get('tok');
    user = params.get('un');
    serviceid = params.get('serviceid');
    $.ajax({
        url: "http://127.0.0.1:5000/userInfo?userid=" + params.get('un') + "&tok=" + params.get('tok'),
        type: 'GET',
        success: function (response) {
            document.getElementById("userName").innerText = response[0].firstName + " " + response[0].lastName;
            getModelInfo(serviceid);
        },
        error: function () {

        }
    });
}

function getModelInfo(serviceId) {
    $.ajax({
        url: "http://127.0.0.1:5000/getMyCompaniesServices?userid=" + user + "&tok=" + tok,
        type: 'GET',
        success: function (response) {
            baseModel = response;
            fillCompanyList(serviceid);
        },
        error: function () {

        }
    });
}

function fillCompanyList() {
    var select = document.getElementById("compSelector");
    serviceInfo = jQuery.grep(baseModel.serviceList, function (ele) { return ele.idservices === parseInt(serviceid) });
    baseModel.companiesList.forEach(function (ele) {
        var option = document.createElement("option");
        option.value = ele.idcompany;
        option.text = ele.name;
        select.appendChild(option);
        document.getElementById("compSelector").value = serviceInfo[0].companyId;
    });
}

function updateCompany() {
    if (parseInt(document.getElementById("compSelector").value) === serviceInfo[0].companyId) {
        document.getElementById("alertText").style.color = "black";
        document.getElementById("alertText").innerText = "You have not made any changes";
        $('#alertPop').modal('show');
    } else {
        var companyChangeRequest = {
            "servId": serviceid,
            "compId": parseInt(document.getElementById("compSelector").value)
        }
        $.ajax({
            url: "http://127.0.0.1:5000/updateCompanyGroup?userid=" + user + "&tok=" + tok,
            type: "POST",
            contentType: 'application/json charset=utf-8',
            data: JSON.stringify(companyChangeRequest),
            success: function (response) {
                if (response === "success") {
                    document.getElementById("alertText").style.color = "Green";
                    document.getElementById("alertText").innerText = "Company grouping has been changed";
                    $('#alertPop').modal('show');
                    skipToService();
                } else {
                    document.getElementById("alertText").style.color = "red";
                    document.getElementById("alertText").innerText = "Please try again later";
                    $('#alertPop').modal('show');
                }
            },
            error: function (response) {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Server error. Please contact administrator";
                $('#alertPop').modal('show');
            }
        });
    }
}

function dashboardClick() {
    window.location = 'dashboard.html?tok=' + tok + '&un=' + user;
}

function profileClick() {

}

function companiesClick() {

}

function storesServicesClick() {

}

function reviewsEnquiriesClick() {

}

function advertismentClick() {

}

function abortRegister() {
    window.location = 'dashboard.html?tok=' + params.get('tok') + '&un=' + params.get('un');
}
function createCompany() {
    var companyPayload = {
        "cname": document.getElementById("cname").value,
        "ccity": document.getElementById("ccity").value,
        "cphone": document.getElementById("cphone").value,
        "cmobile": document.getElementById("cmobile").value,
        "cfname": document.getElementById("cfname").value,
        "clname": document.getElementById("clname").value,
        "company": "true"
    };
    $.ajax({
        url: 'http://127.0.0.1:5000/addCompany?userid=' + user + '&tok=' + tok,
        type: 'POST',
        data: JSON.stringify(companyPayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (companyid != 0) {
                companyid = response.companyId;
            }
        },
        error: function () {
            alert("error");
        }
    });
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-primary";
}
function skipToService() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-primary";
    document.getElementById("sname").value = serviceInfo[0].name;
    document.getElementById("sbuilding").value = serviceInfo[0].building;
    document.getElementById("sstreet").value = serviceInfo[0].street;
    document.getElementById("slandmark").value = serviceInfo[0].landmark;
    document.getElementById("sarea").value = serviceInfo[0].area;
    document.getElementById("spincode").value = serviceInfo[0].pincode;
    document.getElementById("sstate").value = serviceInfo[0].state;
    document.getElementById("scountry").value = serviceInfo[0].country;
}

function goBackToCompany() {
    document.getElementById("page1").style.display = "block";
    document.getElementById("page2").style.display = "none";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-primary";
    document.getElementById("two").classList = "btn btn-outline-secondary";
    fillCompanyList();
}

function continueToContact() {
    var servicePayload = {
        "servId": parseInt(serviceid),
        "sname": document.getElementById("sname").value,
        "sbuilding": document.getElementById("sbuilding").value,
        "sstreet": document.getElementById("sstreet").value,
        "slandmark": document.getElementById("slandmark").value,
        "sarea": document.getElementById("sarea").value,
        "spincode": document.getElementById("spincode").value,
        "sstate": document.getElementById("sstate").value,
        "scountry": document.getElementById("scountry").value
    };
    $.ajax({
        url: 'http://127.0.0.1:5000/updateServiceInfo?userid=' + user + '&tok=' + tok,
        type: 'POST',
        data: JSON.stringify(servicePayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response === "success") {
                document.getElementById("alertText").style.color = "Green";
                document.getElementById("alertText").innerText = "Sevice update successfull";
                $('#alertPop').modal('show');
                document.getElementById("page1").style.display = "none";
                document.getElementById("page2").style.display = "none";
                document.getElementById("page3").style.display = "block";
                document.getElementById("one").classList.value = "";
                document.getElementById("two").classList.value = "";
                document.getElementById("three").classList.value = "";
                document.getElementById("one").classList = "btn btn-outline-secondary";
                document.getElementById("two").classList = "btn btn-outline-secondary";
                document.getElementById("three").classList = "btn btn-primary";
                fillContactInfo();
            } else {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Failed to update! Please contact administrator";
                $('#alertPop').modal('show');
            }
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });

}

function fillContactInfo() {
    $.ajax({
        url: 'http://127.0.0.1:5000/getContactInfo?userid=' + user + '&tok=' + tok + "&conId=" + serviceInfo[0].contactid,
        type: "GET",
        success: function (response) {
            document.getElementById("conPerson").value = response[0].name;
            document.getElementById("conPhone").value = response[0].phone;
            document.getElementById("conMobile").value = response[0].cell;
            document.getElementById("conFax").value = response[0].fax;
            document.getElementById("conTollfree").value = response[0].tollfree;
            document.getElementById("conEmail").value = response[0].email;
            document.getElementById("conWebsite").value = response[0].website;
            document.getElementById("conFacebook").value = response[0].facebook;
            document.getElementById("conTwitter").value = response[0].twitter;
            document.getElementById("conInstagram").value = response[0].instagram;
            document.getElementById("conYoutube").value = response[0].youtube;
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });
}

function nextToSchedule() {

    var contactPayload = {
        "conId": serviceInfo[0].contactid,
        "conPerson": document.getElementById("conPerson").value,
        "conPhone": document.getElementById("conPhone").value,
        "conMobile": document.getElementById("conMobile").value,
        "conFax": document.getElementById("conFax").value,
        "conTollfree": document.getElementById("conTollfree").value,
        "conEmail": document.getElementById("conEmail").value,
        "conWebsite": document.getElementById("conWebsite").value,
        "conFacebook": document.getElementById("conFacebook").value,
        "conTwitter": document.getElementById("conTwitter").value,
        "conInstagram": document.getElementById("conInstagram").value,
        "conYoutube": document.getElementById("conYoutube").value
    };
    $.ajax({
        url: 'http://127.0.0.1:5000/updateServiceContact?userid=' + user + '&tok=' + tok,
        type: 'POST',
        data: JSON.stringify(contactPayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response === "success") {
                document.getElementById("alertText").style.color = "green";
                document.getElementById("alertText").innerText = "Contact Information updated successfully";
                $('#alertPop').modal('show');
                document.getElementById("page1").style.display = "none";
                document.getElementById("page2").style.display = "none";
                document.getElementById("page3").style.display = "none";
                document.getElementById("page4").style.display = "block";
                document.getElementById("one").classList.value = "";
                document.getElementById("two").classList.value = "";
                document.getElementById("three").classList.value = "";
                document.getElementById("four").classList.value = "";
                document.getElementById("one").classList = "btn btn-outline-secondary";
                document.getElementById("two").classList = "btn btn-outline-secondary";
                document.getElementById("three").classList = "btn btn-outline-secondary";
                document.getElementById("four").classList = "btn btn-primary";
                fillScheduleInfo();
            } else if (response === "Database Error") {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
                $('#alertPop').modal('show');
            }
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });

}

function fillScheduleInfo() {
    $.ajax({
        url: 'http://127.0.0.1:5000/getScheduleInfo?userid=' + user + '&tok=' + tok + "&schId=" + serviceInfo[0].scheduleid + "&pId=" + serviceInfo[0].paymentid,
        type: "GET",
        success: function (response) {
            document.getElementById("monBeg").value = response["schedule"][0].monStart;
            document.getElementById("monEnd").value = response["schedule"][0].monEnd;
            document.getElementById("tueBeg").value = response["schedule"][0].tueStart;
            document.getElementById("tueEnd").value = response["schedule"][0].tueEnd;
            document.getElementById("wedBeg").value = response["schedule"][0].wedStart;
            document.getElementById("wedEnd").value = response["schedule"][0].wedEnd;
            document.getElementById("thurBeg").value = response["schedule"][0].thurStart;
            document.getElementById("thurEnd").value = response["schedule"][0].thurEnd;
            document.getElementById("friBeg").value = response["schedule"][0].friStart;
            document.getElementById("friEnd").value = response["schedule"][0].friEnd;
            document.getElementById("satBeg").value = response["schedule"][0].satStart;
            document.getElementById("satEnd").value = response["schedule"][0].satEnd;
            document.getElementById("sunBeg").value = response["schedule"][0].sunStart;
            document.getElementById("sunEnd").value = response["schedule"][0].sunEnd;
            if (response["schedule"][0].monStart === "null" && response["schedule"][0].monEnd === "null") {
                document.getElementById("mon").checked = true
            }
            if (response["schedule"][0].tueStart === "null" && response["schedule"][0].tueEnd === "null") {
                document.getElementById("tue").checked = true
            }
            if (response["schedule"][0].wedStart === "null" && response["schedule"][0].wedEnd == "null") {
                document.getElementById("wed").checked = true
            }
            if (response["schedule"][0].thurStart === "null" && response["schedule"][0].thurEnd === "null") {
                document.getElementById("thur").checked = true
            }
            if (response["schedule"][0].friStart === "null" && response["schedule"][0].friEnd === "null") {
                document.getElementById("fri").checked = true
            }
            if (response["schedule"][0].satStart === "null" && response["schedule"][0].satEnd == "null") {
                document.getElementById("sat").checked = true
            }
            if (response["schedule"][0].sunStart === "null" && response["schedule"][0].sunEnd == "null") {
                document.getElementById("sun").checked = true
            }
            if (response["payment"][0].cash === "1")
                document.getElementById("cash").checked = true;
            else
                document.getElementById("cash").checked = false;
            if (response["payment"][0].onlinepayments === "1")
                document.getElementById("digi").checked = true;
            else
                document.getElementById("digi").checked = false;
            if (response["payment"][0].card === "1")
                document.getElementById("card").checked = true;
            else
                document.getElementById("card").checked = false;
        },
        error: function () {

        }
    });

}

function goBackToService() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("page3").style.display = "none";
    document.getElementById("page4").style.display = "none";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("three").classList.value = "";
    document.getElementById("four").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-primary";
    document.getElementById("three").classList = "btn btn-outline-secondary";
    document.getElementById("four").classList = "btn btn-outline-secondary";
}

function nextToKeywords() {
    var register = {};
    register['schid'] = serviceInfo[0].scheduleid;
    register['pid'] = serviceInfo[0].paymentid;
    if (!document.getElementById("mon").checked) {
        register['monBeg'] = document.getElementById("monBeg").value;
        register['monEnd'] = document.getElementById("monEnd").value;
    } else {
        register['monBeg'] = "null";
        register['monEnd'] = "null";
    }
    if (!document.getElementById("tue").checked) {
        register['tueBeg'] = document.getElementById("tueBeg").value;
        register['tueEnd'] = document.getElementById("tueEnd").value;
    } else {
        register['tueBeg'] = "null";
        register['tueEnd'] = "null";
    }
    if (!document.getElementById("wed").checked) {
        register['wedBeg'] = document.getElementById("wedBeg").value;
        register['wedEnd'] = document.getElementById("wedEnd").value;
    } else {
        register['wedBeg'] = "null";
        register['wedEnd'] = "null";
    }
    if (!document.getElementById("thur").checked) {
        register['thurBeg'] = document.getElementById("thurBeg").value;
        register['thurEnd'] = document.getElementById("thurEnd").value;
    } else {
        register['thurBeg'] = "null";
        register['thurEnd'] = "null";
    }
    if (!document.getElementById("fri").checked) {
        register['friBeg'] = document.getElementById("friBeg").value;
        register['friEnd'] = document.getElementById("friEnd").value;
    } else {
        register['friBeg'] = "null";
        register['friEnd'] = "null";
    }
    if (!document.getElementById("sat").checked) {
        register['satBeg'] = document.getElementById("satBeg").value;
        register['satEnd'] = document.getElementById("satEnd").value;
    } else {
        register['satBeg'] = "null";
        register['satEnd'] = "null";
    }
    if (!document.getElementById("sun").checked) {
        register['sunBeg'] = document.getElementById("sunBeg").value;
        register['sunEnd'] = document.getElementById("sunEnd").value;
    } else {
        register['sunBeg'] = "null";
        register['sunEnd'] = "null"
    }
    register['cash'] = document.getElementById("cash").checked;
    register['digi'] = document.getElementById("digi").checked;
    register['card'] = document.getElementById("card").checked;

    $.ajax({
        url: 'http://127.0.0.1:5000/updateServiceSchedule?userid=' + user + '&tok=' + tok,
        type: 'POST',
        data: JSON.stringify(register),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response === "success") {
                document.getElementById("alertText").style.color = "green";
                document.getElementById("alertText").innerText = "Schedule updated successfully";
                $('#alertPop').modal('show');
                document.getElementById("page1").style.display = "none";
                document.getElementById("page2").style.display = "none";
                document.getElementById("page3").style.display = "none";
                document.getElementById("page4").style.display = "none";
                document.getElementById("page5").style.display = "block";
                document.getElementById("one").classList.value = "";
                document.getElementById("two").classList.value = "";
                document.getElementById("three").classList.value = "";
                document.getElementById("four").classList.value = "";
                document.getElementById("five").classList.value = "";
                document.getElementById("one").classList = "btn btn-outline-secondary";
                document.getElementById("two").classList = "btn btn-outline-secondary";
                document.getElementById("three").classList = "btn btn-outline-secondary";
                document.getElementById("four").classList = "btn btn-outline-secondary";
                document.getElementById("five").classList = "btn btn-primary";
                fillKeywords();
            } else {
                document.getElementById("alertText").style.color = "red";
                document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
                $('#alertPop').modal('show');
            }
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });
}

function fillKeywords() {
    $.ajax({
        url: 'http://127.0.0.1:5000/getKeywords?userid=' + user + '&tok=' + tok + "&kId=" + serviceInfo[0].keywordsid,
        type: "GET",
        success: function (response) {
            document.getElementById("keywordsArea").value = response[0].keywordstext;
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });
}

function backToSocial() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
    document.getElementById("page4").style.display = "none";
    document.getElementById("page5").style.display = "none";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("three").classList.value = "";
    document.getElementById("four").classList.value = "";
    document.getElementById("five").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-outline-secondary";
    document.getElementById("three").classList = "btn btn-primary";
    document.getElementById("four").classList = "btn btn-outline-secondary";
    document.getElementById("five").classList = "btn btn-outline-secondary";
}

function holidayCheckEvent(oEvent) {
    var day = oEvent.id;
    var checked = oEvent.checked;
    if (checked) {
        switch (day) {
            case "mon":
                document.getElementById("monBeg").disabled = true;
                document.getElementById("monEnd").disabled = true;
                break;
            case "tue":
                document.getElementById("tueBeg").disabled = true;
                document.getElementById("tueEnd").disabled = true;
                break;
            case "wed":
                document.getElementById("wedBeg").disabled = true;
                document.getElementById("wedEnd").disabled = true;
                break;
            case "thur":
                document.getElementById("thurBeg").disabled = true;
                document.getElementById("thurEnd").disabled = true;
                break;
            case "fri":
                document.getElementById("friBeg").disabled = true;
                document.getElementById("friEnd").disabled = true;
                break;
            case "sat":
                document.getElementById("satBeg").disabled = true;
                document.getElementById("satEnd").disabled = true;
                break;
            case "sun":
                document.getElementById("sunBeg").disabled = true;
                document.getElementById("sunEnd").disabled = true;
                break;
        }
    } else {
        switch (day) {
            case "mon":
                document.getElementById("monBeg").disabled = false;
                document.getElementById("monEnd").disabled = false;
                break;
            case "tue":
                document.getElementById("tueBeg").disabled = false;
                document.getElementById("tueEnd").disabled = false;
                break;
            case "wed":
                document.getElementById("wedBeg").disabled = false;
                document.getElementById("wedEnd").disabled = false;
                break;
            case "thur":
                document.getElementById("thurBeg").disabled = false;
                document.getElementById("thurEnd").disabled = false;
                break;
            case "fri":
                document.getElementById("friBeg").disabled = false;
                document.getElementById("friEnd").disabled = false;
                break;
            case "sat":
                document.getElementById("satBeg").disabled = false;
                document.getElementById("satEnd").disabled = false;
                break;
            case "sun":
                document.getElementById("sunBeg").disabled = false;
                document.getElementById("sunEnd").disabled = false;
                break;
        }
    }
}

function backToSchedule() {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "none";
    document.getElementById("page4").style.display = "block";
    document.getElementById("page5").style.display = "none";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("three").classList.value = "";
    document.getElementById("four").classList.value = "";
    document.getElementById("five").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-outline-secondary";
    document.getElementById("three").classList = "btn btn-outline-secondary";
    document.getElementById("four").classList = "btn btn-primary";
    document.getElementById("five").classList = "btn btn-outline-secondary";
}
function submitReistration() {
    var keywords = { "keywordid": serviceInfo[0].keywordsid, "keywords": document.getElementById("keywordsArea").value }
    $.ajax({
        url: 'http://127.0.0.1:5000/updateKeywords?userid=' + user + '&tok=' + tok,
        type: 'POST',
        data: JSON.stringify(keywords),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            document.getElementById("alertText").style.color = "green";
            document.getElementById("alertText").innerText = "Great! you are all set";
            $('#alertPop').modal('show');
        },
        error: function () {
            document.getElementById("alertText").style.color = "red";
            document.getElementById("alertText").innerText = "Server Error! Please contact administrator";
            $('#alertPop').modal('show');
        }
    });
}

