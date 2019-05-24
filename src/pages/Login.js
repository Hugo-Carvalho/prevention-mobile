import React from 'react';
import { 
  View, 
  ScrollView, 
  Dimensions, 
  TextInput, 
  Text,
  Alert,
  Button, 
  TouchableOpacity,
  ActivityIndicator, 
  ImageBackground, 
  Image, 
  StyleSheet 
} from 'react-native';

import { connect } from 'react-redux';

import { tryLogin } from '../actions';

import FormRow from '../components/FormRow';

import firebase from 'firebase';

class Login extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      mail: '',
      pass: '',
      isLoading: false
    }
  }

  componentDidMount(){
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
  }

  onChangeHandler(field, value){
    this.setState({ 
      [field]: value
    });
  }

  tryLogin(){
    this.setState({ isLoading: true });
    const { mail, pass } = this.state
    
    this.props.tryLogin({ mail, pass })
      .then(() => {
        this.props.navigation.replace('Main');
      })
      .catch(error => {
        Alert.alert('Erro no login', this.getMessageByErrorCode(error.code));
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  getMessageByErrorCode(errorCode){
    switch (errorCode){
      case 'auth/invalid-email':
        return 'E-mail inválido!';
      case 'auth/user-disabled':
        return 'Usuário desativado!';
      case 'auth/user-not-found':
        return 'Usuario não encontrado!';
      case 'auth/wrong-password':
        return 'Senha incorreta!';
      default:
        return 'Erro desconhecido!';
    }
  }

  renderButton(){
    if (this.state.isLoading){
      return <ActivityIndicator size="large" color="#0F6CCC" />;
    }
    return(
      <Button title="Entrar" onPress={() => this.tryLogin()} />
    );
  }

  render() {
    return (
      <View>
        <ScrollView style={[style.scrollview]}>
          <View style={style.logoContainer}>
            <Image source={require('../../assets/images/logo.png')} style={style.logo} />
          </View>
          <FormRow>
            <TextInput 
              value={this.state.mail} 
              onChangeText={value => this.onChangeHandler('mail', value)} 
              placeholder="E-mail" 
              keyboardType='email-address' 
              autoCapitalize='none'
              style={style.input} 
            />
            <TextInput 
              value={this.state.pass} 
              onChangeText={value => this.onChangeHandler('pass', value)} 
              placeholder="Senha" 
              secureTextEntry 
              style={style.input} 
            />
            <View style={style.button}>
              {this.renderButton()}
            </View>
            <View style={style.labelContainer}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('Register'); }} style={style.label}>
                <Text style={style.labelText}>Não tem uma conta? Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </FormRow>
        </ScrollView>
        <ImageBackground 
          source={require('../../assets/images/background.jpg')} 
          resizeMode='cover' 
          style={[style.fixed, style.backgroundImage, {zIndex: -1}]}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1
  },

  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  scrollview: {
    backgroundColor: 'transparent'
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },

  logo: {
    marginTop: 70,
    marginBottom: 30,
    width: 150,
    height: 150,
    flexGrow: 1
  },

  input: {
    height:40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 20,
    borderRadius: 5,
    color: '#FFF',
    paddingHorizontal: 10
  },

  labelContainer: {
    marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    flex: 1
  },

  label: {
    alignItems: 'center',
    paddingTop: 10
  },

  labelText: {
    color: '#FFF',
    fontSize: 13
  },

  button: {
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30
  }
});

export default connect(null, { tryLogin })(Login)