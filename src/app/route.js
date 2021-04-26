const { solver } = require('./engine');

const routes = async (fastify) => {
  fastify.get('/health', async (request, reply) => {
    return { status: 'OK' }
  });

  fastify.post('/solve', async (request, reply) => {
    let board;
    try {
      board = solver(request.body.ques);
    } catch(err) {
      throw new Error('Problem could not be solved')
    }

    return {
      status: 'OK',
      solution: board ,
    }
  });
}

  module.exports = routes;