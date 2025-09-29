//Globals- stores search results//
let cachedResults = [];// Stores results from API//
let currentPage = 1;// Current page of results//
let currentQueryUrl = "https://api.collection.nfsa.gov.au/search?query=uk%20trailer"; //API URL for search//
let limit = 12;// Number of items per page//

//Initial load - clicking 'back' reloads the cached list//
document.addEventListener("DOMContentLoaded", () => {
 fetchResults(); // Fetch initial data on first page//

 // "Load More" button//
 document.getElementById("moreBtn").addEventListener("click", () => {
   currentPage++; //go to next page//
   fetchResults(true); // Fetch next page and find results from list//
 });
});

//Function to get data from API for the first page//
async function fetchResults(append = false) {
 try {
  //Fetch data from the API using the current page//
   const response = await fetch(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);
   const data = await response.json();

   //Update cached results//
   cachedResults = append ? cachedResults.concat(data.results) : data.results;
   displayResults(append ? data.results : cachedResults);
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
       </div>
     </div>
   `;
   //Add card onto page//
   container.appendChild(card);
 });

//'Load More' button to be visible at bottom of the page
 document.getElementById("moreBtn").style.display = "inline-block"; // Show load more
}


//Item function//
async function loadItemDetails(id) {
 const output = document.getElementById("objectsContainer");
 output.innerHTML = "<p>Loading item details...</p>";


 try {
  //Fetch details for single item//
   const response = await fetch(`https://api.collection.nfsa.gov.au/title/${id}`);
   const item = await response.json(); //Convert API to JSON//

  //Add 'back' button 
   document.getElementById("backBtn").addEventListener("click", () => displayResults(cachedResults));
 } catch (err) {
   console.error("Error fetching item details:", err);
   output.innerHTML = "<p class='text-danger'>Error loading details.</p>";
 }
}


