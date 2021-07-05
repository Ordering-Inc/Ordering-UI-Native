import React from 'react'
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native'
import { Platform, StyleSheet } from 'react-native'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import { colors } from '../../theme.json'
import { LanguageSelectorParams } from '../../types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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
    (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)
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
          Icon={() => <MaterialIcons name='keyboard-arrow-down' style={pickerStyle.icon} />}
          disabled={orderState.loading}
        />
      )}
    </Container>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.inputDisabled,
    width: 80,
  },
  inputIOS: {
    color: colors.secundaryContrast,
    paddingEnd: 20,
    height: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.inputDisabled
  },
  icon: {
    top: Platform.OS === 'ios' ? 10 : 15,
    right: Platform.OS === 'ios' ? 0 : 7,
    position: 'absolute',
    fontSize: 20
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
