import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useLanguage, useConfig, useUtils, useOrder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CCContainer, CCNotCarts, CCList, CheckoutAction, ChCartsTotal } from './styles';

import { Cart } from '../Cart';
import { OButton, OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { NotFoundSource } from '../NotFoundSource';

export const CartContent = (props: any) => {
	const {
		onNavigationRedirect,
		singleBusiness,
		businessSlug
	} = props

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const [{ parsePrice }] = useUtils();
	const [isCartsLoading, setIsCartsLoading] = useState(false)
	const [cartsOpened, setCartsOpened] = useState([])
	const [{ carts: cartsContext }] = useOrder();
	const cartsList =
		(cartsContext &&
			Object.values(cartsContext).filter((cart: any) => cart.products.length > 0)) ??
		[];
	const carts = businessSlug
		? cartsList.filter((cart: any) => cart?.business?.slug === businessSlug || parseInt(businessSlug) === cart?.business_id)
		: cartsList
	const isOrderStateCarts = !!carts
	const isMultiCheckout = configs?.checkout_multi_business_enabled?.value === '1'
	const cartsAvailable: any = Object.values(carts || {})?.filter((cart: any) => cart?.valid && cart?.status !== 2)
	const totalCartsPrice = cartsAvailable?.length && cartsAvailable.reduce((total: any, cart: any) => { return total + cart?.total }, 0)
	const totalCartsFee = cartsAvailable?.length && cartsAvailable
		?.filter((cart: any) => cart?.status !== 1 && cart?.valid && cart?.products?.length)
		?.reduce((total: any, cart: any) => { return total + (cart?.delivery_price_with_discount) }, 0)
	const handleCheckoutRedirect = () => {
		if (cartsAvailable.length === 1) {
			onNavigationRedirect('CheckoutNavigator', {
				screen: 'CheckoutPage',
				cartUuid: cartsAvailable[0]?.uuid,
				businessLogo: cartsAvailable[0]?.business?.logo,
				businessName: cartsAvailable[0]?.business?.name,
				cartTotal: cartsAvailable[0]?.total
			})
		} else {
			const groupKeys: any = {}
			cartsAvailable.forEach((_cart: any) => {
				groupKeys[_cart?.group?.uuid]
					? groupKeys[_cart?.group?.uuid] += 1
					: groupKeys[_cart?.group?.uuid ?? 'null'] = 1
			})

			if (
				(Object.keys(groupKeys).length === 1 && Object.keys(groupKeys)[0] === 'null') ||
				Object.keys(groupKeys).length > 1
			) {
				onNavigationRedirect('CheckoutNavigator', {
					screen: 'MultiCheckout',
					checkCarts: true
				})
			} else {
				onNavigationRedirect('CheckoutNavigator', {
					screen: 'MultiCheckout',
					cartUuid: cartsAvailable[0]?.group?.uuid
				})
			}
		}
	}

	const changeActiveState = useCallback((isClosed : boolean, uuid : string) => {
		const isActive = cartsOpened?.includes?.(uuid) || !!singleBusiness
		if (isActive || !isClosed) {
			setCartsOpened(cartsOpened?.filter?.((_uuid) => _uuid !== uuid))
		} else {
			setCartsOpened([
				...cartsOpened,
				uuid
			])
		}
	}, [cartsOpened])

	return (
		<CCContainer
			style={{ paddingHorizontal: 20 }}
		>
			{isOrderStateCarts && carts?.length > 0 && (
				<>
					{carts.map((cart: any, i: number) => (
						<CCList nestedScrollEnabled={true} key={i} style={{ overflow: 'visible' }}>
							{cart.products.length > 0 && (
								<>
									<Cart
										singleBusiness={props.singleBusiness}
										isFranchiseApp={props.isFranchiseApp}
										cart={cart}
										cartuuid={cart.uuid}
										onNavigationRedirect={props.onNavigationRedirect}
										isCartsLoading={isCartsLoading}
										setIsCartsLoading={setIsCartsLoading}
										isMultiCheckout={isMultiCheckout}
										hideUpselling
										businessConfigs={cart?.business?.configs}
										hideCouponInput={configs?.multi_business_checkout_coupon_input_style?.value === 'group'}
										hideDeliveryFee={configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1'}
										hideDriverTip={configs?.multi_business_checkout_show_combined_driver_tip?.value === '1'}
										cartsOpened={cartsOpened}
										setCartsOpened={setCartsOpened}
										changeActiveState={changeActiveState}
										isActive={cartsOpened?.includes?.(cart?.uuid) || !!singleBusiness}
									/>
									<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginTop: 20 }} />
								</>
							)}
						</CCList>
					))}
					{isMultiCheckout && (
						<>
							{!!cartsAvailable.length && (
								<ChCartsTotal>
									{!!totalCartsFee && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1' && (
										<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
											<OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
												{t('TOTAL_DELIVERY_FEE', 'Total delivery fee')}
											</OText>
											<OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
												{parsePrice(totalCartsFee)}
											</OText>
										</View>
									)}
									{cartsAvailable.reduce((sum: any, cart: any) => sum + cart?.driver_tip, 0) > 0 &&
										configs?.multi_business_checkout_show_combined_driver_tip?.value === '1' && (
											<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
												<OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
													{t('DRIVER_TIP', 'Driver tip')}
												</OText>
												<OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
													{parsePrice(cartsAvailable.reduce((sum: any, cart: any) => sum + cart?.driver_tip, 0))}
												</OText>
											</View>
										)}
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
											{t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}
										</OText>
										<OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>{parsePrice(totalCartsPrice)}</OText>
									</View>
									<View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
										<OText size={14} color={theme.colors.textNormal} weight={'300'} style={{ textAlign: 'center' }}>
											{t('CART_GROUP_MESSAGE_ALERT', 'Discounts may be applied at the time of payment for this group.')}
										</OText>
									</View>
								</ChCartsTotal>
							)}
							<CheckoutAction style={{ marginTop: 0 }}>
								<OButton
									text={t('CHECKOUT', 'Checkout')}
									bgColor={!cartsAvailable.length ? theme.colors.secundary : theme.colors.primary}
									isDisabled={!cartsAvailable.length}
									borderColor={theme.colors.primary}
									imgRightSrc={null}
									textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
									onClick={() => handleCheckoutRedirect()}
									style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
								/>
							</CheckoutAction>
						</>
					)}
				</>
			)}
			{(!carts || carts?.length === 0) && (
				<CCNotCarts>
					<NotFoundSource
						hideImage
						btnStyle={{ borderRadius: 8 }}
						content={t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
						btnTitle={t('START_SHOPPING', 'Start shopping')}
						onClickButton={() => singleBusiness ? onNavigationRedirect('Business') : onNavigationRedirect('BusinessList')}
					/>
				</CCNotCarts>
			)}
			<Spinner visible={isCartsLoading} />
		</CCContainer>
	)
}
