import React from 'react';
import {
  LanguageSelector as LanguageSelectorController,
  useLanguage,
  useOrder,
} from 'ordering-components/native';
import { Platform, StyleSheet } from 'react-native';

import { OIcon, OIconButton, OText, OButton } from '../../components/shared';
import RNPickerSelect from 'react-native-picker-select';
import { Container } from './styles';
import { useTheme } from 'styled-components/native';
import { LanguageSelectorParams } from '../../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const { languagesState, currentLanguage, handleChangeLanguage } = props;
  const theme = useTheme();

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
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: '#F8F9FA',
      width: 296,
      height: 44,
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      width: 296,
      height: 44,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.inputDisabled,
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 0 : 7,
      position: 'absolute',
      fontSize: 20,
    },
    placeholder: {
      color: theme.colors.secundaryContrast,
    },
  });

  return (
    <Container>
      {languagesState?.languages && (
        <>
          <OText color={theme.colors.textGray} mBottom={18} weight="bold">
            {t('LANGUAGE', 'Language')}
          </OText>
          <RNPickerSelect
            onValueChange={handleChangeLanguage}
            items={_languages || []}
            value={currentLanguage}
            style={pickerStyle}
            useNativeAndroidPickerStyle={false}
            placeholder={{}}
            Icon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                style={pickerStyle.icon}
              />
            )}
            disabled={orderState.loading}
          />
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
