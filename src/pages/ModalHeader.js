import React from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { logout, removeUserToken } from '../actions';
import { connect } from 'react-redux';

import { withNavigation } from 'react-navigation';

class ModalHeader extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _signOutAsync = () => {
    this.props.removeUserToken()
      .then(() => {
        this.setState({ modalVisible: false });
        this.props.navigation.replace('Login');
        this.props.logout();
      })
      .catch(error => {
        this.setState({ error })
      })
  };

  render(){
    return(
        <View style={style.container}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}>
            <View style={style.containerModal}>
              <View style={style.headerModal}>
                <Text style={style.title}>PREVENTION MOBILE</Text>
              </View>
              <View style={style.bodyModal}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={style.menu}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>{
                    this._signOutAsync();
                  }}>
                  <Text style={style.menu}>Logout</Text>
                </TouchableOpacity>
              </View>
              <View style={style.footerModal}>
                <Text style={style.version}>version 1.0.0</Text>
                <Text style={style.version}></Text>
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
  },

  containerModal: {
    backgroundColor: '#132235',
    flex: 1
  },

  headerModal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    fontFamily: 'BungeeInline-Regular',
    fontSize: 23,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10
  },

  bodyModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  menu: {
    fontFamily: 'BungeeInline-Regular',
    fontSize: 20,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 20,
    padding: 10
  },

  footerModal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  version: {
    fontFamily: 'BungeeInline-Regular',
    fontSize: 10,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10
  }
});

const mapStateToProps = state => ({
  token: state.token
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
  logout: () => dispatch(logout())
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ModalHeader));