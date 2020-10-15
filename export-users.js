// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csvStringify  = require("csv-stringify/lib/sync");

/**
 * export-users.js - Use the UsersApi to create a report of account users
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

// We are demonstrating the use of the UsersApi, which can be used to retrieve user settings and create a report
// We have to override the default configuration of the UserApi object with an updated account name so that our code
//  will reach the correct URL for the api.
const api = new ExaVaultApi.UsersApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

// Results returned in api one call
const resultLimit = 50;
let offset = 0;
let users = [];

// The listUsers method of the UsersApi class will give us access the users defined in our account
// See https://www.exavault.com/developer/api-docs/#operation/listUsers for the details of this method

// We must pass in our API Key and Access Token with every call, which we retrieved from the .env file above
// This method also supports filtering parameters to limit the results returned. Check the link to 
// our API documentation for a list of those parameters.
api.listUsers(
  evApiKey,
  evAccessToken,
  {
    limit: resultLimit,
    offset: offset
  },
  listUsersCallback
);

// User list callback. We're processing user list we get from the listUsers API call
function listUsersCallback(error, data) {

  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {

    // Append users chunk to the main user array
    users = users.concat(data.data);

    // Continue calling api method for user list if we didn't get the full list yet
    if (data.totalResults > data.returnedResults + offset) {
      offset += resultLimit;

      api.listUsers(
        evApiKey,
        evAccessToken,
        {
          limit: resultLimit,
          offset: offset
        },
        listUsersCallback
      );
    } else {

      let csvData = [];

      // If user list is not empty, then prepare data for csv formatter and write to a file
      if (users.length > 0) {

        
        // As we have user permissions as nested object, we need to combine them with other user attributes
        // See https://www.exavault.com/docs/account/04-users/00-introduction#managing-user-roles-and-permissions for details
        let permissions = Object.assign({}, users[0].attributes.permissions);
        let attributes = Object.assign({}, users[0].attributes);
        delete attributes.permissions;

        csvData.push(['id'].concat(Object.keys(attributes), Object.keys(permissions)));

        // Then for each user created array with values instead of objects
        csvData = csvData.concat(users.map(
          user => {
            let permissions = Object.assign({}, user.attributes.permissions);
            let attributes = Object.assign({}, user.attributes);
            delete attributes.permissions;
            return [user.id].concat(Object.values(attributes), Object.values(permissions))
          }
        ));
      }

      const csvOutput = csvStringify(csvData);

      // We are creating a CSV file in the 'files' directory

      // Write user list to a file
      fs.writeFile(path.resolve('./files/users-export.csv'), csvOutput, function(error) {
        if (error) {
          console.error(error.response ? "Error: " + error.response.text : error);
        }

        console.log("Users successfully exported to ./files/users-export.csv");
      })
    }
  }
}

