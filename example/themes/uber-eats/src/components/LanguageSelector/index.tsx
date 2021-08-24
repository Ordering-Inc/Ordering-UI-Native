import React from 'react'
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native'
import { Platform, StyleSheet } from 'react-native'
import RNRestart from 'react-native-restart'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import { useTheme } from 'styled-components/native'
import { LanguageSelectorParams } from '../../types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { I18nManager } from 'react-native'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

  const theme = useTheme()

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: 'transparent',
      width: 80,
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      height: 40,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: 'transparent',
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 0 : (I18nManager.isRTL ? 50 : 7),
      position: 'absolute',
      fontSize: 20
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    }
  })

  const [orderState] = useOrder()

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.name,
      inputLabel: language?.code.toUpperCase()
    }
  })
  _languages && _languages.sort((a: any, b: any) =>
    (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)
  )

  const changeDirection = async (language: any) => {
    if(language !== 'ar'){
      if (I18nManager.isRTL){
        await I18nManager.forceRTL(false)
        RNRestart.Restart();
      }
    } else {
      if(!I18nManager.isRTL){
        await I18nManager.forceRTL(true)
        RNRestart.Restart();
      }
    }
  }
  const handlerChangeLanguage = (language: any) => {
    changeDirection(language)
    handleChangeLanguage(language)
  }

  return (
    <Container>
      {languagesState?.languages && (
        <RNPickerSelect
          onValueChange={handlerChangeLanguage}
          items={_languages || []}
          value={currentLanguage}
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
          Icon={() => <MaterialIcons name='keyboard-arrow-down' style={pickerStyle.icon} />}
          disabled={orderState.loading}
        />
      )}
    </Container>
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
