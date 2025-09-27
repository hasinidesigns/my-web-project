//globals - stores search results//
let cachedResults = [];
let currentPage = 1;
let currentQueryUrl = "";
let limit = 25;

// Function to get user's location and fetch data based on city or suburb//
function getLocationAndFetchData() {
  // checks if browser supports GPS location//
  if ("geolocation" in navigator) {
    // if yes, ask browser for users latitude/longitude//
    navigator.geolocation.getCurrentPosition(
      // if successful, stores this data//
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`user: ${lat}, ${lon}`);

        // Call function to convert lat/lon to city/suburb//
        getCityFromCoordinates(lat, lon);

      // if there is an error (user says 'no' or GPS fails)..//
      },
      (error) => {
        // show error message on the page//
        console.error("Geolocation error:", error);
        document.getElementById("objectsContainer").innerHTML = `<p>Could not retrieve location. Showing default results.</p>`;

        // Fallback (next option if first fails): search for 'dog' in NFSA collection
        getData("https://api.collection.nfsa.gov.au/search?query=dog");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  // if browser doesn't even support location//
  } else {
    // show message and fetch 'dog' results anyways//
    console.log("Geolocation not supported in this browser.");
    document.getElementById("objectsContainer").innerHTML = `<p>Geolocation is not supported. Showing default results.</p>`; 

      // Fallback: Use a general query if geolocation fails
      currentPage = 1;
      currentQueryUrl = "https://api.collection.nfsa.gov.au/search?query=dog";

    // Fetch default data
    getData("https://api.collection.nfsa.gov.au/search?query=dog");
  }
}

// Function to convert lat/lon into suburb -- a URL for the OpenStreetMap's API//
function getCityFromCoordinates(lat, lon) {
  const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  // fetch API and turn response into usable JSON//
  fetch(geoApiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Geocoding API Response:", data);

      // Extract city or suburb from response
      let locationName = data.address.suburb;

      // if we have suburb, search NFSA using that suburb//
      if (locationName) {
        console.log(`Detected Location: ${locationName}`);
        searchByLocation(locationName);
        // if no suburb is found or API fails, fallback to dog again//
      } else {
        console.log("No city/suburb found, using default search.");
        getData("https://api.collection.nfsa.gov.au/search?query=dog");
      }
    })
    .catch(error => {
      console.error("Error retrieving location:", error);
      getData("https://api.collection.nfsa.gov.au/search?query=dog");
    });
}

function showMoreButton() {
  document.getElementById("moreBtn").style.display = "inline-block";
}

// Function to search NFSA API using URL with city/suburb name//
function searchByLocation(location) {
  currentPage = 1;
  currentQueryUrl = `https://api.collection.nfsa.gov.au/search?query=${encodeURIComponent(location)}`;
  getData(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);
}

// Function to fetch data from NFSA API -- accepts URL and an optional callback function//
function getData(url, callback, append = false) {
// fetch data from URL and turn it into JSON -- if request fails throw an error//
fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    // if callback is provided, run that -- if not, display search results//
    .then(data => {
      if (callback) {
        callback(data);
      } else {
        displayResults(data.results, append);
      }
    })
    // if API fails, show an error message in the page//
    .catch(error => {
      console.error("Error fetching data:", error);
      const outputDiv = document.getElementById("objectsContainer");
      outputDiv.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    });
}


// Function to display API results
function displayResults(results, append = false) {
  // Save results in a memory box so we can return to it later if user presses back//
  if (!append) {

  cachedResults = results;
  // get output area and wipe it clean -- like erasing a whiteboard before writing new things// 
  document.getElementById("objectsContainer").innerHTML = "";
  } else {
    cachedResults = cachedResults.concat(results); // Add to cache
  }

  const objectsContainer = document.getElementById("objectsContainer"); 

  // loop through each search result//
  results.forEach(item => {
    console.log("Item:", item); // Step to log each item

    // Extract the preview array
    const imgArr = item.preview || []; // Default to empty array

    // Initialize empty image URL
    let imgurl = "";

    // Loop through to check if theres a preview image and build its full URL//
    const baseurl = "https://media.nfsacollection.net/";
    for (let i = 0; i < imgArr.length; i++) {
      console.log("Preview object:", imgArr[i]); // Log preview object
      if (imgArr[i].hasOwnProperty("filePath")) {
        imgurl = baseurl + imgArr[i].filePath;
        break; // Use the first valid image
      }
    }

    // 1. Create a new container for the item
    const itemContainer = document.createElement("div"); 

    // 2. Fill container with title, name, image, and 'view details' button 
    itemContainer.innerHTML = `
          <h2>${item.title}</h2>
          <p>${item.name}</p>
          ${imgurl ? `<div class="imgContainer"><img src="${imgurl}" alt="${item.title}"></div>` : ""}
                      <button class="viewBtn" data-id="${item.id}">View Details</button>

      `;

    // 3. Add the box to the page//
    objectsContainer.appendChild(itemContainer);
  });
  // find all 'View Details' buttons and give them a click action that loads the item's details//
  document.querySelectorAll(".viewBtn").forEach(button => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      loadItemDetails(itemId);
    });
  });
  
  showMoreButton();

}


// Function to show a single item when clicked//
function loadItemDetails(id) {
  console.log('load item: ' + id);
  // builds a new API URL for a single item (using its ID)//
  const apiUrl = `https://api.collection.nfsa.gov.au/title/${id}`;

  // clears results and shows "loading..." while waiting//
  const outputDiv = document.getElementById("objectsContainer");
  outputDiv.innerHTML = "<p>Loading item details...</p>";

  // fetch item details, make sure values exist and grab image if available//
  getData(apiUrl, item => {
    const title = item.title || "Untitled";
    const name = item.name || "";
    const preview = Array.isArray(item.preview) ? item.preview : [];
    const imgurl = preview.length > 0 && preview[0].filePath
      ? `https://media.nfsacollection.net/${preview[0].filePath}`
      : "";

    // replace the page with items details + a 'back' button//
    outputDiv.innerHTML = `
      <button id="backBtn">Back</button>
      <h2>${title}</h2>
      <p>${name}</p>
      ${imgurl ? `<img src="${imgurl}" alt="${title}">` : ""}
    `;

    // clicking 'back' reloads the cached list
    document.getElementById("backBtn").addEventListener("click", () => {
      displayResults(cachedResults); // Just re-render the stored results
    });

  });
}

// Call function to get user location and fetch API data
// getLocationAndFetchData(); 
currentPage = 1;
limit = 25;
currentQueryUrl = "https://api.collection.nfsa.gov.au/search?query=dog";
getData(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("moreBtn").addEventListener("click", () => {
    currentPage += 1;
    const nextUrl = `${currentQueryUrl}&page=${currentPage}&limit=${limit}`;
    getData(nextUrl, null, true); // append = true
  });
});