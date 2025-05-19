import 'dotenv/config';

export default {
  expo: {
    name: "NASA App",
    slug: "nasa-app",
    version: "1.0.0",
    extra: {
      NASA_API_KEY: process.env.NASA_API_KEY,
    },
  },
};
