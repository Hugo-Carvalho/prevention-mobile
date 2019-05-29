import React from 'react';

import { createAppContainer, createStackNavigator } from 'react-navigation';

import AuthLoading from './pages/AuthLoading';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Home from './pages/Home';
import Maps from './pages/Maps';
import ModalHeader from './pages/ModalHeader';

import Header from './components/Header';

const AppNavigator = createStackNavigator({
  'AuthLoading': {
    screen: AuthLoading,
    navigationOptions: {
        header: null
    }
  },

  'Login': {
    screen: Login,
    navigationOptions: {
        header: null
    }
  },

  'Register': {
    screen: Register,
    navigationOptions: {
        header: null
    }
  },

  'Main': {
    screen: Main
  },

  'Home': {
    screen: Home
  },

  'Maps': {
    screen: Maps
  },

  'ModalHeader': {
    screen: ModalHeader
  }
},
{
  defaultNavigationOptions: {
    headerTitle: <Header title="PREVENTION MOBILE" />,
    headerLeft: <ModalHeader />,
    headerTintColor: '#FFF',
    headerStyle: {
        backgroundColor: '#132235',
    }
  }
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;