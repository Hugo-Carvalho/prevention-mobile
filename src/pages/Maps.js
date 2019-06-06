import React from 'react';
import { View, Image, Platform, PermissionsAndroid, TouchableOpacity, StyleSheet } from 'react-native';

import MapView, { Circle } from 'react-native-maps';

import firebase from 'firebase';

export default class Maps extends React.Component {

  constructor(props) {
  	super(props);

		this.state = {
			flex: 0,
			region: null,
			markers: []
  	};
	}

	componentDidMount() {
		if (Platform.OS === 'android') {
			this.requestLocationPermission()
		} else {
			this._getCurrentLocation()
		}
		
		setTimeout(() => this.setState({ flex: 1 }), 500); 
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId)

		if (Platform.OS === 'android') {
			this.requestLocationPermission()
		} else {
			this._getCurrentLocation()
		}

		this.getMarkers()
	}

	getMarkers(){
		var markers = [];
		firebase
			.database()
			.ref('/users')
			.on('value', function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					firebase
						.database()
						.ref('/users/' + childSnapshot.key + '/devices')
						.on('value', function (snapshot) {
							snapshot.forEach(function (childSnapshot) {
								var device = childSnapshot.val();
								if (device.location != undefined && device.stoled == true) {
									var marker = {
										coordinate: {
											latitude: device.location.latitude,
											longitude: device.location.longitude
										},
										title: device.model
									}
									markers.push(marker)
								}
							});
						});
				});
			});
		this.setState({ markers });
	}

	async requestLocationPermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					'title': 'Location Permission',
					'message': 'Prevention Mobile precisa acessar sua localização.'
				}
			)

			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				this._getCurrentLocation()
			} else {
				alert("Prevention Mobile está sem permissão para acessar sua localização.")
			}
		} catch (err) {
			alert(err)
		}
	}

	_getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({
					region: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: 0.003,
						longitudeDelta: 0.003
					}
				})
			},
			(error) => {
				alert({ error: error.message })
			},
			{ enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
		);

		this.watchID = navigator.geolocation.watchPosition((position) => {
			console.log(position);
			this.setState({
				region: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: 0.003,
					longitudeDelta: 0.003
				}
			})
		})
	}

 	render() {
		const { region, markers } = this.state;
		return (
			<View style={{ flex: this.state.flex }}>
				<View style={style.container}>
					<MapView
						style={style.map}
						initialRegion={region}
						showsUserLocation={true}
						followUserLocation={true}
						showsMyLocationButton={true}
						customMapStyle={[
							{
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#1d2c4d"
									}
								]
							},
							{
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#8ec3b9"
									}
								]
							},
							{
								"elementType": "labels.text.stroke",
								"stylers": [
									{
										"color": "#1a3646"
									}
								]
							},
							{
								"featureType": "administrative.country",
								"elementType": "geometry.stroke",
								"stylers": [
									{
										"color": "#4b6878"
									}
								]
							},
							{
								"featureType": "administrative.land_parcel",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#64779e"
									}
								]
							},
							{
								"featureType": "administrative.province",
								"elementType": "geometry.stroke",
								"stylers": [
									{
										"color": "#4b6878"
									}
								]
							},
							{
								"featureType": "landscape.man_made",
								"elementType": "geometry.stroke",
								"stylers": [
									{
										"color": "#7c97cd"
									}
								]
							},
							{
								"featureType": "landscape.natural",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#035b81"
									}
								]
							},
							{
								"featureType": "poi",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#283d6a"
									}
								]
							},
							{
								"featureType": "poi",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#6f9ba5"
									}
								]
							},
							{
								"featureType": "poi",
								"elementType": "labels.text.stroke",
								"stylers": [
									{
										"color": "#1d2c4d"
									}
								]
							},
							{
								"featureType": "poi.park",
								"elementType": "geometry.fill",
								"stylers": [
									{
										"color": "#023e58"
									}
								]
							},
							{
								"featureType": "poi.park",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#3C7680"
									}
								]
							},
							{
								"featureType": "road",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#304a7d"
									}
								]
							},
							{
								"featureType": "road",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#98a5be"
									}
								]
							},
							{
								"featureType": "road",
								"elementType": "labels.text.stroke",
								"stylers": [
									{
										"color": "#1d2c4d"
									}
								]
							},
							{
								"featureType": "road.highway",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#2c6675"
									}
								]
							},
							{
								"featureType": "road.highway",
								"elementType": "geometry.stroke",
								"stylers": [
									{
										"color": "#255763"
									}
								]
							},
							{
								"featureType": "road.highway",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#b0d5ce"
									}
								]
							},
							{
								"featureType": "road.highway",
								"elementType": "labels.text.stroke",
								"stylers": [
									{
										"color": "#023e58"
									}
								]
							},
							{
								"featureType": "transit",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#98a5be"
									}
								]
							},
							{
								"featureType": "transit",
								"elementType": "labels.text.stroke",
								"stylers": [
									{
										"color": "#1d2c4d"
									}
								]
							},
							{
								"featureType": "transit.line",
								"elementType": "geometry.fill",
								"stylers": [
									{
										"color": "#283d6a"
									}
								]
							},
							{
								"featureType": "transit.station",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#3a4762"
									}
								]
							},
							{
								"featureType": "water",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#0e1626"
									}
								]
							},
							{
								"featureType": "water",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#4e6d70"
									}
								]
							}
						]}
					>
						{markers.map(marker => (
							<Circle
								center={marker.coordinate}
								radius={100}
								strokeWidth={1}
								strokeColor={'#4d0000'}
								fillColor={'rgba(150,0,0,0.5)'}
							/>
						))}
					</MapView>
					<View style={style.buttonContainer}>
						<TouchableOpacity
							onPress={() => this.getMarkers()}
							style={[style.bubble, style.button]}
						>
							<Image style={style.vigilant} source={require('../../assets/icons/vigilant.png')} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
  }
}

const style = StyleSheet.create({
  container: {
  	position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -120,
  	flex: 1,
  	justifyContent: 'flex-end',
		alignItems: 'flex-end'
  },

  map: {
		position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
	},

	bubble: {
		backgroundColor: 'rgba(255,255,255,0.7)',
		paddingVertical: 7,
		borderRadius: 10,
	},

	button: {
		paddingHorizontal: 7,
		alignItems: 'center',
		marginHorizontal: 15,
	},

	vigilant: {
		width: 30,
		height: 30
	},
	
	buttonContainer: {
		marginVertical: 120,
		backgroundColor: 'transparent',
	},
});