const fastifyPlugin = require('fastify-plugin')
const mongoose = require('mongoose')

async function dbConnector (fastify, options) {
  const env = process.env
  const url = `mongodb://${env.DB_USER}:${env.DB_PASS}@mongo:27017/${env.DB_AUTH}`
  mongoose.connect(url, { useNewUrlParser: true })

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))

  fastify.decorate('mongo', db.useDb('test'))
}

module.exports = fastifyPlugin(dbConnector)
