const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-jwt'), {
    secret: 'supersecret',
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'models'),
  })

  fastify.register(require('./services/routes/auth'))

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
  })

  next()
}
