# The Front-End of Fish Fry Tracker

[fishfrytracker.com](https://www.fishfrytracker.com)

# Development
- Clone this repo
- Clone the config repo (private) with down into a folder named config `fish-fry-web-client/config`.
- run `npm i && npm start`

# Deployment
- Using netlify cli to deploy right now since there is an issue with Vue recognizing the env variables stored in Netlify.
`npm run build && netlify deploy --prod`
