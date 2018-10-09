// authenication keys for the twitter file to work ==================================
var keys = require("./keys.js");
// require twitter's premade javascript file to work on pulling tweets for me ========= 
var Twitter = require("twitter");
// require spotify to pull information from their API ============== 
var Spotify = require('node-spotify-api');
// require request for the OMDB to work! =============
var request = require('request');
// require file system to use with random.txt file =================
var fs = require('file-system');


// user input variables below ==================

var argOne = process.argv[2];
var argTwo = process.argv[3];

switch (argOne) {
  case "my-tweets":
    tweets();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    liri();
    break;

  default:
    console.log("LIRI does not know that command"); 
}
// Twitter showing donald trump's last 20 tweets function ====================
function tweets() {
	var client = new Twitter(keys.twitterKeys);
  var search = argTwo;
var params = {screen_name: search}; 
client.get('statuses/user_timeline', params, function(error, tweets) {
  if (!error) {
    for(let i = 0; i < tweets.length; i++){
    	console.log("===========================")
    	console.log(tweets[0].user.name)   
    	console.log(tweets[i].text)    
    }
    console.log(tweets.length)

  }
});
}
// Twitter function above!^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Spotify search engine Function==============================================
function spotify() {
var songName = argTwo;
var spotify = new Spotify(keys.spotifyKeys);

var getArtistNames = function(artist) {
  return artist.name;
}
 
spotify.search({ type: 'track', query: songName, limit: 20}, function(err, data) {
  if (err) {
    console.log('Error occurred: ' + err);
    return; 
  }

  var songs = data.tracks.items;
  for (var i = 0; i < songs.length; i++) {
    console.log(i);
    console.log("Artist(s): " + songs[i].artists.map (
      getArtistNames));
    console.log("Song Name: " + songs[i].name);
    console.log("Preview Song: " + songs[i].external_urls.spotify);
    console.log("Album: " + songs[i].album.name);
    console.log("========================================================")
  } 
});
}
// Spotify function above ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// OMDB search engine Function ===================================================

function movie() {
  var movieName = argTwo;
  request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName, function (error, response, body) {
    if (error) {
      console.log("An error has occurred: " + error);
      console.log('statusCode:', response && response.statusCode);
    }
  // console.log('body:', body);
  var jsonData = JSON.parse(body);
  
  console.log('Movie Title: ' + jsonData.Title);
  console.log('Release Year: ' + jsonData.Year);
  console.log('IMDB Rating: ' + jsonData.imdbRating);
  console.log('Rotten Tomato Rating: ' + jsonData.Ratings[1].Value);
  console.log('Country of Origin: ' + jsonData.Country);
  console.log('Movie Language(s): ' + jsonData.Language);
  console.log('Movie Plot: ' + jsonData.Plot);
  console.log("Movie's Actors: " + jsonData.Actors);
});
}
// OMDB function above ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// LIRI function to use text from a file instead of user input =====================

function liri() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
  if (err) throw err;
  console.log("This is what the random.txt file command is: " + data);

  var dataArray = data.split(",");
  // console.log(dataArray[0]);
  // console.log(dataArray[1]);
    if (dataArray[0] === "spotify-this-song") {
        argOne = dataArray[0];
        argTwo = dataArray[1];
        spotify();
    } else if (dataArray[0] === "my-tweets") {
        argOne = dataArray[0];
        argTwo = dataArray[1];
        tweets();
    } else if (dataArray[0] === "movie-this") {
        argOne = dataArray[0];
        argTwo = dataArray[1];
        movie();
    } else {
      console.log("LIRI does not understand that command, review text in random.txt.");
    }
  });
}
