require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const app = express();
const port = process.env.PORT
const session = require('express-session');
const passport = require('passport');
const bodyParser = require("body-parser");
const DiscordStrat = require("./methods/discord");

global.bot = require('./bot/bot');

const adapter = new FileSync('./questions.json')
process.DB = low(adapter);
process.DB.defaults({questions: []}).write();

bot.login(process.env.BOT_TOKEN)

const db = require('./database/database');

db.then(() => console.log("connected to mongodb")).catch(err => console.log(err));

const authRoute = require('./routes/auth');
const dashRoute = require('./routes/dashboard')


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static("./public"));

app.use(session({
    secret: 'random stuff jefkasokdsjfs',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())

app.use('/auth', authRoute);
app.use('/dash', dashRoute)

app.get('/', (req,res) => {
    res.json({
        "success": true
    })
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})