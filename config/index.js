module.exports = {
  port: process.env.PORT,
  envt: process.env.NODE_ENV,
  url: process.env.MONGO_URL,
  sendGridApiKey: process.env.SEND_API,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  sessionSecret: process.env.sessionSecret
};
