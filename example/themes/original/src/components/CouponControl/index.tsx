import React, { useEffect } from 'react';
import { StyleSheet, Alert, Text } from 'react-native';
import { CouponControl as CouponController, useLanguage, useEvent } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
	CContainer,
	CCWrapper,
	CCButton
} from './styles';

import { OInput, OButton, OAlert, OText } from '../shared';

const CouponControlUI = (props: any) => {
	const {
		couponDefault,
		couponInput,
		handleButtonApplyClick,
		handleRemoveCouponClick,
		onChangeInputCoupon,
		confirm,
		setConfirm,
		cart
	} = props

	const [, t] = useLanguage()
	const theme = useTheme();
	const [events] = useEvent()

	const styles = StyleSheet.create({
		inputsStyle: {
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			flex: 1,
			marginRight: 20,
			height: 44
		},
	});

	const handleOnAccept = () => {
		if (!confirm.error) {
			handleRemoveCouponClick && handleRemoveCouponClick()
		}
		onChangeInputCoupon('')
	}

	const cleanSetConfirm = () => {
		setConfirm({ ...confirm, open: false, error: false })
	}

	const onButtonApplyClick = () => {
		events.emit('coupon_entered', { ...cart, coupon: couponInput })
		handleButtonApplyClick()
	}

	useEffect(() => {
		if (confirm.content) {
			Alert.alert(
				t('COUPON_ERROR', 'Coupon Error'),
				confirm.content[0],
				[
					{
						text: t('CANCEL', 'cancel'),
						onPress: () => cleanSetConfirm(),
						style: 'cancel'
					},
					{
						text: t('ACCEPT', 'Accept'),
						onPress: () => cleanSetConfirm()
					}
				],
				{ cancelable: false }
			)
		}
	}, [confirm])

	return (
		<CContainer>
			{couponDefault ? (
				<OAlert
					title={t('REMOVE_COUPON', 'Remove Coupon')}
					message={t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')}
					onAccept={() => handleOnAccept()}
				>
					<CCButton>
						<OText
							size={12}
							color={theme.colors.white}
							style={{ textAlign: 'center' }}
						>
							{`${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`}
						</OText>
					</CCButton>
				</OAlert>
			) : (
				<CCWrapper>
					<OInput
						value={couponInput}
						placeholder={t('DISCOUNT_COUPON', 'Discount coupon')}
						onChange={(e: any) => onChangeInputCoupon(e)}
						style={styles.inputsStyle}
						inputStyle={{ fontSize: 12 }}
					/>
					<OButton
						onClick={() => onButtonApplyClick()}
						textStyle={{ fontSize: 12 }}
						imgRightSrc={null}
						text={t('APPLY', 'Apply')}
						isDisabled={!couponInput}
						style={{ borderRadius: 7.6, height: 44, shadowOpacity: 0 }}
					/>
				</CCWrapper>
			)}
		</CContainer>
	)
}

export const CouponControl = (props: any) => {
	const couponProp = {
		...props,
		UIComponent: CouponControlUI
	}
	return (
		<CouponController {...couponProp} />
	)
}
