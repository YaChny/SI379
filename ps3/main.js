//After the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    //Grab detail information displayed
    const thumbnailsContainer = document.getElementById("thumbnails");
    const selectedImage = document.getElementById("selected-image");
    const selectedTitle = document.getElementById("selected-title");
    const selectedDate = document.getElementById("selected-date");
    const selectedDescription = document.getElementById("selected-description");
  
    //Set events array
    let events = [];
    let selectedIndex = 0;
    let timer;
  
    // Load events using getUMEventsWithImages and initialize the carousel
    getUMEventsWithImages((eventData) => {
      events = eventData;
      if (events.length > 0) {
        renderThumbnails();
        setSelectedIndex(0);
        startAutoAdvance();
      }
    });
});