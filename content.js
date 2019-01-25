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
  console.log(movieData)
  const ratings = movieData.Ratings;
  const imdbAlreadyExistingSelector = document.querySelector('.imdb-rating');
  const rottenTomatoes = ratings.filter(rating => {
    return rating.Source == "Rotten Tomatoes";
  });
  const imdbRating = ratings.filter(rating => {
    return rating.Source == "Internet Movie Database";
  });

  if (rottenTomatoes.length > 0) {
    displayRTRating(rottenTomatoes, imdbAlreadyExistingSelector);
  }

  if (imdbRating.length > 0 && imdbAlreadyExistingSelector === null) {
    displayIMDbRating(imdbRating);
  }
}

function displayRTRating(rottenTomatoesRating, differentLayout) {
  const rtRatingNode = document.createElement("DIV");
  const rtRatingClassNode = document.createElement("SPAN");
  const textnode = document.createTextNode(rottenTomatoesRating[0].Value);
  let rottenStatus = 'fresh';
  const ratingNumber = rottenTomatoesRating[0].Value.slice(0, -1);
  
  console.log(ratingNumber)

  if(parseInt(ratingNumber) < 60) {

    rottenStatus = 'rotten';
  }

  rtRatingClassNode.classList.add('rating-other-source',`rt-${rottenStatus}-rating`);



  rtRatingNode.appendChild(rtRatingClassNode);
  rtRatingNode.appendChild(textnode);

  if(differentLayout) {
    rtRatingNode.classList.add('rating-rt-with-imdb');
    appendNewRatingsNewPlace(rtRatingNode);
  } else {
    appendNewRatings(rtRatingNode);
  }

}

function displayIMDbRating(imdbRating) {
  const imdbRatingNode = document.createElement("DIV");
  const imdbRatingClassNode = document.createElement("SPAN");
  const textnode = document.createTextNode(imdbRating[0].Value);

  imdbRatingClassNode.classList.add('rating-other-source','imdb-rating')

  imdbRatingNode.appendChild(imdbRatingClassNode);
  imdbRatingNode.appendChild(textnode);

  appendNewRatings(imdbRatingNode);
}

function appendNewRatings(node) {
  const selectionExists = document.querySelector('#averageCustomerReviews') !== null;
  
  if(selectionExists) {
    document.querySelector("#averageCustomerReviews").append(node);
  } else {
    document.querySelector("#bylineInfo_feature_div").append(node);
  }
}

function appendNewRatingsNewPlace(node) {
  let seperator = document.createElement("I");
  seperator.classList.add('a-icon','a-icon-text-separator');
  node.prepend(seperator);
  document.querySelector('#imdbInfo_feature_div').append(node);
}
