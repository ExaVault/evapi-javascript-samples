# ExaVault JavaScript API Code Samples - v2.0

## Introduction

Welcome to the sample code for ExaVault's JavaScript code library, which demonstrates how to use various aspects of our API with your ExaVault account. The JavaScript code library is available as a npm package and [on Github](https://github.com/ExaVault/evapi-javascript).

## Requirements

**Install Node.js**

[Node.js](https://nodejs.org/) should be installed in the system. The latest version can be downloaded [here](https://nodejs.org/en/download/). The code was tested on version 10 and higher. Therefore we suggest version 10+. Check your current Node.js version by running `node -v`:
```bash
$ node -v
v12.16.3
```

## Running Your First Sample

**Step 1. Install code samples**

You may get code samples by doing one of the following:

Option 1. Clone repository using git command:

```shell
git clone https://github.com/ExaVault/evapi-javascript-samples.git
```
This will download the code into the `evapi-javascript-samples` folder.

Option 2. Download zip archive with code. Click on *Code -> Download* and you will get an archive with code, which you can unarchive to your destination.

**Step 2. Install dependecies**

Go to the folder with code samples and run 

```bash
npm install
```

The output of this command when running successfully should look like this:

```shell
added 26 packages from 35 contributors and audited 26 packages in 4.393s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Sometimes there can be some warnings from npm like this:

```bash
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.4 (node_modules\fsevents):
```

or 

```bash
audited 34090 packages in 14.711s
found 15 vulnerabilities (9 low, 6 high)
  run `npm audit fix` to fix them, or `npm audit` for details 
```

Normally they are not breaking the code, but you may want to fix vulnerabilities by running `npm audit` and then following the recommendations.

**Step 3 - Add Your API Credentials to the sample code**

Before you can make an API call, you'll need to make a copy of the environment file provided with this code library. In that same directory where you ran `npm install` above, do:

```bash
cp .env.example .env
```

Now that you have a file named .env, you need to add in your API credentials. Edit the .env file you just created.

- replace **your\_key\_here** with your API key. Don't add any extra spaces or punctuation
- replace **your\_token\_here** with your access token.
- replace **your\_account_name** with the name of your ExaVault account

And save the file.

**Step 4 - Run the sample script**

Now you're ready to run your first sample. Try `get-account` first

```bash
node get-account.js
```
If everything worked, the sample code will run and connect to your account. You'll see output similar to this:

```bash
node get-account.js
Account used: 21.9GB (6.3%)
Total size: 350GB
```

## Running Other Sample Files

There are several other sample files that you can now run. You won't need to repeat the steps to set up the .env file each time - the same environment information is used for all of the sample scripts.
Some of the sample scripts will make changes to your account (uploading, creating shares or notifications, etc). Those are marked with an asterisk below:

Script                        | Purpose    \*=Makes changes to your account when run                                   | APIs Used                      |
------------------------------|----------------------------------------------------------------------------------------|--------------------------------|
get-account.js   | List the amount of available space for your account                                    | AccountApi                     |
add-notification.js  | Add upload notifications<br/>_\*adds folders to your account_             | ResourcesApi, NotificationsApi |
add-user.js           | Add a new user with a home directory <br/>_\*adds a user and a folder to your account_ | UsersApi                       |
compress-files.js     | Compress several files into a zip file <br/>_\*adds files and folders to your account_ | ResourcesApi                   |
download-files.js | Search for files matching a certain extension, then download them.                     | ResourcesApi                   |
show-failed-logins.js  | List usernames who had a failed login in the last 24 hours                             | ActivityApi                    |
export-users.js         | Exports users in your account to CSV file                                             | UsersApi                       |
create-shared-folder.js      | Create a new shared folder with a password<br />_\*adds a folder to your account_      | ResourcesApi, SharesApi        |
upload-file.js       | Upload a file to your account.<br />_\*uploads sample JPG to your account_            | ResourcesApi                   |

## If Something Goes Wrong

**Error: getaddrinfo ENOTFOUND accountname.exavault.com**

If you see this error, this means the script can't read settings from the `.env` file. Make sure you're running a sample script from the root directory.

Another reason of this error might be that `EV_ACCOUNT_NAME` variable in `.env` isn't correct. Check your account name and fix it if needed.

**Error: {"responseStatus":401,"errors":[{"code":"ERROR_INVALID_CREDENTIALS","detail":"HTTP_UNAUTHORIZED"}]}**

This error tells that access token and/or api key is invalid. Check `EV_API_KEY` and `EV_ACCESS_TOKEN` in `.env` file that they match to what you have in the account.

**Other problems with sample code**

If you encounter any other issues running this sample code, you can contact ExaVault support for help at support@exavault.com.

## Writing Your Own Code

When you're ready to write your own code, you can use our sample code as examples. You'll need to:

1. Install our code library using 
```bash
npm install @exavault/exavault-api --save
```
2. Install `dotenv` package to be able to load environment variables from `.env` file
```bash
npm install dotenv --save
```
3. Depending on what API you're going to use, create an API object appropriately. For instance, to work with account API, create `AccountApi` object. When instantiating an API object, pass an `ApiClient` instance configured with your account name to it with `process.env.EV_ACCOUNT_NAME` as in example below. Access token and API key should be retrieved from environment variable as in the code below.  Here is the minimal code you need to call an API endpoint:

```javascript
require('dotenv').config();

const ExaVaultApi = require('@exavault/exavault-api');

const evApiKey = process.env.EV_API_KEY;
const evAccessToken = process.env.EV_ACCESS_TOKEN;

const api = new ExaVaultApi.AccountApi(
  new ExaVaultApi.ApiClient({
    'accountname': process.env.EV_ACCOUNT_NAME
  })
);

api.getAccount(evApiKey, evAccessToken);
```

To get response data JavaScript library uses callbacks that is the last argument in an API method. For example, to get account data in the example above:

```javascript
api.getAccount(evApiKey, evAccessToken, {}, function(error, data) {
    // Use `data` argument to access response data
    // Use `error` argument to access any errors
});
```

As you can see, callback receives two agruments for errors and response data.



## Author

support@exavault.com
    