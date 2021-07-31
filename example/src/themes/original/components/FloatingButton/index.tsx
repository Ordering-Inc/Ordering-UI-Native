import React from 'react';
import {
  FloatingButton as FloatingButtonController,
  useLanguage,
} from 'ordering-components/native';
import { FloatingButtonParams } from '../../../../types';
import { Container, Button } from './styles';
import { OText } from '../../../../components/shared';
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

		<View style={styles.infoCont}>
			<OText color={colors.textNormal} size={16} lineHeight={24} weight={'600'} mRight={20}>
				{btnRightValueShow ? btnRightValue : ''}
			</OText>
			{btnLeftValueShow && (
				<View style={styles.badge}>
					<OText color={colors.textNormal} size={14} lineHeight={24}>
						{btnLeftValueShow ? btnLeftValue : ''}
					</OText>
				</View>
			)}
		</View>
		<Button
        style={[isSecondaryBtn ? styles.secondaryBtn: styles.primaryBtn]}
        onPress={handleButtonClick}
        disabled={disabled}
      >
        <OText color={isSecondaryBtn ? colors.textSecondary : colors.white} lineHeight={24} size={14} weight={'400'}>
          {btnText}
        </OText>
      </Button>

    </Container>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  secondaryBtn: {
    backgroundColor: colors.backgroundGray200,
  },
  emptyBtn: {
    height: 44,
    borderRadius: 7.6,
    backgroundColor: colors.backgroundGray100,
    paddingHorizontal: 27,
  },
  infoCont: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-start',
  },
  badge: {
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 7.6,
	minWidth: 30,
	minHeight: 30,
	backgroundColor: colors.primaryContrast,
	paddingHorizontal: 7
  }
});

export const FloatingButton = (props: FloatingButtonParams) => {
  const floatingButtonProps = {
    ...props,
    UIComponent: FloatingButtonUI,
  };

  return <FloatingButtonController {...floatingButtonProps} />;
};
