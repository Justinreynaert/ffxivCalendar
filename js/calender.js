window.onload = function() {
  const dataView = document.getElementById("dataView");
  const datePicker = document.getElementById("datePicker");

  //make Datepicker
  fetch("https://calendnyan.herokuapp.com/dates/getDates")
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


}

function clearActive(id) {
  let wrap = document.getElementById(id);

  while (wrap.firstChild) {
    wrap.removeChild(wrap.firstChild);
  }
}

function loadActive(dateId, container) {
  console.log(dateId)
  fetch("https://calendnyan.herokuapp.com/dates/getDates" + dateId)
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);

      for (property in data) {
        var place = property;
        makeUl(property, container);
        data[place].forEach((element, index, array) => makeLi(element, index, array, property));
      }
    })
    .catch(() => {

    })




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
  let eLi = document.createElement("li");
  eLi.innerHTML = element;
  document.getElementById(property).appendChild(eLi);
}

function makeOption(data, index, select) {;
  let eOption = document.createElement("option");
  eOption.value = data;
  eOption.name = "date" + index;
  eOption.id = "date" + index;
  eOption.innerText = data;
  select.appendChild(eOption);
}

function makeDatePicker(data) {

  let select = document.getElementById('datePicker');

  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    makeOption(data[i].date, i, select);
  }
}
