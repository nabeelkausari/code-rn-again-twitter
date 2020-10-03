import express from 'express';
import { createServer } from 'http';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { readFileSync } from 'fs'

import './config/db';
import constants from './config/constants';
const typeDefs = readFileSync(__dirname + '/graphql/schema.graphqls', 'utf8')
import resolvers from './graphql/resolvers/index';
import middlewares from './config/middlewares';

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express();

middlewares(app);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: constants.GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://192.168.0.104:${constants.PORT}${constants.SUBSCRIPTIONS_PATH}`
  })
)


app.use(
  constants.GRAPHQL_PATH,
  graphqlExpress(({ user }) => ({
    schema,
    context: { user }
  }))
)

const server = createServer(app)

server.listen(constants.PORT, err => {
  if (err) return console.log(err);
  const path = constants.SUBSCRIPTIONS_PATH;
  new SubscriptionServer({ schema, execute, subscribe }, { server, path });

  console.log(`server listening on port ${constants.PORT}`)
})