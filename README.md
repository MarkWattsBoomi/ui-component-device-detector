# Device Detector

Components that wrap up the current user's browser details and location.

WhereAmI        puts a google map on your page with a pin showing your current location.  Also allows the return of that data into a specific type in the flow.


## Setup

- Grab the files from the /dist folder and import into your tenant.

- Add the files to your player code like this: -

        requires: ['core', 'bootstrap3'],
        customResources: [
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/DeviceDetector.js',
                ],


- Create a new type called "LocationDetails" with string values called "OperatingSystem", "BrowserVendor", "BrowserName" and number fields called "Longitude" & "Latitude".

- Add a new value to your flow's of this type e.g. "MyLocation".

- Add a component to your page, any type, save it then change it's "componentType" to "WhereAmI" in the metadata editor and save it.
e.g. 
            "componentType": "WhereAmI",

- Set the component's "State" to a the new field (e.g. MyLocation). 

- Set the "Editable" to "true" to enable the component to detect your location otherwist it will just display whatever is already in the state.

- Set the "height" of the component to control it's proportions.


## Extra Configuration

You can add attributes to the component to control it's appearance: -

- Title  - String - A string to display in the title bar of the component.

- ApiKey - String - Your google maps API key - it wont work without this!

- ShowCurrentLocation - boolean - if true then a marker for the current location is added to the map

- CurrentLocationLabel - String - The label to be shown when howering the Current Location marker (if shown)
