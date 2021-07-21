import React from 'react'
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native'
import { Platform, StyleSheet, View } from 'react-native'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import { colors, images } from '../../theme.json'
import { LanguageSelectorParams } from '../../../../types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { OIcon } from '../../../../components/shared'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {

  const [orderState] = useOrder()

  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
	 iconColor,
	 pickerStyle
  } = props

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

  return (
    <Container>
      {languagesState?.languages && (
			<>
				{iconColor && <OIcon src={images.general.language} color={iconColor} style={{marginEnd: 14}} width={16} />}
				<RNPickerSelect
					onValueChange={handleChangeLanguage}
					items={_languages || []}
					value={currentLanguage}
					style={pickerStyle ? pickerStyle : _pickerStyle}
					useNativeAndroidPickerStyle={false}
					placeholder={{}}
					Icon={() => <View style={pickerStyle ? pickerStyle.icon : _pickerStyle.icon}><OIcon src={images.general.arrow_down} color={iconColor} style={{width: '100%'}} /></View>}
					disabled={orderState.loading}
				/>
		  </>
      )}
    </Container>
  )
}

const _pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    borderWidth: 1,
    borderColor: colors.clear,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.inputDisabled,
    width: 80,
  },
  inputIOS: {
    color: colors.white,
    paddingEnd: 24,
    height: 40,
    borderWidth: 1,
    borderColor: colors.clear,
    backgroundColor: colors.clear
  },
  icon: {
    width: 10,
	 marginTop: 9,
	 marginEnd: 10
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
