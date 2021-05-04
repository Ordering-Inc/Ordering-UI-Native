import * as React from 'react';
import { Modal, StyleSheet, Text, SafeAreaView, View } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

const OModal = props => {
  const {
    open,
    title,
    children,
    onAccept,
    onCancel,
    onClose,
    acceptText,
    cancelText,
    isTransparent,
    hideCloseDefault,
    entireModal,
    customClose,
    titleSectionStyle,
    isNotDecoration,
    style
  } = props;
  return /*#__PURE__*/React.createElement(Modal, {
    animationType: "slide",
    transparent: isTransparent,
    visible: open,
    onRequestClose: () => {
      onClose();
    },
    style: {
      height: '100%',
      flex: 1,
      position: 'absolute',
      ...style
    }
  }, /*#__PURE__*/React.createElement(SafeAreaView, {
    style: styles.container
  }, !entireModal ? /*#__PURE__*/React.createElement(View, {
    style: styles.centeredView
  }, /*#__PURE__*/React.createElement(View, {
    style: titleSectionStyle ? titleSectionStyle : styles.titleSection
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 35,
    style: isNotDecoration ? styles.cancelBtn : styles.decorationBtn,
    onPress: onClose
  }), /*#__PURE__*/React.createElement(Text, {
    style: styles.modalText
  }, title)), children) : /*#__PURE__*/React.createElement(React.Fragment, null, !customClose && /*#__PURE__*/React.createElement(View, {
    style: titleSectionStyle ? titleSectionStyle : styles.titleSection
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 35,
    style: styles.cancelBtn,
    onPress: onClose
  }), /*#__PURE__*/React.createElement(Text, {
    style: styles.modalText
  }, title)), children)));
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    width: '100%'
  },
  titleSection: {
    width: '100%',
    height: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cancelBtn: {
    position: 'absolute',
    left: 0,
    margin: 15,
    zIndex: 10000
  },
  modalText: {
    marginTop: 15,
    fontSize: 25,
    textAlign: "center",
    zIndex: 10
  },
  decorationBtn: {
    position: 'absolute',
    left: 0,
    margin: 15,
    zIndex: 10000,
    backgroundColor: '#CCCCCC80',
    borderRadius: 100 / 2
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
export default OModal;
//# sourceMappingURL=OModal.js.map