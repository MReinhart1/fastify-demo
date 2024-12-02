"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
require("./types");
const server = (0, fastify_1.default)();
const adding = (a, b) => a + b;
// Decorating the request object
server.decorateRequest('user', '');
server.decorateRequest('sum', 0);
server.decorateRequest('message', '');
server.decorate('adding', adding);
// Creating a plugin
const fastifyPlugin = (0, fastify_plugin_1.default)(function (fastify, opts, done) {
    fastify.addHook('onRequest', (request, _reply, done) => {
        const sum = fastify.adding(10, 30);
        request.user = 'John Doe';
        request.sum = sum;
        request.message = opts.message;
        done();
    }),
        fastify.get('/plugin', async (_request, reply) => {
            reply.send('This is a plugin route');
        });
    done();
});
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
});
server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
