import React from 'react'
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, View, ScrollView, Text, Platform } from 'react-native'
import { OText } from '../shared'
import Icon from 'react-native-vector-icons/Feather'
import styled,{ useTheme } from 'styled-components/native'

const deviceHeight = Dimensions.get('window').height

interface Props {
  open: boolean;
  title?: string;
  children?: any;
  onClose?: any;
  customHeaderShow?: boolean;
}
const OBottomPopup = (props: Props) => {
  const {
    open,
    title,
    onClose,
    customHeaderShow,
    children
  } = props

  const theme = useTheme()

  const KeyboardView = styled.KeyboardAvoidingView`
    flex-grow: 1;
    flex-shrink: 1;
  `;

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
      backgroundColor: '#FFFFFF',
      width: '100%',
      paddingHorizontal: 20,
      maxHeight: deviceHeight - 100,
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 15,
      textAlign: 'center'
    },
    closeBtnStyle: {
      position: 'absolute',
      top: 15,
      right: 0
    },
    customHeaderStyle: {
      padding: 15,
      marginBottom: 10,
      borderBottomColor: theme.colors.mediumGray,
      borderBottomWidth: 1
    },
    customTitleStyle: {
      fontSize: 20,
      textAlign: 'center',
      paddingHorizontal: 30
    }
  })

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={open}
      onRequestClose={() => onClose()}
    >
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            style={styles.touchableOutsideStyle}
            onPress={() => onClose()}
          >
            <View style={styles.touchableOutsideStyle} />
          </TouchableWithoutFeedback>
          <View style={styles.bottomContainer}>
            <ScrollView showsVerticalScrollIndicator={false} >
              {customHeaderShow ? (
                <View style={styles.customHeaderStyle}>
                  <OText size={16} numberOfLines={1} style={styles.customTitleStyle}>
                    {title}
                  </OText>
                  <Icon
                    name='x'
                    size={30}
                    style={styles.closeBtnStyle}
                    onPress={onClose}
                  />
                </View>
              ) : (
                <Text style={styles.titleStyle}>
                  {title}
                </Text>
              )}
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardView>
    </Modal>
  )
}

export default OBottomPopup
