import React from 'react';
import { View, Alert, Image, Text, ActivityIndicator, Platform, PermissionsAndroid, StyleSheet } from 'react-native';

import SwitchToggle from 'react-native-switch-toggle';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import DeviceInfo from 'react-native-device-info';

import SystemSetting from 'react-native-system-setting';

import { BleManager } from 'react-native-ble-plx';

import { setStatusBle, saveBleToken, removeBleToken } from '../actions';

import { connect } from 'react-redux';

import firebase from 'firebase';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: '',
      switchOn: false,
      statusBle: '',
      region: null,
      uniqueId: null,
      location: null,
      deviceBleId: null
    };

    this.manager = new BleManager();
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.requestPhonePermission()
    } else {
      this._saveModelAndImei()
    }

    BackgroundGeolocation.configure({
      notificationTitle: 'Prevention Mobile',
      notificationText: 'Ativado',
      notificationIconColor: '#132235',
      startOnBoot: true,
      stopOnTerminate: false
    });

    //Geolocation in background
    BackgroundGeolocation.getCurrentLocation(lastLocation => {
      let region = this.state.region;
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      region = Object.assign({}, lastLocation, {
        latitudeDelta,
        longitudeDelta
      });
      this.setState({ region });
    }, (error) => {
      setTimeout(() => {
        Alert.alert('Error obtaining current location', JSON.stringify(error));
      }, 500);
    },
      {
        enableHighAccuracy: true
      });

    BackgroundGeolocation.on('authorization', status => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(() =>
          Alert.alert(
            'Prevention Mobile requer rastreamento de localização',
            'Você gostaria de abrir as configurações do aplicativo?',
            [
              {
                text: 'Sim',
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: 'Não',
                onPress: () => { },
                style: 'cancel'
              }
            ]
          ), 1000);
      }
    });

    BackgroundGeolocation.on('error', ({ message }) => {
      Alert.alert('BackgroundGeolocation error', message);
    });

    BackgroundGeolocation.on('location', location => {
      console.log('[DEBUG] BackgroundGeolocation location', location)

      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const longitudeDelta = 0.01;
          const latitudeDelta = 0.01;
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta
          });

          this.setState({ location, region });

          SystemSetting.isBluetoothEnabled().then((enable) => {
            if (enable) {
              if (this.props.ble.ble != undefined) {
                this.manager.isDeviceConnected(this.props.ble.ble)
                  .then((stoled) => {
                    if (!stoled){
                      const currentUser = this.props.user.user;
                      firebase
                        .database()
                        .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId + '/stoled')
                        .set(true)
                      this.switcPress();
                      this.props.setStatusBle('stoled');
                      this.setState({ statusBle: 'stoled', backgroundColor: 'rgb(17,29,49)' });
                    }
                  })
              }
            } else {
              this.switcPress();
              SystemSetting.switchBluetooth(() => { });
            }
          })

          const currentUser = this.props.user.user;
          firebase
            .database()
            .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId + '/location')
            .set(location)
          const date = new Date();
          firebase
            .database()
            .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId + '/location/date')
            .set("" + date)

          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('stationary', (location) => {
      console.log('[DEBUG] BackgroundGeolocation stationary', location);

      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          if (location.radius) {
            const longitudeDelta = 0.01;
            const latitudeDelta = 0.01;
            const region = Object.assign({}, location, {
              latitudeDelta,
              longitudeDelta
            });

            this.setState({ region });
            
            SystemSetting.isBluetoothEnabled().then((enable) => {
              if (enable) {
                if (this.props.ble.ble != undefined) {
                  this.manager.isDeviceConnected(this.props.ble.ble)
                    .then((stoled) => {
                      if (!stoled) {
                        const currentUser = this.props.user.user;
                        firebase
                          .database()
                          .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId + '/stoled')
                          .set(true)
                        this.switcPress();
                        this.props.setStatusBle('stoled');
                        this.setState({ statusBle: 'stoled', backgroundColor: 'rgb(17,29,49)' });
                      }
                    })
                }
              } else {
                this.switcPress();
                SystemSetting.switchBluetooth(() => { });
              }
            })
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      this.setState({ switchOn: isRunning });
    });

    setTimeout(() => {
      const currentUser = this.props.user.user;

      var device = '';

      firebase
        .database()
        .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId)
        .on('value', function (snapshot) {
          device = snapshot.val();
        });

      if (device.stoled == true) {
        this.props.setStatusBle('stoled');
      } else if (this.props.ble.statusBle !== 'scanning' && this.props.ble.statusBle !== 'connected') {
        this.props.setStatusBle('disconnected');
      }

      if (this.props.ble.statusBle === 'disconnected') {
        this.setState({ statusBle: 'disconnected', backgroundColor: 'rgb(0,10,19)' })
      } else if (this.props.ble.statusBle === 'scanning') {
        this.setState({ statusBle: 'scanning', backgroundColor: 'rgb(2,27,53)' });
      } else if (this.props.ble.statusBle === 'connected') {
        this.setState({ statusBle: 'connected', backgroundColor: 'rgb(45,45,45)' });
      } else if (this.props.ble.statusBle === 'stoled') {
        this.setState({ statusBle: 'stoled', backgroundColor: 'rgb(17,29,49)' });
      }
    }, 100);
  }

  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }

  async requestPhonePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          'title': 'Phone Permission',
          'message': 'Prevention Mobile precisa acessar as informações do dispositivo.'
        }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this._saveModelAndImei()
      } else {
        alert("Prevention Mobile está sem permissão para acessar as informações do dispositivo.")
      }
    } catch (err) {
      alert(err)
    }
  }

  _saveModelAndImei() {
    const uniqueId = DeviceInfo.getUniqueID();
    this.setState({ uniqueId });

    const currentUser = this.props.user.user;
    const IMEI = require('react-native-imei');
    IMEI.getImei().then(imeiList => {
      firebase
        .database()
        .ref('/users/' + currentUser.user.uid + '/devices/' + uniqueId + '/imei')
        .set(imeiList)
    });

    const model = DeviceInfo.getModel();

    firebase
      .database()
      .ref('/users/' + currentUser.user.uid + '/devices/' + uniqueId + '/model')
      .set(model)
  }

  async requestBluetoothPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          'title': 'Phone Permission',
          'message': 'Prevention Mobile precisa acessar as informações do dispositivo.'
        }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.scanAndConnect();
      } else {
        alert("Prevention Mobile está sem permissão para acessar as informações do dispositivo.")
      }
    } catch (err) {
      alert(err)
    }
  }

  scanAndConnect() {
    SystemSetting.isBluetoothEnabled().then((enable) => {
      if (enable) {
        this.props.setStatusBle('scanning');
        this.setState({ statusBle: 'scanning', backgroundColor: 'rgb(2,27,53)' });
        this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            this.switcPress();
            this.props.setStatusBle('disconnected');
            this.setState({ statusBle: 'disconnected', backgroundColor: 'rgb(0,10,19)' })
            console.log(error);
            return
          }
          if (device.name === 'MLT-BT05') {
            this.manager.stopDeviceScan();
            console.log(device);
            this.props.saveBleToken(device.id);
            device.connect()
              .then(() => {
                this.props.setStatusBle('connected');
                this.setState({ statusBle: 'connected', backgroundColor: 'rgb(45,45,45)' })
              });
          }
        });
      } else {
        this.switcPress();
        this.props.setStatusBle('disconnected');
        this.setState({ statusBle: 'disconnected', backgroundColor: 'rgb(0,10,19)' })
        SystemSetting.switchBluetooth(() => { });
      }
    })
  }

  renderAnimation() {
    if (this.state.statusBle === 'disconnected') {
      return (
        <View>
          <Image style={style.animationImage} source={require('../../assets/images/bleSleep.gif')} />
          <Text style={style.animationTitle}>Dispositivo desconectado</Text>
        </View>
      );
    } else if (this.state.statusBle === 'scanning') {
      return (
        <View>
          <Image style={style.animationImage} source={require('../../assets/images/bleScan.gif')} />
          <Text style={style.animationTitle}>Buscando dispositivos</Text>
        </View>
      ) 
    } else if (this.state.statusBle === 'connected') {
      return (
        <View>
          <Image style={style.animationImage} source={require('../../assets/images/bleOk.gif')} />
          <Text style={style.animationTitle}>Dispositivos conectado</Text>
        </View>
      ) 
    } else if (this.state.statusBle === 'stoled') {
      return (
        <View>
          <Image style={style.animationImage} source={require('../../assets/images/thief.gif')} />
          <Text style={style.animationTitle}>Suspeita de assalto/furto</Text>
        </View>
      )
    } else {
      return (
        <ActivityIndicator style={style.animationImage} size="large" color="#0F6CCC" />
      )
    }
  }

  startService() {
    BackgroundGeolocation.start()
    setTimeout(() => this.requestBluetoothPermission(), 500);
  }

  toggleTracking() {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        if (this.props.ble.statusBle !== 'stoled') {
          this.props.setStatusBle('disconnected');
          this.setState({ statusBle: 'disconnected', backgroundColor: 'rgb(0,10,19)' });
        }
        if (this.props.ble.ble !== undefined && this.props.ble.ble !== null) {
          this.manager.cancelDeviceConnection(this.props.ble.ble);
          this.props.removeBleToken();
        }
        this.manager.stopDeviceScan();
        return false;
      }

      if (!locationServicesEnabled) {
        Alert.alert(
          'Serviços de localização desativados',
          'Gostaria de abrir as configurações de localização?',
          [
            {
              text: 'Sim',
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: 'Não',
              onPress: () => { },
              style: 'cancel'
            }
          ]
        );
        return false;
      }

      if (authorization == 99) {
        this.startService();
      } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
        this.startService();
      } else {
        Alert.alert(
          'Prevention Mobile requer rastreamento de localização',
          'Por favor, conceda permissão',
          [
            {
              text: 'Ok'
            }
          ]
        );
      }
    });
  }

  getButtonText() {
    return this.state.switchOn ? 'On' : 'Off';
  }

  getRightText() {
    return this.state.switchOn ? '' : 'On';
  }

  getLeftText() {
    return this.state.switchOn ? 'Off' : '';
  }

  render() {
    return (
      <View style={style.container}>
        <View style={{ backgroundColor: this.state.backgroundColor }}>
          <View style={style.switchToggle}>
            <SwitchToggle style={style.elements}
              buttonText={this.getButtonText()}
              backTextRight={this.getRightText()}
              backTextLeft={this.getLeftText()}

              type={1}
              buttonStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute'
              }}

              rightContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              leftContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}

              buttonTextStyle={{ fontSize: 20 }}
              textRightStyle={{ fontSize: 20 }}
              textLeftStyle={{ fontSize: 20 }}

              containerStyle={{
                marginTop: 16,
                width: 160,
                height: 65,
                borderRadius: 30,
                padding: 5,
              }}
              backgroundColorOn='#fff'
              backgroundColorOff='#fff'
              circleStyle={{
                width: 80,
                height: 55,
                borderRadius: 27.5,
                backgroundColor: 'blue',
              }}
              switchOn={this.state.switchOn}
              onPress={this.switcPress}
              circleColorOff='#e5e1e0'
              circleColorOn='#e5e1e0'
              duration={500}
            />
          </View>
          <View style={style.animation}>
            {this.renderAnimation()}
          </View>
        </View>
      </View>
    );
  }

  switcPress = () => {
    this.state.switchOn ? this.setState({ switchOn: false }) : this.setState({ switchOn: true });
    this.toggleTracking();
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },

  switchToggle: {
    alignItems: 'center',
    marginTop: 10
  },

  elements: {
    elevation: 1
  },

  animation: {
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 120 
  },

  animationImage: {
    width: 300,
    height: 300
  },

  animationTitle: {
    fontFamily: 'BungeeInline-Regular',
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10
  }
});

const mapStateToProps = state => ({
  user: state.user,
  ble: state.ble
});

const mapDispatchToProps = dispatch => ({
  setStatusBle: (status) => dispatch(setStatusBle(status)),
  saveBleToken: (ble) => dispatch(saveBleToken(ble)),
  removeBleToken: () => dispatch(removeBleToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);