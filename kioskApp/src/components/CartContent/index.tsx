import React, { useState } from 'react';
import { useLanguage } from 'ordering-components/native';

import { CCNotCarts } from './styles';

import { Cart } from '../Cart';
import { OText } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay';
import { Cart as TypeCart } from '../../types';

export const CartContent = (props: any) => {
  const {
    cart,
    navigation,
    isOrderStateCarts,
    CustomCartComponent,
    extraPropsCustomCartComponent,
    showNotFound,
  }: Props = props

  const [, t] = useLanguage()
  const [isCartsLoading, setIsCartsLoading] = useState(false)

  const cartProps = {
    navigation,
    cart,
    onNavigationRedirect: props.onNavigationRedirect,
    isCartsLoading,
    setIsCartsLoading,
  }

  const content = (
    <>
      {(isOrderStateCarts && cart) && (
        <>
          {CustomCartComponent
            ? <CustomCartComponent
                {...cartProps}
                {...(extraPropsCustomCartComponent || {})}
              />
            : <Cart {...cartProps} />
          }
        </>
      )}
      {(!cart && showNotFound) && (
        <CCNotCarts>
          <OText size={24} style={{ textAlign: 'center' }}>
            {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
          </OText>
        </CCNotCarts>
      )}
      <Spinner visible={isCartsLoading} />
    </>
  )

  return content;
}

CartContent.defaultProps = {
  showNotFound: true
}

interface Props {
  cart: TypeCart,
  isOrderStateCarts: any,
  navigation: any,
  CustomCartComponent?: any,
  extraPropsCustomCartComponent?: JSON,
  showNotFound?: boolean,
}
