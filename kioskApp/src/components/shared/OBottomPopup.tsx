import React from 'react'
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text } from 'react-native'
import { colors } from '../../theme.json'
const deviceHeight = Dimensions.get('window').height

interface Props {
  open: boolean;
  title?: string;
  children?: any;
  onClose?: any;
}
const OBottomPopup = (props: Props) => {
  const {
    open,
    title,
    onClose,
    children
  } = props
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={open}
      onRequestClose={() => onClose()}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.touchableOutsideStyle}
          onPress={() => onClose()}
        >
          <View style={styles.touchableOutsideStyle} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomContainer}>
          <View>
            <Text style={styles.titleStyle}>
              {title}
            </Text>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'flex-end',
  },
  touchableOutsideStyle: {
    flex: 1,
    width: '100%'
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    maxHeight: deviceHeight,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15
  }
})

export default OBottomPopup
