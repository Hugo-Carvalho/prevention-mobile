import React from 'react';
import { View, Alert, Platform, PermissionsAndroid, StyleSheet } from 'react-native';

import SwitchToggle from 'react-native-switch-toggle';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import DeviceInfo from 'react-native-device-info';

import SystemSetting from 'react-native-system-setting';

import { BleManager } from 'react-native-ble-plx';

import { connect } from 'react-redux';

import firebase from 'firebase';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      switchOn: false,
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
      }, 100);
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
            if (enable){
              if (!this.manager.isDeviceConnected(this.state.deviceBleId)){
                const currentUser = this.props.user.user;
                firebase
                  .database()
                  .ref('/users/' + currentUser.user.uid + '/devices/' + this.state.uniqueId + '/stoled')
                  .set(true)
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

            SystemSetting.isBluetoothEnabled().then((enable) => {
              enable ? console.log("bluetooth is on") : SystemSetting.switchBluetooth(() => { })
            })
            
            this.setState({ region });
            // no register location
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      this.setState({ switchOn: isRunning });
    });
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

  scanAndConnect(){
    SystemSetting.isBluetoothEnabled().then((enable) => {
      if (enable) {
        this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            this.switcPress();
            console.log(error);
            return
          }
          console.log(device);
          if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
            this.manager.stopDeviceScan();

            device.connect()
              .then((device) => {
                this.setState({ deviceBleId: device.id() })
              });
          }
        });
      } else {
        this.switcPress();
        SystemSetting.switchBluetooth(() => { });
      }
    })
  }

  startService(){
    this.scanAndConnect();
    BackgroundGeolocation.start();
  }

  toggleTracking() {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
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
            
            rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
          
            buttonTextStyle={{fontSize: 20}}
            textRightStyle={{fontSize: 20}}
            textLeftStyle={{fontSize: 20}}
          
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
        <View>
        
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
    flex: 1,
    backgroundColor: 'rgb(38,38,38)' 
  },

  switchToggle: {
    alignItems: 'center',
    marginTop: 10
  },

  elements: {
    elevation: 1
  },
});

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getUserToken: () => dispatch(getUserToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);