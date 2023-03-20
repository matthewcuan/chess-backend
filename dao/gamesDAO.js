// interacts directly with 'games' collection in database
// functions: getPublicGames, getUserGames, addGame, 
// getGame, updateGame, deleteGame

import mongodb from "mongodb";

// to be used for getting games
const objectID = (id) => new mongodb.ObjectId(id);

let games

export default class GamesDAO {

  // attempt to connect to database
  static async injectDB(conn) {
    if (games) {
      return
    }
    try {
      games = await conn.db("chess").collection("games")
    } catch (e) {
      console.error(`Unable to establish collection handles in gamesDAO: ${e}`)
    }
  }

  // saves game to database
  static async addGame(datetime, player1, player2, winner, type, history) {
    try {
      const gameDoc = {
        datetime: datetime,
        player1: player1,
        player2: player2,
        winner: winner,
        type: type, // public or private
        history: history // game history
      }
      console.log("adding game")
      return await games.insertOne(gameDoc)
    } catch (e) {
      console.error(`Unable to add game: ${e}`)
      return { error: e }
    }
  }

  // gets all publicly saved games
  static async getPublicGames() {
    try {
      console.log("attempting to get public games");
      const cursor = games.find({ type: "public" });
      return await cursor.toArray();
    } catch (e) {
      console.log("user not found")
      console.error(`Unable to find user: ${e}`)
      return { error: e }
    }
  }

  // gets all games saved by user (public or private)
  static async getUserGames(player) {
    try {
      console.log("attempting to get user games");
      const cursor = games.find({ player1: player });
      return await cursor.toArray();
    } catch (e) {
      console.log("games not found")
      console.error(`Unable to find games: ${e}`)
      return { error: e }
    }
  }
    
  // gets specific games history
  // used when reviewing a specific game
  static async getGame(id) {
    try {
      console.log("attempting to get game")
      return await games.findOne({ _id: objectID(`${id}`) })
    } catch (e) {
      console.log("game not found")
      console.error(`Unable to find game: ${e}`)
      return { error: e }
    }
  }

  // updates game "title"
  // not implemented in app
  static async updateGame(game, title) {
    try {
      const updateResponse = await games.updateOne(
        { _id: objectID(game) },
        { $set: { title: title } }
      )
      return updateResponse
    } catch (e) {
      console.error(`Unable to update game: ${e}`)
      return { error: e }
    }
  }

  // deletes game
  // not implemented in app
  static async deleteGame(gameId) {
    try {
      const deleteGame = await games.deleteOne({
        _id: objectID(gameId)
      })
  
      return deleteGame
    } catch (e) {
      console.error(`Unable to delete game: ${e}`)
      return { error: e }
    }
  }


}