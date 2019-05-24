import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class FormRow extends React.Component {
  
  constructor(props){
    super(props);
  }

  render(){
    const { children } = this.props;
    return(
      <View style={style.container}>
        {children}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 30,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    elevation: 1
  }
});