import React, { useState, useEffect } from 'react'
import {
	useUtils,
	useLanguage,
	ProductOptionSuboption as ProductSubOptionController
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native'
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

import {
	Container,
	IconControl,
	QuantityControl,
	Checkbox,
	PositionControl,
	Circle,
	Logo
} from './styles'
import { OIcon, OText } from '../shared'

export const ProductOptionSubOptionUI = (props: any) => {
	const {
		state,
		increment,
		decrement,
		balance,
		option,
		suboption,
		toggleSelect,
		changePosition,
		disabled,
		setIsScrollAvailable,
		image
	} = props

	const disableIncrement = option?.limit_suboptions_by_max ? balance === option?.max || state.quantity === suboption?.max : state.quantity === suboption?.max || (!state.selected && balance === option?.max)
	const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ parsePrice, optimizeImage }] = useUtils()
	const [showMessage, setShowMessage] = useState(false)
	const [isDirty, setIsDirty] = useState(false)

	const iconsSize = 20

	const styles = StyleSheet.create({
		icon: {
			borderRadius: 7.6,
			width: 60,
			height: 60
		},
		logo: {
			borderRadius: 10,
			marginLeft: 3,
		},
	});

	const handleSuboptionClick = () => {
		toggleSelect()
		setIsDirty(true)

		if (balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1)) {
			setShowMessage(true)
		}
	}

	useEffect(() => {
		if (balance === option?.max && state?.selected && isDirty) {
			setIsDirty(false)
			setIsScrollAvailable(option?.id)
		}
	}, [state?.selected])

	useEffect(() => {
		if (!(balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))) {
			setShowMessage(false)
		}
	}, [balance])

	return (
		<View>
			<Container onPress={!((option?.with_half_option || option?.allow_suboption_quantity) && state?.selected) ? () => handleSuboptionClick() : null}>
				<IconControl disabled={disabled} onPress={() => handleSuboptionClick()}>
					{((option?.min === 0 && option?.max === 1) || option?.max > 1) ? (
						state?.selected ? (
							<OIcon src={theme.images.general.check_act} color={theme.colors.primary} width={16} />
						) : (
							<OIcon src={theme.images.general.check_nor} color={theme.colors.disabled} width={16} />
						)
					) : (
						state?.selected ? (
							<OIcon src={theme.images.general.radio_act} color={theme.colors.primary} width={16} />
						) : (
							<OIcon src={theme.images.general.radio_nor} color={theme.colors.disabled} width={16} />
						)
					)}
					{image && (
						<Logo style={styles.logo}>
							<FastImage
								style={styles.icon}
								source={{
									uri: optimizeImage(image, 'h_100,c_limit'),
									priority: FastImage.priority.normal,
								}}
								resizeMode={FastImage.resizeMode.cover}
							/>
						</Logo>
					)}
					<OText size={12} lineHeight={18} color={theme.colors.textSecondary} mLeft={5} style={{ flex: 1 }}>
						{suboption?.name}
					</OText>
				</IconControl>
				{option?.allow_suboption_quantity && state?.selected && (
					<QuantityControl>
						<>
							<Checkbox disabled={disabled || state.quantity === 0} onPress={decrement}>
								<IconAntDesign
									name='minuscircleo'
									size={iconsSize}
									color={state.quantity === 0 || disabled ? theme.colors.disabled : theme.colors.primary}
								/>
							</Checkbox>
							<OText size={12}>
								{state.quantity}
							</OText>
							<Checkbox disabled={disabled || disableIncrement} onPress={increment}>
								<IconAntDesign
									name='pluscircleo'
									size={iconsSize}
									color={disableIncrement || disabled ? theme.colors.disabled : theme.colors.primary}
								/>
							</Checkbox>
						</>
					</QuantityControl>
				)}
				{option?.with_half_option && state?.selected && (
					<PositionControl>
						<>
							<Circle disabled={disabled} onPress={() => changePosition('left')}>
								<OIcon
									src={theme.images.general.half_l}
									color={state.selected && state.position === 'left' ? theme.colors.primary : '#cbcbcb'}
									width={20}
									height={20}
									style={styles.inverse}
								/>
							</Circle>
							<Circle disabled={disabled} onPress={() => changePosition('whole')}>
								<OIcon
									src={theme.images.general.half_f}
									color={state.selected && state.position === 'whole' ? theme.colors.primary : '#cbcbcb'}
									width={20}
									height={20}
								/>
							</Circle>
							<Circle disabled={disabled} onPress={() => changePosition('right')}>
								<OIcon
									src={theme.images.general.half_r}
									color={state.selected && state.position === 'right' ? theme.colors.primary : '#cbcbcb'}
									width={20}
									height={20}
								/>
							</Circle>
						</>
					</PositionControl>
				)}
				{price > 0 && (
					<OText size={12} lineHeight={18} color={theme.colors.textSecondary} style={{ width: 70, maxWidth: 70 }}>
						+ {parsePrice(price)}
					</OText>
				)}
			</Container>
			{showMessage && (
				<OText size={10} mLeft={4} mRight={4} style={{ flex: 1, textAlign: 'center' }} color={theme.colors.primary}>
					{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}
				</OText>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	inverse: {
		transform: [{ rotateY: '180deg' }]
	}
})

export const ProductOptionSubOption = (props: any) => {
	const productOptionSubOptionProps = {
		...props,
		UIComponent: ProductOptionSubOptionUI,
		isOrigin: true
	}

	return (
		<ProductSubOptionController {...productOptionSubOptionProps} />
	)
}
