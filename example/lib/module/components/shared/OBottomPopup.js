import React from 'react';
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme';
const deviceHeight = Dimensions.get('window').height;

const OBottomPopup = props => {
  const {
    open,
    title,
    onClose,
    children
  } = props;
  return /*#__PURE__*/React.createElement(Modal, {
    animationType: "fade",
    transparent: true,
    visible: open,
    onRequestClose: () => onClose()
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    style: styles.touchableOutsideStyle,
    onPress: () => onClose()
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.touchableOutsideStyle
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.bottomContainer
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
    style: styles.titleStyle
  }, title), children))));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'flex-end'
  },
  touchableOutsideStyle: {
    flex: 1,
    width: '100%'
  },
  bottomContainer: {
    backgroundColor: `${colors.white}`,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    maxHeight: deviceHeight
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15
  }
});
export default OBottomPopup;
//# sourceMappingURL=OBottomPopup.js.map