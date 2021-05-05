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
      board = [];
      console.log('Theres an error - ', err);
    }

    reply.code(200).send(board);
  });
}

module.exports = routes;