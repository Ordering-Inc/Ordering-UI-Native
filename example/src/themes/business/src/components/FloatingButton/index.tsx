import React from 'react';
import { FloatingButton as FloatingButtonController } from 'ordering-components/native';
import { FloatingButtonParams } from '../../types';
import { Container, Button } from './styles';
import { OText } from '../shared';
import { StyleSheet, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

const FloatingButtonUI = (props: FloatingButtonParams) => {
  const {
    btnLeftValue,
    btnRightValue,
    btnLeftValueShow,
    btnRightValueShow,
    btnText,
    colorTxt1,
    secondBtnText,
    firstColorCustom,
    secondColorCustom,
    secondButtonClick,
    firstButtonClick,
    disabled,
    color,
    isSecondaryBtn,
    secondButton,
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    primaryBtn: {
      backgroundColor: theme.colors.primary,
    },
    secodaryBtn: {
      backgroundColor: theme.colors.textSecondary,
    },
    btnTextStyle: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      position: 'absolute',
      width: '100%',
      paddingBottom: 5,
      left: 0,
      textAlign: 'center',
    },
  });

  return (
    <Container isIos={Platform.OS === 'ios'}>
      <Button
        secondButton={secondButton}
        style={[
          {
            borderWidth: colorTxt1 ? 1 : 0,
            borderColor: colorTxt1 ? colorTxt1 : null,
          },
          secondButton
            ? { backgroundColor: firstColorCustom || styles.primaryBtn }
            : color
            ? { backgroundColor: color }
            : styles.primaryBtn,
        ]}
        onPress={firstButtonClick}
        disabled={disabled}>
        <OText color={theme.colors.white} size={16} mLeft={20}>
          {btnLeftValueShow ? btnLeftValue : ''}
        </OText>

        <OText
          style={styles.btnTextStyle}
          color={colorTxt1 ? colorTxt1 : theme.colors.white}
          size={16}>
          {btnText}
        </OText>

        <OText color={theme.colors.white} size={16} mRight={20}>
          {btnRightValueShow ? btnRightValue : ''}
        </OText>
      </Button>

      {secondButton && (
        <Button
          secondButton={secondButton}
          style={[
            secondButton
              ? { backgroundColor: secondColorCustom || styles.secodaryBtn }
              : color
              ? color
              : styles.secodaryBtn,
          ]}
          onPress={secondButtonClick}
          disabled={disabled}>
          <OText color={theme.colors.white} size={16} mLeft={20}>
            {btnLeftValueShow ? btnLeftValue : ''}
          </OText>

          <OText
            style={styles.btnTextStyle}
            color={theme.colors.white}
            size={16}>
            {secondBtnText}
          </OText>

          <OText color={theme.colors.white} size={16} mRight={20}>
            {btnRightValueShow ? btnRightValue : ''}
          </OText>
        </Button>
      )}
    </Container>
  );
};

export const FloatingButton = (props: FloatingButtonParams) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI,
  };

  return <FloatingButtonController {...floatingButtonProps} />;
};
