import * as React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, ScrollView, View, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../theme';

interface Props {
  open?: boolean;
  title?: string;
  children?: any;
  onAccept?: any;
  onCancel?: any;
  onClose?: any;
  acceptText?: string;
  cancelText?: string;
  isTransparent?: boolean;
  hideCloseDefault?: boolean;
  isCustom?: boolean;
}

const OModal = (props: Props): React.ReactElement => {
  const {
    open,
    title,
    children,
    onAccept,
    onCancel,
    onClose,
    acceptText,
    cancelText,
    isCustom,
    isTransparent,
    hideCloseDefault
  } = props

  return (
    <Modal
      animationType="slide"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => { onClose() }}
    >
      <SafeAreaView>
        <ScrollView>
          <View style={styles.centeredView}>
            {!isCustom ? (
              <View style={styles.titleSection}>
                <Icon
                  name="x"
                  size={35}
                  style={styles.cancelBtn}
                  onPress={onClose}
                />
                <Text style={styles.modalText}>{title}</Text>
              </View>
            ) : (
              <IconAntDesign
                name="arrowleft"
                size={25}
                style={styles.customCancelBtn}
                onPress={onClose}
              />
            )}
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
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
  customCancelBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 15,
    zIndex: 10000,
    color: 'white'
  },
  modalText: {
    marginTop: 15,
    fontSize: 25,
    textAlign: "center"
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
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default OModal;

