var user, tok, role;
var baseModel = {};
const paramString = window.location.search;
const params = new URLSearchParams(paramString);

var serviceid;
var companyid;
function oninit() {

    tok = params.get('tok');
    user = params.get('un');
    serviceid = params.get('service');
    role = params.get('role');
    $.ajax({
        url: "http://127.0.0.1:5000/userInfo?userid=" + params.get('un') + "&tok=" + params.get('tok'),
        type: 'GET',
        success: function (response) {
            document.getElementById("userName").innerText = response[0].firstName + " " + response[0].lastName;
            getServiceInfo();
        },
        error: function () {

        }
    });
}

function getServiceInfo() {
    $.ajax({
        url: 'http://127.0.0.1:5000/getServiceInfo?userid=' + user + '&tok=' + tok + '&role=' + role + "&sid=" + serviceid,
        type: "GET",
        success: function (response) {
            baseModel = response;
            if (baseModel["company"].length === 0) {
                removeCompanyTab();
            } else {
                companyid = baseModel["company"][0].idcompany;
                fillCompany();
            }
        },
        error: function () {
            return false;
        }
    });
}
function removeCompanyTab() {
    document.getElementById("one").style.display = "none";
    skipToService();
    fillService();
}

function fillCompany() {
    document.getElementById("cname").value = baseModel["company"][0].name;
    document.getElementById("ccity").value = baseModel["company"][0].city;
    document.getElementById("cphone").value = baseModel["company"][0].phone;
    document.getElementById("cmobile").value = baseModel["company"][0].mobile;
    document.getElementById("cfname").value = baseModel["company"][0].firstName;
    document.getElementById("clname").value = baseModel["company"][0].lastName;
}

function fillService() {
    document.getElementById("sname").value = baseModel["service"][0].name;
    document.getElementById("sbuilding").value = baseModel["service"][0].building;
    document.getElementById("sstreet").value = baseModel["service"][0].street;
    document.getElementById("slandmark").value = baseModel["service"][0].landmark;
    document.getElementById("sarea").value = baseModel["service"][0].area;
    document.getElementById("spincode").value = baseModel["service"][0].pincode;
    document.getElementById("sstate").value = baseModel["service"][0].state;
    document.getElementById("scountry").value = baseModel["service"][0].country;
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

function skipToService() {
    companyid = 0;
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-primary";
    fillService();
}

function goBackToCompany() {
    document.getElementById("page1").style.display = "block";
    document.getElementById("page2").style.display = "none";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-primary";
    document.getElementById("two").classList = "btn btn-outline-secondary";
}

function continueToContact() {
    document.getElementById("conPerson").value = baseModel["contactInfo"][0].name;
    document.getElementById("conPhone").value = baseModel["contactInfo"][0].phone;
    document.getElementById("conMobile").value = baseModel["contactInfo"][0].cell;
    document.getElementById("conFax").value = baseModel["contactInfo"][0].fax;
    document.getElementById("conTollfree").value = baseModel["contactInfo"][0].tollfree;
    document.getElementById("conEmail").value = baseModel["contactInfo"][0].email;
    document.getElementById("conWebsite").value = baseModel["contactInfo"][0].website;
    document.getElementById("conFacebook").value = baseModel["contactInfo"][0].facebook;
    document.getElementById("conTwitter").value = baseModel["contactInfo"][0].twitter;
    document.getElementById("conInstagram").value = baseModel["contactInfo"][0].instagram;
    document.getElementById("conYoutube").value = baseModel["contactInfo"][0].youtube;
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("three").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-outline-secondary";
    document.getElementById("three").classList = "btn btn-primary";
}

function nextToSchedule() {
    document.getElementById("monBeg").disabled = true;
    document.getElementById("monEnd").disabled = true;
    document.getElementById("tueBeg").disabled = true;
    document.getElementById("tueEnd").disabled = true;
    document.getElementById("wedBeg").disabled = true;
    document.getElementById("wedEnd").disabled = true;
    document.getElementById("thurBeg").disabled = true;
    document.getElementById("thurEnd").disabled = true;
    document.getElementById("friBeg").disabled = true;
    document.getElementById("friEnd").disabled = true;
    document.getElementById("satBeg").disabled = true;
    document.getElementById("satEnd").disabled = true;
    document.getElementById("sunBeg").disabled = true;
    document.getElementById("sunEnd").disabled = true;
    if (baseModel["schedule"][0].monStart === "null" && baseModel["schedule"][0].monEnd === "null") {
        document.getElementById("mon").checked = true;
    } else {
        document.getElementById("monBeg").value = baseModel["schedule"][0].monStart;
        document.getElementById("monEnd").value = baseModel["schedule"][0].monEnd;
    }
    if (baseModel["schedule"][0].tueStart === "null" && baseModel["schedule"][0].tueEnd === "null") {
        document.getElementById("tue").checked = true;

    } else {
        document.getElementById("tueBeg").value = baseModel["schedule"][0].tueStart;
        document.getElementById("tueEnd").value = baseModel["schedule"][0].tueEnd;
    }
    if (baseModel["schedule"][0].wedStart === "null" && baseModel["schedule"][0].wedEnd === "null") {
        document.getElementById("wed").checked = true;

    } else {
        document.getElementById("wedBeg").value = baseModel["schedule"][0].wedStart;
        document.getElementById("wedEnd").value = baseModel["schedule"][0].wedEnd;
    }
    if (baseModel["schedule"][0].thurStart === "null" && baseModel["schedule"][0].thurEnd === "null") {
        document.getElementById("thur").checked = true;

    } else {
        document.getElementById("thurBeg").value = baseModel["schedule"][0].thurStart;
        document.getElementById("thurEnd").value = baseModel["schedule"][0].thurEnd;
    }
    if (baseModel["schedule"][0].friStart === "null" && baseModel["schedule"][0].friEnd === "null") {
        document.getElementById("fri").checked = true;

    } else {
        document.getElementById("friBeg").value = baseModel["schedule"][0].friStart;
        document.getElementById("friEnd").value = baseModel["schedule"][0].friEnd;
    }
    if (baseModel["schedule"][0].satStart === "null" && baseModel["schedule"][0].satEnd === "null") {
        document.getElementById("sat").checked = true;

    } else {
        document.getElementById("satBeg").value = baseModel["schedule"][0].satStart;
        document.getElementById("satEnd").value = baseModel["schedule"][0].satEnd;
    }
    if (baseModel["schedule"][0].sunStart === "null" && baseModel["schedule"][0].sunEnd === "null") {
        document.getElementById("sun").checked = true;

    } else {
        document.getElementById("sunBeg").value = baseModel["schedule"][0].sunStart;
        document.getElementById("sunEnd").value = baseModel["schedule"][0].sunEnd;
    }

    document.getElementById("cash").checked = (baseModel["payment"][0].cash === "1") ? true : false;
    document.getElementById("digi").checked = (baseModel["payment"][0].card === "1") ? true : false;
    document.getElementById("card").checked = (baseModel["payment"][0].onlinepayments === "1") ? true : false;
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

    document.getElementById("keywordsArea").value = baseModel["keywords"][0].keywordstext;
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
var approvalModal = {};
var apStatus;
function approveService() {
    $('#alertPop').modal('show');
    apStatus = "true";
}

function rejectService() {
    $('#alertPop').modal('show');
    apStatus = "false";
}

function approvalConfirm() {
    var dat = new Date()
    approvalModal["appid"] = user;
    approvalModal["apptext"] = document.getElementById("commentsArea").value;
    approvalModal["appdate"] = dat.getDate() + "/" + dat.getMonth() + "/" + dat.getFullYear();
    approvalModal["appstatus"] = apStatus;
    $.ajax({
        url: 'http://127.0.0.1:5000/approveService?userid=' + user + '&tok=' + tok + '&sid=' + serviceid + '&role=' + role,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(approvalModal),
        success: function (response) {
            if (response === "success") {
                $('#alertPop').modal('hide');
                document.getElementById("alertText2").style.color = "green";
                document.getElementById("alertText2").innerText = "Approved Successfully";
                $('#alertPop2').modal('show');
                window.location = 'dashboardAdmin.html?tok=' + tok + '&un=' + user + '&role=' + role;

            } else if (response === "failedkey") {
                $('#alertPop').modal('hide');
                document.getElementById("alertText2").style.color = "red";
                document.getElementById("alertText2").innerText = "Server Error";
                $('#alertPop2').modal('show');
            }
        },
        error: function () {
            $('#alertPop').modal('hide');
            document.getElementById("alertText2").style.color = "red";
            document.getElementById("alertText2").innerText = "Server Error";
            $('#alertPop2').modal('show');
        }
    });
}

