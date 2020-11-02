# ExaVault JavaScript API Code Samples - v2 API

## Introduction

Welcome to the sample code for ExaVault's JavaScript code library, which demonstrates how to use various aspects of our API with your ExaVault account. The JavaScript code library is available as [an npm package](https://www.npmjs.com/package/@exavault/exavault-api) and [on Github](https://github.com/ExaVault/evapi-javascript).

## Requirements

To run these scripts, you'll need [Node.js](https://nodejs.org/)  version 10 or higher installed. The latest version can be downloaded [here](https://nodejs.org/en/download/).  Check your current Node.js version by running `node -v`:
```bash
$ node -v
v12.16.3
```

You will also need an ExaVault account as well as and an API key and access token.

## Running Your First Sample

**Step 1. Download the code samples**

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
found 0 vulnerabilities
```

**Step 2 - Get your API Credentials** 

The next step is to generate an API key and token from your ExaVault account. You'll need to log into the ExaVault web file manager, as an admin-level user, to get the API key and access token. See our [API reference documentation](https://www.exavault.com/developer/api-docs/v2/#section/Obtaining-Your-API-Key-and-Access-Token) for the step-by-step guide to create your key and token.

If you are not an admin-level user of an ExaVault account, you'll need someone with admin-level access to follow the steps and give you the API key and access token.

**Step 4 - Add Your API Credentials to the sample code**

Before you can make an API call, you'll need to make a copy of the environment file provided with this code library. In that same directory where you ran `npm install` above, do:

```bash
cp .env.example .env
```

Now that you have a file named .env, you need to add in your API credentials. Edit the .env file you just created.

- replace **your\_key\_here** with your API key. Don't add any extra spaces or punctuation
- replace **your\_token\_here** with your access token.
- replace **your\_account_name** with the name of your ExaVault account

And save the file.

**Step 5 - Run the sample script**

Now you're ready to run your first sample. Try `get-account` first

```bash
node sample-get-account.js
```
If everything worked, the sample code will run and connect to your account. You'll see output similar to this:

```bash
node sample-get-account.js
Account used: 21.9GB (6.3%)
Total size: 350GB
Primary Email Address: tim@apple.com
```

## Running Other Sample Files

There are several other sample files that you can now run. You won't need to repeat the steps to set up the .env file each time - the same environment information is used for all of the sample scripts.
Some of the sample scripts will make changes to your account (uploading, creating shares or notifications, etc). Those are marked with an asterisk below:

Script                        | Purpose                                                                                | APIs Used                      |
------------------------------|----------------------------------------------------------------------------------------|--------------------------------|
sample-get-account.js   | List the amount of available space for your account                                    | AccountApi                     |
sample-add-notification.js  | Add upload notifications<br/>_\*adds folders to your account_             | ResourcesApi, NotificationsApi |
sample-add-user.js           | Add a new user with a home directory <br/>_\*adds a user and a folder to your account_ | UsersApi                       |
sample-compress-files.js     | Compress several files into a zip file <br/>_\*adds files and folders to your account_ | ResourcesApi                   |
sample-download-files.js | Search for files matching a certain extension, then download them.                     | ResourcesApi                   |
sample-show-failed-logins.js  | List usernames who had a failed login in the last 24 hours                             | ActivityApi                    |
sample-export-users.js         | Exports users in your account to CSV file                                             | UsersApi                       |
sample-create-shared-folder.js      | Create a new shared folder with a password<br />_\*adds a folder to your account_      | ResourcesApi, SharesApi        |
sample-upload-file.js       | Upload a file to your account.<br />_\*uploads sample jpgs to your account_            | ResourcesApi                   |

## If Something Goes Wrong

**Error: getaddrinfo ENOTFOUND accountname.exavault.com**

If you see this error, this means the script can't read settings from the `.env` file. Make sure you're running a sample script from the root directory.

Another reason of this error might be that `EV_ACCOUNT_URL` variable in `.env` isn't correct. Check your account name and fix it if needed.

**Error: {"responseStatus":401,"errors":[{"code":"ERROR_INVALID_CREDENTIALS","detail":"HTTP_UNAUTHORIZED"}]}**

This error tells that access token and/or api key is invalid. Check `EV_API_KEY` and `EV_ACCESS_TOKEN` in `.env` file that they match to what you have in the account.

**Other problems with sample code**

If you encounter any other issues running this sample code, you can contact ExaVault support for help at support@exavault.com.

## Next Steps

To get started writing your own code, you may either modify our samples, or download and install our library into your existing project via npm. For details, see the [ExaVault Javascript API Library repo](https://github.com/ExaVault/evapi-javascript).

## Author

support@exavault.com
    
