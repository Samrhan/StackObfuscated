const express = require('express')
const router = express.Router()
const session = require('express-session')
const logger = require('morgan')

const bcrypt = require('bcrypt')
const {Client} = require('pg')

router.use(logger('dev'))
router.use(express.json())
router.use(express.urlencoded({extended: false}))
router.use(session({secret: 'cI8zS4nC8gZ1hN7j', saveUninitialized: false, resave: false}))

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    database: 'stackobfuscated'
})
client.connect()

class User {
    constructor() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.data = undefined// undefined si l'utilisateur n'est pas connecté
    }
}

router.use((req, res, next) => {
    // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
    if (typeof req.session.user === 'undefined') {
        req.session.user = new User()
    }
    next()
})

router.get('/me', async (req, res) => {
    if (req.session.user.data) {
        res.json({user: req.session.user.data})
    } else {
        res.json({user: undefined})
    }
})

router.post('/register', async (req, res) => {
    const mail = req.body.email
    const passwd = req.body.passwd
    const username = req.body.username
    // vérification de la validité des données d'entrée
    if (typeof mail !== 'string' || mail === '' ||
        typeof passwd !== 'string' || passwd === '' ||
        typeof username !== 'string' || username === '') {
        res.status(400).json({message: 'bad request', code: 3})
        return
    }
    if (mail.endsWith('--')) { // Si on a tenté une injection SQL (useless mais drôle)
        res.status(401).json({message: "Don't mess with me :angyy:", code: 1})
        return
    }

    //on revérifie les données du formulaire, au cas ou qqn utilise postman ou burp
    let validForm = !passwd.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/) || !mail.match(/.*@.*\..{2,}/) || (username.length < 5) || (!!username.match(/[^A-Za-z0-9]+/));
    if (validForm) {
        res.status(401).json({message: "use the form :)", code: 2})
        return
    }

    try {
        let response = await client.query('SELECT id FROM users WHERE mail = $1', [mail])
        if (response.rows.length > 0) {
            return res.status(401).json({message: 'EMail déjà enregistré', code: 2})
        }
        response = await client.query('SELECT id FROM users WHERE username = $1', [username])
        if (response.rows.length > 0) {
            return res.status(401).json({message: 'Nom déjà utilisé', code: 4})
        }
        let passwd_hash = await bcrypt.hash(passwd, 10)
        response = await client.query('INSERT INTO users(mail, password, username) VALUES ($1,$2,$3) RETURNING id', [mail, passwd_hash, username]);
        const user_data = {username: username, id: response.rows[0].id, email: mail}
        req.session.user.data = user_data;
        res.json({user: user_data})

    } catch (err) {
        res.status(401).json({message: err, code: 0})
    }
    // on envoie l'article ajouté à l'utilisateur
})

router.post("/login", async (req, res) => {

    const passwd = req.body.passwd;
    const id = req.body.id;

    if (typeof id !== 'string' || id === '' ||
        typeof passwd !== 'string' || passwd === '') {
        res.status(400).json({message: 'bad request', code: 3})
        return
    }
    if (id.endsWith('--')) { // Si on a tenté une injection SQL (useless mais drôle)
        res.status(401).json({message: "Don't mess with me :angyy:", code: 1})
        return
    }

    let login_method = 'mail'

    if (id.indexOf('@') === -1) {
        login_method = 'username'
    }
    try {
        const query = await client.query(`SELECT * FROM users WHERE ${login_method} = $1`, [id])
        if (query.rows.length === 0)
            return res.status(404).json({message: "nom d'Utilisateur ou mot de passe incorrect", code: 4})
        if (!await bcrypt.compare(passwd, query.rows[0].password)) {
            return res.status(403).json({message: "nom d'Utilisateur ou mot de passe incorrect", code: 4})
        }
        let response = query.rows[0]
        delete response.password // On ne renvoie pas le hash au client
        req.session.user.data = response
        res.json({user: response})
    } catch (err) {
        res.status(401).json({message: err, code: 0})
    }
})

router.post('/editprofile', async (req, res) => {
    if (req.session.user.data) {
        const bio = req.body.bio.substr(0,400) // On crop si l'utilisateur n'a pas respecté le form
        const profile_pic = req.body.profile_pic
        const bg_pic = req.body.bg_pic
        // vérification de la validité des données d'entré
        if (typeof bio !== 'string' ||
            typeof profile_pic !== 'string' ||
            typeof bg_pic !== 'string') {
            return res.status(400).json({message: 'bad request', code: 3})
        }
        await client.query('UPDATE users SET (bio, profile_pic, bg_pic) = ($1, $2, $3) WHERE id = $4', [bio, profile_pic, bg_pic, req.session.user.data.id])
        req.session.user.data.bio = bio
        req.session.user.data.profile_pic = profile_pic
        req.session.user.data.bg_pic = bg_pic
        return res.json({user: req.session.user.data})
    }
});

router.get('/user/:username', async (req, res) => {
    const username = req.params.username
    if (typeof username !== 'string' || username === '') {
        return res.status(401).json({response: 'forbidden'})
    }
    const query = await client.query("SELECT note,bio,profile_pic,bg_pic FROM users WHERE username = $1", [username])
    res.json({user: query.rows})
})

router.post('/logout', (req, res) => {
    req.session.destroy()
    res.json({status: 'done'})
})


module.exports = router;

