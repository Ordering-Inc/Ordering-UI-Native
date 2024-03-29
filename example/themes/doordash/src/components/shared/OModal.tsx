import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Dimensions, useWindowDimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OIcon } from '.';
import { useTheme } from 'styled-components/native';

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
  entireModal?: boolean;
  customClose?: boolean;
  titleSectionStyle?: any;
  isNotDecoration?: boolean;
  styleCloseButton?: any;
  transition?: any;
  overScreen?: boolean;
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
    entireModal,
    customClose,
    titleSectionStyle,
    isNotDecoration,
    style,
    styleCloseButton,
    transition,
    overScreen
  } = props

  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const theme = useTheme();

  return (
    <Modal
      avoidKeyboard={false}
      isVisible={open}
      coverScreen={overScreen ? overScreen : false}
      style={{ height: '100%', flex: 1, position: 'absolute', backgroundColor: '#F8F9FA', margin: 0, marginTop: top, marginBottom: bottom, paddingBottom: bottom, ...style, zIndex: 10000 }}
    >
      <View style={{...styles.container, paddingBottom: top}}>
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
          <>
            {!customClose && (
              <View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
                <TouchableOpacity onPress={onClose}>
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
          </>
        }
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: 'white'
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    width: '100%',
  },
  titleSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  cancelBtn: {
    tintColor: '#191919'
  },
  modalText: {
    marginTop: 15,
    fontSize: 25,
    textAlign: "center",
    zIndex: 10
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
