import React from 'react';
import { useLanguage } from 'ordering-components/native'
import { View, Pressable } from 'react-native'
import { useTheme } from 'styled-components/native'
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native'

import {
  ADContainer,
  ADAddress,
  ADMap
} from './styles'

import { OText, OIcon } from '../shared';

const AddressDetailsUI = (props: any) => {
  const {
    navigation,
    addressToShow,
    isCartPending,
    googleMapsUrl,
    apiKey
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()

  return (
    <ADContainer>
      {!!apiKey && googleMapsUrl && (
        <ADMap>
          <OIcon
            cover
            url={googleMapsUrl}
            style={{ width: '100%' }}
            height={160}
          />
        </ADMap>
      )}
      <ADAddress>
        <OText
          size={16}
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{ textAlign: 'left' }}
        >
          {addressToShow || orderState?.options?.address?.address}
        </OText>
        <View style={{ paddingTop: 10, paddingBottom: 20 }}>
          {orderState?.options?.type === 1 && !isCartPending &&
            <Pressable onPress={() => navigation.navigate('AddressList', { isFromCheckout: true })}>
              <OText color={theme.colors.green} style={{ textAlign: 'left' }}>
                {t('CHANGE', 'Change')}
              </OText>
            </Pressable>
          }
        </View>
      </ADAddress>
    </ADContainer>
  )
}

export const AddressDetails = (props: any) => {
  const addressDetailsProps = {
    ...props,
    UIComponent: AddressDetailsUI
  }
  return (
    <AddressDetailsController {...addressDetailsProps} />
  )
}
