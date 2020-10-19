const API = require('./src/server/app')

module.exports = {
    devServer: {
        before: API
    }
}
