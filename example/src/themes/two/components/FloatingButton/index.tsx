import React from 'react'
import { FloatingButton as FloatingButtonController } from 'ordering-components/native'
import { FloatingButtonParams } from '../../../../types'
import {
  Container,
  Button
} from './styles'
import { OText } from '../../../../components/shared'
import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../theme.json'

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

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <Button
        style={[isSecondaryBtn ? styles.secodaryBtn: styles.primaryBtn]}
        onPress={handleButtonClick}
        disabled={disabled}
      >
        <OText color={colors.white} size={16} mLeft={20}>
          {btnLeftValueShow ? btnLeftValue : ''}
        </OText>
        <OText style={styles.btnTextStyle} color={colors.white} size={16} weight='bold'>
          {btnText}
        </OText>
        <OText color={colors.white} size={16} mRight={20}>
          {btnRightValueShow ? btnRightValue : ''}
        </OText>
      </Button>
    </Container>
  )
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  secodaryBtn: {
    backgroundColor: colors.textSecondary,
  },
  btnTextStyle: {
    position: 'absolute',
    width: '100%',
    paddingBottom: 5,
    left: 0,
    textAlign: 'center',
  }
})

export const FloatingButton = (props: FloatingButtonParams) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI
  }

  return (
    <FloatingButtonController {...floatingButtonProps} />
  )
}
