module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, ...(process.env.CHINABUDDY_WEB_BASE_URL ? { baseUrl: process.env.CHINABUDDY_WEB_BASE_URL } : {}) },
});
