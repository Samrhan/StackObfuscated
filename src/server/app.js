const api = require('./routes/api.js')

module.exports = app => {
    app.use('/api/', api)
}
