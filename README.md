This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

# POC

To Run the POC you need to 
- Configure AWS
- Generate Policy
- Send Files to the URL adding generated policy configuraton


## AWS S3 Bucket configuration

Use this page as an inspiration:
https://softwareontheroad.com/aws-s3-secure-direct-upload/

### Generate IAM Credentials to get Access Key and Access Secret
![AWS: How To Get Amazon S3 Access Keys](https://objectivefs.com/howto/how-to-get-amazon-s3-keys)

### Configure AWS Policy

Set the Bucket Policy to
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Put*"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name/*",
            ]
        }
    ]
}
```

:bulb: Make sure you changed `your-bucket-name` to actually your S3 bucket Name

### Configure AWS Policy

As these request will be done through the web, you have to allow cross-origin (CORS) requests on this bucket.

- Go to your bucket
- Go to the permissions tab
- Click CORS configuration and copy and paste the following

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

:thinking: Assuming all Methods other than `POST` Can be removed from this snippet

## Generating Signed URL

Install jwplatform NodeJS lib
```
$> yarn add aws-sdk
```

Create NodeJS file `index.js`
```
const AWS = require('aws-sdk');

const [accessKeyId, secretAccessKey, Bucket] = [
    '-- AWS ACCESS KEY --',
    '-- AWS SECRET KEY --',
    '-- AWS BUCKET --'
];

var s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey
});

const uploadPath = "test/ix/s3-upload"

var params = {
    Bucket,
};

s3.createPresignedPost(params, (err, data) => {
    if (err) {
        console.error('Pre-signing post data encountered an error', err);
    } else {
        console.log('The post data is in between lines');
        console.log('------------');
        console.log(JSON.stringify(data));
        console.log('------------');
    }
});
```

Run `index.js` file
```
$> node index.js
```

Copy the Data generated from Terminal console and use it on a second step.


## Uploading File to S3

Run React-App application
```
$> yarn start
```

Go to http://localhost:3000

Put the Data in a dialog you see on a screen, it should fill in readonly fields

Select a video File from your local environment
![Web-View](../assets/img/policy-upload.png?raw=true)

And hit upload

Check the Developer Tools console for any potential issues