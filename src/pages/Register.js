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

import { login, saveUserToken } from '../actions';

import FormRow from '../components/FormRow';

import firebase from 'firebase';

class Register extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      mail: '',
      cpf: '',
      pass: '',
      cPass: '',
      isLoading: false
    }
  }

  onChangeHandler(field, value){
    this.setState({ 
      [field]: value
    });
  }

  tryLogin() {
    this.setState({ isLoading: true });
    const { mail, pass } = this.state

    this.props.login({ mail, pass })
      .then(() => {
        this.props.saveUserToken()
          .then(() => {
            this.props.navigation.replace('Main');
          })
          .catch(error => {
            Alert.alert(error);
          })
      })
      .catch(error => {
        Alert.alert('Erro no login', this.getMessageByErrorCode(error.code));
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  testCPF(strCPF) {
    var sum;
    var rest;
    sum = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11)) rest = 0;
    if (rest != parseInt(strCPF.substring(9, 10))) return false;

    sum = 0;
    for (i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11)) rest = 0;
    if (rest != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }

  tryRegister(){
    const { mail, pass, cPass, cpf } = this.state
    this.setState({ isLoading: true });
    if (pass != cPass){
      Alert.alert('Erro no cadastro', 'As senhas não conferem!');
      this.setState({ isLoading: false });
    } else if (cpf == ''){
      Alert.alert('Erro no cadastro', 'CPF é obrigatório!');
      this.setState({ isLoading: false });
    } else if (!this.testCPF(cpf)) {
      Alert.alert('Erro no cadastro', 'CPF inválido!');
      this.setState({ isLoading: false });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then(user => {
          Alert.alert('Sucesso!', 'Usuário cadastrado');

          const { currentUser } = firebase.auth();
          firebase
            .database()
            .ref('/users/' + currentUser.uid + '/cpf')
            .set(cpf)

          this.tryLogin();
        })
        .catch(error => {
          Alert.alert('Erro no cadastro', this.getMessageByErrorCode(error.code));
        })
        .then(() => {
          this.setState({
            isLoading: false
          });
        })
    }
  }

  getMessageByErrorCode(errorCode){
    switch (errorCode){
      case 'auth/email-already-in-use':
        return 'Usuario já existente!';
      case 'auth/invalid-email':
        return 'E-mail inválido!';
      case 'auth/operation-not-allowed':
        return 'Erro interno, contate o suporte!';
      case 'auth/weak-password':
        return 'Senha fraca!';
      default:
        return 'Erro desconhecido!';
    }
  }

  renderButton(){
    if (this.state.isLoading){
      return <ActivityIndicator size="large" color="#0F6CCC" />;
    }
    return(
      <Button title="Cadastrar" onPress={() => this.tryRegister()} />
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
              value={this.state.cpf}
              onChangeText={value => this.onChangeHandler('cpf', value)}
              placeholder="CPF"
              keyboardType='numeric'
              style={style.input}
            />
            <TextInput 
              value={this.state.pass} 
              onChangeText={value => this.onChangeHandler('pass', value)} 
              placeholder="Senha" 
              secureTextEntry 
              style={style.input} 
            />
            <TextInput
              value={this.state.cPass}
              onChangeText={value => this.onChangeHandler('cPass', value)}
              placeholder="Confirmar senha"
              secureTextEntry
              style={style.input}
            />
            <View style={style.button}>
              {this.renderButton()}
            </View>
            <View style={style.labelContainer}>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }} style={style.label}>
                <Text style={style.labelText}>Já tem uma conta? Logar</Text>
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

const mapStateToProps = state => ({
  token: state.token
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  saveUserToken: () => dispatch(saveUserToken()),
  login: (mail, pass) => dispatch(login(mail, pass))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);