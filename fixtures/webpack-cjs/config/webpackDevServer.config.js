const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware')
const paths = require('./paths')

const host = process.env.HOST || '0.0.0.0'

module.exports = function () {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    host,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    onBeforeSetupMiddleware(devServer) {
      devServer.app.use(evalSourceMapMiddleware(devServer))
    },
    onAfterSetupMiddleware(devServer) {
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath))
    },
  }
}
