import * as React from 'react';
import { Alert, Modal, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components';
import { colors } from '../../theme';

interface Props {
  open?: boolean;
  title?: string;
  children?: any;
  onAccept?: any;
  onCancel?: any;
  onClose?: any;
  style?: any;
  acceptText?: string;
  cancelText?: string;
  isTransparent?: boolean;
  hideCloseDefault?: boolean;
  EntireModal?: boolean;
  titleSectionStyle?: any;
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
    isTransparent,
    hideCloseDefault,
    EntireModal,
    titleSectionStyle,
    style
  } = props

  return (
    <Modal
      animationType="slide"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => { onClose() }}
      style={{ height: '100%', flex: 1, position: 'absolute', ...style }}
    >
      <SafeAreaView style={styles.container}>
        {!EntireModal ? <View style={styles.centeredView}>
          <View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
            <Icon
              name="x"
              size={35}
              style={styles.cancelBtn}
              onPress={onClose}
            />
            <Text style={styles.modalText}>{title}</Text>
          </View>
          {children}
        </View> :
          <>
            <View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
              <Icon
                name="x"
                size={35}
                style={styles.cancelBtn}
                onPress={onClose}
              />
              <Text style={styles.modalText}>{title}</Text>
            </View>
            {children}
          </>
        }
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    width: '100%',
  },
  titleSection: {
    width: '100%',
    height: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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