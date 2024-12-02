import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
      adding: (a: number, b: number) => number
    }
    interface FastifyRequest {
      user: string
      sum: number
      message: string
    }
}
