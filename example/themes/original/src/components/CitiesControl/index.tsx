import React, { useState, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, Keyboard, View } from 'react-native';
import { useLanguage, useOrder } from 'ordering-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { OButton, OIcon, OText } from '../shared';

import { CityElement, Container } from './styles'

export const CitiesControl = (props: any) => {
  const {
    cities,
    onClose,
    handleChangeCity
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [cityState, setCityState] = useState(orderState?.options?.city_id)

  const handleClick = () => {
    cityState !== orderState?.options?.city_id && handleChangeCity(cityState)
    onClose && onClose()
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardShow(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardShow(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Container height={height - top - bottom - 60 - (isKeyboardShow ? 250 : 0)}>
      <View>
        {cities?.map((city: any) => city?.enabled && (
          <CityElement
            key={city?.id}
            activeOpacity={1}
            disabled={orderState?.loading}
            onPress={() => setCityState(city?.id === cityState ? null : city?.id)}
          >
            <OIcon
              src={cityState === city?.id
                ? theme.images.general.option_checked
                : theme.images.general.option_normal}
              width={16}
              style={{ marginEnd: 24 }}
            />
            <OText color={theme.colors.black}>
              {city?.name}
            </OText>
          </CityElement>
        ))}
      </View>
      <OButton
        text={t('CONTINUE', 'Continue')}
        bgColor={theme.colors.primary}
        borderColor={theme.colors.primary}
        style={styles.btnStyle}
        textStyle={{ color: 'white' }}
        onClick={() => handleClick()}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  btnStyle: {
    marginTop: 20,
    borderRadius: 8,
    shadowOpacity: 0,
    height: 44
  },
})
