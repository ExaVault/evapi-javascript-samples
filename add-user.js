// Load environment variables from .env file
require('dotenv').config();
const moment = require('moment');

/**
 * add-user.js - Use the UsersApi to create a new user with a home directory
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

// We are demonstrating the use of the UsersApi, which is used to create, update and remove users in your account.
//
// We have to override the default configuration of the API object with an account name so that our code
//  will reach the correct URL for the api.
const api = new ExaVaultApi.UsersApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

// API methods that take a JSON body, such as the addUser method, require us to submit an object with the 
// parameters we want to send to the API. 
// See https://www.exavault.com/developer/api-docs/#operation/addUser for the request body schema
//
// We're going to use a timestamp as the username because usernames must be unique
// We have to pass the evApiKey and evAccessToken with every API call.
api.addUser(
  evApiKey,
  evAccessToken,
  // Passing object with user settings in the request body
  {
    'body': {
      email: "testuser@example.com",
      password: "testpassworD1",
      homeResource: "/",
      permissions: {
        "download": true,
        "upload": true,
        "modify": true,
        "list": false,
        "delete": true,
        "changePassword": false,
        "share": false
      },
      role: "user",
      timeZone: "UTC",
      username: "testuser-" + moment().unix(),
      welcomeEmail: true
    }
  },
  addUserCallback
);

// In the callback funciton we log information if there was an error or it was successful operation
function addUserCallback(error) {
  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {
    console.log('User has been created');
  }
}