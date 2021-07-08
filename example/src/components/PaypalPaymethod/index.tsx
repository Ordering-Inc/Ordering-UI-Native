import React, {useState} from 'react'
import { WebView } from 'react-native-webview';
import { View, TouchableOpacity } from 'react-native'
import { OText } from '../shared'
import { StyleSheet } from 'react-native';

export const PaypalPaymethod = () => {
  const [showGateway, setShowGateway] = useState(false);

  return (
    <View style={styles.btnCon}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setShowGateway(true)}>
          <OText style={styles.btnTxt}>Pay Using PayPal</OText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  btnCon: {
    height: 45,
    width: '70%',
    elevation: 1,
    backgroundColor: '#00457C',
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
  },
})
