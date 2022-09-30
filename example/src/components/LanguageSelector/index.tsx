import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, NativeModules } from 'react-native'
import { useTheme } from 'styled-components/native';
import RNRestart from 'react-native-restart'
import { LanguageSelector as LanguageSelectorController, useOrder, useLanguage } from 'ordering-components/native'

import RNPickerSelect from 'react-native-picker-select'
import { Container, DummyContainer } from './styles'
import { LanguageSelectorParams } from '../../types'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {

  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
    pickerStyle
  } = props

  const [orderState] = useOrder()
  const [langugageState] = useLanguage()
  const theme = useTheme();

  const [language, setLanguage] = useState(currentLanguage)

  const _pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: '#000',
      borderWidth: 1,
      borderColor: theme.colors.clear,
      padding: 10,
      height: 40,
      backgroundColor: theme.colors.disabled,
      borderRadius: 8
    },
    inputIOS: {
      color: '#000',
      padding: 10,
      height: 40,
      borderWidth: 1,
      marginStart: 20,
      borderColor: theme.colors.clear,
      backgroundColor: theme.colors.clear,
    },
    icon: {
      width: 10,
      marginTop: 9,
      marginEnd: 10
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    },
    chevronDown: {
      display: 'none'
    },
    chevronUp: {
      display: 'none'
    }
  })

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.name,
      inputLabel: language?.name
    }
  })
  _languages && _languages.sort((a: any, b: any) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
  )

  const changeDirection = async (language: any) => {
    if (language === langugageState?.language?.code) return
    const isArabicLang = language === 'ar'
    const isRTLOn = NativeModules.I18nManager.isRTL

    if (isArabicLang && !isRTLOn) {
      NativeModules.I18nManager.forceRTL(!isRTLOn)
      RNRestart.Restart();
    }

    if (!isArabicLang && isRTLOn) {
      NativeModules.I18nManager.forceRTL(!isRTLOn)
      RNRestart.Restart();
    }
  }

  const handlerChangeLanguage = (langCode?: any) => {
    changeDirection(Platform.OS === 'ios' ? language : langCode)
    handleChangeLanguage(Platform.OS === 'ios' ? language : langCode)
  }

  useEffect(() => {
    changeDirection(currentLanguage)
  }, [])

  return (
    <Container>
      {languagesState?.languages ? (
        <RNPickerSelect
          onValueChange={(val) => Platform.OS === 'ios' ? setLanguage(val) : handlerChangeLanguage(val)}
          items={_languages || []}
          value={Platform.OS === 'ios' ? language : currentLanguage}
          style={pickerStyle ? pickerStyle : _pickerStyle}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
          disabled={orderState.loading}
          onClose={() => Platform.OS === 'ios' ? handlerChangeLanguage() : {}}
          onDonePress={() => handlerChangeLanguage()}
          fixAndroidTouchableBug={true}
        />
      ) : <DummyContainer />}
    </Container>
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const [langugageState] = useLanguage()

  const LanguageProps = {
    ...props,
    currentLanguage: langugageState?.language?.code ?? NativeModules.I18nManager.localeIdentifier?.split('_')?.[0] ?? 'en',
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
