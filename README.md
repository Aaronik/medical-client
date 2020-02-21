Client for the Milli Health Web App

https://millihealth.atlassian.net/jira/software/projects/MDD/boards/8


### Install
1. `git clone https://github.com/MilliHealth/millimed.git millimed`
2. `cd millimed`
3. `npm install`

### Run
1. `npm start`
2. nav to localhost:3000

### Dev
1. `npm start`
2. nav to localhost:3000
3. Any changes will be detected and reload the page automatically

### File Structure

We use pages to denote every "top-level" view. Largely they coincide with
each page you can visit, each URL. Components are everything else,
all the smaller components, often being reused across pages.
