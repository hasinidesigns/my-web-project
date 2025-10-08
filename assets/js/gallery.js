let cachedResults = [];// Stores results from API//
let currentQueryUrl = "https://api.collection.nfsa.gov.au/search?query=advertisement&hasMedia=yes"; //API URL for search//

// Abstracted function to handle fetching all pages for a given query
async function fetchAllPages(baseUrl) {
  let allResults = [];
  let page = 1;
  while (true) {
    console.log(`Fetching page ${page} for ${baseUrl}`);
    const response = await fetch(`${baseUrl}&page=${page}`);

    // Read the response as text first to handle empty bodies from the server
    const responseText = await response.text();
    if (!responseText) {
      // The response body is empty, so we can safely assume there are no more pages.
      break;
    }

    // Now that we know the response is not empty, we can parse it as JSON.
    const data = JSON.parse(responseText);

    if (data.results && data.results.length > 0) {
      allResults = allResults.concat(data.results);
      page++;
    } else {
      // The JSON is valid but contains no results, so we're also done.
      break;
    }
  }
  return allResults;
}

// Main function to orchestrate fetching and displaying data
async function fetchResults() {
  try {
    const results = await fetchAllPages(currentQueryUrl);
    console.log(`Finished fetching. Total items: ${results.length}`);
    cachedResults = results;
    displayResults(cachedResults);
  } catch (err) {
    console.error("Error fetching data:", err);
    document.getElementById("objectsContainer").innerHTML = `<p class='text-danger'>Error fetching data. Please try again later.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchResults(); // Initial load

  // Info panel//
  const infoButton = document.getElementById('info-button');
  const infoPanel = document.getElementById('info-panel');
  const closePanel = document.getElementById('close-panel');

  infoButton.addEventListener('click', () => {
    infoPanel.classList.toggle('open');
  });

  closePanel.addEventListener('click', (e) => {
    e.preventDefault();
    infoPanel.classList.remove('open');
  });

  // Add event listener for the filter button
  document.getElementById("applyFilters").addEventListener("click", () => {
    const colour = document.getElementById("filterColour").value;
    let country = document.getElementById("filterCountry").value;
    const medium = document.getElementById("filterMedium").value;
    const year = document.getElementById("filterYear").value;
    let newQuery = "https://api.collection.nfsa.gov.au/search?query=advertisement&hasMedia=yes";
    
    if (colour) {
      newQuery += `&colour=${encodeURIComponent(colour)}`;
    }

    if (country) {
      if (country === "U.S.A") {
        country = "U%2ES%2EA";
      }
      newQuery += `&countries=${country}`;
    }

    if (medium) {
      newQuery += `&subMedium=${encodeURIComponent(medium)}`;
    }

    if (year) {
      newQuery += `&year=${year}`;
    }
    
    currentQueryUrl = newQuery;
    fetchResults(); // Re-fetch with the new filter
  });

  // Back to top button logic//
  const backToTopButton = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
 
//Diaplay results on the page//
function displayResults(results) {
  document.body.classList.remove('details-view');
 const container = document.getElementById("objectsContainer");
 container.innerHTML = ""; // Clear previous

 //check  if item has an image, otherwise use placeholder//
 results.forEach(item => {
   console.log(item.id);
   let img;
   if (item.preview && item.preview[0]) {
     if (item.preview[0].type === 'video') {
       img = `https://media.nfsacollection.net/${item.preview[0].thumbnailFilePath}`;
     } else if (item.preview[0].type === 'audio') {
       img = "assets/imgs/audio_wave.jpg";
     } else {
       img = `https://media.nfsacollection.net/${item.preview[0].filePath}`;
     }
   } else {
     img = "https://via.placeholder.com/400x200?text=No+Image";
   }

  //Bootstrap card for each item//
   const card = document.createElement("div");
   card.classList.add("col-md-4"); //Bootstrap column

   //Add title, name and image to card//
   card.innerHTML = `
     <div class="card">
       <img src="${img}" class="card-img-top" alt="${item.title || "Untitled"}">
       <div class="card-body">
         <div class="card-details">
           <h5 class="card-title">${item.title || "Untitled"}</h5>
           <p class="card-text mb-4">${item.name || ""}</p>
           <a href="#" class="view-details-btn" data-id="${item.id}">View Details</a>
         </div>
       </div>
     </div>
   `;

   //Add card onto page//
   container.appendChild(card);
 });

 // Add click event for details
 document.querySelectorAll(".view-details-btn").forEach(btn => {
   btn.addEventListener("click", e => loadItemDetails(e.target.dataset.id));
 });
} 


//Items//
//function to load details for a single item by its ID//
async function loadItemDetails(id) {
  document.body.classList.add('details-view');
 //grab the container where content is displayed//
 const output = document.getElementById("objectsContainer");
 //show temporary loading message//
 output.innerHTML = "<p>Loading item details...</p>"; 

 try {
  //fetch details for the single item from the NFSA API//
   const response = await fetch(`https://api.collection.nfsa.gov.au/title/${id}`); 
   //convert reponse to JSON format//
   const item = await response.json();

   let img = "https://via.placeholder.com/400x200?text=No+Image"; // Default placeholder

   if (item.media && Array.isArray(item.media)) {
     const accessCopy = item.media.find(m => m.itemUsage === 'Access/Browsing copy');
     if (accessCopy && accessCopy.preview && accessCopy.preview.filePath) {
       img = `https://media.nfsacollection.net/${accessCopy.preview.filePath}`;
     }
   }

  //replace container with content with item details//
   output.innerHTML = `
     <div class="details-container">
       <button id="backBtn" class="btn btn-secondary mb-3">← Back to Gallery</button>
       <div class="row">
         <div class="details-image-col">
           <div class="image-container">
             <img src="${img}" class="img-fluid" alt="${item.title || "Untitled"}">
           </div>
         </div>
         <div class="details-text-col">
           <h2>${item.title || "Untitled"}</h2>
           <p>${item.summary || ""}</p>
           <ul class="list-group list-group-flush">
             <li class="list-group-item"><strong>Date:</strong> ${item.productionDates && item.productionDates[0] ? item.productionDates[0].fromYear : 'N/A'}</li>
             <li class="list-group-item"><strong>Country:</strong> ${item.countries ? item.countries.join(', ') : 'N/A'}</li>
             <li class="list-group-item"><strong>Medium:</strong> ${item.subMedium || 'N/A'}</li>
             <li class="list-group-item"><strong>Form:</strong> ${item.forms ? item.forms.join(', ') : 'N/A'}</li>
           </ul>
         </div>
       </div>
     </div>
   `;

   //event listener for 'back button' - when clicked it reloads previosuly cached gallery results//
   document.getElementById("backBtn").addEventListener("click", () => displayResults(cachedResults));

 } catch (err) {
  //if theres error fetching -> logs and shows error message//
   console.error("Error fetching item details:", err);
   output.innerHTML = "<p class='text-danger'>Error loading details.</p>";
 }
} 

