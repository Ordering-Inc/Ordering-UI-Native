import React, { useState } from 'react'
import {
	OrderTypeControl,
	useLanguage,
	useOrder,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { StyleSheet, Platform } from 'react-native'
import { OrderTypeWrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'
import RNPickerSelect from 'react-native-picker-select'
import { OIcon } from '../shared'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
	const {
		handleChangeOrderType,
		typeSelected,
		defaultValue,
		configTypes,
		orderTypes
	} = props

	const theme = useTheme();

	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			color: theme.colors.textSecondary,
			height: 26,
			borderRadius: 7.6,
			backgroundColor: theme.colors.backgroundGray100,
			fontSize: 12,
			paddingStart: 10,
			paddingRight: 24,
			paddingBottom: 2,
			paddingTop: 0
		},
		inputIOS: {
			color: theme.colors.textSecondary,
			paddingEnd: 24,
			height: 26,
			borderRadius: 7.6,
			paddingStart: 10,
			backgroundColor: theme.colors.backgroundGray100,
			fontSize: 12
		},
		placeholder: {
			color: theme.colors.secundaryContrast
		}
	})

	const [orderState] = useOrder()
	const [open, setOpen] = useState(false)

	const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

	const items = _orderTypes.map((type) => {
		return {
			value: type.value,
			label: type.content,
			inputLabel: type.content
		}
	})

	const handleChangeOrderTypeCallback = (orderType: number) => {
		if (!orderState.loading) {
			handleChangeOrderType(orderType)
		}
	}

	return (
		typeSelected !== undefined && (
			<OrderTypeWrapper>
				<RNPickerSelect
					onValueChange={(orderType) => handleChangeOrderTypeCallback(orderType)}
					items={items}
					placeholder={{}}
					style={pickerStyle}
					value={defaultValue || typeSelected}
					onOpen={() => setOpen(true)}
					onClose={() => setOpen(false)}
					useNativeAndroidPickerStyle={false}
					disabled={orderState.loading && !open}
					Icon={() => <OIcon src={theme.images.general.arrow_down} width={10} style={{ marginRight: 10 }} />}
				/>
			</OrderTypeWrapper>
		)
	)
}

export const OrderTypeSelector = (props: any) => {
	const [, t] = useLanguage()

	const orderTypeProps = {
		...props,
		UIComponent: OrderTypeSelectorUI,
		orderTypes: props.orderType || [
			{
				value: 1,
				content: t('DELIVERY', 'Delivery')
			},
			{
				value: 2,
				content: t('PICKUP', 'Pickup')
			},
			{
				value: 3,
				content: t('EAT_IN', 'Eat in')
			},
			{
				value: 4,
				content: t('CURBSIDE', 'Curbside')
			},
			{
				value: 5,
				content: t('DRIVE_THRU', 'Drive thru')
			}
		]
	}

	return <OrderTypeControl {...orderTypeProps} />
}
