import React, { useEffect, useState } from 'react'
import {
	OrderTypeControl,
	useLanguage,
	useOrder,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { Platform, View } from 'react-native'
import { BgImage, ListWrapper, MaskCont, OrderTypeWrapper, Wrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { OIcon, OText } from '../shared'
import NavBar from '../NavBar';
import { ORDER_TYPES } from '../../config/constants';

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
	const {
		navigation,
		handleChangeOrderType,
		typeSelected,
		defaultValue,
		configTypes,
		orderTypes
	} = props

	const theme = useTheme();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
  const [isTypeChanging, setTypeChanging] = useState(false);
	const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value));
	
	const items = _orderTypes.map((type) => {
		return {
			value: type.value,
			label: type.content,
			description: type.description
		}
	})

	const goToBack = () => !orderState?.loading && navigation?.canGoBack() && navigation.goBack();

	const handleChangeOrderTypeCallback = (orderType: number) => {
		if (!orderState.loading) {
			handleChangeOrderType(orderType)
      setTypeChanging(true)
		}
	}

  useEffect(() => {
    if (isTypeChanging && !orderState.loading) {
      typeSelected === orderState?.options?.type && goToBack()
    }
  }, [orderState, typeSelected]);

	return (
		<Wrapper>
			<NavBar
				onActionLeft={() => goToBack()}
				btnStyle={{ paddingLeft: 0 }}
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
					items.map((item: any, idx: number) => 
						<OrderTypeWrapper key={idx} disabled={orderState.loading} onPress={() => handleChangeOrderTypeCallback(item.value)}>
							<BgImage source={theme.images.orderTypes[`type${item?.value || 1}`]} resizeMode={'cover'} style={{opacity: item?.value == typeSelected || typeSelected === undefined ? 1 : 0.4}}>
								<MaskCont>
									<OText size={12} lineHeight={18} color={theme.colors.white} weight={Platform.OS === 'android' ? 'bold' : '600'}>{item?.label}</OText>
									<OText size={10} lineHeight={15} color={theme.colors.white}>{item?.description}</OText>
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<OText size={10} lineHeight={15} color={theme.colors.white}>{t('START_MY_ORDER', 'Start my order')}</OText>
										<OIcon src={theme.images.general.arrow_left} width={16} color={theme.colors.white} style={{transform: [{ rotate: '180deg' }], marginStart: 4}} />
									</View>
								</MaskCont>
							</BgImage>
						</OrderTypeWrapper>
					)
				}
				</ListWrapper>
				)
			}
		</Wrapper>
	)
}

export const OrderTypeSelector = (props: any) => {
  const [, t] = useLanguage()
	const orderTypeProps = {
		...props,
		UIComponent: OrderTypeSelectorUI,
		orderTypes: props.orderTypes || [
      {
        value: 1,
        content: t('DELIVERY', 'Delivery'),
        description: t('ORDERTYPE_DESCRIPTION_DELIVERY', 'Delivery description')
      },
      {
        value: 2,
        content: t('PICKUP', 'Pickup'),
        description: t('ORDERTYPE_DESCRIPTION_PICKUP', 'Pickup description')
      },
      {
        value: 3,
        content: t('EAT_IN', 'Eat in'),
        description: t('ORDERTYPE_DESCRIPTION_EATIN', 'Eat in description')
      },
      {
        value: 4,
        content: t('CURBSIDE', 'Curbside'),
        description: t('ORDERTYPE_DESCRIPTION_CURBSIDE', 'Curbside description')
      },
      {
        value: 5,
        content: t('DRIVE_THRU', 'Drive thru'),
        description: t('ORDERTYPE_DESCRIPTION_DRIVETHRU', 'Drive Thru description')
      }
    ]
	}

	return <OrderTypeControl {...orderTypeProps} />
}
