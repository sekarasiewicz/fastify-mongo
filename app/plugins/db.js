const fastifyPlugin = require('fastify-plugin')
const mongoose = require('mongoose')

async function dbConnector(fastify) {
  const { env } = process
  const url = `mongodb://${env.DB_USER}:${env.DB_PASS}@mongo:27017/${env.DB_AUTH}`
  try {
    await mongoose.connect(url, { useNewUrlParser: true })
  } catch (e) {
    fastify.log.error(`connection error: ${e}`)
    process.exit(1)
  }

  const db = mongoose.connection
  db.on('error', fastify.log.error.bind(console, 'connection error:'))

  fastify.decorate('mongo', db.useDb('test'))
}

module.exports = fastifyPlugin(dbConnector)
