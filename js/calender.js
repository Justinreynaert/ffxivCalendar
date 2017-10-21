user = {
  "name": "bababa",
  "accounttype":"admin"
}

window.onload = function() {
  const dataView = document.getElementById("dataView");
  const datePicker = document.getElementById("datePicker");
  const btnAddDate = document.getElementById("addDate");
  const btnRemoveDate = document.getElementById("removeDate");
  const radButtons = document.getElementById("availability");
  //make Datepicker
  fetch("http://localhost:5000/dates/getDates")
    .then((resp) => resp.json())
    .then(function(data) {
      makeDatePicker(data);
      loadActive(datePicker.value, dataView);
    })
    .catch(() => {

    })



  datePicker.addEventListener("change", function() {
    console.log("changed");
    if (dataView.children.length > 0) {
        clearActive(dataView.id);
    }

    loadActive(datePicker.value, dataView);
  });

  btnAddDate.addEventListener("click", function(e) {
    getDateData();
  });

  btnRemoveDate.addEventListener("click", function(e) {

    removeDate(datePicker.value);
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
  let  eH1 = document.createElement("h1");
  eH1.innerHTML = property;
  // make the UL
  let eUl = document.createElement("ul");
  eUl.id = property;
  container.appendChild(eH1);
  container.appendChild(eUl);
}

function makeLi(element, index, array, property) {
  if (element.toLowerCase() == user.name) {
    document.getElementById("rad"+capitalizeFirstLetter(property)).checked = true;
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

function makeUTCdate(timestamp){
  let d = new Date(0);
  d.setUTCSeconds(timestamp);
  return d;
}

function getDateData() {
  let eCont = document.getElementById("date");

  let inputs = eCont.getElementsByTagName("input");
  let date = {};
  for (let i = 0; i < inputs.length; i++) {
    console.dir(inputs[i]);
    console.log(inputs.name);
    date[inputs[i].name] = inputs[i].value;
  }

  var d = new Date(date.year, date.month-1, date.day, date.hours, date.minutes);
  var unixtime = d.getTime()/1000;
  addDate(unixtime);
}

function handleRadClick(radioBut) {
  const datePicker = document.getElementById("datePicker");

  // get logged in person
  var currentUser = user.name;
  //

  var currentDate = datePicker.value;

  let userData = {
    "name":currentUser,
    "date":currentDate,
    "availability":radioBut.value
  }

  setAvailibility(userData);

}

function addDate(date) {
  // date -- unixdate
  fetch("http://localhost:5000/dates/addDate/" + date, {
    method: "POST",
  })
    .then((resp) => resp.json())
    .then(function() {
      let select = document.getElementById('datePicker');
      let index = select.children.length + 1;
      makeOption(date,index,select);
      select.selectedIndex = index-1;
    })
    .catch(() => {
    })
}

function removeDate(date) {
  fetch("http://localhost:5000/dates/removeDate/" + date, {
    method: "POST"
  })
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data)

      if (data.succes == true) {
        let select = document.getElementById('datePicker');
        let currentChild = select.selectedIndex + 1;
        select.removeChild(select.childNodes[currentChild])
      }
    })
    .catch(() => {
    })
}

function loadActive(dateId, container) {
  fetch("http://localhost:5000/dates/getDates/" + dateId)
    .then((resp) => resp.json())
    .then(function(data) {
      for (property in data) {
        var place = property;
        makeUl(property, container);
        data[place].forEach((element, index, array) => makeLi(element, index, array, property));
      }
    })
    .catch(() => {
    })
}

function setAvailibility(availData) {
  // availdata - data about availibility
  fetch("http://localhost:5000/dates/setAvailability",
  {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(availData)
  })
    .then((resp) => resp.json())
    .then(function(data) {

      moveLi(availData);


    })
    .catch(() => {
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function moveLi(userData) {
  let currentUl = getCurrentUl(user.name);
  console.log("UL now " + currentUl);
  var ulName = revertAvailabilty(userData.availability);
  console.log("Move to " + ulName);
}

function revertAvailabilty(number) {
  switch(number) {
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
    for (let x = 0; x < allUls[i].children.length; x ++) {
      if (allUls[i].children[x].innerText == username) {
        return allUls[i].id;
      }

    }
  }
}
