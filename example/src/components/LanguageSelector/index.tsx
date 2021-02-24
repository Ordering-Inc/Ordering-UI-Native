import React from 'react'
import { LanguageSelector as LanguageSelectorController } from 'ordering-components/native'
import { View, StyleSheet } from 'react-native'
import { ODropDown } from '../shared'
import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'

const LanguageSelectorUI = (props) => {

  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.code?.toUpperCase()
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
          placeholder={{ value: currentLanguage || '', label: currentLanguage.toUpperCase() }}
          style={pickerStyle}
        />
      )}
    </Container>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: 'black',
    width: 100,
    borderWidth: 1,
    borderColor: 'red'
  },
  icon: {
    color: 'black',
    width: 10
  },
  placeholder: {
    color: 'black'
  }
})

export const LanguageSelector = (props) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}