import React from 'react'
import { LanguageSelector as LanguageSelectorController,useOrder } from 'ordering-components/native'
import { StyleSheet } from 'react-native'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import {colors} from '../../theme'
import { OText } from '../shared'
import AntIcon from 'react-native-vector-icons/AntDesign'

const LanguageSelectorUI = (props) => {

  const [orderState] = useOrder()

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
          useNativeAndroidPickerStyle={false}
          Icon={() => <AntIcon name='caretdown' style={pickerStyle.icon}/>}
          disabled={orderState.loading}
        />
      )}
    </Container>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    width: 75,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    paddingHorizontal: 10
  },
  icon: {
    width: 10,
    height: 10,
    top: 17,
    right: 10,
    position: 'absolute',
  },
  placeholder: {
    color: colors.secundaryContrast
  }
})

export const LanguageSelector = (props) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}