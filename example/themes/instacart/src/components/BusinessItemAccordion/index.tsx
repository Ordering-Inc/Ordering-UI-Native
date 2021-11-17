import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useOrder, useLanguage, useUtils } from 'ordering-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    handleClearProducts,
	 isExpanded
  } = props

  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{ parsePrice }] = useUtils();

  const isCartPending = cart?.status === 2
  const isClosed = !cart?.valid_schedule
  const isProducts = cart?.products?.length

  const [isActive, setActiveState] = useState(isExpanded)

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
        isExpanded={isActive}
        onPress={() => isExpanded ? {} : !isClosed ? setActiveState(!isActive) : isClosed}
        activeOpacity={1}
      >
        <BIInfo>
          {cart?.business?.logo && (
            <OIcon
              url={cart?.business?.logo}
              width={42}
              height={42}
              style={{ borderRadius: 22, borderColor: '#E9ECEF', borderWidth: 1 }}
            />
          )}
          <BIContentInfo>
            <OText style={{marginBottom: 2}}>{cart?.business?.name}</OText>
            {/* {orderState?.options?.type === 1 ? (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon
                  name='clock-outline'
                  size={14}
                  color={'gray'}
                  style={{marginEnd: 4}}
                />
                <OText size={12}>{convertHoursToMinutes(cart?.business?.delivery_time)}</OText>
              </View>
            ) : (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcon
                  name='clock-outline'
                  size={14}
                />
                <OText>{convertHoursToMinutes(cart?.business?.pickup_time)}</OText>
              </View>
            )} */}
          </BIContentInfo>
        </BIInfo>

        {!isClosed && !!isProducts && cart?.valid_products && cart?.total > 0 && (
          <BITotal>
            <OText weight={'bold'} color='#000'>{parsePrice(cart?.total)}</OText>
            {/* {!isActive && <MaterialCommunityIcon name='chevron-down' size={20} />} */}
          </BITotal>
        )}

        {isClosed && (
          <BITotal>
            <OText size={12}>{t('CLOSED', 'Closed')} {moment}</OText>
          </BITotal>
        )}

        {!isClosed && !isProducts && (
          <BITotal>
            <OText size={12}>{t('NO_PRODUCTS', 'No products')}</OText>
          </BITotal>
        )}

      </BIHeader>

      <BIContent style={{ display: isActive ? 'flex' : 'none' }}>
        {props.children}
      </BIContent>
    </BIContainer>
  )
}
