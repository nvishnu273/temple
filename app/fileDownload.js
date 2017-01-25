var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var path = require('path'); 

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'temp-downloader.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), getFiles);
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
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
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
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
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
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  var service = google.drive('v3');
  
  //mimeType = 'application/vnd.google-apps.folder'
  service.files.list({
    auth: auth,
    pageSize: 100,
    fields: "nextPageToken, files(id, name)"
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      console.log('Files:');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.name, file.id);
      }
    }
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getFiles(auth) {
  var service = google.drive('v3');
  console.log('searching files');
  //mimeType = 'application/vnd.google-apps.folder'
  service.files.list({
    auth: auth,
    //alt:"media",
    //q: "mimeType=application/vnd.google-apps.document",
    pageSize: 1000,
    fileId:"1hfXAW8kdXpphIoJMISb6KO04eHJ1Y1utb_vvNt2yno8",
    fields: "files(id, name, parents)",
    //fileId:"0Bx013rRCophyQzlyRFFkc2lhelE"
    //tx file: 1hfXAW8kdXpphIoJMISb6KO04eHJ1Y1utb_vvNt2yno8
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    
    for(var i=0;i<response.files.length;i++){
        
        if (response.files[i].parents != undefined) {
            if (response.files[i].parents[0]=="0Bx013rRCophyQzlyRFFkc2lhelE") {
                var fn='/users/vishnu/apps/temple/docs/'+response.files[i].name+'.txt';
                if (!fs.existsSync(fn)) {
                    var dest = fs.createWriteStream(fn);
                    service.files.export({
                        auth:auth,
                        fileId: response.files[i].id,
                        mimeType: 'text/plain'
                    })
                    .on('end', function() {
                        console.log('Done');
                    })
                    .on('error', function(err) {
                        console.log('Error during download', err);
                    })
                    .pipe(dest);
                }
               
            }
        }
    }
    
    /*
    var dest = fs.createWriteStream('/users/vishnu/apps/temple/docs/'+response.id+'-tmp.txt');
    service.files.export({
        auth:auth,
        fileId: response.id,
        mimeType: 'text/plain'
    })
    .on('end', function() {
        console.log('Done');
    })
    .on('error', function(err) {
        console.log('Error during download', err);
    })
    .pipe(dest);
    */
  });
}