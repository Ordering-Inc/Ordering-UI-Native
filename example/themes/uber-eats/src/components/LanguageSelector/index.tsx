import React, { useState, useEffect } from 'react'
import { I18nManager, TouchableOpacity, ActivityIndicator, View, Platform } from 'react-native'
import { useTheme } from 'styled-components/native'
import {
  LanguageSelector as LanguageSelectorController,
  useLanguage
} from 'ordering-components/native'
import { StyleSheet } from 'react-native'
import RNRestart from 'react-native-restart'
import Picker from 'react-native-country-picker-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { Container, SelectItemBtn, SelectItem } from './styles'
import { LanguageSelectorParams } from '../../types'
import { OText } from '../shared'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

  const theme = useTheme()
  const [languageState] = useLanguage()
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState<any>(null)
  let current;

  const styles = StyleSheet.create({
    itemSelected: {
      backgroundColor: theme.colors.disabled,
    },
    closeBtn: {
      width: 40,
      height: 40,
    },
    arrowDown: {
      fontSize: 20,
      marginBottom: 5
    }
  })

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      key: language.code,
      value: language.code,
      label: language.name.toUpperCase()
    }
  })
  _languages && _languages.sort((a: any, b: any) =>
    (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)
  )

  const langSelectedObj: any = _languages && _languages.find((item: any) => item.value === currentLanguage) || {}

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

  const handlerChangeLanguage = (langCode: any) => {
    setOptionSelected(langCode)
    changeDirection(langCode)
    handleChangeLanguage(langCode)
  }

  useEffect(() => {
    if (optionSelected === languageState?.language?.code && !languageState.loading) {
      setIsOpen(false)
    }
  }, [languageState])

  return (
    <Container>
      {languagesState?.languages && (
        <Picker
          countryCodes={current}
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          withCountryNameButton
          // @ts-ignore
          closeButtonStyle={{
            width: '100%',
            alignItems: 'flex-end',
            padding: 10
          }}
          closeButtonImageStyle={Platform.OS === 'ios' && styles.closeBtn}
          renderFlagButton={() => (
            <>
              <TouchableOpacity
                onPress={() => setIsOpen(true)}
                disabled={_languages.length === 0 || languageState.loading}
              >
                <SelectItemBtn>
                  <OText
                    color={theme.colors.secundaryContrast}
                    size={14}
                  >
                    {langSelectedObj.key.toUpperCase()}
                  </OText>
                  <MaterialIcons name='keyboard-arrow-down' style={styles.arrowDown} />
                </SelectItemBtn>
              </TouchableOpacity>
            </>
          )}
          flatListProps={{
            keyExtractor: (item: any) => item.value,
            data: _languages || [],
            renderItem: ({ item }: any) => (
              <TouchableOpacity
                style={langSelectedObj.value === item.value && styles.itemSelected}
                disabled={langSelectedObj.value === item.value || languageState.loading}
                onPress={() => handlerChangeLanguage(item.value)}
              >
                <SelectItem>
                  <View style={{ width: 40 }}>
                    {optionSelected === item.value && languageState.loading && (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    )}
                  </View>
                  <OText
                    size={14}
                    style={{ marginRight: 10 }}
                  >
                    {item.label}
                  </OText>
                </SelectItem>
              </TouchableOpacity>
            ),
          }}
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
