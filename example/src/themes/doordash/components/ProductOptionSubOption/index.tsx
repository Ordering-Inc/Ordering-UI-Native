import React, { useState, useEffect } from 'react'
import {
	useUtils,
	useLanguage,
	ProductOptionSuboption as ProductSubOptionController
} from 'ordering-components/native'
import { StyleSheet, I18nManager, TextStyle } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
	Container,
	IconControl,
	QuantityControl,
	Checkbox,
	PositionControl,
	Circle
} from './styles'
import { colors, labels, images } from '../../theme.json'
import { OIcon, OText } from '../../../../components/shared'

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
		disabled
	} = props

	const [, t] = useLanguage()
	const [{ parsePrice }] = useUtils()
	const [showMessage, setShowMessage] = useState(false)

	const handleSuboptionClick = () => {
		toggleSelect()
		if (balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1)) {
			setShowMessage(true)
		}
	}

	useEffect(() => {
		if (!(balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))) {
			setShowMessage(false)
		}
	}, [balance])

	const disableIncrement = option?.limit_suboptions_by_max ? balance === option?.max : state.quantity === suboption?.max || (!state.selected && balance === option?.max)
	const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price

	return (
		<Container disabled={disabled}>
			<IconControl onPress={() => handleSuboptionClick()}>
				{((option?.min === 0 && option?.max === 1) || option?.max > 1) ? (
					<OIcon src={state?.selected ? images.general.check_act : images.general.check_nor} width={16} color={colors.textPrimary} />
				) : (
					<OIcon src={state?.selected ? images.general.radio_act : images.general.radio_nor} width={16} color={colors.textPrimary} />
				)}
				<OText mLeft={10} style={[{ flex: I18nManager.isRTL ? 0 : 1 }, labels.normal] as TextStyle}>
					{suboption?.name}
				</OText>
			</IconControl>
			{showMessage && <OText mLeft={10} mRight={10} style={{ flex: 1, textAlign: 'center' }} color={colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
			{option?.allow_suboption_quantity && (
				<QuantityControl>
					<Checkbox disabled={state.quantity === 0} onPress={decrement}>
						<MaterialCommunityIcon
							name='minus-circle-outline'
							size={24}
							color={state.quantity === 0 ? colors.backgroundDark : colors.primary}
						/>
					</Checkbox>
					<OText mLeft={5} mRight={5}>
						{state.quantity}
					</OText>
					<Checkbox disabled={disableIncrement} onPress={increment}>
						<MaterialCommunityIcon
							name='plus-circle-outline'
							size={24}
							color={disableIncrement ? colors.backgroundDark : colors.primary}
						/>
					</Checkbox>
				</QuantityControl>
			)}
			{option?.with_half_option && (
				<PositionControl>
					<Circle onPress={() => changePosition('left')}>
						<MaterialCommunityIcon
							name='circle-half-full'
							color={state.selected && state.position === 'left' ? colors.primary : '#cbcbcb'}
							size={24}
							style={styles.inverse}
						/>
					</Circle>
					<Circle onPress={() => changePosition('whole')}>
						<MaterialCommunityIcon
							name='checkbox-blank-circle'
							color={state.selected && state.position === 'whole' ? colors.primary : '#cbcbcb'}
							size={24}
						/>
					</Circle>
					<Circle onPress={() => changePosition('right')}>
						<MaterialCommunityIcon
							name='circle-half-full'
							color={state.selected && state.position === 'right' ? colors.primary : '#cbcbcb'}
							size={24}
						/>
					</Circle>
				</PositionControl>
			)
			}
			<OText style={labels.normal as TextStyle} color={colors.textSecondary}>
				+{parsePrice(price)}
			</OText>
		</Container>
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
		UIComponent: ProductOptionSubOptionUI
	}

	return (
		<ProductSubOptionController {...productOptionSubOptionProps} />
	)
}
