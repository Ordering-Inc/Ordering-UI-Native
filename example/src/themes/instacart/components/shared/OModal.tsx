import * as React from 'react';
import { Modal, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import { OIcon } from '.';

interface Props {
  open?: boolean;
  title?: string;
  children?: any;
  onClose?: any;
  onCancel?: any;
  onAccept?: any;
  isTransparent?: boolean;
  entireModal?: boolean;
  customClose?: boolean;
  titleSectionStyle?: any;
  isNotDecoration?: boolean;
  style?: any;
  styleCloseButton?: any;
}

const OModal = (props: Props): React.ReactElement => {
  const {
    open,
    title,
    children,
    onClose,
    isTransparent,
    entireModal,
    customClose,
    titleSectionStyle,
    isNotDecoration,
    style,
    styleCloseButton
  } = props

  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
		presentationStyle="pageSheet"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => { onClose() }}
      style={{ height: '100%', flex: 1, position: 'absolute', ...style, zIndex: 9999 }}
    >
      <SafeAreaView style={styles.container}>
        {!entireModal ? (
          <View style={styles.centeredView}>
            <View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
              <View style={styles.wrapperIcon}>
                <Icon
                  name="x"
                  size={35}
                  style={isNotDecoration && (styleCloseButton || styles.cancelBtn)}
                  onPress={onClose}
                />
              </View>
              <Text style={styles.modalText}>{title}</Text>
            </View>
            {children}
          </View>
        ) :
          <View>
            {!customClose && (
              <View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
                <TouchableOpacity onPress={() => onClose()} style={{ padding: 12, paddingStart: 0, zIndex: 10000}}>
						<OIcon
							src={theme.images.general.close}
							width={16}
							style={styleCloseButton || styles.cancelBtn}
						/>
					 </TouchableOpacity>
                <Text style={styles.modalText}>{title}</Text>
              </View>
            )}
            {children}
          </View>
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
	 minHeight: 57,
    display: 'flex',
	 flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
	 paddingHorizontal: 40
  },
  cancelBtn: {
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    zIndex: 10,
	 fontWeight: '600',
	 paddingStart: 12,
	 flex: 1
  },
  wrapperIcon: {
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#CCCCCC80',
    width: 35,
    margin: 15
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
