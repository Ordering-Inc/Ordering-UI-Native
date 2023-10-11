import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import { useTheme } from 'styled-components/native';
import {
  LanguageSelector as LanguageSelectorController,
  useLanguage,
} from 'ordering-components/native';
import { Container, LanguageItem } from './styles';
import langCountries from './lang_country.json';
import { OText, OIcon } from '../shared';
import { LanguageSelectorParams } from '../../types';

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const { languagesState, currentLanguage, handleChangeLanguage } = props;

  const [, t] = useLanguage();
  const theme = useTheme();

  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
      key: language?.code,
      value: language?.code,
      label: language?.name,
      inputLabel: language?.code.toUpperCase(),
      countryCode: langCountries.find(item => item.value == language?.code)?.countryCode,
    };
  });

  _languages &&
    _languages?.sort((a: any, b: any) =>
      a.content > b.content ? 1 : b.content > a.content ? -1 : 0,
    );

  const countryCodes = _languages?.map((item: any) => item.countryCode);

  const currentLanguageData = _languages?.find(
    (item: any) => item.value == currentLanguage,
  );

  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 16,
    },
  });

  return !languagesState?.loading && languagesState?.languages?.length > 1 && (
    <Container style={{ backgroundColor: theme.colors.inputChat }}>
      {languagesState?.languages && (
        <CountryPicker
          countryCode={currentLanguageData}
          visible={isCountryModalVisible}
          onClose={() => setCountryModalVisible(false)}
          withCountryNameButton
          countryCodes={countryCodes}
          //@ts-ignore
          renderFlagButton={() => (
            <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
              <LanguageItem justifyContent="space-between">
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Flag
                    withEmoji
                    flagSize={24}
                    countryCode={currentLanguageData?.countryCode}
                  />

                  <OText style={styles.text}>
                    {currentLanguageData?.label}
                  </OText>
                </View>

                <OIcon
                  src={theme?.images?.general?.chevronDown}

                  width={20}
                  height={20}
                />
              </LanguageItem>
            </TouchableOpacity>
          )}
          flatListProps={{
            keyExtractor: (item: any) => item.value,
            data: _languages || [],
            renderItem: ({ item }: any) => (
              <TouchableOpacity
                onPress={() => {
                  handleChangeLanguage(item.value);
                  setCountryModalVisible(false);
                }}
                activeOpacity={1}>
                <LanguageItem>
                  <View />

                  <Flag
                    withEmoji
                    flagSize={24}
                    countryCode={item.countryCode}
                  />

                  <OText style={styles.text}>{t(item.code, item.label)}</OText>
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
