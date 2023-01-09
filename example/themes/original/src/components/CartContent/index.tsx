import React, { useState } from 'react';
import { View } from 'react-native';
import { useLanguage, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CCContainer, CCNotCarts, CCList } from './styles';

import { Cart } from '../Cart';
import { OButton, OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';

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

	return (
		<CCContainer
			style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}
		>
			{isOrderStateCarts && carts?.length > 0 && (
				<>
					{carts.map((cart: any, i: number) => (
						<CCList key={i} style={{ overflow: 'visible' }}>
							{cart.products.length > 0 && (
								<>
									<Cart
										showGeneralBtn={i === 0 && isMultiCheckout}
										singleBusiness={props.singleBusiness}
										isFranchiseApp={props.isFranchiseApp}
										cart={cart}
										cartuuid={cart.uuid}
										onNavigationRedirect={props.onNavigationRedirect}
										isCartsLoading={isCartsLoading}
										setIsCartsLoading={setIsCartsLoading}
										isMultiCheckout={isMultiCheckout}
										hideUpselling
									/>
									<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginTop: 20 }} />
								</>
							)}
						</CCList>
					))}
				</>
			)}
			{(!carts || carts?.length === 0) && (
				<CCNotCarts>
					<OText size={24} style={{ textAlign: 'center' }}>
						{t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
					</OText>
					<OButton
						text={t('START_SHOPPING', 'Start shopping')}
						bgColor={theme.colors.primary}
						borderColor={theme.colors.primary}
						textStyle={{
							color: theme.colors.white,
							fontSize: 14,
							paddingRight: 0
						}}
						style={{ height: 35, marginVertical: 20, borderRadius: 8 }}
						imgRightSrc={null}
						onClick={() => onNavigationRedirect('BusinessList')}
					/>
				</CCNotCarts>
			)}
			<Spinner visible={isCartsLoading} />
		</CCContainer>
	)
}
