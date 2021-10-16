import React, { useEffect, useState } from 'react';
import { useLanguage, useOrder } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CCContainer, CCNotCarts, CCList } from './styles';

import { Cart } from '../Cart';
import { OIcon, OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { View } from 'react-native';

export const CartContent = (props: any) => {
	const {
		carts,
		isOrderStateCarts
	} = props

	const theme = useTheme();
	const [, t] = useLanguage()
	const [isCartsLoading, setIsCartsLoading] = useState(false)

	return (
		<CCContainer>
			{isOrderStateCarts && carts?.length > 0 && (
				<>
					<OText size={24} lineHeight={36} weight={'600'} style={{ marginBottom: 20 }}>
						{carts.length > 1 ? t('MY_CARTS', 'My Carts') : t('CART', 'Cart')}
					</OText>
					{carts.map((cart: any) => (
						<CCList key={cart.uuid} style={{ overflow: 'visible' }}>
							{cart.products.length > 0 && (
								<>
									<Cart
										cart={cart}
										onNavigationRedirect={props.onNavigationRedirect}
										isCartsLoading={isCartsLoading}
										setIsCartsLoading={setIsCartsLoading}
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
					{/* <OIcon
            url={props.icon}
            width={200}
            height={122}
          /> */}
					<OText size={24} style={{ textAlign: 'center' }}>
						{t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
					</OText>
				</CCNotCarts>
			)}
			<Spinner visible={isCartsLoading} />
		</CCContainer>
	)
}
