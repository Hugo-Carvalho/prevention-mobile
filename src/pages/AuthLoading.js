import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import { getUserToken, removeUserToken } from '../actions';

import firebase from 'firebase';

class AuthLoading extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    const config = {
      apiKey: "AIzaSyDKCCpuw48ChX6Vts-Euzn5jOdqFatkqcY",
      authDomain: "prevention-mobile-83375.firebaseapp.com",
      databaseURL: "https://prevention-mobile-83375.firebaseio.com",
      projectId: "prevention-mobile-83375",
      storageBucket: "prevention-mobile-83375.appspot.com",
      messagingSenderId: "204875861402"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    this.props.getUserToken()
      .then(() => {
        console.log(this.props);
        this.props.navigation.replace(this.props.token.token !== null ? 'Main' : 'Login');
      })
      .catch(error => {
        console.log('erro: '+ error);
        this.setState({ error });
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  //token: state.token
});

const mapDispatchToProps = dispatch => ({
  getUserToken: () => dispatch(getUserToken()),
  removeUserToken: () => dispatch(removeUserToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);