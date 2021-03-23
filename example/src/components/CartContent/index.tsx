import React, { useEffect, useState } from 'react';
import { useLanguage } from 'ordering-components/native';

import { CCContainer, CCNotCarts, CCList } from './styles';

import { Cart } from '../Cart';
import { OIcon, OText } from '../shared';

export const CartContent = (props: any) => {
  const {
    carts,
    isOrderStateCarts
  } = props

  const [, t] = useLanguage()

  return (
    <CCContainer>
      {isOrderStateCarts && carts?.length > 0 && (
        <>
          <OText style={{ fontSize: 28 }}>
            {carts.length > 1 ? t('CARTS', 'Carts') : t('CART', 'Cart')}
          </OText>
          {carts.map((cart: any) => (
            <CCList key={cart.uuid}>
              {cart.products.length > 0 &&  (
                <Cart
                  cart={cart}
                  onNavigationRedirect={props.onNavigationRedirect}
                />
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
          <OText>
            {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
          </OText>
        </CCNotCarts>
      )}
    </CCContainer>
  )
}
