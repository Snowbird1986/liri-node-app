require("dotenv").config();
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// console.log(process.argv[2])
// console.log(process.argv[3])
debugger;
inquirer.prompt([
    {
      type: "input",
      message: "What is your name?",
      name: "username"
    },
    {
      type: "password",
      message: "Input Password",
      name: "password",
      default:"password"
    },
    {
      type: "list",
      message: "What would you like to search?",
      choices: [ "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says" ],
      name: "searchType"
    },
    {
      type: "input",
      message: "What name would you like to search?",
      name: "searchName"
    },
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    }
    ])
    .then(answers => {
      // Use user feedback for... whatever!!
      if (answers.password=="password") {
        //   console.log("\nWelcome " + answers.username);
        //   console.log("\nYou want to search for "+answers.searchType+".");
        //   console.log(answers.searchName)
          debugger;
        
        switch (answers.searchType) {
            case 'my-tweets':
                var params = {screen_name: 'Snowbir77137002',
                            count:20};
                client.get('statuses/user_timeline', params, function(error, tweets, response) {
                    if (!error) {
                    console.log(tweets);
                    }
                });
                break;
            case `spotify-this-song`:
                if(answers.searchName==""){
                    answers.searchName="Something to be proud of"
                }
                spotify.search({ type: 'track', query: answers.searchName, limit:1 }, function(err, data) {
                    if (err) {
                    return console.log('Error occurred: ' + err);
                    }
                
                // console.log(JSON.stringify(data)); 
                console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
                console.log("Tract: "+data.tracks.items[0].name);
                console.log("Preview Link: "+data.tracks.items[0].preview_url);
                console.log("Album: "+data.tracks.items[0].album.name);
                });
                break;
            case `movie-this`:
                if(answers.searchName==""){
                    answers.searchName="Fireproof"
                }
                request("http://www.omdbapi.com/?t="+answers.searchName+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {
            
                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                //   console.log(body);
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Released: " + JSON.parse(body).Year);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                //   console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
                }
            });
                break;
            case `do-what-it-says`:
                fs.readFile("random.txt", "utf8", function(error, data) {

                    // If the code experiences any errors it will log the error to the console.
                    if (error) {
                    return console.log(error);
                    }
                
                    // We will then print the contents of data
                    console.log(data);
                
                    // Then split it by commas (to make it more readable)
                    var dataArr = data.split(",");
                
                    // We will then re-display the content as an array for later use.
                    spotify.search({ type: 'track', query: dataArr[1], limit:1 }, function(err, data) {
                        if (err) {
                        return console.log('Error occurred: ' + err);
                        }
                    
                        // console.log(JSON.stringify(data)); 
                        console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
                        console.log("Tract: "+data.tracks.items[0].name);
                        console.log("Preview Link: "+data.tracks.items[0].preview_url);
                        console.log("Album: "+data.tracks.items[0].album.name);
                        });
                });
                break;
            default:
                console.log("Incorrect input")
        }
    }
    else {
    console.log("\nIncorrect Password.  Please try again.\n");
    }

    }).catch(function(err){
    console.log(err);
    });