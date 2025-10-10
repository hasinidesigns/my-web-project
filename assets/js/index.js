// Run this code when the page has fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

     // Get the video element by its ID
    const video = document.getElementById("myVideo");
    // Get the "Explore" button element
    const exploreButton = document.querySelector('.explore-button');
    console.log("Video element:", video); // Log the video element to check it exists

    // Set the part of the video to play
    const startTime = 50;
    const endTime = 66;

    // When video metadata (duration) has loaded
    video.addEventListener('loadedmetadata', function() {
        console.log('Video metadata loaded.');
        video.currentTime = startTime; //start at 50s
        video.play(); //play video
    });

    // If the video fails to load, log an error
    video.addEventListener('error', function() {
        console.error('Error loading video.');
    });

    // Continuously check the current time of the video
    video.addEventListener("timeupdate", function() { 
        console.log("Current time:", video.currentTime); //log current time
        if (video.currentTime >= endTime) {
            video.currentTime = startTime; // Loop back to start time when reaching end
        }
    });

    // When the "Explore" button is clicked
    exploreButton.addEventListener('click', function(e) {
        e.preventDefault(); // Stop the default link 
        
        // Add a fade-out effect to the page when clicking arrow button
        document.body.classList.add('fade-out');
        
        // After 0.5 seconds, navigate to the page linked in the button
        setTimeout(function() {
            window.location.href = exploreButton.href;
        }, 500);
    });
});