import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';

import { Title } from './styles';
import { Cart } from '../Cart';
import { NotFoundSource } from '../NotFoundSource';
import { OText } from '../shared';

export const CartContent = (props: any) => {
  const { carts } = props

  const { height } = useWindowDimensions()
  const theme = useTheme();
  const [, t] = useLanguage()
  const [isCartsLoading, setIsCartsLoading] = useState(false)

  return (
    carts?.length > 0 ? (
      <>
        <Title>
          <OText size={20} style={{ marginTop: 20 }}>
            {carts.length > 1 ? t('MY_CARTS', 'My Carts') : t('CART', 'Cart')}
          </OText>
        </Title>
        {carts.map((cart: any, i: number) => (
          <View key={cart.uuid} style={{ overflow: 'visible' }}>
            {cart.products.length > 0 && (
              <>
                <Cart
                  cart={cart}
                  isCartList
                  onNavigationRedirect={props.onNavigationRedirect}
                  isCartsLoading={isCartsLoading}
                  setIsCartsLoading={setIsCartsLoading}
                />
                {!(i === (carts.length - 1)) && (
                  <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginVertical: 20 }} />
                )}
              </>
            )}
          </View>
        ))}
        <Spinner visible={isCartsLoading} />
      </>
    ) : (
      <>
        <Title>
          <OText size={20}>
            {t('MY_CARTS', 'My Carts')}
          </OText>
        </Title>
        <View style={{ height: height * 0.7, justifyContent: 'center' }}>
          <NotFoundSource
            content={t('NO_CARTS_FOUND', 'Sorry, no carts found')}
            image={theme.images.general.notFound}
          />
        </View>
      </>
    )
  )
}
