const fastifyPlugin = require('fastify-plugin')
const MongoClient = require('mongodb').MongoClient

async function dbConnector (fastify, options) {
  const db = await MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true })
  fastify.decorate('mongo', db)
}

module.exports = fastifyPlugin(dbConnector)
