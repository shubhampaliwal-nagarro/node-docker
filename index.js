const express = require('express')
const session = require('express-session');
const redis = require("redis")
const mongoose = require("mongoose");
const app = express()

const { ROOT_USERNAME, ROOT_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require('./config/config');

const ArticleRouter = require('./routes/ArticleRouter')

const { RedisStore } = require("connect-redis")
let redisClient = redis.createClient({
    socket: {

        host: process.env.REDIS_HOST || "redis",
        port: process.env.REDIS_PORT || 6379
    }
})

redisClient.connect().then((c) => console.log("Connected to REDIS")).catch((e) => console.log("e", e))

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const CONNECTION_URI = `mongodb://${ROOT_USERNAME}:${ROOT_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/?authSource=admin`
console.log(CONNECTION_URI)


mongoose.connect(CONNECTION_URI).then(() => console.log("CONNECTED TO MONGO")).catch((e) => console.log(e))
const port = 3000

app.use("/api", (req,res) => {
    res.send("Hello World")
});   

app.use("/api", ArticleRouter);   // <- add

app.listen(port, () => console.log(`Example app listening on port ${port}!`))