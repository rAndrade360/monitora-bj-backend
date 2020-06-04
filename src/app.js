require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const RateLimitRedis = require('rate-limit-redis');
const redis = require('redis');
const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONT_URL
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'development'){
  app.use(new RateLimit({
    store: new RateLimitRedis({
      client: redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      })
    }),
    windowMs: 1000 * 60 * 10,
    max: 150
  }));
}
app.use(routes);

module.exports = app;
