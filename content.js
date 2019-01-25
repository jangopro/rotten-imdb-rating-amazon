const apiKey = "7dbc1175";
let movieData = null;

const parent = document.querySelector(".swatchElement.selected");
let isMovie = false;

if(parent) {
  let isBluRay = parent.querySelector('.a-button-text').innerText.search("Blu-ray") !== -1;
  let isDVD = parent.querySelector('.a-button-text').innerText.search("DVD") !== -1;
  let is4k = parent.querySelector('.a-button-text').innerText.search("4K") !== -1;
  isMovie = isBluRay || isDVD || is4k;
}

if (isMovie) {
  getMovieTitle();
  callApi();
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
      if(!movieData.Error) {
        getRatings(movieData);
      }
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
  const textNode = document.createTextNode(rottenTomatoesRating[0].Value);
  const ratingNumber = rottenTomatoesRating[0].Value.slice(0, -1);
  
  let rottenStatus = 'fresh';

  if(parseInt(ratingNumber) < 60) {
    rottenStatus = 'rotten';
  }

  rtRatingClassNode.classList.add('rating-other-source',`rt-${rottenStatus}-rating`);

  rtRatingNode.appendChild(rtRatingClassNode);
  rtRatingNode.appendChild(textNode);

  if(differentLayout) {
    rtRatingNode.classList.add('rating-rt-with-imdb');
    appendNewRatingsNewPlace(rtRatingNode);
  } else {
    appendNewRatings(rtRatingNode);
  }

}

function displayIMDbRating(imdbRating) {
  const imdbRatingNode = createNode(imdbRating[0].Value, 'imdb-rating');

  appendNewRatings(imdbRatingNode);
}

function createNode(rating, className) {
  const divNode = document.createElement("DIV");
  const spanNode = document.createElement("SPAN");
  const ratingText = document.createTextNode(rating);

  spanNode.classList.add('rating-other-source', className)

  divNode.appendChild(spanNode);
  divNode.appendChild(ratingText);

  return divNode;
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
