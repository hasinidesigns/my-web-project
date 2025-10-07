document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const video = document.getElementById("myVideo");
    console.log("Video element:", video);

    const startTime = 50;
    const endTime = 66;

    video.addEventListener('loadedmetadata', function() {
        console.log('Video metadata loaded.');
        video.currentTime = startTime;
        video.play();
    });

    video.addEventListener('error', function() {
        console.error('Error loading video.');
    });

    video.addEventListener("timeupdate", function() {
        console.log("Current time:", video.currentTime);
        if (video.currentTime >= endTime) {
            video.currentTime = startTime;
        }
    });
});
