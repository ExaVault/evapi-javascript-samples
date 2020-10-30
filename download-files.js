// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const fs = require('fs');

/**
 * download-files.js - Use the ResourcesApi to download all of the CSV files found within a folder tree
 */

const ExaVaultApi = require('@exavault/exavault-api');

/**
 * To use this script, add your credentials to a file named .env which is located in the same directory as this script
 * 
 * Your API key will be the EV_API_KEY
 * Your access token will be EV_ACCESS_TOKEN
 * Your account name will be EV_ACCOUNT_NAME
 * 
 * To obtain your API Key and Token, you'll need to use the Developer page within the web file manager
 * See https://www.exavault.com/developer/api-docs/#section/Obtaining-Your-API-Key-and-Access-Token
 * 
 * Access tokens do not expire, so you should only need to obtain the key and token once.
 * 
 * Your account URL is determined by the name of your account. 
 * The URL that you will use is https://accountname.exavault.com/api/v2/ replacing the "accountname" part with your
 *   account name
 * See https://www.exavault.com/developer/api-docs/#section/Introduction/The-API-URL
 */
const evApiKey = process.env.EV_API_KEY;
const evAccessToken = process.env.EV_ACCESS_TOKEN;

// We are demonstrating the use of the ResourcesApi, which can be used to manage files and folders in your account

// We have to override the default configuration of the API object with an updated account name so that our code
//  will reach the correct URL for the api. We have to override this setting for each of the API classes we use
const api = new ExaVaultApi.ResourcesApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

// First upload some csv files into account
// Get full paths to the file from the samples directory
const filePath = path.resolve('./files/users.csv');
// Load file's stats to get its size
const stat = fs.statSync(filePath);
// Create stream from the file to consume it to the api
const file = fs.createReadStream(filePath);

const fileNumber = 5;
let filesUploaded = 0;

function uploadCallback() {
  // Count each uploaded file
  filesUploaded++;

  // Call download function when all files have been uploaded
  if (filesUploaded === fileNumber) {
    downloadFiles();
  }
}

// Upload the same file as multiple file names for testing
for (let i = 0; i < fileNumber; i++) {
  // The uploadFile method of the ResourcesApi class will let us upload a file to our account
  // See https://www.exavault.com/developer/api-docs/#operation/uploadFile for the details of this method
  api.uploadFile(evApiKey, evAccessToken, '/api-sample-code/users' + i + '.csv', stat.size, {'file': file}, uploadCallback);
}

// This is function that will be called when upload finishes
function downloadFiles() {

  // List all csv files in the folder
   // See https://www.exavault.com/developer/api-docs/#operation/listResources for the response schema
  api.listResources(
    evApiKey,
    evAccessToken,
    "/api-sample-code",
    {
      // Get only CSV files
      'name': '*.csv',
      // Higher limit of returned results can be used when needed,
      // but 100 will be enough we our sample
      'limit': 100
    },
    listCallback
  );

  // This callback will be called when file list is available
  function listCallback(error, data) {

    if (error) {
      console.error(error.response ? "Error: " + error.response.text : error);
    } else {

      console.log(`Found ${data.data.length} CSV file(s) to download`);

      // We are going to save the IDs of all the files we want to download into an array
      const resourceIds = data.data.map(resource => {
        console.log(resource.attributes.path);
        return 'id:' + resource.id;
      });

      // When download completes call callback function that saves a file
      const downloadCallback = function(error, data, response) {

        const downloadPath = path.resolve("./files/download-csv-sample.zip");

        // Write downloaded files to the archive
        // The body of the result is the binary content of our file(s), 
        // We write that content into a single file, named with .zip if there were multiple files 
        // downloaded
        fs.writeFile(downloadPath, response.body, function(error) {
          if (error) {
            console.error(error.response ? "Error: " + error.response.text : error);
          }

          console.log(`File(s) downloaded to ${downloadPath}`);
        });

        if (error) {
          console.error(error.response ? "Error: " + error.response.text : error);
        }
      };

      // Call download API method
      api.download(evApiKey, evAccessToken, resourceIds, {}, downloadCallback);
    }
  };
}