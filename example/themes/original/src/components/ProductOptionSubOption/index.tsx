import React, { useState, useEffect } from 'react'
import {
	useUtils,
	useLanguage,
	ProductOptionSuboption as ProductSubOptionController
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native'
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import {
	Container,
	IconControl,
	QuantityControl,
	Checkbox,
	PositionControl,
	Circle
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
		setIsScrollAvailable
	} = props

	const disableIncrement = option?.limit_suboptions_by_max ? balance === option?.max : state.quantity === suboption?.max || (!state.selected && balance === option?.max)
	const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ parsePrice }] = useUtils()
	const [showMessage, setShowMessage] = useState(false)
	const [isDirty, setIsDirty] = useState(false)

	const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
	const iconsSize = isChewLayout ? 20 : 16

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
			<Container onPress={() => handleSuboptionClick()}>
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
					<OText size={12} lineHeight={18} color={theme.colors.textSecondary} mLeft={10} style={{ flex: 1 }}>
						{suboption?.name}
					</OText>
				</IconControl>
				<QuantityControl>
					{option?.allow_suboption_quantity && state?.selected && (
						<>
							<Checkbox disabled={disabled || state.quantity === 0} onPress={decrement}>
								<IconAntDesign
									name='minuscircleo'
									size={iconsSize}
									color={state.quantity === 0 || disabled ? theme.colors.disabled : theme.colors.primary}
								/>
							</Checkbox>
							<OText size={12} mLeft={5} mRight={5}>
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
					)}
				</QuantityControl>
				<PositionControl>
					{option?.with_half_option && state?.selected && (
						<>
							<Circle disabled={disabled} onPress={() => changePosition('left')}>
								<OIcon
									src={theme.images.general.half_l}
									color={state.selected && state.position === 'left' ? theme.colors.primary : '#cbcbcb'}
									width={16}
									style={styles.inverse}
								/>
							</Circle>
							<Circle disabled={disabled} onPress={() => changePosition('whole')}>
								<OIcon
									src={theme.images.general.half_f}
									color={state.selected && state.position === 'whole' ? theme.colors.primary : '#cbcbcb'}
									width={16}
								/>
							</Circle>
							<Circle disabled={disabled} onPress={() => changePosition('right')}>
								<OIcon
									src={theme.images.general.half_r}
									color={state.selected && state.position === 'right' ? theme.colors.primary : '#cbcbcb'}
									width={16}
								/>
							</Circle>
						</>
					)}
				</PositionControl>
				{price > 0 && (
					<OText size={12} lineHeight={18} color={theme.colors.textSecondary}>
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
