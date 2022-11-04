import React, { useEffect } from 'react'
import {
	OrderTypeControl,
	useLanguage,
	useOrder,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { Platform, View } from 'react-native'
import { BgImage, ListWrapper, MaskCont, OrderTypeWrapper, OTab, OTabs, TabBtn, Wrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { OIcon, OText } from '../shared'
import NavBar from '../NavBar';
import { ORDER_TYPES } from '../../config/constants';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
	const {
		navigation,
		handleChangeOrderType,
		handleChangeType,
		typeSelected,
		defaultValue,
		configTypes,
		orderTypes,
		setOrderTypeValue,
		isChewLayout,
		chewOrderTypes
	} = props

	const theme = useTheme();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value));

	const items = _orderTypes.map((type) => {
		return {
			value: type.value,
			label: t(type.content, type.content),
			description: t(type.description, 'Lorem ipsum dolor sit amet, consectetur.')
		}
	})

	const goToBack = () => !orderState?.loading && navigation?.canGoBack() && navigation.goBack();

	const handleChangeOrderTypeCallback = (orderType: number) => {
		if (!orderState.loading) {
			setOrderTypeValue && setOrderTypeValue(orderType)
			handleChangeOrderType(orderType)
			if (!isChewLayout) {
				goToBack();
			}
		}
	}

	useEffect(() => {
		handleChangeType && handleChangeType(typeSelected)
	}, [typeSelected])

	return (
		<Wrapper>
			{isChewLayout ? (
				<View>
					<OTabs
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						{chewOrderTypes?.map((type: any) => (
							<TabBtn
								key={type.value}
								onPress={() => handleChangeOrderTypeCallback(type.value)}
							>
								<OTab
									style={{
										borderBottomColor:
											type.value === typeSelected
												? theme.colors.textNormal
												: theme.colors.border,
									}}>
									<OText
										size={14}
										color={
											type.value === typeSelected
												? theme.colors.textNormal
												: theme.colors.disabled
										}
										weight={type.value === typeSelected ? 'bold' : 'normal'}>
										{type.name}
									</OText>
								</OTab>
							</TabBtn>
						))}
					</OTabs>
				</View>
			) : (
				<>
					<NavBar
						onActionLeft={() => goToBack()}
						btnStyle={{ paddingLeft: 0, width: 50 }}
						paddingTop={0}
						style={{ paddingBottom: 0 }}
						title={t('HOW_WILL_YOU_DELIVERY_TYPE', 'How will your order type?')}
						titleAlign={'center'}
						titleStyle={{ fontSize: 14 }}
					/>
					{
						items.length > 0 && (
							<ListWrapper>
								{
									items && items.map((item: any, idx: number) =>
										<OrderTypeWrapper activeOpacity={0.8} key={idx} disabled={orderState.loading} onPress={() => handleChangeOrderTypeCallback(item.value)}>
											<BgImage source={theme.images.orderTypes[`type${item?.value || 1}`]} resizeMode={'cover'} style={{ opacity: item?.value == typeSelected || typeSelected === undefined ? 1 : 0.4 }}>
												<MaskCont>
													<OText size={12} lineHeight={18} color={theme.colors.white} weight={Platform.OS === 'android' ? 'bold' : '600'}>{item?.label}</OText>
													<OText size={10} lineHeight={15} color={theme.colors.white}>{item?.description}</OText>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<OText size={10} lineHeight={15} color={theme.colors.white}>{t('START_MY_ORDER', 'Start my order')}</OText>
														<AntDesignIcon name='arrowleft' size={26} color={theme.colors.white} style={{ transform: [{ rotate: '180deg' }], marginStart: 4 }} />
													</View>
												</MaskCont>
											</BgImage>
										</OrderTypeWrapper>
									)
								}
							</ListWrapper>
						)
					}
				</>
			)}

		</Wrapper>
	)
}

export const OrderTypeSelector = (props: any) => {

	const orderTypeProps = {
		...props,
		UIComponent: OrderTypeSelectorUI,
		orderTypes: props.orderTypes || ORDER_TYPES
	}

	return <OrderTypeControl {...orderTypeProps} />
}
