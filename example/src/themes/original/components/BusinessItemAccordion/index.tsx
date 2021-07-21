import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useOrder, useLanguage, useUtils, useEvent } from 'ordering-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { convertHoursToMinutes } from '../../../../utils';

import {
  BIContainer,
  BIHeader,
  BIContent,
  BIInfo,
  BIContentInfo,
  BITotal,
  BIActions
} from './styles';
import { OAlert, OIcon, OText } from '../../../../components/shared';
import { colors, images } from '../../theme.json';

export const BusinessItemAccordion = (props: any) => {
  const {
    cart,
    moment,
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
				<View style={{flexDirection: 'row'}}>
					{props.onNavigationRedirect && !isClosed && (
						<>
						<TouchableOpacity onPress={() => props.onNavigationRedirect('Business', { store: cart?.business?.slug })}>
							<OText color={colors.primary} size={12} lineHeight={18} style={{textDecorationLine: 'underline'}}>{t('GO_TO_STORE', 'Go to store')}</OText>
						</TouchableOpacity>
						<OText color={colors.textSecondary}>{' \u2022 '}</OText>
						</>
					)}
					{!isCartPending && !isClosed && (
						<OAlert
							title={t('DELETE_CART', 'Delete Cart')}
							message={t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart')}
							onAccept={() => handleClearProducts()}
						>
							<OText size={12} lineHeight={18} color={colors.red} style={{textDecorationLine: 'underline'}}>{t('CLEAR_CART', 'Clear cart')}</OText>
						</OAlert>
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
            <OText color={colors.red} size={12}>{t('CLOSED', 'Closed')} {moment}</OText>
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
              <OIcon src={!isActive ? images.general.drop_down : images.general.drop_up} width={12} />
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
