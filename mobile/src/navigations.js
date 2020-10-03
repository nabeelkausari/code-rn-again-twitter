import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import { colors } from "./utils/constants"
import HeaderAvatar from "./components/HeaderAvatar"
import ButtonHeader from "./components/ButtonHeader"
import NewTweetScreen from "./screens/NewTweetScreen"

const TAB_ICON_SIZE = 20

const Tabs = TabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      headerTitle: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="home"/>
      )
    })
  },
  Explore: {
    screen: ExploreScreen,
    navigationOptions: () => ({
      headerTitle: 'Explore',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="search"/>
      )
    })
  },
  Notification: {
    screen: NotificationScreen,
    navigationOptions: () => ({
      headerTitle: 'Notification',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="bell"/>
      )
    })
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: () => ({
      headerTitle: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="user"/>
      )
    })
  }
}, {
  lazy: true,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: colors.PRIMARY,
    inactiveTintColor: colors.LIGHT_GRAY,
    style: {
      backgroundColor: colors.WHITE,
      height: 50,
      paddingVertical: 5
    }
  }
})

const NewTweetModal = StackNavigator(
  {
    NewTweet: {
      screen: NewTweetScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <HeaderAvatar/>,
        headerRight: (
          <ButtonHeader side="right" onPress={() => {
            Keyboard.dismiss();
            navigation.goBack(null)
          }}>
            <EvilIcons color={colors.PRIMARY} size={25} name="close" />
          </ButtonHeader>
        )
      })
    }
  }, {
    headerMode: 'none'
  }
)

const AppMainNav = StackNavigator({
  Home: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HeaderAvatar/>,
      headerRight: (
        <ButtonHeader side="right" onPress={() => navigation.navigate('NewTweet')}>
          <SimpleLineIcons color={colors.PRIMARY} size={20} name="pencil"/>
        </ButtonHeader>
      )
    })
  },
  NewTweet: {
    screen: NewTweetModal
  }
}, {
  cardStyle: {
    backgroundColor: '#F1F6FA'
  },
  navigationOptions: () => ({
    headerStyle: {
      backgroundColor: colors.WHITE
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: colors.SECONDARY
    }
  })
});

class AppNavigator extends Component {
  render() {
    const nav = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav
    });

    if(!this.props.user.isAuthenticated) {
      return <AuthenticationScreen/>
    }
    return <AppMainNav navigation={nav} />
  }
}

export default connect(
  ({ nav, user }) => ({ nav, user })
)(AppNavigator);

export const router = AppMainNav.router;