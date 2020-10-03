import React from 'react';
import { UIManager, AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { store, apolloClient } from './store';
import {colors, STORAGE_KEY} from "./utils/constants"
import { login } from './actions/user';
import AppNavigation from './navigations';

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class App extends React.Component {
  componentWillMount() {
    this._checkIfToken();
  }

  _checkIfToken = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('token: ', token);
      if (token !== null) {
        store.dispatch(login())
      }
    } catch (err) {
      throw err;
    }
  }

  render() {
    return (
      <ApolloProvider store={store} client={apolloClient}>
        <ActionSheetProvider>
          <ThemeProvider theme={colors}>
            <AppNavigation />
          </ThemeProvider>
        </ActionSheetProvider>
      </ApolloProvider>
    );
  }

}