import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useOrder, useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
	BIContainer,
	BIHeader,
	BIContent,
	BIInfo,
	BIContentInfo,
	BITotal,
	BIActions,
	PriceContainer
} from './styles';
import { OAlert, OButton, OIcon, OText } from '../shared';

export const BusinessItemAccordion = (props: any) => {
	const {
		cart,
		moment,
		singleBusiness,
		handleClearProducts,
		handleClickCheckout,
		checkoutButtonDisabled,
		isMultiCheckout
	} = props

	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const [{ parsePrice }] = useUtils();
	const [{ configs }] = useConfig()
	const theme = useTheme();

	const isCartPending = cart?.status === 2
	const isClosed = !cart?.valid_schedule
	const isProducts = cart?.products?.length
	const isBusinessChangeEnabled = configs?.cart_change_business_validation?.value === '1'

	const [isActive, setActiveState] = useState(!!singleBusiness)

	useEffect(() => {
		const cartsArray = Object.values(orderState?.carts)
		const cartsLength = cartsArray.filter((cart: any) => cart.products.length > 0).length ?? 0
		if (cartsLength === 1) {
			setActiveState(!isClosed)
		}
	}, [orderState?.carts, isClosed])

	const subtotalWithTaxes = cart?.taxes?.reduce((acc: any, item: any) => {
		if (item?.type === 1)
			return acc = acc + item?.summary?.tax
		return acc = acc
	}, cart?.subtotal)

	return (
		<BIContainer isClosed={isClosed} isMultiCheckout={isMultiCheckout} checkoutVisible={!isActive && !isClosed && !!isProducts && !checkoutButtonDisabled}>
			<BIHeader
				isClosed={isClosed}
				onPress={() => !isClosed ? setActiveState(!isActive) : isClosed}
				activeOpacity={1}
			>
				<BIInfo>
					<BIContentInfo>
						<OText size={16} lineHeight={24} weight={'600'}>{cart?.business?.name}</OText>
						{/* {orderState?.options?.type === 1 ? (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon
                  name='clock-outline'
                  size={24}
                />
                <OText>{convertHoursToMinutes(cart?.business?.delivery_time)}</OText>
              </View>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon
                  name='clock-outline'
                  size={24}
                />
                <OText>{convertHoursToMinutes(cart?.business?.pickup_time)}</OText>
              </View>
            )} */}
						<View style={{ flexDirection: 'row' }}>
							{props.onNavigationRedirect && !isClosed && (
								<>
									<TouchableOpacity onPress={() => props.onNavigationRedirect('Business', { store: cart?.business?.slug })}>
										<OText color={theme.colors.primary} size={12} lineHeight={18} style={{ textDecorationLine: 'underline' }}>{t('GO_TO_STORE', 'Go to store')}</OText>
									</TouchableOpacity>
								</>
							)}
							{!isCartPending && !isClosed && (
								<>
									<OText color={theme.colors.textSecondary}>{' \u2022 '}</OText>
									<OAlert
										title={t('DELETE_CART', 'Delete Cart')}
										message={t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart')}
										onAccept={() => handleClearProducts()}
									>
										<OText size={12} lineHeight={18} color={theme.colors.primary} style={{ textDecorationLine: 'underline' }}>{t('CLEAR_CART', 'Clear cart')}</OText>
									</OAlert>
								</>
							)}
							{isBusinessChangeEnabled && props.handleChangeStore && (
								<>
									<OText color={theme.colors.textSecondary}>{' \u2022 '}</OText>
									<TouchableOpacity
										onPress={props.handleChangeStore}
									>
										<OText
											size={12}
											lineHeight={18}
											color={theme.colors.primary}
											style={{ textDecorationLine: 'underline' }}
										>
											{t('CHANGE_STORE', 'Change store')}
										</OText>
									</TouchableOpacity>
								</>
							)}
						</View>
					</BIContentInfo>
				</BIInfo>

				{/* {!isClosed && !!isProducts && cart?.valid_products && cart?.total > 0 && (
          <BITotal>
            <OText color='#000'>{parsePrice(cart?.total)}</OText>
            <OText>{t('CART_TOTAL', 'Total')}</OText>
          </BITotal>
        )} */}

				{isClosed && (
					<BITotal>
						<OText color={theme.colors.red} size={12}>{t('CLOSED', 'Closed')} {moment}</OText>
					</BITotal>
				)}

				{!isClosed && !isProducts && (
					<BITotal>
						<OText>{t('NO_PRODUCTS', 'No products')}</OText>
					</BITotal>
				)}

				<BIActions>

					{!isClosed && !!isProducts && (
						<>
							<OIcon src={!isActive ? theme.images.general.drop_down : theme.images.general.drop_up} width={12} />
						</>
					)}
				</BIActions>
			</BIHeader>
			{!isActive && !isClosed && !!isProducts && !isMultiCheckout && (
				<PriceContainer>
					<OText>{parsePrice(cart?.total)}</OText>
					{cart?.valid_products && (
						<OButton
							onClick={handleClickCheckout}
							textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
							style={{ width: 180, flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
							text={t('CHECKOUT', 'Checkout')}
							bgColor={(subtotalWithTaxes < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
							borderColor={theme.colors.primary}
							isDisabled={checkoutButtonDisabled}
						/>
					)}
				</PriceContainer>
			)}

			<BIContent style={{ display: isActive ? 'flex' : 'none' }}>
				{props.children}
			</BIContent>
		</BIContainer>
	)
}
