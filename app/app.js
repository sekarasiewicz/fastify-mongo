// const fastify = require('fastify')({
//   logger: true
// })

// fastify.route({
//   method: 'GET',
//   url: '/',
//   schema: {
//     // request needs to have a querystring with a `name` parameter
//     querystring: {
//       name: { type: 'string' }
//     },
//     // the response needs to be an object with an `hello` property of type 'string'
//     response: {
//       200: {
//         type: 'object',
//         properties: {
//           hello: { type: 'string' }
//         }
//       }
//     }
//   },
//   // this function is executed for every request before the handler is executed
//   beforeHandler: async (request, reply) => {
//     // E.g. check authentication
//   },
//   handler: async (request, reply) => {
//     reply.type('application/json').code(200)
//     return { hello: 'world' }
//   }
// })

// const start = async () => {
//   try {
//     await fastify.listen(3000, '0.0.0.0', (err, address) => {
//       if (err) {
//         fastify.log.error(err)
//         process.exit(1)
//       }
//     })
//     fastify.log.info(`server listening on ${fastify.server.address().port}`)
//   } catch (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
// }
// start()

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins')
  })

  // This loads all plugins defined in services
  // define your routes in one of these

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services')
  })

  // Make sure to call next when done
  next()
}
