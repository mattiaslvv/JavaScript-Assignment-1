// Declare global variables and bind them to html elements by ID
var slider = document.getElementById("imageRange");
var output = document.getElementById("rangeValue");

// Display the slider value for amount of images to be shown
output.innerHTML = slider.value;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
};

//Initialize 2 empty arrays to display imgages + image title in lightbox
let lightboxPhotos = [];
let lightboxTitles = [];

// Find the lightbox overlay
var wrapper = document.getElementById("lightboxWrapper");

// Find navigation controls
var dismiss = document.getElementById("lightboxDismiss");
var prev = document.getElementById("lightboxPrev");
var next = document.getElementById("lightboxNext");

// Fetch function with async to get data via API
async function getPhotos() {
  const apiKey = "0e6f1413c3b36764051548d54b6d5cff"; // Declare variables that build the URL sent to API
  let method = "flickr.photos.search";
  let search = document.getElementById("search").value; // Decides what text String to send to API, based on input
  const baseURL = "https://api.flickr.com/services/rest";
  let imgAmount = slider.value; // Decides number of images shown, based on slider value
  let url = `${baseURL}?api_key=${apiKey}&method=${method}&text=${search}&per_page=${imgAmount}&format=json&nojsoncallback=1&safe_search=1&sort=relevance`;
  let response = await fetch(url); // Fetch API data with the URL built above
  let data = await response.json(); // Access the JSON response so it can be reached with JS
  showPhotos(data); // Call the function to show images and use the API data received
}

// Function used to create the type of element you pass in the parameters
function createNode(element) {
  return document.createElement(element);
}
// Function used to append the second parameter(element) to the first one
function append(parent, el) {
  return parent.appendChild(el);
}

// Function that retrieves data from API and creates IMG elements and appends them to IMG Container
function showPhotos(data) {
  // Clear previous lightbox arrays for new search
  lightboxPhotos = [];
  lightboxTitles = [];

  // Declare variable and bind it to imgcontainer
  let imgContainer = document.getElementById("imgContainer");

  // Clear previous searches
  imgContainer.innerHTML = "";

  // initialize variable that takes over photo information, easier to navigate with it
  let photos = data["photos"].photo;
  let index;

  // For loop that loops the same length as array sent back from API
  for (index = 0; index < photos.length; index++) {
    // Create HTML-element of type img
    let img = createNode("img");

    // Build img src url with the information sent back from API
    let t_url = `http://farm${photos[index].farm}.static.flickr.com/${photos[index].server}/${photos[index].id}_${photos[index].secret}_m.jpg`;

    // Set attributes of the img element created
    img.setAttribute("src", t_url);
    img.setAttribute("alt", photos[index].title);

    // Add class element so I can reach it later
    img.setAttribute("class", "thumbnail");

    // Set data-index attribute so navigation with next or previous in lightbox works
    img.setAttribute("data-index", index);

    // Nest the image inside the container
    append(imgContainer, img);

    // Add eventlistener on click to each img
    img.addEventListener("click", function() {
      // Call the lightbox function with the data-id of the img that is clicked
      lightbox(this.getAttribute("data-index"));
    });

    // load lightbox with data retrieved from API
    loadLightbox(photos, index);
  }
}

//API KEY: 0e6f1413c3b36764051548d54b6d5cff
//SECRET: eaafccd22a4f5a6a

// Function to push photos & photo titles into arrays, using data and index
function loadLightbox(data, index) {
  // Initialize a variable that creates an image element with src, alt and data-id
  let flickrURL = `<img src="http://farm${data[index].farm}.static.flickr.com/${data[index].server}/${data[index].id}_${data[index].secret}.jpg" alt="${data[index].title}" data-id"${index}"/>`;
  let flickrTitle = data[index].title;

  //Add images to the lightbox Array
  lightboxPhotos.push(flickrURL);

  // Add image title to the title array
  lightboxTitles.push(flickrTitle);
}

// Function that activates the modal window, takes image as parameter
function lightbox(dataID) {
  var theImage = lightboxPhotos[dataID];
  var theTitle = lightboxTitles[dataID];

  // Print to console to help show img elements attribute data id value
  console.log(dataID);

  // Set lightboxwrapper class active
  wrapper.setAttribute("class", "active");

  // Append previous and next data to the controls
  // Navigate through img data-index with data-id I set earlier
  // Using the current image +- 1 for next/prev
  prev.setAttribute("data-prev", parseInt(dataID) - 1);
  next.setAttribute("data-next", parseInt(dataID) + 1);

  // Updates the lightbox to show current image & title
  document.getElementById("lightboxImageContainer").innerHTML = theImage;
  document.getElementById("lightboxImageTitle").innerHTML = theTitle;

  // If statements that removes the lightbox next navigator at last image
  if (parseInt(dataID) === lightboxPhotos.length - 1) {
    next.style.display = "none";

    // Else if statement that removes lightbox prev navigator at first image
  } else if (parseInt(dataID) === 0) {
    prev.style.display = "none";
  } else {
    next.style.display = "block";
    prev.style.display = "block";
  }

  // Add eventlistener so that if you click away from the image, lightbox closes (By changing class to inactive)
  wrapper.addEventListener("click", e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    wrapper.setAttribute("class", "inactive");
  });
}

// Lightbox navigation controls
dismiss.onclick = function() {
  // Sets lightbox to inactive when the dismiss is clicked
  wrapper.setAttribute("class", "inactive");
};

// Onclick event used to go to previous image in lightbox
prev.onclick = function() {
  var prevImgID = this.getAttribute("data-prev");
  if (prevImgID >= 0) {
    lightbox(prevImgID);
  }
};

// Onclick event used to go to next image in lightbox
next.onclick = function() {
  var nextImgID = this.getAttribute("data-next");
  lightbox(nextImgID);
};
