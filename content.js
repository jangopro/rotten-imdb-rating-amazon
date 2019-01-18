var movieData = null;
const apiKey = "7dbc1175";

var parent = document.querySelector(".swatchElement.selected");
var isMovie = false;

if(parent) {
  var isBluRay = parent.querySelector('.a-button-text').innerText.search("Blu-ray") !== -1;
  var isDVD = parent.querySelector('.a-button-text').innerText.search("DVD") !== -1;
  var is4k = parent.querySelector('.a-button-text').innerText.search("4K") !== -1;
  isMovie = isBluRay || isDVD || is4k;
}
console.log(isMovie)

if (isMovie) {
  getMovieTitle();
  callApi();
} else {
  console.log('Not a movie');
}


function getMovieTitle() {
  let movieTitle = document.querySelector("#productTitle").textContent;

  let indexOf = movieTitle.indexOf("[");
  movieTitle = movieTitle.slice(0, indexOf);

  let indexOf2 = movieTitle.indexOf("(");
  movieTitle = movieTitle.slice(0, indexOf2);

  return movieTitle.trim();
}

function callApi() {
  const movieTitle = getMovieTitle();
  console.log(movieTitle);

  fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`)
    .then(rawMovieData => {
      return rawMovieData.json();
    })
    .then(movieData => {
      getRatings(movieData);
    })
    .catch(err => {
      console.log(err);
    });
}

function getRatings(movieData) {
  const ratings = movieData.Ratings;
  const rottenTomatoes = ratings.filter(rating => {
    return rating.Source == "Rotten Tomatoes";
  });
  const imdbRating = ratings.filter(rating => {
    return rating.Source == "Internet Movie Database";
  });
  if (rottenTomatoes) {
    displayRTRating(rottenTomatoes);
  }
  if (imdbRating) {
    displayIMDbRating(imdbRating);
  }
}

function displayRTRating(rottenTomatoesRating) {
  const rtRatingNode = document.createElement("DIV");
  const textnode = document.createTextNode(rottenTomatoesRating[0].Value);
  rtRatingNode.appendChild(textnode);
  document.querySelector("#averageCustomerReviews").appendChild(rtRatingNode);
}

function displayIMDbRating(imdbRating) {
  document.querySelector("#averageCustomerReviews").append(imdbRating[0].Value);
}
