import * as React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import OIcon from './OIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  order?: any;
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
    order,
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
    },
    titleSection: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      height: 75,
      borderBottomWidth: 2,
      borderBottomColor: '#e6e6e6',
    },
    titleGroups: {
      flexDirection: 'row',
    },
    titleIcons: {
      height: 32,
      width: 32,
      borderRadius: 7.6,
    },
    shadow: {
      height: 33,
      width: 33,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7.6,
      marginLeft: 15,
      elevation: 1,
      shadowColor: theme.colors.shadow,
    },
    cancelBtn: {
      marginRight: 10,
      zIndex: 10000,
    },
    modalText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 20,
      color: theme.colors.textGray,
      textAlign: 'center',
      zIndex: 10,
    },
    wrapperIcon: {
      overflow: 'hidden',
      borderRadius: 50,
      backgroundColor: '#CCCCCC80',
      width: 35,
      margin: 15,
    },

    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={isTransparent}
      visible={open}
      onRequestClose={() => {
        onClose();
      }}
      style={{
        height: '100%',
        flex: 1,
        position: 'absolute',
        ...style,
        zIndex: 9999,
      }}>
      <SafeAreaView style={styles.container}>
        {!entireModal ? (
          <View style={styles.centeredView}>
            <View
              style={
                titleSectionStyle ? titleSectionStyle : styles.titleSection
              }>
              <View style={styles.wrapperIcon}>
                <Icon
                  name="x"
                  size={35}
                  style={
                    isNotDecoration && (styleCloseButton || styles.cancelBtn)
                  }
                  onPress={onClose}
                />
              </View>
              <Text style={styles.modalText}>{title}</Text>
            </View>
            {children}
          </View>
        ) : (
          <>
            {!customClose && (
              <View style={styles.titleSection}>
                <View style={styles.titleGroups}>
                  <MaterialIcon
                    name="arrow-left"
                    size={25}
                    style={styleCloseButton || styles.cancelBtn}
                    onPress={onClose}
                  />
                  <Text style={styles.modalText}>{title}</Text>
                </View>
                <View style={styles.titleGroups}>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.business?.logo}
                      style={styles.titleIcons}
                    />
                  </View>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.customer?.photo}
                      style={styles.titleIcons}
                    />
                  </View>
                  <View style={styles.shadow}>
                    <OIcon
                      url={order?.driver?.photo}
                      style={styles.titleIcons}
                    />
                  </View>
                </View>
              </View>
            )}
            {children}
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default OModal;
