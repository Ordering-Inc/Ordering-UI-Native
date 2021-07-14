import React from 'react';
import { View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native';

import {
  ADContainer,
  ADHeader,
  ADAddress,
  ADMap
} from './styles';

import { OText, OIcon } from '../shared';

const AddressDetailsUI = (props: any) => {
  const {
    navigation,
    theme,
    addressToShow,
    isCartPending,
    googleMapsUrl,
    apiKey
  } = props;

  const [orderState] = useOrder();

  return (
    <ADContainer>
      <ADHeader>
        <ADAddress>
          <OText
            size={20}
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{ width: '85%' }}
          >
            {addressToShow || orderState?.options?.address?.address}
          </OText>
          <View>
            {orderState?.options?.type === 1 && !isCartPending &&
              <MaterialIcon
                name='pencil-outline'
                size={28}
                color={theme.colors.editColor}
                style={{ marginBottom: 5, marginLeft: 5 }}
                onPress={() => navigation.navigate('AddressList', { isFromCheckout: true })}
              />
            }
          </View>
        </ADAddress>
      </ADHeader>
      {!!apiKey && googleMapsUrl && (
        <ADMap>
          <OIcon
            colors={theme.colors}
            url={googleMapsUrl}
            style={{borderRadius: 15, width: '100%'}}
            height={162}
          />
        </ADMap>
      )}
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
