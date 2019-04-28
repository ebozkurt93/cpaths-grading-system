require('dotenv').config();

// next.config.js
module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    //   mySecret: 'secret'
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    serverUrl: process.env.SERVER_ENDPOINT,
    enableApplications: process.env.ENABLE_APPLICATIONS
  }
};
