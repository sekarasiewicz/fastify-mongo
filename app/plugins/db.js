const fastifyPlugin = require('fastify-plugin')
const MongoClient = require('mongodb').MongoClient

async function dbConnector (fastify, options) {
  const env = process.env
  const url = `mongodb://${env.DB_USER}:${env.DB_PASS}@mongo:27017/${env.DB_AUTH}`
  const db = await MongoClient.connect(url, { useNewUrlParser: true })

  fastify.decorate('mongo', db)
}

module.exports = fastifyPlugin(dbConnector)
