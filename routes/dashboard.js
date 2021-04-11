const router = require('express').Router();
const fetch = require('node-fetch')

router.get('/', (req, res) => {
    res.sendStatus(200)
})

router.get('/apply', isAuthorized, ((req, res) => {
    res.render("apply", {
        db: process.DB,
        env: process.env,
    })
}))

router.post('/apply/submit', (req, res) => {
    var data = req.body;
    console.log(data);
})






function isAuthorized(req, res, next) {
    if(req.user) {
        next();
    } else {
        res.redirect("/auth")
    }
}

module.exports = router;
