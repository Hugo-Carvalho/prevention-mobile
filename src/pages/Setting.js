import React from 'react';
import { View, Alert, Platform, PermissionsAndroid, StyleSheet } from 'react-native';

export default class Setting extends React.Component {

  constructor(props) {
      super(props);
  }

  render() {
    return (
      <View style={style.container}>

      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
});