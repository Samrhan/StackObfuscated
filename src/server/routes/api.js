const express = require('express')
const router = express.Router()
const session = require('express-session')
const logger = require('morgan')
const cookieParser = require("cookie-parser")


const bcrypt = require('bcrypt')
const {Client} = require('pg')
const axios = require("axios")

router.use(logger('dev'))
router.use(express.json())
router.use(express.urlencoded({extended: false}))
router.use(session({secret: 'cI8zS4nC8gZ1hN7j', saveUninitialized: false, resave: false, name: 'sid'}))
router.use(cookieParser());


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
        this.lastComment = 0
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
    let validForm = !passwd.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/) || !mail.match(/.*@.*\..{2,}/) || (username.length < 5) || (!!username.match(/[^A-Za-z0-9 _]+/));
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
        let bio = req.body.bio.substr(0, 400) // On crop si l'utilisateur n'a pas respecté le form
        let profile_pic = req.body.profile_pic
        let bg_pic = req.body.bg_pic
        // vérification de la validité des données d'entrée
        if (typeof bio !== 'string' &&
            typeof profile_pic !== 'string' &&
            typeof bg_pic !== 'string') {
            return res.status(400).json({message: 'bad request', code: 3})
        }
        let query_profile

        // On va vérifier que les liens sont bien des images et qu'elles ne sont pas trop lourdes
        if (profile_pic !== '') {
            try {
                query_profile = await axios.head(profile_pic)
                let content_length = parseInt(query_profile.headers['content-length']) / 1024 / 1024
                let content_type = query_profile.headers['content-type']
                // type image et max 10 mo
                if (!content_length || !content_type || content_length > 10 || !content_type.startsWith('image'))
                    profile_pic = ''
            } catch {
                profile_pic = ''
            }
        }
        if (bg_pic !== '') {
            try {
                query_profile = await axios.head(bg_pic)
                let content_length = parseInt(query_profile.headers['content-length']) / 1024 / 1024
                let content_type = query_profile.headers['content-type']
                if (!content_length || !content_type || content_length > 10 || !content_type.startsWith('image'))
                    bg_pic = ''
            } catch {
                bg_pic = ''
            }
        }

        if (!bio)
            bio = ''
        if (!profile_pic)
            profile_pic = ''
        if (!bg_pic)
            bg_pic = ''

        await client.query('UPDATE users SET (bio, profile_pic, bg_pic) = ($1, $2, $3) WHERE id = $4', [bio, profile_pic, bg_pic, req.session.user.data.id])
        req.session.user.data.bio = bio
        req.session.user.data.profile_pic = profile_pic
        req.session.user.data.bg_pic = bg_pic
        return res.json({user: req.session.user.data})
    } else return res.status(403)
});

router.get('/user/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    if (typeof user_id !== 'string' || user_id === '') {
        return res.status(401).json({response: 'forbidden'})
    }
    let search_method = 'username'
    if (!isNaN(parseInt(user_id)))
        search_method = 'id'
    const query = await client.query(`SELECT * FROM users WHERE ${search_method} = $1`, [user_id])
    if (!query.rows[0]) {
        return res.status(404).json({message: 'Utilisateur introuvable'})
    }
    delete query.rows[0].password
    res.json({user: query.rows[0]})
})

router.post('/logout', (req, res) => {
    req.session.destroy()
    res.json({status: 'done'})
})

router.get('/posts/:userid', async (req, res) => {
    let userid = req.params.userid
    userid = parseInt(userid)
    if (isNaN(userid)) {
        return res.status(400).json({message: 'bad request'})
    }
    // On récupère les post
    const query = await client.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC', [userid])
    let posts = query.rows
    for (let post of posts) {
        // on récupère les liens aux tags
        let tags_query = await client.query('SELECT * FROM post_tag WHERE post_id = $1', [post.id])
        let tags_id = []
        for (let i = 0; i < 3; i++) {
            if (tags_query.rows[i])
                tags_id.push(tags_query.rows[i].tag_id)
            else tags_id.push(0)
        }
        // On récupère les noms des tags
        tags_query = await client.query('SELECT * FROM tags WHERE id = $1 OR id = $2 OR id = $3', tags_id)
        let tags = []
        for (let i of tags_query.rows) {
            tags.push(i.tag_name)
        }
        post.tags = tags
        if (req.session.user.data) {
            const like_query = await client.query('SELECT * FROM liked_post WHERE user_id = $1 AND post_id = $2', [req.session.user.data.id, post.id])
            post.liked = like_query.rows.length > 0;
        }
        let answer_query = await client.query('SELECT COUNT(*) FROM answers WHERE post_id = $1', [post.id])
        post.responses = answer_query.rows[0].count
        answer_query = await client.query('SELECT * FROM answers WHERE post_id = $1 ORDER BY created_at DESC', [post.id])
        post.comments = answer_query.rows.reverse()
        for (let j of post.comments) {
            let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [j.user_id])
            j.username = user_query.rows[0].username
            j.profile_pic = user_query.rows[0].profile_pic
        }
    }
    res.json({list: posts})
})

router.get('/post/:post_id', async (req, res) => {
    const post_id = parseInt(req.params.post_id)
    if (isNaN(post_id)) {
        return res.status(400).json({message: 'bad request'})
    }
    let query = await client.query('SELECT * FROM posts WHERE id = $1', [post_id])
    let post = query.rows[0]
    if (!post) {
        return res.status(404).json({message: 'Non trouvé'})
    }
    query = await client.query('SELECT tag_id FROM post_tag WHERE post_id = $1', [post_id])
    let tags_id = query.rows
    let tags = []
    for (let i of tags_id) {
        query = await client.query('SELECT tag_name FROM tags WHERE id = $1', [i.tag_id])
        tags.push(query.rows[0].tag_name)
    }
    post.tags = tags;
    if (req.session.user.data) {
        const like_query = await client.query('SELECT * FROM liked_post WHERE user_id = $1 AND post_id = $2', [req.session.user.data.id, post.id])
        post.liked = like_query.rows.length > 0;
    }
    query = await client.query('SELECT COUNT(*) FROM answers WHERE post_id = $1', [post.id])
    post.responses = query.rows[0].count
    query = await client.query('SELECT * FROM answers WHERE post_id = $1', [post.id])
    post.comments = query.rows
    for (let j of post.comments) {
        let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [j.user_id])
        j.username = user_query.rows[0].username
        j.profile_pic = user_query.rows[0].profile_pic
    }
    res.json({post: post})
})

router.post('/post', async (req, res) => {
    if (!req.session.user.data)
        return res.status(403)
    const title = req.body.title.substr(0, 400) // On crop si l'utilisateur n'a pas respecté le form
    const content = req.body.content
    const code = req.body.code
    let tags = req.body.tags
    for (let i = 0; i < 3; i++) {
        if (!tags[i]) {
            tags.push('')
        }
    }
    if (typeof title !== 'string' ||
        typeof content !== 'string' ||
        typeof tags !== 'object' ||
        typeof code !== 'string'
    ) {
        return res.status(400).json({message: 'bad request', code: 3})
    }
    // On insère dans la table poste les données du post
    const created_at = new Date()
    const query = await client.query('INSERT INTO POSTS(title, content, created_at, user_id, code) VALUES ($1, $2, $3, $4, $5) RETURNING id', [title, content, created_at, req.session.user.data.id, code])
    const post_id = query.rows[0].id
    // On récupère les tags liées, et on incrémente le nombre d'utilisation
    const verif_tag_query = await client.query('UPDATE tags SET used = used +1 WHERE tag_name = $1 OR tag_name =  $2 OR tag_name =  $3 RETURNING *', tags)
    const verif_tag = verif_tag_query.rows
    for (let i of tags) {
        let tag = verif_tag.find(tag => tag.tag_name === i)
        // S'ils existent pas on les crée et on les link on post
        if (!tag && i !== '') {
            const tag_id_query = await client.query('INSERT INTO tags(tag_name) VALUES ($1) RETURNING id', [i])
            const tag_id = tag_id_query.rows[0].id
            await client.query('INSERT INTO post_tag(post_id, tag_id) VALUES($1, $2)', [post_id, tag_id])
        } else if (i !== '') {
            // Sinon on les links juste au tags existant
            await client.query('INSERT INTO post_tag(post_id, tag_id) VALUES($1, $2)', [post_id, tag.id])
        }
    }
    for (let i = 0; i < 3; i++) {
        if (tags[i] === '') {
            tags = tags.splice(i, 1)
        }
    }
    if (tags.length === 1 && tags[0] === '')
        tags = []
    return res.json({
        post: {
            title: title,
            content: content,
            tags: tags,
            created_at: created_at,
            likes: 0,
            code: code,
            id: post_id,
            responses: 0,
            comments: []
        }
    })

})

router.delete('/post/:postid', async (req, res) => {
    if (req.session.user.data) {
        const id = req.params.postid // On crop si l'utilisateur n'a pas respecté le form
        if (isNaN(id)) {
            return res.status(400).json({message: 'bad request', code: 3})
        }
        let query = await client.query('SELECT user_id FROM posts WHERE id = $1', [id])
        if (query.rows[0].user_id === req.session.user.data.id) { // On vérifie si l'utilisateur est bien l'auteur du post
            await client.query('DELETE FROM posts WHERE id = $1', [id])
            await client.query('DELETE FROM post_tag WHERE post_id = $1', [id])
            await client.query('DELETE FROM liked_post WHERE post_id = $1', [id]) // On supprime aussi les likes
            await client.query('DELETE FROM answers WHERE post_id = $1', [id]) // On supprime aussi les commentaires
        } else return res.status(403)
        return res.json({id: id})
    } else return res.status(403)
})

router.get('/tags/popular/:start', async (req, res) => {
    const start = parseInt(req.params.start)
    if (isNaN(start)) {
        return res.status(400)
    }
    let tags = []
    let query = await client.query("SELECT * FROM tags ORDER BY used DESC LIMIT 10 OFFSET $1", [start])
    tags = query.rows;
    query = await client.query('SELECT COUNT(*) FROM tags')
    let number = query.rows[0].count
    for (let i of tags) {
        // Différent de la colonne used parce que pas actualisé quand un post est supprimé
        query = await client.query("SELECT COUNT(*) FROM post_tag WHERE tag_id = $1", [i.id])
        i.post_number = query.rows[0].count
        query = await client.query("SELECT post_id FROM post_tag WHERE tag_id = $1 ORDER BY post_id DESC LIMIT 1", [i.id])
        if (query.rows[0]) {
            query = await client.query("SELECT * FROM posts WHERE id = $1", [query.rows[0].post_id])
            i.post = query.rows[0]
        }
    }
    res.json({tags: tags, number: number})

})


router.get('/tags/posts/:start/:tag_name', async (req, res) => {
    const tag_name = req.params.tag_name
    const start = parseInt(req.params.start)
    if (typeof tag_name !== 'string' || isNaN(start)) {
        return res.status(400)
    }
    let posts
    let query = await client.query("SELECT id FROM tags WHERE tag_name = $1", [tag_name])
    if (query.rows.length === 0)
        return res.status(404).json({message: 'non trouvé'})
    let tag_id = query.rows[0].id
    query = await client.query("SELECT * FROM post_tag WHERE tag_id = $1 ORDER BY post_id DESC LIMIT 10 OFFSET $2", [tag_id, start])
    posts = query.rows;
    query = await client.query("SELECT COUNT(*) FROM post_tag WHERE tag_id = $1", [tag_id])
    let number = query.rows[0].count
    for (let i = 0; i < posts.length; i++) {

        // Différent de la colonne used parce que pas actualisé quand un post est supprimé
        query = await client.query("SELECT * FROM posts WHERE id = $1 ORDER BY created_at DESC", [posts[i].post_id])
        posts[i] = query.rows[0]
        query = await client.query('SELECT tag_id FROM post_tag WHERE post_id = $1', [posts[i].id])
        let tags_id = query.rows
        let tags = []
        for (let i of tags_id) {
            query = await client.query('SELECT tag_name FROM tags WHERE id = $1', [i.tag_id])
            tags.push(query.rows[0].tag_name)
        }
        posts[i].tags = tags;
        if (req.session.user.data) {
            const like_query = await client.query('SELECT * FROM liked_post WHERE user_id = $1 AND post_id = $2', [req.session.user.data.id, posts[i].id])
            posts[i].liked = like_query.rows.length > 0;
        }
        let answer_query = await client.query('SELECT COUNT(*) FROM answers WHERE post_id = $1', [posts[i].id])
        posts[i].responses = answer_query.rows[0].count
        answer_query = await client.query('SELECT * FROM answers WHERE post_id = $1 ORDER BY created_at DESC', [posts[i].id])
        posts[i].comments = answer_query.rows.reverse()
        for (let j of posts[i].comments) {
            let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [j.user_id])
            j.username = user_query.rows[0].username
            j.profile_pic = user_query.rows[0].profile_pic
        }
    }
    res.json({posts: posts, number: number})
})

router.get('/posts/popular/:start', async (req, res) => {
    const start = parseInt(req.params.start)
    if (isNaN(start)) {
        return res.status(400).json({message: 'bad request'})
    }

    let query = await client.query("SELECT * FROM posts ORDER BY likes DESC LIMIT 10 OFFSET $1", [start])
    let posts = query.rows;
    query = await client.query("SELECT COUNT(*) FROM posts")
    let number = query.rows[0].count
    for (let i of posts) {
        query = await client.query('SELECT tag_id FROM post_tag WHERE post_id = $1', [i.id])
        let tags_id = query.rows
        let tags = []
        for (let j of tags_id) {
            query = await client.query('SELECT tag_name FROM tags WHERE id = $1', [j.tag_id])
            tags.push(query.rows[0].tag_name)
        }
        i.tags = tags;
        if (req.session.user.data) {
            const like_query = await client.query('SELECT * FROM liked_post WHERE user_id = $1 AND post_id = $2', [req.session.user.data.id, i.id])
            i.liked = like_query.rows.length > 0;
        }
        let answer_query = await client.query('SELECT COUNT(*) FROM answers WHERE post_id = $1', [i.id])
        i.responses = answer_query.rows[0].count
        answer_query = await client.query('SELECT * FROM answers WHERE post_id = $1 ORDER BY created_at DESC', [i.id])
        i.comments = answer_query.rows.reverse()
        for (let j of i.comments) {
            let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [j.user_id])
            j.username = user_query.rows[0].username
            j.profile_pic = user_query.rows[0].profile_pic
        }
    }
    res.json({posts: posts, number: number})
})

router.get('/posts/last/:start', async (req, res) => {
    const start = parseInt(req.params.start)
    if (isNaN(start)) {
        return res.status(400).json({message: 'bad request'})
    }
    let query = await client.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET $1", [start])
    let posts = query.rows;
    query = await client.query("SELECT COUNT(*) FROM posts")
    let number = query.rows[0].count
    for (let i of posts) {
        query = await client.query('SELECT tag_id FROM post_tag WHERE post_id = $1', [i.id])
        let tags_id = query.rows
        let tags = []
        for (let j of tags_id) {
            query = await client.query('SELECT tag_name FROM tags WHERE id = $1', [j.tag_id])
            tags.push(query.rows[0].tag_name)
        }
        i.tags = tags;
        if (req.session.user.data) {
            const like_query = await client.query('SELECT * FROM liked_post WHERE user_id = $1 AND post_id = $2', [req.session.user.data.id, i.id])
            i.liked = like_query.rows.length > 0;
        }
        let answer_query = await client.query('SELECT COUNT(*) FROM answers WHERE post_id = $1', [i.id])
        i.responses = answer_query.rows[0].count
        answer_query = await client.query('SELECT * FROM answers WHERE post_id = $1 ORDER BY created_at DESC', [i.id])
        i.comments = answer_query.rows.reverse()
        for (let j of i.comments) {
            let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [j.user_id])
            j.username = user_query.rows[0].username
            j.profile_pic = user_query.rows[0].profile_pic
        }
    }
    res.json({posts: posts, number: number})
})


router.put('/like/:post_id', async (req, res) => {
    if (!req.session.user.data)
        return res.status(403).json({message: 'forbidden'})
    const post_id = parseInt(req.params.post_id)
    if (isNaN(post_id))
        return res.status(400).json({message: 'bad request'})
    const query = await client.query('SELECT * FROM liked_post WHERE post_id = $1 AND user_id = $2', [post_id, req.session.user.data.id])
    if (query.rows.length > 0) {
        await client.query('UPDATE posts SET likes = likes-1 WHERE id = $1 ', [post_id])
        await client.query('DELETE FROM liked_post WHERE post_id = $1 AND user_id = $2', [post_id, req.session.user.data.id])
        res.json({action: 'dislike'})
    } else {
        await client.query('UPDATE posts SET likes = likes+1 WHERE id = $1 ', [post_id])
        await client.query('INSERT INTO liked_post(post_id, user_id) VALUES ($1, $2)', [post_id, req.session.user.data.id])
        res.json({action: 'like'})
    }
})

router.post("/comment/:post_id", async (req, res) => {
    if (!req.session.user.data)
        return res.status(403).json({message: 'forbidden'})
    if (req.session.user.lastComment !== 0) {
        if (new Date().getTime() - req.session.user.lastComment < 30 * 1000) {
            return res.status(403).json({message: 'too fast', code: 10})
        } else req.session.user.lastComment = new Date().getTime()
    } else {
        req.session.user.lastComment = new Date().getTime()
    }
    let content = req.body.content;
    let post_id = parseInt(req.params.post_id);

    if (typeof content !== 'string' || content === '' || isNaN(post_id)) {
        res.status(400).json({message: 'bad_request'})
    }

    let query = await client.query('SELECT likes FROM posts WHERE id = $1', [post_id])
    if (query.rows.length === 0)
        res.status(404).json({message: "Le post n'existe pas"})

    query = await client.query('INSERT INTO answers(post_id, user_id, content, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [post_id, req.session.user.data.id, content, new Date()])
    let data = query.rows[0]
    let user_query = await client.query("SELECT username, profile_pic FROM users WHERE id = $1", [data.user_id])
    data.username = user_query.rows[0].username
    data.profile_pic = user_query.rows[0].profile_pic

    res.json({answer: data})

});

router.delete("/comment/:comment_id", async (req, res) => {
    if (!req.session.user.data)
        return res.status(403).json({message: 'forbidden'})

    const comment_id = parseInt(req.params.comment_id)
    if (isNaN(comment_id)) {
        res.status(400).json({message: 'bad_request'})
    }

    let query = await client.query('SELECT * FROM answers WHERE id = $1', [comment_id])
    if (query.rows.length === 0)
        res.status(404).json({message: "Le post n'existe pas"})

    if (query.rows[0].user_id !== req.session.user.data.id)
        return res.status(403).json({message: 'forbidden'})

    await client.query('DELETE FROM answers WHERE id = $1', [comment_id])
    res.json({data: {id: comment_id, post_id: query.rows[0].post_id}})

});

router.post('/acceptcookies', (req, res) => {
    res.cookie('accept-cookies', true, {httpOnly: false})
    res.end()
})


module.exports = router;

