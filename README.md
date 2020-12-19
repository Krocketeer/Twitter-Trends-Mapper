# Twitter Trends Mapper

This project uses the Twitter API and the Google Maps API to plot the locations of top trends in the 
United States as well as let users see the trends in certain cities. This project was created to
fulfill the requirements of the final project for [HCDE 310: Interactive Systems Design & Technology
(Autumn 2020)](https://www.smunson.com/teaching/hcde310/a20/) at the University of Washington, 
Seattle.

## To View Project
You can access this project by going here: [Twitter Trends Mapper](https://twittertrendsmapper.herokuapp.com/)

## To Run Locally

### Setting Up Environment

First clone the repository or download the files for this project. You will then need to install the
necessary Python packages (by running `pip install -r requirements.txt`) and install the necessary
Node.js packages (by running `npm install`). 

### Getting and Setting Up API Keys
Afterwards, you will then need to get the necessary 
[API Keys from Twitter](https://developer.twitter.com/en/apply-for-access) and an 
[API Key for Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key).
You will then need to create a file called `API_Keys.json` in the root folder with the 
following structure:
```json
{
    "Google Maps API": "Google Maps API Key goes here",
    "Twitter API key": "Twitter API Key goes here",
    "Twitter secret": "Twitter Secret Key goes here",
    "Twitter bear_token": "Twitter Bear Token goes here"
}
```
In addition, you must also paste your Google Maps API Key in the following line for the files
`ClickableMap.js` and `Map.js`:
```jsx
return <div className="map">
    <LoadScript googleMapsApiKey="Google Maps API Key goes here">
    ...
    </LoadScript>
</div>

export default Map
```

### Enabling Flask to Run with React
To allow Flask and React to run at the same time, you must enable a proxy by adding
`"proxy": "http://localhost:5000"` to the very last line in `package.json` while leaving all other 
configurations the same:
```json
{
  ...
  "proxy": "http://localhost:5000"
}
```

### Running the App Locally
First run the Flask app with `python3 main.py` followed by the React app with `npm start`. Then
open [http://localhost:3000](http://localhost:3000) to view the project in the browser.

### Acknowledgements
This project was created by [Carol Lei](https://www.carollei.com) and [Kenny Le](https://www.kennyle.com)
for their final project in HCDE 310. We would like to give thanks to 
[Professor Sean Munson](https://www.hcde.washington.edu/munson) and the HCDE 310 CA/TA Staff for their 
endless support in the development of this project as well as give special thanks to [Evan Feenstra](https://evan.cool/) 
for his advice and guidance on React.js development.
