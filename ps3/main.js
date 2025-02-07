//After the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    //Grab detail information displayed
    const thumbnailsContainer = document.querySelector("#thumbnails");
    const selectedImage = document.querySelector("#selected-image");
    const selectedTitle = document.querySelector("#selected-title");
    const selectedDate = document.querySelector("#selected-date");
    const selectedDescription = document.querySelector("#selected-description");
  
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

    function setSelectedIndex(index) {
        // Update selected index
        selectedIndex = index;
    
        // Update event details
        const event = events[selectedIndex];
        selectedImage.src = event.image_url;
        selectedTitle.href = event.permalink;
        selectedTitle.textContent = event.event_title;
        selectedDate.textContent = getReadableTime(event.datetime_start);
        selectedDescription.textContent = event.description;
    
        // Update thumbnail selection
        document.querySelectorAll("#thumbnails img").forEach((img) => {
          img.classList.remove("selected");
        });
        document.querySelector(`#thumb-${index}`).classList.add("selected");
    }

    function startAutoAdvance() {
        timer = setInterval(() => {
          setSelectedIndex((selectedIndex + 1) % events.length);
        }, 10000); // 10 seconds
    }
    
    function resetAutoAdvance() {
        clearInterval(timer);
        startAutoAdvance();
    }
});

