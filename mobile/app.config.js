module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, ...(process.env.CHINAHAND_WEB_BASE_URL ? { baseUrl: process.env.CHINAHAND_WEB_BASE_URL } : {}) },
});
