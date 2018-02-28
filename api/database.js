const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb://mongo/' //hostname mongo represents the container name
let instance
let database

const connect = async (callback) => {
    try {
        MongoClient.connect(uri, (err, _instance) => {
          instance = _instance;
          database = _instance.db('App');
          return callback(err)
        })
    } catch (e) {
        throw e
    }
}

const getDatabase = () => database

const disconnect = () => instance.close()

module.exports = { connect, getDatabase, disconnect }
