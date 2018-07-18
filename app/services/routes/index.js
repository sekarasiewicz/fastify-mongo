async function routes (fastify, options) {
  const mongo = fastify.mongo
  const collection = mongo.collection('searchable')

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
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => ({ hello: request.body.hello }),
    // handler: async (request, reply) => reply.send({ hello: request.body.hello }),
  })
  const User = mongo.model('User')

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const result = await User.create(request.body)
    return { id: result._id }
  })

  fastify.get('/users', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request, reply) => User.find({}))
}

module.exports = routes
