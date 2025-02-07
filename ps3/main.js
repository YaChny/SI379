//After the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    //Grab detail information displayed
    const thumbnailsContainer = document.getElementById("thumbnails");
    const selectedImage = document.getElementById("selected-image");
    const selectedTitle = document.getElementById("selected-title");
    const selectedDate = document.getElementById("selected-date");
    const selectedDescription = document.getElementById("selected-description");
  
    //Set events array to get lists of events
    let events = [];
    let selectedIndex = 0;
    let timer;
  
    // Load events using getUMEventsWithImages into the events list and initialize the carousel
    getUMEventsWithImages((eventData) => {
      events = eventData;
      if (events.length > 0) {
        renderThumbnails();
        setSelectedIndex(0);
        startAutoAdvance();
      }
    });

    function renderThumbnails() {
        thumbnailsContainer.innerHTML = "";
        events.forEach((event, index) => {
          const thumbnail = document.createElement("img");
          thumbnail.src = event.styled_images.event_thumb;
          thumbnail.id = `thumb-${index}`;
          thumbnail.addEventListener("click", () => {
            setSelectedIndex(index);
            resetAutoAdvance();
          });
          thumbnailsContainer.appendChild(thumbnail);
        });
      }
});

