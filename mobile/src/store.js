import { createStore, applyMiddleware } from 'redux';
import { AsyncStorage } from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import { STORAGE_KEY, API_URL } from "./utils/constants";
import reducers from './reducers';

const networkInterface = createNetworkInterface({
  uri: `http://${API_URL}/graphql`
});

const wsClient = new SubscriptionClient(`ws://${API_URL}/subscriptions`, {
  reconnect: true,
  connectionParams: {}
});

networkInterface.use([{
  async applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
    } catch (err) {
      throw err;
    }
    return next();
  }
}]);

const networkInterfaceWithSubs = addGraphQLSubscriptions(
  networkInterface, wsClient
);

export const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubs
});

const middlewares = [
  apolloClient.middleware(),
  thunk,
  createLogger()
];

export const store = createStore(
  reducers(apolloClient),
  undefined,
  composeWithDevTools(
    applyMiddleware(...middlewares)
  )
);