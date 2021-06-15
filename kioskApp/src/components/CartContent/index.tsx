import React, { useState } from 'react';
import { useLanguage } from 'ordering-components/native';

import { CCContainer, CCNotCarts } from './styles';

import { Cart } from '../Cart';
import { OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { Cart as TypeCart } from '../../types';

export const CartContent = (props: any) => {
  const {
    carts,
    navigation,
    isOrderStateCarts
  }: Props = props
  
  const [, t] = useLanguage()
  const [isCartsLoading, setIsCartsLoading] = useState(false)
  
  let cart: TypeCart | undefined;
  
  if (carts?.length > 0) {
    cart = carts?.find((item) => item.business_id == '41');
  }
  
  return (
    <CCContainer>
      {isOrderStateCarts && cart && (
        <Cart
          navigation={navigation}
          cart={cart}
          onNavigationRedirect={props.onNavigationRedirect}
          isCartsLoading={isCartsLoading}
          setIsCartsLoading={setIsCartsLoading}
        />
      )}
      {(!cart || carts?.length === 0) && (
        <CCNotCarts>
          <OText size={24} style={{ textAlign: 'center' }}>
            {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
          </OText>
        </CCNotCarts>
      )}
      <Spinner visible={isCartsLoading} />
    </CCContainer>
  )
}


interface Props {
  carts: TypeCart[], 
  isOrderStateCarts: any,
  navigation: any,
}
