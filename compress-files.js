// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const fs = require('fs');

/**
 * compress-files.js - Use the Resources API to compress files 
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

// We are demonstrating the use of the ResourcesApi, which is used for file operations (upload, download, delete, etc)
//
// For this demo, we'll create a new folder and upload some files into it. Then we'll compress some of the files into
// a new zip file in the folder

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

  // Call compress function when all files have been uploaded
  if (filesUploaded === fileNumber) {
    compressFiles();
  }
}

// Upload the same file as multiple file names for testing
for (let i = 0; i < fileNumber; i++) {
  // The uploadFile method of the ResourcesApi class will let us upload a file to our account
  // See https://www.exavault.com/developer/api-docs/#operation/uploadFile for the details of this method
  api.uploadFile(evApiKey, evAccessToken, '/api-sample-code/users' + i + '.csv', stat.size, {'file': file}, uploadCallback);
}

// Next we are going to use the same ResourcesApi to compress those files into a zip file
// This function called when all files uploaded
// Compressing files doesn't remove the files from the account
function compressFiles() {

  // Call api method to list all files in a folder
  api.listResources(
    evApiKey,
    evAccessToken,
    "/api-sample-code",
    {},
    callback
  );

  // This callback will be called when file list is available
  function callback (error, data) {

    if (error) {
      console.error(error.response ? "Error: " + error.response.text : error);
    } else {

      // In the response data we have array with resources, so we need to collect all IDs, that will be passed to the compress function
      const resourceIds = data.data.map(resource => 'id:' + resource.id);

      // API methods that take a JSON body, such as the compressFiles method, require us to submit an object with the 
      // parameters we want to send to the API. 
      // See https://www.exavault.com/developer/api-docs/#operation/compressFiles for the request body schema
      //
      // This will overwrite an existing zip file with a new one
      api.compressFiles(
        evApiKey,
        evAccessToken,
        {
          'body': {
            'resources': resourceIds,
            'parentResource': '/api-sample-code',
            'archiveName': 'compress-sample.zip'
          }
        },
        compressCallback
      );

      // When compress completes call callback function
      function compressCallback (error, data) {
        if (error) {
          console.error(error.response ? "Error: " + error.response.text : error);
        } else {
          console.log('Files compressed successfully to ' + data.data.attributes.path);
        }
      };
    }
  };
}