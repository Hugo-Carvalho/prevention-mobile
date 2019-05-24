import React from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default class ModalHeader extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render(){
    return(
        <View style={style.container}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}>
            <View style={{marginTop: 22}}>
              <View>
                <Text>Hello World!</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Hide Modal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity 
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <View style={style.button}>
              <Image style={style.imageIcon}
                source={require('../../assets/icons/openModalMenu.png')}
              />
            </View>  
          </TouchableOpacity>
        </View>
    );
  }
}

const style = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: "transparent",
  },

  imageIcon: {
    height: 75,
    width: 75,
    resizeMode: 'stretch',
  }
});