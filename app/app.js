const path = require('path')
const AutoLoad = require('fastify-autoload')
const fastifyJWT = require('fastify-jwt')
const fastifyAuth = require('fastify-auth')

const authRoutes = require('./services/routes/auth')

module.exports = (fastify, opts, next) => {
  fastify.register(fastifyJWT, {
    secret: 'supersecret',
  })
  fastify.register(fastifyAuth)

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'models'),
  })

  fastify.register(authRoutes)

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
  })

  next()
}
