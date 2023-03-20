[Frontend code](https://github.com/matthewcuan/chess-with-friends-frontend)

- backend code using RESTful API (mongo)
- access user and game databases for login and game review

## How to use

- fork or download repo
- in terminal, run "node server.js" or "nodemon server.js"

## Server Structure

├── api
│   ├── users.controller.js 
│   ├── users.routes.js
│   ├── games.controller.js
│   ├── games.routes.js
├── dao
│   ├── usersDAO.js
│   ├── gamesDAO.js
└── server.js