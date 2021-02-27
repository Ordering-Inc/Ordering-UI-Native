import React from 'react';
import { StyleSheet, View } from 'react-native'

import { IMAGES } from '../config/constants';
import { OIcon } from '../components/shared';


const Splash = () => {
  return (
    <View style={styles.wrapper}>
      <OIcon src={IMAGES.applogo} style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 80,
    width: 250,
    alignSelf: 'center'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
});

export default Splash;
