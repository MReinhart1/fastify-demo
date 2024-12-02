import fastify from 'fastify';
import fp from 'fastify-plugin';
import './types'

const server = fastify()

const adding = (a: number, b: number) => a + b

// Decorating the request object
server.decorateRequest('user', '')
server.decorateRequest('sum', 0)
server.decorateRequest('message', '')
server.decorate('adding', adding);


// Creating a plugin
const fastifyPlugin = fp(function (fastify, opts: {message: string}, done) {  
  fastify.addHook('onRequest', (request, _reply, done) => {
    const sum = fastify.adding(10,30)
    request.user = 'John Doe';
    request.sum = sum
    request.message = opts.message
    done()
  }),
  fastify.get('/plugin', async (_request, reply) => {
    reply.send('This is a plugin route'); 
  })
  done()
})

server.register(fastifyPlugin, { message: 'message from opts' });


// Creating the routes
server.route({
  method: 'GET',
  url: '/',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
          user: { type: 'string' },
          sum: { type: 'number' },
          message: { type: 'string' },
        }
      }
    }
  },
  handler: function (request, reply) {
    reply.send({ hello: 'World', user: request.user, sum: request.sum, message: request.message }); 
  }
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
