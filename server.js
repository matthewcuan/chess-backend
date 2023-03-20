import dotenv from "dotenv";
import mongodb from "mongodb";
import express from "express";
import cors from "cors";
import UsersDAO from "./dao/usersDAO.js";
import GamesDAO from "./dao/gamesDAO.js";
import users from "./api/users.routes.js";
import games from "./api/games.routes.js";

// for local testing
dotenv.config();

// connecting to database
const MongoClient = mongodb.MongoClient;
const chess_password = process.env.CHESS_KEY;
const uri = `mongodb+srv://black:${chess_password}@cluster0.mqza9mv.mongodb.net/?retryWrites=true&w=majority`

const port = process.env.PORT || 8000

const app = express();
app.use(cors());
app.use(express.json());

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    })
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})

// injecting API
.then(async client => {
    await UsersDAO.injectDB(client)
    await GamesDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`mongo listening on port ${port}`)
    })
})

// establishing connection to mongo
.then(() => {
    app.use("/api/v1/users", users);
    app.use("/api/v1/games", games);
    app.use("*", (req, res) => res.status(404).json({ error: "not found" }));
});


