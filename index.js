import dotenv from 'dotenv'
import mongodb from "mongodb"
import UsersDAO from "./dao/usersDAO.js"
import GamesDAO from "./dao/gamesDAO.js"
import express from "express"
import cors from "cors"
import users from "./api/users.routes.js"
import games from "./api/games.routes.js"
import { createServer } from "http";
import { Server } from "socket.io";
import initGame from './socket.js';

dotenv.config()
const MongoClient = mongodb.MongoClient
const chess_username = process.env.CHESS_ID
const chess_password = process.env.CHESS_KEY
const uri = `mongodb+srv://${chess_username}:${chess_password}@cluster0.mqza9mv.mongodb.net/?retryWrites=true&w=majority`

const port = 8000

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

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
.then(async client => {
    await UsersDAO.injectDB(client)
    await GamesDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`mongo listening on port ${port}`)
    })
})
.then(() => {
    io.on("connection", (socket) => {
        console.log('a user connected');
        initGame(io, socket);
        
      });

    app.use("/api/v1/users", users);
    app.use("/api/v1/games", games);
    app.use("*", (req, res) => res.status(404).json({ error: "not found" }));
    
    server.listen(5000, () => {
        console.log("socket listening on port 5000");
    });
});


