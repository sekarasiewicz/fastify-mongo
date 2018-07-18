async function auth (fastify, options) {
  fastify.get('/d', async (request, reply) => {
    return { hello: 'world' }
  })
}

module.exports = auth
