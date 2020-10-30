// Load environment variables from .env file
require('dotenv').config();

const moment = require('moment');

/**
 * show-failed-logins.js - Use the ActivityApi to retrieve the list of users who had failed logins 
 * in the last 24 hours.
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

// We are demonstrating the use of the ActivityApi, which can be used to retrieve session and webhook logs
// We have to override the default configuration of the ActivityApi object with an updated account name so that our code
//  will reach the correct URL for the api.
const ApiClient = new ExaVaultApi.ApiClient();
ApiClient.basePath = evAccountUrl;

const activityApi = new ExaVaultApi.ActivityApi(ApiClient);

// The getSessionLogs method of the ActivityApi class will give us access activity logs for our account
// See https://www.exavault.com/developer/api-docs/#operation/getSessionLogs for the details of this method

// We must pass in our API Key and Access Token with every call, which we retrieved from the .env file above
// This method also supports filtering parameters to limit the results returned. Check the link to 
// our API documentation for a list of those parameters.

// Create two dates with one day difference
const now = moment();
const dayBefore = now.clone().subtract(1, 'd');

// Call API method to get activity records
activityApi.getSessionLogs(
  evApiKey,
  evAccessToken,
  {
    // Filter by activity type. 'PASS' is login type
    'type': 'PASS',
    // Filter out last 24 hours of records
    'endDate': now.format('YYYY-MM-DD HH:mm:ss'),
    'startDate': dayBefore.format('YYYY-MM-DD HH:mm:ss'),
    // Results limited to 100 records and can be expanded if needed
    'limit': 100
  },
  activityCallback
);

// Process and display retrieved data
function activityCallback(error, data) {
  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {

    // Extract only failed login and get only usernames and dates
    const failedLoginsData = data.data.filter(
      item => item.attributes.status === "failed"
    ).reduce(function(data, item) {
      const username = item.attributes.username;

      if (data[username] === undefined) {
        data[username] = 0;
      }

      data[username] += 1;

      return data;
    }, {});

    const tabularData = Object.keys(failedLoginsData).map(function(username) {
      return {"User": username, "Count": failedLoginsData[username]};
    });
    
    // .map(item => {
    //   return [item.attributes.username, moment(item.attributes.created).format("YYYY-MM-DD HH:mm:ss")];
    // });

    if (tabularData.length === 0) {
      console.log("There is no failed logins for the last 24 hours");
    } else {
      console.log('List of failed logins:');
      // Display failed in a log table
      console.table(tabularData);
    }
  }
}