import React, { useState } from 'react';
import { useLanguage } from 'ordering-components/native';

import { CCContainer, CCNotCarts, CCList } from './styles';

import { Cart } from '../Cart';
import { OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';

export const CartContent = (props: any) => {
  const {
    carts,
    isOrderStateCarts
  } = props

  const [, t] = useLanguage()
  const [isCartsLoading, setIsCartsLoading] = useState(false)

  return (
    <CCContainer>
      {isOrderStateCarts && carts?.length > 0 && (
        <>
          <OText style={{ fontSize: 28, textAlign: 'left' }}>
            {carts.length > 1 ? t('CARTS', 'Carts') : t('CART', 'Cart')}
          </OText>
          {carts.map((cart: any) => (
            <CCList key={cart.uuid}>
              {cart.products.length > 0 &&  (
                <Cart
                  cart={cart}
                  onNavigationRedirect={props.onNavigationRedirect}
                  isCartsLoading={isCartsLoading}
                  setIsCartsLoading={setIsCartsLoading}
                />
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
        </CCNotCarts>
      )}
      <Spinner visible={isCartsLoading} />
    </CCContainer>
  )
}
