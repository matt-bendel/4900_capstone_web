# Setting Up the App

In order to get started, clone the repository then run the following
command:

###`npm install`

This will install all required packages - with appropriate versions - 
as specified in package-lock.json

Next, in order to run the app locally, run the following command:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## UPDATING FROM DEVICE

In order to update from the device you need to send an HTTP POST request to the following
endpoint with the following body content (as JSON):

### Endpoint:
#### `https://us-central1-capstone-a7aa2.cloudfunctions.net/updateDeviceAndNotify`

### Body Content:
{
    "device": DEVICE_ID (string),
    "battery": BATTERY_NUMBER (int)
    "liquid": LIQUID_NUMBER (int)
}

Once again, it is imperative to specify the Content-Type as application/json.