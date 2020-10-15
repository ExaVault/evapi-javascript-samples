// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const moment = require('moment');

/**
 * upload-files.js - Use the ResourcesApi to upload a file to your account
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

// For this demo, we'll upload a file found in the same folder as this sample code.
//
// We are going to upload the file as a different name each time so that it is obvious that the file is being upload
// There are parameters to control whether files can be overwritten by repeated uploads
//
// We have to override the default configuration of the API object with an updated account name so that our code
//  will reach the correct URL for the api. We have to override this setting for each of the API classes we use
const api = new ExaVaultApi.ResourcesApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

// Get full paths to the file from the samples directory
const filePath = path.resolve('./files/dog.jpg');
// Load file's stats to get its size
const stat = fs.statSync(filePath);
// Create stream from the file to consume it to the api
const file = fs.createReadStream(filePath);
// We are uploading a sample file provided along with this script.
// It will have a different name in the account each time it is uploaded
const targetFileName = '/api-sample-code/dog-' + moment().unix() + '.jpg';

// The uploadFile method of the ResourcesApi class will let us upload a file to our account
// See https://www.exavault.com/developer/api-docs/#operation/uploadFile for the details of this method
//
api.uploadFile(evApiKey, evAccessToken, targetFileName, stat.size, {'file': file}, callback);

// This is callback function that gets called when upload completes
function callback(error, data) {
  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {
    console.log('File "' + data.data.attributes.path + '" uploaded successfully');
  }
};

