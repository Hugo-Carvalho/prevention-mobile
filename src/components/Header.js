import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Header extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
  	return(
		  	<View style={style.container}>
					<Text style={style.title}>{this.props.title}</Text>
		  	</View>
		);
  }
}

const style = StyleSheet.create({
  container: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
  },

  title: {
		fontFamily: 'BungeeInline-Regular',
		fontSize: 23,
		color: '#FFF',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
	  textShadowOffset: {width: -2, height: 2},
	  textShadowRadius: 10
  }
});