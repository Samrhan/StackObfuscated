const express = require('express')
const router = express.Router()
const session = require('express-session')
const logger = require('morgan')
//const articles = require('../data/articles.js')

//const bcrypt = require('bcrypt')
//const {Client} = require('pg')

router.use(logger('dev'))
router.use(express.json())
router.use(express.urlencoded({extended: false}))
router.use(session({secret: 'grehjznejzkhgjrez', saveUninitialized: false, resave: false}))

/*const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'toor',
    database: 'PROJETWEB'
})
client.connect()*/

class User {
    constructor() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.data // undefined si l'utilisateur n'est pas connecté
        this.cache = [] // panier temporaire
    }
}

router.use((req, res, next) => {
    // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
    if (typeof req.session.user === 'undefined') {
        req.session.user = new User()
    }
    next()
})

router.get("/", (req, res) => {
    res.send("Hello World ! ")
})


module.exports = router;

