import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import {
  LanguageSelector as LanguageSelectorController,
  useLanguage,
  useOrder,
} from 'ordering-components/native';
import { Container } from './styles';
import { OIconButton, OText } from '../../components/shared';
import { LanguageSelectorParams } from '../../types';
import { Picker } from '@react-native-picker/picker';

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const { languagesState, currentLanguage, handleChangeLanguage } = props;

  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const theme = useTheme();
  const [showLenguagesIos, setShowLenguageIos] = useState(false);

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      value: language?.code,
      label: language?.name,
      inputLabel: language?.code.toUpperCase(),
    };
  });

  _languages &&
    _languages.sort((a: any, b: any) =>
      a.content > b.content ? 1 : b.content > a.content ? -1 : 0,
    );

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      borderWidth: 1,
      borderRadius: 15,
      paddingHorizontal: 10,
      width: 296,
      height: 44,
    },
    inputIOS: {
      width: 296,
      height: 180,
      borderRadius: 15,
      paddingHorizontal: 10,
    },
  });

  return (
    <Container>
      {languagesState?.languages && (
        <>
          <OText color={theme.colors.textGray} mBottom={18} weight="bold">
            {t('LANGUAGE', 'Language')}
          </OText>
          {Platform.OS !== 'ios' && (
            <Picker
              style={pickerStyle.inputAndroid}
              selectedValue={currentLanguage}
              onValueChange={(itemValue: any, itemIndex: any) =>
                handleChangeLanguage(itemValue)
              }>
              {_languages.map((lang: any) => (
                <Picker.Item
                  key={lang.inputLabel}
                  label={lang.label}
                  value={lang.value}
                />
              ))}
            </Picker>
          )}

          {Platform.OS === 'ios' &&
            (!showLenguagesIos ? (
              <OIconButton
                style={{
                  borderRadius: 7.6,
                  width: 296,
                  height: 44,
                  justifyContent: 'flex-start',
                }}
                borderColor={theme.colors.transparent}
                bgColor={theme.colors.inputChat}
                title={currentLanguage}
                onClick={() => setShowLenguageIos(true)}
              />
            ) : (
              <Picker
                style={pickerStyle.inputIOS}
                selectedValue={currentLanguage}
                onValueChange={(itemValue: any, itemIndex: any) => {
                  handleChangeLanguage(itemValue);
                  setShowLenguageIos(false);
                }}>
                {_languages.map((lang: any) => (
                  <Picker.Item
                    key={lang.inputLabel}
                    label={lang.label}
                    value={lang.value}
                  />
                ))}
              </Picker>
            ))}
        </>
      )}
    </Container>
  );
};

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI,
  };

  return <LanguageSelectorController {...LanguageProps} />;
};
