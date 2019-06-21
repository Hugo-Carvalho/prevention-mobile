import React from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  Alert,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import ToggleBox from 'react-native-togglebox';

import { connect } from 'react-redux';

import SystemSetting from 'react-native-system-setting';

import firebase from 'firebase';

class Setting extends React.Component {

  constructor(props) {
      super(props);

    this.state = {
      pass: '',
      cPass: '',
      isLoading: false
    }
  }

  onChangeHandler(field, value) {
    this.setState({
      [field]: value
    });
  }

  renderButton() {
    if (this.state.isLoading) {
      return <ActivityIndicator size="large" color="#0F6CCC" />;
    }
    return (
      <Button title="Alterar" onPress={() => this.changePass()} />
    );
  }

  changePass(){
    this.setState({ isLoading: true });
    const { pass, cpass } = this.state

    const user = firebase.auth().currentUser

    if (pass == cpass) {
      user
        .updatePassword(pass)
        .then( () => {
          Alert.alert('Sucesso!', 'Senha alterada!');
        }).catch( (error) => {
          Alert.alert('Erro no cadastro', this.getMessageByErrorCode(error.code));
        })
        .then(() => {
          this.setState({ isLoading: false });
        })
    } else {
      Alert.alert('Erro', 'As senhas não conferem!');
      this.setState({ isLoading: false });
    }
  }

  getMessageByErrorCode(errorCode) {
    switch (errorCode) {
      case 'auth/weak-password':
        return 'Senha fraca!';
      case 'auth/requires-recent-login':
        return 'Esta operação é crítica e requer uma autenticação recente. Por favor, realize o acesso novamnete!';
      default:
        return 'Erro desconhecido!';
    }
  }

  render() {
    return (
      <View style={style.container}>
        <ScrollView style={style.scroll}>
          <ToggleBox style={style.toggle} label='CONTA E PERFIL' arrowColor='#000' arrowDownType="expand-more" arrowUpType="expand-less">
            <View style={style.containerToggle}>
              <Text style={style.label}>Email: { this.props === null ? '' : this.props.user.user.user.email }</Text>
              <TextInput
                value={this.state.pass}
                onChangeText={value => this.onChangeHandler('pass', value)}
                placeholder="Nova senha"
                secureTextEntry
                style={style.input}
              />
              <TextInput
                value={this.state.cpass}
                onChangeText={value => this.onChangeHandler('cpass', value)}
                placeholder="Confirmar senha"
                secureTextEntry
                style={style.input}
              />
              <View style={style.button}>
                {this.renderButton()}
              </View>
            </View>
          </ToggleBox>
          <TouchableOpacity style={style.toggleButton} onPress={() => SystemSetting.switchBluetooth(() => { })}>
            <Text>BLUETOOTH</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  } 
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },

  scroll: {
    padding: 10
  },

  toggle: { 
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgb(255,255,255)', 
    borderBottomWidth: 1,
    borderColor: "rgb(255,255,255)",
    borderRadius: 5
  },

  toggleButton: {
    height: 50,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 20,
    backgroundColor: 'rgb(255,255,255)',
    borderBottomWidth: 1,
    borderColor: "rgb(255,255,255)",
    borderRadius: 5
  },

  containerToggle: { 
    height: 300, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#eee' 
  },

  label: {
    marginBottom: 20,
  },

  input: {
    width: 300,
    height: 40,
    backgroundColor: 'rgb(150, 150, 150)',
    marginBottom: 10,
    borderRadius: 5,
    color: '#FFF',
    paddingHorizontal: 10
  },

  button: {
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30
  }
});

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(Setting);