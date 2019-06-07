# Blockchain Notary Service - Express.JS
This is the project to secure digital assests on a private blockchain

## Installation
```sh
$ cd web-express
$ npm install
$ node app
```

## End Points
**Request Validation**
* **URL**
  http://localhost:8000/requestValidation
* **Method:**
  `POST`
* **Data Params**
  `walletAddress=[string]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544451269",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
    "validationWindow": 300
  }`

**Validate**
* **URL**
  http://localhost:8000/message-signature/validate
* **Method:**
  `POST`
* **Data Params**
  `walletAddress=[string]`
  `signature=[string]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `{
    "registerStar": true,
    "status": {
        "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544454641",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
    }
  }`

**Post Block**
* **URL**
  http://localhost:8000/block
* **Method:**
  `POST`
* **Data Params**
  `walletAddress=[string]`
  `star=[object]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `{
    "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
    "height": 1,
    "body": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
    "time": "1544455399",
    "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
  }`

**Get Stars**
* **URL**
  http://localhost:8000/stars/hash
* **Method:**
  `GET`
* **URL Params**
  `hash=[string]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `{
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  }`

**Get Stars**
* **URL**
  http://localhost:8000/stars/address
* **Method:**
  `GET`
* **URL Params**
  `walletAddress=[string]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `[
    {
      "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "16h 29m 1.0s",
          "dec": "-26° 29' 24.9",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532296234",
      "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
    },
    {
      "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
      "height": 2,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "17h 22m 13.1s",
          "dec": "-27° 14' 8.2",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532330848",
      "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
    }
  ]`

**Get Block**
* **URL**
  http://localhost:8000/block
* **Method:**
  `GET`
* **URL Params**
  `blockheight=[height]`
* **Success Response:**
  **Code:** 200
  **Content:**
  `{
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  }`