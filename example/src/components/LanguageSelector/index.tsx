import React from 'react'
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native'
import { Platform, StyleSheet } from 'react-native'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import { colors } from '../../theme'
import { LanguageSelectorParams } from '../../types'
import AntIcon from 'react-native-vector-icons/AntDesign'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {

  const [orderState] = useOrder()

  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.name,
      inputLabel: language?.code.toUpperCase()
    }
  })
  _languages && _languages.sort((a: any, b: any) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
  )
  return (
    <Container>
      {languagesState?.languages && (
        <RNPickerSelect
          onValueChange={handleChangeLanguage}
          items={_languages || []}
          value={currentLanguage}
          style={pickerStyle}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
          Icon={() => <AntIcon name='caretdown' style={pickerStyle.icon} />}
          disabled={orderState.loading}
        />
      )}
    </Container>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    width: 60,
    borderWidth: 1,
    borderColor: colors.secundaryContrast,
    borderRadius: 20,
    paddingHorizontal: 10
  },
  inputIOS: {
    color: colors.secundaryContrast,
    paddingEnd: 20,
    height: 30,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundGray
  },
  icon: {
    width: 10,
    height: 10,
    top: Platform.OS === 'ios' ? 8 : 17,
    right: Platform.OS === 'ios' ? 7 : 10,
    position: 'absolute',
  },
  placeholder: {
    color: colors.secundaryContrast
  }
})

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
