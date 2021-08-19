import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LanguageSelector as LanguageSelectorController } from 'ordering-components/native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';

import { Container, LanguageItem } from './styles';
import langCountries from './lang_country.json';
import { LanguageSelectorParams } from '../../types';
import { OText } from '../shared';
import { useTheme } from 'styled-components/native';

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const { languagesState, currentLanguage, handleChangeLanguage } = props;

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      key: language?.code,
      value: language?.code,
      label: language?.name,
      inputLabel: language?.code.toUpperCase(),
      countryCode: langCountries.find(item => item.value == language?.code)
        ?.countryCode,
    };
  });
  _languages &&
    _languages?.sort((a: any, b: any) =>
      a.content > b.content ? 1 : b.content > a.content ? -1 : 0,
    );

  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  const countryCodes = _languages?.map((item: any) => item.countryCode);

  const currentLanguageData = _languages?.find(
    (item: any) => item.value == currentLanguage,
  );

  const theme = useTheme();

  return (
    <Container style={{ backgroundColor: theme.colors.inputChat }}>
      {languagesState?.languages && (
        <CountryPicker
          countryCode={currentLanguageData}
          visible={isCountryModalVisible}
          onClose={() => setCountryModalVisible(false)}
          withCountryNameButton
          countryCodes={countryCodes}
          renderFlagButton={() => (
            <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
              <LanguageItem>
                <Flag
                  withEmoji
                  flagSize={24}
                  countryCode={currentLanguageData?.countryCode}
                />
                <OText>{currentLanguageData?.label}</OText>
              </LanguageItem>
            </TouchableOpacity>
          )}
          flatListProps={{
            /* @ts-ignore */
            keyExtractor: item => item.value,
            data: _languages || [],
            renderItem: ({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  /* @ts-ignore */
                  handleChangeLanguage(item.value);
                  setCountryModalVisible(false);
                }}>
                <LanguageItem>
                  <View style={{ width: 40 }} />
                  <Flag
                    withEmoji
                    flagSize={24}
                    /* @ts-ignore */
                    countryCode={item.countryCode}
                  />
                  <OText>
                    {
                      /* @ts-ignore */
                      item.label
                    }
                  </OText>
                </LanguageItem>
              </TouchableOpacity>
            ),
          }}
        />
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
