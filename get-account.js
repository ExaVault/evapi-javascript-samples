require('dotenv').config();

/**
 * get-account.php - Use the AccountApi to return your account info and check disk usage
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

// We are demonstrating the use of the AccountAPI, which can be used to manage the account settings 
// We have to override the default configuration of the AccountApi with an updated account name so that our code
//  will reach the correct URL for the api.
const api = new ExaVaultApi.AccountApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

// The getAccount method of the AccountApi class will give us access to the current status of our account
// See https://www.exavault.com/developer/api-docs/#operation/getAccount for the details of this method

// We must pass in our API Key and Access Token with every call, which we retrieved from the .env file above
api.getAccount(evApiKey, evAccessToken, {}, accountCallback);

// Process account response results in callback function
function accountCallback(error, result) {
  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {

  // See https://www.exavault.com/developer/api-docs/#operation/getAccount for the details of the response object

  // The AccountResponse object that we got back (result) is composed of additional, nested objects
  // The Quota object will tell us how much space we've used

    // Calculate account usage in gigabytes
    const quota = result.data.attributes.quota;
    const gbFactor = 1024 * 1024 * 1024;
    const gbUsed = quota.diskUsed / gbFactor;
    const gbTotal = quota.diskLimit / gbFactor;
    const percentUsed = gbUsed / gbTotal * 100;

    console.log("Account used: " + (Math.round(gbUsed * 10) / 10) + "GB (" + (Math.round(percentUsed * 10) / 10) + "%)");
    console.log("Total size: " + (Math.round(gbTotal * 10) / 10) + "GB");
  }
};