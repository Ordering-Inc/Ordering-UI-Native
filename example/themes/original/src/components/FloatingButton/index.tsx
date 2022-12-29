import React from 'react';
import {
	FloatingButton as FloatingButtonController,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { FloatingButtonParams } from '../../types';
import { Container, Button } from './styles';
import { OText } from '../shared';
import { StyleSheet, Platform } from 'react-native';
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
		iosBottom
	} = props;

	const [, t] = useLanguage();
	const { bottom } = useSafeAreaInsets();

	const theme = useTheme();

	const styles = StyleSheet.create({
		primaryBtn: {
			backgroundColor: theme.colors.primary,
		},
		secondaryBtn: {
			backgroundColor: theme.colors.backgroundGray200,
		},
		emptyBtn: {
			height: 44,
			borderRadius: 7.6,
			backgroundColor: theme.colors.backgroundGray100,
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
			backgroundColor: theme.colors.primaryContrast,
			paddingHorizontal: 7
		}
	});

	return (
		<Container
			style={{
				paddingBottom: Platform.OS === 'ios' ? 20 : bottom + 16
			}}>

			<View style={styles.infoCont}>
				<OText color={theme.colors.textNormal} size={16} lineHeight={24} weight={'600'} mRight={20}>
					{btnRightValueShow ? btnRightValue : ''}
				</OText>
				{btnLeftValueShow && (
					<View style={styles.badge}>
						<OText color={theme.colors.textNormal} size={14} lineHeight={24}>
							{btnLeftValueShow ? btnLeftValue : ''}
						</OText>
					</View>
				)}
			</View>
			<Button
				style={[isSecondaryBtn ? styles.secondaryBtn : styles.primaryBtn]}
				onPress={handleButtonClick}
				disabled={disabled}
			>
				<OText color={isSecondaryBtn ? theme.colors.textSecondary : theme.colors.white} lineHeight={24} size={14} weight={'400'}>
					{btnText}
				</OText>
			</Button>
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
