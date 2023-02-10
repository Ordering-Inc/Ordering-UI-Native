import React, { useState } from 'react';
import { View } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CCContainer, CCNotCarts, CCList, CheckoutAction } from './styles';

import { Cart } from '../Cart';
import { OButton, OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { NotFoundSource } from '../NotFoundSource';

export const CartContent = (props: any) => {
	const {
		carts,
		isOrderStateCarts,
		onNavigationRedirect
	} = props

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const [isCartsLoading, setIsCartsLoading] = useState(false)

	const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
	const isMultiCheckout = configs?.checkout_multi_business_enabled?.value === '1'
	const cartsAvailable: any = Object.values(carts)?.filter((cart: any) => cart?.valid && cart?.status !== 2)

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

	return (
		<CCContainer
			style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}
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
									/>
									<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginTop: 20 }} />
								</>
							)}
						</CCList>
					))}
					{isMultiCheckout && (
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
						onClickButton={() => onNavigationRedirect('BusinessList')}
					/>
				</CCNotCarts>
			)}
			<Spinner visible={isCartsLoading} />
		</CCContainer>
	)
}
