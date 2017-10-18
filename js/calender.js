testData = {
  "dates": {
    "1": {
      "available": [
        "baba", "punch", "lu", "Myrrh"
      ],
      "unavailable": [
        "lei", "zee"
      ],
      "tentative": ["gul"]
    },

    "2": {
      "available": [
        "punch", "baba", "lu", "Myrrh"
      ],
      "unavailable": [
        "lei", "zee"
      ],
      "tentative": ["gul"]
    },

    "3": {
      "available": [
        "myrrh", "baba", "punch", "lu", "Myrrh"
      ],
      "unavailable": [
        "lei", "zee"
      ],
      "tentative": ["gul"]
    },

    "4": {
      "available": [
        "test", "baba", "punch", "lu", "Myrrh"
      ],
      "unavailable": [
        "lei", "zee"
      ],
      "tentative": ["gul"]
    },
    "5": {
      "available": [
        "baba", "punch", "lu", "Myrrh"
      ],
      "unavailable": [
        "lei", "zee"
      ],
      "tentative": ["gul"]
    }
  }
}

window.onload = function() {
  const dataView = document.getElementById("dataView");
  const datePicker = document.getElementById("datePicker");

  datePicker.addEventListener("change", function() {

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

  let data = testData.dates[dateId];

  for (property in testData.dates[dateId]) {
    var place = property;
    makeUl(property, container);
    testData.dates[dateId][place].forEach((element, index, array) => makeLi(element, index, array, property));
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
  let eLi = document.createElement("li");
  eLi.innerHTML = element;
  document.getElementById(property).appendChild(eLi);
}
