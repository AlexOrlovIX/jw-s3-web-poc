This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

# POC

To Run the POC you need to 
- Generate Signed URL
- Send File to the signed URL

## Generating Signed URL

Install jwplatform NodeJS lib
```
$> yarn add jwplatform
```

Create NodeJS file `index.js`
```
const JWPlatformAPI = require('jwplatform');

const [apiKey, apiSecret] = [
    '--API-KEY--', 
    '--API-SECRET--'
];

const jwApi = new JWPlatformAPI({apiKey, apiSecret});

jwApi.videos.create({ upload_method: "s3" }).then(response => {
    const { path, protocol, address, query } = response.link;
    const qs = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
    const uploadURL = `${protocol}://${address}${path}?${qs}`;
    console.log('---------------');
    console.log(uploadURL);
    console.log('---------------');
});
```

Run `index.js` file
```
$> node index.js
```

Copy the URL address from Terminal console and used it on a step 2.


## Uploading File to JW

Run React-App application
```
$> yarn start
```

Go to http://localhost:3000

Put the URL in a dialog you see on a screen, it should fill in readonly fields
Select a video File from your local environment
![Web-View](../assets/img/signed-url-upload.png?raw=true)

And hit upload

Check the Developer Tools console for any potential issues