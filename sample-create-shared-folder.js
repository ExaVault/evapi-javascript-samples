// Load environment variables from .env file
require('dotenv').config();
const moment = require('moment');

/**
 * create-shared-folder.js - Use the SharesApi to create a shared folder with a password
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
const evAccountUrl = process.env.EV_ACCOUNT_URL;

// We are demonstrating the use of the SharesApi, which is used for managing shared folders and receives,
// as well as for sending files. See our Sharing 101 documentation at
// https://www.exavault.com/docs/account/05-file-sharing/00-file-sharing-101

// For this demo, we'll create a share for a new folders. If you have an existing file or folder that you want to use 
// for the share, you won't need this step where we use the ResourcesApi to create the folders first.
//
// We have to override the default configuration of the API object with an account name so that our code
//  will reach the correct URL for the api. We have to override this setting for each of the API classes we use
const ApiClient = new ExaVaultApi.ApiClient();
ApiClient.basePath = evAccountUrl;

const resourcesApi = new ExaVaultApi.ResourcesApi(ApiClient);

// We will create a new folder for the demo. The folder will have a different name each time you run this script
const path = '/api-sample-code/share-sample-' + moment().unix();

// We have to pass the evApiKey and evAccessToken with every API call. 
resourcesApi.addFolder(
  evApiKey,
  evAccessToken,
  {
    'body': {
      'path': path,
    }
  },
  addFolderCallback
);

// When folder created this callback will be called
// See https://www.exavault.com/developer/api-docs/#operation/addFolder for the details of the response object that is passed as `data` argument to this callback
function addFolderCallback(error, data) {

  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {

    const resourceId = data.data.id;
    const sharePassword = "testpassworD1";

    console.log(`Created new folder ${path}`);

    // Now we can use the SharesApi to share the folder.
    // We have to override the default configuration of the API object with an updated account name so that our code
    // will reach the correct URL for the api.
    const sharesApi = new ExaVaultApi.SharesApi(ApiClient);
    
    // API methods that take a JSON body, such as the addShare method, require us to submit an object with the 
    // parameters we want to send to the API. 
    // See https://www.exavault.com/developer/api-docs/#operation/addShare for the request body schema

    // - We want to add a password to our folder
    // - We are also going to allow visitors to upload and download
    // - Note that the `resources` parameter variable contains resource identifier to the folder that was created earlier
    // - We could also have used the full path to the folder
    const requestBody = {
      'body': {
        "type": "shared_folder",
        "name": "test sfdsdfs",
        "resources": ["id:" + resourceId],
        "password": sharePassword,
        "accessMode": {
          "download": true,
          "upload": true
        }
      }
    };

    // We have to pass the evApiKey and evAccessToken with every API call. 
    sharesApi.addShare(
      evApiKey,
      evAccessToken,
      requestBody,
      addShareCallback
    );

    // Log information in a callback function
    function addShareCallback(error, result) {
      if (error) {
        console.error(error.response ? "Error: " + error.response.text : error);
      } else {
        console.log(`Created shared folder ${result.data.attributes.hash} for ${path}`);
        console.log(`Password to access the folder is ${sharePassword}`);
      }
    }
  }
}