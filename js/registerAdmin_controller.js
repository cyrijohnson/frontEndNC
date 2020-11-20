var user, tok;
var user1, tok1;
const paramString = window.location.search;
const params = new URLSearchParams(paramString);

var serviceid;
var companyid;
function oninit() {

    tok = params.get('tok');
    user = params.get('un');
    $.ajax({
        url:"http://127.0.0.1:5000/userInfo?userid=" + params.get('un') + "&tok=" + params.get('tok'),
        type: 'GET',
        success: function(response){
           document.getElementById("userName").innerText = response[0].firstName + " " + response[0].lastName;
        },
        error: function(){
            
        }
    });
}
function createUser() {
    payload = {};
    payload['userid'] = document.getElementById("emailsu").value;
    payload['fname'] = document.getElementById("fnamesu").value;
    payload['lname'] = document.getElementById("lnamesu").value;
    payload['password'] = document.getElementById("password2su").value;
    payload['phone'] = document.getElementById("phonesu").value;
    payload['initial'] = "true";
    $.ajax({
        url: 'http://127.0.0.1:5000/newUser',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert("Sign up successful. Please login using the entered credentials");
            authenticate(document.getElementById("emailsu").value, document.getElementById("password2su").value);
        },
        error: function () {
            alert("Server Error! Please try again later");
        }
    });
}

function authenticate(id, pass) {
    var payload = {};
    payload['userid'] = id;
    payload['password'] = pass;
    $.ajax({
        url: 'http://127.0.0.1:5000/authenticate',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            user1 = document.getElementById("emailsu").value;
            tok1 = response["key"];
            document.getElementById("page0").style.display = "none";
            document.getElementById("page1").style.display = "block";
            document.getElementById("zero").classList.value = "";
            document.getElementById("one").classList.value = "";
            document.getElementById("zero").classList = "btn btn-outline-secondary";
            document.getElementById("one").classList = "btn btn-primary";
        },
        error: function () {
            var response = JSON.parse(this.responseText);
            if (response === "InvalidUser") {
                modal.style.display = "block";
            } else if (response === "AuthenticationFailed") {
                alert("Wrong Password")
            } else if (response === "False") {
                alert("Token error");
            }
        }
    });
}

function dashboardClick(){
    window.location = 'dashboard.html?tok=' + tok + '&un='+ user;
}

function profileClick(){

}

function companiesClick(){

}

function storesServicesClick(){

}

function reviewsEnquiriesClick(){

}

function advertismentClick(){

}

function abortRegister() {
    window.location = 'registerServiceAdmin.html?tok=' + params.get('tok') + '&un=' + params.get('un');
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
        url: 'http://127.0.0.1:5000/addCompany?userid=' + user1 + '&tok=' + tok1,
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
    companyid = 0;
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("one").classList.value = "";
    document.getElementById("two").classList.value = "";
    document.getElementById("one").classList = "btn btn-outline-secondary";
    document.getElementById("two").classList = "btn btn-primary";
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
    var servicePayload = {
        "company": (companyid === 0) ? "false" : "true",
        "companyid": companyid,
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
        url: 'http://127.0.0.1:5000/addService?userid=' + user1 + '&tok=' + tok1,
        type: 'POST',
        data: JSON.stringify(servicePayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            
                serviceid = response.serviceId;
                alert("service added successfully")
        },
        error: function () {
            alert("error");
        }
    });
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

    var contactPayload = {
        "serviceid": serviceid,
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
        url: 'http://127.0.0.1:5000/addServiceContact?userid=' + user1 + '&tok=' + tok1,
        type: 'POST',
        data: JSON.stringify(contactPayload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert("Contact Information updated")
        },
        error: function () {
            alert("error");
        }
    });
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
    var register = {};
    register['serviceid'] = serviceid;
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
        url: 'http://127.0.0.1:5000/addServiceSchedule?userid=' + user1 + '&tok=' + tok1,
        type: 'POST',
        data: JSON.stringify(register),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert("Schedule addedd successfully");
        },
        error: function () {
            alert("error");
        }
    });

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
function submitReistration() {
    var keywords = {"serviceid":serviceid, "keywords":document.getElementById("keywordsArea").value}
    $.ajax({
        url: 'http://127.0.0.1:5000/addServiceKeywords?userid=' + user1 + '&tok=' + tok1,
        type: 'POST',
        data: JSON.stringify(keywords),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert("You have registered your listing successfully");
            abortRegister();
        },
        error: function () {
            alert("error");
        }
    });
}