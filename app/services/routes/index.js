async function routes (fastify, options) {
  const database = fastify.mongo.db('test')
  const collection = database.collection('searchable')
  const someSupport = fastify.someSupport
  console.log(someSupport())

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/search/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
      querystring: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
    },
  }, async (request, reply) => {
    console.log('request.querystring', request.query)
    const result = await collection.findOne({ id: request.params.id })

    if (result.text === null || result.text === undefined) {
      throw new Error('Invalid value')
    }
    return result.text
  })
  const opts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          id: { type: 'number' },
        },
      },
    },
  }
  fastify.post('/search', opts, async (request, reply) => {
    console.log(request.body)
    const result = await collection.insertOne({
      text: `Some Value ${request.body.id}`,
      id: request.body.id,
    })
    return result
  })
  fastify.addSchema({
    $id: 'greetings',
    type: 'object',
    properties: {
      hello: { type: 'string' },
    },
  })
  fastify.route({
    method: 'POST',
    url: '/s',
    schema: {
      body: 'greetings#',
    },
    handler: async (request, reply) => ({ hello: request.body.hello }),
  })
}

module.exports = routes
