// Load environment variables from .env file
require('dotenv').config();
const moment = require('moment');

/**
 * add-notification.js - Use the NotificationsApi to create a Notification on a folder
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

// We are demonstrating the use of the NotificationsApi, which can be used to manage notification settings 
//  for files and folders

// For this demo, we'll create a new folder and add a notification to this new folder. If you have 
// an existing file or folder that you want to create a notification for, you won't need the step where
// we use the ResourcesApi to create the folders first.
//

// We have to override the default configuration of the API object with an updated account name so that our code
//  will reach the correct URL for the api. We have to override this setting for each of the API classes we use
const ApiClient = new ExaVaultApi.ApiClient();
ApiClient.basePath = evAccountUrl;

const resourcesApi = new ExaVaultApi.ResourcesApi(ApiClient);

// We will create a new folder for the demo. The folder will have a different name each time you run this script
const uploadFolder = '/api-sample-code/notification-sample-' + moment().unix();

// We have to pass the evApiKey and evAccessToken with every API call. 
resourcesApi.addFolder(
  evApiKey,
  evAccessToken,
  {
    'body': {
      'path': uploadFolder,
    }
  },
  addFolderCallback
);


// When folder created this callback will be called
function addFolderCallback(error, data) {
  if (error) {
    console.error(error.response ? "Error: " + error.response.text : error);
  } else {

    console.log(`Created new folder ${uploadFolder}`);

    // This is ID of newly created folder
    const resourceId = data.data.id;

    // Now we can use the NotificationsApi to create a notification
    // We have to override the default configuration of the API object with an updated account name so that our code
    //  will reach the correct URL for the api.
    const notificationsApi = new ExaVaultApi.NotificationsApi(ApiClient);

    // This is callback function that will be called after we add notification to a folder
    function addNotificationCallback(error, data) {
      if (error) {
        console.error(error.response ? "Error: " + error.response.text : error);
      } else {
        console.log(`Created upload notification for ${uploadFolder}`);
      }
    }

    // API methods that take a JSON body, such as the addFolder method, require us to submit an object with the 
    // parameters we want to send to the API. 
    // See https://www.exavault.com/developer/api-docs/#operation/addNotification for the request body schema

    // - We want to be notified by email whenever anyone uploads to our folder, so we are using
    //   the constant "notice_user_all", which means anyone, including users and share recipients.
    //   See  https://www.exavault.com/developer/api-docs/#operation/addNotification  for a list of other 
    //   constants that can be used in the usernames array
    // - Note that the 'resource' parameter is a resource identifier here of the folder that was created earlier
    notificationsApi.addNotification(
      evApiKey,
      evAccessToken,
      {
        'body': {
          'resource': "id:" + resourceId,
          'usernames': ["notice_user_all"],
          'action': 'upload',
          'type': 'folder',
          'message': 'New files have been uploaded',
          'sendEmail': true,
          'recipients': [
            'testnotifications@example.com',
            'testnotifications1@example.com',
            'testnotifications2@example.com',
          ]
        }
      },
      addNotificationCallback
    );
  }
}