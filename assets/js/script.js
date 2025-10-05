let cachedResults = [];// Stores results from API//
let allResults = []; // Our variable to hold all items
let currentQueryUrl = "https://api.collection.nfsa.gov.au/search?query=advertisement&hasMedia=yes"; //API URL for search//

//Initial load - clicking 'back' reloads the cached list//
document.addEventListener("DOMContentLoaded", () => {
 fetchResults(); // Fetch initial data on first page//
});

//Function to get data from ALL pages//
async function fetchResults() {
 try {
  const totalPages = 23; // There are 23 pages total.
  allResults = []; // Clear the list before fetching

  // Loop through all 23 pages
  for (let i = 1; i <= totalPages; i++) {
    console.log(`Fetching page ${i}...`); // Log progress
    const response = await fetch(`${currentQueryUrl}&page=${i}`);
    const data = await response.json();
    
    // Add the results from the current page to our main list
    if (data.results) { // Check if results exist to avoid errors
        allResults = allResults.concat(data.results);
    }
  }

   console.log(`Finished fetching. Total items: ${allResults.length}`);
   // Now that we have everything, update the cache and display it all
   displayResults(allResults);

 } catch (err) {
   console.error("Error fetching data:", err);
   document.getElementById("objectsContainer").innerHTML =
     `<p class='text-danger'>Error fetching data. Please try again later.</p>`;
 }
}
 
//Diaplay results on the page//
function displayResults(results) {
 const container = document.getElementById("objectsContainer");
 container.innerHTML = ""; // Clear previous

 //check  if item has an image, otherwise use placeholder//
 results.forEach(item => {
   const img = (item.preview && item.preview[0]?.filePath)
               ? `https://media.nfsacollection.net/${item.preview[0].filePath}`
               : "https://via.placeholder.com/400x200?text=No+Image";

  //Bootstrap card for each item//
   const card = document.createElement("div");
   card.classList.add("col-md-4"); //Bootstrap column

   //Add title, name and image to card//
   card.innerHTML = `
     <div class="card h-100">
       <img src="${img}" class="card-img-top" alt="${item.title || "Untitled"}">
       <div class="card-body d-flex flex-column">
         <h5 class="card-title">${item.title || "Untitled"}</h5>
         <p class="card-text mb-4">${item.name || ""}</p>
         <button class="btn btn-sm btn-outline-primary mt-auto viewBtn" data-id="${item.id}">View Details</button>
       </div>
     </div>
   `;

   //Add card onto page//
   container.appendChild(card);
 });

 // Add click event for details
 document.querySelectorAll(".viewBtn").forEach(btn => {
   btn.addEventListener("click", e => loadItemDetails(e.target.dataset.id));
 });
} 


//Items//
//function to load details for a single item by its ID//
async function loadItemDetails(id) {
 //grab the container where content is displayed//
 const output = document.getElementById("objectsContainer");
 //show temporary loading message//
 output.innerHTML = "<p>Loading item details...</p>"; 

 try {
  //fetch details for the single item from the NFSA API//
   const response = await fetch(`https://api.collection.nfsa.gov.au/title/${id}`); 
   //convert reponse to JSON format//
   const item = await response.json();

   //check if item has an image, if not, use placeholder//
   const img = (item.preview && item.preview[0]?.filePath)
               ? `https://media.nfsacollection.net/${item.preview[0].filePath}`
               : "https://via.placeholder.com/400x200?text=No+Image";

  //replace container with content with item details//
   output.innerHTML = `
     <button id="backBtn" class="btn btn-secondary mb-3">← Back to Gallery</button>
     <div class="card">
       <img src="${img}" class="card-img-top" alt="${item.title || "Untitled"}">
       <div class="card-body">
         <h2 class="card-title">${item.title || "Untitled"}</h2>
         <p class="card-text">${item.name || ""}</p>
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

