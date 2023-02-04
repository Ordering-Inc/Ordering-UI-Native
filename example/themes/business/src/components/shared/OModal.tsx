import * as React from 'react';
import { Modal, StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import OIcon from './OIcon';
import OText from './OText';
import OIconButton from './OIconButton';
import { useTheme } from 'styled-components/native';
import { useUtils } from 'ordering-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  hideIcons?: boolean
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
    hideIcons
  } = props;

  const theme = useTheme();
  const [{ optimizeImage }] = useUtils();
  const { top } = useSafeAreaInsets();

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
      marginTop: top,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 30,
      paddingBottom: !hideIcons ? 25 : 15,
      borderBottomWidth: !hideIcons ? 2 : 0,
      borderBottomColor: '#e6e6e6',
    },
    titleGroups: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: 33,
    },
    titleIcons: {
      height: 33,
      width: 33,
      borderRadius: 7.6,
      resizeMode: 'stretch',
    },
    shadow: {
      height: 34,
      width: 34,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: 15,
      backgroundColor: theme.colors.clear,
      paddingHorizontal: 3,
      borderRadius: 7.6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    cancelBtn: {
      marginRight: 5,
      zIndex: 10000,
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    modalText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      color: theme.colors.textGray,
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
      fontWeight: '600',
      textAlign: 'center',
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 10
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={isTransparent}
        visible={open}
        onRequestClose={() => {
          onClose && onClose();
        }}
        style={{
          height: '100%',
          flex: 1,
          position: 'absolute',
          ...style,
          zIndex: 9999,
        }}>
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

              <OText size={20} style={styles.modalText} adjustsFontSizeToFit>
                {title}
              </OText>
            </View>

            {children}
          </View>
        ) : (
          <>
            {!customClose && (
              <View style={styles.titleSection}>
                <View style={styles.titleGroups}>
                  <TouchableOpacity onPress={() => onClose()} style={styles.btnBackArrow}>
                    <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
                  </TouchableOpacity>
                  <OText
                    size={16}
                    style={styles.modalText}
                    adjustsFontSizeToFit>
                    {title}
                  </OText>
                </View>
                {!hideIcons && (
                  <View style={styles.titleGroups}>
                    <View style={styles.shadow}>
                      {order?.business?.logo ? (
                        <OIcon
                          url={optimizeImage(
                            order?.business?.logo,
                            'h_300,c_limit',
                          )}
                          style={styles.titleIcons}
                        />
                      ) : (
                        <OIcon
                          src={theme.images.dummies.businessLogo}
                          style={styles.titleIcons}
                        />
                      )}
                    </View>

                    <View style={styles.shadow}>
                      <OIcon
                        url={optimizeImage(
                          order?.customer?.photo ||
                          theme?.images?.dummies?.customerPhoto,
                          'h_300,c_limit',
                        )}
                        style={styles.titleIcons}
                      />
                    </View>

                    {order?.driver && (
                      <View style={styles.shadow}>
                        <OIcon
                          url={
                            optimizeImage(
                              order?.driver?.photo,
                              'h_300,c_limit',
                            ) || theme?.images?.dummies?.driverPhoto
                          }
                          style={styles.titleIcons}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
            {children}
          </>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default OModal;
