user = {}

window.onload = function() {
  const dataView = document.getElementById("dataView");
  const datePicker = document.getElementById("datePicker");
  const btnAddDate = document.getElementById("addDate");
  const btnRemoveDate = document.getElementById("removeDate");
  const radButtons = document.getElementById("availability");
  const btnLogin = document.getElementById("btnLogin");
  const btnRegister = document.getElementById("btnRegister");

  // loged in checked
  loggedInCheck();

  //make Datepicker
  fetch("http://localhost:5000/dates/getDates")
  .then((resp) => resp.json())
  .then(function(data) {
    makeDatePicker(data);
    loadCurrent();
  })
  .catch(() => {});

  datePicker.addEventListener("change", function() {
    if (dataView.children.length > 0) {
      clearActive(dataView.id);
    }
    loadActive(datePicker.value, dataView);
  });

  btnAddDate.addEventListener("click", function(e) {
    getDateData();
  });

  btnRemoveDate.addEventListener("click", function(e) {
    if (datePicker.value) {
      removeDate(datePicker.value);
    }
  })

  btnLogin.addEventListener("click", function(e) {
    login();
  })
}

function clearActive(id) {
  let wrap = document.getElementById(id);

  while (wrap.firstChild) {
    wrap.removeChild(wrap.firstChild);
  }
}

function makeUl(property, container) {
  // make the title
  let eH1 = document.createElement("h1");
  eH1.innerHTML = property;
  // make the UL
  let eUl = document.createElement("ul");
  eUl.id = property;
  container.appendChild(eH1);
  container.appendChild(eUl);
}

function makeLi(element, index, array, property) {
  console.log("el", element);
  if (element.toLowerCase() == user.name) {
    document.getElementById("rad" + capitalizeFirstLetter(property)).checked = true;
  }

  let eLi = document.createElement("li");
  eLi.innerHTML = element;
  document.getElementById(property).appendChild(eLi);
}

function makeOption(data, index, select) {;
  let eOption = document.createElement("option");
  eOption.value = data;
  eOption.name = "date" + index;
  eOption.id = "date" + index;
  eOption.innerText = makeUTCdate(data);
  select.appendChild(eOption);
}

function makeDatePicker(data) {

  let select = document.getElementById('datePicker');

  for (let i = 0; i < data.length; i++) {
    makeOption(data[i].date, i, select);
  }
}

function makeUTCdate(timestamp) {
  let d = new Date(0);
  d.setUTCSeconds(timestamp);
  return d;
}

function getDateData() {
  let eCont = document.getElementById("date");

  let inputs = eCont.getElementsByTagName("input");
  let date = {};
  for (let i = 0; i < inputs.length; i++) {
    date[inputs[i].name] = inputs[i].value;
  }

  var d = new Date(date.year, date.month - 1, date.day, date.hours, date.minutes);
  var unixtime = d.getTime() / 1000;
  addDate(unixtime);
}

function handleRadClick(radioBut) {
  const datePicker = document.getElementById("datePicker");

  // get logged in person
  var currentUser = user.name;
  //

  var currentDate = datePicker.value;
  if (datePicker.value) {

    let userData = {
      "name": currentUser,
      "date": currentDate,
      "availability": radioBut.value
    }
    setAvailibility(userData);
  }

}

function addDate(date) {
  // date -- unixdate
  fetch("http://localhost:5000/dates/addDate/" + date, {
    method: "POST",
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'jwt': JSON.parse(window.token)
  }}).then((resp) => resp.json()).then(function() {
    let select = document.getElementById('datePicker');
    let index = select.children.length + 1;
    makeOption(date, index, select);
    select.selectedIndex = index - 1;
  }).then(function() {
    loadCurrent();
  }).catch(() => {})
}

function removeDate(date) {
  fetch("http://localhost:5000/dates/removeDate/" + date, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'jwt': JSON.parse(window.token)
    }})

    .then((resp) => resp.json()).then(function(data) {

    if (data.succes == true) {
      let select = document.getElementById('datePicker');
      let currentChild = select.selectedIndex + 1;
      select.removeChild(select.childNodes[currentChild])

    }
  }).then(function() {
    loadCurrent();
  }).catch(() => {})
}

function loadActive(date, container) {
  unCheckBoxes();

  fetch("http://localhost:5000/dates/getDates/" + date).then((resp) => resp.json()).then(function(data) {
    for (property in data) {
      var place = property;
      makeUl(property, container);
      data[place].forEach((element, index, array) => makeLi(element, index, array, property));
    }
  }).catch(() => {})
}

function setAvailibility(availData) {
  // availdata - data about availibility

  fetch("http://localhost:5000/dates/setAvailability", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'jwt': JSON.parse(window.token)
    },

    body: JSON.stringify(availData)
  }).then((resp) => resp.json()).then(function(data) {
    moveLi(availData);
  }).catch(() => {})
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function moveLi(userData) {
  let currentUl = getCurrentUl(user.name);

  if (currentUl.found == "yes") {
    currentUl.li.parentNode.removeChild(currentUl.li)
  }

  var ulName = document.getElementById(revertAvailabilty(userData.availability));
  ulName.appendChild(currentUl.li);
}

function revertAvailabilty(number) {
  switch (number) {
    case "0":
      return "available";
      break;

    case "1":
      return "unavailable";
      break;
    case "2":
      return "tentative";
      break;
  }
}

function getCurrentUl(username) {
  var allUls = document.getElementById("dataView").getElementsByTagName("ul");

  for (let i = 0; i < allUls.length; i++) {
    for (let x = 0; x < allUls[i].children.length; x++) {
      if (allUls[i].children[x].innerText == username) {
        var object = {
          found: "yes",
          li: allUls[i].children[x]
        }
        return object;
      }

    }
  }

  var eLi = document.createElement("li");
  eLi.innerText = username;

  var object = {
    found: "no",
    li: eLi
  }
  return object;
}

function loadCurrent() {

  let select = document.getElementById('datePicker')
  clearActive("dataView");

  loadActive(datePicker.value, dataView);
}

function unCheckBoxes() {
  let avail = document.getElementById("availability");
  var inputs = avail.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].checked = false;
  }
}

function login() {


  var loginSection = document.getElementById("login");

  clearErrorMsgs(loginSection);

  var inputs = loginSection.getElementsByTagName("input");

  var mistakes = {
    count: 0
  };


  // check for input if required
  for (let i = 0; i < inputs.length; i++) {

    inputs[i].classList.remove("error");


    if (inputs[i].value.length == 0) {
      inputs[i].classList.add("error");
      mistakes.count ++;
      console.log(mistakes.count);

      mistakes[inputs[i].name] = {
        error: "missing input",
        msg: "missing input",
        input: inputs[i]
      }
    }
  }

  for (let i = 0; i < inputs.length; i++) {
  if (!mistakes[inputs[i].name]) {
    switch (inputs[i].name) {
      case "email":
        if (!validateEmail(inputs[i].value)) {
          mistakes[inputs[i].name] = {
            error: "formatting",
            msg: "not a correct emailadress",
            input: inputs[i]
          }

          inputs[i].classList.add("error");

          mistakes.count ++;
        }
        break;
      }
    }
  }

  if (mistakes.count == 0) {

    let userData = {};

    for (let i = 0; i < inputs.length; i++) {
        userData[inputs[i].name] = inputs[i].value;
    }

    userData.email = userData.email.toLowerCase();

    console.log(userData);

    fetch("http://localhost:5000/users/authenticate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(userData)
    })
    .then((resp) => resp.json())
    .then(function(data) {
      if(data.success) {
        // goodshit, we are. Save token and user info.
        console.log(data);
        console.log(data.user);
        console.log(data.token);
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        loggedInCheck();

        // reset the page with the new info.
      } else {
        // something went wrong ... Let's let the user know this
        alert(data.msg);
      }
    })
    .catch(() => {})
  } else {
    // Make all the wrong shit appear
    clearErrorMsgs(loginSection);

    console.log("generating");
    for (key in mistakes) {
      if (key !== "count") {
        var obj = mistakes[key];

        var input = obj.input;
        makeMsg(input.parentNode, obj.msg)
      }
    }

  }
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function hasClass( target, className ) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

function makeMsg(target, message) {
  eSpan = document.createElement("span");
  eSpan.className = "errorMsg";
  eSpan.innerText = message;

  target.appendChild(eSpan);
}

function clearErrorMsgs(location) {
  let allErrorMsgs = location.getElementsByClassName("errorMsg");
  console.log("allErrorMsgs", allErrorMsgs.length );
  for (let i = 0; i < allErrorMsgs.length; i ++) {
    console.log("this ", allErrorMsgs[i]);
    allErrorMsgs[i].parentNode.removeChild(allErrorMsgs[i]);
  }
}

function loggedInCheck() {
  if(localStorage.getItem("token")) {
    window.token = localStorage.getItem("token");
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    user = userInfo;

    changeState();
  }
}

function changeState() {
  clearActive("loginInnerContent");
  createLogout(document.getElementById("loginInnerContent"));
  checkType();
}

function createLogout(container) {
  eDiv = document.createElement("div");
  eDiv.className = "logout";

  eButton = document.createElement("button");
  eButton.id = "logout";
  eButton.innerText = "logout";

  eButton.addEventListener("click", function() {
    logout();
  })

  eSpan = document.createElement("span");
  eSpan.innerText = "Logged in as " + user.name;

  eDiv.appendChild(eSpan);
  eDiv.appendChild(eButton);


  container.appendChild(eDiv);
}

function logout() {
  console.log("logging out");
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  user = {};

  location.reload();
}

function checkType() {
  console.log(user.type);

  switch (user.type) {
    case "admin":
      let adminContent = document.getElementsByClassName("adminContent");
      for (let i = 0; i < adminContent.length; i++ ) {
        adminContent[i].style.display = "block";
      }

    default:
      let availability = document.getElementById("availability");
      availability.style.display = "block";
  }
}
