// After the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Grab detail information of the selected & displayed content
    const thumbnailsContainer = document.querySelector("#thumbnails");
    const selectedImage = document.querySelector("#selected-image");
    const selectedTitle = document.querySelector("#selected-title");
    const selectedDate = document.querySelector("#selected-date");
    const selectedDescription = document.querySelector("#selected-description");
  
    // Set variables to store events, current selected index, and timer ID
    let events = [];
    let selectedIndex = 0;
    let timer;
  
    // Load events using getUMEventsWithImages into the events list and initialize the carousel
    getUMEventsWithImages((eventData) => {
        events = eventData;
        if (events.length > 0) {
        // Create and display thumbnails
        renderThumbnails();
        // Set the first event as selected
        setSelectedIndex(0);
        // Start the automatic carousel advance
        startAutoAdvance();
        }
    });

    // Render thumbnail images for each event
    function renderThumbnails() {
        // Clear any existing thumbnails
        thumbnailsContainer.innerHTML = "";
        events.forEach((event, index) => {
        // Create an img element for the thumbnail
        const thumbnail = document.createElement("img");
        // Set the image source to the event thumbnail link
        thumbnail.src = event.styled_images.event_thumb;
        // Assign a unique ID to the thumbnail
        thumbnail.id = `thumb-${index}`;
        
        // Add click event to select the thumbnail and reset auto-advance timer
        thumbnail.addEventListener("click", () => {
            // Select the clicked event
            setSelectedIndex(index);
            // Reset the timer for auto-advancement
            resetAutoAdvance();
        });
        // Append the thumbnail to the container
        thumbnailsContainer.appendChild(thumbnail);
        });
    }

    function setSelectedIndex(index) {
        // Update selected index
        selectedIndex = index;
    
        // Get the selected event and update event details on the page
        const event = events[selectedIndex];
        // Update the event image
        selectedImage.src = event.image_url;
        // Update the event title link
        selectedTitle.href = event.permalink;
        // Update & display the event title
        selectedTitle.textContent = event.event_title;
        // Parsing the string to a Date object
        selectedDate.textContent = getReadableTime(event.datetime_start);
        // Update & display the event description
        selectedDescription.textContent = event.description;
    
        // Update selected thumbnail by removing the class from all and adding it to the selected thumbnail
        document.querySelectorAll("#thumbnails img").forEach((img) => {
            // Remove the "selected" class
            img.classList.remove("selected");
        });
        // Add the current selected thumbnail
        document.querySelector(`#thumb-${index}`).classList.add("selected");
    }

    // Start automatic advancement of the carousel every 10 seconds
    function startAutoAdvance() {
        timer = setInterval(() => {
          setSelectedIndex((selectedIndex + 1) % events.length);
        }, 10000); // 10 seconds
    }
    
    // Reset the auto-advance timer when the user click on an event
    function resetAutoAdvance() {
        // Stop the current timer
        clearInterval(timer);
        // Restart the timer
        startAutoAdvance();
    }
});

