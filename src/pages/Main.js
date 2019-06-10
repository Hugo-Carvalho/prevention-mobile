import React from 'react';

import TabBar from 'react-native-tab-bar-interaction'

import Setting from './Setting';
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
          icon={require('../../assets/icons/setting.png')}
          selectedIcon={require('../../assets/icons/settingSelected.png')}
          title="Setting"
          screenBackgroundColor={{ backgroundColor: 'rgb(0, 10, 19)' }}
      >
          <Setting />
        </TabBar.Item>
      </TabBar>
    );
  }
}