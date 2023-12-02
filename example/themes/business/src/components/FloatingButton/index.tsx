import React from 'react';
import { FloatingButton as FloatingButtonController } from 'ordering-components/native';
import { FloatingButtonParams } from '../../types';
import { Container, Button } from './styles';
import { OText } from '../shared';
import { StyleSheet, Platform, View } from 'react-native';
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
    widthButton,
    isPadding,
    isHideRejectButtons,
    principalButtonColor
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    primaryBtn: {
      backgroundColor: principalButtonColor ?? theme.colors.primary,
    },
    secodaryBtn: {
      backgroundColor: theme.colors.textSecondary,
    },
    btnTextStyle: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      paddingHorizontal: 10,
      paddingVertical: 10,
      position: 'absolute',
      width: '100%',
      left: 0,
      textAlign: 'center',
    },
  });

  return (
    <Container
      isIos={Platform.OS === 'ios'}
      paddingBottomIos={props.paddingBottomIos}
      style={{ paddingHorizontal: props.isPadding ? 30 : 0 }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        {!isHideRejectButtons && (
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
              ,
              { width: widthButton },
            ]}
            onPress={firstButtonClick}
            disabled={disabled}>
            <OText color={theme.colors.white} size={16} mLeft={20}>
              {btnLeftValueShow ? btnLeftValue : ''}
            </OText>

            <OText
              style={styles.btnTextStyle}
              color={colorTxt1 ? colorTxt1 : theme.colors.white}
              numberOfLines={2}
              adjustsFontSizeToFit>
              {btnText}
            </OText>

            <OText color={theme.colors.white} size={16} mRight={20}>
              {btnRightValueShow ? btnRightValue : ''}
            </OText>
          </Button>
        )}

        {secondButton && (
          <Button
            secondButton={secondButton}
            style={[
              secondButton
                ? { backgroundColor: secondColorCustom || styles.secodaryBtn }
                : color
                ? color
                : styles.secodaryBtn,
              ,
              { width: widthButton },
            ]}
            onPress={secondButtonClick}
            disabled={disabled}>
            <OText color={theme.colors.white} size={16} mLeft={20}>
              {btnLeftValueShow ? btnLeftValue : ''}
            </OText>

            <OText
              style={styles.btnTextStyle}
              color={theme.colors.white}
              numberOfLines={2}
              adjustsFontSizeToFit>
              {secondBtnText}
            </OText>

            <OText color={theme.colors.white} size={16} mRight={20}>
              {btnRightValueShow ? btnRightValue : ''}
            </OText>
          </Button>
        )}
      </View>
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
