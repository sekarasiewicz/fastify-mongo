async function routes(fastify) {
  const { mongo } = fastify
  const collection = mongo.collection('searchable')

  fastify.get('/', async () => ({ hello: 'world' }))

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
  }, async (request) => {
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

  fastify.post('/search', opts, async (request) => {
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
    handler: async request => ({ hello: request.body.hello }),
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
        required: ['email', 'password'],
      },
    },
  }, async (request, reply) => {
    try {
      const result = await User.create(request.body)
      return { id: result._id }
    } catch (e) {
      return reply.code(400).send(e)
    }
  })

  fastify.post('/signup', async () => {
    const token = fastify.jwt.sign({ ok: 'Yes' })
    return { token }
  })

  fastify.decorate('verifyJWT', async (request, reply, done) => {
    try {
      await request.jwtVerify()
      done()
    } catch (e) {
      done(e)
    }
  })

  fastify.get('/users', {
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
      },
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
    beforeHandler: fastify.auth([fastify.verifyJWT]),
  }, async () => User.find({}))
}

module.exports = routes
