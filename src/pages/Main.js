import React from 'react';

import TabBar from 'react-native-tab-bar-interaction'

import Home from './Home';
import Maps from './Maps';

export default class MenuBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TabBar>
        <TabBar.Item
          icon={require('../../assets/icons/maps.png')}
          selectedIcon={require('../../assets/icons/mapsSelected.png')}
          title="Maps"
          screenBackgroundColor={{ backgroundColor: '#rgb(38,38,38)' }}
        >
          <Maps />
        </TabBar.Item>
        <TabBar.Item
          icon={require('../../assets/icons/home.png')}
          selectedIcon={require('../../assets/icons/homeSelected.png')}
          title="Home"
          screenBackgroundColor={{ backgroundColor: '#rgb(38,38,38)' }}
        >
          <Home />
        </TabBar.Item>
        <TabBar.Item
          //icon={require('./tab3.png')}
          //selectedIcon={require('./tab1.png')}
          title="Tab3"
          screenBackgroundColor={{ backgroundColor: '#485d72' }}
        >
          {/*Page Content*/}
        </TabBar.Item>
      </TabBar>
    );
  }
}