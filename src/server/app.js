const express = require('express')



const api = require('./routes/api.js')

module.exports = app => {
    app.use('/api/', api)
}
