/* eslint-disable max-len */
/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
function getRandomIntInclusive(min, max) {
  const Newmin = Math.ceil(min);
  const Newmax = Math.floor(max);
  return Math.floor(Math.random() * (Newmax - Newmin + 1) + Newmin); // The maximum is inclusive and the minimum is inclusive
}
function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  const listEl = document.createElement('ol');
  target.appendChild(listEl);
  list.forEach((item) => {
    const el = document.createElement('li');
    el.innerText = item.name;
    listEl.appendChild(el);
  });
  /*
      ## JS and HTML Injection
        There are a bunch of methods to inject text or HTML into a document using JS
        Mainly, they're considered "unsafe" because they can spoof a page pretty easily
        But they're useful for starting to understand how websites work
        the usual ones are element.innerText and element.innerHTML
        Here's an article on the differences if you want to know more:
        https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
      ## What to do in this function
        - Accept a list of restaurant objects
        - using a .forEach method, inject a list element into your index.html for every element in the list
        - Display the name of that restaurant and what category of food it is
    */
}
function processRestaurants(list) {
  console.log('fired restaurants list');
  const range = [...Array(15).keys()];
  const newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length);
    return list[index];
  });
  return newArray;
  /*
        ## Process Data Separately From Injecting It
          This function should accept your 1,000 records
          then select 15 random records
          and return an object containing only the restaurant's name, category, and geocoded location
          So we can inject them using the HTML injection function
          You can find the column names by carefully looking at your single returned record
          https://data.princegeorgescountymd.gov/Health/Food-Inspection/umjn-t2iz
        ## What to do in this function:
        - Create an array of 15 empty elements (there are a lot of fun ways to do this, and also very basic ways)
        - using a .map function on that range,
        - Make a list of 15 random restaurants from your list of 100 from your data request
        - Return only their name, category, and location
        - Return the new list of 15 restaurants so we can work on it separately in the HTML injector
      */
}
function filterList(list, filterInputValue) {
  return list.filter((item) => {
    if (!item.name) {
      return;
    }
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}
function initMap() {
  console.log('initMap');
  const map = L.map('map').setView([38.9897, -76.9378], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

function markerPlace(array, map) {
  console.log('markerPlace', array);
  const marker = L.marker([51.5, -0.09]).addTo(map);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  array.forEach((item, index) => {
    const {coordinates} = item.geocoded_column_1;
    L.marker([coordinates[1], coordinates[0]]).addTo(map);
    if (index === 0) {
      map.setView([coordinates[1], coordinates[0]], 10);
    }
  });
}
async function mainEvent() {
  /*
@@ -147,6 +157,7 @@ async function mainEvent() {
      console.log(event.target.value);
      const filteredList = filterList(currentList, event.target.value);
      injectHTML(filteredList);
      markerPlace(filteredList, pageMap);
    });

    form.addEventListener('submit', (submitEvent) => {
@@ -158,6 +169,7 @@ async function mainEvent() {

      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(currentList);
      markerPlace(currentList, pageMap);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time