import GamesDAO from "../dao/gamesDAO.js";

export default class GamesController {
    // gets all publicly saved games (public tag)
    // to be displayed on 'login' page
    static async apiGetPublicGames(req, res, next) {
        try {
            let games = await GamesDAO.getPublicGames()
            if (!games) {
              res.status(404).json({ error: "Not found" })
              return
            }
            res.json(games)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    
    // gets all users games
    // to be displayed in the 'view games' page
    static async apiGetUserGames(req, res, next) {
        try {
            let id = req.params.user || {}
            let games = await GamesDAO.getUserGames(id)
            console.log(id)
            if (!games) {
              res.status(404).json({ error: "Not found" })
              return
            }
            console.log(games)
            res.json(games)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    
    // posts/saves recently played game
    // option for public or private save
    static async apiPostGame(req, res, next) {
        try {
            const datetime = req.body.datetime
            const player1 = req.body.player1
            const player2 = req.body.player2
            const winner = req.body.winner
            const type = req.body.type
            const history = req.body.history
            console.log('player1', player1)
            console.log('player2', player2)
            const reviewResponse = await GamesDAO.addGame(
                datetime,
                player1,
                player2,
                winner,
                type,
                history
            )
            res.json({ status: "success" })     
        } catch (e) {
            res.status(500).json({ error: e.message })
        } 
    }
    
    // gets a single game
    // to be displayed when accessing saved game
    static async apiGetGame(req, res, next) {
        try {
            let id = req.params.id || {}
            let game = await GamesDAO.getGame(id)
            console.log(id)
            if (!game) {
              res.status(404).json({ error: "Not found" })
              return
            }
            res.json(game)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    
    // updates game description
    // not implemented in app
    static async apiUpdateGame(req, res, next) {
        try {
            const game = req.params.id
            const title = req.body.title
      
            const gameResponse = await GamesDAO.updateGame(
              game,
              title
            )
      
            var { error } = gameResponse
            if (error) {
              res.status(400).json({ error })
            }
      
            if (gameResponse.modifiedCount === 0) {
              throw new Error(
                "unable to update game",
              )
            }
      
            res.json({ status: "success" })
          } catch (e) {
            res.status(500).json({ error: e.message })
          }
    }

    // deletes game from db
    // not implemented in app
    static async apiDeleteGame(req, res, next) {
        try {
            const gameId = req.params.id
            const gameResponse = await GamesDAO.deleteGame(gameId)
            res.json({ status: "success" })
          } catch (e) {
            res.status(500).json({ error: e.message })
          }
    }

}