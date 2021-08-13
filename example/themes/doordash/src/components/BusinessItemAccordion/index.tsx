import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useOrder, useLanguage, useUtils, useEvent } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { convertHoursToMinutes } from '../../utils';

import {
	BIContainer,
	BIHeader,
	BIContent,
	BIInfo,
	BIContentInfo,
	BITotal,
	BIActions
} from './styles';
import { OAlert, OIcon, OText } from '../shared';

export const BusinessItemAccordion = (props: any) => {
	const {
		cart,
		moment,
		handleClearProducts
	} = props
	const theme = useTheme();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const [{ parsePrice }] = useUtils();

	const isCartPending = cart?.status === 2
	const isClosed = !cart?.valid_schedule
	const isProducts = cart?.products?.length

	const [isActive, setActiveState] = useState(false)

	useEffect(() => {
		const cartsArray = Object.values(orderState?.carts)
		const cartsLength = cartsArray.filter((cart: any) => cart.products.length > 0).length ?? 0
		if ((cartsLength === 1) && !isClosed) {
			setActiveState(true)
		}
	}, [orderState?.carts])

	return (
		<BIContainer isClosed={isClosed}>
			<BIHeader
				isClosed={isClosed}
				onPress={() => !isClosed ? setActiveState(!isActive) : isClosed}
				activeOpacity={1}
			>
				<BIInfo>
					{cart?.business?.logo && (
						<OIcon
							url={cart?.business?.logo}
							width={53}
							height={53}
							style={{ borderRadius: 7.6 }}
						/>
					)}
					<BIContentInfo>
						<OText size={12} lineHeight={18}>{cart?.business?.name}</OText>
						{orderState?.options?.type === 1 ? (
							<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<OText size={10} lineHeight={15} color={theme.colors.textSecondary}>{convertHoursToMinutes(cart?.business?.delivery_time)}</OText>
							</View>
						) : (
							<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<OText>{convertHoursToMinutes(cart?.business?.pickup_time)}</OText>
							</View>
						)}
						{!isClosed && !!isProducts && cart?.valid_products && cart?.total > 0 && (
							<OText size={10} lineHeight={15}>{`${t('CART_TOTAL', 'Total')} \u2022 ${parsePrice(cart?.total)}`}</OText>
						)}
					</BIContentInfo>
				</BIInfo>


				{isClosed && (
					<BITotal>
						<OText>{t('CLOSED', 'Closed')} {moment}</OText>
					</BITotal>
				)}

				{!isClosed && !isProducts && (
					<BITotal>
						<OText>{t('NO_PRODUCTS', 'No products')}</OText>
					</BITotal>
				)}

				<BIActions>
					{props.onNavigationRedirect && !isClosed && (
						<TouchableOpacity onPress={() => props.onNavigationRedirect('Business', { store: cart?.business?.slug })} style={{ paddingLeft: 4, paddingRight: 4 }}>
							<OIcon
								src={theme.images.general.home}
								width={16}
								color={theme.colors.textPrimary}
							/>
						</TouchableOpacity>
					)}
					{!isClosed && !!isProducts && (
						<>
							{!isCartPending && (
								<OAlert
									title={t('DELETE_CART', 'Delete Cart')}
									message={t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart')}
									onAccept={() => handleClearProducts()}
								>
									<OIcon
										src={theme.images.general.trash}
										width={16}
										color={theme.colors.textPrimary}
										style={{ marginLeft: 4, marginRight: 4 }}
									/>
								</OAlert>
							)}
							{/* <MaterialCommunityIcon name='chevron-down' size={20} /> */}
						</>
					)}
				</BIActions>
			</BIHeader>

			<BIContent style={{ display: isActive ? 'flex' : 'none' }}>
				{props.children}
			</BIContent>
		</BIContainer>
	)
}
