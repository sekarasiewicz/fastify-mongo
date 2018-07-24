async function auth(fastify) {
  fastify.get('/d', async () => ({ hello: 'world' }))
}

module.exports = auth
