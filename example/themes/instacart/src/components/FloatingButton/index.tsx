import React from 'react'
import { FloatingButton as FloatingButtonController } from 'ordering-components/native'
import { FloatingButtonParams } from '../../types'
import {
	Container,
	Button
} from './styles'
import { OText } from '../shared'
import { StyleSheet, Platform, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
		inSafeArea
	} = props

	const theme = useTheme()
	const { bottom } = useSafeAreaInsets();

	const styles = StyleSheet.create({
		primaryBtn: {
			backgroundColor: theme.colors.primary,
		},
		secodaryBtn: {
			backgroundColor: theme.colors.textSecondary,
		},
		btnTextStyle: {
			position: 'absolute',
			width: '100%',
			left: 0,
			textAlign: 'center',
		}
	})

	return (
		<Container
			isIos={Platform.OS === 'ios'}
			style={inSafeArea ? {} : { paddingBottom: bottom + 12 }}
		>
			<Button
				style={[isSecondaryBtn ? styles.secodaryBtn : styles.primaryBtn, {}]}
				onPress={handleButtonClick}
				disabled={disabled}
			>
				<OText color={theme.colors.white} size={10} mLeft={20}>
					{''}
				</OText>
				<OText style={styles.btnTextStyle} color={theme.colors.white} size={12} lineHeight={15} weight='500'>
					{`${btnText}`}
				</OText>
				{btnRightValueShow && (
					<View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#00000020', borderRadius: 3 }}>
						<OText color={theme.colors.white} size={10} lineHeight={15} weight={'400'}>
							{btnRightValueShow ? btnRightValue : ''}
						</OText>
					</View>
				)}
			</Button>
		</Container>
	)
}

export const FloatingButton = (props: FloatingButtonParams) => {
	const floatingButtonProps = {
		...props,
		UIComponent: FloatingButtonUI
	}

	return (
		<FloatingButtonController {...floatingButtonProps} />
	)
}
