const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/zhe',
  port: process.env.PORT || 5000,
};

export default config;
