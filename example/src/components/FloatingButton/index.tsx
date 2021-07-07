import React from 'react';
import {
  FloatingButton as FloatingButtonController,
  useLanguage,
} from 'ordering-components/native';
import { FloatingButtonParams } from '../../types';
import { Container, Button } from './styles';
import { OText } from '../shared';
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

const FloatingButtonUI = (props: FloatingButtonParams) => {
  const {
    btnLeftValue,
    btnRightValue,
    btnLeftValueShow,
    btnRightValueShow,
    btnText,
    handleButtonClick,
    disabled,
    isSecondaryBtn,
    handleEmpty,
  } = props;

  const [, t] = useLanguage();
  const { bottom } = useSafeAreaInsets();

  return (
    <Container
      isIos={Platform.OS === 'ios'}
      style={{ paddingBottom: bottom + 16 }}>
      <Button
        style={{ backgroundColor: colors.clear }}
        onPress={handleButtonClick}
        disabled={disabled}>
        <OText color={colors.textNormal} size={16} weight={'600'} mRight={20}>
          {btnRightValueShow ? btnRightValue : ''}
        </OText>
        <View style={styles.quantity}>
          <OText color={colors.white} size={16}>
            {btnLeftValueShow ? btnLeftValue : ''}
          </OText>
        </View>
        {/* <OText
          style={styles.btnTextStyle}
          color={colors.white}
          size={16}
          weight="bold">
          {btnText}
        </OText> */}
      </Button>
      <Button onPress={handleEmpty} style={styles.emptyBtn}>
        <OText color={colors.textThird}>{t('EMPTY_CART', 'Empty cart')}</OText>
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.clear,
  },
  secodaryBtn: {
    backgroundColor: colors.clear,
  },
  btnTextStyle: {
    position: 'absolute',
    width: '100%',
    paddingBottom: 5,
    left: 0,
    textAlign: 'center',
  },
  emptyBtn: {
    height: 44,
    borderRadius: 7.6,
    backgroundColor: colors.backgroundGray100,
    paddingHorizontal: 27,
  },
  quantity: {
	  paddingVertical: 6,
	  paddingHorizontal: 12,
	  borderRadius: 7.6,
	  backgroundColor: colors.primary
  },
});

export const FloatingButton = (props: FloatingButtonParams) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI,
  };

  return <FloatingButtonController {...floatingButtonProps} />;
};
