Client for the Milli Health Web App

### Install
2. `npm install`

### Run

Note: Before you can use this, you need to also be running [the API](https://github.com/Aaronik/milli-api)

1. `npm start`
2. nav to localhost:3000

### Dev
1. `npm start`
2. nav to localhost:3000
3. Any changes will be detected and reload the page automatically
4. You can set the environment variable REACT_APP_API_URL to designate where
   millimed should look for its graphql api.

### File Structure

We use pages to denote every "top-level" view. Largely they coincide with
each page you can visit, each URL. Components are everything else,
all the smaller components, often being reused across pages.

