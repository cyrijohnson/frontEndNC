var session;
var payload = {};
function register(oEvent) {
    payload['userid'] = document.getElementById("emailsu").value;
    payload['fname'] = document.getElementById("fnamesu").value;
    payload['lname'] = document.getElementById("lnamesu").value;
    payload['password'] = document.getElementById("password2su").value;
    payload['phone'] = document.getElementById("phonesu").value;
    payload['initial'] = "false";
    $.ajax({
        url: "http://2factor.in/API/V1/90923992-1e47-11eb-b380-0200cd936042/SMS/" + payload['phone'] + "/AUTOGEN",
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded',
        success: function (response) {
            session = response;
            $('#exampleModal2').modal('hide')
            $('#otpModal').modal('show')
        },
        error: function () {
            alert("error");
        }
    });
}

function search() {
    var searchtext = document.getElementById("searchTextInput").value;
    $.ajax({
        url: "http://127.0.0.1:5000/find",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ "searchText": searchtext }),
        success: function (response) {
            fillResults(response);
        },
        error: function () {

        }
    });
}

function fillResults(oData) {
    if (oData.length === 0) {
        document.getElementById("noresults").style.display = "block";
        mainContainer.innerText = "";
    } else {
        document.getElementById("noresults").style.display = "none";
        document.getElementById("searchArea").style.display = "block";
        var mainContainer = document.getElementById("searchResults");
        mainContainer.innerText = "";
        oData.forEach(function (ser) {
            mainContainer.appendChild(createResultCard(ser))
        });
    }
}

function createResultCard(item) {
    var columnContainer = document.createElement("div");
    columnContainer.classList.value = "column2";
    var cardContainer = document.createElement("div");
    cardContainer.classList.value = "card2";
    var flexDiv = document.createElement("div");
    flexDiv.style.display = "flex";

    var imageDiv = document.createElement("div");
    var img = document.createElement("img");
    img.classList.value = "avatar";
    img.src = "images/faces/4.jpg"; 
    imageDiv.appendChild(img);

    var textContainer = document.createElement("div");
    textContainer.style.paddingLeft = "1.5em";
    textContainer.style.textAlign = "left";
    var h4 = document.createElement("h4");
    h4.innerText = item.name;
    var pAddress = document.createElement("p");
    pAddress.innerText = item.area + ", " + item.landmark;
    var phone = document.createElement("p");
    phone.innerText = item.cell;
    var pStatus = document.createElement("p");
    pStatus.innerText = getStatus(item)
    if(pStatus.innerText === "open"){
        pStatus.style.color = "green";
    } else{
        pStatus.style.color = "red";
    }
    textContainer.appendChild(h4);
    textContainer.appendChild(pAddress);
    textContainer.appendChild(phone);
    textContainer.appendChild(pStatus);



    var iconContainer = document.createElement("div");
    var ul = document.createElement("ul");
    ul.style.listStyleType = "none";
    var li,a,i;
    if(item["facebook"] !== ""){
        li = document.createElement("li");
        a = document.createElement("a");
        a.href = item["facebook"];
        a.target = "_blank";
        i = document.createElement("i");
        i.classList = "fab fa-facebook-f";
        a.appendChild(i);
        li.appendChild(a);
        ul.appendChild(li);
    }
    if(item["instagram"] !== ""){
        li = document.createElement("li");
        a = document.createElement("a");
        i = document.createElement("i");
        i.classList = "fab fa-instagram";
        a.appendChild(i);
        a.target = "_blank";
        a.href = item["instagram"];
        li.appendChild(a);
        ul.appendChild(li);
    }
    if(item["youtube"] !== ""){
        li = document.createElement("li");
        a = document.createElement("a");
        a.href = item["youtube"];
        a.target = "_blank";
        i = document.createElement("i");
        i.classList = "fab fa-youtube";
        a.appendChild(i);
        li.appendChild(a);
        ul.appendChild(li);
    }
    if(item["cell"] !== ""){
        li = document.createElement("li");
        a = document.createElement("a");
        a.href = "tel:"+item["cell"];
        i = document.createElement("i");
        i.classList = "fas fa-phone";
        a.appendChild(i);
        li.appendChild(a);
        ul.appendChild(li);
    }
    iconContainer.appendChild(ul);

    flexDiv.appendChild(imageDiv);
    flexDiv.appendChild(textContainer);
    flexDiv.appendChild(iconContainer);
    cardContainer.appendChild(flexDiv);
    columnContainer.appendChild(cardContainer);
    return columnContainer;

}

function getStatus(item) {
    var date = new Date();
    var weekday = new Array(7);
    weekday[0] = "sun";
    weekday[1] = "mon";
    weekday[2] = "tue";
    weekday[3] = "wed";
    weekday[4] = "thur";
    weekday[5] = "fri";
    weekday[6] = "sat";
    var day = weekday[date.getDay()];
    var startTime = (item[day + "Start"] === "null") ? null : item[day + "Start"] + ":00";
    var endTime = (item[day + "End"] === "null") ? null : item[day + "End"] + ":00";
    var currentTime = date.getHours() + ":" + date.getMinutes() + ":00";
    if (startTime !== null && endTime !== null) {
        if (currentTime >= startTime && currentTime <= endTime) {
            return "open";
        } else {
            return "closed";
        }
    } else {
        return "closed for today";
    }
}

function otpConfirm(oEvent) {
    $.ajax({
        url: "http://2factor.in/API/V1/90923992-1e47-11eb-b380-0200cd936042/SMS/VERIFY/" + session.Details + "/" + document.getElementById("otp").value,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded',
        success: function (response) {
            if (response.Details === "OTP Matched") {
                confirmRegistration();
                $('#otpModal').modal('hide')
            }
            else {
                return;
            }
        },
        error: function () {
            alert("error");
        }
    });
}

function confirmRegistration() {
    $.ajax({
        url: 'http://127.0.0.1:5000/newUser',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert("Sign up successful. Please login using the entered credentials");
            $('#otpConfirm').modal({ show: false });
        },
        error: function () {
            alert("error");
        }
    });
}

function authenticate(oEvent) {
    var payload = {};
    payload['userid'] = document.getElementById("unameLI").value;
    payload['password'] = document.getElementById("passwordLI").value;
    $.ajax({
        url: 'http://127.0.0.1:5000/authenticate',
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            window.location = 'dashboard.html?tok=' + response["key"] + '&un=' + document.getElementById("unameLI").value;
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

function eLogin() {
    window.location = "login2.html";
}