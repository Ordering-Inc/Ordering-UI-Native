import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useOrder, useLanguage, useUtils, useEvent } from 'ordering-components/native';
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
    isCartsLoading,
    handleClearProducts
  } = props

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
      >
        <BIInfo>
          {cart?.business?.logo && (
            <OIcon
              url={cart?.business?.logo}
              width={70}
              height={70}
              style={{ borderRadius: 16 }}
            />
          )}
          <BIContentInfo>
            <OText>{cart?.business?.name}</OText>
            {orderState?.options?.type === 1 ? (
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
            )}
          </BIContentInfo>
        </BIInfo>

        {!isClosed && !!isProducts && (
          <BITotal>
            {cart?.valid_products && cart?.total > 0 && (
              <OText color='#000'>{parsePrice(cart?.total)}</OText>
            )}
            <OText>{t('CART_TOTAL', 'Total')}</OText>
          </BITotal>
        )}

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
          {props.onNavigationRedirect && (
            <MaterialCommunityIcon
              name='store'
              size={26}
              color='#CCC'
              onPress={() => props.onNavigationRedirect('Business', { store: cart?.business?.slug })}
            />
          )}
          {!isClosed && !!isProducts && (
            <>
              {!isCartPending && (
                <OAlert
                  title={t('DELETE_CART', 'Delete Cart')}
                  message={t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart')}
                  onAccept={() => handleClearProducts()}
                >
                  <MaterialCommunityIcon
                    name='trash-can-outline'
                    size={26}
                    color='#D81212'
                  />
                </OAlert>
              )}
              <MaterialCommunityIcon name='chevron-down' size={20} />
            </>
          )}
        </BIActions>
      </BIHeader>

      <BIContent style={{ display: isActive ? 'flex' : 'none' }}>
        {props.children}
      </BIContent>
      <Spinner visible={isCartsLoading} />
    </BIContainer>
  )
}
