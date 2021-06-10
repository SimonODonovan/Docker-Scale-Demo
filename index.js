import express from 'express';
import mongoose from 'mongoose';
import session from "express-session";
import redis from "redis";
import connectRedis from 'connect-redis';
import { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_URL, REDIS_PORT, REDIS_SESSION_SECRET } from './config/config.js';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from "cors";

const app = express();

let RedisStore = connectRedis(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});

const connectWithRetry = () => {
    const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/blog?authSource=admin`;
    console.log("Attempting connection to db.")
    mongoose
        .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => console.log("Connected to db successfully."))
        .catch(e => {
            console.log(e);
            console.log("Retrying db connection...");
            setTimeout(connectWithRetry, 5000);
        });
}

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: REDIS_SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 60000,
        },
    })
)

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi there!!</h2>");
    console.log("Request recieved")
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));