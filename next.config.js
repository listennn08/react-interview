module.exports = {
  env: {
    SECRET: 'secret'
  },
  target: "serverless",
  async rewrites() {
    return [{
      source: '/:any*',
      destination: '/'
    }]
  }
}