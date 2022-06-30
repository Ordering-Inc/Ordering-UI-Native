import React, { useEffect, useState } from 'react';
import { useCartBottomSheet } from '../../providers/CartBottomSheetProvider';

import { Cart } from '../Cart';
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
    clearInactivityTimeout,
    resetInactivityTimeout,
  }: Props = props

  const [isCartsLoading, setIsCartsLoading] = useState(false)
  const [, { hideCartBottomSheet }] = useCartBottomSheet();

  const cartProps = {
    navigation,
    cart,
    onNavigationRedirect: props.onNavigationRedirect,
    isCartsLoading,
    setIsCartsLoading,
    clearInactivityTimeout,
    resetInactivityTimeout,
  }

  useEffect(() => {
    if (!cart && showNotFound) {
      navigation?.canGoBack()
        ? navigation.goBack()
        : props.onNavigationRedirect && props.onNavigationRedirect('Business')
      hideCartBottomSheet()
    }
  }, [cart])

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
  clearInactivityTimeout: any,
  resetInactivityTimeout: any,
}
