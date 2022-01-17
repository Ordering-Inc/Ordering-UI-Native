import React from 'react'
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { Platform, StyleSheet, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

import RNPickerSelect from 'react-native-picker-select'
import { Container } from './styles'
import { LanguageSelectorParams } from '../../types'
import { OIcon } from '../shared'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {

  const [orderState] = useOrder()

  const theme = useTheme();

  const _pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.white,
      borderWidth: 1,
      borderColor: theme.colors.clear,
      paddingHorizontal: 10,
      paddingEnd: 24,
      height: 40,
      backgroundColor: theme.colors.clear,
    },
    inputIOS: {
      color: theme.colors.white,
      paddingEnd: 24,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.clear,
      backgroundColor: theme.colors.clear
    },
    icon: {
      width: 10,
      marginTop: 9,
      marginEnd: 10
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    }
  })

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
    languagesState?.loading && props.allowLoading ? (
      <Container>
        <Placeholder style={{ width: 100, paddingTop: 10 }} Animation={Fade}>
          <PlaceholderLine height={20} style={{ paddingBottom: 0, marginBottom: 0 }} />
        </Placeholder>
      </Container>
    ) : (
      <Container>
        {languagesState?.languages ? (
          <>
            {iconColor && <OIcon src={theme.images.general.language} color={iconColor} style={{ marginEnd: 14 }} width={16} />}
            <RNPickerSelect
              onValueChange={handleChangeLanguage}
              items={_languages || []}
              value={currentLanguage}
              style={pickerStyle ? pickerStyle : _pickerStyle}
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
              Icon={() => (
                <View
                  style={pickerStyle ? pickerStyle.icon : _pickerStyle.icon}
                >
                  <OIcon src={theme.images.general.arrow_down} color={theme.colors.white} style={{ width: '100%' }} />
                </View>
              )}
              disabled={orderState.loading}
            />
          </>
        ) : (
          <View style={{ height: 40 }} />
        )}
      </Container>
    )
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
