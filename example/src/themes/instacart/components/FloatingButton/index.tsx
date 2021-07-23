import React from 'react'
import { FloatingButton as FloatingButtonController } from 'ordering-components/native'
import { FloatingButtonParams } from '../../../../types'
import {
  Container,
  Button
} from './styles'
import { OText } from '../shared'
import { StyleSheet, Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

const FloatingButtonUI = (props: FloatingButtonParams) => {
  const {
    btnLeftValue,
    btnRightValue,
    btnLeftValueShow,
    btnRightValueShow,
    btnText,
    handleButtonClick,
    disabled,
    isSecondaryBtn
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    primaryBtn: {
      backgroundColor: theme.colors.primary,
    },
    secodaryBtn: {
      backgroundColor: theme.colors.textSecondary,
    },
    btnTextStyle: {
      position: 'absolute',
      width: '100%',
      paddingBottom: 5,
      left: 0,
      textAlign: 'center',
    }
  })

  return (
    <Container
      isIos={Platform.OS === 'ios'}
    >
      <Button
        style={[isSecondaryBtn ? styles.secodaryBtn: styles.primaryBtn]}
        onPress={handleButtonClick}
        disabled={disabled}
      >
        <OText color={theme.colors.white} size={16} mLeft={20}>
          {btnLeftValueShow ? btnLeftValue : ''}
        </OText>
        <OText style={styles.btnTextStyle} color={theme.colors.white} size={16} weight='bold'>
          {btnText}
        </OText>
        <OText color={theme.colors.white} size={16} mRight={20}>
          {btnRightValueShow ? btnRightValue : ''}
        </OText>
      </Button>
    </Container>
  )
}

export const FloatingButton = (props: FloatingButtonParams) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI
  }

  return (
    <FloatingButtonController {...floatingButtonProps} />
  )
}
