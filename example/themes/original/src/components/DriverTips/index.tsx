import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
	DriverTips as DriverTipsController,
	useUtils,
	useLanguage,
	useConfig,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OButton, OInput, OText } from '../shared';

import {
	DTContainer,
	DTCard,
	DTWrapperTips,
	DTForm,
	DTLabel,
	DTWrapperInput
} from './styles'

const DriverTipsUI = (props: any) => {
	const {
		driverTip,
		driverTipsOptions,
		optionSelected,
		cart,
		isDriverTipUseCustom,
		handlerChangeOption,
		isFixedPrice
	} = props;

	const [{ parsePrice }] = useUtils();
	const theme = useTheme();
	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [customTip, setCustomTip] = useState((isDriverTipUseCustom && !driverTipsOptions.includes(driverTip)) ?? false)
	const currentTip = customTip ? parseFloat(driverTip || 0) > 0 : (!customTip && !driverTipsOptions.includes(driverTip) && parseFloat(driverTip || 0)) > 0
	const [value, setvalue] = useState('');

	const style = StyleSheet.create({
		semicircle: {
			borderRadius: 8
		},
		inputStyle: {
			flex: 1,
			borderRadius: 5,
			borderWidth: 1,
			borderColor: theme.colors.inputDisabled,
			marginRight: 10,
			height: 50
		}
	})

	const placeholderCurrency = !isFixedPrice ? `0%` : (configs?.currency_position?.value || 'left') === 'left'
		? `${configs?.format_number_currency?.value}0`
		: `0${configs?.format_number_currency?.value}`

	const handleChangeDriverTip = (val: any) => {
		const tip = Number(val)
		if ((isNaN(tip) || tip < 0)) {
			setvalue(value)
			return
		}
		setvalue(val)
	}

	return (
		<DTContainer>
			<DTLabel>
				{t('CUSTOM_DRIVER_TIP_MESSAGE', '100% of these tips go directly to your driver')}
			</DTLabel>
			<DTWrapperTips>
				{driverTipsOptions.map((option: any, i: number) => (
					<TouchableOpacity
						key={i}
						onPress={() => {
							handlerChangeOption(option)
							setCustomTip(false)
						}}
					>
						<DTCard
							style={style.semicircle}
							isActive={(option === driverTip && !customTip)}
						>
							<OText size={12} numberOfLines={2} color={(option === driverTip && !customTip) ? '#FFF' : theme.colors.textSecondary}>
								{`${isFixedPrice ? parsePrice(option) : `${option}%`}`}
							</OText>
						</DTCard>
					</TouchableOpacity>
				))}
				{isDriverTipUseCustom && (
					<TouchableOpacity
						onPress={() => setCustomTip(true)}
					>
						<DTCard
							style={style.semicircle}
							isActive={customTip}
						>
							<OText size={12} numberOfLines={2} color={customTip ? '#FFF' : theme.colors.textSecondary}>
								{t('CUSTOM_TIP', 'Custom')}
							</OText>
						</DTCard>
					</TouchableOpacity>
				)}
			</DTWrapperTips>
			{customTip && (
				<DTForm>
					<DTWrapperInput>
						<OInput
							placeholder={placeholderCurrency}
							style={style.inputStyle}
							value={value}
							type={'numeric'}
							onChange={handleChangeDriverTip}
							autoCapitalize='none'
							autoCorrect={false}
						/>
						<OButton
							text={t('APPLY_TIP', 'Apply Tip')}
							bgColor={theme.colors.primary}
							borderColor={theme.colors.primary}
							textStyle={{ color: 'white', fontSize: 14 }}
							imgRightSrc={null}
							style={{ borderRadius: 5, height: 44 }}
							isDisabled={parseFloat(value || '0') < 0 || parseFloat(value || '0') === driverTip || value === ''}
							onClick={() => {
								handlerChangeOption(value)
								setvalue('')
							}}
						/>
					</DTWrapperInput>
				</DTForm>
			)}
			{currentTip && (
				<OText
					color={theme.colors.primary}
					size={16}
					style={{ marginTop: 10, textAlign: 'center' }}
				>
					{t('CURRENT_DRIVER_TIP_AMOUNT', 'Current driver tip amount')}{!isFixedPrice &&
						` (${driverTip}%)`}: {isFixedPrice ? parsePrice(driverTip) : parsePrice(cart?.driver_tip)}
				</OText>
			)}
		</DTContainer>
	)
}


export const DriverTips = (props: any) => {
	const driverTipsProps = {
		...props,
		UIComponent: DriverTipsUI
	}

	return <DriverTipsController {...driverTipsProps} />
}
