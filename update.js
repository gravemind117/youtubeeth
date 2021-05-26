const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const https = require('https');
let priceNow = "";
const fetch = require('node-fetch');
const { time } = require("console");

let url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

let settings = { method: "Get" };

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        priceNow = json;
});


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-updater.json";

const youtube = google.youtube("v3");
const VIDEO_ID = "ppslF1Sj7_I";

// Load client secrets from a local file.
fs.readFile("credentials.json", function processClientSecrets(err, content) {
  if (err) {
    console.log("Error loading client secret file: " + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content), makeAuthCall);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log("Error while trying to retrieve access token", err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

// COde above here is from the Google Docs

const makeAuthCall = (auth) => {
  youtube.videos.list(
    {
      auth: auth,
      id: VIDEO_ID,
      part: "id,snippet,statistics",
    },
    (err, response) => {
      if (err) {
        console.log(`some shit went wrong ${err}`);
        return;
      }

      if (response.data.items[0]) {
        // We have found the video and the details
        console.log(`We found the video, now updating...`);
        updateVideoTitle(response.data.items[0], auth);
      }
    }
  );
};

const updateVideoTitle = (video, auth) => {
  console.log(priceNow);
  const usd = priceNow.ethereum.usd;
  console.log(usd);
  const timeInMss = new Date;
  const dt = timeInMss.toGMTString();
  let descrip = "Ethereum price Updates in Title";
  descript = "\r\nAuthor: https://www.reddit.com/user/gravemindx";
  descrip += "\r\nMusic : https://www.bensound.com/royalty-free-music/cinematic";
  descrip +=  "\r\nOrig Vid: https://www.reddit.com/r/ethereum/comments/nl1n4w/since_im_a_great_fanboy_of_ethereum_i_created/";
  descrip += "\r\nInspiration: https://www.youtube.com/watch?v=BxV14h0kFs0";
  descrip += "\r\nDonate ===============================";
  descrip += "\r\nGravemind: 0xE201Fa932724229Cb614ee1938E17C8Cf189C33E";
  descrip += "\r\nCross_De_Lena: 0x525f7c2c2a7f17f5827eda095ed3418ee991829b";
  descrip += "\r\nDonate ===============================";
  descrip += "\r\nUpdated " + dt;


  youtube.videos.update(
    {
      auth: auth,
            part: 'snippet',
            resource: {
                id: VIDEO_ID,
                snippet: {
                    title: `Ethereum price $ ${usd} USD at ` + dt,
                    description: descrip,
                    categoryId: 23
          }
      }
    },
    (err, response) => {
      //console.log(response);
      if (err) {
        console.log(`There was an error updating ${err}`);
        return;
      }
      if (response.data.items) {
        console.log("Done");
      }
    }
  );
};
